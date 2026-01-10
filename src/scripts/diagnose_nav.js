
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Diagnosing Navigation Logic...");

    // 1. Find a receptionist user
    const users = await prisma.app_user.findMany({
        where: {
            OR: [
                { role: 'receptionist' },
                { email: { contains: 'reception' } }
            ]
        },
        take: 1
    });

    if (users.length === 0) {
        console.log("No receptionist user found to test with.");
        return;
    }

    const user = users[0];
    console.log(`Testing with user: ${user.email} (${user.id})`);
    console.log(`User Role: ${user.role}`);
    console.log(`Tenant ID: ${user.tenant_id}`);

    // 2. Check Tenant Modules
    const modules = await prisma.tenant_module.findMany({
        where: { tenant_id: user.tenant_id, enabled: true }
    });
    console.log("Enabled Modules:", modules.map(m => m.module_key));

    // 3. Check Industry
    const tenant = await prisma.tenant.findUnique({
        where: { id: user.tenant_id },
        select: { metadata: true }
    });
    console.log("Tenant Metadata:", JSON.stringify(tenant?.metadata));

    // 4. Simulate getMenuItems Logic (Simplified)
    // Fetch Permissions
    const userPermsRaw = await getUserPermissions(user.id, user.tenant_id);
    const userPerms = new Set(userPermsRaw);
    console.log("\nUser Permissions:", Array.from(userPerms).filter(p => p.includes('hms')));

    // Check Logic Flaw
    let allowedModuleKeys = new Set();
    modules.forEach(m => allowedModuleKeys.add(m.module_key));

    // Simulate Industry fallback
    let industry = (tenant?.metadata?.industry || '').toLowerCase();
    const isHealthcare = industry.includes('health') || industry.includes('clinic') || industry.includes('hospital');
    console.log(`Is Healthcare? ${isHealthcare}`);

    if (modules.length === 0) {
        if (isHealthcare) {
            allowedModuleKeys.add('hms');
            console.log("Added HMS via Industry Fallback");
        }
    }

    console.log("Final Allowed Keys:", Array.from(allowedModuleKeys));

    if (!allowedModuleKeys.has('hms')) {
        console.error("CRITICAL: 'hms' module is NOT allowed for this tenant. Menu items will be hidden.");
    } else {
        console.log("'hms' module is allowed.");
    }
}

// Minimal Permission Fetcher for Script
async function getUserPermissions(userId, tenantId) {
    const perms = new Set();
    const userRoles = await prisma.user_role.findMany({ where: { user_id: userId, tenant_id: tenantId } });
    const roleIds = userRoles.map(ur => ur.role_id);

    const roles = await prisma.role.findMany({ where: { id: { in: roleIds } } });
    roles.forEach(r => {
        if (Array.isArray(r.permissions)) r.permissions.forEach(p => perms.add(p));
    });

    const rps = await prisma.role_permission.findMany({ where: { role_id: { in: roleIds }, is_granted: true } });
    rps.forEach(rp => perms.add(rp.permission_code));

    return Array.from(perms);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
