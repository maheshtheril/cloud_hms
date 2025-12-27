'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getJournalEntries() {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        const entries = await prisma.journal_entries.findMany({
            where: {
                company_id: session.user.companyId
            },
            include: {
                journal_entry_lines: {
                    include: {
                        accounts: true
                    }
                },
                journals: true
            },
            orderBy: {
                date: 'desc'
            },
            take: 100
        });

        return { success: true, data: entries };
    } catch (error: any) {
        console.error("Error fetching journal entries:", error);
        return { error: error.message };
    }
}
