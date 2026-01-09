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
    { code: 'hms:reception:view', name: 'View Reception', category: 'HMS' },
    { code: 'hms:patients:view', name: 'View Patients', category: 'HMS' },
    { code: 'hms:patients:create', name: 'Create Patient', category: 'HMS' },
    { code: 'hms:patients:edit', name: 'Edit Patient', category: 'HMS' },
    { code: 'hms:appointments:view', name: 'View Appointments', category: 'HMS' },
    { code: 'hms:appointments:create', name: 'Create Appointment', category: 'HMS' },
    { code: 'hms:prescriptions:view', name: 'View Prescriptions', category: 'HMS' },
    { code: 'hms:lab:view', name: 'View Lab', category: 'HMS' },
    { code: 'hms:pharmacy:view', name: 'View Pharmacy', category: 'HMS' },
    { code: 'hms:billing:view', name: 'View Hospital Billing', category: 'HMS' },

    // CRM
    { code: 'crm:dashboard:view', name: 'View CRM Dashboard', category: 'CRM' },
    { code: 'crm:leads:view', name: 'View Leads', category: 'CRM' },
    { code: 'crm:leads:create', name: 'Create Lead', category: 'CRM' },
    { code: 'crm:deals:view', name: 'View Deals', category: 'CRM' },
    { code: 'crm:contacts:view', name: 'View Contacts', category: 'CRM' },
    { code: 'crm:companies:view', name: 'View Companies', category: 'CRM' },

    // Inventory
    { code: 'inventory:dashboard:view', name: 'View Inventory Dashboard', category: 'Inventory' },
    { code: 'inventory:products:view', name: 'View Products', category: 'Inventory' },
    { code: 'inventory:products:create', name: 'Create Product', category: 'Inventory' },
    { code: 'inventory:stock:view', name: 'View Stock', category: 'Inventory' },
    { code: 'inventory:adjustments:view', name: 'View Adjustments', category: 'Inventory' },

    // Purchasing
    { code: 'purchasing:dashboard:view', name: 'View Purchasing Dashboard', category: 'Purchasing' },
    { code: 'purchasing:orders:view', name: 'View Purchase Orders', category: 'Purchasing' },
    { code: 'purchasing:orders:create', name: 'Create Purchase Order', category: 'Purchasing' },
    { code: 'purchasing:suppliers:view', name: 'View Suppliers', category: 'Purchasing' },

    // Finance / Accounting
    { code: 'accounting:dashboard:view', name: 'View Accounting Dashboard', category: 'Finance' },
    { code: 'accounting:journal:view', name: 'View Journal Entries', category: 'Finance' },
    { code: 'accounting:reports:view', name: 'View Financial Reports', category: 'Finance' }
];

async function main() {
    console.log('🧹 cleanup: Removing unwanted modules...');
    try {
        await prisma.modules.deleteMany({
            where: { module_key: { in: ['purchase', 'sales', 'projects'] } }
        });
        console.log('✅ Deleted purchase, sales, projects if existed.');
    } catch (e) {
        console.error('⚠️ cleanup error:', e.message);
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
    console.log('\n✅ Permissions Seeded.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
