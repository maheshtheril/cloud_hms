
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Fixing Receptionist Account...");

    // 1. Find User
    const user = await prisma.app_user.findFirst({
        where: { email: { contains: 'recep' } }
    });

    if (!user) {
        console.error("User 'recep' not found!");
        return;
    }
    console.log(`Found User: ${user.email} (Tenant: ${user.tenant_id})`);

    // 2. Find Company
    const company = await prisma.company.findFirst({
        where: { tenant_id: user.tenant_id }
    });

    if (company) {
        console.log(`Found Company: ${company.name} (${company.id})`);
        // Assign Company
        await prisma.app_user.update({
            where: { id: user.id },
            data: { company_id: company.id }
        });
        console.log("-> Assigned Company ID to User.");
    } else {
        console.error("No company found for this tenant!");
    }

    // 3. Fix Role (RBAC)
    // Find role definition
    const role = await prisma.role.findFirst({
        where: {
            key: 'receptionist',
            tenant_id: user.tenant_id
        }
    });

    if (role) {
        console.log(`Found Role: ${role.name} (${role.id})`);

        // Ensure User has this role in user_role table
        const ur = await prisma.user_role.findFirst({
            where: { user_id: user.id, role_id: role.id }
        });

        if (!ur) {
            await prisma.user_role.create({
                data: {
                    user_id: user.id,
                    role_id: role.id,
                    tenant_id: user.tenant_id
                }
            });
            console.log("-> Created user_role link (RBAC Fixed).");
        } else {
            console.log("-> User already has RBAC link.");
        }
    } else {
        console.error("Role 'receptionist' not found for this tenant. Creating it...");
        // Fallback: Create role if missing
        const newRole = await prisma.role.create({
            data: {
                tenant_id: user.tenant_id,
                key: 'receptionist',
                name: 'Receptionist',
                permissions: ['hms:dashboard:reception', 'hms:view', 'patients:view']
            }
        });
        await prisma.user_role.create({
            data: {
                user_id: user.id,
                role_id: newRole.id,
                tenant_id: user.tenant_id
            }
        });
        console.log("-> Created Role and Assigned to User.");
    }

}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
