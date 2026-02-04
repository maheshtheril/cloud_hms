'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import crypto from "crypto";

const normalizeGender = (gender: string | null) => {
    if (!gender) return null;
    const g = gender.toLowerCase().trim();
    if (g === 'm' || g === 'male') return 'male';
    if (g === 'f' || g === 'female') return 'female';
    if (g === 'other') return 'other';
    if (g === 'unknown') return 'unknown';
    return null;
}

export async function createPatientV10(patientId: string | null | any, formData: FormData) {
    console.log("V10 START: Patient Registration Processing", { patientId });

    // Handle patientId if it's an object (happens with some form actions)
    const finalPatientId = (patientId && typeof patientId === 'string') ? patientId : null;

    // Parse Basic Details
    const firstName = formData.get("first_name") as string
    const lastName = formData.get("last_name") as string
    const dob = formData.get('dob') as string
    const gender = formData.get('gender') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string

    // Parse Billing Mode - Check if registration charge is requested
    const chargeRegistration = formData.get('charge_registration') === 'on';
    const skipInvoice = !chargeRegistration;

    const address = {
        street: formData.get('street') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zip: formData.get('zip') as string,
        country: formData.get('country') as string
    }

    const session = await auth()
    const tenantId = session?.user?.tenantId
    let companyId = session?.user?.companyId
    const userId = session?.user?.id

    if (!tenantId) return { error: "No tenant found in session." };
    if (!firstName) return { error: "First name is required." };

    try {
        // 0. Fallback: Ensure Company ID exists
        if (!companyId) {
            const defaultCompany = await prisma.company.findFirst({
                where: { tenant_id: tenantId, enabled: true },
                select: { id: true }
            });
            companyId = defaultCompany?.id;
        }

        // 1. Dynamic Expiry Calculation (Branch-Aware)
        let validityDays = 365;
        let configProductId = null;
        let configFee = 0;

        try {
            const hmsConfigRecord = await prisma.hms_settings.findFirst({
                where: {
                    tenant_id: tenantId,
                    company_id: companyId || undefined,
                    key: 'registration_config'
                }
            });
            if (hmsConfigRecord) {
                const config = hmsConfigRecord.value as any;
                validityDays = parseInt(config.validity) || 365;
                configProductId = config.productId || null;
                configFee = parseFloat(config.fee) || 0;
            }
        } catch (e) {
            console.error("Failed to fetch HMS config in Patient V10:", e);
        }

        const registrationDate = new Date();
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + validityDays);

        // 2. Metadata Handling (Merge Strategy)
        const existingPatient = finalPatientId ? await prisma.hms_patient.findUnique({ where: { id: finalPatientId } }) : null;
        const currentMeta = (existingPatient?.metadata as any) || {};

        let metadata: any = {
            ...currentMeta,
            title: formData.get("title") as string,
            last_updated: new Date().toISOString()
        }

        // ONLY update registration dates if we are actually charging/renewing
        if (chargeRegistration) {
            metadata.registration_date = registrationDate.toISOString();
            metadata.registration_expiry = expiryDate.toISOString();
            metadata.registration_notes = finalPatientId ? "Renewal" : "Initial Registration";
        }

        // 3. Database Upsert
        let patient;
        const upsertData = {
            first_name: firstName,
            last_name: lastName || '',
            gender: normalizeGender(gender),
            dob: dob ? new Date(dob) : null,
            contact: {
                phone,
                email,
                address
            } as any,
            metadata: metadata as any,
            updated_at: new Date()
        };

        if (finalPatientId) {
            patient = await prisma.hms_patient.update({
                where: { id: finalPatientId },
                data: upsertData
            });
        } else {
            patient = await prisma.hms_patient.create({
                data: {
                    ...upsertData,
                    id: crypto.randomUUID(),
                    tenant_id: tenantId,
                    company_id: companyId || undefined,
                    patient_number: `PAT-${Date.now()}`,
                    created_at: new Date()
                }
            });
        }

        console.log("Patient Processed:", patient.id);

        let invoiceId = null;
        let invoice = null;
        let warning = null;

        // 4. Invoice Logic
        if (!skipInvoice && companyId) {
            try {
                // Find Registration Fee Product (Extreme Resilience)
                let feeProduct = null;

                if (configProductId && typeof configProductId === 'string' && configProductId.length > 30) {
                    console.log(`[V10 INVOICE DEBUG] Searching by specific ID: ${configProductId}`);
                    feeProduct = await prisma.hms_product.findUnique({
                        where: { id: configProductId }
                    });
                }

                if (!feeProduct) {
                    console.log(`[V10 INVOICE DEBUG] Specific ID failed, falling back to SKU search...`);
                    // Fallback 1: Company + SKU
                    feeProduct = await prisma.hms_product.findFirst({
                        where: {
                            tenant_id: tenantId,
                            company_id: companyId || undefined,
                            OR: [
                                { sku: { startsWith: 'REG-FEE' } },
                                { name: { contains: 'Registration Fee', mode: 'insensitive' } }
                            ],
                            is_active: true
                        },
                        orderBy: { created_at: 'desc' }
                    });
                }

                if (!feeProduct) {
                    console.log(`[V10 INVOICE DEBUG] Company SKU failed, falling back to Tenant-Wide search...`);
                    // Fallback 2: Tenant wide lookup (in case product was cross-linked)
                    feeProduct = await prisma.hms_product.findFirst({
                        where: {
                            tenant_id: tenantId,
                            OR: [
                                { sku: { startsWith: 'REG-FEE' } },
                                { sku: 'REG-FEE' },
                                { name: { contains: 'Registration', mode: 'insensitive' } }
                            ],
                            is_active: true
                        },
                        orderBy: { created_at: 'desc' }
                    });
                }

                if (feeProduct) {
                    const amount = Number(feeProduct.price) || configFee || 0;

                    invoice = await prisma.hms_invoice.create({
                        data: {
                            tenant_id: tenantId,
                            company_id: companyId,
                            patient_id: patient.id,
                            invoice_number: `INV-${Date.now()}`,
                            status: 'draft',
                            invoice_date: new Date(),
                            subtotal: amount,
                            total: amount,
                            created_by: userId,
                            hms_invoice_lines: {
                                create: [{
                                    tenant_id: tenantId,
                                    company_id: companyId,
                                    product_id: feeProduct.id,
                                    description: feeProduct.description || "Registration Fee",
                                    quantity: 1,
                                    unit_price: amount,
                                    net_amount: amount,
                                    line_idx: 1
                                }]
                            }
                        }
                    });

                    invoiceId = invoice.id;
                } else {
                    warning = "Registration fee product not found. Bill manually.";
                }
            } catch (invErr: any) {
                console.error("Auto-Billing Failed:", invErr);
                warning = `Patient saved, but billing failed: ${invErr.message}`;
            }
        }

        return {
            success: true,
            data: patient,
            id: patient.id,
            invoiceId: invoiceId,
            invoice: invoice,
            warning: warning
        };

    } catch (error: any) {
        console.error("V10 EXECUTION ERROR:", error);
        return { error: error.message || "A system error occurred." };
    }
}

export async function createPatientQuick(formData: FormData) {
    return createPatientV10(null, formData);
}
