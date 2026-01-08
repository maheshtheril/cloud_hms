import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/app/actions/rbac';

export async function GET() {
    try {
        const report: any[] = [];

        // 1. Check Receptionist Role
        const role = await prisma.role.findFirst({
            where: { name: 'Receptionist' },
            include: { role_permission: true }
        });

        if (!role) {
            return NextResponse.json({ error: "Receptionist Role not found" });
        }

        report.push({
            role: role.name,
            permissions: role.role_permission.map(p => p.permission_code)
        });

        const userPermsStub = new Set(role.role_permission.map(p => p.permission_code));

        // 2. Check Key Menu Items and their Visibility Logic
        const keysToCheck = [
            'hms-reception', // Reception Dashboard (Should see)
            'hms-dashboard', // Admin Dashboard (Should NOT see)
            'acc-dashboard', // Accounting (Should NOT see)
            'acc-ledger', // General Ledger (Should NOT see)
            'inv-dashboard', // Inventory (Should NOT see)
            'users', // Admin Users (Should NOT see)
        ];

        const menus = await prisma.menu_items.findMany({
            where: { key: { in: keysToCheck } }
        });

        const visibilityTest = menus.map(m => {
            const hasDirectPerm = !m.permission_code || userPermsStub.has(m.permission_code);
            return {
                key: m.key,
                label: m.label,
                permission_required: m.permission_code,
                is_visible_to_receptionist: hasDirectPerm,
                reason: !m.permission_code ? 'Public (No Perm Code)' : hasDirectPerm ? 'Has Perm' : 'Missing Perm'
            };
        });

        report.push({ menu_visibility_test: visibilityTest });

        return NextResponse.json({ success: true, report });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message });
    }
}
