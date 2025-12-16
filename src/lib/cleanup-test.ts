import 'dotenv/config';
import { prisma } from './prisma';

async function main() {
    try {
        // Check specific user for safety
        const email = 'you@live.com'; // Based on previous check
        const user = await prisma.app_user.findFirst({ where: { email } });

        if (!user) {
            console.log("User not found matching you@live.com, checking recent...");
            const tenant = await prisma.tenant.findFirst({ orderBy: { created_at: 'desc' } });
            if (!tenant) return;
            // reuse same logic...
        } else {
            const tenant = await prisma.tenant.findUnique({ where: { id: user.tenant_id } });
            if (tenant) {
                console.log(`Cleaning up ${tenant.name}...`);
                await prisma.company_settings.deleteMany({ where: { tenant_id: tenant.id } });
                await prisma.hms_user_roles.deleteMany({ where: { user_id: user.id } });
                await prisma.hms_role.deleteMany({ where: { tenant_id: tenant.id } });
                await prisma.app_user.deleteMany({ where: { tenant_id: tenant.id } });
                await prisma.company_accounting_settings.deleteMany({ where: { tenant_id: tenant.id } });
                await prisma.company.deleteMany({ where: { tenant_id: tenant.id } });
                await prisma.tenant.delete({ where: { id: tenant.id } });
                console.log("Cleanup complete.");
            }
        }

    } catch (e) {
        console.error("Cleanup failed:", e);
    }
}

main();
