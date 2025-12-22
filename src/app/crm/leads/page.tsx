import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Plus, Sparkles, TrendingUp, IndianRupee, User, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/currency'

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
    const session = await auth()
    const tenantId = session?.user?.tenantId

    const leads = await prisma.crm_leads.findMany({
        where: {
            ...(tenantId ? { tenant_id: tenantId } : {}),
            deleted_at: null
        },
        orderBy: { created_at: 'desc' },
        include: { stage: true }
    })

    const hotLeadsCount = leads.filter(l => l.is_hot).length
    const totalValue = leads.reduce((sum, l) => sum + (Number(l.estimated_value) || 0), 0)

    return (
        <div className="min-h-screen bg-futuristic">
            {/* Animated Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000" />
            </div>

            <div className="relative container mx-auto py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-gradient-primary">
                            <TrendingUp className="h-8 w-8 text-pink-400 dark:text-pink-300" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gradient-primary">
                                Smart Leads
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-lg mt-1">
                                AI-driven pipeline management • {leads.length} total leads
                            </p>
                        </div>
                    </div>
                    <Link href="/crm/leads/new">
                        <Button className="btn-futuristic-primary">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur" />
                            <Plus className="w-4 h-4 mr-2" />
                            Create Lead
                        </Button>
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="card-stat-purple p-6 rounded-2xl shadow-xl hover-glow-purple transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Leads</p>
                            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">
                            {leads.length}
                        </div>
                    </div>

                    <div className="card-stat-pink p-6 rounded-2xl shadow-xl hover-glow-pink transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-pink-700 dark:text-pink-300">Hot Leads</p>
                            <Sparkles className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">
                            {hotLeadsCount}
                        </div>
                    </div>

                    <div className="card-stat-cyan p-6 rounded-2xl shadow-xl hover-glow-cyan transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Pipeline Value</p>
                            <IndianRupee className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(totalValue, 'IN')}
                        </div>
                    </div>
                </div>

                {/* Leads Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {leads.map((lead) => (
                        <div
                            key={lead.id}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl hover:border-purple-500/30 dark:hover:border-purple-400/30 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Hot Badge */}
                            {lead.is_hot && (
                                <div className="absolute top-0 right-0 ">
                                    <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-bl-xl rounded-tr-2xl font-bold flex items-center gap-1 shadow-lg shadow-orange-500/50">
                                        <Sparkles className="w-3 h-3" />
                                        HOT
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 truncate">
                                            {lead.name}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                            {lead.company_name || 'No Company'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gradient-primary">
                                            {formatCurrency(Number(lead.estimated_value) || 0, 'IN')}
                                        </div>
                                    </div>
                                </div>

                                {/* Stage Badge */}
                                <Badge
                                    className={`${lead.stage?.type === 'won'
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/30'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                        }`}
                                >
                                    {lead.stage?.name || lead.status}
                                </Badge>

                                {/* Lead Score */}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400 font-medium">AI Score</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${(lead.lead_score || 0) > 70
                                                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/50'
                                                    : (lead.lead_score || 0) > 40
                                                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg shadow-amber-500/50'
                                                        : 'bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/50'
                                                    }`}
                                                style={{ width: `${lead.lead_score || 0}%` }}
                                            />
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white min-w-[2rem] text-right">
                                            {lead.lead_score}
                                        </span>
                                    </div>
                                </div>

                                {/* AI Summary */}
                                {lead.ai_summary && (
                                    <div className="bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-950/30 dark:to-cyan-950/30 p-3 rounded-xl text-xs text-purple-900 dark:text-purple-200 border border-purple-200/50 dark:border-purple-700/30">
                                        <span className="font-bold mr-1">AI Insight:</span>
                                        {lead.ai_summary}
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        <span>{lead.contact_name || 'No contact'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {leads.length === 0 && (
                        <div className="col-span-full">
                            <div className="card-futuristic text-center py-16">
                                <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 mb-6">
                                    <TrendingUp className="h-16 w-16 text-purple-400 mx-auto" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                    No Leads Yet
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg max-w-md mx-auto">
                                    Start building your pipeline with AI-powered lead management
                                </p>
                                <Link href="/crm/leads/new">
                                    <Button className="btn-futuristic-primary">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create First Lead
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
