'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, Search, Save, FileText, Calendar, User, DollarSign, Receipt, UserPlus } from 'lucide-react'
import { createInvoice } from '@/app/actions/billing'
import { SearchableSelect } from '@/components/ui/searchable-select'

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
    // Use configured default or empty (force user to select)
    const getDefaultTaxId = () => {
        if (taxConfig.defaultTax?.id) return taxConfig.defaultTax.id;
        // No auto-selection - user must choose tax
        return '';
    };

    const defaultTaxId = getDefaultTaxId();

    console.log('=== BILLING TAX DEBUG ===');
    console.log('Tax Config:', { defaultTax: taxConfig.defaultTax, taxRatesCount: taxConfig.taxRates.length });
    console.log('Default Tax ID Selected:', defaultTaxId);
    console.log('Available Tax Rates:', taxConfig.taxRates);

    const [lines, setLines] = useState<any[]>([
        { id: 1, product_id: '', description: '', quantity: 1, unit_price: 0, tax_rate_id: defaultTaxId, tax_amount: 0, discount_amount: 0 }
    ])

    const [globalDiscount, setGlobalDiscount] = useState(0)

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
            tax_rate_id: defaultTaxId, // Use smart fallback
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
                        updated.base_price = product.price // Store base (Unit) price
                        updated.uom = updated.uom || 'Unit' // Default to Unit

                        // Store UOM conversion factor from product metadata
                        // This is the ACTUAL pack size for this product
                        updated.conversion_factor = product.metadata?.conversionFactor || product.metadata?.conversion_factor || null

                        console.log('Product selected:', {
                            product: product.label,
                            basePrice: product.price,
                            conversionFactor: updated.conversion_factor,
                            metadata: product.metadata
                        });

                        // AUTO-FILL TAX: Priority order:
                        // 1. Product's purchase tax (stored as % during receiving)
                        // 2. Product's category tax
                        // 3. Smart default (system default, common GST rate, or first available)
                        const purchaseTaxRate = product.metadata?.purchase_tax_rate; // This is a NUMBER (e.g., 5, 12, 18)
                        let purchaseTaxId = null;

                        // Find the tax rate ID that matches the purchase tax percentage
                        if (purchaseTaxRate) {
                            const matchingTax = taxConfig.taxRates.find(t => t.rate === Number(purchaseTaxRate));
                            purchaseTaxId = matchingTax?.id;
                            console.log('Purchase tax match:', { purchaseTaxRate, matchingTax, purchaseTaxId });
                        }

                        const taxToUse = purchaseTaxId || product.categoryTaxId || defaultTaxId;
                        updated.tax_rate_id = taxToUse;

                        console.log('Tax auto-fill:', { purchaseTaxRate, purchaseTaxId, categoryTax: product.categoryTaxId, defaultTaxId, final: updated.tax_rate_id });
                    }
                }


                // Note: UOM is stored as a label only
                // Price must be entered manually for now
                // TODO: Implement proper product-specific conversion factors


                // Recalculate Tax
                if (['product_id', 'quantity', 'unit_price', 'tax_rate_id', 'discount_amount', 'uom'].includes(field)) {
                    const currentTaxId = field === 'tax_rate_id' ? value : updated.tax_rate_id;
                    const taxRateObj = taxConfig.taxRates.find(t => t.id === currentTaxId);
                    const rate = taxRateObj ? taxRateObj.rate : 0;

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
            line_items: lines,
            status,
            total_discount: globalDiscount
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Premium Header Card */}
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white shadow-xl shadow-blue-100/50">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Receipt className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">New Invoice</h1>
                            <p className="text-gray-500 text-sm">Create and manage patient billing</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Patient Selector */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-semibold text-gray-700">Select Patient</label>
                                <Link
                                    href="/hms/patients/new"
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-lg transition-all"
                                >
                                    <UserPlus className="h-3.5 w-3.5" />
                                    New Patient
                                </Link>
                            </div>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                <select
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium"
                                    value={selectedPatientId}
                                    onChange={(e) => setSelectedPatientId(e.target.value)}
                                >
                                    <option value="">Choose patient...</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id} className="text-gray-900">
                                            {p.first_name} {p.last_name} - {(p.contact as any)?.phone || 'No Contact'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Date Picker */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Invoice Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="date"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Patient Info Banner */}
                    {activePatient && (
                        <div className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 p-5 rounded-xl animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-4 text-white">
                                <div className="h-12 w-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                                    <User className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{activePatient.first_name} {activePatient.last_name}</h3>
                                    <p className="text-blue-100 text-sm">Contact: {(activePatient.contact as any)?.phone || 'No Phone'} • ID: {activePatient.patient_number || activePatient.id.slice(0, 8)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Items Table - Premium Design */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-xl shadow-blue-100/50 overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                        <h2 className="text-white font-bold text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Invoice Items
                        </h2>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-10">#</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[35%]">Item / Service</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Qty / UOM</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Discount</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Tax</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {lines.map((line, idx) => (
                                    <tr key={line.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-gray-500 font-mono text-sm">{idx + 1}</td>

                                        {/* Item Column - Wider & Searchable */}
                                        <td className="px-6 py-4">
                                            <SearchableSelect
                                                value={line.product_id}
                                                onChange={(id, option) => {
                                                    updateLine(line.id, 'product_id', id);
                                                }}
                                                onSearch={async (query) => {
                                                    return billableItems
                                                        .filter(item =>
                                                            item.label.toLowerCase().includes(query.toLowerCase()) ||
                                                            item.description?.toLowerCase().includes(query.toLowerCase())
                                                        )
                                                        .map(item => ({
                                                            id: item.id,
                                                            label: `${item.label} - ₹${item.price}`,
                                                            subLabel: item.description
                                                        }));
                                                }}
                                                defaultOptions={billableItems.map(item => ({
                                                    id: item.id,
                                                    label: `${item.label} - ₹${item.price}`,
                                                    subLabel: item.description
                                                }))}
                                                placeholder="Search product/service..."
                                                className="w-full mb-2"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Additional description..."
                                                className="w-full text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
                                                value={line.description}
                                                onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                                            />
                                        </td>

                                        {/* Quantity + UOM */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    step="0.01"
                                                    className="w-20 text-right p-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none font-mono text-gray-900 font-bold"
                                                    value={line.quantity}
                                                    onChange={(e) => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                                                />
                                                <select
                                                    className="p-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm text-gray-700 bg-white"
                                                    value={line.uom || 'Unit'}
                                                    onChange={(e) => updateLine(line.id, 'uom', e.target.value)}
                                                    title="Unit of Measure"
                                                >
                                                    <option value="Unit">Unit</option>
                                                    <option value="Strip">Strip</option>
                                                    <option value="Box">Box</option>
                                                    <option value="Bottle">Bottle</option>
                                                    <option value="Pack">Pack</option>
                                                </select>
                                            </div>
                                        </td>

                                        {/* Price */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="text-gray-500 text-sm">₹</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    className="w-24 text-right p-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none font-mono text-gray-900 font-bold"
                                                    value={line.unit_price}
                                                    onChange={(e) => updateLine(line.id, 'unit_price', parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                        </td>

                                        {/* Discount */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="text-red-500 text-sm">-₹</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="0"
                                                    className="w-20 text-right p-2.5 border-2 border-red-200 rounded-lg focus:border-red-500 outline-none font-mono text-red-600 font-bold"
                                                    value={line.discount_amount || ''}
                                                    onChange={(e) => updateLine(line.id, 'discount_amount', parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                        </td>

                                        {/* Tax */}
                                        <td className="px-6 py-4">
                                            <select
                                                className="w-full text-right p-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm text-gray-900 font-medium"
                                                value={line.tax_rate_id}
                                                onChange={(e) => updateLine(line.id, 'tax_rate_id', e.target.value)}
                                            >
                                                <option value="" className="text-gray-500">No Tax</option>
                                                {taxConfig.taxRates.map(t => (
                                                    <option key={t.id} value={t.id} className="text-gray-900">{t.name} ({t.rate}%)</option>
                                                ))}
                                            </select>
                                            <div className="text-right text-xs text-gray-500 mt-1 font-mono">
                                                ₹{(line.tax_amount || 0).toFixed(2)}
                                            </div>
                                        </td>

                                        {/* Line Total */}
                                        <td className="px-6 py-4">
                                            <div className="text-right">
                                                <span className="font-bold text-gray-900 text-lg font-mono">
                                                    ₹{((line.quantity * line.unit_price) - (line.discount_amount || 0) + (line.tax_amount || 0)).toFixed(2)}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Delete Button */}
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleRemoveItem(line.id)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Add Item Button */}
                    <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
                        <button
                            onClick={handleAddItem}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                        >
                            <Plus className="h-5 w-5" />
                            Add Line Item
                        </button>
                    </div>
                </div>

                {/* Footer: Actions + Totals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Action Buttons */}
                    <div className="flex items-end gap-4">
                        <button
                            className="flex-1 px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-bold text-lg hover:bg-gray-50 transition-all shadow-sm"
                            onClick={() => handleSave('draft')}
                            disabled={loading}
                        >
                            Save as Draft
                        </button>
                        <button
                            className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                            onClick={() => handleSave('posted')}
                            disabled={loading}
                        >
                            <Save className="h-5 w-5" />
                            {loading ? 'Processing...' : 'Post Invoice'}
                        </button>
                    </div>

                    {/* Premium Totals Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl text-white">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Invoice Summary</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                                <span className="text-gray-300">Subtotal</span>
                                <span className="font-mono text-xl font-bold">₹{subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                                <span className="text-gray-300">Tax</span>
                                <span className="font-mono text-xl font-bold text-blue-400">₹{totalTax.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                                <span className="text-gray-300">Discount</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-red-400">-₹</span>
                                    <input
                                        type="number"
                                        className="w-28 text-right bg-white/10 border-2 border-white/20 rounded-lg px-3 py-2 text-white font-mono font-bold focus:ring-2 focus:ring-red-400 outline-none"
                                        value={globalDiscount || ''}
                                        onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <span className="text-2xl font-bold">Grand Total</span>
                                <span className="text-3xl font-bold text-green-400 font-mono">
                                    ₹{grandTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
