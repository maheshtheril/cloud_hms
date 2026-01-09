const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PERMISSIONS = [
    // HMS
    { code: 'hms:dashboard:view', name: 'View HMS Dashboard', category: 'HMS' },
    { code: 'hms:reception:view', name: 'View Reception Dashboard', category: 'HMS' },
    { code: 'hms:patients:view', name: 'View Patients', category: 'HMS' },
    { code: 'hms:patients:create', name: 'Create Patients', category: 'HMS' },
    { code: 'hms:patients:edit', name: 'Edit Patients', category: 'HMS' },
    { code: 'hms:appointments:view', name: 'View Appointments', category: 'HMS' },
    { code: 'hms:doctors:view', name: 'View Doctor Directory', category: 'HMS' },
    { code: 'hms:nursing:view', name: 'View Nursing Station', category: 'HMS' },

    // CRM
    { code: 'crm:dashboard:view', name: 'View CRM Dashboard', category: 'CRM' },
    { code: 'crm:leads:view', name: 'View Leads', category: 'CRM' },
    { code: 'crm:deals:view', name: 'View Deals', category: 'CRM' },

    // Finance / Accounting
    { code: 'accounting:dashboard:view', name: 'View Finance Dashboard', category: 'Finance' },
    { code: 'accounting:journal:view', name: 'View Journal', category: 'Finance' },
    { code: 'accounting:coa:view', name: 'View Chart of Accounts', category: 'Finance' },

    // Inventory
    { code: 'inventory:dashboard:view', name: 'View Inventory Dashboard', category: 'Inventory' },
    { code: 'inventory:products:view', name: 'View Products', category: 'Inventory' },

    // Purchasing
    { code: 'purchasing:dashboard:view', name: 'View Purchasing Dashboard', category: 'Purchasing' },
    { code: 'purchasing:orders:view', name: 'View Orders', category: 'Purchasing' },

    // HR
    { code: 'hr:dashboard:view', name: 'View HR Dashboard', category: 'HR' },
    { code: 'hr:employees:view', name: 'View Employees', category: 'HR' },

    // Projects
    { code: 'projects:dashboard:view', name: 'View Projects Dashboard', category: 'Projects' },
    { code: 'projects:tasks:view', name: 'View Tasks', category: 'Projects' },

    // Sales
    { code: 'sales:dashboard:view', name: 'View Sales Dashboard', category: 'Sales' },
    { code: 'sales:orders:view', name: 'View Sales Orders', category: 'Sales' },

    // Reports
    { code: 'reports:view', name: 'View Reports', category: 'Reports' },
];

async function main() {
    console.log('🔧 Fixing Modules...');
    const purchase = await prisma.modules.findFirst({ where: { module_key: 'purchase' } });
    const purchasing = await prisma.modules.findFirst({ where: { module_key: 'purchasing' } });

    if (purchase && purchasing) {
        console.log(`Merging purchase (${purchase.id}) -> purchasing (${purchasing.id})...`);
        try {
            await prisma.$executeRawUnsafe(`UPDATE tenant_module SET module_id = '${purchasing.id}' WHERE module_id = '${purchase.id}'`);
            await prisma.modules.delete({ where: { id: purchase.id } });
            console.log('✅ Merged and deleted "purchase".');
        } catch (e) {
            console.error('Migration failed:', e.message);
        }
    } else {
        console.log('Skipping merge: One or both modules not found.');
    }

    console.log('🌱 Seeding Permissions...');
    for (const p of PERMISSIONS) {
        await prisma.permission.upsert({
            where: { code: p.code },
            update: { name: p.name, category: p.category },
            create: { code: p.code, name: p.name, category: p.category }
        });
        process.stdout.write('.');
    }
    console.log('\n✅ Done.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
