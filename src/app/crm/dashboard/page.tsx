
import { getDashboardData } from '@/app/actions/crm/dashboard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Sparkles, DollarSign, Activity, Target, TrendingUp, MapPin, BrainCircuit, Zap, Crown } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const data = await getDashboardData()
    const { kpis, funnel, activities, hotLeads } = data

    return (
        <div className="min-h-screen bg-futuristic">
            {/* Animated Background Effects - Reduced visual noise */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob animation-delay-4000" />
            </div>

            <div className="relative container mx-auto py-8 space-y-8">
                {/* Header */}
                <div className="mb-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                            <Zap className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                                CRM Command Center
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-lg mt-1">
                                Real-time insights and AI intelligence
                            </p>
                        </div>
                    </div>
                </div>

                {/* KPI GRID - CLEAN ROW */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white/80 dark:bg-slate-900/80 p-6 rounded-2xl shadow-sm border border-purple-100 dark:border-purple-900/30">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Total Revenue</p>
                            <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            ${kpis.totalRevenue.toLocaleString()}
                        </div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
                            ↑ +12% vs last month
                        </p>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/80 p-6 rounded-2xl shadow-sm border border-cyan-100 dark:border-cyan-900/30">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Pipeline Value</p>
                            <Target className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            ${kpis.pipelineValue.toLocaleString()}
                        </div>
                        <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                            {kpis.activeDealsCount} active deals
                        </p>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/80 p-6 rounded-2xl shadow-sm border border-pink-100 dark:border-pink-900/30">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Avg Lead Score</p>
                            <Sparkles className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {kpis.avgLeadScore}
                        </div>
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                            AI Quality Index
                        </p>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/80 p-6 rounded-2xl shadow-sm border border-orange-100 dark:border-orange-900/30">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Activity Volume</p>
                            <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {activities.length}
                        </div>
                        <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                            interactions this week
                        </p>
                    </div>
                </div>

                {/* 2. MAIN CONTENT ROW (Funnel + Leads) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* SALES FUNNEL (Takes 2/3 width) */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="h-5 w-5 text-cyan-500" />
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sales Funnel</h2>
                            <span className="ml-auto text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
                                {funnel.reduce((acc, s) => acc + s.count, 0)} Deals
                            </span>
                        </div>
                        <div className="space-y-4">
                            {funnel.map((stage) => (
                                <div key={stage.name} className="flex items-center gap-4">
                                    <div className="w-32 text-sm font-medium text-slate-600 dark:text-slate-400 text-right truncate">
                                        {stage.name}
                                    </div>
                                    <div className="flex-1 h-8 bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                                        <div
                                            className="h-full rounded-lg flex items-center justify-end px-3 text-xs text-white font-bold transition-all duration-500"
                                            style={{
                                                width: `${Math.max(5, (stage.count / (Math.max(...funnel.map(f => f.count)) || 1)) * 100)}%`,
                                                backgroundColor: stage.color
                                            }}
                                        >
                                            {stage.count > 0 && stage.count}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {funnel.length === 0 && (
                                <div className="text-center py-12 text-slate-400">No deals in pipeline</div>
                            )}
                        </div>
                    </div>

                    {/* HOT LEADS (Takes 1/3 width) */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-orange-500" />
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Hot Leads</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-2">
                            {hotLeads.map((lead) => (
                                <div key={lead.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white text-sm">{lead.name}</p>
                                            <p className="text-xs text-slate-500">{lead.company_name}</p>
                                        </div>
                                        <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-none">
                                            {lead.lead_score}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            {hotLeads.length === 0 && (
                                <div className="text-center py-12 text-slate-400">No hot leads</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. ACTIVITY FEED (Full Width) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Activity className="h-5 w-5 text-purple-500" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Live Activity Feed</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {activities.map((act) => (
                            <div key={act.id} className="flex gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <div className="mt-1">
                                    {act.type === 'call' ? <div className="w-2 h-2 rounded-full bg-blue-500" /> :
                                        act.type === 'meeting' ? <div className="w-2 h-2 rounded-full bg-purple-500" /> :
                                            <div className="w-2 h-2 rounded-full bg-slate-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{act.subject}</p>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{act.description}</p>
                                    <p className="text-xs text-slate-400 mt-2">{formatDistanceToNow(new Date(act.created_at), { addSuffix: true })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
