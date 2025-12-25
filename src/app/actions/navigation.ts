'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { getUserPermissions } from "./rbac"

export async function getMenuItems() {
    const session = await auth();
    // if (!session?.user) return []; 

    const isAdmin = session?.user?.isAdmin;
    let industry = ''; // we can fetch this if needed

    // FETCH USER PERMISSIONS
    const userPerms = session?.user?.id ? await getUserPermissions(session.user.id) : new Set<string>();
    // If admin matches standard "superuser", assume wildcards are handled by getUserPermissions (e.g. '*') 
    // or explicit roles.

    try {
        // Fetch active modules (Global)
        const globalActiveModules = await prisma.modules.findMany({
            where: { is_active: true }
        });

        // Fetch Tenant Subscribed Modules
        let allowedModuleKeys = new Set<string>();
        if (session?.user?.tenantId) {
            const tenantModules = await prisma.tenant_module.findMany({
                where: { tenant_id: session.user.tenantId, enabled: true }
            });

            if (tenantModules.length > 0) {
                // Strict Mode: Only allow subscribed modules
                tenantModules.forEach(tm => allowedModuleKeys.add(tm.module_key));
            } else {
                // Fallback: If no tenant_module records, allow all global active modules (Trial/Legacy)
                globalActiveModules.forEach(m => allowedModuleKeys.add(m.module_key));
            }
        } else {
            // No tenant context? Allow all.
            globalActiveModules.forEach(m => allowedModuleKeys.add(m.module_key));
        }

        // Always allow General and Configuration
        allowedModuleKeys.add('general');
        allowedModuleKeys.add('configuration');

        // 1. FETCH ALL ITEMS ... (existing code)
        const allMenuItems = await prisma.menu_items.findMany({
            orderBy: { sort_order: 'asc' },
            include: { module_menu_map: { include: { modules: true } } }
        });

        if (allMenuItems.length === 0) {
            // ... fallback logic
            return getFallbackMenuItems(isAdmin);
        }

        // 2. Build Tree ... (existing code)
        const itemMap = new Map();
        const rootItems: any[] = [];
        allMenuItems.forEach(item => { itemMap.set(item.id, { ...item, other_menu_items: [] }); });
        allMenuItems.forEach(item => {
            const node = itemMap.get(item.id);
            if (item.parent_id && itemMap.has(item.parent_id)) {
                itemMap.get(item.parent_id).other_menu_items.push(node);
            } else {
                rootItems.push(node);
            }
        });

        // 3. Group by Module
        const grouped: Record<string, { module: any, items: any[] }> = {};

        // Helper to get module key
        const getModuleKey = (item: any) => {
            if (item.module_key) return item.module_key;
            if (item.module_menu_map && item.module_menu_map.length > 0) {
                return item.module_menu_map[0].module_key;
            }
            return 'general';
        };

        // Initialize groups for Allowed Modules
        for (const mod of globalActiveModules) {
            if (allowedModuleKeys.has(mod.module_key)) {
                grouped[mod.module_key] = { module: mod, items: [] };
            }
        }
        if (!grouped['general']) { // Always ensure General exists
            grouped['general'] = { module: { name: 'General', module_key: 'general' }, items: [] };
        }

        // 4. Assign Items to Groups (WITH MODULE FILTERING)
        for (const item of rootItems) {
            const modKey = getModuleKey(item);

            // STRICT CHECK: Skip if module not allowed for this tenant
            if (!allowedModuleKeys.has(modKey)) {
                continue;
            }

            // If group doesn't exist (e.g. was global active but not in initial loop? or custom key?)
            // We only create if allowed.
            if (!grouped[modKey]) {
                grouped[modKey] = { module: { name: modKey.toUpperCase(), module_key: modKey }, items: [] };
            }

            grouped[modKey].items.push(item);
        }

        // 5. RBAC FILTERING
        // Helper to recursively filter items
        const filterRestricted = (items: any[]) => {
            return items.filter(item => {
                // Check direct permission
                const allowed = !item.permission_code || userPerms.has(item.permission_code) || userPerms.has('*');
                if (!allowed) return false;

                // Recursively check children
                if (item.other_menu_items && item.other_menu_items.length > 0) {
                    item.other_menu_items = filterRestricted(item.other_menu_items);
                }

                return true;
            });
        };

        // Filter groups
        Object.keys(grouped).forEach(key => {
            // Filter restricted items AND Explicitly remove "Global Settings", "Settings", or "Custom Fields" if coming from DB
            // to avoid duplicates or unwanted legacy items, as we inject Configuration manually if needed.
            grouped[key].items = filterRestricted(grouped[key].items).filter(item =>
                item.label !== 'Global Settings' &&
                item.label !== 'Settings' &&
                item.label !== 'Custom Fields' &&
                item.label !== 'Targets' && // Hide Targets from standard menu
                item.url !== '/crm/targets' &&
                item.url !== '/settings'
            );
        });

        // 6. SORT BY PRIORITY (World Standard Ordering)
        const priority = ['hms', 'accounting', 'inventory', 'crm', 'general', 'configuration'];
        const result = Object.values(grouped)
            .filter(g => g.items.length > 0)
            .sort((a, b) => {
                const indexA = priority.indexOf(a.module?.module_key || '');
                const indexB = priority.indexOf(b.module?.module_key || '');
                // If both found, sort by priority
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                // If only A found, A comes first
                if (indexA !== -1) return -1;
                // If only B found, B comes first
                if (indexB !== -1) return 1;
                // Otherwise sort alphabetically
                return (a.module?.name || '').localeCompare(b.module?.name || '');
            });

        // FORCE INJECT ADMIN MENU (Hybrid Approach)
        // Ensure Admins always have access to Configuration, even if DB is missing these items.
        // We check for isAdmin flag OR wildcard permission.
        const hasFullAccess = isAdmin || userPerms.has('*') || userPerms.has('settings:view');

        if (hasFullAccess) {
            // 1. Define ALL Standard Config Items (Restoring missing CRM/Permissions items)
            const standardConfigItems = [
                { key: 'general-settings', label: 'General Settings', icon: 'Settings', url: '/settings/global' },
                { key: 'hms-settings', label: 'HMS Configuration', icon: 'Activity', url: '/settings/hms' },
                { key: 'users', label: 'Users', icon: 'Users', url: '/settings/users' },
                { key: 'roles', label: 'Roles', icon: 'Shield', url: '/settings/roles' },
                { key: 'permissions', label: 'Permissions', icon: 'Key', url: '/settings/permissions' },
                { key: 'crm-masters', label: 'CRM Masters', icon: 'Database', url: '/settings/crm' },
                { key: 'custom-fields', label: 'Custom Fields', icon: 'FileText', url: '/settings/custom-fields' },
                { key: 'import-leads', label: 'Import Leads', icon: 'UploadCloud', url: '/crm/import/leads' },
                { key: 'crm-targets', label: 'Targets', icon: 'Target', url: '/crm/targets' }
            ];

            // 2. Find Existing Config Group from DB
            const existingConfig = result.find(g => g.module?.module_key === 'configuration' || g.module?.name === 'Configuration');

            if (existingConfig) {
                // MERGE: Add standard items if they don't already exist
                standardConfigItems.forEach((standardItem: any) => {
                    const exists = existingConfig.items.some((dbItem: any) =>
                        dbItem.key === standardItem.key || dbItem.url === standardItem.url
                    );
                    if (!exists) {
                        existingConfig.items.push(standardItem);
                    }
                });
            } else {
                // CREATE new group if it doesn't exist
                result.push({
                    module: { name: 'Configuration', module_key: 'configuration' },
                    items: standardConfigItems
                });
            }
        }

        // 7. INJECT MISSING CORE MODULES (Hybrid Mode)
        // If DB has HMS but lacks Accounting/Inventory/CRM, inject them from standard fallback
        const fallback = getFallbackMenuItems(isAdmin);
        const coreKeys = ['accounting', 'inventory', 'crm'];

        coreKeys.forEach(key => {
            const exists = result.find(g => g.module?.module_key === key);
            if (!exists) {
                const fallbackGroup = fallback.find((g: any) => g.module?.module_key === key);
                if (fallbackGroup) {
                    result.push(fallbackGroup);
                }
            }
        });

        // Re-sort after injection
        result.sort((a, b) => {
            const indexA = priority.indexOf(a.module?.module_key || '');
            const indexB = priority.indexOf(b.module?.module_key || '');
            // If both found, sort by priority
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return (a.module?.name || '').localeCompare(b.module?.name || '');
        });

        return result;

    } catch (error) {
        console.error("Failed to fetch menu items:", error);
        return getFallbackMenuItems(isAdmin);
    }
}

