'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, Search, Save, FileText, Calendar, User, DollarSign, Receipt, X, Loader2 } from 'lucide-react'
import { createInvoice, updateInvoice } from '@/app/actions/billing'
import { SearchableSelect } from '@/components/ui/searchable-select'

export function CompactInvoiceEditor({ patients, billableItems, taxConfig, initialPatientId, initialMedicines, appointmentId, initialInvoice }: {
    patients: any[],
    billableItems: any[],
    taxConfig: { defaultTax: any, taxRates: any[] },
    initialPatientId?: string,
    initialMedicines?: any[],
    appointmentId?: string,
    initialInvoice?: any
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)

    // Read URL parameters for auto-fill
    const urlPatientId = searchParams.get('patientId')
    const urlMedicines = searchParams.get('medicines')
    const urlAppointmentId = searchParams.get('appointmentId')

    // State
    const [selectedPatientId, setSelectedPatientId] = useState(initialInvoice?.patient_id || initialPatientId || urlPatientId || '')
    const [date, setDate] = useState(initialInvoice?.invoice_date ? new Date(initialInvoice.invoice_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])

    // Use configured default or empty (force user to select)
    const getDefaultTaxId = () => {
        if (taxConfig.defaultTax?.id) return taxConfig.defaultTax.id;
        return '';
    };

    const defaultTaxId = getDefaultTaxId();

    const [lines, setLines] = useState<any[]>(initialInvoice?.hms_invoice_lines ? initialInvoice.hms_invoice_lines.map((l: any) => ({
        id: l.id || Date.now() + Math.random(),
        product_id: l.product_id || '',
        description: l.description,
        quantity: Number(l.quantity),
        uom: 'PCS',
        unit_price: Number(l.unit_price),
        tax_rate_id: l.tax_rate_id || defaultTaxId,
        tax_amount: Number(l.tax_amount),
        discount_amount: Number(l.discount_amount),
        net_amount: Number(l.net_amount)
    })) : [
        { id: 1, product_id: '', description: '', quantity: 1, uom: 'PCS', unit_price: 0, tax_rate_id: defaultTaxId, tax_amount: 0, discount_amount: 0 }
    ])

    const [globalDiscount, setGlobalDiscount] = useState(Number(initialInvoice?.total_discount || 0))

    // UX Focus Management State
    const [lastAddedId, setLastAddedId] = useState<number | null>(null)

    // Effect to focus new row
    useEffect(() => {
        if (lastAddedId) {
            // Tiny timeout to ensure DOM is ready
            setTimeout(() => {
                const el = document.getElementById(`product-search-${lastAddedId}`)
                if (el) {
                    el.focus()
                }
            }, 50)
            setLastAddedId(null)
        }
    }, [lastAddedId])

    // --- REUSED LOGIC START ---

    // Auto-load medicines/items from URL
    useEffect(() => {
        const itemsParam = searchParams.get('items');
        const medicinesToLoad = initialMedicines || (urlMedicines ? JSON.parse(decodeURIComponent(urlMedicines)) : null) || (itemsParam ? JSON.parse(decodeURIComponent(itemsParam)) : null);

        if (medicinesToLoad) {
            try {
                const parsedLines = medicinesToLoad.map((med: any, idx: number) => {
                    let dbProduct = null;
                    if (med.name) {
                        const normalizedName = med.name.replace(/\+/g, ' ').toLowerCase();
                        if (normalizedName.includes('patient registration fee') || normalizedName.includes('registration fee')) {
                            dbProduct = billableItems.find(p => p.label.toLowerCase().includes('registration') && p.type === 'service');
                        } else {
                            dbProduct = billableItems.find(p => p.id === med.id);
                        }
                    }

                    const lineItem: any = {
                        id: Date.now() + idx,
                        product_id: dbProduct ? dbProduct.id : (med.id || ''),
                        description: dbProduct ? (dbProduct.description || dbProduct.label) : (med.name?.replace(/\+/g, ' ') || 'Service'),
                        quantity: med.quantity || 1,
                        unit_price: parseFloat(med.price?.toString() || '0'),
                        uom: med.uom || 'PCS',
                        tax_rate_id: defaultTaxId,
                        tax_amount: 0,
                        discount_amount: 0
                    };

                    if (dbProduct) {
                        if (dbProduct.price && dbProduct.price > 0) {
                            lineItem.unit_price = dbProduct.price;
                        }
                        lineItem.description = dbProduct.description || dbProduct.label;
                        if (dbProduct.categoryTaxId) {
                            lineItem.tax_rate_id = dbProduct.categoryTaxId;
                        } else if (dbProduct.metadata?.purchase_tax_rate) {
                            const matchingTax = taxConfig.taxRates.find(t => t.rate === Number(dbProduct.metadata.purchase_tax_rate));
                            if (matchingTax) lineItem.tax_rate_id = matchingTax.id;
                        }
                    }

                    const taxRateObj = taxConfig.taxRates.find(t => t.id === lineItem.tax_rate_id);
                    const rate = taxRateObj ? taxRateObj.rate : 0;
                    lineItem.tax_amount = (lineItem.quantity * lineItem.unit_price * rate) / 100;

                    return lineItem;
                })

                setLines(parsedLines)
            } catch (error) {
                console.error('Error loading items:', error)
            }
        }
    }, [urlMedicines, initialMedicines, billableItems])

    // Auto-load appointment fee and lab tests
    useEffect(() => {
        const activeAppointmentId = appointmentId || urlAppointmentId
        if (activeAppointmentId) {
            const loadAppointmentData = async () => {
                try {
                    const res = await fetch(`/api/appointments/${activeAppointmentId}`)
                    const data = await res.json()

                    if (data.success && data.appointment) {
                        const appointment = data.appointment
                        const appointmentLines: any[] = []

                        if (appointment.consultation_fee) {
                            const taxRateObj = taxConfig.taxRates.find(t => t.id === defaultTaxId);
                            const rate = taxRateObj ? taxRateObj.rate : 0;
                            const tax_amount = (appointment.consultation_fee * rate) / 100;

                            appointmentLines.push({
                                id: Date.now() + 1000,
                                product_id: '',
                                description: 'Consultation Fee',
                                quantity: 1,
                                unit_price: parseFloat(appointment.consultation_fee.toString()),
                                uom: 'Service',
                                tax_rate_id: defaultTaxId,
                                tax_amount: tax_amount,
                                discount_amount: 0
                            })
                        }

                        if (appointment.lab_tests?.length > 0) {
                            appointment.lab_tests.forEach((test: any, idx: number) => {
                                const taxRateObj = taxConfig.taxRates.find(t => t.id === defaultTaxId);
                                const rate = taxRateObj ? taxRateObj.rate : 0;
                                const tax_amount = (test.test_fee * rate) / 100;

                                appointmentLines.push({
                                    id: Date.now() + 2000 + idx,
                                    product_id: '',
                                    description: test.test_name,
                                    quantity: 1,
                                    unit_price: parseFloat(test.test_fee.toString()),
                                    uom: 'Test',
                                    tax_rate_id: defaultTaxId,
                                    tax_amount: tax_amount,
                                    discount_amount: 0
                                })
                            })
                        }

                        if (appointment.prescription_items?.length > 0) {
                            appointment.prescription_items.forEach((item: any, idx: number) => {
                                const product = billableItems.find(p => p.id === item.id);
                                const defaultItemTaxId = product?.categoryTaxId || defaultTaxId;
                                const taxRateObj = taxConfig.taxRates.find(t => t.id === defaultItemTaxId);
                                const rate = taxRateObj ? taxRateObj.rate : 0;
                                const baseTotal = (item.quantity * item.price);
                                const tax_amount = (Math.max(0, baseTotal) * rate) / 100;

                                appointmentLines.push({
                                    id: Date.now() + 3000 + idx,
                                    product_id: item.id,
                                    description: item.name,
                                    quantity: item.quantity,
                                    unit_price: item.price,
                                    uom: 'PCS',
                                    tax_rate_id: defaultItemTaxId,
                                    tax_amount: tax_amount,
                                    discount_amount: 0,
                                    base_price: item.price,
                                    conversion_factor: 1
                                })
                            })
                        }

                        if (appointmentLines.length > 0) {
                            setLines(prev => [...appointmentLines, ...prev])
                        }
                    }
                } catch (error) {
                    console.error('Error loading appointment data:', error)
                }
            }
            loadAppointmentData()
        }
    }, [urlAppointmentId, appointmentId])

    const loadPrescriptionMedicines = async () => {
        if (!selectedPatientId) return alert('Please select a patient first')
        setLoading(true)
        try {
            const res = await fetch(`/api/prescriptions/by-patient/${selectedPatientId}`)
            const data = await res.json()
            if (data.success && data.latest && data.latest.medicines.length > 0) {
                const prescription = data.latest
                const medicineLines = prescription.medicines.map((med: any, idx: number) => ({
                    id: Date.now() + idx,
                    product_id: med.id,
                    description: med.description,
                    quantity: med.quantity,
                    unit_price: med.unit_price,
                    uom: 'PCS',
                    tax_rate_id: defaultTaxId,
                    tax_amount: 0,
                    discount_amount: 0
                }))
                setLines(medicineLines)
            } else {
                alert('No recent prescriptions found')
            }
        } catch (error) {
            console.error('Error loading prescription:', error)
        }
        setLoading(false)
    }

    const subtotal = lines.reduce((sum, line) => sum + ((line.quantity * line.unit_price) - (line.discount_amount || 0)), 0)
    const totalTax = lines.reduce((sum, line) => sum + (line.tax_amount || 0), 0)
    const grandTotal = Math.max(0, subtotal + totalTax - globalDiscount)

    const handleAddItem = () => {
        const newId = Date.now()
        setLines([...lines, {
            id: newId,
            product_id: '',
            description: '',
            quantity: 1,
            unit_price: 0,
            uom: 'PCS',
            tax_rate_id: defaultTaxId,
            tax_amount: 0,
            discount_amount: 0
        }])
        setLastAddedId(newId)
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

                if (field === 'product_id') {
                    const product = billableItems.find(i => i.id === value)
                    if (product) {
                        updated.description = product.description || product.label
                        const basePrice = product.metadata?.basePrice || product.price || 0;
                        const packPrice = product.metadata?.packPrice || product.price || 0;
                        const conversionFactor = product.metadata?.conversionFactor || 1;
                        const packUom = product.metadata?.packUom || 'PCS';

                        updated.base_price = basePrice;
                        updated.pack_price = packPrice;
                        updated.conversion_factor = conversionFactor;
                        updated.pack_uom = packUom;
                        updated.uom = 'PCS';
                        updated.unit_price = basePrice;

                        const purchaseTaxRate = product.metadata?.purchase_tax_rate;
                        let purchaseTaxId = null;
                        if (purchaseTaxRate) {
                            const matchingTax = taxConfig.taxRates.find(t => t.rate === Number(purchaseTaxRate));
                            purchaseTaxId = matchingTax?.id;
                        }
                        const taxToUse = purchaseTaxId || product.categoryTaxId || defaultTaxId;
                        updated.tax_rate_id = taxToUse;
                    }
                }

                if (field === 'uom') {
                    const selectedUom = value;
                    if (line.base_price && line.conversion_factor) {
                        if (selectedUom === 'PCS') {
                            updated.unit_price = line.base_price;
                        } else if (selectedUom === line.pack_uom && line.pack_price) {
                            updated.unit_price = line.pack_price;
                        } else {
                            const match = selectedUom.match(/PACK-(\d+)/i);
                            if (match) {
                                const packSize = parseInt(match[1]);
                                updated.unit_price = line.base_price * packSize;
                            }
                        }
                    }
                }

                if (['product_id', 'quantity', 'unit_price', 'tax_rate_id', 'discount_amount', 'uom'].includes(field)) {
                    const currentTaxId = field === 'tax_rate_id' ? value : updated.tax_rate_id;
                    const taxRateObj = taxConfig.taxRates.find(t => t.id === currentTaxId);
                    const rate = taxRateObj ? taxRateObj.rate : 0;
                    const baseTotal = (updated.quantity * updated.unit_price) - (updated.discount_amount || 0);
                    updated.tax_amount = (Math.max(0, baseTotal) * rate) / 100;
                }

                if (!updated.base_price && line.base_price) updated.base_price = line.base_price;
                if (!updated.pack_price && line.pack_price) updated.pack_price = line.pack_price;
                if (!updated.pack_uom && line.pack_uom) updated.pack_uom = line.pack_uom;
                if (!updated.conversion_factor && line.conversion_factor) updated.conversion_factor = line.conversion_factor;

                return updated
            }
            return line
        }))
    }

    const handleSave = async (status: 'draft' | 'posted') => {
        if (!selectedPatientId) return alert('Please select a patient')
        setLoading(true)
        let res;
        const payload = {
            patient_id: selectedPatientId,
            appointment_id: appointmentId || urlAppointmentId,
            date,
            line_items: lines,
            status,
            total_discount: globalDiscount
        };

        if (initialInvoice?.id) {
            res = await updateInvoice(initialInvoice.id, payload);
        } else {
            res = await createInvoice(payload);
        }

        if (res.success) {
            router.push('/hms/billing')
            router.refresh()
        } else {
            alert(res.error || 'Failed to save')
        }
        setLoading(false)
    }

    // --- RENDER START ---
    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* 1. Header (Dense) */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Receipt className="h-4 w-4" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">New Invoice</h2>
                        <p className="text-[10px] text-slate-500 font-medium">Create bill for patient</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Patient Select (Searchable) */}
                    <div className="w-64">
                        <SearchableSelect
                            value={selectedPatientId}
                            onChange={(id) => setSelectedPatientId(id || '')}
                            onSearch={async (q) => {
                                const lower = q.toLowerCase()
                                return patients.filter(p =>
                                    p.first_name.toLowerCase().includes(lower) ||
                                    p.last_name.toLowerCase().includes(lower) ||
                                    (p.patient_number && p.patient_number.toLowerCase().includes(lower)) ||
                                    (p.contact?.phone && p.contact.phone.includes(lower))
                                ).map(p => ({
                                    id: p.id,
                                    label: `${p.first_name} ${p.last_name}`,
                                    subLabel: `ID: ${p.patient_number || 'N/A'} | Ph: ${p.contact?.phone || 'N/A'}`
                                }))
                            }}
                            defaultOptions={patients.slice(0, 50).map(p => ({
                                id: p.id,
                                label: `${p.first_name} ${p.last_name}`,
                                subLabel: `ID: ${p.patient_number || 'N/A'} | Ph: ${p.contact?.phone || 'N/A'}`
                            }))}
                            placeholder="Search Patient (Name, ID, Phone)..."
                            className="w-full text-xs"
                            inputId="patient-search-input"
                        />
                    </div>

                    {/* Date (Inline) */}
                    <input
                        type="date"
                        className="text-xs py-1.5 px-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md outline-none w-32"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    {/* Close Button */}
                    <Link href="/hms/billing" className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-red-500 transition-colors">
                        <X className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            {/* 2. Scrollable Body (Table) */}
            <div className="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/30">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-10 shadow-sm text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-3 py-2 w-8 text-center">#</th>
                            <th className="px-3 py-2 w-[35%]">Item Details</th>
                            <th className="px-2 py-2 w-20 text-right">Qty</th>
                            <th className="px-2 py-2 w-24 text-right">Price</th>
                            <th className="px-2 py-2 w-20 text-right">Disc</th>
                            <th className="px-2 py-2 w-24 text-right">Tax</th>
                            <th className="px-3 py-2 text-right">Total</th>
                            <th className="px-2 py-2 w-8"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {lines.map((line, idx) => (
                            <tr key={line.id} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                                <td className="px-3 py-2 text-[11px] text-slate-400 text-center font-mono">{idx + 1}</td>
                                <td className="px-3 py-2">
                                    <SearchableSelect
                                        inputId={`product-search-${line.id}`}
                                        value={line.product_id}
                                        onChange={(id, option) => {
                                            updateLine(line.id, 'product_id', id)
                                            // UX: Auto-focus Qty and select text
                                            setTimeout(() => {
                                                const qtyInput = document.getElementById(`qty-${line.id}`) as HTMLInputElement
                                                if (qtyInput) {
                                                    qtyInput.focus()
                                                    qtyInput.select()
                                                }
                                            }, 100)
                                        }}
                                        onSearch={async (query) => billableItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase())).map(item => ({ id: item.id, label: `${item.label} - ₹${item.price}`, subLabel: item.description }))}
                                        defaultOptions={billableItems.map(item => ({ id: item.id, label: `${item.label} - ₹${item.price}`, subLabel: item.description }))}
                                        placeholder="Search item..."
                                        className="w-full mb-1 text-xs"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        id={`qty-${line.id}`}
                                        type="number"
                                        min="1"
                                        className="w-full text-right bg-slate-50 dark:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded px-1.5 py-1 text-xs outline-none font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                        value={line.quantity}
                                        onChange={(e) => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                                        onKeyDown={(e) => {
                                            if ((e.key === 'Enter' || e.key === 'ArrowDown') && line.quantity > 0) {
                                                e.preventDefault()
                                                handleAddItem()
                                            }
                                        }}
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input type="number" min="0" className="w-full text-right bg-slate-50 dark:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded px-1.5 py-1 text-xs outline-none font-medium" value={line.unit_price} onChange={(e) => updateLine(line.id, 'unit_price', parseFloat(e.target.value) || 0)} />
                                </td>
                                <td className="px-2 py-2">
                                    <input type="number" min="0" className="w-full text-right bg-slate-50 dark:bg-slate-800 border border-transparent hover:border-red-200 dark:hover:border-red-900/50 rounded px-1.5 py-1 text-xs outline-none font-medium text-red-500" value={line.discount_amount || ''} placeholder="0" onChange={(e) => updateLine(line.id, 'discount_amount', parseFloat(e.target.value) || 0)} />
                                </td>
                                <td className="px-2 py-2">
                                    <select className="w-full text-right bg-transparent text-[10px] outline-none" value={line.tax_rate_id} onChange={(e) => updateLine(line.id, 'tax_rate_id', e.target.value)}>
                                        <option value="">-</option>
                                        {taxConfig.taxRates.map(t => <option key={t.id} value={t.id}>{t.rate}%</option>)}
                                    </select>
                                    <div className="text-[10px] text-slate-400 text-right">₹{line.tax_amount?.toFixed(2)}</div>
                                </td>
                                <td className="px-3 py-2 text-right text-xs font-bold text-slate-700 dark:text-slate-200 font-mono">
                                    ₹{((line.quantity * line.unit_price) - (line.discount_amount || 0) + (line.tax_amount || 0)).toFixed(2)}
                                </td>
                                <td className="px-2 py-2 text-center">
                                    <button onClick={() => handleRemoveItem(line.id)} className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-0" disabled={lines.length === 1}>
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {/* Quick Add Row (Button inside table footer basically) */}
                        <tr>
                            <td colSpan={8} className="px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                                <button onClick={handleAddItem} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                                    <Plus className="h-3 w-3" /> Add Item
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Empty State / Hints */}
                {lines.length < 3 && (
                    <div className="p-8 flex flex-col items-center justify-center text-slate-400 opacity-50">
                        <Search className="h-8 w-8 mb-2" />
                        <p className="text-xs">Search and add items above</p>
                    </div>
                )}
            </div>

            {/* 3. Footer (Fixed) */}
            <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-3 sm:px-5">
                <div className="flex items-center justify-end gap-6 mb-3 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">Subtotal:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">Tax:</span>
                        <span className="font-semibold text-indigo-500">₹{totalTax.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">Disc:</span>
                        <input type="number" className="w-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1 text-right outline-none text-red-500" value={globalDiscount || ''} placeholder="0" onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-lg">
                        <span className="font-bold text-slate-600 dark:text-slate-400">Total:</span>
                        <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">₹{grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <button onClick={loadPrescriptionMedicines} className="text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1" disabled={!selectedPatientId}>
                        <FileText className="h-3 w-3" /> Fetch Prescriptions
                    </button>

                    <div className="flex gap-2">
                        <button onClick={() => handleSave('draft')} disabled={loading} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            Draft
                        </button>
                        <button onClick={() => handleSave('paid' as any)} disabled={loading} className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <DollarSign className="h-3 w-3" />}
                            Collect Pay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
