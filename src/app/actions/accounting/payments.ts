
'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from 'uuid'
import { AccountingService } from "@/lib/services/accounting"

export type PaymentType = 'inbound' | 'outbound';

// Fetch Payments (Receipts or Vendor Payments)
// Fetch Payments (Receipts or Vendor Payments)
export async function getPayments(type: PaymentType, search?: string) {
    const session = await auth();
    let companyId = session?.user?.companyId;
    const tenantId = session?.user?.tenantId;

    if (!tenantId) return { error: "Unauthorized: No Tenant" };

    if (!companyId) {
        const defaultCompany = await prisma.company.findFirst({
            where: { tenant_id: tenantId }
        });
        if (defaultCompany) companyId = defaultCompany.id;
        else return { error: "Unauthorized: No Company Found" };
    }

    try {
        const payments = await prisma.payments.findMany({
            where: {
                company_id: companyId,
                // Using metadata filter for type since schema migration failed
                metadata: {
                    path: ['type'],
                    equals: type
                }
            },
            orderBy: { created_at: 'desc' },
            take: 100
        });

        const enriched = await Promise.all(payments.map(async (p) => {
            let partnerName = 'Unknown';
            if (p.partner_id) {
                if (type === 'inbound') {
                    // Patient
                    const patient = await prisma.hms_patient.findUnique({ where: { id: p.partner_id }, select: { first_name: true, last_name: true } });
                    if (patient) partnerName = `${patient.first_name} ${patient.last_name}`;
                } else {
                    // Supplier
                    const supplier = await prisma.hms_supplier.findUnique({ where: { id: p.partner_id }, select: { name: true } });
                    if (supplier) partnerName = supplier.name;
                }
            } else {
                // Check metadata for direct payee
                const meta = p.metadata as any;
                if (meta?.payee_name) partnerName = meta.payee_name;
            }
            return { ...p, partner_name: partnerName };
        }));

        return { success: true, data: enriched };
    } catch (error: any) {
        console.error("Error fetching payments:", error);
        return { error: error.message };
    }
}

export async function getExpenseAccounts() {
    const session = await auth();
    let companyId = session?.user?.companyId;
    const tenantId = session?.user?.tenantId;

    if (!tenantId) return { error: "Unauthorized: No Tenant" };

    if (!companyId) {
        const defaultCompany = await prisma.company.findFirst({
            where: { tenant_id: tenantId }
        });
        if (defaultCompany) companyId = defaultCompany.id;
        else return { error: "Unauthorized: No Company Found" };
    }

    try {
        let accounts = await prisma.accounts.findMany({
            where: {
                company_id: companyId,
                type: 'Expense',
                is_active: true
            },
            select: { id: true, name: true, code: true },
            orderBy: { name: 'asc' }
        });

        // Auto-seed if empty or very few accounts
        if (accounts.length < 3) {
            const defaultExpenses = [
                { name: 'Tea & Snacks', code: 'EXP-TEA' },
                { name: 'Travel & Conveyance', code: 'EXP-TRAV' },
                { name: 'Stationery & Printing', code: 'EXP-STAT' },
                { name: 'Cleaning & Housekeeping', code: 'EXP-CLEAN' },
                { name: 'Repair & Maintenance', code: 'EXP-REPAIR' },
                { name: 'Fuel & Electricity', code: 'EXP-UTIL' },
                { name: 'General / Other Expenses', code: 'EXP-GEN' }
            ];

            const existingCodes = new Set(accounts.map(a => a.code));
            const missing = defaultExpenses.filter(d => !existingCodes.has(d.code));

            if (missing.length > 0) {
                await prisma.accounts.createMany({
                    data: missing.map(m => ({
                        tenant_id: tenantId,
                        company_id: companyId,
                        name: m.name,
                        code: m.code,
                        type: 'Expense',
                        is_active: true
                    })),
                    skipDuplicates: true
                });

                // Re-fetch after seeding
                accounts = await prisma.accounts.findMany({
                    where: {
                        company_id: companyId,
                        type: 'Expense',
                        is_active: true
                    },
                    select: { id: true, name: true, code: true },
                    orderBy: { name: 'asc' }
                });
            }
        }

        return { success: true, data: accounts };
    } catch (e: any) {
        console.error("Error in getExpenseAccounts:", e);
        return { error: e.message };
    }
}

