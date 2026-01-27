'use server'

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function getTenantBrandingByHost() {
    const headersList = await headers();
    const host = headersList.get('host') || '';

    // In local development, we might use a query param or default
    // In production, we'd lookup by host

    try {
        let tenant = await prisma.tenant.findFirst({
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

        // Fallback for temporary domains (like Render) or initial setup
        if (!tenant) {
            tenant = await prisma.tenant.findFirst({
                orderBy: { created_at: 'asc' },
                select: {
                    app_name: true,
                    logo_url: true,
                    name: true
                }
            });
        }

        const isPublic = host === 'cloud-hms.onrender.com' || host === 'localhost:3000' || !host;

        return {
            app_name: tenant?.app_name || null,
            logo_url: tenant?.logo_url || null,
            name: tenant?.name || null,
            isPublic
        };
    } catch (error) {
        console.error("Failed to fetch tenant branding:", error);
        return null;
    }
}
