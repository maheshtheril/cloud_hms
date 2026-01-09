import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureHmsMenus } from '@/lib/menu-seeder';
import { fixAdminRoles } from '@/lib/fix-admin-role';
import { seedRolesAndPermissions } from '@/app/actions/rbac';

import { nuclearMenuFix } from '@/lib/nuclear-menu-fix';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("Starting Manual Menu Fix & Seeding...");

        // 0a. Fix Admin Roles (Emergency Restore)
        await fixAdminRoles();

        // 0b. Force Run Menu Seeder (Apply Permissions)
        await ensureHmsMenus();

        // 0b+ NUCLEAR FIX (Override potentially broken seeding)
        await nuclearMenuFix();

        // 0c. Re-Seed Standard Roles (Populate role_permission table)
        await seedRolesAndPermissions();

        const results: Record<string, any> = { seeded: true, roles_fixed: true, permissions_synced: true };

        // 0. Ensure Target Modules Exist (Fixes FK Constraint Failures)
        const targetModules = ['finance', 'inventory'];
        for (const key of targetModules) {
            const mod = await prisma.modules.findUnique({ where: { module_key: key } });
            if (!mod) {
                await prisma.modules.create({
                    data: {
                        module_key: key,
                        name: key.charAt(0).toUpperCase() + key.slice(1),
                        is_active: true,
                        description: 'Core Module'
                    }
                });
                results[`created_module_${key}`] = true;
            }
        }

        // CLEANUP: Force Delete Reports Module (User Request)
        try {
            // 1. Unsubscribe all tenants
            await prisma.tenant_module.deleteMany({ where: { module_key: 'reports' } });
            // 2. Unlink menus
            const repMod = await prisma.modules.findUnique({ where: { module_key: 'reports' } });
            if (repMod) {
                await prisma.module_menu_map.deleteMany({ where: { module_id: repMod.id } });
                await prisma.modules.delete({ where: { id: repMod.id } });
            } else {
                // Try deleting by key if ID fetch failed (though unlikely)
                await prisma.modules.deleteMany({ where: { module_key: 'reports' } });
            }
            results['deleted_module_reports'] = true;
        } catch (e: any) {
            results['deleted_module_reports_error'] = e.message;
        }

        // 0.5. AUTO-SUBSCRIBE Tenants to Core Modules (Prevent Disappearing Menus)
        // If a tenant has HMS, they MUST have Accounting + Inventory for this new structure to work.
        const hmsTenants = await prisma.tenant_module.findMany({
            where: { module_key: 'hms', enabled: true },
            select: { tenant_id: true }
        });

        const accModule = await prisma.modules.findUnique({ where: { module_key: 'finance' } });
        const invModule = await prisma.modules.findUnique({ where: { module_key: 'inventory' } });

        const tenantIds = hmsTenants.map(t => t.tenant_id);
        if (tenantIds.length > 0 && accModule && invModule) {
            // Subscribe to Finance
            await prisma.tenant_module.createMany({
                data: tenantIds.map(tid => ({
                    tenant_id: tid,
                    module_key: 'accounting',
                    enabled: true,
                    module_id: accModule.id
                })),
                skipDuplicates: true
            });
            // Subscribe to Inventory
            await prisma.tenant_module.createMany({
                data: tenantIds.map(tid => ({
                    tenant_id: tid,
                    module_key: 'inventory',
                    enabled: true,
                    module_id: invModule.id
                })),
                skipDuplicates: true
            });
            results[`updated_tenants_rec_count`] = tenantIds.length;
        }

        // 1. Move HMS Accounting -> Accounting
        const r1 = await prisma.menu_items.updateMany({
            where: { key: 'hms-accounting' },
            data: { module_key: 'accounting', sort_order: 10 }
        });
        results['moved_hms_accounting_parent'] = r1.count;

        const hmsAcc = await prisma.menu_items.findFirst({ where: { key: 'hms-accounting' } });
        if (hmsAcc) {
            const r1b = await prisma.menu_items.updateMany({
                where: { parent_id: hmsAcc.id },
                data: { module_key: 'accounting' }
            });
            results['moved_hms_accounting_children'] = r1b.count;
        }

        // 2. Move HMS Inventory -> Inventory
        const r2 = await prisma.menu_items.updateMany({
            where: { key: 'hms-inventory' },
            data: { module_key: 'inventory', sort_order: 50, label: 'Pharmacy Store' }
        });
        results['moved_hms_inventory_parent'] = r2.count;

        const hmsInv = await prisma.menu_items.findFirst({ where: { key: 'hms-inventory' } });
        if (hmsInv) {
            const r2b = await prisma.menu_items.updateMany({
                where: { parent_id: hmsInv.id },
                data: { module_key: 'inventory' }
            });
            results['moved_hms_inventory_children'] = r2b.count;
        }

        // 3. Move HMS Purchasing -> Inventory (Procurement)
        const r3 = await prisma.menu_items.updateMany({
            where: { key: 'hms-purchasing' },
            data: { module_key: 'inventory', sort_order: 60, label: 'Central Purchasing' }
        });
        results['moved_hms_purchasing_parent'] = r3.count;

        const hmsPurch = await prisma.menu_items.findFirst({ where: { key: 'hms-purchasing' } });
        if (hmsPurch) {
            const r3b = await prisma.menu_items.updateMany({
                where: { parent_id: hmsPurch.id },
                data: { module_key: 'inventory' }
            });
            results['moved_hms_purchasing_children'] = r3b.count;
        }

        // 4. REORDER HMS CLINICAL FLOW (Patient Journey)
        const reorders = [
            { key: 'hms-dashboard', sort: 10 },
            { key: 'hms-reception', sort: 15 },
            { key: 'hms-patients', sort: 20 },
            { key: 'hms-appointments', sort: 25 },
            { key: 'hms-doctors', sort: 30 },
            { key: 'hms-nursing', sort: 35 },
            { key: 'hms-lab', sort: 40 },
            { key: 'hms-wards', sort: 45 },
            { key: 'hms-billing', sort: 50 },
            { key: 'hms-sales-returns', sort: 52 }
        ];

        for (const item of reorders) {
            await prisma.menu_items.updateMany({
                where: { key: item.key },
                data: { sort_order: item.sort }
            });
        }
        results['reordered_hms'] = true;

        return NextResponse.json({ success: true, results });

    } catch (e: any) {
        console.error("Manual Fix Failed:", e);
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
