import { auth } from "@/auth"
import { getJournalEntries } from "@/app/actions/accounting-journals"
import { Book, Filter, Search, FileText, ArrowUpRight, ArrowDownLeft } from "lucide-react"

// Simple formatter for currency
// Simple formatter for currency
const formatCurrency = (amount: number, currency: string | null = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency || 'INR', // Fallback if null passed
    }).format(amount);
}

export default async function JournalsPage() {
    const session = await auth()

    // Fetch Data (Server Side)
    const { data: entries, error } = await getJournalEntries();

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Book className="h-6 w-6 text-indigo-600" />
                        General Ledger / Journal Entries
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Review all financial transactions posted to your accounts.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shadow-sm flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Date Filter
                    </button>
                    {/* Add Export/Print buttons here later */}
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                    Error loading journals: {error}
                </div>
            )}

            {/* DEBUG INFO */}
            <div className="p-2 text-xs text-gray-400">
                Entries Found: {entries?.length ?? 0}
            </div>

            {/* Journal Entries List */}
            <div className="space-y-4">
                {entries?.map((entry) => (
                    <div key={entry.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                        {/* Entry Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                                        {entry.ref || 'NO REF'}
                                    </span>
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {entry.date ? new Date(entry.date).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                                    {entry.ref || "Journal Entry"}
                                </h3>
                                {entry.hms_invoice && (
                                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        Invoice: {entry.hms_invoice.invoice_number}
                                        {entry.hms_invoice.hms_patient && ` • ${entry.hms_invoice.hms_patient.first_name} ${entry.hms_invoice.hms_patient.last_name}`}
                                    </div>
                                )}
                            </div>
                            <div className="text-xl font-bold text-slate-900 dark:text-white">
                                {/* World-Class Display: Use specialized header amount/currency if available, else derive from lines */}
                                {(entry as any).amount_in_company_currency
                                    ? formatCurrency(Number((entry as any).amount_in_company_currency), (entry as any).currencies?.code)
                                    : formatCurrency(entry.journal_entry_lines.reduce((sum: number, line: any) => sum + Number(line.debit || 0), 0))
                                }
                            </div>
                        </div>

                        {/* Entry Lines (T-Account View) */}
                        <div className="bg-slate-50 dark:bg-zinc-950/50 rounded-xl overflow-hidden border border-slate-100 dark:border-zinc-800/50">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-100 dark:bg-zinc-800/50 text-slate-500 dark:text-slate-400 font-medium">
                                    <tr>
                                        <th className="px-4 py-2">Account</th>
                                        <th className="px-4 py-2 text-right">Debit</th>
                                        <th className="px-4 py-2 text-right">Credit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {entry.journal_entry_lines.map((line: any) => (
                                        <tr key={line.id} className="hover:bg-white dark:hover:bg-zinc-900/50 transition-colors">
                                            <td className="px-4 py-2.5">
                                                <div className="font-semibold text-slate-700 dark:text-slate-300">
                                                    {line.accounts?.name || 'Unknown Account'}
                                                </div>
                                                <div className="text-xs text-slate-400 font-mono">
                                                    {line.accounts?.code}
                                                </div>
                                                {line.description && (
                                                    <div className="text-xs text-slate-400 mt-0.5 italic">
                                                        {line.description}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-2.5 text-right font-medium text-slate-600 dark:text-slate-300">
                                                {Number(line.debit) > 0 ? (
                                                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                                                        {formatCurrency(Number(line.debit))}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className="px-4 py-2.5 text-right font-medium text-slate-600 dark:text-slate-300">
                                                {Number(line.credit) > 0 ? (
                                                    <span className="text-slate-600 dark:text-slate-400 flex items-center justify-end gap-1">
                                                        {formatCurrency(Number(line.credit))}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}

                {entries?.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 mb-4">
                            <Search className="h-6 w-6" />
                        </div>
                        <p>No journal entries found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
