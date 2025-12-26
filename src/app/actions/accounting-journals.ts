'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

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
                    metadata: true,
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
                        metadata: true,
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

                // Fallback 2: ULTRA SAFE (Bare Minimum)
                const bareEntries = await prisma.journal_entries.findMany({
                    where,
                    select: {
                        id: true,
                        date: true,
                        created_at: true,
                        // NO metadata, No posted, No ref

                        journal_entry_lines: {
                            select: {
                                id: true,
                                debit: true,
                                credit: true,
                                accounts: { select: { name: true, code: true } } // Minimal account info
                            }
                        }
                    },
                    orderBy: { created_at: 'desc' },
                    take: 100
                });
                return { success: true, data: bareEntries };
            }
        }
    } catch (error: any) {
        console.error("Error fetching journals:", error);
        return { error: error.message };
    }
}
