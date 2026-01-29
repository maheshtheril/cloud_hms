
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🛠️  CLEANING & CONFIGURING SEEAKK...");

    // 1. Identify Tenants to Delete (Conflicts)
    const conflicts = await prisma.tenant.findMany({
        where: {
            OR: [
                { slug: "seeakk" },
                { domain: "seeakk.com" }
            ]
        },
        select: { id: true, slug: true, domain: true }
    });

    if (conflicts.length > 0) {
        console.log(`⚠️  Found ${conflicts.length} conflicting tenants. Cleaning up...`);
        for (const t of conflicts) {
            console.log(`   Deleting ${t.slug} (${t.domain || "no-domain"})...`);

            // Delete Children first (Manual Cascade)
            await prisma.app_user.deleteMany({ where: { tenant_id: t.id } });
            await prisma.tenant_modules.deleteMany({ where: { tenant_id: t.id } });
            await prisma.company.deleteMany({ where: { tenant_id: t.id } });

            // Delete Tenant
            await prisma.tenant.delete({ where: { id: t.id } });
        }
        console.log("✅ Cleanup complete.");
    }

    // 2. Create Fresh Tenant
    console.log("Creating NEW tenant...");
    const tenant = await prisma.tenant.create({
        data: {
            name: "Seeakk Solutions",
            slug: "seeakk",
            domain: "seeakk.com",
            app_name: "Seeakk CRM", // Dynamic Branding Name
            mode: 'production',
            billing_plan: 'startup'
        }
    });
    console.log(`✅ Tenant Created: ${tenant.id}`);

    // 3. Configure Modules (CRM Only)
    // No need to deleteMany as it's fresh
    await prisma.tenant_modules.create({
        data: {
            tenant_id: tenant.id,
            module_key: 'crm',
            enabled: true
        }
    });
    console.log("✅ Tenant locked to CRM Module ONLY.");

    // 4. Create Admin User
    const adminEmail = "admin@seeakk.com";
    const password = "password123";

    await prisma.$executeRaw`
        INSERT INTO app_user (
            tenant_id, 
            email, 
            password, 
            is_active, 
            is_admin, 
            is_tenant_admin,
            name,
            role,
            created_at
        ) VALUES (
            ${tenant.id}::uuid,
            ${adminEmail}, 
            crypt(${password}, gen_salt('bf')), 
            true, 
            true, 
            true, 
            'Seeakk Admin',
            'admin',
            NOW()
        );
    `;

    console.log("-----------------------------------------");
    console.log("✅ SUCCESS! SEEAKK IS READY.");
    console.log("   URL:      https://seeakk.com");
    console.log("   User:     " + adminEmail);
    console.log("   Password: " + password);
    console.log("-----------------------------------------");
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
