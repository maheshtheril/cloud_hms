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
                { ref: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } }
            ];
        }

        const entries = await prisma.journal_entries.findMany({
            where,
            include: {
                journal_entry_lines: {
                    include: {
                        accounts: true
                    },
                    orderBy: {
                        debit: 'desc' // Debits first usually
                    }
                },
                hms_invoice: {
                    select: {
                        invoice_number: true,
                        hms_patient: {
                            select: {
                                first_name: true,
                                last_name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            },
            take: 100
        });

        return { success: true, data: entries };
    } catch (error: any) {
        console.error("Error fetching journals:", error);
        return { error: error.message };
    }
}
