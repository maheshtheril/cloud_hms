
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log("Starting Production Seeding...");

        // 1. Create Tenant
        let tenant = await prisma.tenant.findFirst();
        if (!tenant) {
            tenant = await prisma.tenant.create({
                data: {
                    name: 'Cloud HMS Prod',
                    slug: 'cloud-hms-prod',
                    mode: 'production',
                    billing_plan: 'enterprise'
                }
            });
            console.log("Created Tenant:", tenant.id);
        } else {
            console.log("Tenant already exists:", tenant.id);
        }

        // 2. Create Company
        let company = await prisma.company.findFirst({ where: { tenant_id: tenant.id } });
        if (!company) {
            company = await prisma.company.create({
                data: {
                    tenant_id: tenant.id,
                    name: 'Apollo Main Hospital',
                    industry: 'Healthcare',
                    // currency: 'INR', // Not in schema
                    // country: 'India', // Not in schema (uses country_id relation)
                    // timezone: 'Asia/Kolkata', // Not in schema
                }
            });
            console.log("Created Company:", company.id);
        }

        // 2.5 Seed Currencies & Countries (Essential Master Data)
        const commonCurrencies = [
            { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
            { code: 'USD', name: 'US Dollar', symbol: '$' },
            { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
            { code: 'EUR', name: 'Euro', symbol: '€' },
            { code: 'GBP', name: 'British Pound', symbol: '£' },
        ];

        for (const cur of commonCurrencies) {
            await prisma.currencies.upsert({
                where: { code: cur.code },
                update: {},
                create: {
                    code: cur.code,
                    name: cur.name,
                    symbol: cur.symbol,
                    is_active: true
                }
            });
        }
        console.log("Currencies Seeded.");

        const commonCountries = [
            { iso2: 'IN', iso3: 'IND', name: 'India', flag: '🇮🇳', region: 'Asia' },
            { iso2: 'US', iso3: 'USA', name: 'United States', flag: '🇺🇸', region: 'Americas' },
            { iso2: 'AE', iso3: 'ARE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Asia' },
            { iso2: 'GB', iso3: 'GBR', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
        ];

        for (const c of commonCountries) {
            await prisma.countries.upsert({
                where: { iso2: c.iso2 },
                update: {},
                create: {
                    iso2: c.iso2,
                    iso3: c.iso3,
                    name: c.name,
                    flag: c.flag,
                    region: c.region,
                    is_active: true
                }
            });
        }
        console.log("Countries Seeded.");

        const india = await prisma.countries.findUnique({ where: { iso2: 'IN' } });

        // 3. Enable Modules
        const modules = ['hms', 'crm', 'inventory', 'accounting'];
        for (const mod of modules) {
            await prisma.tenant_module.upsert({
                where: {
                    tenant_id_module_key: {
                        tenant_id: tenant.id,
                        module_key: mod
                    }
                },
                update: { enabled: true },
                create: {
                    tenant_id: tenant.id,
                    module_key: mod,
                    enabled: true
                }
            });
        }
        console.log("Modules Enabled.");

        // 4. Create Admin User
        const adminEmail = 'admin@saaserp.com';
        const password = 'password123'; // Logic will use pgcrypto in raw query

        const existingUser = await prisma.app_user.findFirst({
            where: { email: { equals: adminEmail, mode: 'insensitive' } }
        });

        if (!existingUser) {
            // Using raw query for pgcrypto compatibility
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
                )
            `;
            console.log("Admin User Created.");
        } else {
            // Force Update Password just in case
            await prisma.$executeRaw`
                UPDATE app_user 
                SET password = crypt(${password}, gen_salt('bf')),
                is_active = true,
                is_admin = true,
                is_tenant_admin = true
                WHERE id = ${existingUser.id}::uuid
            `;
            console.log("Admin User Updated.");
        }

        // VERIFY IMMEDIATE
        const verify = await prisma.$queryRaw`
            SELECT id FROM app_user 
            WHERE email = ${adminEmail} 
            AND password = crypt(${password}, password)
        ` as any[];

        const verificationSuccess = verify.length > 0;
        console.log("Password Verification Result:", verificationSuccess);

        return NextResponse.json({
            success: true,
            message: "Production Database Seeded Successfully!",
            details: {
                tenantId: tenant.id,
                companyId: company.id,
                adminEmail,
                verificationSuccess
            }
        });

    } catch (error: any) {
        console.error("Seeding Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
