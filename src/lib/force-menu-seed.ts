import { ensureHmsMenus } from './menu-seeder';
import { prisma } from './prisma';

async function main() {
    console.log("Forcing HMS Menu Seeding...");
    await ensureHmsMenus();
    console.log("HMS Menu Seeding Done. Checking verification...");

    // Verify one item
    const item = await prisma.menu_items.findFirst({ where: { key: 'hms-reception' } });
    console.log(`hms-reception permission: ${item?.permission_code}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
