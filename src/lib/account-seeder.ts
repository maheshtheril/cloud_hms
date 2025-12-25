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

    // 2. Seed Basic COA with Localized Names
    const accounts = [
        { code: '1000', name: 'Cash on Hand', type: 'Asset' },
        { code: '1200', name: 'Accounts Receivable', type: 'Asset' }, // AR
        { code: '2000', name: 'Accounts Payable', type: 'Liability' },
        { code: '2200', name: `${taxLabel} Output (Sales)`, type: 'Liability' }, // Tax Payable
        { code: '2210', name: `${taxLabel} Input (Purchase)`, type: 'Liability' },
        { code: '4000', name: 'Sales / Revenue', type: 'Revenue' }, // Sales
        { code: '6000', name: 'General Expenses', type: 'Expense' },
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
