const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const tables = ['hms_invoice', 'hms_invoice_lines', 'hms_invoice_payments'];

    for (const table of tables) {
        console.log(`\n--- DB SCHEMA CHECK (${table}) ---`);
        try {
            const columns = await prisma.$queryRawUnsafe(`
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = '${table}'
                ORDER BY column_name
            `);
            console.table(columns);
        } catch (err) {
            console.error(`Query failed for ${table}:`, err);
        }
    }
    await prisma.$disconnect();
}

check();
