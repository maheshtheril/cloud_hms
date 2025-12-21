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
        // Fetch all active modules
        const activeModules = await prisma.modules.findMany({
            where: { is_active: true }
        });

        // 1. FETCH ALL ITEMS (No filtering yet)
        const allMenuItems = await prisma.menu_items.findMany({
            orderBy: { sort_order: 'asc' },
            include: {
                module_menu_map: {
                    include: {
                        modules: true
                    }
                }
            }
        });

        if (allMenuItems.length === 0) {
            return [{
                module: { name: 'General', module_key: 'general' },
                items: getFallbackMenuItems(isAdmin)
            }];
        }

        // 2. Build Tree
        const itemMap = new Map();
        const rootItems: any[] = [];

        // First pass: map all items
        allMenuItems.forEach(item => {
            itemMap.set(item.id, { ...item, other_menu_items: [] });
        });

        // Second pass: attach dependencies
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

        // Initialize active module groups
        for (const mod of activeModules) {
            grouped[mod.module_key] = {
                module: mod,
                items: []
            };
        }
        if (!grouped['general']) {
            grouped['general'] = { module: { name: 'General', module_key: 'general' }, items: [] };
        }

        // 4. Assign Items to Groups
        for (const item of rootItems) {
            const modKey = getModuleKey(item);

            // If group doesn't exist (module disabled or missing), create dynamic group
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

        const result = Object.values(grouped).filter(g => g.items.length > 0);

        // Safety check
        if (result.length === 0) {
            return [{
                module: { name: 'General', module_key: 'general' },
                items: getFallbackMenuItems(isAdmin)
            }];
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
                { key: 'settings', label: 'Global Settings', icon: 'Settings', url: '/settings' },
                { key: 'admin', label: 'Admin Panel', icon: 'Shield', url: '/admin' }
            ]
        });
    }

    return items;
}
