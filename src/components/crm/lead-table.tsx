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
import { MoreHorizontal, Edit, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
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
            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        {/* ... table header ... */}
                        <TableRow>
                            <TableHead className="w-[250px] font-semibold text-slate-900">Lead Name / Company</TableHead>
                            <TableHead className="font-semibold text-slate-900">Contact</TableHead>
                            <TableHead className="font-semibold text-slate-900">Details</TableHead>
                            <TableHead className="font-semibold text-slate-900 text-right">Value</TableHead>
                            <TableHead className="font-semibold text-slate-900">Stage</TableHead>
                            <TableHead className="font-semibold text-slate-900">Score</TableHead>
                            <TableHead className="font-semibold text-slate-900">Created</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                                    No leads found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((lead) => (
                                <TableRow key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900 truncate max-w-[200px]" title={lead.name}>
                                                {lead.name}
                                            </span>
                                            {lead.company_name && (
                                                <span className="text-xs text-slate-500 truncate max-w-[200px]">
                                                    {lead.company_name}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="text-slate-700">{lead.contact_name || '-'}</span>
                                            <span className="text-xs text-slate-500">{lead.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-slate-600">
                                            {lead.phone || '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-slate-900">
                                        {formatCurrency(Number(lead.estimated_value) || 0, lead.currency || 'INR')}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                            ${lead.status === 'new' ? 'border-blue-200 bg-blue-50 text-blue-700' : ''}
                                            ${lead.status === 'won' ? 'border-green-200 bg-green-50 text-green-700' : ''}
                                            ${lead.status === 'lost' ? 'border-red-200 bg-red-50 text-red-700' : ''}
                                        `}>
                                            {lead.stage?.name || lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${(lead.lead_score || 0) > 70 ? 'bg-green-500' :
                                                        (lead.lead_score || 0) > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${lead.lead_score || 0}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium">{lead.lead_score}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-500">
                                        {lead.created_at ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => router.push(`/crm/leads/${lead.id}/edit`)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit Lead
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => handleDelete(lead.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-slate-500">
                    Showing <span className="font-medium">{data.length}</span> of <span className="font-medium">{totalOrCount}</span> leads
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="text-sm font-medium">
                        Page {page} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
