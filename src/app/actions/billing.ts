'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { AccountingService } from "@/lib/services/accounting"
import { NotificationService } from "@/lib/services/notification";

export async function getBillableItems() {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId) return { error: "Unauthorized" };

    try {
        const items = await prisma.hms_product.findMany({
            where: {
                tenant_id: session.user.tenantId,
                company_id: companyId,
                is_active: true
                // Removed is_service filter - show all products (pharmacy + services)
            },
            select: {
                id: true,
                sku: true,
                name: true,
                description: true,
                uom: true,
                price: true, // Fetch base price
                metadata: true, // Include metadata for purchase_tax_rate
                // We'll need to join with price history to get current price
                hms_product_price_history: {
                    orderBy: { valid_from: 'desc' },
                    take: 1,
                    select: { price: true }
                },
                hms_product_category_rel: {
                    include: {
                        hms_product_category: {
                            include: {
                                tax_rates: true
                            }
                        }
                    }
                }
            }
        });

        // Flatten price for easier consumption
        const flatItems = items.map(item => {
            const priceHistory = item.hms_product_price_history?.[0];
            const categoryRel = item.hms_product_category_rel?.[0];
            const category = categoryRel?.hms_product_category;
            const taxRate = category?.tax_rates;

            // Extract UOM pricing data from metadata
            const metadata = item.metadata as any || {};
            const uomData = metadata.uom_data || {};

            return {
                id: item.id,
                sku: item.sku || '',
                label: item.name, // UI friendly
                description: item.description || '',
                uom: item.uom || 'Unit',
                price: priceHistory?.price?.toNumber() || Number(item.price) || 0,
                metadata: {
                    ...metadata,
                    // UOM Pricing (Industry Standard)
                    baseUom: uomData.base_uom || 'PCS',
                    basePrice: uomData.base_price || Number(item.price) || 0,
                    conversionFactor: uomData.conversion_factor || 1,
                    packUom: uomData.pack_uom || (uomData.conversion_factor > 1 ? `PACK-${uomData.conversion_factor}` : 'PCS'),
                    packPrice: uomData.pack_price || (Number(item.price) * (uomData.conversion_factor || 1)),
                    packSize: uomData.pack_size || uomData.conversion_factor || 1
                },
                // Extract category tax for auto-suggest
                categoryTaxId: category?.default_tax_rate_id || null,
                categoryTaxRate: taxRate?.rate ? taxRate.rate.toNumber() : 0
            };
        });

        return { success: true, data: flatItems };
    } catch (error) {
        console.error("Failed to fetch billable items:", error);
        return { error: "Failed to fetch items" };
    }
}

export async function getTaxConfiguration() {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId) return { error: "Unauthorized" };

    try {
        // 1. Fetch Company Tax Maps
        const taxMaps = await prisma.company_tax_maps.findMany({
            where: {
                company_id: companyId,
                is_active: true
            },
            include: {
                tax_rates: true
            }
        });

        // 2. Identify Default and Active Rates
        const defaultMap = taxMaps.find(m => m.is_default);

        // Map to simpler structure
        const taxRates = taxMaps.map(m => ({
            id: m.tax_rate_id,
            name: m.tax_rates.name,
            rate: m.tax_rates.rate.toNumber(),
            isDefault: m.is_default
        }));

        return {
            success: true,
            data: {
                defaultTax: defaultMap ? {
                    id: defaultMap.tax_rate_id,
                    name: defaultMap.tax_rates.name,
                    rate: defaultMap.tax_rates.rate.toNumber()
                } : null,
                taxRates
            }
        };

    } catch (error) {
        console.error("Failed to fetch tax configuration:", error);
        return { error: "Failed to fetch taxes" };
    }
}

