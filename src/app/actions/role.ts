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
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                key: true,
                permissions: true,
                _count: {
                    select: { role_permission: true }
                }
            }
        });

        return { success: true, data: roles };
    } catch (error) {
        console.error("Failed to fetch roles:", error);
        return { error: `Failed to fetch roles: ${(error as Error).message}` };
    }
}
