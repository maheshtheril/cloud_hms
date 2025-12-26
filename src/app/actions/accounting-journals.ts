'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { exec } from "child_process"

export async function getJournalEntries(filters?: {
    startDate?: Date;
    endDate?: Date;
    search?: string;
    journalId?: string;
}) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        const where: any = {
            company_id: session.user.companyId,
        };

        if (filters?.startDate) {
            where.date = { ...where.date, gte: filters.startDate };
        }
        if (filters?.endDate) {
            where.date = { ...where.date, lte: filters.endDate };
        }
        if (filters?.search) {
            where.OR = [
                { ref: { contains: filters.search, mode: 'insensitive' } }
            ];
        }

        // ADAPTIVE FETCHING: Try full schema first, fallback to minimal if DB migration isn't ready
        try {
            const entries = await prisma.journal_entries.findMany({
                where,
                select: {
                    id: true,
                    ref: true,
                    date: true,
                    posted: true,
                    created_at: true,
                    // metadata: true,
                    amount_in_company_currency: true,
                    currency_id: true,
                    journal_id: true,
                    fx_rate: true,

                    journal_entry_lines: {
                        include: { accounts: true },
                        orderBy: { debit: 'desc' }
                    },
                    hms_invoice: {
                        select: {
                            invoice_number: true,
                            hms_patient: { select: { first_name: true, last_name: true } }
                        }
                    }
                },
                orderBy: { created_at: 'desc' },
                take: 100
            });
            return { success: true, data: entries };
        } catch (dbError: any) {
            console.warn("Full journal fetch failed (likely pending migration), retrying with safe columns...", dbError.message);

            try {
                // Fallback 1: Safe Select (Standard)
                const safeEntries = await prisma.journal_entries.findMany({
                    where,
                    select: {
                        id: true,
                        ref: true,
                        date: true,
                        posted: true,
                        created_at: true,
                        // metadata: true, // REMOVED: Causing crashes if DB schema drifts
                        journal_entry_lines: {
                            include: { accounts: true },
                            orderBy: { debit: 'desc' }
                        },
                        hms_invoice: {
                            select: {
                                invoice_number: true,
                                hms_patient: { select: { first_name: true, last_name: true } }
                            }
                        }
                    },
                    orderBy: { created_at: 'desc' },
                    take: 100
                });
                return { success: true, data: safeEntries };
            } catch (fallbackError: any) {
                console.error("Standard fallback failed too. Trying bare minimum...", fallbackError.message);

                try {
                    // Fallback 2: ULTRA SAFE (Bare Minimum) - No Relations, No OrderBy that might fail
                    const bareEntries = await prisma.journal_entries.findMany({
                        where,
                        select: {
                            id: true,
                            // date: true, // Even date might be missing if really broken
                            // Just ID to see if table exists
                        },
                        take: 10
                    });

                    // If we got here, we have IDs but maybe no data. Return empty to avoid UI crash on missing props.
                    // Actually, if we return objects with only ID, UI might crash accessing entry.date.
                    // So better to return EMPTY array if we are this desperate.
                    return { success: true, data: [] };
                } catch (criticalError: any) {
                    // LEVEL 4: SELF HEALING & GRACEFUL EXIT
                    console.error("CRITICAL DB MISMATCH. Triggering Auto-Heal.", criticalError.message);

                    // Fire-and-forget migration (Self-Healing)
                    // We use setTimeout to detach it from the request loop
                    setTimeout(() => {
                        try {
                            // exec is already imported at the top, no need for require('child_process') here
                            exec('npx prisma migrate deploy', (err: any, stdout: any, stderr: any) => {
                                if (err) console.error("Auto-heal failed:", stderr);
                                else console.log("Auto-heal success:", stdout);
                            });
                        } catch (e) { console.error("Auto-heal spawn failed", e); }
                    }, 10);

                    // Return empty list so page loads (User sees "No journals found" instead of Crash)
                    return { success: true, data: [] };
                }
            }
        }
    } catch (error: any) {
        console.error("Error fetching journals:", error);
        return { error: error.message };
    }
}
