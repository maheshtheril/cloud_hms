'use server'
import crypto from 'crypto';

import { prisma } from "@/lib/prisma"
import { signOut } from "@/auth"
import { headers } from "next/headers";
import bcrypt from 'bcryptjs';
import { initializeTenantMasters } from "@/lib/services/tenant-init";
import { SYSTEM_DEFAULT_CURRENCY_CODE } from "@/lib/currency-constants";

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
    const email = (rawData.email as string || '').toLowerCase();
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
        const countryId = rawData.countryId as string;
        let resolvedCountryId = countryId;

        // Defensive check: if countryId is an ISO code (e.g. "IN"), resolve it to UUID
        if (countryId && (countryId.length === 2 || countryId.length === 3)) {
            const countryDoc = await prisma.countries.findFirst({
                where: { OR: [{ iso2: countryId }, { iso3: countryId }] },
                select: { id: true }
            });
            if (countryDoc) resolvedCountryId = countryDoc.id;
            else resolvedCountryId = ""; // Invalid ISO code
        }

        const currencyId = rawData.currencyId as string;
        let resolvedCurrencyId = currencyId;

        // Defensive check: if currencyId is a code (e.g. "INR"), resolve it to UUID
        if (currencyId && currencyId.length === 3 && !/^[0-9a-fA-F-]{36}$/.test(currencyId)) {
            const currencyDoc = await prisma.currencies.findFirst({
                where: { code: currencyId },
                select: { id: true }
            });
            if (currencyDoc) resolvedCurrencyId = currencyDoc.id;
        }

        if (existing) return { error: "User already exists" }

        const tenantId = crypto.randomUUID();
        const companyId = crypto.randomUUID();
        const branchId = crypto.randomUUID();
        const userId = crypto.randomUUID();

        // [NEW] Resolve Currency Code for Seeding (Dynamic - No Hardcoding)
        let resolvedCurrencyCode = SYSTEM_DEFAULT_CURRENCY_CODE;
        if (resolvedCurrencyId) {
            const cur = await prisma.currencies.findUnique({
                where: { id: resolvedCurrencyId },
                select: { code: true }
            });
            if (cur) resolvedCurrencyCode = cur.code;
        }

        // WRAP EVERYTHING IN A TRANSACTION (World-Class Reliability)
        console.log(`[AUTH] Starting signup transaction for ${email} (Timeout: 60s)`);
        await prisma.$transaction(async (tx) => {
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
                    country_id: resolvedCountryId || undefined,
                    industry: industry,
                    enabled: true
                }
            });

            // 2b. Create Default Main Branch
            await tx.hms_branch.create({
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

            // 3. Create Company Settings
            if (resolvedCurrencyId) {
                await tx.company_settings.create({
                    data: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        currency_id: resolvedCurrencyId,
                    }
                });
            }

            // 3b. Copy Default Tax Mappings
            if (resolvedCountryId) {
                const defaultMappings = await tx.country_tax_mappings.findMany({
                    where: { country_id: resolvedCountryId, is_active: true }
                });

                if (defaultMappings.length > 0) {
                    await tx.company_tax_maps.createMany({
                        data: defaultMappings.map(dm => ({
                            id: crypto.randomUUID(),
                            tenant_id: tenantId,
                            company_id: companyId,
                            country_id: resolvedCountryId,
                            tax_type_id: dm.tax_type_id,
                            tax_rate_id: dm.tax_rate_id,
                            is_default: false,
                            is_active: true
                        }))
                    });
                }
            }

            // 3c. Seed Chart of Accounts
            if (currencyId) {
                const coaTemplate = [
                    { code: '1000', name: 'Cash on Hand', type: 'Asset' },
                    { code: '1010', name: 'Bank Account', type: 'Asset' },
                    { code: '1200', name: 'Accounts Receivable', type: 'Asset' },
                    { code: '1400', name: 'Inventory / Stock', type: 'Asset' },
                    { code: '2000', name: 'Accounts Payable', type: 'Liability' },
                    { code: '2200', name: `Tax Output (Sales)`, type: 'Liability' },
                    { code: '2210', name: `Tax Input (Purchase)`, type: 'Liability' },
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

                const createdAccounts = await tx.accounts.findMany({ where: { company_id: companyId } });
                const findId = (code: string) => createdAccounts.find(a => a.code === code)?.id;

                await tx.company_accounting_settings.create({
                    data: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        currency_id: resolvedCurrencyId,
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
            }

            // 4. Create User
            const hashedPassword = await bcrypt.hash(password, 10);
            await tx.app_user.create({
                data: {
                    id: userId,
                    tenant_id: tenantId,
                    company_id: companyId,
                    current_branch_id: branchId,
                    email: email,
                    password: hashedPassword,
                    name: name,
                    is_admin: true,
                    is_active: true
                }
            });

            await tx.user_branch.create({
                data: { user_id: userId, branch_id: branchId, is_default: true }
            });

            // 4b. Create Roles (BULK OPTIMIZATION)
            const superAdminRoleId = crypto.randomUUID();
            const defaultRoles = [
                { id: superAdminRoleId, key: 'super_admin', name: 'Super Administrator', permissions: ['*'] },
                { key: 'admin', name: 'Administrator', permissions: ['users:view', 'users:create', 'users:edit', 'hms:admin', 'crm:admin'] },
                { key: 'hms_admin', name: 'HMS Administrator', permissions: ['hms:view', 'patients:view', 'billing:view'] },
                { key: 'doctor', name: 'Doctor', permissions: ['patients:view', 'appointments:view', 'prescriptions:create'] },
                { key: 'nurse', name: 'Nurse', permissions: ['patients:view', 'vitals:create'] },
                { key: 'receptionist', name: 'Receptionist', permissions: ['patients:create', 'appointments:create', 'billing:create'] },
                { key: 'sales_executive', name: 'Sales Executive', permissions: ['crm:view_own', 'leads:create'] },
            ];

            await tx.role.createMany({
                data: defaultRoles.map(r => ({
                    id: r.id || crypto.randomUUID(),
                    tenant_id: tenantId,
                    key: r.key,
                    name: r.name,
                    permissions: r.permissions
                }))
            });

            await tx.user_role.create({
                data: { id: crypto.randomUUID(), user_id: userId, role_id: superAdminRoleId, tenant_id: tenantId }
            });

            // 5. Activate Modules (BULK OPTIMIZATION)
            let modulesToEnable = new Set(['system', ...selectedModules]);
            const validModules = await tx.modules.findMany({
                where: { module_key: { in: Array.from(modulesToEnable) } }
            });

            if (validModules.length > 0) {
                await tx.tenant_module.createMany({
                    data: validModules.map(m => ({
                        id: crypto.randomUUID(),
                        tenant_id: tenantId,
                        module_key: m.module_key,
                        module_id: m.id,
                        enabled: true
                    })),
                    skipDuplicates: true
                });
            }

            // 6. HMS Specific Seeding (IF ENABLED)
            if (modulesToEnable.has('hms')) {
                const defaultProducts = [
                    { sku: 'REG001', name: 'Patient Registration Fee', price: 150, type: 'fee' },
                    { sku: 'CON001', name: 'Consultation Fee', price: 500, type: 'fee' },
                    { sku: 'LAB001', name: 'Complete Blood Count (CBC)', price: 450, type: 'diagnostic' },
                    { sku: 'LAB002', name: 'Lipid Profile', price: 900, type: 'diagnostic' },
                    { sku: 'LAB003', name: 'Liver Function Test (LFT)', price: 850, type: 'diagnostic' },
                    { sku: 'LAB004', name: 'Kidney Function Test (KFT)', price: 950, type: 'diagnostic' },
                    { sku: 'LAB005', name: 'Thyroid Profile (T3, T4, TSH)', price: 1200, type: 'diagnostic' },
                    { sku: 'LAB006', name: 'HbA1c', price: 600, type: 'diagnostic' },
                    { sku: 'LAB007', name: 'Blood Sugar (Fasting)', price: 150, type: 'diagnostic' },
                    { sku: 'LAB008', name: 'Blood Sugar (PP)', price: 150, type: 'diagnostic' },
                    { sku: 'LAB009', name: 'Urine Routine', price: 200, type: 'diagnostic' },
                    { sku: 'LAB010', name: 'Vitamin D Total', price: 1800, type: 'diagnostic' },
                ];

                await tx.hms_product.createMany({
                    data: defaultProducts.map(p => ({
                        id: crypto.randomUUID(),
                        tenant_id: tenantId,
                        company_id: companyId,
                        sku: p.sku,
                        name: p.name,
                        is_service: true,
                        price: p.price,
                        currency: resolvedCurrencyCode,
                        is_active: true,
                        metadata: { type: p.type, tax_exempt: true }
                    }))
                });
            }

            await initializeTenantMasters(tenantId, companyId, tx);
        }, {
            maxWait: 20000,
            timeout: 60000
        });

        console.log(`[AUTH] Signup transaction successful for ${email}`);

        return { success: true };

    } catch (error) {
        console.error("Signup error:", error)
        return { error: "Failed to create account. " + (error as Error).message }
    }
}