export async function createInvoice(data: any) {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId) return { error: "Unauthorized" };

    const { patient_id, appointment_id, date, line_items, payments, status = 'draft', total_discount = 0, billing_metadata = {} } = data;

    if (!line_items || line_items.length === 0) {
        return { error: "At least one line item is required" };
    }

    try {
        // Generate world-standard sequential invoice number: INV-{FY}-{SEQ}
        // India FY: Apr 1 - Mar 31

        // Fetch custom prefix
        const settings = await prisma.company_settings.findUnique({
            where: { company_id: companyId },
            select: { numbering_prefix: true }
        });
        const customPrefix = settings?.numbering_prefix || 'INV';

        const invDate = new Date(date);
        const month = invDate.getMonth(); // 0-based
        const year = invDate.getFullYear();

        let fyStart = year;
        let fyEnd = year + 1;
        if (month < 3) { // Jan, Feb, Mar belong to previous FY start
            fyStart = year - 1;
            fyEnd = year;
        }
        const fyString = `${fyStart.toString().slice(-2)}-${fyEnd.toString().slice(-2)}`;
        const prefix = `${customPrefix}-${fyString}-`;

        // Find last invoice in this series
        // Note: String sorting works for sequence ONLY if padded length is consistent.
        // We use created_at desc as proxy for latest, which is generally safe for sequential creation.
        const lastInvoice = await prisma.hms_invoice.findFirst({
            where: {
                company_id: companyId,
                invoice_number: { startsWith: prefix }
            },
            orderBy: { created_at: 'desc' },
            select: { invoice_number: true }
        });

        let nextSeq = 1;
        if (lastInvoice?.invoice_number) {
            const parts = lastInvoice.invoice_number.split('-');
            const lastSeqStr = parts[parts.length - 1];
            const lastSeq = parseInt(lastSeqStr);
            if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
        }

        const invoiceNo = `${prefix}${nextSeq.toString().padStart(5, '0')}`;

        // Calculate totals
        // Subtotal (Sum of [Qty * Price - Discount])
        const subtotal = line_items.reduce((sum: number, item: any) => {
            const qty = Number(item.quantity) || 0;
            const price = Number(item.unit_price) || 0;
            const discount = Number(item.discount_amount) || 0;
            const lineTotal = (qty * price) - discount;
            return sum + lineTotal;
        }, 0);

        // Tax Total (Sum of line item taxes)
        const totalTaxAmount = line_items.reduce((sum: number, item: any) => sum + (Number(item.tax_amount || 0)), 0);

        // Grand Total: Subtotal + Tax - Global Discount
        const total = Math.max(0, subtotal + totalTaxAmount - Number(total_discount || 0));
        console.log(`[Billing] (${new Date().toISOString()}) Calculated total: ${total}, Subtotal: ${subtotal}, Tax: ${totalTaxAmount}`);

        // Calculate Payment Totals
        const paymentList = payments || [];
        const totalPaid = paymentList.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);

        // Determine Outstanding
        // If status is "paid", outstanding should be 0 (forcefully)
        // If status is "posted", likely outstanding is Total - Paid
        const outstandingAmount = (status === 'paid') ? 0 : Math.max(0, total - totalPaid);

        // ... (triggers check) ...

        const invoicePayload = {
            tenant_id: session.user.tenantId!,
            company_id: companyId,
            patient_id: (patient_id as string) || null,
            appointment_id: (appointment_id as string) || null,
            invoice_number: invoiceNo,
            invoice_date: new Date(date),
            currency: 'INR',
            status: status as any,
            total: total,
            subtotal: subtotal,
            total_tax: totalTaxAmount,
            total_discount: Number(total_discount),
            total_paid: totalPaid,
            outstanding_amount: outstandingAmount,
            billing_metadata: billing_metadata,
            hms_invoice_lines: {
                create: line_items.map((item: any, index: number) => ({
                    tenant_id: session.user.tenantId,
                    company_id: companyId,
                    line_idx: index + 1,
                    product_id: item.product_id || null, // Convert empty string to null
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    net_amount: (item.quantity * item.unit_price) - (item.discount_amount || 0),
                    // Tax details
                    tax_rate_id: item.tax_rate_id || null, // Convert empty string to null
                    tax_amount: item.tax_amount || 0,
                    discount_amount: item.discount_amount || 0
                }))
            },
            hms_invoice_payments: {
                create: paymentList.map((p: any) => ({
                    tenant_id: session.user.tenantId,
                    company_id: companyId,
                    amount: Number(p.amount),
                    method: p.method, // 'cash', 'card', 'upi'
                    payment_reference: p.reference || null,
                    paid_at: new Date()
                }))
            }
        };

        const result = await prisma.$transaction(async (tx) => {
            const newInvoice = await tx.hms_invoice.create({
                data: invoicePayload as any
            });

            // If status is paid and appointment is linked, mark appointment as completed
            if (status === 'paid' && appointment_id) {
                await tx.hms_appointments.update({
                    where: { id: appointment_id },
                    data: { status: 'completed' }
                });
            }

            // FORCE UPDATE TOTAL: Ensure DB triggers didn't override the total to 0
            await tx.hms_invoice.update({
                where: { id: newInvoice.id },
                data: {
                    total: total,
                    subtotal: subtotal,
                    total_tax: totalTaxAmount,
                    outstanding_amount: outstandingAmount
                }
            });

            return newInvoice;
        });

        if ((result.status === 'posted' || result.status === 'paid') && result.id) {
            // 1. Accounting Post
            const accountingRes = await AccountingService.postSalesInvoice(result.id, session.user.id);
            if (!accountingRes.success) {
                console.warn("Accounting Post Failed:", accountingRes.error);
            }

            // 2. Send WhatsApp Notification (Fire and Forget)
            NotificationService.sendInvoiceWhatsapp(result.id, session.user.tenantId!).catch(err => {
                console.error("Background WhatsApp Send Failed:", err);
            });
        }

        revalidatePath('/hms/billing');
        return { success: true, data: result };

    } catch (error: any) {
        console.error("Failed to create invoice:", error);
        let triggersInfo = '';
        try {
            const triggers = await prisma.$queryRaw`SELECT trigger_name, event_manipulation, event_object_table FROM information_schema.triggers WHERE event_object_table IN ('hms_invoice', 'hms_invoice_lines')`;
            triggersInfo = JSON.stringify(triggers);
        } catch (e) { triggersInfo = 'Check failed'; }

        return { error: `Failed to create invoice: ${error.message}. DB Triggers: ${triggersInfo}` }
    }
}

