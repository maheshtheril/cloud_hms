'use server'

import { prisma } from "@/lib/prisma"
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

export async function createPatientV10(existingId: string | null | any, formData: FormData) {
    console.log("V10 START: Patient Registration with Invoice Standard");

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

    console.log("Registration Details:", { firstName, lastName, phone, chargeRegistration, skipInvoice });


    // Parse Contact
    const address = {
        street: formData.get('street'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip'),
        country: formData.get('country')
    }

    const contact = {
        address,
        phone,
        email
    }

    // Metadata
    let metadata: any = {
        title: formData.get("title") as string,
        registration_notes: "V10 Registration"
    }

    const session = await auth()
    const tenantId = session?.user?.tenantId
    let companyId = session?.user?.companyId
    const userId = session?.user?.id

    console.log("V10 EXECUTE:", { tenantId, companyId, userId, firstName, lastName, phone });

    if (!tenantId) {
        console.error("V10 ERROR: No Tenant ID in session");
        return { error: "No tenant found." };
    }
    if (!firstName) return { error: "Name is required" }

    // Fallback: Ensure Company ID exists
    if (!companyId) {
        console.log("V10: No Company ID in session, searching fallback...");
        const defaultCompany = await prisma.company.findFirst({
            where: { tenant_id: tenantId, enabled: true },
            select: { id: true }
        });
        if (defaultCompany) {
            companyId = defaultCompany.id;
            console.log("V10: Fallback Company Found:", companyId);
        } else {
            console.warn("V10: No enabled company found for tenant", tenantId);
        }
    }

    try {
        // 1. Create Patient
        const patient = await prisma.hms_patient.create({
            data: {
                id: crypto.randomUUID(),
                tenant_id: tenantId,
                company_id: companyId || null, // Use null if no company found, do not force tenantId
                first_name: firstName,
                last_name: lastName || '',
                dob: dob ? new Date(dob) : null,
                gender: normalizeGender(gender),
                contact: contact as any,
                patient_number: `PAT-${Date.now()}`,
                created_by: userId,
                updated_by: userId,
                metadata: metadata as any
            }
        });

        console.log("Patient Created:", patient.id);

        let invoiceId = null;
        let invoice = null;
        let warning = null;

        // 2. Invoice Logic (Only if not skipped AND companyId exists)
        if (!skipInvoice) {
            if (companyId) {
                try {
                    // Lookup Service Product (Check Standard Seed 'REG001' OR Repair Script 'REG-FEE')
                    const feeProduct = await prisma.hms_product.findFirst({
                        where: {
                            tenant_id: tenantId,
                            sku: { in: ['REG001', 'REG-FEE'] }
                        },
                        orderBy: { created_at: 'desc' } // Prefer newest if both exist
                    });

                    if (feeProduct) {
                        console.log("Found Fee Product:", feeProduct.sku);

                        const amount = Number(feeProduct.price) || 100;

                        // Create Invoice with Standard Relations
                        invoice = await prisma.hms_invoice.create({
                            data: {
                                tenant_id: tenantId,
                                company_id: companyId, // Safe as we checked it
                                patient_id: patient.id,
                                invoice_number: `INV-${Date.now()}`,
                                status: 'draft',
                                invoice_date: new Date(),
                                subtotal: amount,
                                total_tax: 0,
                                total_discount: 0, // Explicitly set
                                total_paid: 0,     // Explicitly set
                                total: amount,
                                locked: false,
                                created_by: userId,
                                // Populate line_items (JSON Header) for redundancy
                                line_items: [{
                                    product_id: feeProduct.id,
                                    description: feeProduct.description || "Registration Fee",
                                    quantity: 1,
                                    unit_price: amount,
                                    total: amount
                                }],
                                // Populate hms_invoice_lines (Relational Table) - World Standard
                                hms_invoice_lines: {
                                    create: [{
                                        tenant_id: tenantId,
                                        company_id: companyId,
                                        product_id: feeProduct.id, // Linked to Inventory
                                        description: feeProduct.description || "Registration Fee",
                                        quantity: 1,
                                        line_idx: 1,
                                        unit_price: amount,
                                        discount_amount: 0,
                                        tax_amount: 0,
                                        net_amount: amount
                                    }]
                                }
                            }
                        });

                        invoiceId = invoice.id;
                        console.log("Invoice Created (Standard):", invoice.id);
                    } else {
                        console.warn("Skipping Invoice: 'REG-FEE' Product not found. Run setup script.");
                        warning = "Invoice Skipped: Product 'REG-FEE' not found.";
                    }

                } catch (invErr: any) {
                    console.error("Invoice Creation Failed (V10):", invErr);
                    warning = `Patient saved, but Invoice failed (Details: ${invErr.message}). Please bill manually.`;
                    // We Swallow the error to ensure Patient Registration is returned as Success
                }
            } else {
                warning = "Billing Skipped: No Active Company found to issue invoice.";
            }
        }

        return {
            success: true,
            data: patient,
            id: patient.id, // For legacy compatibility
            invoiceId: invoiceId,
            invoice: (invoiceId && typeof invoice !== 'undefined') ? invoice : null, // Return full invoice object if created
            warning
        };

    } catch (error: any) {
        console.error('V10 creation error:', error)
        // Return a cleaner error message but log the full error
        return { error: error.message || "Failed to create patient" }
    }
}

export async function createPatientQuick(formData: FormData) {
    return createPatientV10(null, formData);
}
