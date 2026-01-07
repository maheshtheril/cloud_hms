
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$queryRaw`SELECT 1 FROM hms_cash_shift LIMIT 1`;
        console.log("TABLE_EXISTS");
    } catch (e) {
        console.log("TABLE_MISSING", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
