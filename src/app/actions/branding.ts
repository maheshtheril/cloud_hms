'use server'

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function getTenantBrandingByHost() {
    const headersList = await headers();
    const host = headersList.get('host') || '';

    // In local development, we might use a query param or default
    // In production, we'd lookup by host

    try {
        const tenant = await prisma.tenant.findFirst({
            where: {
                OR: [
                    { domain: host },
                    { slug: host.split('.')[0] }
                ]
            },
            select: {
                app_name: true,
                logo_url: true,
                name: true
            }
        });

        return tenant;
    } catch (error) {
        console.error("Failed to fetch tenant branding:", error);
        return null;
    }
}
