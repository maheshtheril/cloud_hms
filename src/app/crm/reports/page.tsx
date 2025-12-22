
import { getCrmReports } from '@/app/actions/crm/reports'
import { GrowthChart, ActivityDonut, PipelineBar, PerformanceBar } from '@/components/crm/reports/charts'
import { Metadata } from 'next'
import {
    TrendingUp,
    Users,
    Target,
    Activity,
    Calendar,
    BarChart3
} from 'lucide-react'

export const metadata: Metadata = {
    title: 'Intelligence Reports | Temporal CRM',
    description: 'Advanced analytics and operational metrics.',
}

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
    const data = await getCrmReports()

    if (!data) return (
        <div className="flex h-[80vh] items-center justify-center text-slate-400 font-mono animate-pulse">
            INITIALIZING REPORTING MATRIX...
        </div>
    )

    // Calculate Summary Metrics
    const totalLeads = data.leadsByStatus.reduce((acc, curr) => acc + curr.count, 0)
    const pipelineValue = data.dealsByStage.reduce((acc, curr) => acc + curr.value, 0)
    const totalActivities = data.activityVolume.reduce((acc, curr) => acc + curr.value, 0)

    // Calculate simple growth percentage (mock calculation if simple)
    // Or just show total leads trend
    const latestMonth = data.growthTrend[data.growthTrend.length - 1]?.value || 0
    const previousMonth = data.growthTrend[data.growthTrend.length - 2]?.value || 0
    const growthRate = previousMonth > 0 ? ((latestMonth - previousMonth) / previousMonth) * 100 : 100

    return (
        <div className="container mx-auto py-8 space-y-8 max-w-7xl">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 uppercase">
                        Intelligence Reports
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                        Operational Matrix Online
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500 border border-slate-200 dark:border-white/10">
                        Live Data
                    </span>
                    <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/30">
                        Global Scope
                    </span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-3xl border border-white/20 dark:border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-violet-500/20 transition-all" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-2xl">
                                <Users className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${growthRate >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {growthRate > 0 ? '+' : ''}{growthRate.toFixed(1)}%
                            </span>
                        </div>
                        <p className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{totalLeads.toLocaleString()}</p>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Total Leads Acquisition</p>
                    </div>
                </div>

                <div className="glass p-6 rounded-3xl border border-white/20 dark:border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                                <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700">
                                Active
                            </span>
                        </div>
                        <p className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">${pipelineValue.toLocaleString()}</p>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Weighted Pipeline Value</p>
                    </div>
                </div>

                <div className="glass p-6 rounded-3xl border border-white/20 dark:border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{totalActivities}</p>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Engagement Events</p>
                    </div>
                </div>

                <div className="glass p-6 rounded-3xl border border-white/20 dark:border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/10 rounded-2xl">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-black tracking-tight">{data.dealsByStage.find(d => d.stageName.toLowerCase().includes('won'))?.count || 0}</p>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Closed Deals This Month</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Growth Trend */}
                <div className="glass p-8 rounded-3xl border border-white/20 dark:border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">Growth Velocity</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Lead Acquisition Trajectory</p>
                        </div>
                    </div>
                    <GrowthChart data={data.growthTrend} />
                </div>

                {/* Pipeline Value */}
                <div className="glass p-8 rounded-3xl border border-white/20 dark:border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">Deal Liquidity</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Value Distribution by Stage</p>
                        </div>
                    </div>
                    <PipelineBar data={data.dealsByStage} />
                </div>

                {/* Performance Ranking */}
                <div className="glass p-8 rounded-3xl border border-white/20 dark:border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">Alpha Performers</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Revenue Leaders (Top 5)</p>
                        </div>
                    </div>
                    <PerformanceBar data={data.topPerformers} />
                </div>

                {/* Activity Mix */}
                <div className="glass p-8 rounded-3xl border border-white/20 dark:border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">Operations Mix</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Activity Volume Breakdown</p>
                        </div>
                    </div>
                    <ActivityDonut data={data.activityVolume} />
                </div>
            </div>
        </div>
    )
}
