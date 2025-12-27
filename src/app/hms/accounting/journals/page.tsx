'use client';

import { useEffect, useState } from 'react';
import { getJournalEntries } from '@/app/actions/accounting/journals';
import {
    Plus, Search, CheckCircle2, CircleDashed,
    FileText, BookOpen, TrendingUp, ArrowRightLeft,
    Calendar, Layers
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function JournalsPage() {
    const [entries, setEntries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setIsLoading(true);
        const res = await getJournalEntries();
        if (res?.success) {
            setEntries(res.data || []);
        }
        setIsLoading(false);
    }

    const filtered = entries.filter(e =>
        e.ref?.toLowerCase().includes(search.toLowerCase()) ||
        e.journal_entry_lines?.some((l: any) =>
            l.description?.toLowerCase().includes(search.toLowerCase()) ||
            l.accounts?.name?.toLowerCase().includes(search.toLowerCase())
        )
    );

    const totalVolume = filtered.reduce((sum, e) => {
        const entryTotal = e.journal_entry_lines?.reduce((ls: number, line: any) => ls + Number(line.debit || 0), 0);
        return sum + entryTotal;
    }, 0);

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
        <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 font-sans relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

            {/* Header */}
            <div className="border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-sm">
                                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            General Ledger
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-neutral-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search ledger..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-neutral-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 w-64 transition-all shadow-sm"
                            />
                        </div>

                        <button className="h-10 px-5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                            <Plus className="h-4 w-4" />
                            <span>New Journal Entry</span>
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
                                title="Ledger Volume"
                                value={`₹${totalVolume.toLocaleString('en-IN')}`}
                                subtext="Total transactions processed"
                                icon={TrendingUp}
                                color="indigo"
                            />
                            <StatCard
                                title="Active Accounts"
                                value={new Set(filtered.flatMap(e => e.journal_entry_lines?.map((l: any) => l.account_id))).size}
                                subtext="Unique GL codes used"
                                icon={Layers}
                                color="purple"
                            />
                            <StatCard
                                title="Reconciled"
                                value={filtered.filter(e => e.posted).length}
                                subtext="Balanced & verified"
                                icon={CheckCircle2}
                                color="emerald"
                            />
                        </motion.div>
                    )}

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white dark:bg-neutral-900/40 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                            <div className="h-12 w-12 border-4 border-slate-200 dark:border-neutral-800 border-t-indigo-500 rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-slate-500 dark:text-neutral-500 animate-pulse">Scanning ledger partitions...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-neutral-900/20 p-24 flex flex-col items-center text-center"
                        >
                            <div className="h-24 w-24 rounded-3xl bg-white dark:bg-neutral-800 flex items-center justify-center mb-6 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
                                <BookOpen className="h-10 w-10 text-slate-400 dark:text-neutral-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">No Journal Entries</h3>
                            <p className="text-slate-500 dark:text-neutral-500 max-w-sm mb-8 leading-relaxed text-sm">
                                The general ledger is currently empty. Transactions will appear here once invoices or payments are posted.
                            </p>
                            <button
                                onClick={() => loadData()}
                                className="h-11 px-8 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all font-bold rounded-xl text-sm"
                            >
                                Refresh Ledger
                            </button>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((entry: any) => (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all group"
                                >
                                    {/* Entry Header */}
                                    <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black uppercase tracking-widest text-neutral-500">Reference</span>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{entry.ref || 'UNREFERENCED'}</span>
                                            </div>
                                            <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black uppercase tracking-widest text-neutral-500">Date</span>
                                                <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">{safeFormat(entry.date, 'MMMM dd, yyyy')}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                entry.posted
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            )}>
                                                {entry.posted ? 'Posted' : 'Draft'}
                                            </span>
                                            <button className="p-2 hover:bg-white dark:hover:bg-white/5 rounded-lg transition-colors overflow-hidden">
                                                <ArrowRightLeft className="h-4 w-4 text-neutral-500" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Entry Lines */}
                                    <div className="p-0">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                                                    <th className="px-6 py-3">Account</th>
                                                    <th className="px-6 py-3">Description</th>
                                                    <th className="px-6 py-3 text-right">Debit</th>
                                                    <th className="px-6 py-3 text-right">Credit</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                                {entry.journal_entry_lines?.map((line: any) => (
                                                    <tr key={line.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-slate-900 dark:text-neutral-200">{line.accounts?.name}</span>
                                                                <span className="text-[10px] font-mono text-neutral-500">{line.accounts?.code}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-neutral-500 italic">
                                                            {line.description || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            {Number(line.debit) > 0 && (
                                                                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">₹{Number(line.debit).toLocaleString()}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            {Number(line.credit) > 0 && (
                                                                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{Number(line.credit).toLocaleString()}</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function StatCard({ title, value, subtext, icon: Icon, color }: any) {
    const colorClasses = {
        indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-indigo-900/10",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-purple-900/10",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-900/10",
    }[color as 'indigo' | 'purple' | 'emerald'] || "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";

    return (
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden group hover:border-indigo-500/20 transition-all">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/[0.02] transform translate-x-8 -translate-y-8 rounded-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</h3>
                </div>
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border transition-all", colorClasses)}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                {subtext}
            </p>
        </div>
    );
}
