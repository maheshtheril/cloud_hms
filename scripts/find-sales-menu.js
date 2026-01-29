
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- FINDING SALES ORDERS ---');
    const items = await prisma.menu_items.findMany({
        where: {
            OR: [
                { label: { contains: 'Sales Orders', mode: 'insensitive' } },
                { key: { contains: 'sales', mode: 'insensitive' } }
            ]
        }
    });
    console.log(JSON.stringify(items, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
