
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
                        module_key: 'system',
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
                    module_key: 'system', // Moved to Configuration to ensure visibility
                    icon: 'Calculator',
                    parent_id: null,
                    sort_order: sortOrder,
                    is_global: true
                }
            });
            console.log("Auto-seeded Accounting Menu (HMS Module)");
        }

        // 2.5 Ensure 'Dashboard' exists in Accounting Module
        const dashKey = 'acc-dashboard';
        const existingDash = await prisma.menu_items.findFirst({ where: { key: dashKey } });
        if (!existingDash) {
            await prisma.menu_items.create({
                data: {
                    label: 'Financial Dashboard',
                    url: '/hms/accounting',
                    key: dashKey,
                    module_key: 'finance',
                    icon: 'LayoutDashboard',
                    sort_order: 1, // First item
                    is_global: true
                }
            });
            console.log("Seeded Accounting Dashboard menu item.");
        } else if (existingDash.url !== '/hms/accounting') {
            await prisma.menu_items.update({
                where: { id: existingDash.id },
                data: { url: '/hms/accounting', module_key: 'finance' }
            });
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
            data: { label: 'Customers', url: '#', key: 'acc-customers', module_key: 'finance', icon: 'Users', sort_order: 10, is_global: true }
        });
    }

    const receiptMenu = await prisma.menu_items.findFirst({ where: { key: 'acc-receipts' } });
    if (!receiptMenu) {
        await prisma.menu_items.create({
            data: { label: 'Receipts', url: '/accounting/customer/receipts', key: 'acc-receipts', module_key: 'finance', icon: 'ArrowDownLeft', parent_id: custParent.id, sort_order: 20, is_global: true }
        });
    }

    // Vendors -> Payments
    let vendParent = await prisma.menu_items.findFirst({ where: { key: 'acc-vendors' } });
    if (!vendParent) {
        vendParent = await prisma.menu_items.create({
            data: { label: 'Vendors', url: '#', key: 'acc-vendors', module_key: 'finance', icon: 'Truck', sort_order: 20, is_global: true }
        });
    }

    const paymentMenu = await prisma.menu_items.findFirst({ where: { key: 'acc-payments' } });
    if (!paymentMenu) {
        await prisma.menu_items.create({
            data: { label: 'Payments', url: '/accounting/vendor/payments', key: 'acc-payments', module_key: 'finance', icon: 'ArrowUpRight', parent_id: vendParent.id, sort_order: 20, permission_code: 'billing:view', is_global: true }
        });
    }

    // BULK SAFETY: Lock ALL Accounting Menus if they don't have permissions
    // This catches 'acc-vendors' (created above) and any others missed.
    await prisma.menu_items.updateMany({
        where: {
            module_key: 'finance',
            permission_code: null
        },
        data: { permission_code: 'billing:view' }
    });
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
                    module_key: 'finance',
                    icon: 'Book',
                    sort_order: 30, // Positioned after Sales/Purchases
                    permission_code: 'billing:view',
                    is_global: true
                }
            });
        } else if (!ledgerParent.permission_code) {
            await prisma.menu_items.update({ where: { id: ledgerParent.id }, data: { permission_code: 'billing:view' } });
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
                    module_key: 'finance',
                    icon: 'BookOpen',
                    parent_id: ledgerParent.id,
                    sort_order: 10,
                    permission_code: 'billing:view',
                    is_global: true
                }
            });
        } else if (!journalsMenu.permission_code) {
            await prisma.menu_items.update({ where: { id: journalsMenu.id }, data: { permission_code: 'billing:view' } });
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
                    module_key: 'finance',
                    icon: 'ListTree',
                    parent_id: ledgerParent.id,
                    sort_order: 5, // Before Journals
                    permission_code: 'billing:view',
                    is_global: true
                }
            });
        } else if (!coaMenu.permission_code) {
            await prisma.menu_items.update({ where: { id: coaMenu.id }, data: { permission_code: 'billing:view' } });
        }
    } catch (error) {
        console.error("Failed to seed journal menus:", error);
    }
}

