import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, TrendingUp, AlertCircle, CheckCircle2, Search } from "lucide-react"
import { auth } from "@/auth"

import SearchInput from "@/components/search-input"

export default async function BillingPage({
    searchParams
}: {
    searchParams: Promise<{
        q?: string
    }>
}) {
    const session = await auth();
    if (!session?.user?.companyId) return <div>Unauthorized</div>;

    const { q } = await searchParams;
    const query = q || ''

    // Parallel fetch for stats and list
    const [invoices, stats] = await Promise.all([
        prisma.hms_invoice.findMany({
            orderBy: { issued_at: 'desc' }, // Use issued_at as main date
            where: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                OR: query ? [
                    { invoice_number: { contains: query, mode: 'insensitive' } },
                    {
                        hms_patient: {
                            OR: [
                                { first_name: { contains: query, mode: 'insensitive' } },
                                { last_name: { contains: query, mode: 'insensitive' } }
                            ]
                        }
                    }
                ] : undefined
            },
            include: {
                hms_patient: true
            },
            take: 20
        }),
        prisma.hms_invoice.aggregate({
            where: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
            },
            _sum: {
                total: true, // Total Billed
                outstanding_amount: true, // Total Due
                total_paid: true // Total Collected
            },
            _count: {
                id: true
            }
        })
    ]);

    const totalRevenue = stats._sum.total_paid?.toNumber() || 0;
    const totalOutstanding = stats._sum.outstanding_amount?.toNumber() || 0;
    const totalBilled = stats._sum.total?.toNumber() || 0;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Billing & Finance</h1>
                    <p className="text-gray-500 mt-1">Overview of financial health and invoices</p>
                </div>
                <Link href="/hms/billing/new" className="bg-black text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 font-medium">
                    <Plus className="h-4 w-4" />
                    Create Invoice
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Collected to date
                        </p>
                    </div>
                    <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Outstanding</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{totalOutstanding.toLocaleString('en-IN')}</h3>
                        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Pending payments
                        </p>
                    </div>
                    <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Billed</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{totalBilled.toLocaleString('en-IN')}</h3>
                        <p className="text-xs text-gray-500 mt-2">
                            Across {stats._count.id} invoices
                        </p>
                    </div>
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <SearchInput placeholder="Search by patient, number..." />
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Invoice</th>
                            <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Patient</th>
                            <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {invoices.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500">
                                    No invoices found. <Link href="/hms/billing/new" className="text-blue-600 hover:underline">Create your first one</Link>.
                                </td>
                            </tr>
                        ) : (
                            invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                                    <td className="p-4 text-gray-900 font-medium font-mono text-sm">
                                        {inv.invoice_number}
                                    </td>
                                    <td className="p-4 text-gray-700 font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-gray-100 text-xs flex items-center justify-center text-gray-500">
                                                {inv.hms_patient?.first_name?.[0]}
                                            </div>
                                            {inv.hms_patient?.first_name} {inv.hms_patient?.last_name}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        {inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border 
                                            ${inv.status === 'paid' ? 'bg-green-50 text-green-700 border-green-100' :
                                                inv.status === 'posted' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                            {inv.status || 'draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono text-sm font-medium text-gray-900">
                                        ₹{Number(inv.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
