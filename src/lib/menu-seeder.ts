
import { prisma } from "@/lib/prisma"

export async function ensureAccountingMenu() {
    try {
        // 1. Check if 'Accounting' menu exists
        const existing = await prisma.menu_items.findFirst({
            where: {
                url: '/settings/accounting',
            }
        });

        // Update existing to ensure it is in HMS module
        if (existing) {
            if (existing.module_key !== 'hms' || existing.parent_id) {
                console.log("Moving Accounting menu to HMS module...");
                await prisma.menu_items.update({
                    where: { id: existing.id },
                    data: {
                        module_key: 'hms',
                        parent_id: null
                    }
                });
            }
            return;
        }

        // 2. Create as ROOT item in HMS Module
        const lastItem = await prisma.menu_items.findFirst({
            orderBy: { sort_order: 'desc' }
        });
        const sortOrder = (lastItem?.sort_order || 0) + 10;

        await prisma.menu_items.create({
            data: {
                label: 'Accounting Config',
                url: '/settings/accounting',
                key: 'accounting-settings',
                module_key: 'hms', // Moved to HMS as requested
                icon: 'Calculator',
                parent_id: null,
                sort_order: sortOrder,
                is_global: true
            }
        });
        console.log("Auto-seeded Accounting Menu (HMS Module)");

    } catch (e) {
        console.error("Failed to auto-seed menu:", e);
    }
}
