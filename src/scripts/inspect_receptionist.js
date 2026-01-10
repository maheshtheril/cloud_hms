
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Fetching roles and permissions...");

    const roles = await prisma.role.findMany({
        where: { key: 'receptionist' },
        include: {
            role_permissions: true
        }
    });

    console.log("Receptionist Roles found:", JSON.stringify(roles, null, 2));

    const permissions = await prisma.permission.findMany({
        where: { code: 'hms:dashboard:reception' }
    });
    console.log("Permissions found:", JSON.stringify(permissions, null, 2));

    // also check for a user that might be using this role if we can guess, but listing roles is good enough start
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
