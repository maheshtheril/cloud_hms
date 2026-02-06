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
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import React from 'react'

interface DetailedLedgerProps {
    type: 'daybook' | 'cashbook' | 'bankbook'
}

export function DetailedLedgerReport({ type }: DetailedLedgerProps) {
    const [loading, setLoading] = useState(true)
    const [date, setDate] = useState(new Date())
    const [entries, setEntries] = useState<any[]>([])
    const [openingBalance, setOpeningBalance] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())

    useEffect(() => {
        loadData()
    }, [date, type])

    async function loadData() {
        setLoading(true)
        try {
            let res;
            if (type === 'daybook') {
                res = await getDaybook(date)
            } else {
                res = await getCashBankBook(type === 'cashbook' ? 'cash' : 'bank', date)
            }

            if (res.success) {
                const result = res as any
                setEntries(result.data || [])
                setOpeningBalance(result.openingBalance || 0)
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
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(val)
    }

    const filteredEntries = entries.filter(e =>
        e.ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.journal_entry_lines.some((l: any) =>
            l.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.accounts.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    // Calculate totals for the day's entries
    const totalDebit = entries.reduce((sum, e) => {
        return sum + e.journal_entry_lines.reduce((lSum: number, l: any) => lSum + Number(l.debit || 0), 0)
    }, 0)

    const totalCredit = entries.reduce((sum, e) => {
        return sum + e.journal_entry_lines.reduce((lSum: number, l: any) => lSum + Number(l.credit || 0), 0)
    }, 0)

    const closingBalance = openingBalance + totalDebit - totalCredit

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
        <div className="space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl no-print">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 ${colorMap[type]} rounded-2xl shadow-lg`}>
                            {iconMap[type]}
                        </div>
                        <Badge variant="outline" className="uppercase tracking-widest text-[10px] font-bold border-slate-200">Accounting Oversight</Badge>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{titleMap[type]}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Audit-ready transaction recording & verification</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        <input
                            type="date"
                            value={format(date, 'yyyy-MM-dd')}
                            onChange={(e) => setDate(new Date(e.target.value))}
                            className="bg-transparent border-none text-sm font-bold px-4 py-2 focus:ring-0 dark:text-white"
                        />
                    </div>
                    <Button variant="outline" className="rounded-xl h-11 border-slate-200 dark:border-slate-800" onClick={() => window.print()}>
                        <Printer className="h-4 w-4 mr-2" /> Print PDF
                    </Button>
                    <Button className="rounded-xl h-11 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90" onClick={loadData}>
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                </div>
            </div>

            {/* Print Header (Visible only when printing) */}
            <div className="hidden print:block text-center mb-8 border-b-2 pb-4">
                <h1 className="text-2xl font-bold">{titleMap[type]}</h1>
                <p className="text-sm">Date: {format(date, 'PPP')}</p>
            </div>

            {/* Summary Cards (Only for Cash/Bank) */}
            {type !== 'daybook' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-3xl border-none shadow-lg bg-white dark:bg-slate-900 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-300 dark:bg-slate-700" />
                        <CardHeader className="p-6 pb-2">
                            <CardDescription className="uppercase text-[10px] font-black tracking-widest text-slate-400">Opening Balance</CardDescription>
                            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(openingBalance)}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="rounded-3xl border-none shadow-lg bg-white dark:bg-slate-900 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                        <CardHeader className="p-6 pb-2">
                            <CardDescription className="uppercase text-[10px] font-black tracking-widest text-emerald-500">Today's Inflow (Debits)</CardDescription>
                            <CardTitle className="text-2xl font-black text-emerald-600">{formatCurrency(totalDebit)}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="rounded-3xl border-none shadow-lg bg-white dark:bg-slate-900 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                        <CardHeader className="p-6 pb-2">
                            <CardDescription className="uppercase text-[10px] font-black tracking-widest text-rose-500">Today's Outflow (Credits)</CardDescription>
                            <CardTitle className="text-2xl font-black text-rose-600">{formatCurrency(totalCredit)}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            )}

            {/* Main Ledger Table */}
            <Card className="rounded-[2rem] border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-row items-center justify-between gap-4 no-print">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by Ref or Description..."
                            className="pl-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-none h-11 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-4 w-32 whitespace-nowrap">Voucher No</th>
                                    <th className="px-4 py-4 w-32 whitespace-nowrap">Time</th>
                                    <th className="px-4 py-4 whitespace-nowrap">Transaction Details</th>
                                    <th className="px-4 py-4 w-40 text-right whitespace-nowrap">Debit (In)</th>
                                    <th className="px-8 py-4 w-40 text-right whitespace-nowrap">Credit (Out)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center">
                                            <RefreshCcw className="h-10 w-10 animate-spin text-indigo-200 mx-auto mb-4" />
                                            <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">Reconstructing ledger state...</p>
                                        </td>
                                    </tr>
                                ) : filteredEntries.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center">
                                            <FileText className="h-12 w-12 text-slate-100 dark:text-slate-800 mx-auto mb-4" />
                                            <p className="text-slate-400 dark:text-slate-500 font-medium italic">No transactions recorded for this period</p>
                                        </td>
                                    </tr>
                                ) : filteredEntries.map((e) => (
                                    <React.Fragment key={e.id}>
                                        <tr
                                            className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-pointer border-b last:border-0 border-slate-50 dark:border-slate-800/50"
                                            onClick={() => toggleExpand(e.id)}
                                        >
                                            <td className="px-8 py-6">
                                                <Badge variant="outline" className="font-mono text-[11px] px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200">{e.ref}</Badge>
                                            </td>
                                            <td className="px-4 py-6 text-sm font-medium text-slate-500 whitespace-nowrap">
                                                {format(new Date(e.created_at || e.date), 'hh:mm aa')}
                                            </td>
                                            <td className="px-4 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-900 dark:text-white text-sm line-clamp-1">{e.journal_entry_lines[0]?.description || 'No description'}</span>
                                                    <div className="flex items-center gap-2 mt-1 no-print">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {e.journal_entry_lines.length} lines detected
                                                        </span>
                                                        {expandedEntries.has(e.id) ? <ChevronUp className="h-3 w-3 text-slate-400" /> : <ChevronDown className="h-3 w-3 text-slate-400" />}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-6 text-right font-black text-slate-900 dark:text-white">
                                                {e.journal_entry_lines.reduce((s: number, l: any) => s + Number(l.debit || 0), 0) > 0 ? (
                                                    formatCurrency(e.journal_entry_lines.reduce((s: number, l: any) => s + Number(l.debit || 0), 0))
                                                ) : '-'}
                                            </td>
                                            <td className="px-8 py-6 text-right font-black text-slate-900 dark:text-white">
                                                {e.journal_entry_lines.reduce((s: number, l: any) => s + Number(l.credit || 0), 0) > 0 ? (
                                                    formatCurrency(e.journal_entry_lines.reduce((s: number, l: any) => s + Number(l.credit || 0), 0))
                                                ) : '-'}
                                            </td>
                                        </tr>
                                        <AnimatePresence>
                                            {(expandedEntries.has(e.id) || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
                                                <tr>
                                                    <td colSpan={5} className="bg-slate-50/50 dark:bg-slate-900/50 p-8 pt-0 md:px-20">
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="border-t border-slate-100 dark:border-slate-800 py-6"
                                                        >
                                                            <div className="grid grid-cols-1 gap-4">
                                                                {e.journal_entry_lines.map((l: any, i: number) => (
                                                                    <div key={i} className="flex items-center justify-between text-xs group/line">
                                                                        <div className="flex items-center gap-6">
                                                                            <span className={`font-mono font-bold w-12 ${l.debit > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                                                {l.debit > 0 ? 'Debit' : 'Credit'}
                                                                            </span>
                                                                            <span className="font-bold text-slate-700 dark:text-slate-200 w-64">{l.accounts.name}</span>
                                                                            <span className="text-slate-400 italic hidden md:inline">{l.description}</span>
                                                                        </div>
                                                                        <div className="flex gap-8">
                                                                            <span className="w-24 text-right font-black text-slate-900 dark:text-slate-200">{l.debit > 0 ? formatCurrency(l.debit) : ''}</span>
                                                                            <span className="w-24 text-right font-black text-slate-900 dark:text-slate-200">{l.credit > 0 ? formatCurrency(l.credit) : ''}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-900 dark:bg-slate-950 text-white border-t-2 border-slate-800">
                                <tr className="font-black">
                                    <td colSpan={3} className="px-8 py-6 text-right uppercase text-[10px] tracking-widest text-slate-500">Total Movements</td>
                                    <td className="px-4 py-6 text-right text-lg">{formatCurrency(totalDebit)}</td>
                                    <td className="px-8 py-6 text-right text-lg">{formatCurrency(totalCredit)}</td>
                                </tr>
                                {type !== 'daybook' && (
                                    <tr className="bg-slate-950 border-t border-white/5">
                                        <td colSpan={3} className="px-8 py-4 text-right uppercase text-[10px] tracking-widest text-slate-500 font-black">Closing Balance (Carried Forward)</td>
                                        <td colSpan={2} className="px-8 py-4 text-right text-2xl font-black text-indigo-400">{formatCurrency(closingBalance)}</td>
                                    </tr>
                                )}
                            </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
