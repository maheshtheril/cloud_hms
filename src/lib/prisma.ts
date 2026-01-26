import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: any };

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);

const basePrisma = new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
});

const modelsWithBranch = [
  'hms_appointments', 'hms_patient', 'global_stock_location', 'hms_invoice',
  'crm_leads', 'hms_encounter', 'hms_admission', 'hms_ward', 'journals',
  'doctor_note', 'business_partners', 'crm_contacts', 'crm_accounts',
  'crm_deals', 'prescription', 'hms_bed'
];

// Models that MUST stay in the main shared database (Shard Manager)
const globalModels = [
  'tenant', 'app_user', 'modules', 'tenant_module', 'company', 'country', 'currencies'
];

export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const modelLower = model.toLowerCase();

        // 1. Resolve Context (Tenant & Branch)
        let activeBranchId = null;
        let customDbUrl = null;
        let tenantId = null;

        try {
          const { auth } = await import('@/auth');
          const session = await auth();
          activeBranchId = session?.user?.current_branch_id;
          customDbUrl = session?.user?.dbUrl;
          tenantId = session?.user?.tenantId;
        } catch (e) { }

        // 2. Handle 'Bring Your Own Database' (BYOB)
        // If the tenant has a custom DB and the model is NOT a global system model
        if (customDbUrl && tenantId && !globalModels.includes(modelLower)) {
          const { getClientForTenant } = await import('./db-manager');
          const tenantClient = await getClientForTenant(tenantId, customDbUrl);

          if (tenantClient) {
            // Forward the query to the tenant-specific Prisma Client
            return (tenantClient as any)[model][operation](args);
          }
        }

        // 3. Handle Multi-Branch Filtering (Standard HMS Logic)
        if (modelsWithBranch.includes(modelLower) && activeBranchId) {
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
      },
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
