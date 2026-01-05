
'use client'

import { ShieldAlert, LogOut, MessageSquare, AlertTriangle, Target, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GatedComplianceLockProps {
    reason: string;
    deadline?: string;
    targetId?: string;
}

export function GatedComplianceLock({ reason, deadline, targetId }: GatedComplianceLockProps) {
    const formattedDeadline = deadline ? new Date(deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) : 'Immediate'

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-rose-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse animation-delay-2000" />
            </div>

            <div className="relative w-full max-w-2xl p-1">
                <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl shadow-rose-950/20 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldAlert className="w-32 h-32 text-white" />
                        </div>
                        <div className="relative inline-flex p-4 rounded-3xl bg-white/20 backdrop-blur-md mb-4 shadow-xl">
                            <ShieldAlert className="w-12 h-12 text-white animate-bounce" />
                        </div>
                        <h1 className="relative text-3xl font-black text-white uppercase tracking-tighter">
                            Compliance Suspension Triggered
                        </h1>
                        <p className="relative text-rose-100 font-bold uppercase tracking-widest text-xs mt-2">
                            Automated Gated Intelligence Enforcement
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-10 space-y-8">
                        <div className="flex items-start gap-6 p-6 rounded-3xl bg-rose-500/5 border border-rose-500/10">
                            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-500">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-1">Violation Detected</h4>
                                <p className="text-xl font-bold text-white leading-tight">
                                    {reason}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-3xl bg-slate-800/50 border border-white/5">
                                <div className="flex items-center gap-3 text-slate-400 mb-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deadine Missed</span>
                                </div>
                                <p className="text-lg font-black text-white">{formattedDeadline}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-slate-800/50 border border-white/5">
                                <div className="flex items-center gap-3 text-slate-400 mb-2">
                                    <Target className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operation ID</span>
                                </div>
                                <p className="text-lg font-black text-indigo-400 truncate tracking-tight">{targetId?.substring(0, 8) || 'GLOBAL'}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Required Action Protocol</h4>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-xs font-bold">1</div>
                                    <p className="text-sm font-medium text-slate-300">Synchronize current sales data to ensure all records are uploaded.</p>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-xs font-bold">2</div>
                                    <p className="text-sm font-medium text-slate-300">Contact your Sales Manager for strategic remediation or a gate override.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                            <Button
                                variant="ghost"
                                className="flex-1 h-14 rounded-2xl text-slate-400 font-bold uppercase tracking-widest text-xs hover:bg-white/5"
                                onClick={() => window.location.href = '/crm/targets'}
                            >
                                Review Target Details
                            </Button>
                            <Button
                                className="flex-1 h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-tight shadow-xl shadow-rose-900/40 group"
                                onClick={() => window.location.href = 'mailto:manager@enterprise.com'}
                            >
                                Submit Appeal
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
