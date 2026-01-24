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

// Models that support branch_id
const modelsWithBranch = [
  'hms_appointments', 'hms_patient', 'global_stock_location', 'hms_invoice',
  'crm_leads', 'hms_encounter', 'hms_admission', 'hms_ward', 'journals',
  'doctor_note', 'business_partners', 'crm_contacts', 'crm_accounts',
  'crm_deals', 'prescription', 'hms_bed'
];

export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        // Only run on models we've tagged as Branch-Aware
        if (modelsWithBranch.includes(model.toLowerCase())) {

          // Get session for branch context
          let activeBranchId = null;
          try {
            // Using dynamic import to avoid circular dependency: prisma -> auth -> prisma
            const { auth } = await import('@/auth');
            const session = await auth();
            activeBranchId = session?.user?.current_branch_id;
          } catch (e) {
            // Context where session is unavailable (e.g. background job, build time)
          }

          if (activeBranchId) {
            const anyArgs = args as any;
            // Apply filtering for read operations
            if (['findMany', 'findFirst', 'findUnique', 'count', 'aggregate', 'groupBy'].includes(operation)) {
              anyArgs.where = { ...anyArgs.where, branch_id: activeBranchId };
            }

            // Apply auto-injection for write operations
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
        }
        return query(args);
      },
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
