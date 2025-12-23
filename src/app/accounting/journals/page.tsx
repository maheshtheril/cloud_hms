import { auth } from "@/auth"
import { Book, Plus, Search, Filter, ArrowRight } from "lucide-react"

export default async function JournalsPage() {
    const session = await auth()

    return (
        <div className="p-6 space-y-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Book className="h-6 w-6 text-indigo-600" />
                        Accounting Journals
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        View and manage financial transactions and journal entries.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shadow-sm flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        New Entry
                    </button>
                </div>
            </div>

            {/* Placeholder Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'General Journal', count: '124 Entries', color: 'bg-blue-500' },
                    { label: 'Sales Journal', count: '852 Entries', color: 'bg-emerald-500' },
                    { label: 'Purchase Journal', count: '432 Entries', color: 'bg-amber-500' }
                ].map((item) => (
                    <div key={item.label} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${item.color} bg-opacity-10 text-opacity-100`}>
                                <Book className={`h-6 w-6 ${item.color.replace('bg-', 'text-')}`} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{item.count}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.label}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">View detailed ledger entries for {item.label.toLowerCase()}.</p>
                        <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-bold group-hover:gap-3 transition-all">
                            Open Journal <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Empty State / Table Placeholder */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 mb-4">
                    <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Recent Transactions</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                    We couldn't find any journal entries for the current period. Start by creating a new entry or importing data.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by reference..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
