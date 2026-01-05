
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
    console.log('Seeding HMS menu items...')

    // 1. Clean up existing HMS menus to ensure order and avoid duplicates
    await prisma.menu_items.deleteMany({
        where: {
            OR: [
                { module_key: 'hms' },
                { key: { startsWith: 'hms' } }
            ]
        }
    });
    console.log('🗑️ Deleted old HMS menus.')

    // 2. Define HMS Navigation
    // We create Parents first, then Children.
    // Parent items have `url: null` or `#` if they are just grouping folders.

    const hmsStructure = [
        { key: 'hms-dashboard', label: 'Dashboard', icon: 'LayoutDashboard', url: '/hms/dashboard', sort: 10 },
        { key: 'hms-appointments', label: 'Appointments', icon: 'Calendar', url: '/hms/appointments', sort: 20 },
        { key: 'hms-patients', label: 'Patients', icon: 'Users', url: '/hms/patients', sort: 30 },
        { key: 'hms-doctors', label: 'Doctors', icon: 'Stethoscope', url: '/hms/doctors', sort: 40 },
        { key: 'hms-reception', label: 'Reception Desk', icon: 'ConciergeBell', url: '/hms/reception/dashboard', sort: 45 },

        // Purchasing Group
        {
            key: 'hms-purchasing', label: 'Purchasing', icon: 'ShoppingCart', url: null, sort: 50,
            children: [
                { key: 'hms-purchasing-orders', label: 'Orders', url: '/hms/purchasing/orders', sort: 51 },
                { key: 'hms-purchasing-receipts', label: 'Purchase Entry', url: '/hms/purchasing/receipts', sort: 52 },
                { key: 'hms-purchasing-suppliers', label: 'Suppliers', url: '/hms/purchasing/suppliers', sort: 53 },
            ]
        },

        // Inventory Group
        {
            key: 'hms-inventory', label: 'Inventory', icon: 'Package', url: null, sort: 60,
            children: [
                { key: 'hms-inventory-products', label: 'Products', url: '/hms/inventory', sort: 61 }, // Main inventory list
                { key: 'hms-inventory-master', label: 'Master Data', url: '/hms/inventory/master', sort: 62 },
            ]
        },

        { key: 'hms-billing', label: 'Billing', icon: 'CreditCard', url: '/hms/billing', sort: 70 },

        // Accounting Group (World Class)
        {
            key: 'hms-accounting', label: 'Accounting', icon: 'Landmark', url: null, sort: 80,
            children: [
                { key: 'hms-accounting-reports', label: 'Financial Reports', url: '/hms/accounting', sort: 81 },
                { key: 'hms-accounting-coa', label: 'Chart of Accounts', url: '/hms/accounting/coa', sort: 82 },
                { key: 'hms-accounting-journals', label: 'Journal Entries', url: '/hms/accounting/journals', sort: 83 },
                { key: 'hms-accounting-payments', label: 'Payments', url: '/hms/accounting/payments', sort: 84 },
            ]
        },

        { key: 'hms-settings', label: 'Settings', icon: 'Settings', url: '/hms/settings', sort: 90 },
    ];

    // 3. Insert
    for (const item of hmsStructure) {
        console.log(`Creating ${item.label}...`)
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
                console.log(`  - Creating ${child.label}...`)
                await prisma.menu_items.create({
                    data: {
                        module_key: 'hms',
                        key: child.key,
                        label: child.label,
                        // icon: child.icon, // Submenus often don't need icons or inherit
                        url: child.url,
                        sort_order: child.sort,
                        is_global: true,
                        parent_id: parent.id
                    }
                })
            }
        }
    }

    console.log('✅ HMS Seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
