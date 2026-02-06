import { DetailedLedgerReport } from "@/components/accounting/detailed-ledger-report"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Bankbook | Accounting Oversight",
    description: "Bank account ledger and reconciliation register",
}

export default function BankbookPage() {
    return <DetailedLedgerReport type="bankbook" />
}