export async function updateInvoice(invoiceId: string, data: any) {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId) return { error: "Unauthorized" };

    const { patient_id, appointment_id, date, line_items, status = 'draft', total_discount = 0, payments = [], billing_metadata = {} } = data;

    if (!line_items || line_items.length === 0) {
        return { error: "At least one line item is required" };
    }

    try {
        // Calculate totals
        // Subtotal (Sum of [Qty * Price - Discount])
        const subtotal = line_items.reduce((sum: number, item: any) => {
            const qty = Number(item.quantity) || 0;
            const price = Number(item.unit_price) || 0;
            const discount = Number(item.discount_amount) || 0;
            const lineTotal = (qty * price) - discount;
            return sum + lineTotal;
        }, 0);

        // Tax Total (Sum of line item taxes)
        const totalTaxAmount = line_items.reduce((sum: number, item: any) => sum + (Number(item.tax_amount || 0)), 0);

        // Grand Total: Subtotal + Tax - Global Discount
        const total = Math.max(0, subtotal + totalTaxAmount - Number(total_discount || 0));

        // Calculate Payment Totals
        const paymentList = payments || [];
        const totalPaid = paymentList.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);

        // Determine Outstanding
        const outstandingAmount = (status === 'paid') ? 0 : Math.max(0, total - totalPaid);

        const result = await prisma.$transaction(async (tx) => {
            // 1. Update Invoice Header
            const updatedInvoice = await tx.hms_invoice.update({
                where: { id: invoiceId },
                data: {
                    patient_id: (patient_id as string) || null,
                    appointment_id: (appointment_id as string) || null,
                    invoice_date: new Date(date),
                    status: status as any,
                    total: total,
                    subtotal: subtotal,
                    total_tax: totalTaxAmount,
                    total_discount: Number(total_discount),
                    total_paid: totalPaid,
                    outstanding_amount: outstandingAmount,
                    billing_metadata: billing_metadata,
                }
            });

            // 2. Delete existing lines (Simple approach for MVP)
            await tx.hms_invoice_lines.deleteMany({
                where: { invoice_id: invoiceId }
            });

            // 3. Create new lines
            await tx.hms_invoice_lines.createMany({
                data: line_items.map((item: any, index: number) => ({
                    tenant_id: session.user.tenantId,
                    company_id: companyId,
                    invoice_id: invoiceId,
                    line_idx: index + 1,
                    product_id: item.product_id || null, // Convert empty string to null
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    net_amount: (item.quantity * item.unit_price) - (item.discount_amount || 0),
                    // Tax details
                    tax_rate_id: item.tax_rate_id || null, // Convert empty string to null
                    tax_amount: item.tax_amount || 0,
                    discount_amount: item.discount_amount || 0
                }))
            });

            // 4. Update Payments (Sync approach)
            await tx.hms_invoice_payments.deleteMany({
                where: { invoice_id: invoiceId }
            });

            if (paymentList.length > 0) {
                await tx.hms_invoice_payments.createMany({
                    data: paymentList.map((p: any) => ({
                        tenant_id: session.user.tenantId,
                        company_id: companyId,
                        invoice_id: invoiceId,
                        amount: Number(p.amount),
                        method: p.method,
                        payment_reference: p.reference || null,
                        paid_at: new Date()
                    }))
                });
            }

            // If status is paid and appointment is linked, mark appointment as completed
            if (status === 'paid' && appointment_id) {
                await tx.hms_appointments.update({
                    where: { id: appointment_id },
                    data: { status: 'completed' }
                });
            }

            // FORCE UPDATE TOTAL: Ensure DB triggers didn't override the total to 0
            // This happens if a trigger calculates total from lines before lines are fully visible/committed
            await tx.hms_invoice.update({
                where: { id: invoiceId },
                data: {
                    total: total,
                    subtotal: subtotal,
                    total_tax: totalTaxAmount,
                    outstanding_amount: (status === 'posted') ? total : 0
                }
            });

            // Note: Returning updatedInvoice here might not reflect the force update if fetched from 'update' result earlier.
            // But since we just updated it again, if we wanted the fresh object we'd need to fetch it.
            // For now, assuming the caller just needs the ID or basic success.
            // To be safe, let's return a constructed object or just the earlier reference (the amount might be wrong in the returned object but correct in DB).
            // Actually, let's just return the result of the LAST update.
            return { ...updatedInvoice, total, subtotal, total_tax: totalTaxAmount };
        });

        if ((result.status === 'posted' || result.status === 'paid') && result.id) {
            const accountingRes = await AccountingService.postSalesInvoice(result.id, session.user.id);
            if (!accountingRes.success) {
                console.warn("Accounting Post Failed:", accountingRes.error);
            }
        }

        revalidatePath('/hms/billing');
        revalidatePath(`/hms/billing/${invoiceId}`);
        return { success: true, data: result };

    } catch (error: any) {
        console.error("Failed to update invoice:", error);
        return { error: `Failed to update invoice: ${error.message}` };
    }
}

