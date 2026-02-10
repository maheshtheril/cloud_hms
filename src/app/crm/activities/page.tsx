import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import {
    Plus,
    Calendar,
    Phone,
    Mail,
    CheckSquare,
    Clock,
    BrainCircuit,
    MapPin,
    MessageSquare,
    FileText,
    Activity,
    Sparkles,
    ArrowRight,
    TrendingUp,
    Quote
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function ActivitiesPage() {
    const session = await auth()
    const tenantId = session?.user?.tenantId

    const activities = await (prisma as any).crm_activities.findMany({
        where: {
            deleted_at: null,
            ...(tenantId ? { tenant_id: tenantId } : {}),
        },
        include: {
            lead: { select: { name: true, company_name: true } },
            deal: { select: { title: true } }
        },
        orderBy: { created_at: 'desc' },
    })

    // Calculate stats
    const totalCount = activities.length
    const completedCount = activities.filter((a: any) => a.status === 'completed').length
    const avgSentiment = activities.length > 0
        ? Math.round(activities.reduce((acc: number, cur: any) => acc + (cur.sentiment_score || 0), 0) / activities.length)
        : 0

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'call': return <Phone className="w-5 h-5 text-indigo-500" />
            case 'meeting': return <Calendar className="w-5 h-5 text-purple-500" />
            case 'email': return <Mail className="w-5 h-5 text-cyan-500" />
            case 'task': return <CheckSquare className="w-5 h-5 text-emerald-500" />
            case 'note': return <FileText className="w-5 h-5 text-amber-500" />
            default: return <MessageSquare className="w-5 h-5 text-slate-500" />
        }
    }

    return (
        <div className="min-h-screen bg-futuristic">
            {/* Animated Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <div className="relative container mx-auto py-8 space-y-8 max-w-6xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 rounded-xl bg-orange-500 shadow-lg shadow-orange-500/20">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter text-gradient-primary uppercase">Activity Log</h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium md:ml-12">Universal interaction matrix with AI sentiment intelligence.</p>
                    </div>
                    <Link href="/crm/activities/new">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-500/20 border-none px-6 h-14 rounded-2xl group transition-all">
                            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                            <span className="font-bold uppercase tracking-widest text-[10px]">Log Terminal Activity</span>
                        </Button>
                    </Link>
                </div>

                {/* Performance HUD */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                    <div className="glass p-6 rounded-3xl border border-white/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Clock className="w-24 h-24 text-indigo-500" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-4">Total Interactions</h4>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{totalCount}</span>
                            <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold text-[10px] py-1">Synced</Badge>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-3xl border border-white/20 relative overflow-hidden group bg-gradient-to-br from-purple-500/5 to-transparent">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <BrainCircuit className="w-24 h-24 text-purple-500" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500 mb-4">Sentiment Index</h4>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{avgSentiment}%</span>
                            <div className="flex items-center gap-1 text-purple-600 font-bold text-[10px]">
                                <Sparkles className="w-3 h-3" />
                                Optimal High
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-3xl border border-white/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <CheckCircle2 className="w-24 h-24 text-emerald-500" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-4">Completion Rate</h4>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%</span>
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] py-1">Verified</Badge>
                        </div>
                    </div>
                </div>

                {/* Activities Timeline */}
                <div className="px-4 pb-12">
                    <div className="space-y-6 relative">
                        {/* Timeline vertical bar */}
                        <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-slate-200/50 dark:bg-white/10 hidden md:block" />

                        {activities.map((item: any) => (
                            <div key={item.id} className="relative flex flex-col md:flex-row gap-6 group">
                                {/* Timeline Dot */}
                                <div className="absolute left-10 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 bg-indigo-500 z-10 hidden md:block group-hover:scale-150 transition-transform" />

                                {/* Icon Box */}
                                <div className="md:ml-20 flex-none h-20 w-20 glass rounded-3xl border border-white/30 flex items-center justify-center shadow-lg group-hover:border-indigo-500/50 transition-colors bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
                                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-inner">
                                        {getActivityIcon(item.type)}
                                    </div>
                                </div>

                                {/* Content Box */}
                                <div className="flex-1 glass p-6 rounded-3xl border border-white/20 shadow-xl group-hover:translate-x-1 transition-transform bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl relative overflow-hidden">
                                    {/* Activity Type Badge Background Label */}
                                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] select-none pointer-events-none">
                                        <span className="text-8xl font-black uppercase italic tracking-tighter">{item.type}</span>
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200/50 dark:border-white/10 px-2">
                                                    {item.type}
                                                </Badge>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{item.subject}</h3>

                                            {/* Notes / Description with Quote vibe */}
                                            {item.description && (
                                                <div className="flex gap-2 text-slate-600 dark:text-slate-400 italic font-medium text-sm border-l-2 border-indigo-500/20 pl-4 py-1">
                                                    <Quote className="w-4 h-4 text-indigo-500/40 flex-none -scale-x-100" />
                                                    <p className="line-clamp-2 leading-relaxed">{item.description}</p>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                                {/* Related Entities */}
                                                {(item.lead || item.deal) && (
                                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                                        <TrendingUp className="w-3 h-3" />
                                                        {item.lead ? `Lead: ${item.lead.name}` : `Deal: ${item.deal.title}`}
                                                    </div>
                                                )}

                                                {/* AI Intelligence */}
                                                {(item.sentiment_score ?? 0) !== 0 && (
                                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                                                        <BrainCircuit className="w-3 h-3" />
                                                        Neural Score: {item.sentiment_score}
                                                    </div>
                                                )}

                                                {/* Location Check-in */}
                                                {item.location_lat && (
                                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                                        <MapPin className="w-3 h-3" />
                                                        Geo Verified
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                            <div className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg
                                                ${item.status === 'completed'
                                                    ? 'bg-emerald-500/20 text-emerald-600 shadow-emerald-500/10'
                                                    : 'bg-orange-500/20 text-orange-600 shadow-orange-500/10'}`}>
                                                {item.status}
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 group/btn rounded-lg text-slate-500">
                                                <span className="text-[10px] font-bold uppercase mr-2">Full Details</span>
                                                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activities.length === 0 && (
                            <div className="py-24 glass rounded-[3rem] border-2 border-dashed border-indigo-500/10 flex flex-col items-center justify-center text-center px-6">
                                <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                                    <Activity className="w-12 h-12 text-indigo-500/40" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">Null Activity Stream</h3>
                                <p className="text-slate-500 font-medium max-w-sm">The interaction matrix is empty. Log a new activity to establish operational gravity.</p>
                                <Link href="/crm/activities/new" className="mt-8">
                                    <Button className="bg-orange-600 text-white px-8 h-12 rounded-2xl font-bold uppercase tracking-widest text-[10px]">Initialize Stream</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

