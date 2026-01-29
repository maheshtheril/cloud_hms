
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🌱 STARTING FRESH DB SEEDING...");

    // 1. Enable Extensions (pgcrypto)
    try {
        await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;
        console.log("✅ Extension 'pgcrypto' enabled.");
    } catch (e) {
        console.warn("⚠️  Could not enable pgcrypto (might already exist or permission issue):", e);
    }

    // 2. Create Tenant
    console.log("Creating Tenant...");
    const tenant = await prisma.tenant.create({
        data: {
            name: 'Enterprise Prod',
            slug: 'enterprise-prod',
            mode: 'production',
            billing_plan: 'enterprise',
            app_name: 'Cloud HMS Enterprise',
            logo_url: 'https://cdn-icons-png.flaticon.com/512/3063/3063823.png'
        }
    });

    // 3. Create Company
    console.log("Creating Company...");
    const company = await prisma.company.create({
        data: {
            tenant_id: tenant.id,
            name: 'Cloud HMS Hospital',
            industry: 'Healthcare',
        }
    });

    // 4. Create Admin User
    const adminEmail = 'admin@saaserp.com';
    const password = 'password123';

    console.log("Creating Admin User...");
    // Using raw query to ensure pgcrypto hashing works
    await prisma.$executeRaw`
        INSERT INTO app_user (
            tenant_id, 
            company_id,
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
            ${company.id}::uuid,
            ${adminEmail}, 
            crypt(${password}, gen_salt('bf')), 
            true, 
            true, 
            true, 
            'System Admin',
            'admin',
            NOW()
        );
    `;

    console.log("✅ SEEDING COMPLETE!");
    console.log("------------------------------------------------");
    console.log("URL:      http://localhost:3000 (or your Vercel URL)");
    console.log(`User:     ${adminEmail}`);
    console.log(`Password: ${password}`);
    console.log("------------------------------------------------");
}

main()
    .catch(e => {
        console.error("SEEDING FAILED:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
