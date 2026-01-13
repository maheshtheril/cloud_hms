
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log("--- FORCE FIXING NURSE ROLE & MENUS ---");

    // 1. FIX NURSE ROLE (ALL TENANTS)
    console.log("1. Updating Nurse Role Permissions...");
    const nurses = await prisma.role.findMany({ where: { key: 'nurse' } });
    console.log(`Found ${nurses.length} nurse roles.`);

    const CLEAN_PERMISSIONS = [
        'hms:view',
        'hms:dashboard:nurse',
        'vitals:view', 'vitals:create', 'vitals:edit',
        'prescriptions:view'
    ];

    for (const nurse of nurses) {
        // Update Role Array
        await prisma.role.update({
            where: { id: nurse.id },
            data: { permissions: CLEAN_PERMISSIONS }
        });

        // Update Role Permissions Table (Wipe and Recreate)
        await prisma.role_permission.deleteMany({ where: { role_id: nurse.id } });
        await prisma.role_permission.createMany({
            data: CLEAN_PERMISSIONS.map(p => ({
                role_id: nurse.id,
                permission_code: p,
                is_granted: true
            }))
        });
        console.log(` - Fixed Nurse Role for tenant ${nurse.tenant_id}`);
    }

    // 2. FIX MENUS
    console.log("\n2. Fixing Menu Items...");

    // A. Ensure Nursing Station Exists
    const nursingMenu = await prisma.menu_items.findFirst({ where: { key: 'hms-nursing' } });
    if (nursingMenu) {
        await prisma.menu_items.update({
            where: { id: nursingMenu.id },
            data: { permission_code: 'hms:dashboard:nurse', module_key: 'hms' }
        });
        console.log(" - Updated Nursing Station menu permission.");
    } else {
        console.log(" - Nursing Station menu not found. Creating...");
        await prisma.menu_items.create({
            data: {
                label: 'Nursing Station',
                url: '/hms/nursing/dashboard',
                key: 'hms-nursing',
                module_key: 'hms',
                icon: 'Activity',
                sort_order: 45,
                permission_code: 'hms:dashboard:nurse',
                is_global: true
            }
        });
        console.log(" - Created Nursing Station menu.");
    }

    // B. Ensure Patients & Appointments are Restricted
    await prisma.menu_items.updateMany({
        where: { key: 'hms-patients' },
        data: { permission_code: 'patients:view' }
    });
    console.log(" - Secured 'hms-patients' with 'patients:view'");

    await prisma.menu_items.updateMany({
        where: { key: 'hms-appointments' },
        data: { permission_code: 'appointments:view' }
    });
    console.log(" - Secured 'hms-appointments' with 'appointments:view'");

    await prisma.menu_items.updateMany({
        where: { key: 'hms-lab' },
        data: { permission_code: 'lab:view' }
    });
    console.log(" - Secured 'hms-lab' with 'lab:view'");

    console.log("\n--- FIX COMPLETE ---");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
