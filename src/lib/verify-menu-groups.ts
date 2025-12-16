
import { prisma } from "@/lib/prisma";

async function main() {
    console.log("Fetching active modules...");
    const activeModules = await prisma.modules.findMany({
        where: { is_active: true },
    });
    console.log(`Found ${activeModules.length} active modules.`);

    console.log("Fetching menu items...");
    const menuItems = await prisma.menu_items.findMany({
        where: { parent_id: null },
        orderBy: { sort_order: 'asc' },
        include: {
            other_menu_items: {
                orderBy: { sort_order: 'asc' },
                include: {
                    other_menu_items: {
                        orderBy: { sort_order: 'asc' }
                    }
                }
            },
            module_menu_map: {
                include: {
                    modules: true
                }
            }
        }
    });
    console.log(`Found ${menuItems.length} root menu items.`);

    // Group by module
    const grouped: Record<string, { module: any, items: any[] }> = {};

    const getModuleKey = (item: any) => {
        if (item.module_key) return item.module_key;
        if (item.module_menu_map && item.module_menu_map.length > 0) {
            return item.module_menu_map[0].module_key;
        }
        return 'general';
    };

    for (const mod of activeModules) {
        grouped[mod.module_key] = {
            module: mod,
            items: []
        };
    }
    if (!grouped['general']) {
        grouped['general'] = { module: { name: 'General', module_key: 'general' }, items: [] };
    }

    for (const item of menuItems) {
        const modKey = getModuleKey(item);
        if (grouped[modKey]) {
            grouped[modKey].items.push(item);
        } else {
            grouped['general'].items.push(item);
        }
    }

    const result = Object.values(grouped).filter(g => g.items.length > 0);

    console.log("\n--- Grouped Menu Structure ---");
    result.forEach(g => {
        console.log(`[Module: ${g.module.name} (${g.module.module_key})]`);
        g.items.forEach(item => {
            console.log(`  - ${item.label} (Children: ${item.other_menu_items.length})`);
            if (item.other_menu_items && item.other_menu_items.length > 0) {
                item.other_menu_items.forEach((child: any) => {
                    console.log(`    -> ${child.label} (Children: ${child.other_menu_items ? child.other_menu_items.length : 0})`);
                    if (child.other_menu_items && child.other_menu_items.length > 0) {
                        child.other_menu_items.forEach((grandChild: any) => {
                            console.log(`       -> ${grandChild.label}`);
                        });
                    }
                });
            }
        });
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
