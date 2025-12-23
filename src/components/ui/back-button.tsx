'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BackButtonProps {
    href?: string
    label?: string // Optional label
    className?: string
}

export function BackButton({ href, label, className }: BackButtonProps) {
    // If no href, maybe go back in history? But Link requires href.
    // We will assume usages pass href or we default to '..' if that works in nextjs (it doesn't really).
    // Most usages have a specific target.

    // If no href is provided, we might render a button that calls router.back(), but let's stick to Link if possible for SEO/Predictability.
    // Or we render nothing.

    if (!href) return null;

    return (
        <Link href={href}>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "rounded-full bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 backdrop-blur-md border border-white/10 shadow-sm transition-all duration-300 group",
                    label ? "pl-3 pr-4" : "h-10 w-10 p-0",
                    className
                )}
            >
                <ArrowLeft className={cn("h-5 w-5 text-slate-700 dark:text-slate-200 transition-transform group-hover:-translate-x-1", label && "mr-2")} />
                {label && <span className="text-slate-700 dark:text-slate-200 font-medium">{label}</span>}
            </Button>
        </Link>
    )
}
