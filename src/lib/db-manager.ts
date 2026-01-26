import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const clientCache = new Map<string, any>();

export async function getClientForTenant(tenantId: string, dbUrl?: string) {
    if (!dbUrl) return null; // Use main client

    const cacheKey = `${tenantId}-${dbUrl}`;
    if (clientCache.has(cacheKey)) {
        return clientCache.get(cacheKey);
    }

    console.log(`[DB Manager] Initializing custom connection for tenant: ${tenantId}`);

    const pool = new Pool({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    });

    const adapter = new PrismaPg(pool);
    const rawClient = new PrismaClient({
        adapter,
        log: ['error', 'warn'],
    });

    // Apply the same multi-branch logic to the tenant-specific client
    const client = rawClient.$extends({
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    const modelsWithBranch = [
                        'hms_appointments', 'hms_patient', 'global_stock_location', 'hms_invoice',
                        'crm_leads', 'hms_encounter', 'hms_admission', 'hms_ward', 'journals',
                        'doctor_note', 'business_partners', 'crm_contacts', 'crm_accounts',
                        'crm_deals', 'prescription', 'hms_bed'
                    ];

                    let activeBranchId = null;
                    try {
                        const { auth } = await import('@/auth');
                        const session = await auth();
                        activeBranchId = session?.user?.current_branch_id;
                    } catch (e) { }

                    if (modelsWithBranch.includes(model.toLowerCase()) && activeBranchId) {
                        const anyArgs = args as any;
                        if (['findMany', 'findFirst', 'findUnique', 'count', 'aggregate', 'groupBy'].includes(operation)) {
                            anyArgs.where = { ...anyArgs.where, branch_id: activeBranchId };
                        }
                        if (['create', 'createMany'].includes(operation)) {
                            if (anyArgs.data) {
                                if (Array.isArray(anyArgs.data)) {
                                    anyArgs.data = anyArgs.data.map((item: any) => ({ ...item, branch_id: activeBranchId }));
                                } else {
                                    anyArgs.data = { ...anyArgs.data, branch_id: activeBranchId };
                                }
                            }
                        }
                    }
                    return query(args);
                }
            }
        }
    });

    clientCache.set(cacheKey, client);
    return client;
}

export function clearClientCache() {
    // Logic to close pools before clearing
    for (const client of clientCache.values()) {
        client.$disconnect();
    }
    clientCache.clear();
}
