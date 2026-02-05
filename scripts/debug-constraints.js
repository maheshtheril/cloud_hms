
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking hms_invoice table structure...");
        const columns = await prisma.$queryRaw`
      SELECT 
        column_name, 
        is_nullable, 
        column_default, 
        data_type
      FROM information_schema.columns 
      WHERE table_name = 'hms_invoice'
      ORDER BY ordinal_position;
    `;
        console.log("HMS_INVOICE COLUMNS:");
        console.table(columns);

        console.log("\nChecking hms_invoice_lines table structure...");
        const lineColumns = await prisma.$queryRaw`
      SELECT 
        column_name, 
        is_nullable, 
        column_default, 
        data_type
      FROM information_schema.columns 
      WHERE table_name = 'hms_invoice_lines'
      ORDER BY ordinal_position;
    `;
        console.log("HMS_INVOICE_LINES COLUMNS:");
        console.table(lineColumns);

        console.log("\nChecking hms_invoice_payments table structure...");
        const paymentColumns = await prisma.$queryRaw`
      SELECT 
        column_name, 
        is_nullable, 
        column_default, 
        data_type
      FROM information_schema.columns 
      WHERE table_name = 'hms_invoice_payments'
      ORDER BY ordinal_position;
    `;
        console.log("HMS_INVOICE_PAYMENTS COLUMNS:");
        console.table(paymentColumns);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
