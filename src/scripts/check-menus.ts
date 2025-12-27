
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking menu items...');
    const items = await prisma.menu_items.findMany({
        where: {
            OR: [
                { module_key: 'hms' },
                { module_key: 'accounting' }
            ]
        },
        orderBy: { sort_order: 'asc' }
    });

    console.log(`Found ${items.length} items.`);
    items.forEach(i => {
        console.log(`[${i.module_key}] ${i.label} (Key: ${i.key}, Parent: ${i.parent_id})`);
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
