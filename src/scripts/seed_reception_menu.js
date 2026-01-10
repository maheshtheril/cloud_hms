
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Receptionist Menu Item...");

    const item = {
        key: 'hms-reception',
        label: 'Reception',
        url: '/hms/reception/dashboard',
        icon: 'MonitorCheck',
        sort_order: 12,
        permission_code: 'hms:dashboard:reception',
        module_key: 'hms',
        is_global: true
    };

    const existing = await prisma.menu_items.findFirst({
        where: { key: item.key }
    });

    if (!existing) {
        console.log("Creating menu item...");
        await prisma.menu_items.create({
            data: item
        });
        console.log("Created.");
    } else {
        console.log("Updating menu item...");
        await prisma.menu_items.update({
            where: { id: existing.id },
            data: {
                permission_code: item.permission_code,
                module_key: 'hms',
                url: item.url
            }
        });
        console.log("Updated.");
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
