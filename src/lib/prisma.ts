import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

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
          // Note: In server actions/routes we can get this. 
          // For now, we'll try to get it if available.
          const session = await auth();
          const activeBranchId = session?.user?.current_branch_id;

          if (activeBranchId) {
            // Apply filtering for read operations
            if (['findMany', 'findFirst', 'findUnique', 'count', 'aggregate', 'groupBy'].includes(operation)) {
              args.where = { ...args.where, branch_id: activeBranchId };
            }

            // Apply auto-injection for write operations
            if (['create', 'createMany'].includes(operation)) {
              if (args.data) {
                if (Array.isArray(args.data)) {
                  args.data = args.data.map((item: any) => ({ ...item, branch_id: activeBranchId }));
                } else {
                  args.data = { ...args.data, branch_id: activeBranchId };
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
