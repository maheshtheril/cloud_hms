'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPayments } from '@/app/actions/accounting/payments';
import {
    Plus, Search, CheckCircle2, CircleDashed,
    FileText, ArrowUpRight, TrendingDown, Wallet, Building2, Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState<string>(''); // YYYY-MM-DD
    const [activeTab, setActiveTab] = useState<'ALL' | 'VENDOR' | 'EXPENSE'>('ALL');

    useEffect(() => {
        loadData();
    }, [dateFilter]);

    async function loadData() {
        setIsLoading(true);
        const res = await getPayments('outbound', undefined, dateFilter || undefined);
        if (res?.success) {
            setPayments(res.data || []);
        }
        setIsLoading(false);
    }

    const filtered = payments.filter(p => {
        const matchesSearch =
            p.payment_number?.toLowerCase().includes(search.toLowerCase()) ||
            p.partner_name?.toLowerCase().includes(search.toLowerCase()) ||
            p.reference?.toLowerCase().includes(search.toLowerCase());

        if (!matchesSearch) return false;

        const meta = p.metadata as any;
        const isVendor = !!p.partner_id || (meta?.allocations && meta.allocations.length > 0);

        if (activeTab === 'VENDOR') return isVendor;
        if (activeTab === 'EXPENSE') return !isVendor;

        return true;
    });

    const totalPaid = filtered.reduce((sum, p) => sum + Number(p.amount), 0);
    const countDraft = filtered.filter(p => !p.posted).length;
    const countPosted = filtered.filter(p => p.posted).length;

    const safeFormat = (date: any, fmt: string) => {
        try {
            if (!date) return 'N/A';
            const d = new Date(date);
            if (isNaN(d.getTime())) return 'N/A';
            return format(d, fmt);
        } catch (e) {
            return 'N/A';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 font-sans relative overflow-hidden text-neutral-900 dark:text-neutral-100">
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center border border-teal-500/20 shadow-sm">
                                <ArrowUpRight className="h-5 w-5 text-teal-600 dark:text-teal-500" />
                            </div>
                            Payments & Expenses Center
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-4 px-4 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-600 dark:text-neutral-400 mr-2">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                <span>₹{totalPaid.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Total Outflow</span>
                            </div>
                        </div>

                        {/* Date Filter */}
                        <div className="relative group">
                            <input
                                type="date"
                                className="h-10 px-3 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-neutral-200 focus:outline-none focus:border-teal-500 w-auto shadow-sm"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-neutral-500 group-focus-within:text-teal-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-neutral-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 w-64 transition-all shadow-sm"
                            />
                        </div>

                        <Link
                            href="/hms/accounting/payments/new"
                            className="h-10 px-5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            <span>New Voucher</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-[1600px] mx-auto px-6 py-8 h-[calc(100vh-80px)] overflow-auto">
                <AnimatePresence mode="wait">

                    {/* Tabs */}
                    <div className="flex gap-4 mb-6">
                        <TabButton active={activeTab === 'ALL'} onClick={() => setActiveTab('ALL')} label="All Payments" icon={Wallet} />
                        <TabButton active={activeTab === 'VENDOR'} onClick={() => setActiveTab('VENDOR')} label="Vendor Settlements" icon={Building2} />
                        <TabButton active={activeTab === 'EXPENSE'} onClick={() => setActiveTab('EXPENSE')} label="General Expenses" icon={FileText} />
                    </div>

                    {/* Stats Grid - Context Aware */}
                    {filtered.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                        >
                            <StatCard
                                title="Selected Volume"
                                value={`₹${totalPaid.toLocaleString('en-IN')}`}
                                subtext="Total Value"
                                icon={TrendingDown}
                                color="teal"
                            />
                            <StatCard
                                title="Confirmed"
                                value={countPosted}
                                subtext="Transactions Posted"
                                icon={CheckCircle2}
                                color="blue"
                            />
                            <StatCard
                                title="Pending"
                                value={countDraft}
                                subtext="Draft Vouchers"
                                icon={CircleDashed}
                                color="amber"
                            />
                        </motion.div>
                    )}

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white dark:bg-neutral-900/40 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                            <div className="h-12 w-12 border-4 border-slate-200 dark:border-neutral-800 border-t-teal-500 rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-slate-500 dark:text-neutral-500 animate-pulse">Loading financial data...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-neutral-900/20 p-24 flex flex-col items-center text-center"
                        >
                            <div className="h-24 w-24 rounded-3xl bg-white dark:bg-neutral-800 flex items-center justify-center mb-6 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
                                <Filter className="h-10 w-10 text-slate-400 dark:text-neutral-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">No Records Found</h3>
                            <p className="text-slate-500 dark:text-neutral-500 max-w-sm mb-8 leading-relaxed text-sm">
                                No transactions match your current filters. Try changing tabs or date range.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="bg-white border border-slate-200 dark:bg-neutral-900/50 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Voucher #</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Party / Payee</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider text-right">Amount</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                                    {filtered.map((p: any) => {
                                        const meta = p.metadata as any;
                                        const isVendor = !!p.partner_id || (meta?.allocations && meta.allocations.length > 0);
                                        const typeLabel = isVendor ? 'Vendor Payment' : (meta?.category_name || 'Expense');

                                        return (
                                            <motion.tr
                                                key={p.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-neutral-300">
                                                    {safeFormat(p.date || p.created_at, 'dd MMM yyyy')}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-mono text-slate-500 dark:text-neutral-500">
                                                    {p.payment_number}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-bold border",
                                                            isVendor ? "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
                                                                : "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20")}>
                                                            {isVendor ? <Building2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                                        </div>
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {p.partner_name || meta?.payee_name || 'Cash Expense'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide",
                                                        isVendor ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                                                            : "bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-neutral-400")}>
                                                        {typeLabel}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white font-mono">
                                                    ₹{Number(p.amount).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={cn("px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider", p.posted ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" : "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400")}>
                                                        {p.posted ? 'Posted' : 'Draft'}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function StatCard({ title, value, subtext, icon: Icon, color }: any) {
    const colorClasses = {
        teal: "bg-teal-500/10 text-teal-500 border-teal-500/20",
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    }[color as 'teal' | 'blue' | 'amber'] || "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";

    return (
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-500 mt-1">{title}</p>
                </div>
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center border", colorClasses)}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <p className="text-[10px] font-medium text-slate-400 dark:text-neutral-600 uppercase tracking-widest">
                {subtext}
            </p>
        </div>
    );
}

function TabButton({ active, onClick, label, icon: Icon }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all border",
                active
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-black dark:border-white shadow-md transform scale-105"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-transparent dark:text-neutral-400 dark:border-white/10 dark:hover:bg-white/5"
            )}
        >
            <Icon className="h-4 w-4" />
            {label}
        </button>
    )
}
