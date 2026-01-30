'use server'

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function getTenantBrandingByHost(slugOverride?: string) {
    const headersList = await headers();
    const host = headersList.get('host') || '';

    // PLATFORM OPTIMIZATION: Check Hardcoded Brands FIRST to skip DB latency
    // 1. ZIONA (Default for cloud-hms)
    const appBrand = process.env.NEXT_PUBLIC_APP_BRAND?.toUpperCase();
    if (appBrand === 'ZIONA' || appBrand === 'CLOUD_HMS' || host.toLowerCase().includes('cloud-hms')) {
        return {
            app_name: "Ziona HMS",
            logo_url: "/ziona.png",
            name: "Ziona Health",
            isPublic: true // Always public for main site
        };
    }

    // 2. SEEAKK
    if (host.toLowerCase().includes('seeakk.com') || appBrand === 'SEEAKK') {
        return {
            app_name: "Seeakk CRM",
            logo_url: "/branding/seeakk_logo.png",
            name: "Seeakk Solutions",
            isPublic: true
        };
    }

    try {
        let tenant = null;

        // 3. Database Lookup for Custom Tenants
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

        // ... rest of DB logic ...

        // 4. Hostname Lookup (Only if not hardcoded above)
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

        // 5. Fallback: Newest Tenant (System Default)
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
        const isPublic = meta.registration_enabled !== false;

        return {
            app_name: tenant?.app_name || null,
            logo_url: tenant?.logo_url || (tenant?.company_settings?.[0]?.company?.logo_url) || null,
            name: tenant?.name || null,
            isPublic
        };
    } catch (error) {
        console.error("Failed to fetch tenant branding:", error);
        return null;
    }
}
