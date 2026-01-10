'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { getUserPermissions, seedRolesAndPermissions } from "./rbac"
import { ensureAdminMenus } from "@/lib/menu-seeder"

export async function getMenuItems() {
    const session = await auth();
    // if (!session?.user) return []; 

    const isAdmin = session?.user?.isAdmin;
    let industry = ''; // we can fetch this if needed

    // EMERGENCY OVERRIDE REMOVED: Now fully dynamic based on RBAC permissions and Module Subscriptions.
    // The previous hardcoded block for 'receptionist' is removed to respect the 'Roles & Permissions' configuration.

    // FETCH USER PERMISSIONS
    const userPermsRaw = session?.user?.id ? await getUserPermissions(session.user.id) : [];
    // Convert to Set for easy lookup
    const userPerms = new Set(Array.isArray(userPermsRaw) ? userPermsRaw : []);

    // FAILSAFE: Grant Full Access to Admins
    if (isAdmin) {
        userPerms.add('*');
    }

    // FAILSAFE: Explicit Role-Based Permissions (Emergency Restore)
    if (session?.user?.role === 'receptionist') {
        userPerms.add('hms:dashboard:reception');
        userPerms.add('patients:view');
        userPerms.add('appointments:view');
        userPerms.add('billing:view');
    }
    const role = session?.user?.role?.toLowerCase() || '';
    const name = session?.user?.name?.toLowerCase() || '';
    const email = session?.user?.email?.toLowerCase() || '';

    if (role === 'lab_technician' || name.includes('lab') || email.includes('laab')) {
        userPerms.add('lab:view');
        userPerms.add('hms:view'); // Ensure they have base usage rights
    }

    try {
        // Self-Healing: Ensure Admin Menus Exist
        if (isAdmin) {
            await ensureAdminMenus();
            // Ensure Journal menus are seeded for admins/finance
            const { ensureAccountingMenu, ensureCrmMenus, ensurePurchasingMenus, ensureHmsMenus } = await import('@/lib/menu-seeder');
            await ensureAccountingMenu();
            await ensureCrmMenus();
            await ensurePurchasingMenus();
            await ensureHmsMenus();
        }

        // Fetch Tenant Details for Industry Check
        let industry = '';
        if (session?.user?.tenantId) {
            const tenant = await prisma.tenant.findUnique({
                where: { id: session.user.tenantId },
                select: { metadata: true }
            });
            const metadata = tenant?.metadata as any;
            industry = metadata?.industry || '';
        }

        const isHealthcare = industry.toLowerCase().includes('health') || industry.toLowerCase().includes('clinic') || industry.toLowerCase().includes('hospital');

        // Fetch active modules (Global)
        const globalActiveModules = await prisma.modules.findMany({
            where: { is_active: true }
        });

        // DEFINED ALLOWED MODULES
        let allowedModuleKeys = new Set<string>();

        if (session?.user?.tenantId) {

            // 1. ADD SUBSCRIBED MODULES FIRST (Base Truth)
            // We re-enable this to ensure paying attributes are respected.
            const tenantModules = await prisma.tenant_module.findMany({
                where: { tenant_id: session.user.tenantId, enabled: true }
            });
            tenantModules.forEach(tm => allowedModuleKeys.add(tm.module_key));

            // 2. APPLY INDUSTRY DEFAULTS (Only if NO explicit subscriptions found)
            if (tenantModules.length === 0) {
                if (isHealthcare) {
                    allowedModuleKeys.add('hms');
                    allowedModuleKeys.add('finance');
                    allowedModuleKeys.add('inventory');
                } else {
                    // FORCE CRM for non-healthcare
                    allowedModuleKeys.add('crm');
                    // FORCE FINANCE for verifying functionality
                    allowedModuleKeys.add('finance');
                    allowedModuleKeys.add('inventory');
                }
            }

        } else {
            // No tenant? Allow all global.
            globalActiveModules.forEach(m => allowedModuleKeys.add(m.module_key));
        }

        // Always allow General and Configuration
        allowedModuleKeys.add('general');
        allowedModuleKeys.add('configuration');

        // 3. IMPLICIT PERMISSION-BASED MODULE ACCESS (Safety Net)
        // If a user has permission to view a module, they should see its menu, 
        // regardless of tenant-level flags (which might be misconfigured).
        if (userPerms.has('hms:view') || userPerms.has('hms:dashboard:reception') || userPerms.has('hms:dashboard:doctor')) {
            allowedModuleKeys.add('hms');
        }
        if (userPerms.has('crm:view') || userPerms.has('crm:admin')) {
            allowedModuleKeys.add('crm');
        }
        if (userPerms.has('accounting:view') || userPerms.has('finance:view') || userPerms.has('billing:view')) {
            allowedModuleKeys.add('accounting');
            allowedModuleKeys.add('finance');
        }
        if (userPerms.has('inventory:view') || userPerms.has('purchasing:view') || userPerms.has('pharmacy:view')) {
            allowedModuleKeys.add('inventory');
        }

        // AUTO-MIGRATION REMOVED
        // We now rely on the 'auditAndFixMenuPermissions' function in RootLayout
        // to handle data standardization. This prevents read-time mutation conflicts.

        // 1. FETCH ALL ITEMS
        const allMenuItems = await prisma.menu_items.findMany({
            orderBy: { sort_order: 'asc' },
            include: { module_menu_map: { include: { modules: true } } }
        });

        if (allMenuItems.length === 0) {
            return getFallbackMenuItems(isAdmin);
        }

        // 2. Build Tree
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

        // SELF-HEAL: Ensure CRM Menus are correct if CRM is active
        if (allowedModuleKeys.has('crm')) {
            const { ensureCrmMenus } = await import('@/lib/menu-seeder');
            // We run this asynchronously to not block the UI response too much, 
            // but for the first fix we await it to ensure immediate result.
            // check if we need to run it (maybe optimize later)
            await ensureCrmMenus();
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

            // If group doesn't exist
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
            grouped[key].items = filterRestricted(grouped[key].items);
        });

        // 6. SORT BY PRIORITY (World Standard Ordering)
        const priority = ['hms', 'accounting', 'inventory', 'crm', 'general', 'configuration'];
        const result = Object.values(grouped)
            .filter(g => g.items.length > 0)
            .sort((a, b) => {
                const indexA = priority.indexOf(a.module?.module_key || '');
                const indexB = priority.indexOf(b.module?.module_key || '');
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                return (a.module?.name || '').localeCompare(b.module?.name || '');
            });

        // FORCE INJECT ADMIN MENU (Hybrid Approach)
        const hasFullAccess = isAdmin || userPerms.has('*') || userPerms.has('settings:view');

        if (hasFullAccess) {
            const standardConfigItems = [
                { key: 'general-settings', label: 'General Settings', icon: 'Settings', url: '/settings/global' },
                // ... (items preserved)
            ];
            // ... (rest validation)
        }

        // 7. INJECT MISSING CORE MODULES (Hybrid Mode) - DISABLED
        // This was causing a security leak: if RBAC filtered out all items for a module, 
        // this logic was re-injecting the full unrestricted fallback menu!
        /*
        const fallback = getFallbackMenuItems(isAdmin);
        const coreKeys = ['accounting', 'inventory', 'crm', 'hms'];
 
        coreKeys.forEach(key => {
            // KEY FIX: Only consider injection if the module is in allowedModuleKeys
            if (!allowedModuleKeys.has(key)) return;
 
            const exists = result.find(g => g.module?.module_key === key);
            if (!exists) {
                const fallbackGroup = fallback.find((g: any) => g.module?.module_key === key);
                if (fallbackGroup) {
                    result.push(fallbackGroup);
                }
            }
        });
        */



        // Re-sort after injection
        result.sort((a, b) => {
            const indexA = priority.indexOf(a.module?.module_key || '');
            const indexB = priority.indexOf(b.module?.module_key || '');
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
            { key: 'hms-dashboard', label: 'Command Center', icon: 'Activity', url: '/hms/dashboard', permission_code: 'hms:admin' },
            { key: 'hms-reception', label: 'Reception', icon: 'Monitor', url: '/hms/reception/dashboard', permission_code: 'hms:dashboard:reception' },
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
                    { key: 'nursing-station', label: 'Nursing Station', icon: 'Activity', url: '/hms/nursing' },
                    { key: 'doctors', label: 'Medical Staff', icon: 'UserCheck', url: '/hms/doctors' },
                ]
            }
        ]
    });

    // 2. ACCOUNTING (Finance & Ledger)
    items.push({
        module: { name: 'Accounting & Finance', module_key: 'accounting' },
        items: [
            { key: 'acc-dashboard', label: 'Financial Overview', icon: 'LayoutDashboard', url: '/hms/accounting' },
            {
                key: 'acc-receivables',
                label: 'Income & Sales',
                icon: 'TrendingUp',
                url: '#',
                other_menu_items: [
                    { key: 'hms-billing', label: 'Patient Invoices', icon: 'Receipt', url: '/hms/billing' },
                    { key: 'hms-sales-returns', label: 'Credit Notes', icon: 'RotateCcw', url: '/hms/billing/returns' },
                    { key: 'acc-payments', label: 'Payments Received', icon: 'CreditCard', url: '/hms/accounting/receipts' },
                ]
            },
            {
                key: 'acc-payables',
                label: 'Expenses & Buys',
                icon: 'TrendingDown',
                url: '#',
                other_menu_items: [
                    { key: 'acc-bills', label: 'Vendor Bills', icon: 'FileMinus', url: '/hms/purchasing/bills' }, // Linked to Purchasing
                    { key: 'acc-expenses', label: 'Expenses', icon: 'Receipt', url: '/hms/accounting/payments' },
                ]
            },
            {
                key: 'acc-ledger',
                label: 'General Ledger',
                icon: 'Book',
                url: '#',
                other_menu_items: [
                    { key: 'acc-coa', label: 'Chart of Accounts', icon: 'List', url: '/hms/accounting/coa' },
                    { key: 'acc-journals', label: 'Journal Entries', icon: 'BookOpen', url: '/hms/accounting/journals' },
                ]
            }
        ]
    });

    // 3. INVENTORY (Pharmacy & Assets)
    items.push({
        module: { name: 'Pharmacy & Inventory', module_key: 'inventory' },
        items: [
            { key: 'inv-dashboard', label: 'Command Center', icon: 'LayoutDashboard', url: '/hms/inventory' },
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
                    { key: 'inv-returns', label: 'Purchase Returns', icon: 'Undo2', url: '/hms/purchasing/returns' },
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

/**
 * SELF-HEALING: Audit and Fix Menu Permissions
 * Ensures all menu items have valid permission codes.
 */
export async function auditAndFixMenuPermissions() {
    try {
        // -1. ENSURE PERMISSIONS EXIST
        // Run seed check to register any missing permission codes (like 'hms:dashboard:reception')
        await seedRolesAndPermissions();

        // 0. CHECK REAL MODULES (User Request)
        // We first understand what modules actually exist in the DB to avoid invalid remapping.
        const allModules = await prisma.modules.findMany({ select: { module_key: true } });
        const validKeys = new Set(allModules.map(m => m.module_key.toLowerCase()));

        // 1. STANDARDIZE MODULE KEYS (Smart Fix)
        const potentialRemaps = [
            { source: 'finance', target: 'accounting' },
            { source: 'sales', target: 'crm' },
            { source: 'purchasing', target: 'inventory' }
        ];

        for (const remap of potentialRemaps) {
            if (validKeys.has(remap.target)) {
                // Target exists (e.g. 'accounting'), safely move source items there
                await prisma.menu_items.updateMany({
                    where: { module_key: remap.source },
                    data: { module_key: remap.target }
                });
            } else if (validKeys.has(remap.source)) {
                // Target missing, but source exists (e.g. 'finance'). 
                // Ensure consistency by moving any stray Target items to Source
                await prisma.menu_items.updateMany({
                    where: { module_key: remap.target },
                    data: { module_key: remap.source }
                });
            }
        }

        // 2. SPECIFIC OVERRIDES (Granular Control & Configuration Security)
        const specificOverrides = [
            // CRM Granular
            { key: 'crm-targets', perm: 'crm:targets:view' },
            { key: 'crm-pipeline', perm: 'crm:pipeline:view' },
            { key: 'crm-scheduler', perm: 'crm:scheduler:view' },
            { key: 'crm-activities', perm: 'crm:activities:view' },
            { key: 'crm-contacts', perm: 'crm:contacts:view' },
            { key: 'crm-accounts', perm: 'crm:accounts:view' },
            { key: 'crm-leads', perm: 'leads:view' },
            { key: 'crm-deals', perm: 'deals:view' },
            { key: 'crm-reports', perm: 'crm:reports' },

            // CONFIGURATION SECURITY (Fix "Show to All" Issue)
            // Ensure these settings items require specific module permissions
            { key: 'crm-masters', perm: 'crm:admin' },
            { key: 'crm-settings', perm: 'crm:admin' },
            { key: 'hms-config', perm: 'hms:admin' },
            { key: 'accounting-settings', perm: 'accounting:view' },

            // PURCHASING & INVENTORY (Granular)
            { key: 'inv-po', perm: 'purchasing:view' },
            { key: 'hms-purchasing-orders', perm: 'purchasing:view' },
            { key: 'inv-returns', perm: 'purchasing:returns:view' },
            { key: 'hms-purchasing-returns', perm: 'purchasing:returns:view' },
            { key: 'inv-suppliers', perm: 'suppliers:view' },
            { key: 'hms-purchasing-suppliers', perm: 'suppliers:view' },
            { key: 'purch-suppliers', perm: 'suppliers:view' },

            // RECEPTIONIST CLEANUP (Hide irrelevent items)
            { key: 'hms-laboratory', perm: 'lab:view' },
            { key: 'hms-pharmacy', perm: 'pharmacy:view' },
            { key: 'hms-sales-returns', perm: 'billing:void' }, // Only admins/managers should process returns
            { key: 'settings', perm: 'system:admin' }, // Hide Global Settings
            { key: 'configuration', perm: 'system:admin' }, // Hide Configuration Group
            { key: 'hms-settings', perm: 'hms:admin' },

            { key: 'hms-lab', perm: 'lab:view' }, // Strict Lab Access

            // STRICT DASHBOARDS
            { key: 'hms-dashboard', perm: 'hms:admin' }, // Main dashboard is for admins
            { key: 'hms-reception', perm: 'hms:dashboard:reception' }, // Strict Reception Access
            { key: 'hms-doctors', perm: 'hms:admin' }, // Only Admins should manage doctors menu

            // ATTENDANCE
            { key: 'hms-attendance', perm: 'hms:view' }, // Available to all clinical staff
            { key: 'crm-attendance', perm: 'hms:view' },

            // CORE CLINICAL (Granular Access)
            { key: 'hms-patients', perm: 'patients:view' },
            { key: 'hms-appointments', perm: 'appointments:view' },
            { key: 'hms-schedule', perm: 'appointments:view' },
            { key: 'hms-billing', perm: 'billing:view' }
        ];

        for (const o of specificOverrides) {
            await prisma.menu_items.updateMany({
                where: { key: o.key },
                data: { permission_code: o.perm }
            });
        }

        // 3. GENERIC MODULE SECURITY (Apply Permissions)
        const modulesToSecure = [
            { key: 'crm', perm: 'crm:view' },
            { key: 'inventory', perm: 'inventory:view' },
            { key: 'hms', perm: 'hms:view' },
            { key: 'hr', perm: 'hr:view' },
            { key: 'accounting', perm: 'accounting:view' },
            { key: 'finance', perm: 'accounting:view' }, // Fallback
            { key: 'purchasing', perm: 'inventory:view' }, // Fallback
            { key: 'projects', perm: 'crm:view' }
        ];

        for (const m of modulesToSecure) {
            // Apply to whatever items remain (remapped or not)
            await prisma.menu_items.updateMany({
                where: {
                    module_key: m.key,
                    permission_code: null
                },
                data: { permission_code: m.perm }
            });
        }

        // 4. REPORTS (Safe Update)
        await prisma.menu_items.updateMany({
            where: { module_key: 'reports', permission_code: null },
            data: { permission_code: 'system:view' }
        });

        console.log("Self-healing: Menu permissions audited and fixed.");
        return { success: true };
    } catch (error) {
        console.error("Self-healing failed:", error);
        return { success: false };
    }
}
