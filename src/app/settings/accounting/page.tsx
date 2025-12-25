
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AccountingSettingsForm } from "@/components/settings/accounting-settings-form"
import { ensureDefaultAccounts } from "@/lib/account-seeder"
import { ensureAccountingMenu, ensureAdminMenus } from "@/lib/menu-seeder"

export const dynamic = 'force-dynamic'

export default async function AccountingSettingsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect('/login')

    // Auto-fix menu existence if missing (Self-Healing)
    try {
        await ensureAccountingMenu();
        await ensureAdminMenus();
    } catch (e) {
        console.error("Menu seeding failed", e);
    }

    const companyId = session.user.companyId;
    if (!companyId) return <div>No company found</div>

    // Self-Healing: Ensure Basic Accounts Exist
    if (session.user.tenantId) {
        try {
            await ensureDefaultAccounts(companyId, session.user.tenantId);
        } catch (e) {
            console.error("Account seeding failed", e);
        }
    }

    // 1. Fetch Existing Settings
    const settings = await prisma.company_accounting_settings.findUnique({
        where: { company_id: companyId }
    })

    // 2. Fetch Chart of Accounts
    const accounts = await prisma.accounts.findMany({
        where: {
            company_id: companyId,
            is_active: true
        },
        orderBy: { code: 'asc' },
        select: { id: true, code: true, name: true, type: true }
    })

    // 3. Fetch Tax Rates
    const taxRates = await prisma.tax_rates.findMany({
        where: {
            is_active: true
        },
        orderBy: { rate: 'asc' },
        // 4. Determine Tax Label (Priority: Database Setting -> Country Fallback -> Default)
        let taxLabel = "Tax";

        // A. specific company settings
        const companySettings = await prisma.company_settings.findFirst({
            where: { company_id: companyId },
            include: { tax_types: true }
        });

        if(companySettings?.tax_types?.name) {
            taxLabel = companySettings.tax_types.name;
        } else {
            // B. Fallback to Country Logic
            const company = await prisma.company.findUnique({
                where: { id: companyId },
                include: { countries: true }
            });

            const countryName = company?.countries?.name?.toLowerCase() || '';

            if(countryName.includes('india') || countryName.includes('canada') || countryName.includes('australia') || countryName.includes('new zealand')) {
                taxLabel = "GST";
} else if (countryName.includes('united kingdom') || countryName.includes('uae') || countryName.includes('saudi') || countryName.includes('europe')) {
    taxLabel = "VAT";
} else if (countryName.includes('usa') || countryName.includes('united states')) {
    taxLabel = "Sales Tax";
}
    }

return (
    <div className="container mx-auto p-6 max-w-4xl">
        <header className="mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Accounting Settings</h1>
            <p className="text-slate-500 mt-1">Configure automated journal posting rules.</p>
        </header>

        <AccountingSettingsForm
            settings={settings}
            accounts={accounts}
            taxRates={taxRates}
            taxLabel={taxLabel}
        />
    </div>
)
}
