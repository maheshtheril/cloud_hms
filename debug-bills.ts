
import 'dotenv/config';
import { prisma } from './src/lib/prisma';
import { getOutstandingPurchaseBills } from './src/app/actions/accounting/helpers';

async function main() {
    try {
        // 1. Get a supplier who has invoices
        const invoice = await prisma.hms_purchase_invoice.findFirst({
            where: { status: { not: 'draft' } },
            select: { supplier_id: true, company_id: true }
        });

        if (!invoice || !invoice.supplier_id) {
            console.log("No non-draft invoice found to test.");
            const allInvoices = await prisma.hms_purchase_invoice.findMany({ take: 5 });
            console.log("Any invoices:", allInvoices);
            return;
        }

        const supplierId = invoice.supplier_id;
        console.log(`Testing with Supplier ID: ${supplierId} (Company: ${invoice.company_id})`);

        // 2. Run the actual function
        // Mock auth? The function uses 'auth()' which won't work in script. 
        // We will mock the Prisma call the function makes instead or just copy the logic.

        console.log("--- Simulating Logic ---");

        // Attempt the problematic query
        try {
            const rawBills = await prisma.hms_purchase_invoice.findMany({
                where: {
                    supplier_id: supplierId,
                    status: { not: 'draft' },
                    // Intentionally REMOVING the suspect line to see what we get raw
                },
                select: { id: true, total_amount: true, paid_amount: true, status: true, name: true }
            });
            console.log("Raw Bills Found:", rawBills.length);
            rawBills.forEach(b => {
                console.log(`- Bill ${b.name}: Total ${b.total_amount}, Paid ${b.paid_amount}, Status ${b.status}`);
                console.log(`  Outstanding Check: ${Number(b.total_amount)} > ${Number(b.paid_amount)} = ${Number(b.total_amount) > Number(b.paid_amount)}`);
            });

        } catch (e) {
            console.error("Query Error:", e);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
