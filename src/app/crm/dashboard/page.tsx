
import Link from 'next/link'
import { getDashboardData } from '@/app/actions/crm/dashboard'
import { Sparkles, DollarSign, Activity, Target, TrendingUp, Zap, IndianRupee, Euro, PoundSterling, Plus, Calendar, Users, BarChart3, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const data = await getDashboardData()
    const { kpis, funnel, activities, hotLeads, currencySymbol, currencyCode } = data

    const getCurrencyIcon = () => {
        switch (currencyCode) {
            case 'INR': return <IndianRupee className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            case 'EUR': return <Euro className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            case 'GBP': return <PoundSterling className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            default: return <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        }
    }

    return (
        <div className="min-h-screen bg-futuristic">
            {/* Animated Background Effects - Reduced visual noise */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob animation-delay-4000" />
            </div>

            <div className="relative container mx-auto py-8 space-y-8 max-w-[1600px]">
                {/* Header & Quick Actions */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20">
                            <Zap className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                Command Center
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                                Intelligence Overview
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link href="/crm/leads/new">
                            <Button className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 border-none transition-transform active:scale-95">
                                <Plus className="w-5 h-5 mr-2" />
                                New Lead
                            </Button>
                        </Link>
                        <Link href="/crm/deals/new">
                            <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
                                <DollarSign className="w-5 h-5 mr-2" />
                                New Deal
                            </Button>
                        </Link>
                        <Link href="/crm/activities/new">
                            <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
                                <Calendar className="w-5 h-5 mr-2" />
                                Schedule
                            </Button>
                        </Link>
                        <a href="/api/crm/guide" download>
                            <Button variant="outline" className="h-12 px-6 rounded-xl border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all font-bold">
                                <Activity className="w-5 h-5 mr-2" />
                                Download Guide
                            </Button>
                        </a>
                    </div>
                </div>

                {/* KPI GRID - Interactive & Navigable */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Link href="/crm/reports" className="group">
                        <div className="h-full bg-white/60 dark:bg-slate-900/60 p-6 rounded-3xl shadow-lg border border-white/20 dark:border-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-purple-500/20" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Revenue</p>
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        {getCurrencyIcon()}
                                    </div>
                                </div>
                                <div className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                                    {currencySymbol}{kpis.totalRevenue.toLocaleString()}
                                </div>
                                <div className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20 px-2 py-1 rounded w-fit">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    <span>+12.5% MTD</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/crm/deals" className="group">
                        <div className="h-full bg-white/60 dark:bg-slate-900/60 p-6 rounded-3xl shadow-lg border border-white/20 dark:border-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-cyan-500/20" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pipeline</p>
                                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                                        <Target className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                </div>
                                <div className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                                    {currencySymbol}{kpis.pipelineValue.toLocaleString()}
                                </div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">{kpis.activeDealsCount}</span> active deals
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/crm/leads" className="group">
                        <div className="h-full bg-white/60 dark:bg-slate-900/60 p-6 rounded-3xl shadow-lg border border-white/20 dark:border-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-pink-500/20" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lead Quality</p>
                                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                                        <Sparkles className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                                    </div>
                                </div>
                                <div className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                                    {kpis.avgLeadScore}
                                </div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Average AI Score
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/crm/activities" className="group">
                        <div className="h-full bg-white/60 dark:bg-slate-900/60 p-6 rounded-3xl shadow-lg border border-white/20 dark:border-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-orange-500/20" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Velocity</p>
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                        <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                </div>
                                <div className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                                    {activities.length}
                                </div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Weekly Actions
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* MAIN CONTENT SPLIT */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* SALES FUNNEL */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="glass-card bg-white/50 dark:bg-slate-900/50 p-8 rounded-3xl border border-white/20 dark:border-white/5 backdrop-blur-md">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg">
                                        <BarChart3 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pipeline Analytics</h2>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Conversion Funnel</p>
                                    </div>
                                </div>
                                <Link href="/crm/reports">
                                    <Button variant="ghost" className="text-slate-500 hover:text-indigo-600">
                                        View Full Report <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="space-y-5">
                                {funnel.map((stage) => (
                                    <Link key={stage.name} href={`/crm/deals?stage=${stage.id}`} className="block group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-32 text-sm font-semibold text-slate-600 dark:text-slate-400 text-right truncate group-hover:text-indigo-600 transition-colors">
                                                {stage.name}
                                            </div>
                                            <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000 ease-out relative"
                                                    style={{
                                                        width: `${Math.max(2, (stage.count / (Math.max(...funnel.map(f => f.count)) || 1)) * 100)}%`,
                                                        backgroundColor: stage.color
                                                    }}
                                                >
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full animate-pulse mx-1" />
                                                </div>
                                            </div>
                                            <div className="w-12 text-sm font-bold text-slate-900 dark:text-white text-right">
                                                {stage.count}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {funnel.length === 0 && (
                                    <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                        <p>No active pipeline data.</p>
                                        <Link href="/crm/deals/new" className="text-xs text-indigo-500 font-bold uppercase tracking-wider mt-2 inline-block hover:underline">Start a Deal</Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity Feed */}
                        <div className="glass-card bg-white/50 dark:bg-slate-900/50 p-8 rounded-3xl border border-white/20 dark:border-white/5 backdrop-blur-md">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                        <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Live Feed</h2>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Recent Interactions</p>
                                    </div>
                                </div>
                                <Link href="/crm/activities">
                                    <Button variant="ghost" className="text-slate-500 hover:text-indigo-600">
                                        View All
                                    </Button>
                                </Link>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {activities.slice(0, 6).map((act) => (
                                    <Link key={act.id} href={`/crm/activities`} className="group">
                                        <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg transition-all h-full">
                                            <div className="flex items-center gap-2 mb-1">
                                                {act.type === 'call' ? <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" /> :
                                                    act.type === 'meeting' ? <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" /> :
                                                        <div className="w-2 h-2 rounded-full bg-slate-400" />}
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{act.type}</span>
                                                <span className="ml-auto text-[10px] text-slate-400">{formatDistanceToNow(new Date(act.created_at), { addSuffix: true })}</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">{act.subject}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{act.description}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - HOT LEADS */}
                    <div className="glass-card bg-white/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-white/20 dark:border-white/5 backdrop-blur-md flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
                                    <Sparkles className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Hot Leads</h2>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">AI Recommended</p>
                                </div>
                            </div>
                            <Link href="/crm/leads?is_hot=true">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {hotLeads.map((lead) => (
                                <Link key={lead.id} href={`/crm/leads/${lead.id}`} className="block group">
                                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md hover:border-pink-200 dark:hover:border-pink-900 transition-all cursor-pointer relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-pink-500/10 to-transparent rounded-bl-full pointer-events-none" />

                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-pink-600 transition-colors">{lead.name}</h3>
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Users className="w-3 h-3" /> {lead.company_name || 'Individual'}
                                                </p>
                                            </div>
                                            <Badge variant="secondary" className="bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border border-pink-100 dark:border-pink-800 shadow-sm font-mono text-xs">
                                                {lead.lead_score}
                                            </Badge>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {hotLeads.length === 0 && (
                                <div className="text-center py-20 text-slate-400 flex flex-col items-center">
                                    <Sparkles className="w-12 h-12 text-slate-200 mb-4" />
                                    <p>No high-priority leads detected.</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Link href="/crm/leads">
                                <Button className="w-full rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90">
                                    View All Leads
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
