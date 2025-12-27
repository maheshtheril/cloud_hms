'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPayments } from '@/app/actions/accounting/payments';
import { Plus, Search, ArrowUpRight, CheckCircle2, CircleDashed, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setIsLoading(true);
        const res = await getPayments('outbound');
        if (res?.success) {
            setPayments(res.data || []);
        }
        setIsLoading(false);
    }

    const filtered = payments.filter(p =>
        p.payment_number?.toLowerCase().includes(search.toLowerCase()) ||
        p.partner_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.reference?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-rose-500/30">
            {/* Header */}
            <div className="border-b border-white/5 bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                                <ArrowUpRight className="h-5 w-5 text-rose-500" />
                            </div>
                            Payments
                        </h1>
                        <p className="text-xs text-neutral-500 mt-1 font-medium">Manage outgoing payments to vendors</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 group-focus-within:text-rose-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search payments..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="h-10 pl-10 pr-4 bg-neutral-900 border border-white/10 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 w-64 transition-all"
                            />
                        </div>
                        <div className="h-8 w-px bg-white/10 mx-2"></div>
                        <Link
                            href="/hms/accounting/payments/new"
                            className="h-10 px-5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-rose-900/20 hover:shadow-rose-900/40"
                        >
                            <Plus className="h-4 w-4" />
                            New Payment
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1600px] mx-auto px-6 py-8">

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="h-10 w-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-neutral-500 animate-pulse">Loading financial data...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-20 flex flex-col items-center text-center">
                        <div className="h-20 w-20 rounded-full bg-neutral-800/50 flex items-center justify-center mb-6">
                            <FileText className="h-10 w-10 text-neutral-600" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No payments found</h3>
                        <p className="text-neutral-500 max-w-sm mb-8">
                            Record payments made to vendors or expenses to keep your accounts accurate.
                        </p>
                        <Link
                            href="/hms/accounting/payments/new"
                            className="h-10 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-full flex items-center gap-2 transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            Create First Payment
                        </Link>
                    </div>
                ) : (
                    <div className="rounded-xl border border-white/5 bg-neutral-900/20 overflow-hidden backdrop-blur-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="py-4 px-6 text-xs font-medium text-neutral-500 uppercase tracking-wider">Number</th>
                                    <th className="py-4 px-6 text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                                    <th className="py-4 px-6 text-xs font-medium text-neutral-500 uppercase tracking-wider">Payee / Vendor</th>
                                    <th className="py-4 px-6 text-xs font-medium text-neutral-500 uppercase tracking-wider">Reference</th>
                                    <th className="py-4 px-6 text-xs font-medium text-neutral-500 uppercase tracking-wider">Method</th>
                                    <th className="py-4 px-6 text-xs font-medium text-neutral-500 uppercase tracking-wider text-right">Amount</th>
                                    <th className="py-4 px-6 text-xs font-medium text-neutral-500 uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.map((payment) => (
                                    <tr key={payment.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="font-mono text-sm text-rose-400 font-medium group-hover:text-rose-300 transition-colors">
                                                {payment.payment_number}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-neutral-400">
                                            {format(new Date(payment.metadata?.date || payment.created_at), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm font-medium text-neutral-200">{payment.partner_name}</div>
                                            {payment.metadata?.memo && <div className="text-xs text-neutral-600 truncate max-w-[200px]">{payment.metadata.memo}</div>}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-neutral-500">
                                            {payment.reference || '-'}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-neutral-400 capitalize">
                                            {payment.method.replace('_', ' ')}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="text-sm font-semibold text-white">
                                                ₹{Number(payment.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end">
                                                {payment.posted ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-medium border border-rose-500/20">
                                                        <CheckCircle2 className="h-3 w-3" /> Posted
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-400 text-xs font-medium border border-white/10">
                                                        <CircleDashed className="h-3 w-3" /> Draft
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
