
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🚀 CONFIGURING 'SEEAKK.COM' TENANT...");
    console.log("🛠️  Auto-Fixing Seeakk Tenant...");

    const targetSlug = "seeakk";
    const targetDomain = "seeakk.com";

    // A. Identify Conflicts
    const slugTenant = await prisma.tenant.findFirst({ where: { slug: targetSlug } });
    const domainTenant = await prisma.tenant.findFirst({ where: { domain: targetDomain } });

    let finalTenantId = null;

    // If different tenants verify the conflict
    if (slugTenant && domainTenant && slugTenant.id !== domainTenant.id) {
        console.log(`⚠️  CONFLICT DETECTED: Domain owned by '${domainTenant.slug}', Slug owned by '${slugTenant.slug}'.`);
        console.log("   Releasing domain from existing owner...");
        await prisma.tenant.update({ where: { id: domainTenant.id }, data: { domain: null } });
        finalTenantId = slugTenant.id;
    } else if (slugTenant) {
        finalTenantId = slugTenant.id;
    } else if (domainTenant) {
        finalTenantId = domainTenant.id;
    }

    let tenant;
    if (finalTenantId) {
        console.log("Updating existing tenant record...");
        tenant = await prisma.tenant.update({
            where: { id: finalTenantId },
            data: {
                slug: targetSlug,
                domain: targetDomain,
                name: "Seeakk Solutions",
                app_name: "Seeakk CRM"
            }
        });
    } else {
        console.log("Creating NEW tenant...");
        tenant = await prisma.tenant.create({
            data: {
                slug: targetSlug,
                domain: targetDomain,
                name: "Seeakk Solutions",
                app_name: "Seeakk CRM",
                mode: 'production',
                billing_plan: 'startup'
            }
        });
    }

    console.log(`✅ Tenant Configured: ${tenant.name} (${tenant.id})`);

    // 2. Configure Modules (CRM Only)
    console.log("Configuring Modules...");
    await prisma.tenant_modules.deleteMany({ where: { tenant_id: tenant.id } });
    await prisma.tenant_modules.create({
        data: {
            tenant_id: tenant.id,
            module_key: 'crm',
            enabled: true
        }
    });

    console.log("✅ Modules Updated: CRM [Enabled], Others [Disabled]");

    // 3. Ensure an Admin User exists for this tenant
    const adminEmail = "admin@seeakk.com";
    const defaultPass = "password123";

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
            crypt(${defaultPass}, gen_salt('bf')), 
            true, 
            true, 
            true, 
            'Seeakk Admin',
            'admin',
            NOW()
        )
        ON CONFLICT (email) DO NOTHING;
    `;

    console.log("✅ Admin User Ready:");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Pass:  ${defaultPass}`);
    console.log("-----------------------------------------");
    console.log("👉 ONCE DNS IS READY:");
    console.log("   Go to https://seeakk.com");
    console.log("   You will see 'Seeakk CRM' branding.");
    console.log("   Login with above credentials.");
    console.log("   You will ONLY see CRM features.");
    console.log("-----------------------------------------");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
