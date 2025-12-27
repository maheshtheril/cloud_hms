
import { getAccounts } from "@/app/actions/accounting/chart-of-accounts"
import { ChartOfAccountsManager } from "@/components/accounting/coa-manager"

export const metadata = {
    title: "Chart of Accounts | Accounting",
    description: "Manage your Global General Ledger Accounts"
}

export default async function ChartOfAccountsPage() {
    const { data: accounts, error } = await getAccounts()

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                <h3 className="text-lg font-bold">Error loading accounts</h3>
                <p>{error}</p>
            </div>
        )
    }

    const formattedAccounts = (accounts || []).map(acc => ({
        ...acc,
        is_reconcilable: acc.is_reconcilable ?? false,
        parent_id: acc.parent_id,
        is_active: acc.is_active ?? true // Ensure boolean
    }))

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <ChartOfAccountsManager initialAccounts={formattedAccounts} />
        </div>
    )
}
