
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🔍 INSPECTING DATABASE...");

    try {
        // 1. Check Connection & Table List
        console.log("Querying information_schema.tables...");
        const result: any[] = await prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `;

        console.log("\n📊 Tables Found in DB:");
        if (result.length === 0) {
            console.log("❌ NO TABELS FOUND! The database is empty.");
        } else {
            console.table(result);
            console.log(`✅ Total Tables: ${result.length}`);
        }

        // 2. Check Data
        if (result.length > 0) {
            console.log("\nChecking Validation Data...");
            const tenantCount = await prisma.tenant.count();
            console.log(`- Tenants: ${tenantCount}`);

            const userCount = await prisma.app_user.count();
            console.log(`- Users:   ${userCount}`);
        }

    } catch (e) {
        console.error("\n❌ CONNECTION ERROR:", e);
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect();
    });
