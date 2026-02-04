import { prisma } from "@/lib/prisma";

export async function nuclearMenuFix() {
    console.log("Running Nuclear Menu Fix...");

    // 1. LOCK ALL INVENTORY MENUS
    await prisma.menu_items.updateMany({
        where: { module_key: 'inventory' },
        data: { permission_code: 'inventory:view' }
    });

    // 2. LOCK ALL ACCOUNTING MENUS (Strict Lock)
    // We change this to 'accounting:view' so Receptionists (who might have billing:view) don't see them.
    await prisma.menu_items.updateMany({
        where: { module_key: 'accounting' },
        data: { permission_code: 'accounting:view' }
    });

    // 3. LOCK CREDIT NOTES (Leaking into HMS)
    await prisma.menu_items.updateMany({
        where: { key: 'hms-sales-returns' },
        data: { permission_code: 'billing:view' } // Keep as billing, but ensure Receptionist doesn't have it if unwanted
    });

    // 4. DELETE REDUNDANT HMS CONFIG (Prevent Duplication)
    await prisma.menu_items.deleteMany({
        where: { key: 'hms-config' }
    });

    // 5. LOCK ACCOUNTING CONFIG (Leaking into Config)
    await prisma.menu_items.updateMany({
        where: { key: 'acc-config' },
        data: { permission_code: 'settings:view' }
    });

    // 6. FIX RECEPTIONIST ROLE PERMISSIONS
    console.log("Fixing Receptionist Role...");
    const role = await prisma.role.findFirst({
        where: {
            OR: [{ name: 'Receptionist' }, { key: 'receptionist' }]
        }
    });

    if (role) {
        // Hard Reset Permissions for Receptionist to MINIMUM
        const perms = [
            'patients:view', 'patients:create', 'patients:edit',
            'appointments:view', 'appointments:create', 'appointments:edit',
            'hms:view'
            // REMOVED billing:view to hide Accounting menus
        ];

        // 1. Update Role Object
        await prisma.role.update({
            where: { id: role.id },
            data: { permissions: perms, key: 'receptionist' }
        });

        // 2. Sync Relational Table
        await prisma.role_permission.deleteMany({ where: { role_id: role.id } });
        await prisma.role_permission.createMany({
            data: perms.map(p => ({
                role_id: role.id,
                permission_code: p,
                is_granted: true
            }))
        });
    }

    // 7. ENSURE RECEPTION DASHBOARD IS VISIBLE & CORRECT
    const reception = await prisma.menu_items.findFirst({ where: { key: 'hms-reception' } });
    if (reception) {
        await prisma.menu_items.update({
            where: { id: reception.id },
            data: {
                permission_code: 'appointments:view',
                module_key: 'hms',
                is_global: true
            }
        });
    } else {
        await prisma.menu_items.create({
            data: {
                label: 'Front Desk',
                key: 'hms-reception',
                url: '/hms/reception',
                icon: 'Monitor',
                module_key: 'hms',
                sort_order: 1,
                permission_code: 'appointments:view',
                is_global: true
            }
        });
    }

    // 8. Ensure APPOINTMENTS Menu is Visible
    await prisma.menu_items.updateMany({
        where: { key: 'hms-appointments' },
        data: { permission_code: 'appointments:view' }
    });

    return true;
}
