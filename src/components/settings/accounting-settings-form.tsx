'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, AlertCircle } from 'lucide-react'
import { updateAccountingSettings } from '@/app/actions/accounting-settings'

export function AccountingSettingsForm({ settings, accounts, taxRates }: {
    settings: any,
    accounts: any[],
    taxRates: any[]
}) {
    const router = useRouter()
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
        const res = await updateAccountingSettings(formData)
        if (res.success) {
            router.refresh()
            alert('Settings saved successfully')
        } else {
            alert(res.error)
        }
        setLoading(false)
    }

    // Filter accounts by type if possible, or just show all for MVP
    // Assuming standard naming convention or type for filtering would be better
    // But for "User Friendly", showing "Accounts Receivable" type accounts is best.
    // However, schema `accounts` has `type` (String). I'll check types from `account_types`.
    // For now, I'll list all, user filters by search/dropdown.

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">Standard Accounting mappings are required for automated posting.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* AR Account */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Accounts Receivable (AR)
                        </label>
                        <select
                            className="w-full p-2.5 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.ar_account_id}
                            onChange={(e) => setFormData({ ...formData, ar_account_id: e.target.value })}
                        >
                            <option value="">Select AR Account...</option>
                            {accounts.map(a => (
                                <option key={a.id} value={a.id}>{a.code} - {a.name} ({a.type})</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Account used for unpaid invoices (Credit Sales).</p>
                    </div>

                    {/* Sales Account */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Default Sales / Income Account
                        </label>
                        <select
                            className="w-full p-2.5 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.sales_account_id}
                            onChange={(e) => setFormData({ ...formData, sales_account_id: e.target.value })}
                        >
                            <option value="">Select Income Account...</option>
                            {accounts.map(a => (
                                <option key={a.id} value={a.id}>{a.code} - {a.name} ({a.type})</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Default revenue account for services/products.</p>
                    </div>

                    {/* Tax Account */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Output VAT / Tax Payable
                        </label>
                        <select
                            className="w-full p-2.5 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.output_tax_account_id}
                            onChange={(e) => setFormData({ ...formData, output_tax_account_id: e.target.value })}
                        >
                            <option value="">Select Tax Account...</option>
                            {accounts.map(a => (
                                <option key={a.id} value={a.id}>{a.code} - {a.name} ({a.type})</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Account for tax liability collected on sales.</p>
                    </div>

                    {/* Default Tax Rate */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Default Tax Rate
                        </label>
                        <select
                            className="w-full p-2.5 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.default_sale_tax_id}
                            onChange={(e) => setFormData({ ...formData, default_sale_tax_id: e.target.value })}
                        >
                            <option value="">No Default Tax</option>
                            {taxRates.map(t => (
                                <option key={t.id} value={t.id}>{t.name} ({Number(t.rate)}%)</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {loading ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </div>
        </div>
    )
}
