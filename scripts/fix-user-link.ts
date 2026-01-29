
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🔧 FIXING USER LINKAGE...");

    const email = "admin@seeakk.com";
    const slug = "seeakk";
    const password = "password123";

    try {
        // 1. Get the correct Tenant
        const tenant = await prisma.tenant.findFirst({ where: { slug: slug } });
        if (!tenant) {
            console.error("❌ CRITICAL: Tenant 'seeakk' not found! Did the config script run?");
            return;
        }
        console.log(`✅ Tenant Found: ${tenant.name} (${tenant.id})`);

        // 2. Fix/Create the User
        // We use an UPSERT raw command to ensure:
        // - If user missing -> Create it linked to tenant.
        // - If user exists -> UPDATE it to link to tenant AND reset password.
        await prisma.$executeRaw`
            INSERT INTO app_user (
                tenant_id, email, password, is_active, is_admin, is_tenant_admin, name, role, created_at
            ) VALUES (
                ${tenant.id}::uuid,
                ${email}, 
                crypt(${password}, gen_salt('bf')), 
                true, true, true, 
                'Seeakk Admin', 'admin', NOW()
            )
            ON CONFLICT (email) DO UPDATE SET
                tenant_id = EXCLUDED.tenant_id,
                password = EXCLUDED.password,
                is_active = true,
                is_admin = true;
        `;

        console.log(`✅ User '${email}' is now firmly linked to '${slug}'.`);
        console.log(`✅ Password reset to: ${password}`);

        // 3. Verify
        const user = await prisma.app_user.findFirst({
            where: { email: email }
        });
        console.log(`🔍 Verification: User Tenant ID = ${user?.tenant_id}`);

        if (user?.tenant_id === tenant.id) {
            console.log("🚀 SUCCESS! Everything is synchronized.");
        } else {
            console.error("❌ Mismatch detected (Should be impossible).");
        }

    } catch (e) {
        console.error("💥 Error:", e);
    }
}

main().finally(() => prisma.$disconnect());