export async function upsertPayment(data: {
    id?: string;
    type: PaymentType;
    partner_id?: string | null;
    amount: number;
    method: string;
    reference?: string;
    date: Date; // Capture date in metadata
    memo?: string;
    posted?: boolean;
    allocations?: { invoiceId: string; amount: number }[];
    lines?: { accountId: string; amount: number; description?: string }[];
    payeeName?: string; // For direct payments
}) {
    const session = await auth();
    let companyId = session?.user?.companyId;
    const tenantId = session?.user?.tenantId;

    if (!tenantId) return { error: "Unauthorized: No Tenant" };

    if (!companyId) {
        const defaultCompany = await prisma.company.findFirst({
            where: { tenant_id: tenantId }
        });
        if (defaultCompany) companyId = defaultCompany.id;
        else return { error: "Unauthorized: No Company Found" };
    }

    try {
        const lines = data.lines || [];
        let categoryName = "General Expense";
        if (lines.length > 0 && lines[0].accountId) {
            const acc = await prisma.accounts.findUnique({
                where: { id: lines[0].accountId },
                select: { name: true }
            });
            if (acc) categoryName = acc.name;
        }

        const payload = {
            tenant_id: tenantId,
            company_id: companyId,
            partner_id: data.partner_id || null, // Allow null
            amount: data.amount,
            method: data.method,
            reference: data.reference,
            metadata: {
                type: data.type,
                date: data.date.toISOString(),
                memo: data.memo,
                allocations: data.allocations, // Store original intent in metadata too
                payee_name: data.payeeName, // Store payee name if partner_id is null
                category_name: categoryName
            },
            created_at: data.date
        };

        const result = await prisma.$transaction(async (tx) => {
            let payment;
            if (data.id) {
                payment = await tx.payments.update({
                    where: { id: data.id },
                    data: payload
                });
            } else {
                const prefix = data.type === 'inbound' ? 'RCP' : 'PAY';
                const num = `${prefix}-${Date.now().toString().slice(-6)}`;

                payment = await tx.payments.create({
                    data: {
                        ...payload,
                        payment_number: num,
                        payment_number_normalized: num,
                        posted: data.posted ?? true
                    }
                });
            }

            // Handle Allocation Logic
            if (data.allocations && data.allocations.length > 0) {
                for (const alloc of data.allocations) {
                    const allocAmount = Number(alloc.amount);
                    if (allocAmount <= 0) continue;

                    // 1. Create Payment Line
                    await tx.payment_lines.create({
                        data: {
                            tenant_id: (tenantId || payment.tenant_id || '') as string,
                            company_id: (companyId || payment.company_id || '') as string,
                            payment_id: payment.id,
                            invoice_id: alloc.invoiceId,
                            amount: allocAmount,
                        }
                    });

                    if (data.type === 'inbound') {
                        // RECEIPT: Update hms_invoice
                        await tx.hms_invoice_payments.create({
                            data: {
                                tenant_id: (tenantId || payment.tenant_id || '') as string,
                                company_id: (companyId || payment.company_id || '') as string,
                                invoice_id: alloc.invoiceId,
                                amount: allocAmount,
                                method: data.method as any,
                                payment_reference: payment.payment_number,
                                paid_at: data.date
                            }
                        });

                        await tx.hms_invoice.update({
                            where: { id: alloc.invoiceId },
                            data: {
                                total_paid: { increment: allocAmount },
                                outstanding: { decrement: allocAmount }
                            }
                        });

                        const updatedInvoice = await tx.hms_invoice.findUnique({
                            where: { id: alloc.invoiceId },
                            select: { outstanding: true }
                        });

                        if (updatedInvoice && Number(updatedInvoice.outstanding || 0) <= 0) {
                            await tx.hms_invoice.update({
                                where: { id: alloc.invoiceId },
                                data: { status: 'paid' }
                            });
                        }
                    } else {
                        // VENDOR PAYMENT: Update hms_purchase_invoice
                        await tx.hms_purchase_invoice.update({
                            where: { id: alloc.invoiceId },
                            data: {
                                paid_amount: { increment: allocAmount }
                            }
                        });

                        const updatedBill = await tx.hms_purchase_invoice.findUnique({
                            where: { id: alloc.invoiceId },
                            select: { total_amount: true, paid_amount: true }
                        });

                        if (updatedBill && Number(updatedBill.paid_amount || 0) >= Number(updatedBill.total_amount || 0)) {
                            await tx.hms_purchase_invoice.update({
                                where: { id: alloc.invoiceId },
                                data: { status: 'closed' } // Or 'paid' depending on standard
                            });
                        }
                    }
                }
            }

            // Handle Direct Expense Lines
            if (data.lines && data.lines.length > 0) {
                for (const line of data.lines) {
                    const lineAmount = Number(line.amount);
                    if (lineAmount <= 0) continue;

                    const account = await tx.accounts.findUnique({
                        where: { id: line.accountId },
                        select: { name: true }
                    });

                    await tx.payment_lines.create({
                        data: {
                            tenant_id: (tenantId || payment.tenant_id || '') as string,
                            company_id: (companyId || payment.company_id || '') as string,
                            payment_id: payment.id,
                            amount: lineAmount,
                            metadata: {
                                account_id: line.accountId,
                                account_name: account?.name || 'Expense',
                                description: line.description
                            }
                        }
                    });
                }
            }

            return payment;
        });

        if (!result) return { error: "Failed to create payment" };

        // Post to Accounting if marked as posted
        if (result.posted) {
            await AccountingService.postPaymentEntry(result.id, session.user.id);
        }

        revalidatePath(data.type === 'inbound' ? '/hms/accounting/receipts' : '/hms/accounting/payments');
        revalidatePath('/hms/reception/dashboard');
        return { success: true, data: result };

    } catch (error: any) {
        console.error("Error saving payment:", error);
        return { error: error.message };
    }
}

export async function postPayment(id: string) {
    // Logic to Create Journal Entry
    // Debit Bank/Cash, Credit AR/AP
    // This is complex. We need settings to know WHICH Bank account.
    // For now, we just mark as Posted.
    const session = await auth();
    let companyId = session?.user?.companyId;
    const tenantId = session?.user?.tenantId;

    if (!tenantId) return { error: "Unauthorized: No Tenant" };

    // We might not need companyId for posting if ID is enough, but auth check is good.
    if (!companyId) {
        const defaultCompany = await prisma.company.findFirst({
            where: { tenant_id: tenantId }
        });
        if (defaultCompany) companyId = defaultCompany.id;
        else return { error: "Unauthorized" };
    }

    try {
        const result = await AccountingService.postPaymentEntry(id, session.user.id);
        if (!result.success) return { error: result.error };

        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}
