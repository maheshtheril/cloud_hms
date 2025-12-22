'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Filter, X } from 'lucide-react'
import { useCallback } from 'react'

interface FilterLeadsProps {
    sources: any[]
}

export function FilterLeads({ sources }: FilterLeadsProps) {
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
    const isHot = searchParams.get('is_hot')

    const hasFilters = status || sourceId || isHot

    const clearFilters = () => {
        router.push('?')
    }

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className={`bg-white/50 backdrop-blur-sm border-slate-200/50 hover:bg-white transition-all ${hasFilters ? 'border-indigo-500 text-indigo-600' : ''}`}>
                        <Filter className="w-4 h-4 mr-2" />
                        {hasFilters ? 'Filters Active' : 'Filter'}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-md border-slate-200/50">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={status === 'new'}
                        onCheckedChange={() => router.push(`?${createQueryString({ status: status === 'new' ? null : 'new' })}`)}
                    >
                        New
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={status === 'contacted'}
                        onCheckedChange={() => router.push(`?${createQueryString({ status: status === 'contacted' ? null : 'contacted' })}`)}
                    >
                        Contacted
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={status === 'won'}
                        onCheckedChange={() => router.push(`?${createQueryString({ status: status === 'won' ? null : 'won' })}`)}
                    >
                        Won
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Priority</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                        checked={isHot === 'true'}
                        onCheckedChange={() => router.push(`?${createQueryString({ is_hot: isHot === 'true' ? null : 'true' })}`)}
                    >
                        Hot Leads Only 🔥
                    </DropdownMenuCheckboxItem>

                    {sources.length > 0 && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Filter by Source</DropdownMenuLabel>
                            {sources.map(source => (
                                <DropdownMenuCheckboxItem
                                    key={source.id}
                                    checked={sourceId === source.id}
                                    onCheckedChange={() => router.push(`?${createQueryString({ source_id: sourceId === source.id ? null : source.id })}`)}
                                >
                                    {source.name}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-500 hover:text-red-500">
                    <X className="w-4 h-4 mr-1" /> Clear
                </Button>
            )}
        </div>
    )
}
