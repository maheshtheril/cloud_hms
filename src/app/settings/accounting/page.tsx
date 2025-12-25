
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AccountingSettingsForm } from "@/components/settings/accounting-settings-form"
import { ensureDefaultAccounts } from "@/lib/account-seeder"
import { ensureAccountingMenu } from "@/lib/menu-seeder"

export const dynamic = 'force-dynamic'

export default async function AccountingSettingsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect('/login')

    // Auto-fix menu existence if missing (Self-Healing)
    await ensureAccountingMenu();

    const companyId = session.user.companyId;
    if (!companyId) return <div>No company found</div>

    // Self-Healing: Ensure Basic Accounts Exist
    if (session.user.tenantId) {
        await ensureDefaultAccounts(companyId, session.user.tenantId);
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
        select: { id: true, name: true, rate: true }
    })

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
            />
        </div>
    )
}
