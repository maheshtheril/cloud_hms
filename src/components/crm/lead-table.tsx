'use client'

import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge" // Assuming you have a Badge component
import { formatCurrency } from '@/lib/currency'
import { formatDistanceToNow } from 'date-fns'
import { MoreHorizontal, Edit, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { deleteLead } from '@/app/actions/crm/leads'

interface LeadTableProps {
    data: any[]
    totalOrCount: number
    page: number
    limit: number
}

export function LeadTable({ data, totalOrCount, page, limit }: LeadTableProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const totalPages = Math.ceil(totalOrCount / limit)

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', newPage.toString())
        router.push(`?${params.toString()}`)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this lead?')) {
            await deleteLead(id)
        }
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-900/5 dark:bg-white/5 border-b border-white/10">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="w-[280px] font-bold text-slate-800 dark:text-slate-200 py-5">Identities & Entity</TableHead>
                            <TableHead className="font-bold text-slate-800 dark:text-slate-200">Point of Contact</TableHead>
                            <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-center">Assigned</TableHead>
                            <TableHead className="font-bold text-slate-800 dark:text-slate-200">Followup Date</TableHead>
                            <TableHead className="font-bold text-slate-800 dark:text-slate-200">Engagement & Sync</TableHead>
                            <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-right">Potential Value</TableHead>
                            <TableHead className="font-bold text-slate-800 dark:text-slate-200">Status & Stage</TableHead>
                            <TableHead className="font-bold text-slate-800 dark:text-slate-200">AI Score</TableHead>
                            <TableHead className="text-right pr-6 font-bold text-slate-800 dark:text-slate-200">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-40 text-center text-slate-500 text-lg italic">
                                    No potential growth opportunities found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((lead) => (
                                <TableRow key={lead.id} className="group border-b border-slate-200/50 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition-all duration-300">
                                    <TableCell className="py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => router.push(`/crm/leads/${lead.id}`)}>
                                                {lead.name}
                                                {lead.target_type && (
                                                    <span className="ml-2 text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 uppercase tracking-tighter align-middle">
                                                        {(lead.target_type as any).name}
                                                    </span>
                                                )}
                                            </span>
                                            {lead.company_name && (
                                                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-[10px] py-0 px-1.5 font-medium border-none text-slate-500 uppercase tracking-tighter">
                                                        {lead.company_name}
                                                    </Badge>
                                                    {lead.branch?.name && (
                                                        <Badge variant="outline" className="text-[9px] py-0 px-1.5 font-black border-slate-200 text-slate-400 uppercase tracking-tighter bg-transparent">
                                                            {lead.branch.name}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-slate-800 dark:text-slate-200 font-medium">{lead.contact_name || '-'}</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-tighter opacity-70">{lead.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-600 uppercase">
                                                {lead.owner?.name?.substring(0, 2) || lead.owner?.email?.substring(0, 2) || '?'}
                                            </div>
                                            <span className="text-[9px] mt-1 font-bold text-slate-500 uppercase tracking-tighter max-w-[80px] truncate">
                                                {lead.owner?.name || 'Unassigned'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {lead.next_followup_date ? (
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                                                    {formatDistanceToNow(new Date(lead.next_followup_date), { addSuffix: true })}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-mono">
                                                    {new Date(lead.next_followup_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ) : (
                                            <Badge variant="outline" className="text-[10px] opacity-40 uppercase font-bold border-slate-200">No Task</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-60" />
                                                Created {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                                            </div>
                                            <span className="text-[9px] text-slate-400 font-mono">
                                                {new Date(lead.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                                                {formatCurrency(Number(lead.estimated_value) || 0, lead.currency || 'INR')}
                                            </span>
                                            {lead.is_hot && (
                                                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3" /> Priority Lead
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`
                                            rounded-lg py-1 px-3 border-none shadow-sm font-bold uppercase tracking-wider text-[10px]
                                            ${lead.status === 'new' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : ''}
                                            ${lead.status === 'contacted' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : ''}
                                            ${lead.status === 'won' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
                                            ${lead.status === 'lost' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : ''}
                                        `}>
                                            {lead.stage?.name || lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-16 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-white/5">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)] ${(lead.lead_score || 0) > 70 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                                                        (lead.lead_score || 0) > 40 ? 'bg-gradient-to-r from-amber-500 to-orange-400' :
                                                            'bg-gradient-to-r from-rose-600 to-pink-500'
                                                        }`}
                                                    style={{ width: `${lead.lead_score || 0}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-black text-slate-700 dark:text-slate-300 tabular-nums">
                                                {lead.lead_score}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30" onClick={() => router.push(`/crm/leads/${lead.id}/edit`)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-white/10 shadow-2xl min-w-[160px]">
                                                    <DropdownMenuLabel className="font-bold text-slate-900 dark:text-white">Management</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="cursor-pointer font-medium" onClick={() => router.push(`/crm/leads/${lead.id}`)}>
                                                        <ChevronRight className="mr-2 h-4 w-4 text-indigo-500" /> View Intelligent Summary
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer font-medium" onClick={() => router.push(`/crm/leads/${lead.id}/edit`)}>
                                                        <Edit className="mr-2 h-4 w-4 text-amber-500" /> Re-engage / Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-rose-600 cursor-pointer font-bold focus:bg-rose-50 dark:focus:bg-rose-900/20" onClick={() => handleDelete(lead.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Purge Opportunity
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/5 dark:bg-white/5 border-t border-white/5">
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Propagating <span className="text-slate-900 dark:text-white">{data.length}</span> of <span className="text-slate-900 dark:text-white">{totalOrCount}</span> active signals
                </div>
                <div className="flex items-center space-x-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/50 dark:bg-white/5 rounded-xl border border-white/10 hover:bg-white transition-all disabled:opacity-30"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Retro
                    </Button>
                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm shadow-lg shadow-indigo-500/20">
                        {page} <span className="opacity-50 text-[10px]">OF</span> {totalPages}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/50 dark:bg-white/5 rounded-xl border border-white/10 hover:bg-white transition-all disabled:opacity-30"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

