
import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function main() {
    try {
        console.log("--- DEBUGGING DATA EXISTENCE ---");

        const invoices = await prisma.hms_purchase_invoice.findMany({ take: 5 });
        console.log("Invoices count:", await prisma.hms_purchase_invoice.count());
        console.log("First 5 Invoices:", invoices);

        const receipts = await prisma.hms_purchase_receipt.findMany({ take: 5 });
        console.log("Receipts count:", await prisma.hms_purchase_receipt.count());
        console.log("First 5 Receipts:", receipts);

        const orders = await prisma.hms_purchase_order.findMany({ take: 5 });
        console.log("Orders count:", await prisma.hms_purchase_order.count());
        console.log("First 5 Orders:", orders);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
