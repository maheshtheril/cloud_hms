
'use client'

import { useState, useEffect } from 'react'
import { MapPin, ChevronDown, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getBranches, switchBranch } from '@/app/actions/company'
import { useSession } from 'next-auth/react'

export function BranchSwitcher() {
    const { data: session, update } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const [branches, setBranches] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const currentBranchId = (session?.user as any)?.current_branch_id
    const currentBranchName = (session?.user as any)?.current_branch_name || 'Select Branch'

    useEffect(() => {
        async function load() {
            setLoading(true)
            const res = await getBranches()
            if (res.success && res.data) {
                setBranches(res.data)
            }
            setLoading(false)
        }
        if (isOpen && branches.length === 0) {
            load()
        }
    }, [isOpen, branches.length])

    const handleSwitch = async (branchId: string, branchName: string) => {
        if (branchId === currentBranchId) return

        setLoading(true)
        const res = await switchBranch(branchId)
        if (res.success) {
            await update({ branchId, branchName })
            setIsOpen(false)
            router.refresh()
        } else {
            alert('Failed to switch branch: ' + res.error)
        }
        setLoading(false)
    }

    return (
        <div className="relative px-6 mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 w-full text-left transition-all hover:bg-white/5 rounded-xl border border-white/10 group"
            >
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin size={16} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">Active Location</p>
                    <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                        {currentBranchName}
                    </p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-6 right-6 mt-2 z-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800 mb-1">
                            Available Branches
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {branches.map(branch => (
                                <button
                                    key={branch.id}
                                    onClick={() => handleSwitch(branch.id, branch.name)}
                                    disabled={loading}
                                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 flex items-center justify-between group transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${branch.id === currentBranchId ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-zinc-700'}`} />
                                        <span className={`text-sm ${branch.id === currentBranchId ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-zinc-400'}`}>
                                            {branch.name}
                                        </span>
                                    </div>
                                    {branch.id === currentBranchId && (
                                        <Check size={14} className="text-emerald-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
