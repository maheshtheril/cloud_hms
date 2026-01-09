'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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
