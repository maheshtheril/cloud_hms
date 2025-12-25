
import { prisma } from "@/lib/prisma"

export async function ensureDefaultJournals(companyId: string, tenantId: string) {
    // Define standard types of journals required for a basic setup
    const defaultJournals = [
        { name: "Customer Invoices", code: "INV", type: "sale" },
        { name: "Vendor Bills", code: "BILL", type: "purchase" },
        { name: "Bank Operations", code: "BNK", type: "bank" },
        { name: "Cash Operations", code: "CSH", type: "cash" },
        { name: "General Operations", code: "GEN", type: "general" }, // Miscellaneous
    ];

    for (const journal of defaultJournals) {
        // Upsert to ensure we don't duplicate based on (company_id, code) or similar unique constraint
        // Assuming @@unique([company_id, code]) or checking existence manually if not

        const existing = await prisma.journals.findFirst({
            where: {
                company_id: companyId,
                code: journal.code
            }
        });

        if (!existing) {
            await prisma.journals.create({
                data: {
                    tenant_id: tenantId,
                    company_id: companyId,
                    name: journal.name,
                    code: journal.code,
                    type: journal.type
                }
            })
        }
    }
}
