import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Plus, Target, TrendingUp, DollarSign, Trophy, Percent, Calendar, Zap } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function DealsPage() {
    const session = await auth()
    const tenantId = session?.user?.tenantId

    const deals = await prisma.crm_deals.findMany({
        where: {
            deleted_at: null,
            ...(tenantId && { tenant_id: tenantId })
        },
        orderBy: { created_at: 'desc' },
        include: { stage: true, pipeline: true }
    })

    const wonDeals = deals.filter(d => d.status === 'won')
    const activeDeals = deals.filter(d => d.status === 'open')
    const totalValue = deals.reduce((sum, d) => sum + (Number(d.value) || 0), 0)
    const wonValue = wonDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0)

    return (
        <div className="min-h-screen bg-futuristic">
            {/* Animated Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000" />
            </div>

            <div className="relative container mx-auto py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm border border-gradient-secondary">
                            <Target className="h-8 w-8 text-emerald-400 dark:text-emerald-300" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gradient-secondary">
                                Deals Pipeline
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-lg mt-1">
                                Track opportunities and revenue • {deals.length} total deals
                            </p>
                        </div>
                    </div>
                    <Link href="/crm/deals/new">
                        <Button className="btn-futuristic-secondary">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur" />
                            <Plus className="w-4 h-4 mr-2" />
                            Add Deal
                        </Button>
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-6 md:grid-cols-4">
                    <div className="card-stat-cyan p-6 rounded-2xl shadow-xl hover-glow-cyan transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Total Pipeline</p>
                            <Target className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">
                            ${totalValue.toLocaleString()}
                        </div>
                    </div>

                    <div className="glass border-gradient-secondary bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/50 dark:to-transparent p-6 rounded-2xl shadow-xl hover:shadow-emerald-500/20 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Won Deals</p>
                            <Trophy className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">
                            {wonDeals.length}
                        </div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                            ${wonValue.toLocaleString()} closed
                        </p>
                    </div>

                    <div className="card-stat-purple p-6 rounded-2xl shadow-xl hover-glow-purple transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Active Deals</p>
                            <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">
                            {activeDeals.length}
                        </div>
                    </div>

                    <div className="glass border-gradient-accent bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/50 dark:to-transparent p-6 rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Win Rate</p>
                            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">
                            {deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0}%
                        </div>
                    </div>
                </div>

                {/* Deals Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {deals.map((deal) => (
                        <div
                            key={deal.id}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl hover:border-emerald-500/30 dark:hover:border-emerald-400/30 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Status Badge - Top Right */}
                            <div className="absolute top-4 right-4">
                                <Badge
                                    className={`${deal.status === 'won'
                                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/50'
                                            : deal.status === 'lost'
                                                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/50'
                                                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                                        } uppercase font-bold`}
                                >
                                    {deal.status}
                                </Badge>
                            </div>

                            <div className="space-y-4 mt-4">
                                {/* Title */}
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1 pr-20">
                                        {deal.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {deal.pipeline?.name || 'Default Pipeline'}
                                    </p>
                                </div>

                                {/* Value */}
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 border border-emerald-200/50 dark:border-emerald-700/30">
                                    <div className="p-2 rounded-lg bg-emerald-500/20">
                                        <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-gradient-secondary">
                                            {Number(deal.value || 0).toLocaleString()}
                                        </div>
                                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                            {deal.currency || 'USD'}
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Stage</span>
                                        <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700/30">
                                            {deal.stage?.name || 'Unknown'}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                                            <Percent className="w-3 h-3" />
                                            Probability
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/50 transition-all duration-500"
                                                    style={{ width: `${deal.probability || 0}%` }}
                                                />
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white min-w-[2.5rem] text-right">
                                                {deal.probability || 0}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>Created {formatDistanceToNow(new Date(deal.created_at), { addSuffix: true })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {deals.length === 0 && (
                        <div className="col-span-full">
                            <div className="card-futuristic text-center py-16">
                                <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-sm border border-emerald-500/20 mb-6">
                                    <Target className="h-16 w-16 text-emerald-400 mx-auto" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                    No Deals in Pipeline
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg max-w-md mx-auto">
                                    Start tracking opportunities and close more revenue
                                </p>
                                <Link href="/crm/deals/new">
                                    <Button className="btn-futuristic-secondary">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create First Deal
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