export async function updateInvoiceStatus(invoiceId: string, status: 'draft' | 'posted' | 'paid' | 'cancelled') {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId) return { error: "Unauthorized" };

    try {
        const invoice = await prisma.hms_invoice.findUnique({ where: { id: invoiceId } });
        if (!invoice) return { error: "Invoice not found" };

        const result = await prisma.$transaction(async (tx) => {
            const updated = await tx.hms_invoice.update({
                where: { id: invoiceId },
                data: {
                    status: status,
                    outstanding_amount: status === 'paid' ? 0 : (status === 'posted' ? invoice.total : invoice.outstanding_amount),
                    updated_at: new Date()
                }
            });

            // If paid, close appointment
            if (status === 'paid' && updated.appointment_id) {
                await tx.hms_appointments.update({
                    where: { id: updated.appointment_id },
                    data: { status: 'completed' }
                });
            }

            return updated;
        });

        // Trigger Accounting
        if (status === 'posted' || status === 'paid') {
            const accountingRes = await AccountingService.postSalesInvoice(invoiceId, session.user.id);
            if (!accountingRes.success) {
                console.warn("Accounting Post Failed:", accountingRes.error);
                return { success: true, warning: accountingRes.error };
            }
        }

        revalidatePath(`/hms/billing/${invoiceId}`);
        revalidatePath('/hms/billing');
        return { success: true };

    } catch (error: any) {
        console.error("Failed to update status:", error);
        return { error: `Failed to update status: ${error.message}` };
    }
}

