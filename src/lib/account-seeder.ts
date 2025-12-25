import { prisma } from "@/lib/prisma"

export async function ensureDefaultAccounts(companyId: string, tenantId: string) {
    const count = await prisma.accounts.count({
        where: { company_id: companyId }
    });

    if (count > 0) return; // Already has accounts

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

    // 2. Seed Basic COA with Localized Names (World Standard Template)
    const accounts = [
        // --- ASSETS (1000-1999) ---
        { code: '1000', name: 'Cash on Hand', type: 'Asset' },
        { code: '1010', name: 'Bank Account', type: 'Asset' },
        { code: '1200', name: 'Accounts Receivable (Debtors)', type: 'Asset' }, // System Key
        { code: '1400', name: 'Inventory / Stock', type: 'Asset' },
        { code: '1500', name: 'Office Equipment', type: 'Asset' },

        // --- LIABILITIES (2000-2999) ---
        { code: '2000', name: 'Accounts Payable (Creditors)', type: 'Liability' }, // System Key
        { code: '2200', name: `${taxLabel} Output (Collected on Sales)`, type: 'Liability' }, // Output Tax
        { code: '2210', name: `${taxLabel} Input (Paid on Purchases)`, type: 'Liability' }, // Input Tax (Often Liability with debit balance or Asset)
        { code: '2300', name: 'Employee Salaries Payable', type: 'Liability' },

        // --- EQUITY (3000-3999) ---
        { code: '3000', name: 'Owner Capital / Equity', type: 'Equity' },
        { code: '3200', name: 'Retained Earnings', type: 'Equity' }, // System Key for Year End

        // --- INCOME / REVENUE (4000-4999) ---
        { code: '4000', name: 'Product Sales', type: 'Revenue' },
        { code: '4100', name: 'Service Revenue', type: 'Revenue' },
        { code: '4200', name: 'Consulting Income', type: 'Revenue' },
        { code: '4900', name: 'Other Income', type: 'Revenue' },

        // --- EXPENSES (6000-8999) ---
        { code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'Expense' }, // Direct Cost
        { code: '6000', name: 'Advertising & Marketing', type: 'Expense' },
        { code: '6100', name: 'Bank Fees & Charges', type: 'Expense' },
        { code: '6200', name: 'Consulting & Professional Fees', type: 'Expense' },
        { code: '6300', name: 'IT & Software Subscriptions', type: 'Expense' },
        { code: '6400', name: 'Office Rent', type: 'Expense' },
        { code: '6500', name: 'Repairs & Maintenance', type: 'Expense' },
        { code: '6600', name: 'Staff Salaries & Wages', type: 'Expense' },
        { code: '6700', name: 'Travel & Accommodation', type: 'Expense' },
        { code: '6800', name: 'Utilities (Power/Water/Internet)', type: 'Expense' },
        { code: '8900', name: 'General Expenses', type: 'Expense' },
    ];

    for (const acc of accounts) {
        await prisma.accounts.create({
            data: {
                company_id: companyId,
                tenant_id: tenantId,
                code: acc.code,
                name: acc.name,
                type: acc.type,
                is_active: true,
                is_reconcilable: ['1200', '2000'].includes(acc.code)
            }
        });
    }
}
