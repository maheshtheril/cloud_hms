import { getDashboardData } from '@/app/actions/crm/dashboard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Sparkles, DollarSign, Activity, Target, TrendingUp, MapPin, BrainCircuit } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const data = await getDashboardData()
    const { kpis, funnel, activities, hotLeads } = data

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>CRM Command Center</h1>
                <p className="text-gray-500 mt-2">Real-time insights and AI intelligence.</p>
            </div>

            {/* KPI GRID */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <KpiCard
                    title="Total Revenue"
                    value={`$${kpis.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend="+12% from last month"
                    trendUp={true}
                />
                <KpiCard
                    title="Pipeline Value"
                    value={`$${kpis.pipelineValue.toLocaleString()}`}
                    icon={Target}
                    trend={`${kpis.activeDealsCount} active deals`}
                    trendUp={true}
                    color="indigo"
                />
                <KpiCard
                    title="Avg Lead Score"
                    value={kpis.avgLeadScore.toString()}
                    icon={Sparkles}
                    trend="AI Quality Index"
                    trendUp={kpis.avgLeadScore > 50}
                    color="purple"
                />
                <KpiCard
                    title="Activity Volume"
                    value={activities.length.toString()}
                    icon={Activity}
                    trend=" interactions this week"
                    trendUp={true}
                    color="orange"
                />
            </div>

            {/* BENTO GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* SALES FUNNEL */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-gray-500" />
                            Sales Funnel
                        </CardTitle>
                        <CardDescription>Deal distribution by stage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {funnel.map((stage) => (
                                <div key={stage.name} className="flex items-center gap-4">
                                    <div className="w-24 text-sm font-medium text-gray-600 truncate text-right">{stage.name}</div>
                                    <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden relative">
                                        <div
                                            className="h-full rounded-full flex items-center justify-end px-3 text-xs text-white font-bold transition-all duration-500"
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
                            {funnel.length === 0 && <p className="text-center text-gray-400 py-8">No deals in pipeline</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* HOT LEADS */}
                <Card className="lg:row-span-2">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-xl border-b border-orange-100">
                        <CardTitle className="flex items-center gap-2 text-orange-800">
                            <Sparkles className="w-5 h-5 text-orange-600" />
                            Hot Leads (AI)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100">
                            {hotLeads.map((lead) => (
                                <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-3">
                                    <div className={`w-2 h-2 mt-2 rounded-full ${lead.lead_score && lead.lead_score > 80 ? 'bg-red-500' : 'bg-orange-400'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{lead.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{lead.company_name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                                                {lead.lead_score} Score
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {hotLeads.length === 0 && <p className="text-center text-gray-400 py-8">No hot leads detected.</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* ACTIVITY FEED */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-gray-500" />
                            Recent Live Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activities.map((act) => (
                                <div key={act.id} className="flex items-start gap-4 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                                    <div className={`p-2 rounded-full ${act.type === 'call' ? 'bg-blue-100 text-blue-600' :
                                            act.type === 'meeting' ? 'bg-purple-100 text-purple-600' : 'bg-gray-200'
                                        }`}>
                                        <Activity className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <p className="font-medium text-gray-900">{act.subject}</p>
                                            <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(act.created_at), { addSuffix: true })}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{act.description}</p>

                                        <div className="flex gap-3 mt-2">
                                            {(act.sentiment_score ?? 0) > 0 && (
                                                <span className="flex items-center text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                                                    <BrainCircuit className="w-3 h-3 mr-1" />
                                                    Sentiment: {act.sentiment_score}
                                                </span>
                                            )}
                                            {act.location_lat && (
                                                <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    Verified Loc
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {activities.length === 0 && <p className="text-center text-gray-400 py-8">No recent activity.</p>}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

function KpiCard({ title, value, icon: Icon, trend, trendUp, color = 'blue' }: any) {
    const colors: any = {
        blue: 'text-blue-600 bg-blue-50',
        indigo: 'text-indigo-600 bg-indigo-50',
        purple: 'text-purple-600 bg-purple-50',
        orange: 'text-orange-600 bg-orange-50',
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-full ${colors[color] || colors.blue}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                {trend && (
                    <div className="mt-4 flex items-center text-sm">
                        <span className={trendUp ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                            {trendUp ? '↑' : '↓'}
                        </span>
                        <span className="text-gray-500 ml-1">{trend}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
