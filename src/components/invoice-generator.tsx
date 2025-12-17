'use client'

import { useState } from "react"
import { createInvoice } from "@/app/actions/billing"
import { Plus, Trash2, Receipt, User, Calendar, Save } from "lucide-react"
import { useRouter } from "next/navigation"

export default function InvoiceGenerator({ patients }: { patients: any[] }) {
    const router = useRouter()
    const [lineItems, setLineItems] = useState([
        { description: '', quantity: 1, unit_price: 0 }
    ])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const addItem = () => {
        setLineItems([...lineItems, { description: '', quantity: 1, unit_price: 0 }])
    }

    const removeItem = (index: number) => {
        setLineItems(lineItems.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, field: string, value: string | number) => {
        const newItems = [...lineItems]
        newItems[index] = { ...newItems[index], [field]: value }
        setLineItems(newItems)
    }

    const total = lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        const result = await createInvoice(formData)

        if (result && 'error' in result) {
            alert(result.error)
            setIsSubmitting(false)
        } else {
            router.push('/hms/billing')
            router.refresh()
        }
    }

    return (
        <form action={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-12">
            <input type="hidden" name="line_items" value={JSON.stringify(lineItems)} />

            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 -mx-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Receipt className="h-6 w-6 text-blue-600" />
                            New Invoice
                        </h1>
                        <p className="text-gray-500 text-sm">Create and issue a new invoice.</p>
                    </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    <Save className="h-4 w-4" />
                    {isSubmitting ? 'Creating...' : 'Issue Invoice'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Details Sidebar */}
                <div className="hidden lg:block space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="font-semibold text-gray-800 border-b pb-2">Invoice Details</h3>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                Patient
                            </label>
                            <select name="patient_id" required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                <option value="">Select Patient</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                required
                                defaultValue={new Date().toISOString().split('T')[0]}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <p className="text-blue-800 font-medium mb-1">Total Amount</p>
                        <p className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</p>
                    </div>
                </div>

                {/* Mobile/Tablet Fallback for Sidebar fields */}
                <div className="lg:hidden space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Patient</label>
                        <select name="patient_id" required className="w-full p-2 border border-gray-300 rounded-lg bg-white">
                            <option value="">Select Patient</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Date</label>
                        <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-2 border border-gray-300 rounded-lg" />
                    </div>
                </div>

                {/* Line Items Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Description</th>
                                    <th className="p-4 w-24">Qty</th>
                                    <th className="p-4 w-32">Price ($)</th>
                                    <th className="p-4 w-32 text-right">Total</th>
                                    <th className="p-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {lineItems.map((item, index) => (
                                    <tr key={index} className="group hover:bg-gray-50/50">
                                        <td className="p-4 align-top">
                                            <input
                                                required
                                                placeholder="Item description or service..."
                                                value={item.description}
                                                onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                className="w-full bg-transparent outline-none placeholder:text-gray-300"
                                            />
                                        </td>
                                        <td className="p-4 align-top">
                                            <input
                                                type="number"
                                                min="1"
                                                required
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                                className="w-full bg-transparent outline-none text-center"
                                            />
                                        </td>
                                        <td className="p-4 align-top">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                required
                                                value={item.unit_price}
                                                onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                className="w-full bg-transparent outline-none"
                                            />
                                        </td>
                                        <td className="p-4 text-right font-medium text-gray-900 border-l border-transparent group-hover:border-gray-200">
                                            ${(item.quantity * item.unit_price).toFixed(2)}
                                        </td>
                                        <td className="p-4 text-center">
                                            {lineItems.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            type="button"
                            onClick={addItem}
                            className="w-full py-4 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 border-t border-dashed border-gray-200"
                        >
                            <Plus className="h-4 w-4" />
                            Add Line Item
                        </button>
                    </div>
                </div>

            </div>
        </form>
    )
}
