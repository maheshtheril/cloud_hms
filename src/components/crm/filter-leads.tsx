'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Filter, X, Calendar as CalendarIcon, User } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FilterLeadsProps {
    sources: any[]
    users: any[]
    branches: any[]
}

export function FilterLeads({ sources, users, branches }: FilterLeadsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const createQueryString = useCallback(
        (params: Record<string, string | null>) => {
            const newSearchParams = new URLSearchParams(searchParams.toString())

            for (const [key, value] of Object.entries(params)) {
                if (value === null) {
                    newSearchParams.delete(key)
                } else {
                    newSearchParams.set(key, value)
                }
            }

            return newSearchParams.toString()
        },
        [searchParams]
    )

    const status = searchParams.get('status')
    const sourceId = searchParams.get('source_id')
    const ownerId = searchParams.get('owner_id')
    const fromDate = searchParams.get('from') || ''
    const toDate = searchParams.get('to') || ''
    const isHot = searchParams.get('is_hot')

    const hasFilters = status || sourceId || ownerId || fromDate || toDate || isHot

    const clearFilters = () => {
        router.push('?')
    }

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className={`bg-white/50 backdrop-blur-sm border-slate-200/50 hover:bg-white transition-all text-slate-700 dark:text-slate-200 ${hasFilters ? 'border-indigo-500 text-indigo-600 ring-2 ring-indigo-500/20' : ''}`}>
                        <Filter className="w-4 h-4 mr-2" />
                        {hasFilters ? 'Filters Active' : 'Filter'}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-white/10 shadow-2xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <DropdownMenuLabel className="p-0 text-base font-bold">Refine Results</DropdownMenuLabel>
                        {hasFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-[10px] uppercase tracking-widest font-black text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                                Reset All
                            </Button>
                        )}
                    </div>

                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />

                    <div className="space-y-4">
                        {/* Status Section */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</Label>
                            <div className="grid grid-cols-2 gap-1 px-1">
                                {['new', 'contacted', 'won', 'lost'].map((s) => (
                                    <DropdownMenuCheckboxItem
                                        key={s}
                                        checked={status === s}
                                        className="capitalize text-xs rounded-md"
                                        onCheckedChange={() => router.push(`?${createQueryString({ status: status === s ? null : s })}`)}
                                    >
                                        {s}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </div>
                        </div>

                        {/* Owner Section */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Owner / Rep</Label>
                            <select
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs p-2 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                                value={ownerId || ''}
                                onChange={(e) => router.push(`?${createQueryString({ owner_id: e.target.value || null })}`)}
                            >
                                <option value="">All Owners</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name || u.email}</option>
                                ))}
                            </select>
                        </div>

                        {/* Branch Section */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Branch Location</Label>
                            <select
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs p-2 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                                value={searchParams.get('branch_id') || ''}
                                onChange={(e) => router.push(`?${createQueryString({ branch_id: e.target.value || null })}`)}
                            >
                                <option value="">All Locations</option>
                                {branches.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Range Section */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Creation Horizon</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-[9px] text-slate-500">From</Label>
                                    <Input
                                        type="date"
                                        className="h-8 text-[10px] bg-slate-50 dark:bg-slate-800 border-none"
                                        value={fromDate}
                                        onChange={(e) => router.push(`?${createQueryString({ from: e.target.value || null })}`)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[9px] text-slate-500">To</Label>
                                    <Input
                                        type="date"
                                        className="h-8 text-[10px] bg-slate-50 dark:bg-slate-800 border-none"
                                        value={toDate}
                                        onChange={(e) => router.push(`?${createQueryString({ to: e.target.value || null })}`)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Followup Range Section */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Followup Schedule</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-[9px] text-slate-500">From</Label>
                                    <Input
                                        type="date"
                                        className="h-8 text-[10px] bg-slate-50 dark:bg-slate-800 border-none font-bold text-amber-600"
                                        value={searchParams.get('followup_from') || ''}
                                        onChange={(e) => router.push(`?${createQueryString({ followup_from: e.target.value || null })}`)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[9px] text-slate-500">To</Label>
                                    <Input
                                        type="date"
                                        className="h-8 text-[10px] bg-slate-50 dark:bg-slate-800 border-none font-bold text-amber-600"
                                        value={searchParams.get('followup_to') || ''}
                                        onChange={(e) => router.push(`?${createQueryString({ followup_to: e.target.value || null })}`)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Source Section */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Ingestion Source</Label>
                            <div className="max-h-[120px] overflow-y-auto pr-1">
                                {sources.map(source => (
                                    <DropdownMenuCheckboxItem
                                        key={source.id}
                                        checked={sourceId === source.id}
                                        className="text-xs rounded-md"
                                        onCheckedChange={() => router.push(`?${createQueryString({ source_id: sourceId === source.id ? null : source.id })}`)}
                                    >
                                        {source.name}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </div>
                        </div>

                        {/* Priority Section */}
                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                        <DropdownMenuCheckboxItem
                            checked={isHot === 'true'}
                            className="text-xs font-bold text-amber-600 focus:text-amber-700 bg-amber-50"
                            onCheckedChange={() => router.push(`?${createQueryString({ is_hot: isHot === 'true' ? null : 'true' })}`)}
                        >
                            High Priority Signals 🔥
                        </DropdownMenuCheckboxItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-500 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4 mr-1" /> Clear
                </Button>
            )}
        </div>
    )
}
