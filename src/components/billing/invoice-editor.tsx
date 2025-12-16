'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Search, Save, FileText, Calendar, User, DollarSign } from 'lucide-react'
import { createInvoice } from '@/app/actions/billing'

export function InvoiceEditor({ patients, billableItems, taxConfig }: {
    patients: any[],
    billableItems: any[],
    taxConfig: { defaultTax: any, taxRates: any[] }
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // State
    const [selectedPatientId, setSelectedPatientId] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [lines, setLines] = useState<any[]>([
        { id: 1, product_id: '', description: '', quantity: 1, unit_price: 0, tax_rate_id: '', tax_amount: 0, discount_amount: 0 }
    ])

    const [globalDiscount, setGlobalDiscount] = useState(0)

    // Removed global tax state
    // const [selectedTaxId, setSelectedTaxId] = useState('')

    // Derived State
    const activePatient = patients.find(p => p.id === selectedPatientId)
    const subtotal = lines.reduce((sum, line) => sum + ((line.quantity * line.unit_price) - (line.discount_amount || 0)), 0)
    const totalTax = lines.reduce((sum, line) => sum + (line.tax_amount || 0), 0)
    const grandTotal = Math.max(0, subtotal + totalTax - globalDiscount)

    const handleAddItem = () => {
        setLines([...lines, {
            id: Date.now(),
            product_id: '',
            description: '',
            quantity: 1,
            unit_price: 0,
            tax_rate_id: taxConfig.defaultTax?.id || '', // Default to company tax
            tax_amount: 0,
            discount_amount: 0
        }])
    }

    const handleRemoveItem = (id: number) => {
        if (lines.length > 1) {
            setLines(lines.filter(l => l.id !== id))
        }
    }

    const updateLine = (id: number, field: string, value: any) => {
        setLines(lines.map(line => {
            if (line.id === id) {
                const updated = { ...line, [field]: value }

                // Auto-fill details if product selected
                if (field === 'product_id') {
                    const product = billableItems.find(i => i.id === value)
                    if (product) {
                        updated.description = product.description || product.label
                        updated.unit_price = product.price

                        // Waterfall Logic: Product Category Tax -> Company Default
                        // Note: product.categoryTaxId comes from our updated getBillableItems
                        const taxToApply = product.categoryTaxId || taxConfig.defaultTax?.id;
                        updated.tax_rate_id = taxToApply || '';
                    }
                }

                // Recalculate Tax if relevant fields change
                if (['product_id', 'quantity', 'unit_price', 'tax_rate_id', 'discount_amount'].includes(field) || field === 'product_id') {
                    // Get current tax rate
                    const currentTaxId = field === 'tax_rate_id' ? value : updated.tax_rate_id;
                    const taxRateObj = taxConfig.taxRates.find(t => t.id === currentTaxId);
                    const rate = taxRateObj ? taxRateObj.rate : 0;

                    // Taxable Base = (Qty * Price) - Discount
                    const baseTotal = (updated.quantity * updated.unit_price) - (updated.discount_amount || 0);
                    updated.tax_amount = (Math.max(0, baseTotal) * rate) / 100;
                }

                return updated
            }
            return line
        }))
    }

    const handleSave = async (status: 'draft' | 'posted') => {
        if (!selectedPatientId) return alert('Please select a patient')

        setLoading(true)
        const res = await createInvoice({
            patient_id: selectedPatientId,
            date,
            line_items: lines, // lines now contain tax_rate_id and tax_amount
            status,
            total_discount: globalDiscount
            // Removed global tax fields
        })

        if (res.success) {
            router.push('/hms/billing')
            router.refresh()
        } else {
            alert(res.error || 'Failed to save')
        }
        setLoading(false)
    }

    return (
        <div className="space-y-6">
            {/* Header / Context */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex-1 w-full md:w-auto">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer / Patient</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <select
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={selectedPatientId}
                            onChange={(e) => setSelectedPatientId(e.target.value)}
                        >
                            <option value="">Select Patient...</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="w-full md:w-48">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Invoice Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="date"
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Smart Context Card */}
            {activePatient && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-900">{activePatient.first_name} {activePatient.last_name}</h4>
                        <div className="text-sm text-blue-700 flex gap-4 mt-0.5">
                            <span>ID: {activePatient.id.slice(0, 8)}</span>
                            <span>•</span>
                            <span>Phone: {activePatient.phone || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Editor Grid */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-1">#</div>
                    <div className="col-span-4">Service / Product</div>
                    <div className="col-span-2 text-right">Qty</div>
                    <div className="col-span-1 text-right">Price</div>
                    <div className="col-span-1 text-right">Disc.</div>
                    <div className="col-span-2 text-right">Tax</div>
                    <div className="col-span-1 text-right">Total</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {lines.map((line, idx) => (
                        <div key={line.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors group">
                            <div className="col-span-1 text-gray-400 font-mono text-sm">{idx + 1}</div>

                            <div className="col-span-4 space-y-2">
                                <select
                                    className="w-full p-2 bg-transparent border-b border-transparent focus:border-blue-500 outline-none font-medium text-gray-900"
                                    value={line.product_id}
                                    onChange={(e) => updateLine(line.id, 'product_id', e.target.value)}
                                >
                                    <option value="">Select Item (or type below)...</option>
                                    {billableItems.map(item => (
                                        <option key={item.id} value={item.id}>{item.label} - ${item.price}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Description..."
                                    className="w-full text-sm text-gray-500 bg-transparent outline-none placeholder:text-gray-300"
                                    value={line.description}
                                    onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                                />
                            </div>

                            <div className="col-span-2">
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full text-right p-2 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                    value={line.quantity}
                                    onChange={(e) => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                                />
                            </div>

                            <div className="col-span-1">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-full text-right p-2 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                    value={line.unit_price}
                                    onChange={(e) => updateLine(line.id, 'unit_price', parseFloat(e.target.value) || 0)}
                                />
                            </div>

                            <div className="col-span-1">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0"
                                    className="w-full text-right p-2 border border-gray-200 rounded focus:border-blue-500 outline-none text-red-500"
                                    value={line.discount_amount || ''}
                                    onChange={(e) => updateLine(line.id, 'discount_amount', parseFloat(e.target.value) || 0)}
                                />
                            </div>

                            <div className="col-span-2">
                                <select
                                    className="w-full text-right p-2 border border-gray-200 rounded focus:border-blue-500 outline-none text-sm"
                                    value={line.tax_rate_id}
                                    onChange={(e) => updateLine(line.id, 'tax_rate_id', e.target.value)}
                                >
                                    <option value="">No Tax</option>
                                    {taxConfig.taxRates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.rate}%)</option>
                                    ))}
                                </select>
                                <div className="text-right text-xs text-gray-400 mt-1">
                                    ${(line.tax_amount || 0).toFixed(2)}
                                </div>
                            </div>


                            <div className="col-span-1 flex items-center justify-end gap-2">
                                <span className="font-mono font-medium">
                                    ${((line.quantity * line.unit_price) - (line.discount_amount || 0) + (line.tax_amount || 0)).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => handleRemoveItem(line.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <button
                        onClick={handleAddItem}
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Line Item
                    </button>
                </div>
            </div>

            {/* Footer / Totals */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="flex gap-3">
                    <button
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        onClick={() => handleSave('draft')}
                        disabled={loading}
                    >
                        Save as Draft
                    </button>
                    <button
                        className="px-6 py-2.5 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg shadow-gray-200"
                        onClick={() => handleSave('posted')}
                        disabled={loading}
                    >
                        <Save className="h-4 w-4" />
                        {loading ? 'Processing...' : 'Post Invoice'}
                    </button>
                </div>

                <div className="w-full md:w-80 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
                    <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-500 items-center">
                        <span>Tax</span>
                        <span>${totalTax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-500 items-center">
                        <span>Discount</span>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-400">-$</span>
                            <input
                                type="number"
                                className="w-20 text-right bg-gray-50 border-none rounded p-1 text-sm focus:ring-1 focus:ring-blue-500 text-red-500"
                                value={globalDiscount || ''}
                                onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 my-2"></div>
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>${grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