export async function ensureAdminMenus() {
    try {
        const adminItems = [
            { key: 'users', label: 'Users', url: '/settings/users', icon: 'Users', sort: 90, permission: 'users:view' },
            { key: 'roles', label: 'Roles & Permissions', url: '/settings/roles', icon: 'Shield', sort: 91, permission: 'roles:manage' },
            { key: 'general-settings', label: 'Global Settings', url: '/settings/global', icon: 'Settings', sort: 99, permission: 'settings:view' },
            { key: 'crm-masters', label: 'CRM Masters', url: '/settings/crm', icon: 'Database', sort: 92, permission: 'settings:view' },
            { key: 'import-leads', label: 'Import Leads', url: '/crm/import/leads', icon: 'UploadCloud', sort: 93, permission: 'crm:create_leads' },
            { key: 'hms-config', label: 'HMS Configuration', url: '/settings/hms', icon: 'Stethoscope', sort: 96, permission: 'hms:admin' },
            { key: 'custom-fields', label: 'Custom Fields', url: '/settings/custom-fields', icon: 'FileText', sort: 95, permission: 'settings:view' },
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
                        module_key: 'system',
                        icon: item.icon,
                        sort_order: item.sort,
                        permission_code: item.permission,
                        is_global: true
                    }
                });
                console.log(`Auto-seeded Admin Menu: ${item.label}`);
            } else {
                // Update permission if missing
                if (!existing.permission_code || existing.module_key !== 'configuration') {
                    await prisma.menu_items.update({
                        where: { id: existing.id },
                        data: {
                            module_key: 'system',
                            permission_code: item.permission
                        }
                    });
                }
            }
        }
    } catch (e) {
        console.error("Failed to seed admin menus:", e);
    }
}

export async function ensureCrmMenus() {
    try {
        const items = [
            { key: 'crm-dashboard', label: 'Dashboard', url: '/crm/dashboard', icon: 'LayoutDashboard', sort: 10 },
            { key: 'crm-leads', label: 'Leads', url: '/crm/leads', icon: 'Users', sort: 20 },
            { key: 'crm-deals', label: 'Deals', url: '/crm/deals', icon: 'DollarSign', sort: 30 },
            { key: 'crm-pipeline', label: 'Pipeline', url: '/crm/pipeline', icon: 'Trello', sort: 40 },
            { key: 'crm-targets', label: 'Targets', url: '/crm/targets', icon: 'Target', sort: 50 },
            { key: 'crm-activities', label: 'Activities', url: '/crm/activities', icon: 'PhoneCall', sort: 60 },
        ];

        for (const item of items) {
            const existing = await prisma.menu_items.findFirst({
                where: { key: item.key }
            });

            if (!existing) {
                await prisma.menu_items.create({
                    data: {
                        label: item.label,
                        url: item.url,
                        key: item.key,
                        module_key: 'crm',
                        icon: item.icon,
                        sort_order: item.sort,
                        is_global: true
                    }
                });
                console.log(`Auto-seeded CRM Menu: ${item.label}`);
            } else {
                // Ensure it is in CRM module and correct URL
                if (existing.module_key !== 'crm' || existing.url !== item.url) {
                    await prisma.menu_items.update({
                        where: { id: existing.id },
                        data: {
                            module_key: 'crm',
                            url: item.url,
                            parent_id: null // Ensure top level
                        }
                    });
                }
            }
        }

    } catch (e) {
        console.error("Failed to seed CRM menus:", e);
    }
}

