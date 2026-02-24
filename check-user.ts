import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Searching for acer@live.com...");
    const user = await prisma.app_user.findFirst({
        where: { email: 'acer@live.com' },
        include: {
            tenant: true,
            company: true
        }
    });

    if (user) {
        console.log("USER FOUND:");
        console.log("ID:", user.id);
        console.log("Email:", user.email);
        console.log("Active:", user.is_active);
        console.log("Role:", user.role);
        console.log("Tenant:", user.tenant ? `${user.tenant.name} (${user.tenant.slug})` : 'NULL');
        console.log("Company:", user.company ? user.company.name : 'NULL');
    } else {
        console.log("USER NOT FOUND IN DATABASE.");
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