export async function recordPayment(invoiceId: string, payment: { amount: number, method: string, reference?: string }, newStatus: 'paid' | 'posted' = 'paid') {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId) return { error: "Unauthorized" };

    try {
        const invoice = await prisma.hms_invoice.findUnique({
            where: { id: invoiceId },
            include: { hms_invoice_payments: true }
        });
        if (!invoice) return { error: "Invoice not found" };

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Payment Record
            // Handle empty strings as null to prevent unique constraint violation on ""
            const reference = payment.reference ? payment.reference.trim() : null;
            const finalReference = reference === "" ? null : reference;

            // Check for duplicate reference if provided
            if (finalReference) {
                const existing = await tx.hms_invoice_payments.findFirst({
                    where: {
                        tenant_id: session.user.tenantId,
                        company_id: companyId,
                        payment_reference: finalReference
                    }
                });
                if (existing) {
                    throw new Error(`Payment reference '${finalReference}' already exists.`);
                }
            }

            await tx.hms_invoice_payments.create({
                data: {
                    tenant_id: session.user.tenantId,
                    company_id: companyId,
                    invoice_id: invoiceId,
                    amount: payment.amount,
                    method: payment.method as any,
                    payment_reference: finalReference,
                    paid_at: new Date()
                }
            });

            // 2. Recalculate Totals
            const totalPaid = Number(invoice.total_paid || 0) + Number(payment.amount);
            const outstanding = Math.max(0, Number(invoice.total) - totalPaid);
            const finalStatus = outstanding === 0 ? 'paid' : newStatus; // Auto-paid if fully settled

            // 3. Update Invoice
            const updated = await tx.hms_invoice.update({
                where: { id: invoiceId },
                data: {
                    total_paid: totalPaid,
                    outstanding_amount: outstanding,
                    status: finalStatus,
                    updated_at: new Date()
                }
            });

            // If paid, close appointment
            if (finalStatus === 'paid' && updated.appointment_id) {
                await tx.hms_appointments.update({
                    where: { id: updated.appointment_id },
                    data: { status: 'completed' }
                });
            }

            return updated;
        });

        // Trigger Accounting & Notification
        if (result.status === 'paid') {
            await AccountingService.postSalesInvoice(invoiceId, session.user.id);
            NotificationService.sendInvoiceWhatsapp(invoiceId, session.user.tenantId!).catch(console.error);
        }

        revalidatePath(`/hms/billing/${invoiceId}`);
        revalidatePath('/hms/billing');
        return { success: true, data: result };

    } catch (error: any) {
        console.error("Failed to record payment:", error);
        // Return a cleaner error message
        if (error.message.includes("Unique constraint failed") || error.message.includes("already exists")) {
            return { error: `Payment Reference '${payment.reference}' is duplicate. Please use a unique reference.` };
        }
        return { error: error.message || "Failed to record payment" };
    }
}

export async function shareInvoiceWhatsapp(invoiceId: string, pdfBase64?: string) {
    const session = await auth();
    if (!session?.user?.tenantId) return { error: "Unauthorized" };

    try {
        const result = await NotificationService.sendInvoiceWhatsapp(invoiceId, session.user.tenantId, pdfBase64);
        return result;
    } catch (error: any) {
        console.error("Manual WhatsApp Share Failed:", error);
        return { error: error.message };
    }
}

export async function getPatientBalance(patientId: string) {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId) return { error: "Unauthorized" };

    try {
        const result = await prisma.journal_entry_lines.aggregate({
            where: {
                partner_id: patientId,
                company_id: companyId,
                journal_entries: {
                    posted: true
                }
            },
            _sum: {
                debit: true,
                credit: true
            }
        });

        const totalDebit = Number(result._sum.debit || 0);
        const totalCredit = Number(result._sum.credit || 0);
        const balance = totalDebit - totalCredit;

        return {
            success: true,
            balance: Math.abs(balance),
            type: balance > 0 ? 'due' : 'advance',
            rawBalance: balance
        };
    } catch (error: any) {
        console.error("Failed to fetch patient balance:", error);
        return { error: "Failed to fetch balance" };
    }
}

export async function createQuickPatient(name: string, phone: string) {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId) return { error: "Unauthorized" };

    try {
        // Split name
        const parts = name.trim().split(' ');
        const firstName = parts[0];
        const lastName = parts.slice(1).join(' ') || '.';

        const count = await prisma.hms_patient.count({ where: { tenant_id: session.user.tenantId } });
        const patientNumber = `P${new Date().getFullYear()}${String(count + 1).padStart(5, '0')}`;

        const newPatient = await prisma.hms_patient.create({
            data: {
                tenant_id: session.user.tenantId!,
                company_id: companyId,
                first_name: firstName,
                last_name: lastName,
                patient_number: patientNumber,
                email: null,
                gender: 'unknown',
                dob: new Date(), // Default to today/unknown
                contact: { phone: phone, address: 'Walk-in' },
                metadata: {
                    source: 'quick_billing',
                    is_walk_in: true
                }
            }
        });

        return { success: true, data: newPatient };
    } catch (error: any) {
        console.error("Failed to create quick patient:", error);
        if (error.code === 'P2002') {
            return { error: "Patient with this details might already exist." };
        }
        return { error: `Failed to create patient: ${error.message}` };
    }
}
