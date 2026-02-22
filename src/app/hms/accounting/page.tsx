import { auth } from "@/auth"
import { FinancialDashboard } from "@/components/accounting/financial-dashboard"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Financial Dashboard | World Standard Accounting",
    description: "Daily accounting reports, P&L, and Balance Sheet",
}

export default async function AccountingDashboardPage() {
    const session = await auth();
    return (
        <div className="flex-1 space-y-4">
            <FinancialDashboard
                currencyCode={session?.user?.currencyCode || 'INR'}
                currencySymbol={session?.user?.currencySymbol || '₹'}
            />
        </div>
    )
}
