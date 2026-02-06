import { DetailedLedgerReport } from "@/components/accounting/detailed-ledger-report"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Daybook | Accounting Oversight",
    description: "Daily transaction register and audit log",
}

export default function DaybookPage() {
    return <DetailedLedgerReport type="daybook" />
}
