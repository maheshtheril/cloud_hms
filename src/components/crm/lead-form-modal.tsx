'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { BackButton } from '@/components/ui/back-button'

export function LeadFormModal({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <Dialog open={true} onOpenChange={(open) => {
            if (!open) {
                router.push('/crm/leads')
            }
        }}>
            <DialogContent className="max-w-[95vw] w-[1300px] h-[90vh] p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border-white/20 rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex flex-col min-w-[600px] min-h-[500px] overflow-hidden resize">
                <div className="flex flex-col h-full relative overflow-hidden">
                    <DialogHeader className="px-8 py-3 border-b border-indigo-500/10 bg-indigo-50/20 dark:bg-indigo-900/10 flex flex-row items-center justify-between space-y-0 shrink-0">
                        <div className="flex items-center gap-5">
                            <BackButton href="/crm/leads" />
                            <div>
                                <DialogTitle className="text-xl font-black tracking-tighter text-indigo-950 dark:text-white flex items-center gap-2">
                                    Create New Lead
                                    <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
                                </DialogTitle>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px]">
                                    Lead Management Portal
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-hidden">
                        {children}
                    </div>

                    {/* Visual Resize Handle (Traditional UI) */}
                    <div className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-end justify-end p-1 opacity-20 hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="w-1 h-1 bg-slate-400 rounded-full mb-1 mr-1" />
                        <div className="w-1 h-1 bg-slate-400 rounded-full mb-1 mr-3" />
                        <div className="w-1 h-1 bg-slate-400 rounded-full mb-3 mr-1" />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
