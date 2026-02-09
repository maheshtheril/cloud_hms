'use server'

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getTenant() {
    const session = await auth();

    // Optimization: Use session tenantId directly if available
    const tenantId = session?.user?.tenantId;
    if (!tenantId) {
        // Fallback for edge cases where session might be stale or incomplete
        if (!session?.user?.id) return null;
        const user = await prisma.app_user.findUnique({
            where: { id: session.user.id },
            select: { tenant_id: true }
        });
        if (!user?.tenant_id) return null;

        return await prisma.tenant.findUnique({
            where: { id: user.tenant_id }
        });
    }

    try {
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId }
        });

        return tenant;
    } catch (error) {
        console.error("Failed to fetch tenant:", error);
        return null;
    }
}
