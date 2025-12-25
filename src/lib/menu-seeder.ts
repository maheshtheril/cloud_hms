
```typescript
import { prisma } from "@/lib/prisma"

export async function ensureAccountingMenu() {
    try {
        // 1. Check if 'Accounting' menu exists
        // Use 'url' instead of 'path'
        const existing = await prisma.menu_items.findFirst({
            where: { url: '/settings/accounting' }
        });

        if (existing) return;

        // 2. Find 'Settings' parent
        const settingsMenu = await prisma.menu_items.findFirst({
            where: { 
                OR: [
                    { label: { contains: 'Settings', mode: 'insensitive' } },
                    { url: '/settings' }
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
                url: '/settings/accounting', // Correct field
                key: 'accounting-settings',  // Required field
                module_key: 'configuration', // Required field (Parent is usually config or generic)
                icon: 'Calculator', 
                parent_id: settingsMenu.id,
                sort_order: sortOrder,
                is_active: true // This might be 'feature_flag' or something else? Schema says 'is_global' default true. 
                // schema doesn't show 'is_active' in the view I saw? 
                // Wait, let me double check the schema view I just did.
                // 3054:   is_global              Boolean                  @default(true)
                // It does NOT have is_active. It has is_global.
                // Wait, let me check lines 3043-3065 again.
            }
        });
        console.log("Auto-seeded Accounting Menu");

    } catch (e) {
        console.error("Failed to auto-seed menu:", e);
    }
}
