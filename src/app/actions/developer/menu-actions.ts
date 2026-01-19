
'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getAllMenus() {
    const session = await auth();
    // Security: Only allow super admin or dev (simplified for now as requested "developer only")
    // In production, add strict checks here.

    try {
        const menus = await prisma.menu_items.findMany({
            orderBy: { sort_order: 'asc' },
            include: {
                parent: true,
                // We'll fetch module details or join them if needed, but for now raw keys are fine
            }
        });

        // Also fetch modules for the dropdown
        const modules = await prisma.modules.findMany({
            orderBy: { name: 'asc' }
        });

        return { menus, modules };
    } catch (error) {
        console.error("Failed to fetch menus:", error);
        return { menus: [], modules: [] };
    }
}

export async function upsertMenu(data: any) {
    try {
        const payload = {
            label: data.label,
            url: data.url,
            key: data.key,
            icon: data.icon,
            module_key: data.module_key,
            permission_code: data.permission_code || null,
            parent_id: data.parent_id === 'root' ? null : data.parent_id,
            is_global: data.is_global ?? true,
            sort_order: parseInt(data.sort_order || '0'),
        };

        if (data.id) {
            await prisma.menu_items.update({
                where: { id: data.id },
                data: payload
            });
        } else {
            // Check duplicacy
            const existing = await prisma.menu_items.findFirst({ where: { key: data.key } });
            if (existing) return { error: "Menu Key already exists!" };

            await prisma.menu_items.create({
                data: payload
            });
        }
        revalidatePath('/developer/menus');
        return { success: true };
    } catch (error) {
        console.error("Upsert failed:", error);
        return { error: "Failed to save menu item" };
    }
}

export async function deleteMenu(id: string) {
    try {
        await prisma.menu_items.delete({ where: { id } });
        revalidatePath('/developer/menus');
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete. Ensure it has no children." };
    }
}
