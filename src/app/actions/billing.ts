'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { hms_invoice_status } from "@prisma/client";
import { AccountingService } from "@/lib/services/accounting"
import { NotificationService } from "@/lib/services/notification";

export async function getUoms() {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId) return { error: "Unauthorized" };

    try {
        const uoms = await (prisma as any).hms_uom.findMany({
            where: { tenant_id: (session?.user as any).tenantId },
            orderBy: { name: 'asc' }
        });
        return { success: true, data: uoms };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function getNextVoucherNumber(date: string = new Date().toISOString()) {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId) return { error: "Unauthorized" };

    try {
        const settings = await prisma.company_settings.findUnique({
            where: { company_id: companyId },
            select: { numbering_prefix: true }
        });
        const customPrefix = settings?.numbering_prefix || 'INV';

        const invDate = new Date(date);
        const month = invDate.getMonth();
        const year = invDate.getFullYear();

        let fyStart = year;
        let fyEnd = year + 1;
        if (month < 3) {
            fyStart = year - 1;
            fyEnd = year;
        }
        const fyString = `${fyStart.toString().slice(-2)}-${fyEnd.toString().slice(-2)}`;
        const prefix = `${customPrefix}-${fyString}-`;

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
        return { success: true, data: invoiceNo };
    } catch (error: any) {
        return { error: error.message };
    }
}

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
            },
            select: {
                id: true,
                sku: true,
                name: true,
                description: true,
                uom: true,
                price: true,
                metadata: true,
                is_service: true,
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
                },
                product_tax_rules: {
                    where: { is_active: true },
                    include: { tax_rates: true },
                    orderBy: { priority: 'desc' },
                    take: 1
                },
                hms_purchase_order_line: {
                    orderBy: { created_at: 'desc' },
                    take: 1
                }
            }
        });

        const itemIds = items.map(i => i.id);

        // Manual lookup for last purchase entries (Invoices) since no relation exists in Prisma
        const lastInvoiceEntries = await prisma.hms_purchase_invoice_line.findMany({
            where: {
                product_id: { in: itemIds },
                tenant_id: session.user.tenantId,
                company_id: companyId
            },
            orderBy: { created_at: 'desc' },
            distinct: ['product_id']
        });

        // Flatten price and tax logic for the terminal
        // Pre-fetch company tax rates to resolve IDs from rates if needed
        const taxMaps = await prisma.company_tax_maps.findMany({
            where: { company_id: companyId },
            include: { tax_rates: true }
        });
        const companyTaxRates = taxMaps.map(m => m.tax_rates).filter(Boolean);

        const flatItems = items.map((item) => {
            const priceHistory = item.hms_product_price_history?.[0];
            const categoryRel = item.hms_product_category_rel?.[0];
            const category = categoryRel?.hms_product_category;
            const productTaxRule = item.product_tax_rules?.[0];

            // Procurement Sync: Check both POs and Direct Invoice Entries
            const poLine = item.hms_purchase_order_line?.[0];
            const piLine = lastInvoiceEntries.find(pi => pi.product_id === item.id);

            // Choose the absolute latest procurement record to extract tax from
            const latestPurchase: any = (!piLine || (poLine && poLine.created_at > piLine.created_at)) ? poLine : piLine;

            let purchaseTaxId = null;
            let purchaseTaxRate = 0;

            if (latestPurchase?.tax) {
                const taxInfo = latestPurchase.tax;
                // Scenario 1: Array of tax objects (Modern standard)
                if (Array.isArray(taxInfo) && taxInfo.length > 0) {
                    purchaseTaxId = taxInfo[0].id;
                    purchaseTaxRate = Number(taxInfo[0].rate) || 0;
                }
                // Scenario 2: Single object with rate/id
                else if (typeof taxInfo === 'object') {
                    const info = taxInfo as any;
                    purchaseTaxId = info.id || null;
                    purchaseTaxRate = Number(info.rate) || 0;

                    // Fallback for amount-only objects
                    if (!purchaseTaxRate && info.amount && latestPurchase.unit_price) {
                        const total = Number(latestPurchase.qty) * Number(latestPurchase.unit_price);
                        if (total > 0) purchaseTaxRate = (Number(info.amount) / total) * 100;
                    }
                }
                // Scenario 3: Legacy number (Amount only)
                else if (typeof taxInfo === 'number' && latestPurchase.unit_price) {
                    const total = Number(latestPurchase.qty) * Number(latestPurchase.unit_price);
                    if (total > 0) purchaseTaxRate = (taxInfo / total) * 100;
                }
            }

            // CRITICAL: If we have a purchase rate but no ID, resolve the ID from company settings
            if (!purchaseTaxId && purchaseTaxRate > 0) {
                const matchedRate = companyTaxRates.find(tr => Number(tr.rate) === purchaseTaxRate);
                if (matchedRate) {
                    purchaseTaxId = matchedRate.id;
                }
            }

            // FINAL TAX RESOLUTION: Specific Rule > Latest Purchase Identity > Category Default
            let effectiveTaxId = productTaxRule?.tax_rate_id || purchaseTaxId || category?.default_tax_rate_id || null;

            // SERVICE OVERRIDE: Hospital services (Consultation, etc.) are typically tax-exempt (0%)
            // If it is a service and no specific product tax rule exists, we default to 0
            if (item.is_service && !productTaxRule?.tax_rate_id) {
                effectiveTaxId = null;
            }

            // Re-verify the rate against the final resolved ID
            const finalTaxRateObj = companyTaxRates.find(tr => tr.id === effectiveTaxId);

            // Priority for Rate: Resolved ID > Rule > Purchase > Category (only for items) > 0
            let effectiveTaxRate = 0;
            if (finalTaxRateObj) {
                effectiveTaxRate = Number(finalTaxRateObj.rate);
            } else if (productTaxRule?.tax_rates?.rate) {
                effectiveTaxRate = Number(productTaxRule.tax_rates.rate);
            } else if (purchaseTaxRate > 0) {
                effectiveTaxRate = purchaseTaxRate;
            } else if (!item.is_service && category?.tax_rates?.rate) {
                effectiveTaxRate = Number(category.tax_rates.rate);
            }

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
                type: item.is_service ? 'service' : 'item',
                metadata: {
                    ...metadata,
                    // UOM Pricing (Industry Standard)
                    baseUom: uomData.base_uom || item.uom || 'PCS',
                    basePrice: uomData.base_price || Number(item.price) || 0,
                    conversionFactor: uomData.conversion_factor || 1,
                    packUom: uomData.pack_uom || (uomData.conversion_factor > 1 ? `PACK-${uomData.conversion_factor}` : (item.uom || 'PCS')),
                    packPrice: uomData.pack_price || (Number(item.price) * (uomData.conversion_factor || 1)),
                    packSize: uomData.pack_size || uomData.conversion_factor || 1
                },
                // Extract tax for auto-suggest (prioritize rule > purchase > category)
                categoryTaxId: effectiveTaxId,
                categoryTaxRate: effectiveTaxRate
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
        // 1. Fetch Company Tax Maps (Primary source of truth for allowed taxes)
        const taxMaps = await prisma.company_tax_maps.findMany({
            where: {
                company_id: companyId,
                is_active: true
            },
            include: {
                tax_rates: true
            }
        });

        // 2. Map to simpler structure for the UI terminal
        const taxRates = taxMaps.map(m => ({
            id: m.tax_rate_id,
            name: m.tax_rates.name,
            rate: m.tax_rates.rate.toNumber(),
            isDefault: m.is_default
        }));

        const defaultRate = taxRates.find(t => t.isDefault) || taxRates[0];

        return {
            success: true,
            data: {
                defaultTax: defaultRate || null,
                taxRates: taxRates
            }
        };
    } catch (error) {
        console.error("Failed to fetch tax configuration:", error);
        return { error: "Failed to fetch company taxes" };
    }
}

