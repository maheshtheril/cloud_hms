
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- ALL MENU ITEMS ---');
    const items = await prisma.menu_items.findMany({
        select: {
            id: true,
            label: true,
            key: true,
            module_key: true,
            url: true,
            parent_id: true
        }
    });
    console.log(JSON.stringify(items, null, 2));

    console.log('--- TENANT MODULES (seeakk) ---');
    const tenant = await prisma.tenant.findFirst({ where: { slug: 'seeakk' } });
    if (tenant) {
        const mods = await prisma.tenant_module.findMany({ where: { tenant_id: tenant.id } });
        console.log(JSON.stringify(mods, null, 2));
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
