
'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

/**
 * Get all permissions from the DATABASE (Dynamic)
 */
export async function getDynamicPermissions() {
    try {
        const permissions = await prisma.permission.findMany({
            orderBy: { category: 'asc' }
        });

        // Map to format expected by UI
        return {
            success: true,
            data: permissions.map(p => ({
                code: p.code,
                name: p.name,
                module: p.category || 'General' // Map category to module
            }))
        };
    } catch (error) {
        console.error("Failed to fetch permissions:", error);
        return { error: "Failed to fetch permissions" };
    }
}

/**
 * Create a new permission dynamically
 */
export async function createPermission(data: { code: string; name: string; category: string; description?: string }) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        const existing = await prisma.permission.findUnique({
            where: { code: data.code }
        });

        if (existing) {
            return { error: "Permission code already exists" };
        }

        const permission = await prisma.permission.create({
            data: {
                code: data.code,
                name: data.name,
                category: data.category,
                description: data.description
            }
        });

        revalidatePath('/settings/roles');
        revalidatePath('/settings/permissions');
        return { success: true, data: permission };

    } catch (error) {
        console.error("Failed to create permission:", error);
        return { error: "Failed to create permission" };
    }
}

/**
 * Delete a permission
 */
export async function deletePermission(code: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await prisma.permission.delete({
            where: { code }
        });

        revalidatePath('/settings/roles');
        revalidatePath('/settings/permissions');
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete permission" };
    }
}