export async function createInvoice(data: {
    patient_id: string,
    appointment_id?: string,
    date: string,
    line_items: any[],
    payments?: any[],
    status?: any,
    total_discount?: number,
    billing_metadata?: any
}) {
    const session = await auth();
    const LOG_PREFIX = `[BILLING-ENGINE-${Date.now()}]`;
    console.log(`${LOG_PREFIX} START - User: ${session?.user?.email}`);

    if (!session?.user?.tenantId) {
        return { error: "AUTH_EXPIRED: Session lost. Please login again." };
    }

    const tenantId = session.user.tenantId;
    const companyId = (session.user as any).companyId || tenantId;
    const branchId = (session.user as any).current_branch_id || (session.user as any).branch_id;
    const userId = session.user.id;

    const isUUID = (str: any) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    const safeNum = (val: any) => { const n = parseFloat(val); return isNaN(n) ? 0 : n; };

    try {
        // 1. Resolve Patient Identity
        let resolvedPatientId: string | null = null;
        const patientInput = data.patient_id;
        const rawPatientId = (patientInput && typeof patientInput === 'object') ? (patientInput as any).id : patientInput;

        if (isUUID(rawPatientId)) {
            resolvedPatientId = rawPatientId;
        } else if (rawPatientId && rawPatientId.toString().startsWith('PAT-')) {
            const p = await prisma.hms_patient.findFirst({
                where: { tenant_id: tenantId, patient_number: rawPatientId.toString() },
                select: { id: true }
            });
            if (p) resolvedPatientId = p.id;
        }

        // 2. Simple Sequence (INV-0001)
        const lastInv = await prisma.hms_invoice.findFirst({
            where: { tenant_id: tenantId },
            orderBy: { created_at: 'desc' },
            select: { invoice_number: true }
        });

        let nextSeq = 1;
        if (lastInv?.invoice_number) {
            const match = lastInv.invoice_number.match(/(\d+)$/);
            if (match) nextSeq = parseInt(match[0]) + 1;
        }
        const invoiceNo = `DBG-${Date.now()}`;

        // 3. Totals
        const { line_items = [], payments = [], status = 'draft', total_discount = 0 } = data;
        const subtotalCalc = line_items.reduce((sum, l) => sum + (safeNum(l.quantity) * safeNum(l.unit_price) - safeNum(l.discount_amount)), 0);
        const taxTotalCalc = line_items.reduce((sum, l) => sum + safeNum(l.tax_amount), 0);
        const grandTotalCalc = Math.max(0, subtotalCalc + taxTotalCalc - safeNum(total_discount));
        const totalPaidCalc = payments.reduce((sum, p) => sum + safeNum(p.amount), 0);
        const outstandingCalc = (status === 'paid') ? 0 : Math.max(0, grandTotalCalc - totalPaidCalc);

        // 4. Persistence with Manual ID Injection (Neon Compatibility)
        const result = await prisma.$transaction(async (tx) => {
            const invoiceId = crypto.randomUUID();
            const invoice = await tx.hms_invoice.create({
                data: {
                    id: invoiceId,
                    tenant_id: tenantId,
                    company_id: companyId,
                    invoice_number: invoiceNo,
                    invoice_no: invoiceNo,
                    invoice_date: new Date(data.date || new Date()),
                    issued_at: new Date(),
                    due_at: new Date(new Date().setDate(new Date().getDate() + 7)),
                    currency: 'INR',
                    currency_rate: 1.0,
                    subtotal: subtotalCalc,
                    total_tax: taxTotalCalc,
                    total_discount: safeNum(total_discount),
                    total: grandTotalCalc,
                    total_paid: totalPaidCalc,
                    status: status as any,
                    outstanding_amount: outstandingCalc,
                    outstanding: outstandingCalc,
                    line_items: [],
                    billing_metadata: data.billing_metadata || {},
                    patient_id: resolvedPatientId,
                    appointment_id: isUUID(data.appointment_id) ? data.appointment_id : null,
                    branch_id: isUUID(branchId) ? branchId : null,
                    created_by: isUUID(userId) ? userId : null,
                    hms_invoice_lines: {
                        create: line_items.map((l, idx) => ({
                            id: crypto.randomUUID(),
                            tenant_id: tenantId,
                            company_id: companyId,
                            line_idx: idx + 1,
                            description: l.description || "Service",
                            quantity: safeNum(l.quantity) || 1,
                            unit_price: safeNum(l.unit_price),
                            discount_amount: safeNum(l.discount_amount),
                            tax_amount: safeNum(l.tax_amount),
                            net_amount: (safeNum(l.quantity) * safeNum(l.unit_price)) - safeNum(l.discount_amount),
                            subtotal: (safeNum(l.quantity) * safeNum(l.unit_price)),
                            product_id: isUUID(l.product_id) ? l.product_id : null,
                            tax_rate_id: isUUID(l.tax_rate_id) ? l.tax_rate_id : null,
                            uom: l.uom || 'Unit',
                            metadata: {}
                        }))
                    },
                    hms_invoice_payments: payments.length > 0 ? {
                        create: payments.filter(p => safeNum(p.amount) > 0).map(p => ({
                            id: crypto.randomUUID(),
                            tenant_id: tenantId,
                            company_id: companyId,
                            amount: safeNum(p.amount),
                            method: (['cash', 'card', 'upi', 'bank_transfer', 'insurance', 'adjustment'].includes(p.method) ? p.method : 'cash') as any,
                            payment_reference: p.reference || 'COUNTER_SALE',
                            currency: 'INR',
                            paid_at: new Date(),
                            created_by: isUUID(userId) ? userId : null
                        }))
                    } : undefined
                }
            });

            if (status === 'paid' && isUUID(data.appointment_id)) {
                await tx.hms_appointments.update({ where: { id: data.appointment_id }, data: { status: 'completed' } });
            }

            return invoice;
        }, { timeout: 40000 });

        if (result.id && status !== 'draft') {
            AccountingService.postSalesInvoice(result.id, userId).catch(err => console.error(`${LOG_PREFIX} GL POST ERR:`, err));
        }

        revalidatePath('/hms/billing');
        return { success: true, data: result };

    } catch (error: any) {
        const detail = error.meta ? JSON.stringify(error.meta) : error.message;
        const code = error.code || 'PRM-UNKNOWN';
        const target = error.meta?.target || error.meta?.column || 'Identity Check';

        const loudMessage = `[BILLING-FATAL] CODE: ${code} | TARGET: ${target} | DETAIL: ${detail}`;
        console.error(loudMessage);

        return {
            error: loudMessage
        };
    }
}

