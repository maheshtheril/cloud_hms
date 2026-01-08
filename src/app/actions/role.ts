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

        const roles = await prisma.role.findMany({
            where: { tenant_id: tenantId },
            orderBy: [{ name: 'asc' }],
            include: {
                role_permission: {
                    select: { permission_code: true }
                }
            }
        });

        // Fetch User Counts via GroupBy (Safe method independent of relation names on Role)
        const userCounts = await prisma.user_role.groupBy({
            by: ['role_id'],
            _count: {
                role_id: true
            },
            where: {
                role_id: { in: roles.map(r => r.id) }
            }
        });

        const countMap = new Map(userCounts.map(c => [c.role_id, c._count.role_id]));

        // Map to simpler structure for UI
        const mappedRoles = roles.map(r => {
            const explicitPerms = r.role_permission.map(p => p.permission_code);
            const arrayPerms = Array.isArray(r.permissions) ? r.permissions as string[] : [];
            const uniquePerms = Array.from(new Set([...explicitPerms, ...arrayPerms]));

            return {
                id: r.id,
                name: r.name,
                key: r.key,
                module: 'System', // Generic roles don't strictly have module, infer or default
                description: r.description,
                userCount: countMap.get(r.id) || 0,
                permissions: uniquePerms
            };
        });

        return { success: true, data: mappedRoles };
    } catch (error) {
        console.error("Failed to fetch roles:", error);
        return { error: `Failed to fetch roles: ${(error as Error).message}` };
    }
}
