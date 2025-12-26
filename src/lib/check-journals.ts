import { prisma } from "@/lib/prisma"

async function main() {
    console.log('Checking Journal Entries...');
    try {
        const count = await prisma.journal_entries.count();
        console.log(`Total Journal Entries: ${count}`);

        const entries = await prisma.journal_entries.findMany({
            take: 5,
            orderBy: { created_at: 'desc' },
            include: { journal_entry_lines: true }
        });
        console.log('Latest Entries:', JSON.stringify(entries, null, 2));

        // Check invoices needing posting
        const invoices = await prisma.hms_invoice.findMany({
            where: {
                status: { in: ['posted', 'paid'] }
            },
            orderBy: { created_at: 'desc' },
            take: 5
        });
        console.log('Latest Posted Invoices:', JSON.stringify(invoices.map(i => ({ id: i.id, no: i.invoice_number, status: i.status, total: i.total })), null, 2));

    } catch (e) {
        console.error(e);
    }
}

main();
