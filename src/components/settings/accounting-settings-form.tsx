'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, AlertCircle } from 'lucide-react'
import { updateAccountingSettings } from '@/app/actions/accounting-settings'
import { useToast } from "@/components/ui/use-toast"

export function AccountingSettingsForm({ settings, accounts, taxRates, taxLabel }: {
    settings: any,
    accounts: any[],
    taxRates: any[],
    taxLabel: string
}) {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    // Form State with comprehensive fields
    const [formData, setFormData] = useState({
        // Sales Defaults
        ar_account_id: settings?.ar_account_id || '',
        sales_account_id: settings?.sales_account_id || '',
        output_tax_account_id: settings?.output_tax_account_id || '',
        default_sale_tax_id: settings?.default_sale_tax_id || '',

        // Purchasing Defaults
        ap_account_id: settings?.ap_account_id || '',
        purchase_account_id: settings?.purchase_account_id || '',
        input_tax_account_id: settings?.input_tax_account_id || '',

        // General Configuration
        fiscal_year_start: settings?.fiscal_year_start ? new Date(settings.fiscal_year_start).toISOString().split('T')[0] : '2025-04-01',
        fiscal_year_end: settings?.fiscal_year_end ? new Date(settings.fiscal_year_end).toISOString().split('T')[0] : '2026-03-31',
        currency_precision: settings?.currency_precision || 2,
        rounding_method: settings?.rounding_method || 'ROUND_HALF_UP'
    })

    const handleSave = async () => {
        setLoading(true)
        try {
            const res = await updateAccountingSettings(formData)

            if (res.success) {
                toast({
                    title: "Success",
                    description: "Accounting preferences saved successfully.",
                    className: "bg-green-600 text-white border-none"
                })
                router.refresh()
            } else {
                toast({
                    title: "Error",
                    description: res.error || 'Failed to save settings',
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: 'An unexpected error occurred',
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    // EMPTY STATE: If no accounts exist
    if (accounts.length === 0) {
        const handleSeed = async () => {
            setLoading(true);
            const { seedDefaultAccountsAction } = await import('@/app/actions/seed-accounts');
            const res = await seedDefaultAccountsAction();
            if (res.success) {
                toast({ title: "Success", description: "Default accounts created." });
                router.refresh();
            } else {
                toast({ title: "Error", description: "Failed to create accounts: " + res.error, variant: "destructive" });
            }
            setLoading(false);
        };

        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="mx-auto h-16 w-16 text-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Setup Required</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed">
                    Your Chart of Accounts is currently empty. We can generate a standard set of ledger accounts for you to get started instantly.
                </p>
                <button
                    onClick={handleSeed}
                    disabled={loading}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 inline-flex items-center gap-3"
                >
                    {loading ? "Generating..." : "Generate Standard Accounts"}
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">

            {/* SECTION 1: GENERAL CONFIGURATION */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                    General Financial Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Fiscal Year Start</label>
                        <input
                            type="date"
                            value={formData.fiscal_year_start}
                            onChange={e => setFormData({ ...formData, fiscal_year_start: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                        <p className="text-xs text-slate-400">Start of your financial reporting year.</p>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Fiscal Year End</label>
                        <input
                            type="date"
                            value={formData.fiscal_year_end}
                            onChange={e => setFormData({ ...formData, fiscal_year_end: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                        <p className="text-xs text-slate-400">End date for annual closing.</p>
                    </div>
                </div>
            </div>

            {/* SECTION 2: SALES & RECEIVABLES */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                    Sales & Receivables
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Accounts Receivable (AR)</label>
                        <select
                            value={formData.ar_account_id}
                            onChange={e => setFormData({ ...formData, ar_account_id: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select AR Account...</option>
                            {accounts.filter(a => a.type === 'Asset').map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
                        </select>
                        <p className="text-xs text-slate-500">Asset account for unpaid customer invoices.</p>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Default Income Account</label>
                        <select
                            value={formData.sales_account_id}
                            onChange={e => setFormData({ ...formData, sales_account_id: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select Revenue Account...</option>
                            {accounts.filter(a => a.type === 'Revenue').map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
                        </select>
                        <p className="text-xs text-slate-500">Default account for product/service sales.</p>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Output {taxLabel} (Tax Liability)</label>
                        <select
                            value={formData.output_tax_account_id}
                            onChange={e => setFormData({ ...formData, output_tax_account_id: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select Liability Account...</option>
                            {accounts.filter(a => a.type === 'Liability').map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
                        </select>
                        <p className="text-xs text-slate-500">Where tax collected on sales is recorded.</p>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Default {taxLabel} Rate</label>
                        <select
                            value={formData.default_sale_tax_id}
                            onChange={e => setFormData({ ...formData, default_sale_tax_id: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">No Default Tax</option>
                            {taxRates.map(t => <option key={t.id} value={t.id}>{t.name} ({Number(t.rate)}%)</option>)}
                        </select>
                        <p className="text-xs text-slate-500">Auto-selected tax rate for new invoices.</p>
                    </div>
                </div>
            </div>

            {/* SECTION 3: PURCHASING & PAYABLES */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                    Purchasing & Payables
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Accounts Payable (Creditors)</label>
                        <select
                            value={formData.ap_account_id}
                            onChange={e => setFormData({ ...formData, ap_account_id: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select AP Account...</option>
                            {accounts.filter(a => a.type === 'Liability').map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
                        </select>
                        <p className="text-xs text-slate-500">Liability account for unpaid vendor bills.</p>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Default Expense Account</label>
                        <select
                            value={formData.purchase_account_id}
                            onChange={e => setFormData({ ...formData, purchase_account_id: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select Expense Account...</option>
                            {accounts.filter(a => a.type === 'Expense' || a.type === 'Cost of Goods Sold').map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
                        </select>
                        <p className="text-xs text-slate-500">Default category for vendor bills (e.g. COGS or General).</p>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Input {taxLabel} (Tax Asset)</label>
                        <select
                            value={formData.input_tax_account_id}
                            onChange={e => setFormData({ ...formData, input_tax_account_id: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select Tax Account...</option>
                            {accounts.filter(a => a.type === 'Liability' || a.type === 'Asset').map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
                        </select>
                        <p className="text-xs text-slate-500">Account for tax paid on purchases (claimable).</p>
                    </div>
                </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                    {loading ? "Saving..." : <><Save className="h-5 w-5" /> Save Preferences</>}
                </button>
            </div>
        </div>
    )
}
