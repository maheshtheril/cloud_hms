
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const STANDARD_PERMISSIONS = [
    // User Management -> System
    { code: 'users:view', name: 'View Users', module: 'System' },
    { code: 'users:create', name: 'Create Users', module: 'System' },
    { code: 'users:edit', name: 'Edit Users', module: 'System' },
    { code: 'users:delete', name: 'Delete Users', module: 'System' },

    // Role Management -> System
    { code: 'roles:view', name: 'View Roles', module: 'System' },
    { code: 'roles:manage', name: 'Manage Roles', module: 'System' },

    // Settings -> System
    { code: 'settings:view', name: 'View Settings', module: 'System' },
    { code: 'settings:edit', name: 'Edit Settings', module: 'System' },

    // HMS - General
    { code: 'hms:view', name: 'View HMS', module: 'HMS' },
    { code: 'hms:admin', name: 'HMS Administrator', module: 'HMS' },
    { code: 'hms:create', name: 'Create HMS Records', module: 'HMS' },
    { code: 'hms:edit', name: 'Edit HMS Records', module: 'HMS' },
    { code: 'hms:delete', name: 'Delete HMS Records', module: 'HMS' },

    // Dashboard Access
    { code: 'hms:dashboard:doctor', name: 'Access Doctor Dashboard', module: 'HMS' },
    { code: 'hms:dashboard:nurse', name: 'Access Nurse Dashboard', module: 'HMS' },
    { code: 'hms:dashboard:reception', name: 'Access Reception Dashboard', module: 'HMS' },
    { code: 'hms:dashboard:lab', name: 'Access Lab Dashboard', module: 'HMS' },
    { code: 'hms:dashboard:accounting', name: 'Access Accounting Dashboard', module: 'HMS' },

    // HMS - Clinical & Patient
    { code: 'patients:view', name: 'View Patients', module: 'HMS' },
    { code: 'patients:create', name: 'Create Patients', module: 'HMS' },
    { code: 'patients:edit', name: 'Edit Patients', module: 'HMS' },
    { code: 'appointments:view', name: 'View Appointments', module: 'HMS' },
    { code: 'appointments:create', name: 'Create Appointments', module: 'HMS' },
    { code: 'appointments:edit', name: 'Edit Appointments', module: 'HMS' },
    { code: 'prescriptions:view', name: 'View Prescriptions', module: 'HMS' },
    { code: 'prescriptions:create', name: 'Create Prescriptions', module: 'HMS' },
    { code: 'prescriptions:edit', name: 'Edit Prescriptions', module: 'HMS' },
    { code: 'vitals:view', name: 'View Vitals', module: 'HMS' },
    { code: 'vitals:create', name: 'Create Vitals', module: 'HMS' },
    { code: 'vitals:edit', name: 'Edit Vitals', module: 'HMS' },

    // Billing
    { code: 'billing:view', name: 'View Billing', module: 'HMS' },
    { code: 'billing:create', name: 'Create Bills', module: 'HMS' },
    { code: 'billing:returns:view', name: 'View Sales Returns', module: 'HMS' },
    { code: 'billing:returns:create', name: 'Create Sales Returns', module: 'HMS' },

    // Pharmacy
    { code: 'pharmacy:view', name: 'View Pharmacy', module: 'Pharmacy' },
    { code: 'pharmacy:create', name: 'Create Pharmacy Records', module: 'Pharmacy' },
    { code: 'pharmacy:edit', name: 'Edit Pharmacy Records', module: 'Pharmacy' },

    // CRM
    { code: 'crm:view', name: 'View CRM', module: 'CRM' },
    { code: 'crm:admin', name: 'CRM Administrator', module: 'CRM' },
    { code: 'crm:view_all', name: 'View All CRM Records', module: 'CRM' },
    { code: 'crm:view_team', name: 'View Team CRM Records', module: 'CRM' },
    { code: 'crm:view_own', name: 'View Own CRM Records', module: 'CRM' },
    { code: 'crm:reports', name: 'View CRM Reports', module: 'CRM' },
    { code: 'crm:create_leads', name: 'Create Leads', module: 'CRM' },
    { code: 'crm:manage_deals', name: 'Manage Deals', module: 'CRM' },
    { code: 'crm:assign_leads', name: 'Assign Leads', module: 'CRM' },
    { code: 'crm:manage_own_deals', name: 'Manage Own Deals', module: 'CRM' },
    { code: 'leads:view', name: 'View Leads', module: 'CRM' },
    { code: 'leads:create', name: 'Create Leads', module: 'CRM' },
    { code: 'leads:edit', name: 'Edit Leads', module: 'CRM' },
    { code: 'leads:delete', name: 'Delete Leads', module: 'CRM' },
    { code: 'deals:view', name: 'View Deals', module: 'CRM' },
    { code: 'deals:create', name: 'Create Deals', module: 'CRM' },
    { code: 'deals:edit', name: 'Edit Deals', module: 'CRM' },

    // CRM - Expanded Granular Permissions
    { code: 'crm:targets:view', name: 'View Targets', module: 'CRM' },
    { code: 'crm:pipeline:view', name: 'View Pipeline', module: 'CRM' },
    { code: 'crm:scheduler:view', name: 'View Scheduler', module: 'CRM' },
    { code: 'crm:activities:view', name: 'View Activities', module: 'CRM' },
    { code: 'crm:contacts:view', name: 'View Contacts', module: 'CRM' },
    { code: 'crm:accounts:view', name: 'View Accounts', module: 'CRM' },
    { code: 'crm:staff', name: 'Access CRM Staff & Workforce', module: 'CRM' },
    { code: 'crm:setup', name: 'Access CRM Advanced & Setup', module: 'CRM' },

    // Inventory
    { code: 'inventory:view', name: 'View Inventory', module: 'Inventory' },
    { code: 'inventory:create', name: 'Create Inventory', module: 'Inventory' },
    { code: 'inventory:edit', name: 'Edit Inventory', module: 'Inventory' },
    { code: 'inventory:delete', name: 'Delete Inventory', module: 'Inventory' },
    { code: 'inventory:admin', name: 'Inventory Administrator', module: 'Inventory' },
    { code: 'inventory:adjustments:view', name: 'View Stock Adjustments', module: 'Inventory' },
    { code: 'inventory:adjustments:create', name: 'Create Stock Adjustments', module: 'Inventory' },

    // Purchasing
    { code: 'purchasing:view', name: 'View Purchase Orders', module: 'Purchasing' },
    { code: 'purchasing:create', name: 'Create Purchase Orders', module: 'Purchasing' },
    { code: 'purchasing:edit', name: 'Edit Purchase Orders', module: 'Purchasing' },
    { code: 'suppliers:view', name: 'View Suppliers', module: 'Purchasing' },
    { code: 'suppliers:create', name: 'Create Suppliers', module: 'Purchasing' },
    { code: 'suppliers:edit', name: 'Edit Suppliers', module: 'Purchasing' },
    { code: 'purchasing:returns:view', name: 'View Purchase Returns', module: 'Purchasing' },
    { code: 'purchasing:returns:create', name: 'Create Purchase Returns', module: 'Purchasing' },

    // HR - Attendance & Employees
    { code: 'hr:view', name: 'View HR', module: 'HR' },
    { code: 'hr:attendance:view', name: 'View Attendance', module: 'HR' },
    { code: 'hr:attendance:create', name: 'Mark Attendance', module: 'HR' },
    { code: 'hr:attendance:edit', name: 'Edit Attendance', module: 'HR' },
    { code: 'hr:employees:view', name: 'View Employees', module: 'HR' },
];

async function main() {
    console.log(`Checking ${STANDARD_PERMISSIONS.length} permissions...`);

    // Creates permissions if they don't exist
    const result = await prisma.permission.createMany({
        data: STANDARD_PERMISSIONS.map(p => ({
            code: p.code,
            name: p.name,
            category: p.module
        })),
        skipDuplicates: true
    });

    console.log(`✅ Synced Permissions: ${result.count} new permissions added.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
