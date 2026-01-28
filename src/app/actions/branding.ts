'use server'

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function getTenantBrandingByHost(slugOverride?: string) {
    const headersList = await headers();
    const host = headersList.get('host') || '';

    try {
        let tenant = null;

        // 1. Priority: Manual Query Param Override (?org=slug)
        if (slugOverride) {
            tenant = await prisma.tenant.findFirst({
                where: { slug: slugOverride },
                select: {
                    app_name: true,
                    logo_url: true,
                    name: true
                }
            });
        }

        // 2. Priority: Hostname Lookup
        if (!tenant) {
            tenant = await prisma.tenant.findFirst({
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
        }

        // 3. Fallback: Newest Tenant (System Default)
        if (!tenant) {
            tenant = await prisma.tenant.findFirst({
                orderBy: { created_at: 'desc' },
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
        return null; // Handle null gracefully in UI
    }
}
