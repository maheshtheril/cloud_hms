
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        console.log('Seeding HMS menu items via API...')

        // 1. Clean up (safely handling FKs)
        // Find IDs first
        const itemsToDelete = await prisma.menu_items.findMany({
            where: {
                OR: [
                    { module_key: 'hms' },
                    { key: { startsWith: 'hms' } }
                ]
            },
            select: { id: true }
        });

        const ids = itemsToDelete.map(i => i.id);

        if (ids.length > 0) {
            // Delete dependencies first
            // Note: module_menu_map might not be effectively in use for HMS layout, but it exists in constraints.
            await prisma.module_menu_map.deleteMany({
                where: { menu_item_id: { in: ids } }
            });

            // Delete the items
            await prisma.menu_items.deleteMany({
                where: { id: { in: ids } }
            });
        }

        // 2. Define Structure
        const hmsStructure = [
            { key: 'hms-dashboard', label: 'Dashboard', icon: 'LayoutDashboard', url: '/hms/dashboard', sort: 10 },
            { key: 'hms-appointments', label: 'Appointments', icon: 'Calendar', url: '/hms/appointments', sort: 20 },
            { key: 'hms-patients', label: 'Patients', icon: 'Users', url: '/hms/patients', sort: 30 },
            { key: 'hms-doctors', label: 'Doctors', icon: 'Stethoscope', url: '/hms/doctors', sort: 40 },

            // Purchasing Group (Submenu)
            {
                key: 'hms-purchasing', label: 'Purchasing', icon: 'ShoppingCart', url: null, sort: 50,
                children: [
                    { key: 'hms-purchasing-orders', label: 'Orders', url: '/hms/purchasing/orders', sort: 51 },
                    { key: 'hms-purchasing-suppliers', label: 'Suppliers', url: '/hms/purchasing/suppliers', sort: 52 },
                ]
            },

            // Inventory Group (Submenu)
            {
                key: 'hms-inventory', label: 'Inventory', icon: 'Package', url: null, sort: 60,
                children: [
                    { key: 'hms-inventory-products', label: 'Products', url: '/hms/inventory', sort: 61 },
                    { key: 'hms-inventory-master', label: 'Master Data', url: '/hms/inventory/master', sort: 62 },
                ]
            },

            { key: 'hms-billing', label: 'Billing', icon: 'CreditCard', url: '/hms/billing', sort: 70 },
            { key: 'hms-settings', label: 'Settings', icon: 'Settings', url: '/hms/settings', sort: 90 },
        ];

        // 3. Insert
        for (const item of hmsStructure) {
            const parent = await prisma.menu_items.create({
                data: {
                    module_key: 'hms',
                    key: item.key,
                    label: item.label,
                    icon: item.icon,
                    url: item.url,
                    sort_order: item.sort,
                    is_global: true,
                    parent_id: null
                }
            })

            if (item.children) {
                for (const child of item.children) {
                    await prisma.menu_items.create({
                        data: {
                            module_key: 'hms',
                            key: child.key,
                            label: child.label,
                            url: child.url,
                            sort_order: child.sort,
                            is_global: true,
                            parent_id: parent.id
                        }
                    })
                }
            }
        }

        return NextResponse.json({ success: true, message: "Menus seeded successfully" })
    } catch (error: any) {
        console.error("Seed failed:", error)
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 200 })
    }
}
