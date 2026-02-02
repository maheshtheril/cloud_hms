import { MetadataRoute } from 'next'
import { getTenantBrandingByHost } from './actions/branding'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const branding = await getTenantBrandingByHost();
    const appName = branding?.app_name || branding?.name || "Cloud HMS";
    const shortName = (branding?.app_name || "HMS").substring(0, 12);

    return {
        name: appName,
        short_name: shortName,
        description: 'Enterprise Hospital Management System',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4f46e5',
        icons: [
            {
                src: branding?.logo_url || '/branding/ziona_logo.png',
                sizes: 'any',
                type: 'image/png',
            },
            {
                src: '/branding/ziona_logo.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/branding/ziona_logo.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
