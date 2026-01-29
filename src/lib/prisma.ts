
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const basePrisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = basePrisma

// Models that support branch_id filtering
const modelsWithBranch = [
  'hms_appointments', 'hms_patient', 'global_stock_location', 'hms_invoice',
  'crm_leads', 'hms_encounter', 'hms_admission', 'hms_ward', 'journals',
  'doctor_note', 'business_partners', 'crm_contacts', 'crm_accounts',
  'crm_deals', 'prescription', 'hms_bed'
];

// Models that MUST stay in the main shared database (Platform Level)
const globalModels = [
  'tenant', 'app_user', 'modules', 'tenant_module', 'company', 'country', 'currencies', 'menu_items', 'hms_settings'
];

export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const modelLower = model.toLowerCase();
        const isSystemModel = globalModels.includes(modelLower);

        // 1. Resolve Context (Tenant & Branch)
        let activeBranchId = null;
        let customDbUrl = null;
        let tenantId = null;

        if (!isSystemModel) {
          try {
            // Use the established auth pattern to get session context
            const { auth } = await import('@/auth');
            const session = await auth();
            activeBranchId = session?.user?.current_branch_id;
            customDbUrl = session?.user?.dbUrl;
            tenantId = session?.user?.tenantId;
          } catch (e) {
            // Background contexts where auth is unavailable
          }
        }

        // 2. Handle 'Bring Your Own Database' (BYOB) for external tenants
        if (customDbUrl && tenantId && !isSystemModel) {
          try {
            const { getClientForTenant } = await import('./db-manager');
            const tenantClient = await getClientForTenant(tenantId, customDbUrl);

            if (tenantClient && (tenantClient as any)[model]) {
              return (tenantClient as any)[model][operation](args);
            }
          } catch (err) {
            console.error(`[Prisma Extension] DB Switch failed for tenant ${tenantId}. Falling back to main.`, err);
          }
        }

        // 3. Automated Multi-Branch Filtering
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
