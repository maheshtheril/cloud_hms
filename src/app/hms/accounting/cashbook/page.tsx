import { DetailedLedgerReport } from "@/components/accounting/detailed-ledger-report"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Cashbook | Accounting Oversight",
    description: "Cash account ledger and balance tracking",
}

export default function CashbookPage() {
    return <DetailedLedgerReport type="cashbook" />
}
