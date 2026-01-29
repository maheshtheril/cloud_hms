
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🔍 DEBUGGING AUTHENTICATION...");

    const email = "admin@seeakk.com";
    const password = "password123";

    try {
        // 1. Check Extension
        console.log("1. Checking pgcrypto extension...");
        const ext = await prisma.$queryRaw`SELECT * FROM pg_extension WHERE extname = 'pgcrypto'`;
        console.log("   Extension:", ext);

        // 2. Fetch User Raw hash
        console.log(`2. Fetching user '${email}'...`);
        const users = await prisma.$queryRaw`
            SELECT id, email, password 
            FROM app_user 
            WHERE email = ${email}
        ` as any[];

        if (users.length === 0) {
            console.error("❌ USER NOT FOUND!");
            return;
        }

        const user = users[0];
        console.log("   User Found:", user.id);
        console.log("   Stored Hash:", user.password);

        // 3. Verify Password using DB
        console.log("3. Testing Password Verification (DB-side)...");
        const match = await prisma.$queryRaw`
            SELECT (password = crypt(${password}, password)) as is_valid
            FROM app_user
            WHERE id = ${user.id}::uuid
        ` as any[];

        console.log("   Result:", match);

        if (match[0]?.is_valid) {
            console.log("✅ AUTH SUCCESS! Password matches.");
        } else {
            console.error("❌ AUTH FAILED! Password mismatch.");

            // Try generating a new hash locally to see what it *should* be?
            // (Optional, but DB side verify is what matters)
        }

    } catch (e) {
        console.error("💥 ERROR verifying auth:", e);
    }
}

main()
    .finally(async () => await prisma.$disconnect());