// Helper to check if a transaction is locked based on lock date or roles
async function checkTransactionLock(invoiceId: string, company_id: string, session: any) {
    const existing = await prisma.hms_invoice.findUnique({
        where: { id: invoiceId },
        select: { status: true, invoice_date: true, issued_at: true }
    });

    if (!existing) throw new Error("Transaction node not found.");

    // 1. Lock Date Check (Fiscal Period)
    const settings = await prisma.company_accounting_settings.findUnique({
        where: { company_id }
    });

    if (settings?.lock_date) {
        const txDate = existing.invoice_date || existing.issued_at;
        if (new Date(txDate) <= new Date(settings.lock_date)) {
            return { locked: true, reason: `Fiscal period is closed. Transactions before ${new Date(settings.lock_date).toLocaleDateString()} are frozen.` };
        }
    }

    // 2. Role Check (Only Admin can edit posted/paid)
    const isAdmin = session?.user?.isAdmin;
    if (existing.status !== 'draft' && !isAdmin) {
        return { locked: true, reason: "Administrative privileges required to modify a finalized ledger entry." };
    }

    return { locked: false, existing };
}

export async function cancelInvoice(invoiceId: string) {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId) return { error: "Unauthorized" };

    try {
        const lockCheck = await checkTransactionLock(invoiceId, companyId, session);
        if (lockCheck.locked) return { error: lockCheck.reason };

        await prisma.hms_invoice.update({
            where: { id: invoiceId },
            data: { status: 'cancelled' as any }
        });

        revalidatePath('/hms/billing');
        return { success: true, message: "Transaction voided successfully." };
    } catch (error: any) {
        return { error: error.message || "Failed to cancel transaction." };
    }
}

