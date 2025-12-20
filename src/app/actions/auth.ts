'use server'

import { prisma } from "@/lib/prisma"
import { signOut } from "@/auth"

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
    const rawData = Object.fromEntries(formData.entries());

    // Extract fields
    const email = rawData.email as string
    const password = rawData.password as string
    const name = rawData.name as string
    const companyName = rawData.companyName as string
    const countryId = rawData.countryId as string
    const currencyId = rawData.currencyId as string
    const industry = rawData.industry as string // 'Healthcare', 'Manufacturing', etc.
    const selectedModules = (rawData.modules as string || '').split(',').filter(Boolean); // Comma separated keys
    const taxId = rawData.taxId as string // Optional tax ID if they selected one

    if (!email || !password || !name || !companyName) {
        return { error: "Missing required fields" }
    }

    try {
        const existing = await prisma.app_user.findFirst({ where: { email } })
        if (existing) return { error: "User already exists" }

        const result = await prisma.$transaction(async (tx) => {
            const tenantId = crypto.randomUUID();
            const companyId = crypto.randomUUID();
            const userId = crypto.randomUUID();

            // 1. Create Tenant
            await tx.tenant.create({
                data: {
                    id: tenantId,
                    name: `${companyName} (Tenant)`,
                    slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                }
            });

            // 2. Create Company
            await tx.company.create({
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

            // 3. Create Company Settings (Currency, Tax)
            if (currencyId) {
                await tx.company_settings.create({
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
                const defaultMappings = await tx.country_tax_mappings.findMany({
                    where: { country_id: countryId, is_active: true }
                });

                if (defaultMappings.length > 0) {
                    await tx.company_tax_maps.createMany({
                        data: defaultMappings.map(dm => ({
                            tenant_id: tenantId,
                            company_id: companyId,
                            country_id: countryId,
                            tax_type_id: dm.tax_type_id,
                            tax_rate_id: dm.tax_rate_id,
                            is_default: false, // Or true, depending on business logic, usually false until verified
                            is_active: true
                        }))
                    });
                }
            }

            // 4. Create User (Admin)
            await tx.$executeRaw`
                INSERT INTO app_user (id, tenant_id, company_id, email, password, name, is_admin, is_tenant_admin, is_active)
                VALUES (
                    ${userId}::uuid, 
                    ${tenantId}::uuid, 
                    ${companyId}::uuid,
                    ${email}, 
                    crypt(${password}, gen_salt('bf')), 
                    ${name}, 
                    true, 
                    true,
                    true
                )
            `;

            // 4b. Create 'Admin' Role and Assign to User (RBAC)
            const roleId = crypto.randomUUID();
            // Check if Admin role exists for tenant? No, new tenant.
            await tx.hms_role.create({
                data: {
                    id: roleId,
                    tenant_id: tenantId,
                    name: 'Admin',
                    description: 'Full Access Administrator'
                }
            });

            await tx.hms_user_roles.create({
                data: {
                    user_id: userId,
                    role_id: roleId
                }
            });


            // 5. Activate Modules
            // Logic: If 'crm' is selected, ensure 'admin' is also active.
            console.log('[Signup DEBUG] Industry:', industry, 'Modules Selected:', selectedModules);
            let modulesToEnable = new Set(selectedModules);

            // If CRM is selected, enforce Admin module
            if (modulesToEnable.has('crm')) {
                modulesToEnable.add('admin');
            }

            console.log('[Signup DEBUG] Final Modules to Enable:', Array.from(modulesToEnable));

            if (modulesToEnable.size > 0) {
                // Fetch valid module definitions to get IDs
                const validModules = await tx.modules.findMany({
                    where: { module_key: { in: Array.from(modulesToEnable) } }
                });

                if (validModules.length > 0) {
                    await tx.tenant_module.createMany({
                        data: validModules.map(m => ({
                            tenant_id: tenantId,
                            module_key: m.module_key,
                            module_id: m.id, // Explicitly linking FK
                            enabled: true
                        })),
                        skipDuplicates: true
                    });
                    console.log('[Signup DEBUG] Inserted modules:', validModules.map(m => m.module_key));
                } else {
                    console.warn('[Signup WARNING] No valid modules found for keys:', Array.from(modulesToEnable));
                }
            }

            // 6. Auto-seed HMS master data if HMS module is enabled
            if (modulesToEnable.has('hms')) {
                console.log('[Signup] HMS module detected - seeding master data...');

                // Seed standard departments
                const standardDepartments = [
                    { name: 'Emergency Department', code: 'ED', description: '24/7 emergency care' },
                    { name: 'Out Patient Department', code: 'OPD', description: 'Outpatient consultations' },
                    { name: 'In Patient Department', code: 'IPD', description: 'In-patient wards' },
                    { name: 'Intensive Care Unit', code: 'ICU', description: 'Critical care' },
                    { name: 'Operating Theatre', code: 'OT', description: 'Surgical procedures' },
                    { name: 'Radiology', code: 'RAD', description: 'Medical imaging' },
                    { name: 'Pathology', code: 'PATH', description: 'Laboratory diagnostics' },
                    { name: 'Pharmacy', code: 'PHAR', description: 'Medication dispensing' }
                ];

                await tx.hms_departments.createMany({
                    data: standardDepartments.map(dept => ({
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
            }

            return { success: true };
        }, {
            timeout: 10000
        });

        return result;

    } catch (error) {
        console.error("Signup error:", error)
        return { error: "Failed to create account. " + (error as Error).message }
    }
}
