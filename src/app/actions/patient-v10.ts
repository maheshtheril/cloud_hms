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
    const firstName = (formData.get("first_name") as string)?.trim();
    const lastName = (formData.get("last_name") as string)?.trim();
    const dob = formData.get('dob') as string;
    const gender = formData.get('gender') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;

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

        console.log(`[V10 DIAGNOSTIC] User: ${userId} | Co: ${companyId} | Ten: ${tenantId}`);

        // 1. Dynamic Expiry Calculation
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

        // 2. Metadata Handling
        const existingPatient = finalPatientId ? await prisma.hms_patient.findUnique({ where: { id: finalPatientId } }) : null;
        const currentMeta = (existingPatient?.metadata as any) || {};

        let metadata: any = {
            ...currentMeta,
            title: formData.get("title") as string,
            last_updated: new Date().toISOString()
        }

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

        let invoiceId = null;
        let invoice = null;
        let warning = null;

        // 4. Invoice Logic (RAW SQL ONLY)
        if (!skipInvoice && companyId) {
            try {
                // Find Registration Fee Product
                let feeProduct = null;
                if (configProductId) {
                    feeProduct = await prisma.hms_product.findUnique({ where: { id: configProductId } });
                }
                if (!feeProduct) {
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

                if (feeProduct) {
                    const amount = Number(feeProduct.price) || configFee || 0;
                    invoiceId = crypto.randomUUID();
                    const lineId = crypto.randomUUID();
                    const now = new Date();
                    const invNumber = `INV-${Date.now()}`;

                    console.log(`[V10 RAW SQL] Inserting Invoice: ${invoiceId}`);

                    // Bulletproof Raw SQL Insertion
                    await prisma.$executeRaw`
                        INSERT INTO hms_invoice (
                            id, tenant_id, company_id, patient_id, invoice_number, status, 
                            invoice_date, issued_at, currency, currency_rate, 
                            subtotal, total, total_tax, total_discount, total_paid, 
                            outstanding_amount, billing_metadata, created_by, created_at, updated_at
                        ) VALUES (
                            ${invoiceId}::uuid, ${tenantId}::uuid, ${companyId}::uuid, ${patient.id}::uuid, ${invNumber}, 'draft',
                            ${now}::date, ${now}, 'INR', 1.0, 
                            ${amount}, ${amount}, 0, 0, 0, 
                            ${amount}, '{}'::jsonb, ${userId}::uuid, now(), now()
                        )
                    `;

                    await prisma.$executeRaw`
                        INSERT INTO hms_invoice_lines (
                            id, tenant_id, company_id, invoice_id, product_id, 
                            description, quantity, unit_price, net_amount, 
                            discount_amount, tax_amount, line_idx, metadata, created_at
                        ) VALUES (
                            ${lineId}::uuid, ${tenantId}::uuid, ${companyId}::uuid, ${invoiceId}::uuid, ${feeProduct.id}::uuid,
                            ${feeProduct.description || "Registration Fee"}, 1, ${amount}, ${amount},
                            0, 0, 1, '{}'::jsonb, now()
                        )
                    `;

                    invoice = { id: invoiceId, invoice_number: invNumber, total: amount };
                } else {
                    warning = "Registration fee product not found.";
                }
            } catch (invErr: any) {
                console.error("RAW SQL FAILED:", invErr);
                warning = `Billing failed: ${invErr.message}`;
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
        console.error("V10 ERROR:", error);
        return { error: error.message || "Capture error." };
    }
}

export async function createPatientQuick(formData: FormData) {
    return createPatientV10(null, formData);
}
