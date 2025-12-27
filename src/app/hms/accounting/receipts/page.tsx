'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPayments } from '@/app/actions/accounting/payments';
import {
    Plus, Search, CheckCircle2, CircleDashed,
    FileText, ArrowDownLeft, TrendingUp, Receipt
} from 'lucide-react';
import { format } from 'date-fns';
import { CreateReceiptDialog } from '@/components/accounting/create-receipt-dialog';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReceiptsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
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

            {/* Content Area */}
            <div className="max-w-[1600px] mx-auto px-6 py-8 h-[calc(100vh-80px)] overflow-auto">
                <AnimatePresence mode="wait">
                    {/* Stats Grid */}
                    {filtered.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                        >
                            <StatCard
                                title="Total Earnings"
                                value={`₹${totalReceipts.toLocaleString('en-IN')}`}
                                subtext="Net collection flow"
                                icon={TrendingUp}
                                color="emerald"
                            />
                            <StatCard
                                title="Posted Records"
                                value={countPosted}
                                subtext="Legally verified"
                                icon={CheckCircle2}
                                color="blue"
                            />
                            <StatCard
                                title="Draft Entries"
                                value={countDraft}
                                subtext="In queue"
                                icon={CircleDashed}
                                color="amber"
                            />
                        </motion.div>
                    )}

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white dark:bg-neutral-900/40 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                            <div className="h-12 w-12 border-4 border-slate-200 dark:border-neutral-800 border-t-emerald-500 rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-slate-500 dark:text-neutral-500 animate-pulse">Syncing encrypted vault...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-neutral-900/20 p-24 flex flex-col items-center text-center"
                        >
                            <div className="h-24 w-24 rounded-3xl bg-white dark:bg-neutral-800 flex items-center justify-center mb-6 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
                                <Receipt className="h-10 w-10 text-slate-400 dark:text-neutral-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Void Record Space</h3>
                            <p className="text-slate-500 dark:text-neutral-500 max-w-sm mb-8 leading-relaxed text-sm">
                                No financial fingerprints found. Initiate a new receipt to begin protocol.
                            </p>
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="h-11 px-8 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all font-bold rounded-xl text-sm"
                            >
                                Trigger New Entry
                            </button>
                        </motion.div>
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-3xl shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="px-6 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Transaction</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Payer</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Method</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] text-right">Amount</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {filtered.map((p: any) => (
                                        <motion.tr
                                            key={p.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="group hover:bg-white/[0.03] transition-all cursor-pointer"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold text-sm tracking-tight">{format(new Date(p.date), 'MMM dd, yyyy')}</span>
                                                    <span className="text-neutral-500 text-[10px] font-mono mt-0.5 uppercase tracking-tighter">{p.reference || 'NO_REF'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
                                                        {p.partner_name?.substring(0, 2).toUpperCase() || '??'}
                                                    </div>
                                                    <span className="text-neutral-300 font-medium text-sm">{p.partner_name || 'Anonymous'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-neutral-400 capitalize tracking-[0.1em]">{p.method}</span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <span className="text-emerald-400 font-black text-base tracking-tighter">₹{Number(p.amount).toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("h-1.5 w-1.5 rounded-full", p.posted ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500 animate-pulse")} />
                                                    <span className={cn("text-[10px] font-black uppercase tracking-widest", p.posted ? "text-emerald-500" : "text-amber-500")}>
                                                        {p.posted ? 'Posted' : 'Draft'}
                                                    </span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </AnimatePresence>
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
    const colorClasses = {
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-900/10",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-900/10",
        amber: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-900/10",
    }[color as 'emerald' | 'blue' | 'amber'] || "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";

    return (
        <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/[0.02] transform translate-x-8 -translate-y-8 rounded-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-black text-white tracking-tighter">{value}</h3>
                </div>
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border", colorClasses)}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest flex items-center gap-1">
                {subtext}
            </p>
        </div>
    );
}
