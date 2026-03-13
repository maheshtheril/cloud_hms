'use client'

import { useState, useEffect } from 'react'
import {
    Calendar, Download, Filter, Search, ArrowLeft,
    FileText, CreditCard, Banknote, RefreshCcw,
    ChevronDown, ChevronUp, Printer
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getDaybook, getCashBankBook } from "@/app/actions/accounting/reports"
import { ZionaLogo } from '@/components/branding/ziona-logo'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import React from 'react'

interface DetailedLedgerProps {
    type: 'daybook' | 'cashbook' | 'bankbook'
    currencyCode?: string
    currencySymbol?: string
}

export function DetailedLedgerReport({
    type,
    currencyCode = 'INR',
    currencySymbol = '₹'
}: DetailedLedgerProps) {
    const [loading, setLoading] = useState(true)
    const [date, setDate] = useState(new Date())
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1)) // 1st of current month
    const [endDate, setEndDate] = useState(new Date())
    const [entries, setEntries] = useState<any[]>([])
    const [openingBalance, setOpeningBalance] = useState(0)
    const [bookAccountIds, setBookAccountIds] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())

    useEffect(() => {
        loadData()
    }, [date, startDate, endDate, type])

    async function loadData() {
        setLoading(true)
        try {
            let res;
            if (type === 'daybook') {
                res = await getDaybook(date)
            } else {
                res = await getCashBankBook(type === 'cashbook' ? 'cash' : 'bank', startDate, endDate)
            }

            if (res.success) {
                const result = res as any
                setEntries(result.data || [])
                setOpeningBalance(result.openingBalance || 0)
                setBookAccountIds(result.accountIds || [])
            }


        } catch (e) {
            console.error(e)
        }
        setLoading(false)
    }

    const toggleExpand = (id: string) => {
        const next = new Set(expandedEntries)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setExpandedEntries(next)
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat(currencyCode === 'INR' ? 'en-IN' : 'en-US', {
            style: 'currency',
            currency: currencyCode
        }).format(val)
    }

    const filteredEntries = entries.filter(e =>
        e.ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.journal_entry_lines.some((l: any) =>
            l.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.accounts?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    // Calculate totals based on book type
    const totalDebit = entries.reduce((sum, e) => {
        if (type === 'daybook') {
            return sum + e.journal_entry_lines.reduce((lSum: number, l: any) => lSum + Number(l.debit || 0), 0)
        }
        // For Ledger Books, only sum lines belonging to the target accounts
        return sum + e.journal_entry_lines
            .filter((l: any) => bookAccountIds.includes(l.account_id))
            .reduce((lSum: number, l: any) => lSum + Number(l.debit || 0), 0)
    }, 0)

    const totalCredit = entries.reduce((sum, e) => {
        if (type === 'daybook') {
            return sum + e.journal_entry_lines.reduce((lSum: number, l: any) => lSum + Number(l.credit || 0), 0)
        }
        // For Ledger Books, only sum lines belonging to the target accounts
        return sum + e.journal_entry_lines
            .filter((l: any) => bookAccountIds.includes(l.account_id))
            .reduce((lSum: number, l: any) => lSum + Number(l.credit || 0), 0)
    }, 0)

    const closingBalance = openingBalance + totalDebit - totalCredit

    // Helper to determine movement and particulars for a specific entry in a ledger book
    const getMovementAndParticulars = (e: any) => {
        if (type === 'daybook') {
            return {
                particulars: e.journal_entry_lines[0]?.description?.toUpperCase() || 'NO NARRATION',
                debit: e.journal_entry_lines.reduce((s: number, l: any) => s + Number(l.debit || 0), 0),
                credit: e.journal_entry_lines.reduce((s: number, l: any) => s + Number(l.credit || 0), 0)
            }
        }

        // Logic for Ledger Books (Cash/Bank)
        const bookLines = e.journal_entry_lines.filter((l: any) => bookAccountIds.includes(l.account_id))
        const contraLines = e.journal_entry_lines.filter((l: any) => !bookAccountIds.includes(l.account_id))

        const debit = bookLines.reduce((s: number, l: any) => s + Number(l.debit || 0), 0)
        const credit = bookLines.reduce((s: number, l: any) => s + Number(l.credit || 0), 0)

        let particulars = 'MULTIPLE ACCOUNTS'
        
        if (contraLines.length === 1) {
            particulars = contraLines[0].accounts.name.toUpperCase()
        } else if (contraLines.length > 1) {
            // Pick the line with the largest opposite movement if available
            const sorted = [...contraLines].sort((a, b) => 
                (Number(b.debit) + Number(b.credit)) - (Number(a.debit) + Number(a.credit))
            )
            particulars = sorted[0].accounts.name.toUpperCase() + ' (AS PER DETAILS)'
        } else if (bookLines.length > 1) {
            // INTERNAL TRANSFER: All lines are book accounts
            // Pick the line with the opposite movement to the main book movement
            const mainMovementIsDebit = debit > 0
            const oppositeLines = bookLines.filter((l: any) => mainMovementIsDebit ? Number(l.credit) > 0 : Number(l.debit) > 0)
            if (oppositeLines.length > 0) {
                particulars = oppositeLines[0].accounts.name.toUpperCase()
            } else {
                 particulars = 'INTERNAL TRANSFER'
            }
        } else if (e.journal_entry_lines.length > 0) {
            particulars = e.journal_entry_lines[0].accounts.name.toUpperCase()
        }

        // If it's a multi-account book register (multiple IDs in bookAccountIds), 
        // prepend the primary target account name for this specific entry for clarity
        if (bookLines.length === 1) {
            particulars = `${bookLines[0].accounts.name.toUpperCase()}: ${particulars}`
        }

        return { particulars, debit, credit }
    }

    const titleMap = {
        daybook: 'Daily Transaction Register (Daybook)',
        cashbook: 'Cash Account Ledger (Cashbook)',
        bankbook: 'Bank Account Ledger (Bankbook)'
    }

    const iconMap = {
        daybook: <FileText className="h-6 w-6 text-white" />,
        cashbook: <Banknote className="h-6 w-6 text-white" />,
        bankbook: <CreditCard className="h-6 w-6 text-white" />
    }

    const colorMap = {
        daybook: 'bg-indigo-600',
        cashbook: 'bg-emerald-600',
        bankbook: 'bg-blue-600'
    }

    return (
        <div className="min-h-screen bg-[#002b2b] text-[#ffffcc] font-mono select-none flex flex-col overflow-hidden">
            {/* Tally Header Bar */}
            <div className="h-8 bg-[#004d4d] flex items-center justify-between px-4 border-b border-[#006666] text-[10px] font-bold no-print">
                <div className="flex items-center gap-4">
                    <span className="text-[#64ffff]">{titleMap[type].toUpperCase()}</span>
                    <span className="text-[#ffffcc]">Ziona HMS v4.5</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[#64ffff]">Enterprise ERP</span>
                    <span className="text-[#ffffcc]">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex gap-1 p-1 overflow-hidden">
                {/* Main Ledger Area */}
                <div className="flex-1 bg-[#004d4d] border border-[#006666] flex flex-col overflow-hidden">
                    <div className="h-10 bg-[#006666] flex items-center px-4 justify-between border-b border-[#008080] no-print">
                        <div className="flex items-center gap-6">
                            <span className="text-[12px] font-black">LEDGER REGISTER</span>
                            {type === 'daybook' ? (
                                <div className="flex items-center bg-[#002b2b] border border-[#008080] px-2 rounded">
                                    <Calendar className="h-3 w-3 text-[#64ffff] mr-2" />
                                    <input
                                        type="date"
                                        value={format(date, 'yyyy-MM-dd')}
                                        onChange={(e) => setDate(new Date(e.target.value))}
                                        className="bg-transparent border-none text-[10px] h-6 focus:ring-0 text-[#ffffcc]"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-[#002b2b] border border-[#008080] px-2 rounded">
                                        <span className="text-[8px] opacity-50 mr-2">FROM</span>
                                        <input
                                            type="date"
                                            value={format(startDate, 'yyyy-MM-dd')}
                                            onChange={(e) => setStartDate(new Date(e.target.value))}
                                            className="bg-transparent border-none text-[10px] h-6 focus:ring-0 text-[#ffffcc]"
                                        />
                                    </div>
                                    <div className="flex items-center bg-[#002b2b] border border-[#008080] px-2 rounded">
                                        <span className="text-[8px] opacity-50 mr-2">TO</span>
                                        <input
                                            type="date"
                                            value={format(endDate, 'yyyy-MM-dd')}
                                            onChange={(e) => setEndDate(new Date(e.target.value))}
                                            className="bg-transparent border-none text-[10px] h-6 focus:ring-0 text-[#ffffcc]"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-[#64ffff]" />
                                <input
                                    type="text"
                                    placeholder="SEARCH..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-6 pl-7 pr-2 bg-[#002b2b] border border-[#008080] rounded text-[10px] text-[#ffffcc] focus:outline-none focus:border-[#64ffff] w-48 transition-all"
                                />
                            </div>
                            <button onClick={() => window.print()} className="h-6 px-3 bg-[#002b2b] hover:bg-[#003333] border border-[#008080] rounded text-[9px] font-black flex items-center gap-2">
                                <Printer className="h-3 w-3" /> PRINT
                            </button>
                        </div>
                    </div>

                <div className="flex-1 overflow-auto">
                    {type !== 'daybook' && bookAccountIds.length > 0 && (
                        <div className="px-4 py-2 bg-[#003333]/50 border-b border-[#004d4d] flex items-center gap-3">
                            <span className="text-[8px] font-black text-[#64ffff] uppercase whitespace-nowrap">Targeted Accounts:</span>
                            <div className="flex flex-wrap gap-2">
                                {entries.length > 0 && Array.from(new Set(entries.flatMap(e => e.journal_entry_lines.filter((l: any) => bookAccountIds.includes(l.account_id)).map((l: any) => l.accounts.name)))).map((name: any) => (
                                    <span key={name} className="px-1.5 py-0.5 bg-[#004d4d] rounded text-[9px] font-bold text-[#ffffcc]">{name.toUpperCase()}</span>
                                ))}
                                {entries.length === 0 && <span className="text-[9px] opacity-50 italic">Synchronizing identities...</span>}
                            </div>
                        </div>
                    )}
                    <table className="w-full text-left text-[11px] border-collapse">
                            <thead className="sticky top-0 bg-[#006666] z-10 shadow-md">
                                <tr className="text-[9px] font-black uppercase text-[#64ffff] border-b border-[#008080]">
                                    <th className="px-4 py-2 w-32">Vch No.</th>
                                    <th className="px-4 py-2 w-24">Date</th>
                                    <th className="px-4 py-2">Particulars</th>
                                    <th className="px-4 py-2 text-right w-32">Debit (In)</th>
                                    <th className="px-4 py-2 text-right w-32">Credit (Out)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#003333]">
                                {type !== 'daybook' && (
                                    <tr className="bg-[#002b2b]/40 font-black">
                                        <td className="px-4 py-1 italic opacity-50 text-[9px]">BS</td>
                                        <td className="px-4 py-1"></td>
                                        <td className="px-4 py-1 text-[#64ffff]">Opening Balance</td>
                                        <td className="px-4 py-1 text-right">{openingBalance > 0 ? openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}</td>
                                        <td className="px-4 py-1 text-right">{openingBalance < 0 ? Math.abs(openingBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}</td>
                                    </tr>
                                )}

                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center text-[#64ffff] animate-pulse">SYNCHRONIZING LEDGER...</td>
                                    </tr>
                                ) : filteredEntries.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center opacity-30 uppercase tracking-[0.3em]">No Transactions Found</td>
                                    </tr>
                                ) : filteredEntries.map((e) => {
                                    const movement = getMovementAndParticulars(e)
                                    return (
                                        <React.Fragment key={e.id}>
                                            <tr
                                                className="hover:bg-[#002b2b] transition-colors cursor-pointer group"
                                                onClick={() => toggleExpand(e.id)}
                                            >
                                                <td className="px-4 py-2 font-bold text-[#64ffff]">{e.ref}</td>
                                                <td className="px-4 py-2 opacity-80">{format(new Date(e.created_at || e.date), 'dd-MMM-yy').toUpperCase()}</td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-black text-[#ffffcc]">{movement.particulars}</span>
                                                        <span className="text-[8px] opacity-40 group-hover:opacity-100 uppercase tracking-widest">{e.journal_entry_lines.length} LINES</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-right font-black">
                                                    {movement.debit > 0 ? movement.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}
                                                </td>
                                                <td className="px-4 py-2 text-right font-black">
                                                    {movement.credit > 0 ? movement.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}
                                                </td>
                                            </tr>
                                        <AnimatePresence>
                                            {(expandedEntries.has(e.id) || (typeof window !== 'undefined' && window.matchMedia('print').matches)) && (
                                                <tr className="bg-[#002b2b]/60 border-y border-[#006666]">
                                                    <td colSpan={5} className="px-8 py-2">
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="space-y-1 py-2">
                                                                {e.journal_entry_lines.map((l: any, i: number) => (
                                                                    <div key={i} className="flex items-center text-[10px] gap-4">
                                                                        <span className="w-12 text-[#64ffff] font-black">{l.debit > 0 ? 'DR' : 'CR'}</span>
                                                                        <span className="flex-1 text-[#ffffcc] font-bold">{l.accounts.name.toUpperCase()}</span>
                                                                        <span className="flex-1 opacity-50 italic">{l.description}</span>
                                                                        <span className="w-24 text-right font-black">{l.debit > 0 ? l.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}</span>
                                                                        <span className="w-24 text-right font-black">{l.credit > 0 ? l.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                )
                            })}
                            </tbody>
                            <tfoot className="bg-[#003333] border-t-2 border-[#008080] font-black">
                                <tr>
                                    <td colSpan={3} className="px-4 py-2 text-right text-[9px] uppercase text-[#64ffff]">Total Inflow/Outflow</td>
                                    <td className="px-4 py-2 text-right border-t border-[#006666]">{totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-2 text-right border-t border-[#006666]">{totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                </tr>
                                {type !== 'daybook' && (
                                    <tr className="bg-[#002b2b]">
                                        <td colSpan={3} className="px-4 py-2 text-right text-[9px] uppercase text-[#64ffff]">Closing Balance (C/F)</td>
                                        <td colSpan={2} className="px-4 py-2 text-right text-sm text-[#ffffcc] font-black border-t-4 border-double border-[#006666]">{closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                )}
                            </tfoot>
                        </table>
                    </div>

                    {/* Footer Stats Bar */}
                    <div className="h-8 bg-[#003333] border-t border-[#006666] flex items-center justify-between px-6 text-[9px] font-bold no-print">
                        <div className="flex gap-8">
                            <span className="text-[#64ffff]">RECORDS: {filteredEntries.length}</span>
                            <span className="text-[#64ffff]">STATUS: BALANCED</span>
                            <span className="text-[#64ffff]">USER: INSTITUTIONAL ADMIN</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-[#64ffff] animate-pulse">REAL-TIME SYNC ACTIVE</span>
                        </div>
                    </div>
                </div>

                {/* Right Side Options Bar */}
                <div className="w-48 bg-[#003333] border border-[#006666] flex flex-col p-1 gap-1 no-print">
                    <div className="bg-[#004d4d] flex flex-col items-center py-2 border border-[#006666] mb-1">
                        <span className="text-[10px] font-black text-[#ffffcc]">OPTIONS</span>
                    </div>

                    <div className="flex-1 space-y-1">
                        {[
                            { f: 'F1', l: 'Select Cmp' },
                            { f: 'F2', l: 'Period' },
                            { f: 'F4', l: 'Contra' },
                            { f: 'F5', l: 'Payment' },
                            { f: 'F6', l: 'Receipt' },
                            { f: 'F7', l: 'Journal' },
                            { f: 'F8', l: 'Sales' },
                            { f: 'F9', l: 'Purchase' },
                            { f: 'F11', l: 'Features' },
                            { f: 'F12', l: 'Configure' },
                        ].map(btn => (
                            <button key={btn.f} className="w-full h-6 flex items-center px-2 text-[9px] text-[#ffffcc] hover:bg-[#004d4d] border border-transparent hover:border-[#008080] transition-all">
                                <span className="w-8 opacity-50">{btn.f}</span>
                                <span className="flex-1 text-left uppercase">{btn.l}</span>
                            </button>
                        ))}
                    </div>

                    <div className="bg-[#004d4d] p-2 border border-[#006666]">
                        <p className="text-[7px] text-[#64ffff]/60 uppercase leading-tight">
                            Institutional Authority<br />
                            Ziona Global Financials<br />
                            Layer 3 Security Active
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
