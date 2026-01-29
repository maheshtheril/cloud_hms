
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
    await prisma.tenant_module.deleteMany({ where: { tenant_id: tenant.id } });
    await prisma.tenant_module.create({
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

    const existingUser = await prisma.app_user.findFirst({ where: { email: adminEmail } });
    if (!existingUser) {
        console.log("Creating Admin User...");
        await prisma.$executeRaw`
            INSERT INTO app_user (id, tenant_id, email, password, name, is_admin, is_tenant_admin, is_active, role)
            VALUES (gen_random_uuid(), ${tenant.id}::uuid, ${adminEmail}, crypt(${defaultPass}, gen_salt('bf')), 'Seeakk Admin', true, true, true, 'admin')
        `;
    } else {
        console.log("Admin user already exists.");
    }

    console.log("✅ Admin User Ready:");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Pass:  ${defaultPass}`);

    // 4. CRITICAL: Cleanup CRM Menus (Remove Sales Orders)
    console.log("🧹 Cleaning up CRM menus...");
    const movedItems = await prisma.menu_items.updateMany({
        where: {
            OR: [
                { label: { contains: 'Sales Order', mode: 'insensitive' } },
                { key: { contains: 'sales-order', mode: 'insensitive' } }
            ],
            module_key: 'crm'
        },
        data: {
            module_key: 'sales' // Hide from CRM
        }
    });
    console.log(`✅ Relocated ${movedItems.count} rogue sales items out of CRM.`);

    console.log("-----------------------------------------");
    console.log("👉 ONCE DNS IS READY:");
    console.log("   Go to https://seeakk.com");
    console.log("   You will see 'Seeakk CRM' branding.");
    console.log("   Login with above credentials.");
    console.log("   You will ONLY see CRM features and Settings.");
    console.log("-----------------------------------------");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
