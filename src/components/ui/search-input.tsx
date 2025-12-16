"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { useDebouncedCallback } from "use-debounce" // We need to check if use-debounce is installed or use custom. The codebase had `useDebouncedCallback` in `searchable-select`.

// Let's implement a simple custom hook to avoid dependency issues if not installed globally
// Actually, `searchable-select` used a custom implementation in-file or imported? 
// Checking `searchable-select.tsx` view... it had `function useDebouncedCallback...` internal definition in the snippet I saw earlier? 
// Ah, `searchable-select.tsx` line 10 had `import { useDebouncedCallback } ...` NO, line 27 in viewed file showed custom implementation? 
// Wait, Step 18 view showed: 
// `function useDebouncedCallback...` was in `viewed_code_item` snippet but NOT in the full file view of `receipts/new/page.tsx`.
// `searchable-select.tsx` file view was NOT performed fully in this session, only `receipts/new/page`.
// But I edited `searchable-select` earlier. Let's assume I can write a simple hook here.

import { useEffect, useRef, useState, useCallback } from "react"

function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
    const timeoutRef = useRef<NodeJS.Timeout>(null);
    return useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);
}

export function SearchInput({ placeholder = "Search..." }: { placeholder?: string }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const handleSearch = useDebounce((term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set("q", term)
        } else {
            params.delete("q")
        }
        params.set("page", "1") // Reset to page 1 on search

        startTransition(() => {
            router.replace(`?${params.toString()}`)
        })
    }, 300)

    return (
        <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
                type="text"
                placeholder={placeholder}
                defaultValue={searchParams.get("q")?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400"
            />
            {isPending && (
                <div className="absolute right-3 top-2.5">
                    <div className="h-4 w-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                </div>
            )}
        </div>
    )
}
