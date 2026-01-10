
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting Fix Null Permissions...');

    const specificOverrides = [
        { key: 'crm-targets', perm: 'crm:targets:view' },
        { key: 'crm-pipeline', perm: 'crm:pipeline:view' },
        { key: 'crm-scheduler', perm: 'crm:scheduler:view' },
        { key: 'crm-activities', perm: 'crm:activities:view' },
        { key: 'crm-contacts', perm: 'crm:contacts:view' },
        { key: 'crm-accounts', perm: 'crm:accounts:view' },
        { key: 'crm-leads', perm: 'leads:view' },
        { key: 'crm-deals', perm: 'deals:view' },
        { key: 'crm-reports', perm: 'crm:reports' }
    ];

    for (const o of specificOverrides) {
        console.log(`Updating ${o.key} to ${o.perm}`);
        await prisma.menu_items.updateMany({
            where: { key: o.key },
            data: { permission_code: o.perm }
        });
    }

    const modulesToSecure = [
        { key: 'crm', perm: 'crm:view' },
        { key: 'sales', perm: 'crm:view' },
        { key: 'inventory', perm: 'inventory:view' },
        { key: 'purchasing', perm: 'inventory:view' },
        { key: 'hms', perm: 'hms:view' },
        { key: 'hr', perm: 'hr:view' },
        { key: 'finance', perm: 'accounting:view' },
        { key: 'accounting', perm: 'accounting:view' },
        { key: 'projects', perm: 'crm:view' }
    ];

    for (const m of modulesToSecure) {
        console.log(`Securing module ${m.key} with ${m.perm}`);
        await prisma.menu_items.updateMany({
            where: {
                module_key: m.key,
                permission_code: null
            },
            data: { permission_code: m.perm }
        });
    }

    console.log('Fix Complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
