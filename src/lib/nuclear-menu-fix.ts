
import { prisma } from "@/lib/prisma";

export async function nuclearMenuFix() {
    console.log("Running Nuclear Menu Fix...");

    // 1. LOCK ALL INVENTORY MENUS
    // Catch-all: If it's in inventory module, it helps to be restricted.
    await prisma.menu_items.updateMany({
        where: { module_key: 'inventory' },
        data: { permission_code: 'inventory:view' } // Or 'purchasing:view'
    });

    // 2. LOCK CREDIT NOTES (Leaking into HMS)
    await prisma.menu_items.updateMany({
        where: { key: 'hms-sales-returns' },
        data: { permission_code: 'billing:view' }
    });

    // 3. LOCK HMS SETTINGS (Leaking into HMS)
    await prisma.menu_items.updateMany({
        where: { key: 'hms-config' },
        data: { permission_code: 'hms:admin' } // Only Admins
    });

    // 4. LOCK ACCOUTING CONFIG (Leaking into Config)
    await prisma.menu_items.updateMany({
        where: { key: 'acc-config' },
        data: { permission_code: 'settings:view' }
    });

    // 5. ENSURE RECEPTION DASHBOARD IS VISIBLE & CORRECT
    const reception = await prisma.menu_items.findFirst({ where: { key: 'hms-reception' } });
    if (reception) {
        // Ensure it has the correct permission that Receptionist HAS
        await prisma.menu_items.update({
            where: { id: reception.id },
            data: {
                permission_code: 'appointments:view',
                module_key: 'hms',
                is_global: true // Ensure it appears
            }
        });
    } else {
        // Create it if missing
        await prisma.menu_items.create({
            data: {
                label: 'Front Desk',
                key: 'hms-reception',
                url: '/hms/reception',
                icon: 'Monitor',
                module_key: 'hms',
                sort_order: 1, // TOP PRIORITY
                permission_code: 'appointments:view',
                is_global: true
            }
        });
    }

    // 6. Ensure APPOINTMENTS Menu is Visible
    await prisma.menu_items.updateMany({
        where: { key: 'hms-appointments' },
        data: { permission_code: 'appointments:view' }
    });

    return true;
}
