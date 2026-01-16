'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { AccountingService } from "@/lib/services/accounting"

export async function recordExpense(data: {
    amount: number;
    categoryId: string; // The Expense Account ID
    payeeName: string;
    memo?: string;
    date: Date;
    method?: string; // defaulting to 'cash'
    reference?: string;
}) {
    const session = await auth();
    const companyId = session?.user?.companyId;
    const tenantId = session?.user?.tenantId;

    if (!tenantId || !companyId) {
        return { error: "Unauthorized: Missing Company or Tenant ID" };
    }

    try {
        // 1. Get Expense Category Name for Metadata
        const account = await prisma.accounts.findUnique({
            where: { id: data.categoryId },
            select: { name: true, code: true }
        });

        if (!account) return { error: "Invalid Expense Category" };

        const categoryName = account.name;

        // 2. Generate Payment Voucher Number (PV-XXXXX)
        const prefix = 'PV';
        // Find last payment number to increment
        const lastPayment = await prisma.payments.findFirst({
            where: {
                tenant_id: tenantId,
                payment_number: { startsWith: prefix }
            },
            orderBy: { created_at: 'desc' },
            select: { payment_number: true }
        });

        let nextSeq = 1;
        if (lastPayment && lastPayment.payment_number) {
            const parts = lastPayment.payment_number.split('-');
            const lastNumVal = parts[parts.length - 1]; // Get last part
            if (!isNaN(Number(lastNumVal))) {
                nextSeq = Number(lastNumVal) + 1;
            }
        }

        const paymentNumber = `${prefix}-${nextSeq.toString().padStart(5, '0')}`;

        // 3. Create Payment Record (Transaction)
        const result = await prisma.$transaction(async (tx) => {
            const payment = await tx.payments.create({
                data: {
                    tenant_id: tenantId,
                    company_id: companyId,
                    amount: data.amount,
                    method: data.method || 'cash',
                    reference: data.reference,
                    payment_number: paymentNumber,
                    payment_number_normalized: paymentNumber,
                    posted: true, // Auto-post expenses
                    metadata: {
                        type: 'outbound',
                        date: data.date.toISOString(),
                        memo: data.memo,
                        payee_name: data.payeeName,
                        category_name: categoryName,
                        category_code: account.code
                    },
                    created_at: data.date
                }
            });

            // 4. Create Payment Line (Expense Line)
            await tx.payment_lines.create({
                data: {
                    tenant_id: tenantId,
                    company_id: companyId,
                    payment_id: payment.id,
                    amount: data.amount,
                    metadata: {
                        account_id: data.categoryId,
                        account_name: categoryName,
                        description: data.memo
                    }
                }
            });

            return payment;
        });

        if (!result) return { error: "Failed to record expense" };

        // 5. Post to Accounting (General Ledger)
        // This function should debit the Expense Account and credit Cash/Bank
        await AccountingService.postPaymentEntry(result.id, session.user.id);

        revalidatePath('/hms/reception/dashboard');
        revalidatePath('/hms/accounting/expenses');

        return { success: true, data: result };

    } catch (error: any) {
        console.error("Error recording expense:", error);
        return { error: error.message };
    }
}
