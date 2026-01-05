import { BackButton } from '@/components/ui/back-button'
import { notFound } from 'next/navigation'
import { getLead } from '@/app/actions/crm/leads'
import { formatCurrency } from '@/lib/currency'
import { formatDistanceToNow } from 'date-fns'
import {
    Sparkles,
    ArrowLeft,
    Calendar,
    Mail,
    Phone,
    Building2,
    User,
    Target,
    TrendingUp,
    Clock,
    ShieldCheck,
    Edit,
    Trash2,
    MoreVertical
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export const dynamic = 'force-dynamic'

interface Props {
    params: {
        id: string
    }
}

export default async function LeadDetailPage(props: Props) {
    const params = await props.params
    const lead = await getLead(params.id) as any

    if (!lead) return notFound()

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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <BackButton href="/crm/leads" />
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-black text-gradient-primary tracking-tighter uppercase">{lead.name}</h1>
                                {lead.is_hot && (
                                    <Badge className="bg-amber-500 text-white border-none animate-pulse">
                                        <Sparkles className="w-3 h-3 mr-1" /> Priority
                                    </Badge>
                                )}
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-1">
                                <Building2 className="w-4 h-4" /> {lead.company_name || 'Individual Prospect'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={`/crm/leads/${lead.id}/edit`}>
                            <Button className="bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/50 dark:border-white/10 rounded-xl shadow-lg backdrop-blur-md px-6">
                                <Edit className="w-4 h-4 mr-2" /> Re-engage
                            </Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-xl border-slate-200/50 dark:border-white/10 bg-white/40 backdrop-blur-md">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-white/10 shadow-2xl overflow-hidden rounded-xl">
                                <DropdownMenuItem className="text-rose-600 font-bold focus:bg-rose-50 dark:focus:bg-rose-900/20 cursor-pointer">
                                    <Trash2 className="w-4 h-4 mr-2" /> Purge Opportunity
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Intelligence Summary Card */}
                        <div className="glass-card bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent p-8 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Sparkles className="w-32 h-32 text-indigo-500" />
                            </div>
                            <div className="flex items-center gap-3 mb-6 text-indigo-600 dark:text-indigo-400">
                                <div className="p-2 rounded-lg bg-indigo-500/20">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tighter">Intelligent Summary</h3>
                            </div>
                            <div className="prose prose-indigo dark:prose-invert max-w-none">
                                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 italic font-medium">
                                    {lead.ai_summary || "Synthetic analysis in progress... No specific intelligence footprint detected yet."}
                                </p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Contact Card */}
                            <div className="glass-card bg-white/40 dark:bg-slate-900/40 p-6 rounded-2xl border border-white/20 shadow-xl backdrop-blur-md">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Liaison Endpoint</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{lead.contact_name}</p>
                                            <p className="text-xs text-slate-500">Primary Contact</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{lead.email || 'No Email'}</p>
                                            <p className="text-xs text-slate-500">Signal Protocol</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{lead.phone || 'No Phone'}</p>
                                            <p className="text-xs text-slate-500">Direct Comms</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Card */}
                            <div className="glass-card bg-white/40 dark:bg-slate-900/40 p-6 rounded-2xl border border-white/20 shadow-xl backdrop-blur-md">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Temporal Sync</h4>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Created Signal</p>
                                            <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</p>
                                        </div>
                                    </div>
                                    {lead.next_followup_date && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Next Sync Protocol</p>
                                                <p className="text-xs text-amber-600 font-bold">{formatDistanceToNow(new Date(lead.next_followup_date), { addSuffix: true })}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3 opacity-50">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 italic">No historical activities logged.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-6">
                        {/* Status Guard Card */}
                        <div className="glass-card bg-slate-900 text-white p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <ShieldCheck className="w-20 h-20" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4">Signal Integrity</h4>
                            <div className="space-y-5">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Operational Stage</p>
                                    <Badge className="mt-1 bg-indigo-500 text-white border-none font-black text-xs px-3 py-1">
                                        {lead.stage?.name || lead.status?.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Confidence</p>
                                        <p className="text-2xl font-black text-white">{lead.probability ? Number(lead.probability) : 0}%</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">AI Score</p>
                                        <p className="text-2xl font-black text-indigo-400">{lead.lead_score || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Value Metric Card */}
                        <div className="glass-card bg-white/60 dark:bg-slate-900/60 p-6 rounded-3xl border border-white/20 shadow-xl backdrop-blur-xl">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Potential Yield</h4>
                            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                                {formatCurrency(Number(lead.estimated_value) || 0, lead.currency || 'INR')}
                            </p>
                            <p className="text-xs text-slate-500 mt-2 font-medium">Estimated Conversion Value</p>

                            <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Rep</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded bg-indigo-500/10 flex items-center justify-center text-[8px] font-black text-indigo-600">
                                            {lead.owner?.name?.substring(0, 2) || '??'}
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{lead.owner?.name || 'Unassigned'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Account Type</span>
                                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{lead.target_type?.name || 'Standard'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Input Vector</span>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{lead.source?.name || 'Manual Signal'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick View Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/20 dark:bg-slate-900/20 border border-white/10 text-center backdrop-blur-sm">
                                <Clock className="w-5 h-5 mx-auto mb-2 text-indigo-500 opacity-60" />
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Next Sync</p>
                                <p className="text-xs font-black mt-1">
                                    {lead.next_followup_date ? new Date(lead.next_followup_date).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/20 dark:bg-slate-900/20 border border-white/10 text-center backdrop-blur-sm">
                                <Target className="w-5 h-5 mx-auto mb-2 text-pink-500 opacity-60" />
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Pipeline</p>
                                <p className="text-xs font-black mt-1 truncate">{lead.pipeline?.name || 'Default'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
