'use server'

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getTenant() {
    const session = await auth();
    if (!session?.user?.id) return null;

    try {
        const user = await prisma.app_user.findUnique({
            where: { id: session.user.id },
            select: { tenant_id: true }
        });

        if (!user) return null;

        const tenant = await prisma.tenant.findUnique({
            where: { id: user.tenant_id }
        });

        return tenant;
    } catch (error) {
        console.error("Failed to fetch tenant:", error);
        return null;
    }
}