function getFallbackMenuItems(isAdmin: boolean | undefined) {
    // WORLD CLASS TREE STRUCTURE FALLBACK
    const items: any[] = [];

    // 1. HMS (Core Medical Ops)
    items.push({
        module: { name: 'Health Management', module_key: 'hms' },
        items: [
            { key: 'hms-dashboard', label: 'Command Center', icon: 'Activity', url: '/hms/dashboard' },
            {
                key: 'hms-patients',
                label: 'Patient Care',
                icon: 'Users',
                url: '#',
                other_menu_items: [
                    { key: 'patient-list', label: 'Patient Registry', icon: 'User', url: '/hms/patients' },
                    { key: 'patient-registration', label: 'Admission / Reg', icon: 'Plus', url: '/hms/patients/new' },
                ]
            },
            {
                key: 'hms-appointments',
                label: 'Scheduling',
                icon: 'Calendar',
                url: '#',
                other_menu_items: [
                    { key: 'apt-calendar', label: 'Doctor Calendar', icon: 'Calendar', url: '/hms/appointments' },
                    { key: 'apt-list', label: 'All Attributes', icon: 'List', url: '/hms/appointments/list' },
                ]
            },
            {
                key: 'hms-clinical',
                label: 'Clinical',
                icon: 'Stethoscope',
                url: '#',
                other_menu_items: [
                    { key: 'prescriptions', label: 'Prescriptions', icon: 'FileText', url: '/hms/prescriptions' },
                    { key: 'doctors', label: 'Medical Staff', icon: 'UserCheck', url: '/hms/doctors' },
                ]
            }
        ]
    });

    // 2. ACCOUNTING (Finance & Ledger)
    items.push({
        module: { name: 'Accounting & Finance', module_key: 'accounting' },
        items: [
            { key: 'acc-dashboard', label: 'Financial Overview', icon: 'LayoutDashboard', url: '/accounting/dashboard' },
            {
                key: 'acc-receivables',
                label: 'Income & Sales',
                icon: 'TrendingUp',
                url: '#',
                other_menu_items: [
                    { key: 'hms-billing', label: 'Patient Invoices', icon: 'Receipt', url: '/hms/billing' },
                    { key: 'acc-payments', label: 'Payments Received', icon: 'CreditCard', url: '/accounting/income/payments' },
                ]
            },
            {
                key: 'acc-payables',
                label: 'Expenses & Buys',
                icon: 'TrendingDown',
                url: '#',
                other_menu_items: [
                    { key: 'acc-bills', label: 'Vendor Bills', icon: 'FileMinus', url: '/hms/purchasing/bills' }, // Linked to Purchasing
                    { key: 'acc-expenses', label: 'Expenses', icon: 'Receipt', url: '/accounting/expenses' },
                ]
            },
            {
                key: 'acc-ledger',
                label: 'General Ledger',
                icon: 'Book',
                url: '#',
                other_menu_items: [
                    { key: 'acc-coa', label: 'Chart of Accounts', icon: 'List', url: '/accounting/coa' },
                    { key: 'acc-journals', label: 'Journal Entries', icon: 'BookOpen', url: '/accounting/journals' },
                ]
            }
        ]
    });

    // 3. INVENTORY (Pharmacy & Assets)
    items.push({
        module: { name: 'Pharmacy & Inventory', module_key: 'inventory' },
        items: [
            { key: 'inv-products', label: 'Product Master', icon: 'Package', url: '/hms/inventory/products' },
            {
                key: 'inv-procurement',
                label: 'Procurement',
                icon: 'ShoppingCart',
                url: '#',
                other_menu_items: [
                    { key: 'inv-suppliers', label: 'Suppliers', icon: 'Truck', url: '/hms/purchasing/suppliers' },
                    { key: 'inv-po', label: 'Purchase Orders', icon: 'FileText', url: '/hms/purchasing/orders' },
                    { key: 'inv-receipts', label: 'Goods Receipts', icon: 'ClipboardList', url: '/hms/purchasing/receipts' },
                ]
            }
        ]
    });

    // 4. CRM (Optional)
    items.push({
        module: { name: 'CRM & Engagement', module_key: 'crm' },
        items: [
            { key: 'crm-leads', label: 'Leads Pipeline', icon: 'Users', url: '/crm/leads' },
            { key: 'crm-dashboard', label: 'Performance', icon: 'BarChart', url: '/crm/dashboard' },
        ]
    });


    // 5. CONFIG
    if (isAdmin) {
        items.push({
            module: { name: 'System Configuration', module_key: 'configuration' },
            items: [
                { key: 'users', label: 'User Management', icon: 'Users', url: '/settings/users' },
                { key: 'roles', label: 'RBAC & Security', icon: 'Shield', url: '/settings/roles' },
                { key: 'settings', label: 'Global Settings', icon: 'Settings', url: '/settings/global' },
                { key: 'hms-settings', label: 'HMS Configuration', icon: 'Activity', url: '/settings/hms' },
            ]
        });
    }

    return items;
}
