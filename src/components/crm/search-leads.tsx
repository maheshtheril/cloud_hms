'use client'

import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

export function SearchLeads({ defaultValue = '' }: { defaultValue?: string }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [value, setValue] = useState(defaultValue)

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (value !== defaultValue) {
                const params = new URLSearchParams(searchParams.toString())
                if (value) {
                    params.set('q', value)
                } else {
                    params.delete('q')
                }
                params.set('page', '1') // reset to page 1 on search

                startTransition(() => {
                    router.push(`?${params.toString()}`)
                })
            }
        }, 500) // Debounce 500ms

        return () => clearTimeout(timeout)
    }, [value, defaultValue, router, searchParams])

    return (
        <div className="relative group">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isPending ? 'text-indigo-500 animate-pulse' : 'text-slate-400 group-focus-within:text-slate-900'}`} />
            <Input
                placeholder="Search leads by name, email, or company..."
                className="pl-10 pr-10 py-2 border-slate-200 focus-visible:ring-slate-900 bg-white shadow-sm text-slate-900"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            {value && (
                <button
                    onClick={() => setValue('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 hover:text-slate-900 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}
