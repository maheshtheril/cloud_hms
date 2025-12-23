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

        // Always allow General
        allowedModuleKeys.add('general');

        // 1. FETCH ALL ITEMS ... (existing code)
        const allMenuItems = await prisma.menu_items.findMany({
            orderBy: { sort_order: 'asc' },
            include: { module_menu_map: { include: { modules: true } } }
        });

        if (allMenuItems.length === 0) {
            // ... fallback logic
            return [{
                module: { name: 'General', module_key: 'general' },
                items: getFallbackMenuItems(isAdmin)
            }];
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

        const result = Object.values(grouped).filter(g => g.items.length > 0);

        // FORCE INJECT ADMIN MENU (Hybrid Approach)
        // Ensure Admins always have access to Configuration, even if DB is missing these items.
        // We check for isAdmin flag OR wildcard permission.
        const hasFullAccess = isAdmin || userPerms.has('*') || userPerms.has('settings:view');

        if (hasFullAccess) {
            // Check if we already have a configuration group from DB
            const existingConfig = result.find(g => g.module?.module_key === 'configuration' || g.module?.name === 'Configuration');

            if (!existingConfig) {
                result.push({
                    module: { name: 'Configuration', module_key: 'configuration' },
                    items: [
                        { key: 'general-settings', label: 'General Settings', icon: 'Settings', url: '/settings/global' },
                        { key: 'users', label: 'Users', icon: 'Users', url: '/settings/users' },
                        { key: 'roles', label: 'Roles', icon: 'Shield', url: '/settings/roles' },
                        { key: 'permissions', label: 'Permissions', icon: 'Key', url: '/settings/permissions' },
                        { key: 'crm-masters', label: 'CRM Masters', icon: 'Database', url: '/settings/crm' },
                        { key: 'custom-fields', label: 'Custom Fields', icon: 'FileText', url: '/settings/custom-fields' },
                        { key: 'import-leads', label: 'Import Leads', icon: 'UploadCloud', url: '/crm/import/leads' },
                        { key: 'crm-targets', label: 'Targets', icon: 'Target', url: '/crm/targets' } // Moved here
                    ]
                });
            } else {
                // If config group exists (from DB), ensures these critical manual items are present if not already
                // For now, simpler to just assume if config exists in DB it's managed there, 
                // OR we can merge. Let's stick to the push block for creating new group.
            }
        }

        return result;

    } catch (error) {
        console.error("Failed to fetch menu items:", error);
        return [{
            module: { name: 'General', module_key: 'general' },
            items: getFallbackMenuItems(isAdmin)
        }];
    }
}

function getFallbackMenuItems(isAdmin: boolean | undefined) {
    // TREE STRUCTURE FALLBACK
    let items: any[] = [
        { key: 'crm-dashboard', label: 'Command Center', icon: 'LayoutDashboard', url: '/crm/dashboard', padding_left: 0 },

        // Sales Group
        {
            key: 'sales-group',
            label: 'Sales Pipeline',
            icon: 'Briefcase',
            url: '#',
            other_menu_items: [
                { key: 'crm-leads', label: 'Leads', icon: 'Users', url: '/crm/leads' },
                { key: 'crm-deals', label: 'Deals', icon: 'Target', url: '/crm/deals' },
                { key: 'crm-contacts', label: 'Contacts', icon: 'Users', url: '/crm/contacts' },
            ]
        },

        // HMS Group
        {
            key: 'hms-group',
            label: 'Hospital Ops',
            icon: 'Activity',
            url: '#',
            other_menu_items: [
                { key: 'hms-dashboard', label: 'HMS Dashboard', icon: 'LayoutDashboard', url: '/hms/dashboard' },
                { key: 'patients', label: 'Patients', icon: 'Users', url: '/hms/patients' },
                { key: 'appointments', label: 'Appointments', icon: 'Calendar', url: '/hms/appointments' },
                { key: 'billing', label: 'Billing', icon: 'Receipt', url: '/hms/billing' },
            ]
        }
    ];

    if (isAdmin) {
        items.push({
            key: 'config-group',
            label: 'Configuration',
            icon: 'Settings',
            url: '#',
            other_menu_items: [
                { key: 'users', label: 'Users', icon: 'Users', url: '/settings/users' },
                { key: 'roles', label: 'Roles', icon: 'Shield', url: '/settings/roles' },
                { key: 'permissions', label: 'Permissions', icon: 'Key', url: '/settings/permissions' },
                { key: 'admin', label: 'Admin Panel', icon: 'Shield', url: '/admin' }
            ]
        });
    }

    return items;
}
