'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

const normalizeGender = (gender: string | null) => {
    if (!gender) return null;
    const g = gender.toLowerCase().trim();
    if (g === 'm' || g === 'male') return 'male';
    if (g === 'f' || g === 'female') return 'female';
    if (g === 'other') return 'other';
    if (g === 'unknown') return 'unknown';
    return null;
}

export async function createPatient(existingId: string | null | any, formData: FormData) {
    const firstName = formData.get("first_name") as string
    const lastName = formData.get("last_name") as string
    const nextAction = formData.get("next_action") as string // Get the next action
    // TODO: Get Tenant ID from session
    // For now, we will fetch the first tenant casually or fail if none
    const dob = formData.get('dob') as string
    const gender = formData.get('gender') as string
    const blood_group = formData.get('blood_group') as string

    // Parse Contact Details
    const address = {
        street: formData.get('street'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip'),
        country: formData.get('country')
    }

    const emergency_contact = {
        name: formData.get('emergency_name'),
        relation: formData.get('emergency_relation'),
        phone: formData.get('emergency_phone')
    }

    const insurance = {
        provider: formData.get('insurance_provider'),
        policy_no: formData.get('insurance_policy_no'),
        valid_till: formData.get('insurance_valid_till')
    }

    // Construct JSON objects
    const contact = {
        address,
        emergency_contact,
        phone: formData.get('phone'),
        email: formData.get('email')
    }

    // Dynamic Expiry Calculation
    const { getHMSSettings } = await import('./settings');
    const hmsSettings = await getHMSSettings();
    const validity = (hmsSettings as any).settings?.registrationValidity || 365;
    const registrationDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + Number(validity));

    // Combine metadata (Merge if update, Create new if create)
    let metadata: any = {
        title: formData.get("title") as string,
        // blood_group moved to column
        // profile_image_url moved to column
        id_card_url: formData.get("id_card_url") as string,
        insurance,
        // Only set these on create or if forced?
        // Actually for updates we might want to preserve original reg dates unless we are renewing?
        // For now, assuming "Edit" updates these fields is okay,
        // BUT if we are just editing a typo, we shouldn't reset registration date.
        // Let's handle that in the update logic block.
    }

    // Get current user's tenant and company from session
    const session = await auth()
    const tenantId = session?.user?.tenantId
    const companyId = session?.user?.companyId
    const userId = session?.user?.id

    if (!tenantId) {
        return { error: "No tenant found. Please login again." }
    }

    if (!firstName) {
        return { error: "Name is required" }
    }

    try {
        let patient;
        // Check if we are updating or creating
        if (typeof existingId === 'string' && existingId.length > 5) { // Simple check for likely UUID
            // Fetch existing to preserve metadata that shouldn't change
            const currentPatient = await prisma.hms_patient.findUnique({ where: { id: existingId } });
            if (!currentPatient) return { error: "Patient not found for update" };

            const currentMeta = currentPatient.metadata as any || {};

            // Merge metadata:
            // RENEWAL LOGIC: If chargeRegistration is ON, we are renewing. Update dates.
            // Otherwise, preserve existing dates.
            const chargeRegistration = formData.get('charge_registration') === 'on';

            if (chargeRegistration) {
                // Renewal / First Time Charge on Update
                metadata.registration_date = registrationDate.toISOString();
                metadata.registration_expiry = expiryDate.toISOString();
            } else if (currentMeta.registration_date) {
                // Preserve existing valid registration
                metadata.registration_date = currentMeta.registration_date;
                metadata.registration_expiry = currentMeta.registration_expiry;
            } else {
                // Fallback for old records that never had a date (optional, maybe don't set if not charging?)
                // For data integrity, let's leave them null until they pay?
                // Or set them to created_at logic? Let's leave them alone to avoid free renewals.
            }

            patient = await prisma.hms_patient.update({
                where: { id: existingId },
                data: {
                    first_name: firstName,
                    last_name: lastName || '',
                    dob: dob ? new Date(dob) : null,
                    gender: normalizeGender(gender),
                    contact: contact as any,
                    // @ts-ignore
                    blood_group: blood_group || null,
                    profile_image_url: (formData.get("profile_image_url") as string) || null,
                    metadata: { ...currentMeta, ...metadata }, // deeply merge manually
                    updated_by: userId
                }
            });
        } else {
            // Create New
            metadata.registration_date = registrationDate.toISOString();
            metadata.registration_expiry = expiryDate.toISOString();

            patient = await prisma.hms_patient.create({
                data: {
                    id: crypto.randomUUID(),
                    tenant_id: tenantId,
                    company_id: (companyId || tenantId) as string,
                    first_name: firstName,
                    last_name: lastName || '',
                    dob: dob ? new Date(dob) : null,
                    gender: normalizeGender(gender),
                    contact: contact as any,
                    // @ts-ignore
                    blood_group: blood_group || null,
                    profile_image_url: (formData.get("profile_image_url") as string) || null,
                    metadata: metadata as any,
                    patient_number: `PAT-${Date.now()}`,
                    created_by: userId,
                    updated_by: userId
                }
            })
        }

        // WORLD-CLASS AUTOMATION: Auto-bill Registration Fee
        const chargeRegistration = formData.get('charge_registration') === 'on';
        if (chargeRegistration) {
            const waiveFee = formData.get('waive_fee') === 'on';
            const waiveReason = formData.get('waive_reason') as string;

            if (waiveFee) {
                // WAIVED LOGIC:
                // We already updated the registration dates (Metadata was prepared above).
                // We just need to log this waiver in metadata or just skip billing.
                // Let's explicitly save the waiver note to metadata for audit.
                const currentMeta = (patient.metadata as any) || {};
                await prisma.hms_patient.update({
                    where: { id: patient.id },
                    data: {
                        metadata: {
                            ...currentMeta,
                            waived_registration: {
                                date: new Date().toISOString(),
                                reason: waiveReason || 'Administrative Waiver',
                                by: userId
                            }
                        }
                    }
                });
                return patient; // Exit early, no invoice.
            }

            try {
                const fee = Number(formData.get('registration_fee')) || (hmsSettings as any).settings?.registrationFee || 100;
                const regProductId = formData.get('registration_product_id') as string;

                const { createInvoice } = await import('./billing'); // Dynamic import to safely handle circular refs if any

                // Determine Invoice Status based on Billing Mode (Default to Paid/Spot Pay)
                const billingMode = formData.get('billing_mode') as string;
                let invoiceStatus = 'posted'; // Default to 'posted' (Bill Later) so user sees payment options
                if (billingMode === 'paid') invoiceStatus = 'paid';
                else if (billingMode === 'hold') invoiceStatus = 'draft';

                console.log("Auto-creating registration invoice for patient:", patient.id);

                const lineItems = [{
                    product_id: regProductId || null,
                    description: "Patient Registration Fee",
                    quantity: 1,
                    unit_price: fee,
                    tax_amount: 0,
                    discount_amount: 0
                }];

                // ATTEMPT 1: Create with preferred status
                let invoiceRes = await createInvoice({
                    patient_id: patient.id,
                    date: new Date().toISOString(),
                    status: invoiceStatus,
                    line_items: lineItems
                });

                // ATTEMPT 2: Fallback to Draft on failure (Robustness)
                if (invoiceRes.error) {
                    console.warn(`Invoice creation failed as '${invoiceStatus}'. Retrying as 'draft'. Error:`, invoiceRes.error);
                    invoiceRes = await createInvoice({
                        patient_id: patient.id,
                        date: new Date().toISOString(),
                        status: 'draft',
                        line_items: lineItems
                    });
                }

                // ATTEMPT 3: Direct DB Create (Emergency Fallback)
                // If the billing service fails (e.g. number generation, locks), we FORCE a record so the user can take money.
                if (invoiceRes.error || !invoiceRes.success) {
                    console.error("Billing Service Failed. Attempting Direct DB Insertion (Fallback - RAW).");
                    try {
                        const invoiceId = crypto.randomUUID();
                        const fallbackInvoiceNo = `REG-${Date.now().toString().slice(-6)}`;
                        const safeCompanyId = (companyId || tenantId) as string;

                        // Header (Raw Insert to bypass ORM array issues)
                        await prisma.$executeRaw`
                            INSERT INTO "hms_invoice" (
                                "id", "tenant_id", "company_id", "patient_id", 
                                "invoice_number", "invoice_date", "status", 
                                "total", "subtotal", "total_tax", "total_discount", "total_paid", "outstanding_amount",
                                "line_items", "billing_metadata", "currency", "currency_rate"
                            ) VALUES (
                                ${invoiceId}::uuid, ${tenantId}::uuid, ${safeCompanyId}::uuid, ${patient.id}::uuid,
                                ${fallbackInvoiceNo}, ${new Date()}, 'draft', 
                                ${fee}, ${fee}, 0, 0, 0, ${fee},
                                ${JSON.stringify([{
                            description: "Registration Fee (Recovered)",
                            quantity: 1,
                            unit_price: fee,
                            net_amount: fee,
                            tax_amount: 0
                        }])}::jsonb,
                                '{}'::jsonb, 'INR', 1
                            )
                        `;

                        // Lines (Prisma)
                        await prisma.hms_invoice_lines.create({
                            data: {
                                tenant_id: tenantId,
                                company_id: safeCompanyId,
                                invoice_id: invoiceId,
                                line_idx: 1,
                                description: "Registration Fee (Recovered)",
                                quantity: 1,
                                unit_price: fee,
                                net_amount: fee,
                                tax_amount: 0
                            }
                        });

                        const fallbackInvoice = await prisma.hms_invoice.findUnique({ where: { id: invoiceId } });
                        invoiceRes = { success: true, data: fallbackInvoice };
                    } catch (dbErr: any) {
                        console.error("CRITICAL: Direct DB Invoice Creation Failed:", dbErr);
                        throw new Error("System Critical: Unable to generate invoice record. " + dbErr.message);
                    }
                }

                if (invoiceRes.success && invoiceRes.data?.id) {
                    return {
                        ...patient,
                        invoiceId: invoiceRes.data.id,
                        invoice: invoiceRes.data,
                        warning: (invoiceRes as any).warning
                    };
                } else {
                    throw new Error(invoiceRes.error || "Invoice creation failed");
                }

            } catch (billingError: any) {
                console.error("Failed to auto-bill registration:", billingError);
                return {
                    ...patient,
                    billingError: billingError.message || "Failed to create invoice"
                };
            }
        }

        return patient;

    } catch (error: any) {
        console.error('Patient creation error:', error)
        return { error: `Failed to create patient: ${error.message}` }
    }
}

export async function createPatientQuick(formData: FormData) {
    const firstName = formData.get("first_name") as string
    const lastName = formData.get("last_name") as string
    const dob = formData.get('dob') as string
    const gender = formData.get('gender') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string

    const session = await auth()
    const tenantId = session?.user?.tenantId
    const companyId = session?.user?.companyId
    const userId = session?.user?.id

    if (!tenantId) throw new Error("Authentication required")
    if (!firstName) throw new Error("Name is required")

    const contact = {
        phone,
        email,
        address: {
            street: formData.get('street'),
            city: formData.get('city'),
            zip: formData.get('zip'),
        }
    }

    try {
        const patient = await prisma.hms_patient.create({
            data: {
                tenant_id: tenantId,
                company_id: (companyId || tenantId) as string,
                first_name: firstName.trim(),
                last_name: (lastName || '').trim(),
                dob: dob ? new Date(dob) : null,
                gender: normalizeGender(gender),
                contact: contact as any,
                patient_number: `PAT-${Date.now()}`,
                created_by: userId,
                updated_by: userId
            }
        })
        return patient
    } catch (error: any) {
        console.error('Quick patient creation error:', error)
        throw new Error(error.message || "Failed to create patient record")
    }
}