export async function ensureHmsMenus() {
    try {
        const hmsItems = [
            { key: 'hms-dashboard', label: 'Dashboard', url: '/hms/dashboard', icon: 'LayoutDashboard', sort: 10, permission: 'hms:admin' },
            { key: 'hms-reception', label: 'Reception', url: '/hms/reception/dashboard', icon: 'MonitorCheck', sort: 12, permission: 'hms:dashboard:reception' },
            { key: 'hms-patients', label: 'Patients', url: '/hms/patients', icon: 'UserCircle', sort: 20, permission: 'patients:view' },
            { key: 'hms-appointments', label: 'Appointments', url: '/hms/appointments', icon: 'Calendar', sort: 30, permission: 'appointments:view' },
            { key: 'hms-doctors', label: 'Doctors', url: '/hms/doctors', icon: 'Stethoscope', sort: 40, permission: 'hms:admin' },
            { key: 'hms-doctor-dash', label: 'Doctor Dashboard', url: '/hms/doctor/dashboard', icon: 'AppWindow', sort: 41, permission: 'hms:dashboard:doctor' },
            { key: 'hms-nursing', label: 'Nursing Station', url: '/hms/nursing/dashboard', icon: 'Activity', sort: 45, permission: 'hms:dashboard:nurse' },
            { key: 'hms-lab', label: 'Laboratory', url: '/hms/lab/dashboard', icon: 'FlaskConical', sort: 46, permission: 'lab:view' },
            { key: 'hms-attendance', label: 'Attendance', url: '/hms/attendance', icon: 'Clock', sort: 50, permission: 'hms:admin' },
            { key: 'hms-roster', label: 'Staff Roster', url: '/hms/attendance/roster', icon: 'Layers', sort: 51, permission: 'hms:admin' },
            { key: 'hms-attendance-logs', label: 'Daily Logs', url: '/hms/attendance/logs', icon: 'ListChecks', sort: 52, permission: 'hms:admin' },
            { key: 'hms-attendance-analytics', label: 'Staff Analytics', url: '/hms/attendance/analytics', icon: 'BarChart3', sort: 53, permission: 'hms:admin' },
            { key: 'hms-billing', label: 'Billing', url: '/hms/billing', icon: 'Receipt', sort: 60, permission: 'billing:view' },
            { key: 'hms-pharmacy-billing', label: 'Pharmacy Billing', url: '/hms/pharmacy/billing', icon: 'Pill', sort: 61, permission: 'billing:view' },
            // { key: 'hms-inventory', label: 'Pharmacy/Inventory', url: '/hms/inventory', icon: 'Package', sort: 70 }, // Removed to allow migration to Inventory Module
            { key: 'hms-wards', label: 'Clinics/Wards', url: '/hms/wards', icon: 'LayoutGrid', sort: 80, permission: 'hms:admin' },
        ];

        for (const item of hmsItems) {
            const existing = await prisma.menu_items.findFirst({
                where: { key: item.key }
            });

            if (!existing) {
                await prisma.menu_items.create({
                    data: {
                        label: item.label,
                        url: item.url,
                        key: item.key,
                        module_key: 'hms',
                        icon: item.icon,
                        sort_order: item.sort,
                        permission_code: item.permission,
                        is_global: true
                    }
                });
                console.log(`Auto-seeded HMS Menu: ${item.label}`);
            } else {
                // Always update permission_code to ensure security
                if (existing.permission_code !== item.permission || existing.url !== item.url) {
                    await prisma.menu_items.update({
                        where: { id: existing.id },
                        data: {
                            url: item.url,
                            permission_code: item.permission
                        }
                    });
                }
            }
        }
    } catch (e) {
        console.error("Failed to seed HMS menus:", e);
    }
}

