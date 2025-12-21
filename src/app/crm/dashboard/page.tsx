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
            {/* Animated Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob animation-delay-4000" />
            </div>

            <div className="relative container mx-auto py-8 space-y-8">
                {/* Header */}
                <div className="mb-8">
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

                {/* KPI GRID */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="card-stat-purple p-6 rounded-2xl shadow-xl hover-glow-purple transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-purple-100 dark:border-purple-900/30">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Total Revenue</p>
                            <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                            ${kpis.totalRevenue.toLocaleString()}
                        </div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            ↑ +12% from last month
                        </p>
                    </div>

                    <div className="card-stat-cyan p-6 rounded-2xl shadow-xl hover-glow-cyan transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Pipeline Value</p>
                            <Target className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                            ${kpis.pipelineValue.toLocaleString()}
                        </div>
                        <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                            {kpis.activeDealsCount} active deals
                        </p>
                    </div>

                    <div className="card-stat-pink p-6 rounded-2xl shadow-xl hover-glow-pink transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-pink-700 dark:text-pink-300">Avg Lead Score</p>
                            <Sparkles className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                            {kpis.avgLeadScore}
                        </div>
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                            AI Quality Index
                        </p>
                    </div>

                    <div className="glass border-gradient-accent bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/50 dark:to-transparent p-6 rounded-2xl shadow-xl hover:shadow-orange-500/20 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Activity Volume</p>
                            <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                            {activities.length}
                        </div>
                        <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                            interactions this week
                        </p>
                    </div>
                </div>

                {/* BENTO GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* SALES FUNNEL */}
                    <div className="card-futuristic lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="h-6 w-6 text-cyan-400 dark:text-cyan-300" />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sales Funnel</h2>
                            <Badge variant="outline" className="ml-auto border-cyan-500/30 bg-cyan-950/20 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300">
                                {funnel.reduce((acc, s) => acc + s.count, 0)} deals
                            </Badge>
                        </div>
                        <div className="space-y-4">
                            {funnel.map((stage) => (
                                <div key={stage.name} className="flex items-center gap-4">
                                    <div className="w-28 text-sm font-medium text-slate-700 dark:text-slate-300 truncate text-right">
                                        {stage.name}
                                    </div>
                                    <div className="flex-1 h-10 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
                                        <div
                                            className="h-full rounded-full flex items-center justify-end px-4 text-sm text-white font-bold transition-all duration-500 shadow-lg"
                                            style={{
                                                width: `${Math.max(5, (stage.count / (Math.max(...funnel.map(f => f.count)) || 1)) * 100)}%`,
                                                backgroundColor: stage.color,
                                                boxShadow: `0 4px 12px ${stage.color}40`
                                            }}
                                        >
                                            {stage.count > 0 && stage.count}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {funnel.length === 0 && (
                                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                                    No deals in pipeline
                                </p>
                            )}
                        </div>
                    </div>

                    {/* HOT LEADS */}
                    <div className="card-futuristic lg:row-span-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-400/10 dark:to-red-400/10 rounded-xl border border-orange-500/20 dark:border-orange-400/20 p-4 mb-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                <h2 className="text-xl font-bold text-orange-800 dark:text-orange-300">Hot Leads (AI)</h2>
                            </div>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {hotLeads.map((lead) => (
                                <div
                                    key={lead.id}
                                    className="group p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 hover:border-orange-500/30 dark:hover:border-orange-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 mt-2 rounded-full ${lead.lead_score && lead.lead_score > 80 ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-orange-400 shadow-lg shadow-orange-400/50'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                                                {lead.name}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                                {lead.company_name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-lg">
                                                    {lead.lead_score} Score
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {hotLeads.length === 0 && (
                                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                                    No hot leads detected
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ACTIVITY FEED */}
                    <div className="card-futuristic lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <Activity className="h-6 w-6 text-purple-400 dark:text-purple-300" />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Live Activity</h2>
                        </div>
                        <div className="space-y-4">
                            {activities.map((act) => (
                                <div
                                    key={act.id}
                                    className="flex items-start gap-4 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 hover:border-purple-500/30 dark:hover:border-purple-400/30 transition-all duration-300"
                                >
                                    <div className={`p-2 rounded-full ${act.type === 'call'
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        : act.type === 'meeting'
                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                        }`}>
                                        <Activity className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {act.subject}
                                            </p>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                {formatDistanceToNow(new Date(act.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                                            {act.description}
                                        </p>

                                        <div className="flex gap-2 mt-2 flex-wrap">
                                            {(act.sentiment_score ?? 0) > 0 && (
                                                <span className="flex items-center text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-lg border border-purple-200 dark:border-purple-700/30">
                                                    <BrainCircuit className="w-3 h-3 mr-1" />
                                                    Sentiment: {act.sentiment_score}
                                                </span>
                                            )}
                                            {act.location_lat && (
                                                <span className="flex items-center text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-700/30">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    Verified Loc
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {activities.length === 0 && (
                                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                                    No recent activity
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
