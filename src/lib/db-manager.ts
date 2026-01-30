import { PrismaClient } from '@prisma/client';

const clientCache = new Map<string, any>();

export async function getClientForTenant(tenantId: string, dbUrl?: string) {
    // Temporarily disabled for Prisma 6 compatibility
    // Multi-tenant database switching requires Prisma 7+ with adapters
    return null;
}

export function clearClientCache() {
    // Logic to close pools before clearing
    for (const client of clientCache.values()) {
        client.$disconnect();
    }
    clientCache.clear();
}