export async function ensurePurchasingMenus() {
    try {
        // 1. Ensure 'Procurement' Parent Exists
        let procParent = await prisma.menu_items.findFirst({ where: { key: 'inv-procurement' } });

        if (!procParent) {
            const inventoryModule = await prisma.menu_items.findFirst({ where: { key: 'hms-inventory' } });
            // Fallback to separate group if no inventory parent found easily, or create top level
            procParent = await prisma.menu_items.create({
                data: { label: 'Procurement', url: '#', key: 'inv-procurement', module_key: 'inventory', icon: 'ShoppingCart', sort_order: 15, permission_code: 'purchasing:view', is_global: true }
            });
        } else if (!procParent.permission_code) {
            await prisma.menu_items.update({ where: { id: procParent.id }, data: { permission_code: 'purchasing:view' } });
        }

        const items = [
            { key: 'inv-suppliers', label: 'Suppliers', url: '/hms/purchasing/suppliers', icon: 'Truck', sort: 10, permission: 'suppliers:view' },
            { key: 'inv-po', label: 'Purchase Orders', url: '/hms/purchasing/orders', icon: 'FileText', sort: 20, permission: 'purchasing:view' },
            { key: 'inv-receipts', label: 'Goods Receipts', url: '/hms/purchasing/receipts', icon: 'ClipboardList', sort: 30, permission: 'purchasing:view' },
            { key: 'inv-returns', label: 'Purchase Returns', url: '/hms/purchasing/returns', icon: 'Undo2', sort: 40, permission: 'purchasing:returns:view' },
        ];

        // Ensure Dashboard is Top Level
        const dashKey = 'inv-dashboard';
        const existingDash = await prisma.menu_items.findFirst({ where: { key: dashKey } });
        if (!existingDash) {
            await prisma.menu_items.create({
                data: { label: 'Command Center', url: '/hms/inventory', key: dashKey, module_key: 'inventory', icon: 'LayoutDashboard', sort_order: 5, permission_code: 'inventory:view', is_global: true }
            });
        } else if (!existingDash.permission_code || existingDash.parent_id) {
            await prisma.menu_items.update({ where: { id: existingDash.id }, data: { parent_id: null, permission_code: 'inventory:view' } });
        }

        // Ensure Product Master Exists
        const prodKey = 'inv-products';
        const existingProd = await prisma.menu_items.findFirst({ where: { key: prodKey } });
        if (!existingProd) {
            await prisma.menu_items.create({
                data: { label: 'Product Master', url: '/hms/inventory/products', key: prodKey, module_key: 'inventory', icon: 'Package', sort_order: 6, permission_code: 'inventory:view', is_global: true }
            });
        } else if (!existingProd.permission_code) {
            await prisma.menu_items.update({ where: { id: existingProd.id }, data: { permission_code: 'inventory:view' } });
        }

        for (const item of items) {
            const existing = await prisma.menu_items.findFirst({ where: { key: item.key } });
            if (!existing) {
                await prisma.menu_items.create({
                    data: {
                        label: item.label,
                        url: item.url,
                        key: item.key,
                        module_key: 'inventory',
                        icon: item.icon,
                        parent_id: procParent.id,
                        sort_order: item.sort,
                        permission_code: item.permission,
                        is_global: true
                    }
                });
                console.log(`Auto-seeded Purchasing Menu: ${item.label}`);
            } else if (!existing.permission_code) {
                await prisma.menu_items.update({ where: { id: existing.id }, data: { permission_code: item.permission } });
            }
        }

        // Also ensure Sales Returns in Billing
        // Try to find the 'Billing' group or similar
        const billingMenu = await prisma.menu_items.findFirst({ where: { key: 'hms-billing' } });
        // hms-billing is usually a top level item or child. In fallback it was child of Income.
        // In HMS seeder, it's a top level item sort 60.

        // If billing is top level, we might want to make it a parent or add a sibling.
        // Let's add 'Credit Notes' as a top level item after Billing if Billing is top level.
        if (billingMenu) {
            const existingSR = await prisma.menu_items.findFirst({ where: { key: 'hms-sales-returns' } });
            if (!existingSR) {
                await prisma.menu_items.create({
                    data: {
                        label: 'Credit Notes',
                        url: '/hms/billing/returns',
                        key: 'hms-sales-returns',
                        module_key: 'hms',
                        icon: 'RotateCcw',
                        parent_id: billingMenu.parent_id, // Same level
                        sort_order: (billingMenu.sort_order || 60) + 1,
                        is_global: true
                    }
                });
                console.log("Auto-seeded Sales Returns Menu");
            }
        }

        // 3. CLEANUP: Delete any other items in 'inventory' module
        // const allowedKeys = ['inv-dashboard', 'inv-products', 'inv-procurement', 'inv-suppliers', 'inv-po', 'inv-receipts', 'inv-returns'];
        // Also keep 'hms-inventory' if it was somehow mapped to inventory, but we want to be strict.

        /* DISABLE CLEANUP TO PREVENT FK ERRORS
        await prisma.menu_items.deleteMany({
            where: {
                module_key: 'inventory',
                key: { notIn: allowedKeys }
            }
        });
        */

        // 3b. ADDITIONAL CLEANUP: Rogue Keys (True Bulletproof 2.0)
        // 1. Explicitly handle 'inventory-root' which acts as a parent
        const rogueRoot = await prisma.menu_items.findFirst({ where: { key: 'inventory-root' } });
        if (rogueRoot) {
            // Unlink any children pointing to this root
            await prisma.menu_items.updateMany({
                where: { parent_id: rogueRoot.id },
                data: { parent_id: null }
            });
            // Delete the root
            // await prisma.menu_items.delete({ where: { id: rogueRoot.id } }); // FK Error risk
        }

        // const rogueKeys = ['inv-receive', 'inventory.products', 'inv-moves']; // Removed hms.inventory
        // Unlink these specific keys if they have parents (nesting cleanup)
        /*
        await prisma.menu_items.updateMany({
            where: { key: { in: rogueKeys } },
            data: { parent_id: null }
        });
        // Delete them
        await prisma.menu_items.deleteMany({ where: { key: { in: rogueKeys } } });
        */

        // 4. STANDARDIZE: Update Sort Orders and Labels
        await prisma.menu_items.updateMany({ where: { key: 'inv-dashboard' }, data: { sort_order: 10, label: 'Inventory' } }); // Renamed to Inventory
        await prisma.menu_items.updateMany({ where: { key: 'inv-products' }, data: { sort_order: 20, label: 'Product Master' } });
        await prisma.menu_items.updateMany({ where: { key: 'inv-procurement' }, data: { sort_order: 30 } });

        // 5. MIGRATION: Move HMS Menus to Proper Modules (World Class Standard)
        // Move 'hms-accounting' to 'accounting' module
        await prisma.menu_items.updateMany({
            where: { key: 'hms-accounting' },
            data: { module_key: 'finance', sort_order: 10 }
        });
        // Ensure children follow (module_key is usually denormalized on parent, but good to be safe)
        const hmsAcc = await prisma.menu_items.findFirst({ where: { key: 'hms-accounting' } });
        if (hmsAcc) {
            await prisma.menu_items.updateMany({
                where: { parent_id: hmsAcc.id },
                data: { module_key: 'accounting' }
            });
        }

        // Move 'hms-inventory' to 'inventory' module
        await prisma.menu_items.updateMany({
            where: { key: 'hms-inventory' },
            data: { module_key: 'inventory', sort_order: 50, label: 'Pharmacy Store' } // Rename to distinguish
        });
        const hmsInv = await prisma.menu_items.findFirst({ where: { key: 'hms-inventory' } });
        if (hmsInv) {
            await prisma.menu_items.updateMany({
                where: { parent_id: hmsInv.id },
                data: { module_key: 'inventory' }
            });
        }

        // Move 'hms-purchasing' to 'inventory' module (Procurement)
        await prisma.menu_items.updateMany({
            where: { key: 'hms-purchasing' },
            data: { module_key: 'inventory', sort_order: 60, label: 'Central Purchasing' }
        });
        const hmsPurch = await prisma.menu_items.findFirst({ where: { key: 'hms-purchasing' } });
        if (hmsPurch) {
            await prisma.menu_items.updateMany({
                where: { parent_id: hmsPurch.id },
                data: { module_key: 'inventory' }
            });
        }

    } catch (e) {
        console.error("Failed to seed Purchasing menus:", e);
    }
}
