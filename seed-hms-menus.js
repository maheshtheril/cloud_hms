
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding HMS menu items directly...');

    // 1. Define Structure
    const hmsStructure = [
        { key: 'hms-dashboard', label: 'Dashboard', icon: 'LayoutDashboard', url: '/hms/dashboard', sort: 10 },
        { key: 'hms-appointments', label: 'Appointments', icon: 'Calendar', url: '/hms/appointments', sort: 20 },
        { key: 'hms-patients', label: 'Patients', icon: 'Users', url: '/hms/patients', sort: 30 },
        { key: 'hms-doctors', label: 'Doctors', icon: 'Stethoscope', url: '/hms/doctors', sort: 40 },

        // Purchasing Group
        {
            key: 'hms-purchasing', label: 'Purchasing', icon: 'ShoppingCart', url: null, sort: 50,
            children: [
                { key: 'hms-purchasing-orders', label: 'Orders', url: '/hms/purchasing/orders', sort: 51 },
                { key: 'hms-purchasing-receipts', label: 'Purchase Entries', url: '/hms/purchasing/receipts', sort: 52 },
                { key: 'hms-purchasing-suppliers', label: 'Suppliers', url: '/hms/purchasing/suppliers', sort: 53 },
            ]
        },

        // Inventory Group
        {
            key: 'hms-inventory', label: 'Inventory', icon: 'Package', url: null, sort: 60,
            children: [
                { key: 'hms-inventory-products', label: 'Products', url: '/hms/inventory', sort: 61 },
                { key: 'hms-inventory-master', label: 'Master Data', url: '/hms/inventory/master', sort: 62 },
            ]
        },

        { key: 'hms-billing', label: 'Billing', icon: 'CreditCard', url: '/hms/billing', sort: 70 },

        // Accounting Group
        {
            key: 'hms-accounting', label: 'Accounting', icon: 'Calculator', url: null, sort: 80,
            children: [
                { key: 'hms-accounting-receipts', label: 'Receipts', url: '/hms/accounting/receipts', sort: 81 },
                { key: 'hms-accounting-payments', label: 'Payments', url: '/hms/accounting/payments', sort: 82 },
                { key: 'hms-accounting-bills', label: 'Vendor Bills', url: '/hms/accounting/bills', sort: 83 },
                { key: 'hms-accounting-invoices', label: 'Invoices', url: '/hms/accounting/invoices', sort: 84 },
                { key: 'hms-accounting-journals', label: 'Journal Entries', url: '/hms/accounting/journals', sort: 85 },
                { key: 'hms-accounting-coa', label: 'Chart of Accounts', url: '/hms/accounting/coa', sort: 86 },
            ]
        },

        { key: 'hms-settings', label: 'Settings', icon: 'Settings', url: '/hms/settings/companies', sort: 90 },
    ];

    // 2. Clean up existing HMS items
    const existing = await prisma.menu_items.findMany({
        where: {
            OR: [
                { module_key: 'hms' },
                { key: { startsWith: 'hms' } }
            ]
        },
        select: { id: true }
    });

    const ids = existing.map(i => i.id);
    if (ids.length > 0) {
        await prisma.module_menu_map.deleteMany({ where: { menu_item_id: { in: ids } } });
        await prisma.menu_items.deleteMany({ where: { id: { in: ids } } });
        console.log(`Cleaned up ${ids.length} old menu items.`);
    }

    // 3. Insert new structure
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
        });

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
                });
            }
        }
    }

    console.log('✅ HMS Menus seeded successfully.');
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
