import { prisma } from './prisma';

export async function fixAdminRoles() {
    console.log("Fixing Hospital Admin Roles...");

    // 1. Get all Hospital Admin roles
    const adminRoles = await prisma.hms_role.findMany({
        where: { name: 'Hospital Admin' }
    });

    if (adminRoles.length === 0) {
        console.log("No Hospital Admin roles found.");
        return;
    }

    const permissions = [
        'dashboard.view', 'user.manage', 'settings.manage', 'hms.admin',
        'hms.reception.view', 'hms.patient.view', 'hms.appointment.view',
        'hms.clinical.view', 'hms.hr.view', 'hms.billing.view', 'hms.ward.view'
    ];

    for (const role of adminRoles) {
        // Add new permissions (idempotent via createMany skipDuplicates if supported, 
        // but prisma createMany doesn't support skipDuplicates for all DBs easily, 
        // so we'll just use a loop or delete-insert if safety allows. 
        // Safest is to loop and upsert or just create ignoring errors.)

        // Actually, let's just create them. If they exist, it might error.
        // Better: Find existing, filter, create missing.

        const existingPerms = await prisma.hms_role_permissions.findMany({
            where: { role_id: role.id },
            select: { permission: true }
        });
        const existingSet = new Set(existingPerms.map(p => p.permission));

        const toAdd = permissions.filter(p => !existingSet.has(p));

        if (toAdd.length > 0) {
            await prisma.hms_role_permissions.createMany({
                data: toAdd.map(p => ({
                    role_id: role.id,
                    permission: p
                }))
            });
            console.log(`Updated permissions for role ${role.id} (Added ${toAdd.length})`);
        }
    }
    console.log("Admin Roles Fixed.");
}
