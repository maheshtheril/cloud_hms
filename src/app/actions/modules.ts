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

export async function createModule(data: { key: string; name: string; description?: string }) {
    try {
        const session = await auth();
        // Check Admin?

        const key = data.key.toLowerCase().trim().replace(/[^a-z0-9]/g, ''); // alphanumeric only

        if (!key || !data.name) return { error: "Key and Name are required" };

        const existing = await prisma.modules.findUnique({ where: { module_key: key } });
        if (existing) return { error: "Module with this key already exists" };

        await prisma.modules.create({
            data: {
                module_key: key,
                name: data.name,
                description: data.description || 'Custom Module',
                is_active: true
            }
        });

        // Auto-subscribe the creator's company/tenant to this new module?
        // Usually good practice for immediate visibility.
        if (session?.user?.tenantId) {
            // Check if already subscribed
            // ...
            // For now, let's keep it pure DB insert. Tenant subscription involves billing logic usually.
            // But for manual "System" usage, we might want to auto-enable.
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to create module:", error);
        return { error: "Failed to create module" };
    }
}
