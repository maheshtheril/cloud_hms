'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getRoles() {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Unauthorized: No active session" };
    }

    if (!session.user.tenantId) {
        console.error("Session missing tenantId:", session.user);
        return { error: "Unauthorized: No tenant ID found in session. Please log out and log in again." };
    }

    try {
        const tenantId = session.user.tenantId;

        const roles = await prisma.hms_role.findMany({
            where: { tenant_id: tenantId },
            orderBy: [{ module: 'asc' }, { name: 'asc' }],
            select: {
                id: true,
                name: true,
                module: true,
                description: true,
                hms_role_permissions: {
                    select: { permission: true }
                },
                _count: {
                    select: { hms_user_roles: true }
                }
            }
        });

        // Map to simpler structure for UI
        const mappedRoles = roles.map(r => ({
            id: r.id,
            name: r.name,
            key: r.name.toLowerCase().replace(/\s+/g, '_'), // Generate a key on fly
            module: r.module,
            description: r.description,
            userCount: r._count.hms_user_roles,
            permissions: r.hms_role_permissions.map(p => p.permission)
        }));

        return { success: true, data: mappedRoles };
    } catch (error) {
        console.error("Failed to fetch roles:", error);
        return { error: `Failed to fetch roles: ${(error as Error).message}` };
    }
}
