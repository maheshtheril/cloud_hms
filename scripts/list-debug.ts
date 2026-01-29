
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🔍 LISTING ALL USERS...");

    const users = await prisma.app_user.findMany({
        select: { id: true, email: true, name: true, tenant_id: true }
    });

    console.table(users);

    console.log("---------------------------------");
    console.log("🔍 LISTING TENANTS...");
    const tenants = await prisma.tenant.findMany({
        select: { id: true, name: true, slug: true, domain: true }
    });
    console.table(tenants);
}

main().finally(() => prisma.$disconnect());
