
import { prisma } from "@/lib/prisma"

export async function ensureAccountingMenu() {
    try {
        // 1. Check if 'Accounting' menu exists
        const existing = await prisma.menu_items.findFirst({
            where: {
                url: '/settings/accounting',
            }
        });

        // Update existing to ensure it is in Configuration module
        if (existing) {
            if (existing.module_key !== 'configuration' || existing.parent_id) {
                console.log("Moving Accounting menu to Configuration module...");
                await prisma.menu_items.update({
                    where: { id: existing.id },
                    data: {
                        module_key: 'configuration',
                        parent_id: null
                    }
                });
            }
        } else {
            // 2. Create as ROOT item in Configuration Module
            const lastItem = await prisma.menu_items.findFirst({
                orderBy: { sort_order: 'desc' }
            });
            const sortOrder = (lastItem?.sort_order || 0) + 10;

            await prisma.menu_items.create({
                data: {
                    label: 'Accounting Config',
                    url: '/settings/accounting',
                    key: 'accounting-settings',
                    module_key: 'configuration', // Moved to Configuration to ensure visibility
                    icon: 'Calculator',
                    parent_id: null,
                    sort_order: sortOrder,
                    is_global: true
                }
            });
            console.log("Auto-seeded Accounting Menu (HMS Module)");
        }

        // 3. SEED JOURNALS MENU (Enterprise Feature)
        await ensureJournalMenu();


        // D. Ensure 'Customers' and 'Vendors' Groups exist with Receipts/Payments
        await ensurePaymentMenus();

    } catch (e) {
        console.error("Failed to auto-seed menu:", e);
    }
}

async function ensurePaymentMenus() {
    // Customers -> Receipts
    let custParent = await prisma.menu_items.findFirst({ where: { key: 'acc-customers' } });
    if (!custParent) {
        custParent = await prisma.menu_items.create({
            data: { label: 'Customers', url: '#', key: 'acc-customers', module_key: 'accounting', icon: 'Users', sort_order: 10, is_global: true }
        });
    }

    const receiptMenu = await prisma.menu_items.findFirst({ where: { key: 'acc-receipts' } });
    if (!receiptMenu) {
        await prisma.menu_items.create({
            data: { label: 'Receipts', url: '/accounting/customer/receipts', key: 'acc-receipts', module_key: 'accounting', icon: 'ArrowDownLeft', parent_id: custParent.id, sort_order: 20, is_global: true }
        });
    }

    // Vendors -> Payments
    let vendParent = await prisma.menu_items.findFirst({ where: { key: 'acc-vendors' } });
    if (!vendParent) {
        vendParent = await prisma.menu_items.create({
            data: { label: 'Vendors', url: '#', key: 'acc-vendors', module_key: 'accounting', icon: 'Truck', sort_order: 20, is_global: true }
        });
    }

    const paymentMenu = await prisma.menu_items.findFirst({ where: { key: 'acc-payments' } });
    if (!paymentMenu) {
        await prisma.menu_items.create({
            data: { label: 'Payments', url: '/accounting/vendor/payments', key: 'acc-payments', module_key: 'accounting', icon: 'ArrowUpRight', parent_id: vendParent.id, sort_order: 20, is_global: true }
        });
    }
}


async function ensureJournalMenu() {
    try {
        // A. Ensure 'General Ledger' Parent Exists
        let ledgerParent = await prisma.menu_items.findFirst({
            where: { key: 'acc-ledger' }
        });

        if (!ledgerParent) {
            console.log("Creating General Ledger parent menu...");
            ledgerParent = await prisma.menu_items.create({
                data: {
                    label: 'General Ledger',
                    url: '#',
                    key: 'acc-ledger',
                    module_key: 'accounting',
                    icon: 'Book',
                    sort_order: 30, // Positioned after Sales/Purchases
                    is_global: true
                }
            });
        }

        // B. Ensure 'Journal Entries' Child Exists
        const journalsMenu = await prisma.menu_items.findFirst({
            where: { key: 'acc-journals' }
        });

        if (!journalsMenu) {
            console.log("Creating Journal Entries menu...");
            await prisma.menu_items.create({
                data: {
                    label: 'Journal Entries',
                    url: '/accounting/journals',
                    key: 'acc-journals',
                    module_key: 'accounting',
                    icon: 'BookOpen',
                    parent_id: ledgerParent.id,
                    sort_order: 10,
                    is_global: true
                }
            });
        }

        // C. Ensure 'Chart of Accounts' Child Exists
        const coaMenu = await prisma.menu_items.findFirst({
            where: { key: 'acc-coa' }
        });

        if (!coaMenu) {
            console.log("Creating Chart of Accounts menu...");
            await prisma.menu_items.create({
                data: {
                    label: 'Chart of Accounts',
                    url: '/accounting/coa',
                    key: 'acc-coa',
                    module_key: 'accounting',
                    icon: 'ListTree',
                    parent_id: ledgerParent.id,
                    sort_order: 5, // Before Journals
                    is_global: true
                }
            });
        }
    } catch (error) {
        console.error("Failed to seed journal menus:", error);
    }
}

export async function ensureAdminMenus() {
    try {
        const adminItems = [
            { key: 'users', label: 'Users', url: '/settings/users', icon: 'Users', sort: 90 },
            { key: 'roles', label: 'Roles & Permissions', url: '/settings/roles', icon: 'Shield', sort: 91 },
            { key: 'general-settings', label: 'Global Settings', url: '/settings/global', icon: 'Settings', sort: 99 },
            { key: 'crm-masters', label: 'CRM Masters', url: '/settings/crm', icon: 'Database', sort: 92 },
            { key: 'import-leads', label: 'Import Leads', url: '/crm/import/leads', icon: 'UploadCloud', sort: 93 },
            { key: 'crm-targets', label: 'Targets', url: '/crm/targets', icon: 'Target', sort: 94 },
            { key: 'custom-fields', label: 'Custom Fields', url: '/settings/custom-fields', icon: 'FileText', sort: 95 },
        ];

        for (const item of adminItems) {
            const existing = await prisma.menu_items.findFirst({
                where: { key: item.key }
            });

            if (!existing) {
                await prisma.menu_items.create({
                    data: {
                        label: item.label,
                        url: item.url,
                        key: item.key,
                        module_key: 'configuration',
                        icon: item.icon,
                        sort_order: item.sort,
                        is_global: true
                    }
                });
                console.log(`Auto-seeded Admin Menu: ${item.label}`);
            } else if (existing.module_key !== 'configuration') {
                // Fix module key if wrong
                await prisma.menu_items.update({
                    where: { id: existing.id },
                    data: { module_key: 'configuration' }
                });
            }
        }
    } catch (e) {
        console.error("Failed to seed admin menus:", e);
    }
}
