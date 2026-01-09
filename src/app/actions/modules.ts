'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

import { getAllPermissions } from "./rbac";

export async function getActiveModules() {
    try {
        const session = await auth();
        // Allow public read or check admin? 
        // For settings page, usually admin.

        const modules = await prisma.modules.findMany({
            where: { is_active: true },
            orderBy: { name: 'asc' }
        });

        return { success: true, data: modules };
    } catch (error) {
        console.error("Failed to fetch modules:", error);
        return { error: "Failed to fetch modules" };
    }
}

export async function syncMissingModules() {
    try {
        const session = await auth();
        if (!session?.user) return { error: "Unauthorized" };

        // 1. Get all known permissions (Code + DB)
        const permResult = await getAllPermissions();
        if (!permResult.success || !permResult.data) return { error: "Failed to fetch permissions" };

        const usedCategories = new Set(permResult.data.map((p: any) => p.module));

        // 2. Get existing DB modules
        const existingModules = await prisma.modules.findMany();
        const existingKeys = new Set(existingModules.map(m => m.module_key.toLowerCase()));

        // 3. Find missing and insert
        let addedCount = 0;
        for (const cat of Array.from(usedCategories) as string[]) {
            const key = cat.toLowerCase();
            if (!existingKeys.has(key)) {
                console.log(`Auto-creating module for category: ${cat}`);
                await prisma.modules.create({
                    data: {
                        module_key: key,
                        name: cat, // Use the proper casing for Name
                        description: 'Auto-generated from permission usage',
                        is_active: true
                    }
                });
                addedCount++;
            }
        }

        if (addedCount > 0) {
            // Re-fetch to return latest list? Or just return success.
            return { success: true, added: addedCount };
        }
        return { success: true, added: 0 };

    } catch (error) {
        console.error("Failed to sync modules:", error);
        return { error: "Failed to sync modules" };
    }
}
