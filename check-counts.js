
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const poCount = await prisma.hms_purchase_order.count();
    const receiptCount = await prisma.hms_purchase_receipt.count();
    const invoiceCount = await prisma.hms_purchase_invoice.count();
    const billCount = await prisma.hms_purchase_invoice.count(); // same table

    console.log('--- Purchase Record Counts ---');
    console.log('Purchase Orders:', poCount);
    console.log('Purchase Receipts (Entries):', receiptCount);
    console.log('Purchase Invoices (Vendor Bills):', invoiceCount);

    // Check recent receipts for any metadata containing scanned file URLs
    const recentReceipts = await prisma.hms_purchase_receipt.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        select: { name: true, metadata: true, created_at: true }
    });
    console.log('\n--- Recent Receipts ---');
    console.log(JSON.stringify(recentReceipts, null, 2));

    // Check recent orders
    const recentOrders = await prisma.hms_purchase_order.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        select: { name: true, supplier_reference: true, created_at: true }
    });
    console.log('\n--- Recent Orders ---');
    console.log(JSON.stringify(recentOrders, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
