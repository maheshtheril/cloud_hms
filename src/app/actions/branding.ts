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
                    id: true,
                    app_name: true,
                    logo_url: true,
                    name: true,
                    metadata: true,
                    company_settings: {
                        select: {
                            company: {
                                select: {
                                    logo_url: true
                                }
                            }
                        }
                    }
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
                    id: true,
                    app_name: true,
                    logo_url: true,
                    name: true,
                    metadata: true,
                    company_settings: {
                        select: {
                            company: {
                                select: {
                                    logo_url: true
                                }
                            }
                        }
                    }
                }
            });
        }

        // 3. Fallback: Newest Tenant (System Default)
        if (!tenant) {
            tenant = await prisma.tenant.findFirst({
                orderBy: { created_at: 'desc' },
                select: {
                    id: true,
                    app_name: true,
                    logo_url: true,
                    name: true,
                    metadata: true,
                    company_settings: {
                        select: {
                            company: {
                                select: {
                                    logo_url: true
                                }
                            }
                        }
                    }
                }
            });
        }

        // --- PUBLIC REGISTRATION LOGIC ---
        const meta = (tenant?.metadata as any) || {};
        let isPublic = meta.registration_enabled !== false; // Default to true if not explicitly false

        // If not explicitly set in metadata, use hostname-based defaults
        if (meta.registration_enabled === undefined) {
            isPublic = [
                'cloud-hms.onrender.com',
                'localhost:3000',
                'seeakk.com',
                'www.seeakk.com',
                'seeakk.vercel.app'
            ].includes(host.toLowerCase()) || host.endsWith('.vercel.app');
        }

        // SPECIAL OVERRIDE: Seeakk.com branding or Env Var
        const appBrand = process.env.NEXT_PUBLIC_APP_BRAND?.toUpperCase();

        if (host.toLowerCase().includes('seeakk.com') || appBrand === 'SEEAKK') {
            return {
                app_name: "Seeakk CRM",
                logo_url: "/branding/seeakk_logo.png",
                name: "Seeakk Solutions",
                isPublic: isPublic
            };
        }

        if (appBrand === 'CLOUD_HMS') {
            return {
                app_name: "Cloud HMS",
                logo_url: null, // Will use default icon
                name: "Cloud Healthcare",
                isPublic: isPublic
            };
        }

        return {
            app_name: tenant?.app_name || null,
            logo_url: tenant?.logo_url || (tenant?.company_settings?.[0]?.company?.logo_url) || null,
            name: tenant?.name || null,
            isPublic
        };
    } catch (error) {
        console.error("Failed to fetch tenant branding:", error);
        return null; // Handle null gracefully in UI
    }
}
