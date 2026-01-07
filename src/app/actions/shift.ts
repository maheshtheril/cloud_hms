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

    const payments = await prisma.hms_invoice_payments.groupBy({
        by: ['method'],
        where: {
            created_by: session.user.id,
            created_at: { gte: shift.start_time },
        },
        _sum: { amount: true }
    });

    const summary = {
        cash: 0,
        card: 0,
        upi: 0,
        other: 0,
        total: 0
    };

    payments.forEach(p => {
        const amt = Number(p._sum.amount || 0);
        summary.total += amt;
        if (p.method === 'cash') summary.cash += amt;
        else if (p.method === 'card') summary.card += amt;
        else if (p.method === 'upi') summary.upi += amt;
        else summary.other += amt;
    });

    return { success: true, summary, shift };
}

export async function closeShift(shiftId: string, closingCash: number, denominations: any) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const { summary } = await getShiftSummary(shiftId) as any;
    if (!summary) return { error: "Failed to calc summary" };

    const shift = await prisma.hms_cash_shift.findUnique({ where: { id: shiftId } });
    if (!shift) return { error: "Shift not found" };

    const systemCash = Number(shift.opening_balance) + summary.cash;
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
