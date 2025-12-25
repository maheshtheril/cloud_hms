
import { prisma } from "@/lib/prisma"

export async function ensureAccountingMenu() {
    try {
        // 1. Check if 'Accounting' menu exists (Check both structures)
        const existing = await prisma.menu_items.findFirst({
            where: {
                url: '/settings/accounting',

            }
        });

        // Update existing if it has a parent (orphan it to be visible)
        if (existing) {
            if (existing.parent_id) {
                console.log("Fixing hidden Accounting menu (removing parent nesting)...");
                await prisma.menu_items.update({
                    where: { id: existing.id },
                    data: { parent_id: null, module_key: 'configuration' }
                });
            }
            return;
        }

        // 2. Create as ROOT item (No Parent)
        // We do distinct 'module_key: configuration' so it groups correctly.

        // Find next sort order in configuration module? 
        // Or just general sort order.
        const lastItem = await prisma.menu_items.findFirst({
            orderBy: { sort_order: 'desc' }
        });
        const sortOrder = (lastItem?.sort_order || 0) + 10;

        await prisma.menu_items.create({
            data: {
                label: 'Accounting Config', // Distinct name
                url: '/settings/accounting',
                key: 'accounting-settings',
                module_key: 'configuration', // This ensures it lands in Config group
                icon: 'Calculator',
                parent_id: null, // Vital: Top Level
                sort_order: sortOrder,
                is_global: true
            }
        });
        console.log("Auto-seeded Accounting Menu (Top Level)");

    } catch (e) {
        console.error("Failed to auto-seed menu:", e);
    }
}
