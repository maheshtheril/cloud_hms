import { FinancialDashboard } from "@/components/accounting/financial-dashboard"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Financial Dashboard | World Standard Accounting",
    description: "Daily accounting reports, P&L, and Balance Sheet",
}

export default function AccountingDashboardPage() {
    return (
        <div className="flex-1 space-y-4">
            <FinancialDashboard />
        </div>
    )
}
