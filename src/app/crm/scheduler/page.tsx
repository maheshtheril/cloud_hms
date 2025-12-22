import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Sparkles, Clock, Activity, Target } from 'lucide-react'
import { Metadata } from 'next'
import CRMCalendar from '@/components/crm/scheduler/calendar'

export const metadata: Metadata = {
    title: 'CRM Temporal Hub | SAAS ERP',
    description: 'Manage your meetings and synchronization protocols',
}

export default function SchedulerPage() {
    return (
        <div className="min-h-screen bg-futuristic">
            {/* Animated Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-12 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
                <div className="absolute bottom-1/2 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-6000" />
            </div>

            <div className="relative container mx-auto py-8 space-y-8 max-w-[1600px]">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2.5 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter text-gradient-primary uppercase">Temporal Hub</h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium md:ml-14">Synchronize engagements and manage operational timelines.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Status Stats for Scheduler Header */}
                        <div className="hidden lg:flex items-center gap-6 px-8 py-3 bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-white/20 backdrop-blur-md shadow-sm mr-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Ops</span>
                                <span className="text-xl font-black text-slate-900 dark:text-white">SYNCHRONIZED</span>
                            </div>
                            <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Efficiency</span>
                                <span className="text-xl font-black text-indigo-600">92%</span>
                            </div>
                        </div>

                        <Link href="/crm/activities/new">
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-500/20 border-none px-8 h-14 rounded-2xl group transition-all">
                                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                                <span className="font-bold uppercase tracking-widest text-[10px]">Initialize Event</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Calendar Terminal */}
                <div className="px-4 pb-12">
                    <div className="glass-card bg-white/40 dark:bg-slate-900/40 p-1.5 rounded-[2.5rem] border border-white/20 shadow-2xl backdrop-blur-xl overflow-hidden min-h-[750px] relative transition-all animate-in fade-in zoom-in-95 duration-700">
                        {/* Decorative UI elements for the "Terminal" look */}
                        <div className="absolute top-6 left-10 flex gap-1.5 z-10 opacity-30">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        </div>

                        <div className="absolute top-6 right-10 flex items-center gap-4 z-10 opacity-40">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-r border-slate-300 dark:border-white/10 pr-4">
                                <Clock className="w-3 h-3" /> Real-time Sync
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                <Target className="w-3 h-3 text-indigo-500" /> Operational Matrix
                            </div>
                        </div>

                        <div className="mt-8">
                            <CRMCalendar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

