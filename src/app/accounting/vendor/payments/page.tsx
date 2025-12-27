
import { getPayments } from "@/app/actions/accounting/payments"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ensureAccountingMenu } from "@/lib/menu-seeder"

export default async function PaymentsListPage() {
    await ensureAccountingMenu().catch(console.error);
    const { data: payments } = await getPayments('outbound');

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">Vendor Payments</h1>
                    <p className="text-muted-foreground">Manage outgoing payments to suppliers.</p>
                </div>
                <Link href="/accounting/vendor/payments/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" /> New Payment
                    </Button>
                </Link>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-slate-500">Number</th>
                            <th className="px-6 py-3 text-left font-medium text-slate-500">Date</th>
                            <th className="px-6 py-3 text-left font-medium text-slate-500">Vendor</th>
                            <th className="px-6 py-3 text-left font-medium text-slate-500">Method</th>
                            <th className="px-6 py-3 text-right font-medium text-slate-500">Amount</th>
                            <th className="px-6 py-3 text-center font-medium text-slate-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {payments?.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-10 text-slate-400">No payments found.</td></tr>
                        )}
                        {payments?.map((r: any) => (
                            <tr key={r.id} className="hover:bg-slate-50">
                                <td className="px-6 py-3 font-mono">{r.payment_number}</td>
                                <td className="px-6 py-3">
                                    {r.metadata?.date ? new Date(r.metadata.date).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-3 font-medium">{r.partner_name}</td>
                                <td className="px-6 py-3 capitalize">{r.method}</td>
                                <td className="px-6 py-3 text-right font-bold text-red-700">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(r.amount))}
                                </td>
                                <td className="px-6 py-3 text-center">
                                    <Badge variant={r.posted ? "default" : "secondary"}>
                                        {r.posted ? "Posted" : "Draft"}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
