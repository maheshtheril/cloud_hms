'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPayments, type PaymentType } from '@/app/actions/accounting/payments';
import {
    Plus, Search, Filter, Download, ExternalLink, CheckCircle2, CircleDashed,
    FileText, ArrowUpRight, ArrowDownLeft, TrendingUp, Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { CreateReceiptDialog } from '@/components/accounting/create-receipt-dialog';
import { cn } from '@/lib/utils';

export default function ReceiptsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Popup State
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setIsLoading(true);
        const res = await getPayments('inbound');
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

    // Calculate Stats
    const totalReceipts = filtered.reduce((sum, p) => sum + Number(p.amount), 0);
    const countDraft = filtered.filter(p => !p.posted).length;
    const countPosted = filtered.filter(p => p.posted).length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 font-sans relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

            {/* Header */}
            <div className="border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-sm">
                                <ArrowDownLeft className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                            </div>
                            Receipts
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-4 px-4 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-600 dark:text-neutral-400 mr-2">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>₹{totalReceipts.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Collected</span>
                            </div>
                        </div>

                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-neutral-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-neutral-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 w-64 transition-all shadow-sm"
                            />
                        </div>

                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="h-10 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            <span>New Receipt</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1600px] mx-auto px-6 py-8">

                {/* Stats Grid */}
                {filtered.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            title="Total Revenue"
                            value={`₹${totalReceipts.toLocaleString('en-IN')}`}
                            subtext="Across all receipts"
                            icon={TrendingUp}
                            color="emerald"
                        />
                        <StatCard
                            title="Posted Receipts"
                            value={countPosted}
                            subtext="Verified & locked"
                            icon={CheckCircle2}
                            color="blue"
                        />
                        <StatCard
                            title="Draft Receipts"
                            value={countDraft}
                            subtext="Pending verification"
                            icon={CircleDashed}
                            color="amber"
                        />
                    </div>
                )}

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white dark:bg-neutral-900/40 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                        <div className="h-12 w-12 border-4 border-slate-200 dark:border-neutral-800 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-slate-500 dark:text-neutral-500 animate-pulse">Syncing financial records...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-neutral-900/20 p-24 flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-3xl bg-white dark:bg-neutral-800 flex items-center justify-center mb-6 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
                            <FileText className="h-10 w-10 text-slate-400 dark:text-neutral-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">No receipts found</h3>
                        <p className="text-slate-500 dark:text-neutral-500 max-w-sm mb-8 leading-relaxed">
                            No incoming payment records match your search criteria. Create a new receipt to get started.
                        </p>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="h-11 px-8 bg-white dark:bg-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-700 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
                        >
                            <Plus className="h-4 w-4" />
                            Create First Receipt
                        </button>
                    </div>
                ) : (
                    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-neutral-900/50 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none backdrop-blur-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                                    <th className="py-5 px-6 text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-wider">Number</th>
                                    <th className="py-5 px-6 text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-wider">Date</th>
                                    <th className="py-5 px-6 text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-wider">Payer</th>
                                    <th className="py-5 px-6 text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-wider">Reference</th>
                                    <th className="py-5 px-6 text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-wider">Method</th>
                                    <th className="py-5 px-6 text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-wider text-right">Amount</th>
                                    <th className="py-5 px-6 text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {filtered.map((receipt) => (
                                    <tr key={receipt.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors relative">
                                        <td className="py-4 px-6 relative z-10">
                                            <div className="font-mono text-sm text-emerald-600 dark:text-emerald-400 font-bold group-hover:underline decoration-emerald-500/30 underline-offset-4 decoration-2 transition-all">
                                                {receipt.payment_number}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-600 dark:text-neutral-400">
                                            {format(new Date(receipt.metadata?.date || receipt.created_at), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-neutral-400">
                                                    {receipt.partner_name?.substring(0, 2).toUpperCase() || 'NA'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-900 dark:text-neutral-200">{receipt.partner_name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-500 dark:text-neutral-500 font-mono">
                                            {receipt.reference || '-'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs font-medium text-slate-600 dark:text-neutral-400 capitalize">
                                                {receipt.method.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">
                                                ₹{Number(receipt.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end">
                                                {receipt.posted ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-500/20">
                                                        <CheckCircle2 className="h-3.5 w-3.5" /> Posted
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-100 dark:border-amber-500/20">
                                                        <CircleDashed className="h-3.5 w-3.5" /> Draft
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

            {/* Create Receipt Dialog */}
            <CreateReceiptDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSuccess={() => loadData()}
            />
        </div>
    );
}

function StatCard({ title, value, subtext, icon: Icon, color }: any) {
    const colors = {
        emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    } as any;

    return (
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-current to-transparent opacity-[0.03] transform translate-x-8 -translate-y-8 rounded-full pointer-events-none" />

            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
                </div>
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border", (colors[color] || colors.emerald))}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-neutral-500 flex items-center gap-1">
                {subtext}
            </p>
        </div>
    )
}
