import 'dotenv/config';
import { prisma } from './prisma';

async function main() {
    try {
        // Find the most recent tenant (likely the failed one)
        const tenant = await prisma.tenant.findFirst({
            orderBy: { created_at: 'desc' }
        });

        if (!tenant) {
            console.log("No tenants found.");
            return;
        }

        console.log(`Found recent tenant: ${tenant.name} (${tenant.id})`);

        // Find company logic
        // Users logic
        const users = await prisma.app_user.findMany({
            where: { tenant_id: tenant.id }
        });
        console.log(`Found ${users.length} users for this tenant.`);

        // 1. Delete Company Settings
        console.log("Deleting company settings...");
        await prisma.company_settings.deleteMany({ where: { tenant_id: tenant.id } });

        // 2. Delete User Roles
        console.log("Deleting user roles...");
        // Need to find users first to delete their roles? Or delete via join?
        // hms_user_roles doesn't have tenant_id directly usually, it links user and role.
        // But we can delete by user_ids.
        const userIds = users.map(u => u.id);
        if (userIds.length > 0) {
            await prisma.hms_user_roles.deleteMany({ where: { user_id: { in: userIds } } });
        }

        // 3. Delete Roles (HMS Roles)
        console.log("Deleting roles...");
        await prisma.hms_role.deleteMany({ where: { tenant_id: tenant.id } });

        // 4. Delete Users
        if (users.length > 0) {
            console.log(`Deleting ${users.length} users...`);
            await prisma.app_user.deleteMany({ where: { tenant_id: tenant.id } });
        }

        // 5. Delete Company (and its related items if cascade setup, otherwise explicit)
        // company_accounting_settings?
        console.log("Deleting company accounting settings...");
        await prisma.company_accounting_settings.deleteMany({ where: { tenant_id: tenant.id } });

        console.log("Deleting companies...");
        await prisma.company.deleteMany({ where: { tenant_id: tenant.id } });

        // 6. Delete Tenant
        console.log(`Deleting tenant...`);
        await prisma.tenant.delete({ where: { id: tenant.id } });

        console.log("Cleanup complete.");

    } catch (e) {
        console.error("Cleanup failed:", e);
    }
}

main();
