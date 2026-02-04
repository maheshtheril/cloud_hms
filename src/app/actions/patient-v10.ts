'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import crypto from "crypto";

/**
 * WORLD CLASS PATIENT REGISTRATION SERVICE
 * Handles Atomic Patient Creation + Optional Auto-Invoicing
 */

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
    const session = await auth();
    const tenantId = session?.user?.tenantId;
    let companyId = session?.user?.companyId;
    const userId = session?.user?.id;

    if (!tenantId || !userId) return { error: "Authentication session expired. Please login again." };

    // 1. Parse and Standardize Inputs
    const firstName = (formData.get("first_name") as string)?.trim();
    if (!firstName) return { error: "Patient first name is mandatory for clinical safety." };

    const lastName = (formData.get("last_name") as string)?.trim() || '';
    const dob = formData.get('dob') as string;
    const gender = formData.get('gender') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const chargeRegistration = formData.get('charge_registration') === 'on';

    const address = {
        street: formData.get('street') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zip: formData.get('zip') as string,
        country: formData.get('country') as string
    };

    // 2. Resolve Multi-Tenant Context
    if (!companyId) {
        const defaultCompany = await prisma.company.findFirst({
            where: { tenant_id: tenantId, enabled: true },
            select: { id: true }
        });
        companyId = defaultCompany?.id;
    }
    if (!companyId) return { error: "Terminal is not linked to an active medical facility." };

    console.log(`[HMS REG SERVICE] Initializing for Patient: ${firstName} | Facility: ${companyId}`);

    try {
        return await prisma.$transaction(async (tx) => {
            // A. Fetch HMS Configuration
            let validityDays = 365;
            let configProductId = null;
            let configFee = 0;

            const hmsConfigRecord = await tx.hms_settings.findFirst({
                where: { tenant_id: tenantId, company_id: companyId, key: 'registration_config' }
            });
            if (hmsConfigRecord) {
                const config = hmsConfigRecord.value as any;
                validityDays = parseInt(config.validity) || 365;
                configProductId = config.productId || null;
                configFee = parseFloat(config.fee) || 0;
            }

            // B. Prepare Identity Records
            const finalPatientId = (patientId && typeof patientId === 'string') ? patientId : crypto.randomUUID();
            const registrationDate = new Date();
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + validityDays);

            const metadata: any = {
                title: formData.get("title") as string,
                last_updated: new Date().toISOString()
            };

            if (chargeRegistration) {
                metadata.registration_date = registrationDate.toISOString();
                metadata.registration_expiry = expiryDate.toISOString();
                metadata.registration_notes = patientId ? "Account Renewal" : "New Patient Intake";
            }

            const upsertData = {
                first_name: firstName,
                last_name: lastName,
                gender: normalizeGender(gender),
                dob: dob ? new Date(dob) : null,
                contact: { phone, email, address } as any,
                metadata: metadata as any,
                updated_at: new Date(),
                updated_by: userId
            };

            // C. Save Patient (Clinical Core)
            // Note: We use executeRaw for the Patient as well if we suspect schema drift, 
            // but Patient seems stable. Let's use Prisma for the Patient to keep it clean.
            let patient;
            const isUpdate = (patientId && typeof patientId === 'string');

            if (isUpdate) {
                patient = await tx.hms_patient.update({
                    where: { id: patientId as string },
                    data: upsertData
                });
            } else {
                patient = await tx.hms_patient.create({
                    data: {
                        ...upsertData,
                        id: finalPatientId,
                        tenant_id: tenantId,
                        company_id: companyId,
                        patient_number: `PAT-${Date.now().toString().slice(-8)}`,
                        created_at: new Date(),
                        created_by: userId,
                        status: 'active'
                    }
                });
            }

            let invoice = null;

            // D. Generate Financial Record (World Class Integrity)
            if (chargeRegistration) {
                // Determine Product
                let feeProduct = null;
                if (configProductId) {
                    feeProduct = await tx.hms_product.findUnique({ where: { id: configProductId } });
                }
                if (!feeProduct) {
                    feeProduct = await tx.hms_product.findFirst({
                        where: {
                            tenant_id: tenantId,
                            company_id: companyId,
                            OR: [
                                { sku: { startsWith: 'REG-FEE' } },
                                { name: { contains: 'Registration Fee', mode: 'insensitive' } }
                            ],
                            is_active: true
                        }
                    });
                }

                if (!feeProduct) {
                    throw new Error("Financial Configuration Missing: 'Registration Fee' product not found in inventory.");
                }

                const amount = Number(feeProduct.price) || configFee || 0;
                const invoiceId = crypto.randomUUID();
                const invNumber = `INV-REG-${Date.now().toString().slice(-6)}`;

                console.log(`[HMS REG SERVICE] Posting Revenue: ${invNumber} Amount: ${amount}`);

                // ULTIMATE RAW SQL OVERRIDE (Explicitly filling every column that could be NULL)
                // This bypasses any Prisma Null Constraint checks and forces the DB to accept.
                await tx.$executeRaw`
                    INSERT INTO hms_invoice (
                        id, tenant_id, company_id, patient_id, invoice_number, status, 
                        invoice_date, issued_at, currency, currency_rate, 
                        subtotal, total, total_tax, total_discount, total_paid, 
                        outstanding_amount, billing_metadata, created_by, created_at, updated_at,
                        line_items, locked
                    ) VALUES (
                        ${invoiceId}::uuid, ${tenantId}::uuid, ${companyId}::uuid, ${patient.id}::uuid, ${invNumber}, 'draft',
                        ${registrationDate}::date, ${registrationDate}, 'INR', 1.0, 
                        ${amount}, ${amount}, 0, 0, 0, 
                        ${amount}, '{}'::jsonb, ${userId}::uuid, now(), now(),
                        '[]'::jsonb[], false
                    )
                `;

                const lineId = crypto.randomUUID();
                await tx.$executeRaw`
                    INSERT INTO hms_invoice_lines (
                        id, tenant_id, company_id, invoice_id, product_id, 
                        description, quantity, unit_price, net_amount, 
                        discount_amount, tax_amount, line_idx, metadata, created_at
                    ) VALUES (
                        ${lineId}::uuid, ${tenantId}::uuid, ${companyId}::uuid, ${invoiceId}::uuid, ${feeProduct.id}::uuid,
                        ${feeProduct.description || "Patient Registration Service"}, 1, ${amount}, ${amount},
                        0, 0, 1, '{}'::jsonb, now()
                    )
                `;

                invoice = { id: invoiceId, invoice_number: invNumber, total: amount };
            }

            return {
                success: true,
                data: patient,
                id: patient.id,
                invoice: invoice
            };
        });
    } catch (error: any) {
        console.error("CRITICAL REGISTRATION FAILURE:", error);

        // World Class Error Reporting
        let terminalError = error.message;
        if (terminalError.includes("Null constraint violation")) {
            terminalError = "Database Integrity Violation: A required billing field is missing in the system schema. Please contact technical support.";
        } else if (terminalError.includes("foreign key constraint")) {
            terminalError = "Configuration Error: Linked product or location no longer exists.";
        }

        return { error: terminalError };
    }
}

export async function createPatientQuick(formData: FormData) {
    return createPatientV10(null, formData);
}
