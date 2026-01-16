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
        // ASSETS (1000-1999)
        { code: '1000', name: 'Cash on Hand', type: 'Asset' },
        { code: '1010', name: 'Petty Cash', type: 'Asset' },
        { code: '1050', name: 'Bank Account - Primary', type: 'Asset' },
        { code: '1200', name: 'Accounts Receivable (Debtors)', type: 'Asset' },
        { code: '1400', name: 'Inventory / Stock', type: 'Asset' },
        { code: '1500', name: 'Office Equipment', type: 'Asset' },
        { code: '1510', name: 'Medical Equipment', type: 'Asset' },
        { code: '1520', name: 'Furniture & Fixtures', type: 'Asset' },

        // LIABILITIES (2000-2999)
        { code: '2000', name: 'Accounts Payable (Creditors)', type: 'Liability' },
        { code: '2010', name: 'Accrued Expenses', type: 'Liability' },
        { code: '2200', name: `${taxLabel} Output (Collected)`, type: 'Liability' },
        { code: '2210', name: `${taxLabel} Input (Paid)`, type: 'Liability' },
        { code: '2300', name: 'Salaries Payable', type: 'Liability' },

        // EQUITY (3000-3999)
        { code: '3000', name: 'Owner Capital / Equity', type: 'Equity' },
        { code: '3200', name: 'Retained Earnings', type: 'Equity' },

        // REVENUE (4000-4999)
        { code: '4000', name: 'Patient Consultation Fees', type: 'Revenue' },
        { code: '4100', name: 'Lab Test Revenue', type: 'Revenue' },
        { code: '4200', name: 'Pharmacy Sales', type: 'Revenue' },
        { code: '4300', name: 'Procedure / Surgery Charges', type: 'Revenue' },
        { code: '4900', name: 'Other Income', type: 'Revenue' },
        { code: '4950', name: 'Purchase Discounts', type: 'Revenue' },

        // EXPENSES (5000-8999)
        // Direct
        { code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'Expense' },
        { code: '5100', name: 'Inventory Shrinkage', type: 'Expense' },
        { code: '4150', name: 'Sales Discounts Given', type: 'Expense' },

        // Indirect - Admin
        { code: '6000', name: 'Rent', type: 'Expense' },
        { code: '6010', name: 'Electricity & Water', type: 'Expense' },
        { code: '6020', name: 'Telephone & Internet', type: 'Expense' },
        { code: '6030', name: 'Printing & Stationery', type: 'Expense' },
        { code: '6040', name: 'Office Maintenance', type: 'Expense' },
        { code: '6050', name: 'Postage & Courier', type: 'Expense' },
        { code: '6060', name: 'Software Subscriptions', type: 'Expense' },
        { code: '6070', name: 'Audit & Professional Fees', type: 'Expense' },

        // Indirect - Personnel
        { code: '6600', name: 'Staff Salaries', type: 'Expense' },
        { code: '6610', name: 'Staff Welfare', type: 'Expense' },
        { code: '6620', name: 'Training & Development', type: 'Expense' },

        // Indirect - Marketing
        { code: '6200', name: 'Advertising & Marketing', type: 'Expense' },
        { code: '6210', name: 'Business Promotion', type: 'Expense' },

        // Indirect - Maintenance
        { code: '6500', name: 'Repairs - Medical Equipment', type: 'Expense' },
        { code: '6510', name: 'Repairs - Building/Furniture', type: 'Expense' },

        // Indirect - Financial
        { code: '7000', name: 'Bank Charges', type: 'Expense' },
        { code: '7010', name: 'Interest Expense', type: 'Expense' },
        { code: '7020', name: 'Merchant Gateway Fees', type: 'Expense' },
        { code: '7050', name: 'Currency Exchange Loss', type: 'Expense' },

        // Indirect - Travel
        { code: '6700', name: 'Travel Expenses', type: 'Expense' },

        // Other
        { code: '8000', name: 'Depreciation Expense', type: 'Expense' },
        { code: '8900', name: 'Miscellaneous Expenses', type: 'Expense' },
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
