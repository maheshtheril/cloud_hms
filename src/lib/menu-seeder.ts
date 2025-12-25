
import { prisma } from "@/lib/prisma"

export async function ensureAccountingMenu() {
    try {
        // 1. Check if 'Accounting' menu exists
        const existing = await prisma.menu_items.findFirst({
            where: { path: '/settings/accounting' }
        });

        if (existing) return;

        // 2. Find 'Settings' parent
        const settingsMenu = await prisma.menu_items.findFirst({
            where: {
                OR: [
                    { label: { contains: 'Settings', mode: 'insensitive' } },
                    { path: '/settings' }
                ]
            }
        });

        if (!settingsMenu) {
            console.warn("Parent 'Settings' menu not found. Skipping auto-seed.");
            return;
        }

        // 3. Create
        const lastChild = await prisma.menu_items.findFirst({
            where: { parent_id: settingsMenu.id },
            orderBy: { sort_order: 'desc' }
        });
        const sortOrder = (lastChild?.sort_order || 0) + 10;

        await prisma.menu_items.create({
            data: {
                label: 'Accounting',
                path: '/settings/accounting',
                icon: 'Calculator',
                parent_id: settingsMenu.id,
                sort_order: sortOrder,
                is_active: true
            }
        });
        console.log("Auto-seeded Accounting Menu");

    } catch (e) {
        console.error("Failed to auto-seed menu:", e);
    }
}