export async function updateInvoice(invoiceId: string, data: { patient_id: string, appointment_id?: string, date: string, line_items: any[], payments?: any[], status?: any, total_discount?: number, billing_metadata?: any }) {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId) return { error: "Unauthorized" };

    const lockCheck = await checkTransactionLock(invoiceId, companyId, session);
    if (lockCheck.locked) return { error: lockCheck.reason };

    const { patient_id, appointment_id, date, line_items, status = 'draft' as any, total_discount = 0, payments = [], billing_metadata = {} } = data;

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
                    status: status,
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

                // WORLD CLASS: Auto-Allocation of Excess Funds (Reconciliation)
                if (totalPaid > total && patient_id) {
                    let excess = totalPaid - total;
                    const oldInvoices = await tx.hms_invoice.findMany({
                        where: {
                            tenant_id: session.user.tenantId,
                            company_id: companyId,
                            patient_id: patient_id as string,
                            status: 'posted' as any,
                            id: { not: invoiceId }
                        },
                        orderBy: { issued_at: 'asc' }
                    });

                    for (const oldInv of oldInvoices) {
                        if (excess <= 0) break;
                        const due = Number(oldInv.outstanding_amount || 0);
                        const paymentToApply = Math.min(due, excess);

                        if (paymentToApply > 0) {
                            await tx.hms_invoice.update({
                                where: { id: oldInv.id },
                                data: {
                                    total_paid: Number(oldInv.total_paid || 0) + paymentToApply,
                                    outstanding_amount: due - paymentToApply,
                                    status: (due - paymentToApply <= 0.01) ? 'paid' as any : 'posted' as any
                                }
                            });
                            excess -= paymentToApply;
                        }
                    }
                }
            }

            // If status is paid and appointment is linked, mark appointment as completed
            if (status === 'paid' && appointment_id) {
                await tx.hms_appointments.update({
                    where: { id: appointment_id },
                    data: { status: 'completed' }
                });
            }

            // [WORLD CLASS] Registration Fee Tracking
            const hasRegistrationFee = line_items.some((l: any) => l.description === 'Registration Fee');
            if (hasRegistrationFee && patient_id && (status === 'posted' || status === 'paid')) {
                const patient = await tx.hms_patient.findUnique({ where: { id: patient_id as string } });
                const currentMeta = (patient?.metadata as any) || {};
                await tx.hms_patient.update({
                    where: { id: patient_id as string },
                    data: {
                        metadata: {
                            ...currentMeta,
                            registration_fees_paid: true,
                            registration_fee_date: new Date().toISOString()
                        }
                    }
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
                    outstanding_amount: (status === 'paid') ? 0 : Math.max(0, total - totalPaid)
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
            try {
                const accountingRes = await AccountingService.postSalesInvoice(result.id, session.user.id);
                if (!accountingRes.success) {
                    console.warn("Accounting Post Partial Failure:", accountingRes.error);
                }
            } catch (err) {
                console.error("Accounting Post Exception:", err);
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

export async function updateInvoiceStatus(invoiceId: string, status: any) {
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

export async function recordPayment(invoiceId: string, payment: { amount: number, method: string, reference?: string }, newStatus: any = 'paid') {
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
                    status: finalStatus as any,
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
        revalidatePath('/hms/lab/dashboard'); // Refresh lab dashboard to show updated invoice status
        revalidatePath('/hms/reception/dashboard'); // Refresh reception dashboard
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

export async function settlePatientDues(patientId: string, amount: number, method: string, reference?: string) {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId) return { error: "Unauthorized" };

    try {
        if (amount <= 0) return { error: "Amount must be greater than 0" };

        let remainingAmount = amount;
        const settledInvoices = [];

        // 1. Fetch Outstanding Invoices (Oldest First)
        const invoices = await prisma.hms_invoice.findMany({
            where: {
                company_id: companyId,
                patient_id: patientId,
                status: { in: ['posted', 'draft'] as any }, // Allow paying Draft invoices (auto-posts them)
                outstanding_amount: { gt: 0 }
            },
            orderBy: { created_at: 'asc' }
        });

        const paymentResults = await prisma.$transaction(async (tx) => {
            const results = [];

            for (const inv of invoices) {
                if (remainingAmount <= 0) break;

                const payAmount = Math.min(Number(inv.outstanding_amount), remainingAmount);
                remainingAmount -= payAmount;

                // Create Payment Record
                const payment = await tx.hms_invoice_payments.create({
                    data: {
                        tenant_id: session.user.tenantId,
                        company_id: companyId,
                        invoice_id: inv.id,
                        amount: payAmount,
                        method: method as any, // Cast to enum
                        payment_reference: reference || `Settlement-${new Date().getTime()}`,
                        paid_at: new Date()
                    }
                });

                // Update Invoice
                const totalPaid = Number(inv.total_paid || 0) + payAmount;
                const outstanding = Number(inv.total) - totalPaid;
                const newStatus = outstanding <= 0.01 ? 'paid' : 'posted'; // Tolerance for float

                await tx.hms_invoice.update({
                    where: { id: inv.id },
                    data: {
                        total_paid: totalPaid,
                        outstanding_amount: outstanding,
                        status: newStatus
                    }
                });

                results.push({ invoiceId: inv.id, payAmount, status: newStatus });
            }

            // TODO: If remainingAmount > 0, store as Patient Advance (Ledger)
            // For now, we only settle invoices. Ideally we would create a Credit Note or Advance Payment.

            return results;
        });

        // 2. Trigger Accounting and Collect Errors
        const accountingErrors: string[] = [];
        for (const res of paymentResults) {
            try {
                const accountingRes = await AccountingService.postSalesInvoice(res.invoiceId, session.user.id);
                if (!accountingRes.success) accountingErrors.push(`Invoice ${res.invoiceId}: ${accountingRes.error}`);
            } catch (err: any) {
                console.error(`Failed to post accounting for settled invoice ${res.invoiceId}:`, err);
                accountingErrors.push(`Invoice ${res.invoiceId}: ${err.message}`);
            }
        }

        // 3. SELF-HEALING: If no invoices were settled (because they are already marked 'paid'?)
        // but the user is trying to pay (implying 'getPatientBalance' showed a due),
        // we might have a sync issue. Let's force-sync recent invoices.
        let syncedCount = 0;
        if (paymentResults.length === 0 && amount > 0) {
            const recentPaidInvoices = await prisma.hms_invoice.findMany({
                where: {
                    patient_id: patientId,
                    // We check paid or posted invoices that might have unposted payments
                    status: { in: ['paid', 'posted'] as any },
                },
                orderBy: { updated_at: 'desc' },
                take: 10
            });

            for (const inv of recentPaidInvoices) {
                await AccountingService.postSalesInvoice(inv.id, session.user.id);
                syncedCount++;
            }
        }

        revalidatePath('/hms/billing');

        let message = `Successfully settled ${paymentResults.length} invoice(s).`;
        if (syncedCount > 0) message += ` (Synced ${syncedCount} historical invoices)`;
        if (accountingErrors.length > 0) message += ` Accounting Warning: ${accountingErrors.join(', ')}`;

        return {
            success: accountingErrors.length === 0 || paymentResults.length > 0 || syncedCount > 0,
            settled: paymentResults.length,
            remainingOffset: remainingAmount,
            message: message,
            error: accountingErrors.length > 0 ? accountingErrors.join(', ') : undefined
        };

    } catch (error: any) {
        console.error("Settlement Error:", error);
        return { error: error.message || "Failed to settle dues" };
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
        const getLedgerBalance = async () => {
            const result = await prisma.journal_entry_lines.aggregate({
                where: {
                    partner_id: patientId,
                    company_id: companyId,
                    journal_entries: { posted: true }
                },
                _sum: { debit: true, credit: true }
            });
            const totalDebit = Number(result._sum.debit || 0);
            const totalCredit = Number(result._sum.credit || 0);
            return totalDebit - totalCredit;
        };

        let activeBalance = await getLedgerBalance();

        // Add DRAFT invoices (Running Bills) which are not yet in Ledger
        const draftInvoices = await prisma.hms_invoice.aggregate({
            where: {
                patient_id: patientId,
                company_id: companyId,
                status: 'draft' as any
            },
            _sum: { outstanding_amount: true }
        });
        const draftAmount = Number(draftInvoices._sum.outstanding_amount || 0);

        // Effective Balance = Ledger (Posted/Paid) + Drafts (Unposted Consumption)
        const finalBalance = activeBalance + draftAmount;

        return {
            success: true,
            balance: Math.abs(finalBalance),
            type: finalBalance > 0.1 ? 'due' : (finalBalance < -0.1 ? 'advance' : 'due'),
            rawBalance: finalBalance,
            breakdown: {
                ledger: activeBalance,
                draft: draftAmount
            }
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

export async function recordPatientConsumption(patientId: string, items: any[], notes?: string) {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId) return { error: "Unauthorized" };

    if (!items || items.length === 0) return { error: "No items to record" };

    try {
        // 1. Find an Active (Draft) Invoice for this Patient (The "Running Bill")
        const activeInvoice = await prisma.hms_invoice.findFirst({
            where: {
                company_id: companyId,
                patient_id: patientId,
                status: 'draft' as any // Crucial: We add to the DRAFT invoice
            },
            orderBy: { created_at: 'desc' },
            include: { hms_invoice_lines: true }
        });

        if (activeInvoice) {
            // APPEND to Existing Draft
            await prisma.$transaction(async (tx) => {
                // Determine next line index
                const maxIdx = activeInvoice.hms_invoice_lines.reduce((max, l) => Math.max(max, l.line_idx), 0);
                let currentIdx = maxIdx + 1;

                // Create Lines
                await tx.hms_invoice_lines.createMany({
                    data: items.map((item) => ({
                        tenant_id: session.user.tenantId,
                        company_id: companyId,
                        invoice_id: activeInvoice.id,
                        line_idx: currentIdx++,
                        product_id: item.productId || null,
                        description: item.name || item.description,
                        quantity: item.quantity || 1,
                        unit_price: item.price || 0,
                        net_amount: ((item.quantity || 1) * (item.price || 0)),
                        tax_amount: 0,
                        discount_amount: 0,
                        metadata: {
                            added_at: new Date().toISOString(),
                            notes: notes,
                            type: 'consumption'
                        }
                    }))
                });

                // Recalculate Totals
                // Fetch ALL lines again to ensure accuracy
                const allLines = await tx.hms_invoice_lines.findMany({ where: { invoice_id: activeInvoice.id } });

                const subtotal = allLines.reduce((sum, l) => sum + Number(l.net_amount), 0);
                const totalTax = allLines.reduce((sum, l) => sum + Number(l.tax_amount || 0), 0);
                const total = subtotal + totalTax;

                await tx.hms_invoice.update({
                    where: { id: activeInvoice.id },
                    data: {
                        subtotal,
                        total_tax: totalTax,
                        total,
                        outstanding_amount: total - Number(activeInvoice.total_paid || 0),
                        updated_at: new Date()
                    }
                });
            });

            revalidatePath('/hms/billing');
            return { success: true, message: `Added to running bill: ${activeInvoice.invoice_number}`, invoiceId: activeInvoice.id };

        } else {
            // CREATE New "Running Bill" (Draft Invoice)
            const payload = {
                patient_id: patientId,
                date: new Date().toISOString(),
                status: 'draft' as any,
                line_items: items.map(item => ({
                    product_id: item.productId,
                    description: item.name || item.description,
                    quantity: item.quantity || 1,
                    unit_price: item.price || 0,
                    tax_amount: 0,
                    discount_amount: 0
                })),
                billing_metadata: {
                    notes: notes,
                    origin: 'consumption_log',
                    is_running_bill: true
                }
            };

            const res = await createInvoice(payload);
            if (res.error) throw new Error(res.error);

            const newId = (res as any).data?.id;
            return { success: true, message: "Created new detailed bill", invoiceId: newId };
        }

    } catch (error: any) {
        console.error("Failed to record consumption:", error);
        return { error: error.message };
    }
}

/**
 * World Class Ledger Analytics: 
 * Fetches the real-time financial standing of a patient across all sub-ledgers.
 */
export async function getPatientOutstandingBalance(patientId: string) {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId || !patientId) return { error: "Unauthorized or missing ID" };

    try {
        const invoices = await prisma.hms_invoice.findMany({
            where: {
                tenant_id: session.user.tenantId,
                company_id: companyId,
                patient_id: patientId,
                status: 'posted' as any // Only confirmed debts (unpaid or partially paid)
            },
            select: {
                outstanding_amount: true
            }
        });

        const totalDebt = invoices.reduce((sum, inv) => sum + Number(inv.outstanding_amount || 0), 0);

        return { success: true, balance: totalDebt };
    } catch (error: any) {
        console.error("Ledger Fetch Failed:", error);
        return { error: "Could not compute patient balance" };
    }
}

/**
 * World Class Financial Transparency:
 * Fetches the full audit trail of all financial movements for a patient.
 */
export async function getPatientLedger(patientId: string) {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId || !patientId) return { error: "Unauthorized or missing ID" };

    try {
        const lines = await prisma.journal_entry_lines.findMany({
            where: {
                tenant_id: session.user.tenantId,
                company_id: companyId,
                partner_id: patientId
            },
            include: {
                journal_entries: {
                    select: {
                        date: true,
                        ref: true,
                        journals: { select: { name: true, code: true } }
                    }
                },
                accounts: { select: { name: true, code: true } }
            },
            orderBy: {
                journal_entries: { date: 'desc' }
            }
        });

        return { success: true, data: lines };
    } catch (error: any) {
        console.error("Patient Ledger Fetch Failed:", error);
        return { error: "Could not fetch patient ledger" };
    }
}
