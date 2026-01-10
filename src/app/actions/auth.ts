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

            // 3c. Seed Chart of Accounts and Accounting Settings (World Class Standard)
            // We do this inside the transaction so the user is "Revenue Ready" instantly.
            if (currencyId) {
                // Determine Tax Label
                let taxLabel = "Tax";

                const coaTemplate = [
                    { code: '1000', name: 'Cash on Hand', type: 'Asset' },
                    { code: '1010', name: 'Bank Account', type: 'Asset' },
                    { code: '1200', name: 'Accounts Receivable', type: 'Asset' },
                    { code: '1400', name: 'Inventory / Stock', type: 'Asset' },
                    { code: '2000', name: 'Accounts Payable', type: 'Liability' },
                    { code: '2200', name: `${taxLabel} Output (Sales)`, type: 'Liability' },
                    { code: '2210', name: `${taxLabel} Input (Purchase)`, type: 'Liability' },
                    { code: '3000', name: 'Owner Capital / Equity', type: 'Equity' },
                    { code: '4000', name: 'Product Sales', type: 'Revenue' },
                    { code: '4100', name: 'Service Revenue', type: 'Revenue' },
                    { code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'Expense' },
                    { code: '5100', name: 'Inventory Adjmnt', type: 'Expense' },
                ];

                await tx.accounts.createMany({
                    data: coaTemplate.map(acc => ({
                        id: crypto.randomUUID(),
                        tenant_id: tenantId,
                        company_id: companyId,
                        code: acc.code,
                        name: acc.name,
                        type: acc.type,
                        is_active: true
                    }))
                });

                // Fetch back to get IDs
                const createdAccounts = await tx.accounts.findMany({
                    where: { company_id: companyId }
                });
                const findId = (code: string) => createdAccounts.find(a => a.code === code)?.id;

                await tx.company_accounting_settings.create({
                    data: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        currency_id: currencyId,
                        ar_account_id: findId('1200'),
                        ap_account_id: findId('2000'),
                        sales_account_id: findId('4000'),
                        purchase_account_id: findId('5000'),
                        inventory_asset_account_id: findId('1400'),
                        output_tax_account_id: findId('2200'),
                        input_tax_account_id: findId('2210'),
                        stock_adjustment_account_id: findId('5100'),
                        fiscal_year_start: new Date(new Date().getFullYear(), 0, 1),
                        fiscal_year_end: new Date(new Date().getFullYear(), 11, 31),
                    }
                });
                console.log('[Signup] Seeded Financial Accounts and Settings');
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

            // 4b. Create RBAC Roles and Assign to User
            const roleId = crypto.randomUUID();
            const hmsRoleId = crypto.randomUUID();

            // Create HMS Role (for HMS module - legacy)
            await tx.hms_role.create({
                data: {
                    id: hmsRoleId,
                    tenant_id: tenantId,
                    name: 'Admin',
                    description: 'Full Access Administrator'
                }
            });

            await tx.hms_user_roles.create({
                data: {
                    user_id: userId,
                    role_id: hmsRoleId
                }
            });

            // Seed ALL default RBAC roles for the tenant
            const defaultRoles = [
                {
                    id: roleId, // Super admin - will be assigned to first user
                    key: 'super_admin',
                    name: 'Super Administrator',
                    permissions: ['*']
                },
                {
                    key: 'admin',
                    name: 'Administrator',
                    permissions: [
                        'users:view', 'users:create', 'users:edit', 'users:delete',
                        'roles:view', 'roles:manage',
                        'settings:view', 'settings:edit',
                        'hms:admin', 'crm:admin', 'inventory:admin'
                    ]
                },
                {
                    key: 'hms_admin',
                    name: 'HMS Administrator',
                    permissions: [
                        'hms:view', 'hms:create', 'hms:edit', 'hms:delete',
                        'patients:view', 'patients:create', 'patients:edit',
                        'appointments:view', 'appointments:create', 'appointments:edit',
                        'billing:view', 'billing:create', 'pharmacy:view'
                    ]
                },
                {
                    key: 'doctor',
                    name: 'Doctor',
                    permissions: [
                        'patients:view', 'patients:edit',
                        'appointments:view', 'appointments:create',
                        'prescriptions:view', 'prescriptions:create', 'prescriptions:edit',
                        'hms:view'
                    ]
                },
                {
                    key: 'nurse',
                    name: 'Nurse',
                    permissions: [
                        'patients:view', 'appointments:view',
                        'vitals:view', 'vitals:create', 'vitals:edit',
                        'hms:view'
                    ]
                },
                {
                    key: 'pharmacist',
                    name: 'Pharmacist',
                    permissions: [
                        'pharmacy:view', 'pharmacy:create', 'pharmacy:edit',
                        'inventory:view', 'prescriptions:view', 'hms:view'
                    ]
                },
                {
                    key: 'receptionist',
                    name: 'Receptionist',
                    permissions: [
                        'patients:view', 'patients:create', 'patients:edit',
                        'appointments:view', 'appointments:create', 'appointments:edit',
                        'billing:view', 'billing:create', 'hms:view'
                    ]
                },
                {
                    key: 'crm_supervisor',
                    name: 'CRM Supervisor',
                    permissions: ['crm:admin', 'crm:view_all', 'crm:reports', 'leads:view', 'leads:edit', 'deals:view', 'deals:edit']
                },
                {
                    key: 'crm_manager',
                    name: 'CRM Manager',
                    permissions: ['crm:view_team', 'crm:manage_deals', 'crm:assign_leads', 'leads:view', 'leads:edit', 'deals:view', 'deals:edit']
                },
                {
                    key: 'sales_executive',
                    name: 'Sales Executive',
                    permissions: ['crm:view_own', 'crm:create_leads', 'crm:manage_own_deals', 'leads:view', 'leads:create', 'deals:view', 'deals:create']
                },
                {
                    key: 'inventory_manager',
                    name: 'Inventory Manager',
                    permissions: [
                        'inventory:view', 'inventory:create', 'inventory:edit', 'inventory:delete',
                        'purchasing:view', 'purchasing:create', 'purchasing:edit',
                        'suppliers:view', 'suppliers:create', 'suppliers:edit'
                    ]
                },
                {
                    key: 'readonly',
                    name: 'Read Only User',
                    permissions: ['*.view']
                }
            ];

            // Create all roles
            for (const roleData of defaultRoles) {
                await tx.role.create({
                    data: {
                        id: roleData.id || crypto.randomUUID(),
                        tenant_id: tenantId,
                        key: roleData.key,
                        name: roleData.name,
                        permissions: roleData.permissions
                    }
                });
            }

            console.log(`[Signup] Created ${defaultRoles.length} default RBAC roles for tenant`);

            // Assign Super Administrator role to first user
            await tx.user_role.create({
                data: {
                    user_id: userId,
                    role_id: roleId, // Super admin role ID
                    tenant_id: tenantId
                }
            });

            console.log('[Signup] Assigned Super Administrator role to first user');


            // 5. Activate Modules
            // Logic: If 'crm' is selected, ensure 'admin' is also active.
            console.log('[Signup DEBUG] Industry:', industry, 'Modules Selected:', selectedModules);
            let modulesToEnable = new Set(selectedModules);

            // Always enforce System module (Core)
            modulesToEnable.add('system');

            // If CRM is selected, enforce System (redundant but safe)
            if (modulesToEnable.has('crm')) {
                modulesToEnable.add('system');
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

                // Seed Standard Lab Tests
                const labTests = [
                    { sku: 'LAB001', name: 'Complete Blood Count (CBC)', price: 450, description: 'Hemogram, TLC, DLC, Platelets' },
                    { sku: 'LAB002', name: 'Lipid Profile', price: 900, description: 'Cholesterol, Triglycerides, HDL, LDL' },
                    { sku: 'LAB003', name: 'Liver Function Test (LFT)', price: 850, description: 'Bilirubin, SGOT, SGPT, ALP' },
                    { sku: 'LAB004', name: 'Kidney Function Test (KFT)', price: 950, description: 'Urea, Creatinine, Uric Acid' },
                    { sku: 'LAB005', name: 'Thyroid Profile (T3, T4, TSH)', price: 1200, description: 'Thyroid Function Test' },
                    { sku: 'LAB006', name: 'HbA1c', price: 600, description: '3 Month Average Blood Sugar' },
                    { sku: 'LAB007', name: 'Blood Sugar (Fasting)', price: 150, description: 'Glucose - Fasting' },
                    { sku: 'LAB008', name: 'Blood Sugar (PP)', price: 150, description: 'Glucose - Post Prandial' },
                    { sku: 'LAB009', name: 'Urine Routine', price: 200, description: 'Urine R/M' },
                    { sku: 'LAB010', name: 'Vitamin D Total', price: 1800, description: '25-Hydroxy Vitamin D' },
                ];

                await tx.hms_product.createMany({
                    data: labTests.map(test => ({
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

                // Seed Standard Fees (Registration, Consultation)
                const stdFees = [
                    { sku: 'REG001', name: 'Registration Fee', price: 100, description: 'One-time patient registration fee', uom: 'UNIT' },
                    { sku: 'CON001', name: 'Consultation Fee', price: 500, description: 'General Doctor Consultation', uom: 'VISIT' },
                ];

                await tx.hms_product.createMany({
                    data: stdFees.map(item => ({
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
        }, {
            timeout: 10000
        });

        return result;

    } catch (error) {
        console.error("Signup error:", error)
        return { error: "Failed to create account. " + (error as Error).message }
    }
}
