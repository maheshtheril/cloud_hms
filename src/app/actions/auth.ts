'use server'

import { prisma } from "@/lib/prisma"
import { signOut } from "@/auth"
import { headers } from "next/headers";
import bcrypt from 'bcryptjs';

export async function logout() {
    console.log("[Auth Action] Logging out...");
    try {
        await signOut({ redirectTo: '/login' });
    } catch (err) {
        // Next.js redirects act as errors, so we need to rethrow them if it's a redirect
        if ((err as Error).message === 'NEXT_REDIRECT') {
            throw err;
        }
        console.error("[Auth Action] Logout failed:", err);
        throw err;
    }
}

export async function signup(prevState: any, formData: FormData) {
    const headersList = await headers();
    const host = headersList.get('host') || '';
    const isSeeakk = host.toLowerCase().includes('seeakk');

    const rawData = Object.fromEntries(formData.entries());

    // Extract fields
    const email = rawData.email as string
    const password = rawData.password as string
    const name = rawData.name as string
    const companyName = rawData.companyName as string
    const countryId = rawData.countryId as string
    const currencyId = rawData.currencyId as string
    const industry = isSeeakk ? 'CRM & Sales' : rawData.industry as string // Force industry if seeakk
    const selectedModules = isSeeakk ? ['crm'] : (rawData.modules as string || '').split(',').filter(Boolean); // Force CRM if seeakk
    const taxId = rawData.taxId as string // Optional tax ID if they selected one

    if (!email || !password || !name || !companyName) {
        return { error: "Missing required fields" }
    }

    try {
        const existing = await prisma.app_user.findFirst({ where: { email } })
        if (existing) return { error: "User already exists" }

        const tenantId = crypto.randomUUID();
        const companyId = crypto.randomUUID();
        const branchId = crypto.randomUUID();
        const userId = crypto.randomUUID();

        // 1. Create Tenant
        await prisma.tenant.create({
            data: {
                id: tenantId,
                name: `${companyName} (Tenant)`,
                slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            }
        });

        // 2. Create Company
        await prisma.company.create({
            data: {
                id: companyId,
                tenant_id: tenantId,
                name: companyName,
                country_id: countryId || undefined,
                industry: industry,
                // Default settings can be set later or via triggers
                enabled: true
            }
        });

        // 2b. Create Default Main Branch (World Class Standard)
        await prisma.hms_branch.create({
            data: {
                id: branchId,
                tenant_id: tenantId,
                company_id: companyId,
                name: "Main Branch",
                code: "MAIN",
                is_active: true,
                type: "clinic"
            }
        });

        // 3. Create Company Settings (Currency, Tax)
        if (currencyId) {
            await prisma.company_settings.create({
                data: {
                    tenant_id: tenantId,
                    company_id: companyId,
                    currency_id: currencyId,
                    // address_country_id: countryId, // Schema might have this
                }
            });
        }

        // 3b. Copy Default Tax Mappings from Country
        if (countryId) {
            const defaultMappings = await prisma.country_tax_mappings.findMany({
                where: { country_id: countryId, is_active: true }
            });

            if (defaultMappings.length > 0) {
                await prisma.company_tax_maps.createMany({
                    data: defaultMappings.map(dm => ({
                        id: crypto.randomUUID(), // Explicit ID
                        tenant_id: tenantId,
                        company_id: companyId,
                        country_id: countryId,
                        tax_type_id: dm.tax_type_id,
                        tax_rate_id: dm.tax_rate_id,
                        is_default: false,
                        is_active: true
                    }))
                });
            }
        }

        // ... (Charts of Accounts section is already safe with explicit IDs) ...

        // ... (User creation section fixed in previous step) ...

        // ... (Role creation section is safe) ...

        // 5. Activate Modules
        // ...
        if (modulesToEnable.size > 0) {
            // ...
            if (validModules.length > 0) {
                await prisma.tenant_module.createMany({
                    data: validModules.map(m => ({
                        id: crypto.randomUUID(), // Explicit ID
                        tenant_id: tenantId,
                        module_key: m.module_key,
                        module_id: m.id,
                        enabled: true
                    })),
                    skipDuplicates: true
                });
                console.log('[Signup DEBUG] Inserted modules:', validModules.map(m => m.module_key));
            } else {
                // ...
            }
        }

        // 6. Auto-seed HMS master data if HMS module is enabled
        if (modulesToEnable.has('hms')) {
            console.log('[Signup] HMS module detected - seeding master data...');

            // ... (standardDepartments definition) ...

            await prisma.hms_departments.createMany({
                data: standardDepartments.map(dept => ({
                    id: crypto.randomUUID(), // Explicit ID
                    tenant_id: tenantId,
                    company_id: companyId,
                    name: dept.name,
                    code: dept.code,
                    description: dept.description,
                    is_active: true
                })),
                skipDuplicates: true
            });

            console.log('[Signup] Seeded 8 standard departments');

            // ... (labTests definition) ...

            await prisma.hms_product.createMany({
                data: labTests.map(test => ({
                    id: crypto.randomUUID(), // Explicit ID
                    tenant_id: tenantId,
                    company_id: companyId,
                    sku: test.sku,
                    name: test.name,
                    description: test.description,
                    is_service: true,
                    is_stockable: false,
                    uom: 'TEST',
                    price: test.price,
                    currency: 'INR',
                    is_active: true,
                    metadata: { type: 'lab_test', tax_exempt: true }
                })),
                skipDuplicates: true
            });
            console.log('[Signup] Seeded 10 standard lab tests');

            // ... (stdFees definition) ...

            await prisma.hms_product.createMany({
                data: stdFees.map(item => ({
                    id: crypto.randomUUID(), // Explicit ID
                    tenant_id: tenantId,
                    company_id: companyId,
                    sku: item.sku,
                    name: item.name,
                    description: item.description,
                    is_service: true,
                    is_stockable: false,
                    uom: item.uom,
                    price: item.price,
                    currency: 'INR',
                    is_active: true,
                    metadata: { type: 'fee', tax_exempt: true }
                })),
                skipDuplicates: true
            });
            console.log('[Signup] Seeded Registration and Consultation fees');
        }

        return { success: true };

    } catch (error) {
        console.error("Signup error:", error)
        return { error: "Failed to create account. " + (error as Error).message }
    }
}
