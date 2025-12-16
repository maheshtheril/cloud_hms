'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getMenuItems() {
    const session = await auth();
    if (!session?.user) return [];

    const isAdmin = session.user.isAdmin;

    try {
        // Fetch enabled modules for this tenant
        const tenantId = session.user.tenantId; // Ensure type exists, or use any

        let enabledModuleKeys: string[] = [];
        let industry = '';

        if (tenantId) {
            const tenantModules = await prisma.tenant_module.findMany({
                where: { tenant_id: tenantId, enabled: true },
                select: { module_key: true }
            });
            enabledModuleKeys = tenantModules.map(tm => tm.module_key);

            const company = await prisma.company.findFirst({
                where: { tenant_id: tenantId }
            });
            industry = company?.industry || '';
        }

        // Fetch all active modules
        // Filter by enabled keys if we have any tenant-specific specs
        const whereClause: any = { is_active: true };
        if (enabledModuleKeys.length > 0) {
            whereClause.module_key = { in: enabledModuleKeys };
        }

        const activeModules = await prisma.modules.findMany({
            where: whereClause,
            // orderBy: { sort_order: 'asc' } 
        });

        // Fetch ALL menu items (flat list) to build tree in memory for unlimited depth
        const allMenuItems = await prisma.menu_items.findMany({
            // where: { is_active: true }, // If column existed
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
                items: getFallbackMenuItems(isAdmin, industry)
            }];
        }

        // Build Tree
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

        // Sort children recursively (if needed, though findMany sort helps)
        // Since findMany is sorted by sort_order, the push order should be roughly correct,
        // but explicit sort on children array is safer if desired.

        // Group by module (only root items need to be grouped, children follow parents)
        const grouped: Record<string, { module: any, items: any[] }> = {};

        // Helper to get module key for an item
        const getModuleKey = (item: any) => {
            if (item.module_key) return item.module_key;
            if (item.module_menu_map && item.module_menu_map.length > 0) {
                return item.module_menu_map[0].module_key;
            }
            // If parent has a module, arguably child should inherit, but here we group roots.
            return 'general';
        };

        // Initialize groups
        for (const mod of activeModules) {
            grouped[mod.module_key] = {
                module: mod,
                items: []
            };
        }
        if (!grouped['general']) {
            grouped['general'] = { module: { name: 'General', module_key: 'general' }, items: [] };
        }

        // --- FIXED LOGIC ---
        // 1. Determine "Context" (Healthcare vs Gen/CRM)
        // If industry is explicit, trust it.
        // If industry is empty, check enabled modules. If 'hms' is enabled, default to Healthcare. 
        // If 'hms' is NOT enabled but 'crm' IS, default to Non-Healthcare.

        let isHealthcare = false;

        if (industry) {
            isHealthcare = (industry === 'Healthcare' || industry === 'Hospital');
        } else {
            // Fallback: Check modules
            const hasHMS = enabledModuleKeys.includes('hms');
            const hasCRM = enabledModuleKeys.includes('crm');

            if (hasHMS) isHealthcare = true;
            else if (hasCRM) isHealthcare = false; // Only CRM -> Not Healthcare
            else isHealthcare = true; // Default to HMS if nothing known? or fallback to General? Defaulting to HMS for safety with legacy.
        }

        const allowedModules = ['crm', 'admin', 'sales', 'inventory', 'purchase'];

        for (const item of rootItems) {
            const modKey = getModuleKey(item);

            if (!isHealthcare) {
                // Strict whitelist for Non-Healthcare
                if (!allowedModules.includes(modKey)) {
                    continue;
                }
            } else {
                // Healthcare Mode:
                // Hide pure CRM Dashboard if we have HMS Dashboard? 
                // For now, allow everything unless it duplicates.
            }

            // Ensure the group exists
            if (!grouped[modKey]) {
                // Fallback for items with missing module definitions
                grouped[modKey] = { module: { name: modKey.toUpperCase(), module_key: modKey }, items: [] };
            }

            grouped[modKey].items.push(item);
        }

        return Object.values(grouped).filter(g => g.items.length > 0);

    } catch (error) {
        console.error("Failed to fetch menu items:", error);
        // Fallback needs to be adapted to new structure if we want consistency on error
        // But for now returning the old flat list might break the new UI.
        // Let's return a single 'General' group for fallback items.
        return [{
            module: { name: 'General', module_key: 'general' },
            items: getFallbackMenuItems(isAdmin, undefined)
        }];
    }
}

function getFallbackMenuItems(isAdmin: boolean | undefined, industry?: string) {
    // Simplified fallback: if industry is unknown, just assume General/CRM mix or empty.
    const isHealthcare = !industry || industry === 'Healthcare' || industry === 'Hospital'; // Keeping this for now, but UI will rely on DB mostly.
    let items: any[] = [];

    if (isHealthcare) {
        items = [
            { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', url: '/hms/dashboard' },
            { key: 'patients', label: 'Patients', icon: 'Users', url: '/hms/patients' },
            { key: 'appointments', label: 'Appointments', icon: 'Calendar', url: '/hms/appointments' },
            { key: 'doctors', label: 'Doctors', icon: 'Stethoscope', url: '/hms/doctors' },
            { key: 'billing', label: 'Billing', icon: 'Receipt', url: '/hms/billing' },
        ];
    } else {
        items = [
            { key: 'crm-dashboard', label: 'Dashboard', icon: 'LayoutDashboard', url: '/crm/dashboard' },
        ];
    }

    if (isAdmin) {
        items.push({ key: 'settings', label: 'Settings', icon: 'Settings', url: '/settings' });
        items.push({ key: 'admin', label: 'Admin', icon: 'Shield', url: '/admin' });
    }

    return items;
}
