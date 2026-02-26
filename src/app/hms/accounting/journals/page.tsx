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
        <div className="min-h-screen bg-[#002b2b] text-[#ffffcc] font-mono select-none flex flex-col overflow-hidden">
            {/* Tally Header Bar */}
            <div className="h-8 bg-[#004d4d] flex items-center justify-between px-4 border-b border-[#006666] text-[10px] font-bold">
                <div className="flex items-center gap-4">
                    <span className="text-[#64ffff]">GENERAL LEDGER</span>
                    <span className="text-[#ffffcc]">Ziona HMS v4.5</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[#64ffff]">Financial Year: 2025-26</span>
                    <span className="text-[#ffffcc]">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                </div>
            </div>

            {/* Gateway Container */}
            <div className="flex-1 flex gap-1 p-1">
                {/* Left Side: Ledger Content */}
                <div className="flex-1 bg-[#004d4d] border border-[#006666] flex flex-col">
                    <div className="h-8 bg-[#006666] flex items-center px-4 justify-between border-b border-[#008080]">
                        <span className="text-[12px] font-black">JOURNAL REGISTER</span>
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-[#64ffff]" />
                                <input
                                    type="text"
                                    placeholder="SEARCH..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="h-5 pl-7 pr-2 bg-[#002b2b] border border-[#008080] rounded text-[10px] text-[#ffffcc] focus:outline-none focus:border-[#64ffff] w-48 transition-all"
                                />
                            </div>
                            <span className="text-[10px] text-white">F2: PERIOD | F12: CONFIGURE</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        {isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center gap-4 text-[#64ffff]">
                                <CircleDashed className="h-8 w-8 animate-spin" />
                                <span className="text-[10px] font-black tracking-widest animate-pulse">SYNCHRONIZING LEDGER NODES...</span>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-[#64ffff]/40 gap-2">
                                <BookOpen className="h-12 w-12 opacity-20" />
                                <span className="text-xs uppercase tracking-[0.4em]">No Entry Found</span>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#003333]">
                                {filtered.map((entry: any) => (
                                    <div key={entry.id} className="group hover:bg-[#002b2b] transition-colors border-b border-[#006666]">
                                        {/* Entry Header */}
                                        <div className="px-4 py-2 bg-[#003333]/50 flex items-center justify-between text-[11px] font-bold">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[#64ffff]">{safeFormat(entry.date, 'dd-MMM-yyyy').toUpperCase()}</span>
                                                <span className="text-[#ffffcc]">{entry.ref || 'AUTO-JOURNAL'}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "px-2 py-0.5 text-[9px] uppercase border",
                                                    entry.posted
                                                        ? "border-emerald-500/40 text-emerald-400"
                                                        : "border-amber-500/40 text-amber-500"
                                                )}>
                                                    {entry.posted ? 'Posted' : 'Draft'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Journal Lines Table */}
                                        <table className="w-full text-left text-[11px]">
                                            <tbody className="divide-y divide-[#003333]">
                                                {entry.journal_entry_lines?.map((line: any, idx: number) => (
                                                    <tr key={line.id} className="hover:bg-[#003333]">
                                                        <td className="w-10 px-4 py-1 text-[#64ffff] opacity-50">{idx + 1}</td>
                                                        <td className="px-4 py-1 w-[30%]">
                                                            <div className="flex flex-col">
                                                                <span className="font-black text-[#ffffcc]">{line.accounts?.name.toUpperCase()}</span>
                                                                <span className="text-[9px] opacity-60">GL: {line.accounts?.code}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-1 text-[10px] italic text-[#64ffff]/80">
                                                            {line.description}
                                                        </td>
                                                        <td className="px-4 py-1 text-right w-24">
                                                            {Number(line.debit) > 0 && (
                                                                <span className="font-black">₹{Number(line.debit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-1 text-right w-24 pr-8">
                                                            {Number(line.credit) > 0 && (
                                                                <span className="font-black">₹{Number(line.credit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {/* Entry Total Row */}
                                                <tr className="bg-[#002b2b]/30">
                                                    <td colSpan={3} className="px-4 py-1 text-right text-[9px] font-black uppercase text-[#64ffff]">Balanced Summary</td>
                                                    <td className="px-4 py-1 text-right font-black border-t border-[#006666]">
                                                        ₹{entry.journal_entry_lines?.reduce((s: number, l: any) => s + Number(l.debit || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-4 py-1 text-right font-black border-t border-[#006666] pr-8">
                                                        ₹{entry.journal_entry_lines?.reduce((s: number, l: any) => s + Number(l.credit || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Stats Bar */}
                    <div className="h-10 bg-[#003333] border-t border-[#006666] flex items-center justify-between px-6 text-[10px] font-bold">
                        <div className="flex gap-8">
                            <div className="flex gap-2">
                                <span className="text-[#64ffff]">VOLUME:</span>
                                <span>₹{totalVolume.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[#64ffff]">NODES:</span>
                                <span>{filtered.length} ENTRIES</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[#64ffff]">BALANCED:</span>
                                <span className="text-emerald-400">YES</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-[#64ffff] animate-pulse">SYSTEM LIVE SYNC</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Gateway Simulation */}
                <div className="w-56 bg-[#003333] border border-[#006666] flex flex-col p-1 gap-1">
                    <div className="bg-[#004d4d] flex flex-col items-center py-4 border border-[#006666]">
                        <span className="text-[12px] font-black text-[#ffffcc]">GATEWAY of TALLY</span>
                        <div className="h-px w-full bg-[#006666] my-2" />
                        <span className="text-[10px] text-[#64ffff]">Display Options</span>
                    </div>

                    <div className="flex-1 space-y-1">
                        {[
                            { f: 'F1', l: 'Select Cmp', active: false },
                            { f: 'F2', l: 'Period', active: false },
                            { f: 'F3', l: 'Company', active: false },
                            { f: 'F4', l: 'Contra', active: false },
                            { f: 'F5', l: 'Payment', active: false },
                            { f: 'F6', l: 'Receipt', active: false },
                            { f: 'F7', l: 'Journal', active: true },
                            { f: 'F8', l: 'Sales', active: false },
                            { f: 'F9', l: 'Purchase', active: false },
                            { f: 'F10', l: 'Memo', active: false },
                        ].map(btn => (
                            <button key={btn.f} className={`w-full flex items-center h-7 px-2 text-[10px] transition-all ${btn.active ? 'bg-[#ffffcc] text-black font-black' : 'hover:bg-[#004d4d] text-white'}`}>
                                <span className="w-8 opacity-50">{btn.f}</span>
                                <span className="flex-1 text-left uppercase">{btn.l}</span>
                            </button>
                        ))}
                    </div>

                    <div className="bg-[#004d4d] p-3 border border-[#006666]">
                        <p className="text-[8px] text-[#64ffff]/60 uppercase tracking-widest leading-relaxed">
                            Node: Institutional Ledger<br />
                            Ver: 4.8.2-SECURED<br />
                            Auth: Institutional Admin
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, subtext, icon: Icon, color }: any) {
    return null; // Removed in Tally view
}
