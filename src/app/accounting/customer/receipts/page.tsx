
import { getPayments } from "@/app/actions/accounting/payments"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ensureAccountingMenu } from "@/lib/menu-seeder"

export default async function ReceiptsListPage() {
    await ensureAccountingMenu().catch(console.error);
    const { data: receipts } = await getPayments('inbound');

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-900 to-emerald-600 bg-clip-text text-transparent">Customer Receipts</h1>
                    <p className="text-muted-foreground">Manage incoming payments from customers.</p>
                </div>
                <Link href="/accounting/customer/receipts/new">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="w-4 h-4 mr-2" /> New Receipt
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
                            <th className="px-6 py-3 text-left font-medium text-slate-500">Customer</th>
                            <th className="px-6 py-3 text-left font-medium text-slate-500">Method</th>
                            <th className="px-6 py-3 text-right font-medium text-slate-500">Amount</th>
                            <th className="px-6 py-3 text-center font-medium text-slate-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {receipts?.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-10 text-slate-400">No receipts found.</td></tr>
                        )}
                        {receipts?.map((r: any) => (
                            <tr key={r.id} className="hover:bg-slate-50">
                                <td className="px-6 py-3 font-mono">{r.payment_number}</td>
                                <td className="px-6 py-3">
                                    {r.metadata?.date ? new Date(r.metadata.date).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-3 font-medium">{r.partner_name}</td>
                                <td className="px-6 py-3 capitalize">{r.method}</td>
                                <td className="px-6 py-3 text-right font-bold text-emerald-700">
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
