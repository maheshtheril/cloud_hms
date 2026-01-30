import { getPipelines } from "@/app/actions/crm/masters";
import { getDealsForPipeline } from "@/app/actions/crm/deals";
import { PipelineKanban } from "@/components/crm/pipeline-kanban";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import {
    Plus, LayoutGrid, List, Search,
    TrendingUp, Trophy, Zap, Target
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCompanyDefaultCurrency } from "@/app/actions/currency";
import { formatCurrency } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const dynamic = 'force-dynamic';
// Cache breaker: 2026-01-30 21:55

export default async function DealsPage({ searchParams }: { searchParams: { view?: string, pipelineId?: string } }) {
    const session = await auth();
    const tenantId = session?.user?.tenantId;
    const view = searchParams.view || 'board'; // Default to Board view as per world standard

    // 1. Fetch Master Data
    const pipelines = await getPipelines(true);
    const defaultCurrency = await getCompanyDefaultCurrency();

    if (pipelines.length === 0) {
        return (
            <div className="p-20 text-center">
                <p className="text-xl font-bold">Please set up a pipeline in settings first.</p>
                <p className="text-xs text-slate-400 mt-4">Debug: V:2240 | CID:{(session?.user as any)?.id?.substring(0, 5)} | TID:{(session?.user as any)?.tenantId || 'X'} | t_id:{(session?.user as any)?.tenant_id || 'X'}</p>
            </div>
        );
    }

    const activePipeline = pipelines.find(p => p.id === searchParams.pipelineId) || pipelines.find(p => p.is_default) || pipelines[0];

    // 2. Fetch Deals
    const deals = await getDealsForPipeline(activePipeline.id);
    const wonDeals = deals.filter(d => d.status === 'won');
    const totalValue = deals.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-950 overflow-hidden">
            {/* --- Unified Header --- */}
            <div className="px-6 py-4 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20 relative">
                        <Target className="w-6 h-6 text-white" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                        </span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            Deals Management
                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 dark:border-zinc-700">
                                {deals.length}
                            </span>
                            <span className="text-[8px] text-indigo-400 font-mono opacity-50">V:2240</span>
                        </h1>
                        <p className="text-xs text-slate-500 font-medium">{activePipeline.name} • {formatCurrency(totalValue, defaultCurrency.code)} in Pipeline</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* --- View Switcher (Segmented Control) --- */}
                    <div className="bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl flex items-center border border-slate-200 dark:border-zinc-700">
                        <Link href={`?view=board&pipelineId=${activePipeline.id}`}>
                            <Button
                                variant={view === 'board' ? 'secondary' : 'ghost'}
                                size="sm"
                                className={cn("rounded-lg text-xs h-8 px-3 gap-2", view === 'board' && "bg-white dark:bg-zinc-700 shadow-sm border border-slate-200 dark:border-zinc-600")}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                                Board
                            </Button>
                        </Link>
                        <Link href={`?view=list&pipelineId=${activePipeline.id}`}>
                            <Button
                                variant={view === 'list' ? 'secondary' : 'ghost'}
                                size="sm"
                                className={cn("rounded-lg text-xs h-8 px-3 gap-2", view === 'list' && "bg-white dark:bg-zinc-700 shadow-sm border border-slate-200 dark:border-zinc-600")}
                            >
                                <List className="w-3.5 h-3.5" />
                                List
                            </Button>
                        </Link>
                    </div>

                    <Link href="/crm/deals/new">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 h-10 text-xs font-bold gap-2">
                            <Plus className="w-4 h-4" />
                            New Deal
                        </Button>
                    </Link>
                </div>
            </div>

            {/* --- Stats Strip (Hidden in Board View to save space) --- */}
            {view === 'list' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 pb-0">
                    <StatCard title="Total Pipeline" value={formatCurrency(totalValue, defaultCurrency.code)} icon={<Target className="w-4 h-4" />} color="blue" />
                    <StatCard title="Won Deals" value={wonDeals.length.toString()} icon={<Trophy className="w-4 h-4" />} color="emerald" sub={`${formatCurrency(wonDeals.reduce((s, d) => s + d.value, 0), defaultCurrency.code)}`} />
                    <StatCard title="Win Rate" value={`${deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0}%`} icon={<TrendingUp className="w-4 h-4" />} color="indigo" />
                    <StatCard title="Active" value={deals.filter(d => d.status === 'open').length.toString()} icon={<Zap className="w-4 h-4" />} color="amber" />
                </div>
            )}

            {/* --- Main Content Area --- */}
            <div className="flex-1 overflow-hidden">
                {view === 'board' ? (
                    <PipelineKanban pipeline={activePipeline} initialDeals={deals} />
                ) : (
                    <div className="p-6 h-full overflow-y-auto">
                        <DealsListView deals={deals} currency={defaultCurrency.code} />
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Internal Helper Components ---

function StatCard({ title, value, icon, sub, color }: any) {
    const colors: any = {
        blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/10 border-blue-100",
        emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100",
        indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100",
        amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/10 border-amber-100"
    };
    return (
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{title}</p>
                <div className={cn("p-1.5 rounded-lg border", colors[color])}>{icon}</div>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{value}</div>
            {sub && <p className="text-[10px] text-slate-500 mt-1 font-medium">{sub}</p>}
        </div>
    );
}

function DealsListView({ deals, currency }: { deals: any[], currency: string }) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Deal Name</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stage</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Value</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Owner</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {deals.map(deal => (
                        <tr key={deal.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                            <td className="px-6 py-4">
                                <Link href={`/crm/deals/${deal.id}`} className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">
                                    {deal.title}
                                </Link>
                                <p className="text-[10px] text-slate-400 mt-0.5">{deal.account?.name || 'N/A'}</p>
                            </td>
                            <td className="px-6 py-4">
                                <Badge className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-none text-[10px] font-bold">
                                    {deal.stage?.name}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                                {formatCurrency(deal.value, deal.currency || currency)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-[8px]">{deal.owner?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">{deal.owner?.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <Badge className={cn(
                                    "uppercase text-[9px] font-black tracking-tighter",
                                    deal.status === 'won' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" :
                                        deal.status === 'lost' ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600" :
                                            "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                                )}>
                                    {deal.status}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
