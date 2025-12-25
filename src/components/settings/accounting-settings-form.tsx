'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, AlertCircle } from 'lucide-react'
import { updateAccountingSettings } from '@/app/actions/accounting-settings'
import { useToast } from "@/components/ui/use-toast"

export function AccountingSettingsForm({ settings, accounts, taxRates }: {
    settings: any,
    accounts: any[],
    taxRates: any[]
}) {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        ar_account_id: settings?.ar_account_id || '',
        sales_account_id: settings?.sales_account_id || '',
        output_tax_account_id: settings?.output_tax_account_id || '',
        default_sale_tax_id: settings?.default_sale_tax_id || ''
    })

    const handleSave = async () => {
        setLoading(true)

        try {
            const res = await updateAccountingSettings(formData)

            if (res.success) {
                toast({
                    title: "Success",
                    description: "Configuration saved successfully",
                    className: "bg-green-500 text-white border-none"
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

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/20">

                {/* Information Banner */}
                <div className="flex items-start gap-4 mb-8 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 p-5 rounded-xl border border-blue-100 dark:border-blue-800/50">
                    <AlertCircle className="h-6 w-6 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-base mb-1">Automated Journal Posting</h3>
                        <p className="text-sm opacity-90 leading-relaxed">
                            These settings control how the system automatically creates journal entries for Invoices and Payments.
                            Ensure you select the correct Control Accounts to keep your General Ledger accurate.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* AR Account */}
                    <div className="space-y-1.5 group">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1">
                            Accounts Receivable (AR)
                        </label>
                        <div className="relative">
                            <select
                                className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:bg-slate-100 dark:hover:bg-slate-900"
                                value={formData.ar_account_id}
                                onChange={(e) => setFormData({ ...formData, ar_account_id: e.target.value })}
                            >
                                <option value="">Select Account...</option>
                                {accounts.map(a => (
                                    <option key={a.id} value={a.id}>{a.code} - {a.name} ({a.type})</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-slate-500 font-medium ml-1">Asset account for unpaid invoices (Debtors Control).</p>
                    </div>

                    {/* Sales Account */}
                    <div className="space-y-1.5 group">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1">
                            Default Sales / Income
                        </label>
                        <div className="relative">
                            <select
                                className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:bg-slate-100 dark:hover:bg-slate-900"
                                value={formData.sales_account_id}
                                onChange={(e) => setFormData({ ...formData, sales_account_id: e.target.value })}
                            >
                                <option value="">Select Account...</option>
                                {accounts.map(a => (
                                    <option key={a.id} value={a.id}>{a.code} - {a.name} ({a.type})</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-slate-500 font-medium ml-1">Default revenue account for services & products.</p>
                    </div>

                    {/* Tax Account */}
                    <div className="space-y-1.5 group">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1">
                            Output VAT / Tax Payable
                        </label>
                        <div className="relative">
                            <select
                                className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:bg-slate-100 dark:hover:bg-slate-900"
                                value={formData.output_tax_account_id}
                                onChange={(e) => setFormData({ ...formData, output_tax_account_id: e.target.value })}
                            >
                                <option value="">Select Account...</option>
                                {accounts.map(a => (
                                    <option key={a.id} value={a.id}>{a.code} - {a.name} ({a.type})</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-slate-500 font-medium ml-1">Liability account for collected taxes.</p>
                    </div>

                    {/* Default Tax Rate */}
                    <div className="space-y-1.5 group">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1">
                            Default Tax Rate
                        </label>
                        <div className="relative">
                            <select
                                className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:bg-slate-100 dark:hover:bg-slate-900"
                                value={formData.default_sale_tax_id}
                                onChange={(e) => setFormData({ ...formData, default_sale_tax_id: e.target.value })}
                            >
                                <option value="">No Default Tax</option>
                                {taxRates.map(t => (
                                    <option key={t.id} value={t.id}>{t.name} ({Number(t.rate)}%)</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-slate-500 font-medium ml-1">Pre-selected tax rate for new invoices.</p>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Save Configuration
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
