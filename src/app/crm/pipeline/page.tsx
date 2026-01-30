import { getPipelines } from "@/app/actions/crm/masters";
import { getDealsForPipeline } from "@/app/actions/crm/deals";
import { PipelineKanban } from "@/components/crm/pipeline-kanban";
import { Plus, Filter, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PipelinePage({ searchParams }: { searchParams: { pipelineId?: string } }) {
    const pipelines = await getPipelines(true);

    if (pipelines.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50 dark:bg-zinc-950">
                <div className="bg-white dark:bg-zinc-900 p-12 rounded-3xl shadow-2xl border border-slate-100 dark:border-zinc-800 max-w-md">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Filter className="text-indigo-600 dark:text-indigo-400 w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Pipelines Found</h1>
                    <p className="text-slate-500 dark:text-zinc-400 mb-8">You need to set up a sales pipeline in settings to start tracking deals.</p>
                    <Link href="/settings/crm">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8">Go to Settings</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const activePipeline = pipelines.find(p => p.id === searchParams.pipelineId) || pipelines.find(p => p.is_default) || pipelines[0];
    const deals = await getDealsForPipeline(activePipeline.id);

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-950 overflow-hidden">
            {/* Elegant Header */}
            <div className="px-6 py-6 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        Deal Pipeline
                        <span className="text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-200/50 dark:border-indigo-800/50 uppercase tracking-widest">
                            {activePipeline.name}
                        </span>
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Track and manage your sales opportunities visually.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            placeholder="Find a deal..."
                            className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-zinc-800 border-transparent focus:bg-white dark:focus:bg-zinc-700 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-sm transition-all outline-none w-64 text-slate-900 dark:text-white"
                        />
                    </div>
                    <Link href="/crm/deals/new">
                        <Button className="bg-gradient-to-tr from-indigo-600 to-violet-600 hover:shadow-lg hover:shadow-indigo-500/20 text-white rounded-xl px-5 flex items-center gap-2 transition-all border-none">
                            <Plus className="w-4 h-4" />
                            New Deal
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Kanban Scroll Area */}
            <div className="flex-1 overflow-hidden">
                <PipelineKanban
                    pipeline={activePipeline}
                    initialDeals={deals}
                    pipelines={pipelines}
                />
            </div>
        </div>
    );
}
