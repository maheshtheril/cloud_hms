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
            // Normalize host: Remove 'www.' and common port suffixes for local testing
            const cleanHost = host.toLowerCase().replace(/^www\./, '').split(':')[0];
            const hostParts = cleanHost.split('.');
            const firstPart = hostParts[0];

            tenant = await prisma.tenant.findFirst({
                where: {
                    OR: [
                        { domain: cleanHost },
                        { domain: host }, // Exact match as fallback
                        { slug: firstPart }
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

        const isPublic = [
            'cloud-hms.onrender.com',
            'localhost:3000',
            'seeakk.com',
            'www.seeakk.com',
            'seeakk.vercel.app'
        ].includes(host.toLowerCase()) || host.endsWith('.vercel.app');

        // SPECIAL OVERRIDE: Seeakk.com branding
        if (host.toLowerCase().includes('seeakk.com')) {
            return {
                app_name: "Seeakk CRM",
                logo_url: "/branding/seeakk_logo.png",
                name: "Seeakk Solutions",
                isPublic
            };
        }

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
