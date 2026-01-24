'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getCurrentShift() {
    const session = await auth();
    if (!session?.user?.id) return null;

    try {
        const shift = await prisma.hms_cash_shift.findFirst({
            where: {
                user_id: session.user.id,
                status: 'open'
            }
        });
        return shift;
    } catch (e) {
        console.error("Failed to fetch shift:", e);
        return null;
    }
}

export async function startShift(openingBalance: number) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const tenantId = session.user.tenantId;
    const companyId = session.user.companyId;

    if (!tenantId || !companyId) {
        return { error: "Tenant or Company information missing from session." };
    }

    try {
        const existing = await prisma.hms_cash_shift.findFirst({
            where: { user_id: session.user.id, status: 'open' }
        });
        if (existing) return { error: "You already have an open shift." };

        await prisma.hms_cash_shift.create({
            data: {
                tenant_id: tenantId,
                company_id: companyId,
                user_id: session.user.id,
                start_time: new Date(),
                opening_balance: openingBalance,
                status: 'open'
            }
        });
        revalidatePath('/hms/reception/dashboard');
        return { success: true };
    } catch (e) {
        return { error: (e as Error).message };
    }
}

export async function getShiftSummary(shiftId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const shift = await prisma.hms_cash_shift.findUnique({ where: { id: shiftId } });
    if (!shift) return { error: "Shift not found" };

    // 1. Fetch Collections (Inbound)
    const collections = await prisma.hms_invoice_payments.findMany({
        where: {
            created_by: session.user.id,
            created_at: { gte: shift.start_time },
        },
        include: {
            hms_invoice: { select: { invoice_number: true, hms_patient: { select: { first_name: true, last_name: true } } } }
        },
        orderBy: { created_at: 'desc' }
    });

    // 2. Fetch Expenses (Outbound)
    const expenses = await prisma.payments.findMany({
        where: {
            created_by: session.user.id,
            metadata: { path: ['type'], equals: 'outbound' },
            created_at: { gte: shift.start_time }
        },
        orderBy: { created_at: 'desc' }
    });

    // 3. Calculate Summaries
    const summary = {
        cashCollected: 0,
        cashExpenses: 0,
        card: 0,
        upi: 0,
        other: 0,
        totalIn: 0,
        totalOut: 0,
        netCash: 0 // (Opening + CashIn) - CashOut
    };

    // Process Collections
    collections.forEach(p => {
        const amt = Number(p.amount || 0);
        summary.totalIn += amt;
        if (p.method === 'cash') summary.cashCollected += amt;
        else if (p.method === 'card') summary.card += amt;
        else if (p.method === 'upi') summary.upi += amt;
        else summary.other += amt;
    });

    // Process Expenses (Assuming mostly cash for petty cash, but tracking method if available)
    expenses.forEach(e => {
        const amt = Number(e.amount || 0);
        summary.totalOut += amt;
        // Defaulting to cash for expenses unless method specifies otherwise (which is typical for petty cash)
        // Adjust if your expense model has methods. For now assuming all outbound user expenses are cash drawer.
        summary.cashExpenses += amt;
    });

    // Net Cash in Drawer = Cash Collected - Cash Expenses
    // Note: Opening balance is added in the UI/Final calc usually, but here we provide the movement.
    summary.netCash = summary.cashCollected - summary.cashExpenses;

    // 4. Generate Unified Ledger
    const ledger = [
        ...collections.map(c => ({
            id: c.id,
            time: c.created_at,
            type: 'IN', // INCOME
            method: c.method,
            amount: Number(c.amount),
            description: `Inv #${c.hms_invoice?.invoice_number} - ${c.hms_invoice?.hms_patient?.first_name} ${c.hms_invoice?.hms_patient?.last_name}`,
            category: 'Collection'
        })),
        ...expenses.map(e => ({
            id: e.id,
            time: e.created_at,
            type: 'OUT', // EXPENSE
            method: 'cash', // Assumed for now
            amount: Number(e.amount),
            description: (e.metadata as any)?.description || (e.metadata as any)?.notes || 'Expense',
            category: (e.metadata as any)?.category || 'Petty Cash'
        }))
    ].sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime());


    return { success: true, summary, shift, ledger };
}

export async function closeShift(shiftId: string, closingCash: number, denominations: any) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const { summary } = await getShiftSummary(shiftId) as any;
    if (!summary) return { error: "Failed to calc summary" };

    const shift = await prisma.hms_cash_shift.findUnique({ where: { id: shiftId } });
    if (!shift) return { error: "Shift not found" };

    const systemCash = Number(shift.opening_balance) + summary.netCash;
    const diff = closingCash - systemCash;

    await prisma.hms_cash_shift.update({
        where: { id: shiftId },
        data: {
            end_time: new Date(),
            closing_balance: closingCash,
            system_balance: systemCash,
            difference: diff,
            denominations: denominations,
            status: 'closed'
        }
    });

    revalidatePath('/hms/reception/dashboard');
    return { success: true };
}

export async function getShiftHistory() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        const shifts = await prisma.hms_cash_shift.findMany({
            where: {
                user_id: session.user.id,
                status: 'closed'
            },
            orderBy: {
                end_time: 'desc'
            },
            take: 10
        });

        return { success: true, shifts };
    } catch (e) {
        return { error: (e as Error).message };
    }
}
