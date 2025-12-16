
import { prisma } from "@/lib/prisma";

async function main() {
    console.log("Fetching menu items...");
    const menuItems = await prisma.menu_items.findMany({
        where: { parent_id: null },
        include: {
            other_menu_items: true,
        },
        orderBy: { sort_order: 'asc' },
    });

    console.log("Root Menu Items:", menuItems.length);
    for (const item of menuItems) {
        console.log(`- [${item.module_key}] ${item.label} (ID: ${item.id})`);
        if (item.other_menu_items && item.other_menu_items.length > 0) {
            for (const child of item.other_menu_items) {
                console.log(`  -> [${child.module_key}] ${child.label} (ID: ${child.id})`);
            }
        } else {
            console.log("  (No children)");
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
