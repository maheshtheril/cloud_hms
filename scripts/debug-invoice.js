const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const columns = await prisma.$queryRaw`
            SELECT column_name, is_nullable, column_default, data_type
            FROM information_schema.columns
            WHERE table_name = 'hms_invoice'
            ORDER BY ordinal_position;
        `;
        console.log("COLUMNS FOR hms_invoice:");
        columns.forEach(c => {
            console.log(`${c.column_name.padEnd(25)} | ${c.is_nullable.padEnd(5)} | ${c.data_type}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
check();
