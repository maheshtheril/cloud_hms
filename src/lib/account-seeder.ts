import { prisma } from "@/lib/prisma"

export async function ensureDefaultAccounts(companyId: string, tenantId: string) {
    // 1. Determine Tax Terminology based on Country
    const company = await prisma.company.findUnique({
        where: { id: companyId },
        include: { countries: true }
    });

    let taxLabel = "Tax";
    const countryName = company?.countries?.name?.toLowerCase() || '';

    if (countryName.includes('india') || countryName.includes('canada') || countryName.includes('australia')) {
        taxLabel = "GST";
    } else if (countryName.includes('united kingdom') || countryName.includes('uae') || countryName.includes('europe')) {
        taxLabel = "VAT";
    } else if (countryName.includes('usa') || countryName.includes('united states')) {
        taxLabel = "Sales Tax";
    }

    // 2. Fetch existing accounts to check what is missing
    const existingAccounts = await prisma.accounts.findMany({
        where: { company_id: companyId },
        select: { code: true }
    });
    const existingCodes = new Set(existingAccounts.map(a => a.code || ''));

    // 3. Define Standard COA Template (1000-8999 range)
    const templates = [
        { code: '1000', name: 'Cash on Hand', type: 'Asset' },
        { code: '1010', name: 'Bank Account', type: 'Asset' },
        { code: '1200', name: 'Accounts Receivable (Debtors)', type: 'Asset' },
        { code: '1400', name: 'Inventory / Stock', type: 'Asset' },
        { code: '1500', name: 'Office Equipment', type: 'Asset' },
        { code: '2000', name: 'Accounts Payable (Creditors)', type: 'Liability' },
        { code: '2200', name: `${taxLabel} Output (Collected on Sales)`, type: 'Liability' },
        { code: '2210', name: `${taxLabel} Input (Paid on Purchases)`, type: 'Liability' },
        { code: '2300', name: 'Employee Salaries Payable', type: 'Liability' },
        { code: '3000', name: 'Owner Capital / Equity', type: 'Equity' },
        { code: '3200', name: 'Retained Earnings', type: 'Equity' },
        { code: '4000', name: 'Product Sales', type: 'Revenue' },
        { code: '4100', name: 'Service Revenue', type: 'Revenue' },
        { code: '4200', name: 'Consulting Income', type: 'Revenue' },
        { code: '4900', name: 'Other Income', type: 'Revenue' },
        { code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'Expense' },
        { code: '6000', name: 'Advertising & Marketing', type: 'Expense' },
        { code: '6500', name: 'Repairs & Maintenance', type: 'Expense' },
        { code: '6600', name: 'Staff Salaries & Wages', type: 'Expense' },
        { code: '6700', name: 'Travel & Accommodation', type: 'Expense' },
        { code: '6800', name: 'Utilities (Power/Water/Internet)', type: 'Expense' },
        { code: '8900', name: 'General Expenses', type: 'Expense' },
        { code: '4150', name: 'Sales Discounts', type: 'Expense' },
        { code: '4950', name: 'Purchase Discounts', type: 'Revenue' },
        { code: '5100', name: 'Inventory Shrinkage / Adjustment', type: 'Expense' },
        { code: '7000', name: 'Currency Exchange Gain/Loss', type: 'Expense' },
    ];

    const missing = templates.filter(t => !existingCodes.has(t.code));

    if (missing.length > 0) {
        await prisma.accounts.createMany({
            data: missing.map(acc => ({
                company_id: companyId,
                tenant_id: tenantId,
                code: acc.code,
                name: acc.name,
                type: acc.type,
                is_active: true,
                is_reconcilable: ['1200', '2000'].includes(acc.code)
            })),
            skipDuplicates: true
        });
    }
}
