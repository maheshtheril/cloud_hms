
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("DEBUG: Running Fix Menu Permissions...");

        // 1. Force update 'Roles' menu to be Admin Only
        const updateRoles = await prisma.menu_items.updateMany({
            where: { key: 'roles' },
            data: { permission_code: 'system:admin' }
        });

        // 2. Force update 'Settings' menu
        const updateSettings = await prisma.menu_items.updateMany({
            where: { key: 'settings' },
            data: { permission_code: 'system:admin' }
        });

        // 3. Force update 'Configuration' menu
        const updateConfig = await prisma.menu_items.updateMany({
            where: { key: 'configuration' },
            data: { permission_code: 'system:admin' }
        });

        // 4. Clean Nurse Permissions
        const nurseRole = await prisma.hms_role.findFirst({
            where: { name: 'Nurse' }
        });

        let deletedPerms = { count: 0 };
        if (nurseRole) {
            deletedPerms = await prisma.hms_role_permissions.deleteMany({
                where: {
                    role_id: nurseRole.id,
                    permission: {
                        in: ['system:admin', 'hms:admin', 'settings:view', 'roles:view', 'hms:view']
                    }
                }
            });

            // Ensure Nurse has basic permissions
            const neededPerms = ['hms.nursing.view', 'hms.nursing.consume', 'hms.patients.view', 'hms.patients.edit'];
            for (const p of neededPerms) {
                const exists = await prisma.hms_role_permissions.findFirst({
                    where: { role_id: nurseRole.id, permission: p }
                });
                if (!exists) {
                    await prisma.hms_role_permissions.create({
                        data: { role_id: nurseRole.id, permission: p }
                    });
                }
            }
        }

        return NextResponse.json({
            success: true,
            updated_roles_menu: updateRoles.count,
            cleaned_nurse_perms: deletedPerms.count,
            message: "Fixed Menu Permissions Successfully. Please refresh."
        });

    } catch (error: any) {
        console.error("Fix Menu Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
