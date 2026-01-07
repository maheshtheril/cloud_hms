'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, Search, Save, FileText, Calendar, User, DollarSign, Receipt, X, Loader2, CreditCard, Banknote, Smartphone, Landmark, MessageCircle } from 'lucide-react'
import { createInvoice, updateInvoice, getPatientBalance } from '@/app/actions/billing'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { useToast } from '@/components/ui/use-toast'

export function CompactInvoiceEditor({ patients, billableItems, taxConfig, initialPatientId, initialMedicines, appointmentId, initialInvoice, onClose }: {
    patients: any[],
    billableItems: any[],
    taxConfig: { defaultTax: any, taxRates: any[] },
    initialPatientId?: string,
    initialMedicines?: any[],
    appointmentId?: string,
    initialInvoice?: any,
    onClose?: () => void
}) {

    interface Payment {
        method: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'advance';
        amount: number;
        reference?: string;
    }
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    // Read URL parameters for auto-fill
    const urlPatientId = searchParams.get('patientId')
    const urlMedicines = searchParams.get('medicines')
    const urlAppointmentId = searchParams.get('appointmentId')

    // State
    const [selectedPatientId, setSelectedPatientId] = useState(initialInvoice?.patient_id || initialPatientId || urlPatientId || '')
    const [date, setDate] = useState(initialInvoice?.invoice_date ? new Date(initialInvoice.invoice_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
    const [patientBalance, setPatientBalance] = useState<{ amount: number, type: 'due' | 'advance' } | null>(null)

    // Fetch Patient Balance
    useEffect(() => {
        if (!selectedPatientId) {
            setPatientBalance(null)
            return
        }

        const fetchBalance = async () => {
            const res = await getPatientBalance(selectedPatientId)
            if (res.success) {
                setPatientBalance({ amount: res.balance, type: res.type as any })
            }
        }
        fetchBalance()
    }, [selectedPatientId])

    // Use configured default or empty (force user to select)
    const getDefaultTaxId = () => {
        if (taxConfig.defaultTax?.id) return taxConfig.defaultTax.id;
        return '';
    };

    const defaultTaxId = getDefaultTaxId();

    const [lines, setLines] = useState<any[]>(initialInvoice?.hms_invoice_lines ? initialInvoice.hms_invoice_lines
        .filter((l: any) => l.description || l.product_id) // Filter empty rows from DB
        .map((l: any) => ({
            id: l.id || Date.now() + Math.random(),
            product_id: l.product_id || '',
            description: l.description,
            quantity: Number(l.quantity),
            uom: l.uom || 'PCS',
            base_uom: 'PCS', // Default fallback
            unit_price: Number(l.unit_price),
            tax_rate_id: l.tax_rate_id || defaultTaxId,
            tax_amount: Number(l.tax_amount),
            discount_amount: Number(l.discount_amount),
            net_amount: Number(l.net_amount)
        })) : [
        { id: 1, product_id: '', description: '', quantity: 1, uom: 'PCS', base_uom: 'PCS', unit_price: 0, tax_rate_id: defaultTaxId, tax_amount: 0, discount_amount: 0 }
    ])
    const [payments, setPayments] = useState<Payment[]>(
        initialInvoice?.hms_invoice_payments?.length > 0
            ? initialInvoice.hms_invoice_payments.map((p: any) => ({
                method: (p.method?.toLowerCase() as any) || 'cash',
                amount: Number(p.amount) || 0,
                reference: p.reference || ''
            }))
            : [{ method: 'cash', amount: 0, reference: '' }]
    )

    const [globalDiscount, setGlobalDiscount] = useState(Number(initialInvoice?.total_discount || 0))

    // Memoize billable items as options for performance
    const billableOptions = useMemo(() => {
        return billableItems.map(item => ({
            id: item.id,
            label: item.label,
            price: item.price,
            sku: item.sku,
            description: item.description,
            metadata: item.metadata
        }))
    }, [billableItems])

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
                        base_uom: 'PCS', // Default fallback
                        tax_rate_id: defaultTaxId,
                        tax_amount: 0,
                        discount_amount: 0
                    };

                    if (dbProduct) {
                        if (dbProduct.price && dbProduct.price > 0) {
                            lineItem.unit_price = dbProduct.price;
                        }
                        lineItem.description = dbProduct.description || dbProduct.label;

                        // Tax Logic
                        if (dbProduct.metadata?.tax_exempt) {
                            // Look for a 0% tax rate
                            const zeroTax = taxConfig.taxRates.find(t => t.rate === 0);
                            lineItem.tax_rate_id = zeroTax ? zeroTax.id : ''; // Use 0% rate or no rate
                        } else if (dbProduct.categoryTaxId) {
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
        // ONLY auto-load appointment data for NEW invoices
        if (initialInvoice) return;

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
                            // SMART LOOKUP: Find actual Consultation product for better tax/accounting
                            const consultProduct = billableItems.find(p =>
                                (p.label.toLowerCase().includes('consult') || p.label.toLowerCase().includes('opd')) &&
                                p.id.length > 5 // Ensure it's not a dummy ID
                            );

                            const taxId = consultProduct?.categoryTaxId || defaultTaxId;
                            const taxRateObj = taxConfig.taxRates.find(t => t.id === taxId);
                            const rate = taxRateObj ? taxRateObj.rate : 0;
                            const tax_amount = (appointment.consultation_fee * rate) / 100;

                            appointmentLines.push({
                                id: Date.now() + 1000,
                                product_id: consultProduct?.id || '',
                                description: appointment.clinician_name ? `Consultation Fee - Dr. ${appointment.clinician_name}` : 'Consultation Fee',
                                quantity: 1,
                                unit_price: parseFloat(appointment.consultation_fee.toString()),
                                uom: 'Service',
                                tax_rate_id: taxId,
                                tax_amount: tax_amount,
                                discount_amount: 0
                            })
                        }

                        if (appointment.lab_tests?.length > 0) {
                            appointment.lab_tests.forEach((test: any, idx: number) => {
                                // Try to find matched Lab product
                                const labProduct = billableItems.find(p => p.label.toLowerCase() === test.test_name.toLowerCase());
                                const taxId = labProduct?.categoryTaxId || defaultTaxId;
                                const taxRateObj = taxConfig.taxRates.find(t => t.id === taxId);
                                const rate = taxRateObj ? taxRateObj.rate : 0;
                                const tax_amount = (test.test_fee * rate) / 100;

                                appointmentLines.push({
                                    id: Date.now() + 2000 + idx,
                                    product_id: labProduct?.id || '',
                                    description: test.test_name,
                                    quantity: 1,
                                    unit_price: parseFloat(test.test_fee.toString()),
                                    uom: 'Test',
                                    tax_rate_id: taxId,
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
                            setLines(prev => {
                                // If current is just one empty row, replace it
                                if (prev.length === 1 && !prev[0].description && !prev[0].product_id) {
                                    return appointmentLines;
                                }
                                return [...appointmentLines, ...prev];
                            })
                        }
                    }
                } catch (error) {
                    console.error('Error loading appointment data:', error)
                }
            }
            loadAppointmentData()
        }
    }, [urlAppointmentId, appointmentId])

    // Registration Expiry Check & Auto-Add
    useEffect(() => {
        if (!selectedPatientId || initialInvoice) return;

        const patient = patients.find((p: any) => p.id === selectedPatientId);
        if (patient) {
            const meta = patient.metadata as any;
            if (meta?.registration_expiry) {
                const expiry = new Date(meta.registration_expiry);
                const today = new Date();
                if (expiry < today) {
                    // Check if already added
                    const alreadyAdded = lines.some((l: any) =>
                        l.description?.toLowerCase().includes('registration') ||
                        l.description?.toLowerCase().includes('renewal')
                    );

                    if (!alreadyAdded) {
                        toast({
                            title: "Registration Expired",
                            description: `Patient registration expired on ${expiry.toLocaleDateString()}. Adding renewal fee.`,
                            variant: "destructive"
                        });

                        // Add the fee
                        const regProduct = billableItems.find((p: any) => p.label.toLowerCase().includes('registration'));
                        const taxId = regProduct?.categoryTaxId || defaultTaxId;
                        const taxRateObj = taxConfig.taxRates.find((t: any) => t.id === taxId);
                        const rate = taxRateObj ? taxRateObj.rate : 0;
                        const price = regProduct?.price || 100;

                        setLines(prev => {
                            // Logic: If registration fee is being added, check if there's a consultation fee.
                            // Some clinics treat registration as the consultation fee for that day.
                            let newLines = [...prev];

                            // 1. Find consultation line if any
                            const consultLineIdx = newLines.findIndex(l =>
                                l.description?.toLowerCase().includes('consult') ||
                                l.description?.toLowerCase().includes('opd')
                            );

                            if (consultLineIdx !== -1) {
                                // Automatically discount the consultation fee 100% since registration is being paid
                                // This matches the user's "registration fee will be the consulting fee also" rule.
                                newLines[consultLineIdx] = {
                                    ...newLines[consultLineIdx],
                                    discount_amount: newLines[consultLineIdx].unit_price, // 100% discount
                                    net_amount: 0
                                };
                                toast({
                                    title: "Billing Adjusted",
                                    description: "Consultation fee discounted as it is covered by the registration fee.",
                                });
                            }

                            const itemToAdd = {
                                id: Date.now() + 4000,
                                product_id: regProduct?.id || '',
                                description: 'Patient Registration Renewal Fee',
                                quantity: 1,
                                unit_price: Number(price),
                                uom: 'Service',
                                tax_rate_id: taxId,
                                tax_amount: (Number(price) * rate) / 100,
                                discount_amount: 0,
                                net_amount: Number(price) + ((Number(price) * rate) / 100)
                            };

                            if (newLines.length === 1 && !newLines[0].description && !newLines[0].product_id) {
                                return [itemToAdd];
                            }
                            return [...newLines, itemToAdd];
                        });
                    }
                }
            }
        }
    }, [selectedPatientId, patients, billableItems, toast, lines.length]);


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
    const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
    const balanceDue = grandTotal - totalPaid

    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => { setIsMounted(true) }, [])

    // Auto-update default payment if only one exists (UX convenience)
    // ONLY for new invoices or when user is interacting (not on initial load of existing invoice)
    useEffect(() => {
        if (!isMounted) return; // Skip on first run to protect DB values
        if (initialInvoice && payments.length === 1 && payments[0].amount !== 0) {
            // If we have an initial invoice and a non-zero payment, don't overwrite it automatically
            // unless the user changes something else? For now, let's be conservative.
            return;
        }

        if (payments.length === 1 && payments[0].amount !== grandTotal) {
            setPayments([{ ...payments[0], amount: grandTotal }])
        }
    }, [grandTotal, isMounted])

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
                        const baseUom = product.metadata?.baseUom || 'PCS';

                        updated.base_price = basePrice;
                        updated.pack_price = packPrice;
                        updated.conversion_factor = conversionFactor;
                        updated.pack_uom = packUom;
                        updated.base_uom = baseUom;
                        updated.uom = baseUom;
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
                    const selectedUom = (value || '').toUpperCase();
                    if (line.base_price) {
                        if (selectedUom === 'PCS' || selectedUom === (line.base_uom || 'PCS').toUpperCase()) {
                            updated.unit_price = line.base_price;
                        } else if (line.pack_uom && selectedUom === line.pack_uom.toUpperCase() && line.pack_price) {
                            updated.unit_price = line.pack_price;
                        } else {
                            // Smart derive for common patterns if metadata didn't catch it
                            const packMatch = selectedUom.match(/(?:PACK|BOX|STRIP|TRAY)-(\d+)/i);
                            const simpleMatch = selectedUom.match(/^(\d+)(?:'S|S|X\d+|X)?$/i);

                            let derivedFactor = 0;
                            if (packMatch) derivedFactor = parseInt(packMatch[1]);
                            else if (simpleMatch) derivedFactor = parseInt(simpleMatch[1]);
                            else if (selectedUom === 'STRIP') derivedFactor = 10;

                            if (derivedFactor > 0) {
                                updated.unit_price = line.base_price * derivedFactor;
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
                if (!updated.base_uom && line.base_uom) updated.base_uom = line.base_uom;
                if (!updated.conversion_factor && line.conversion_factor) updated.conversion_factor = line.conversion_factor;

                return updated
            }
            return line
        }))
    }

    const handleSave = async (status: 'draft' | 'posted' | 'paid') => {
        if (!selectedPatientId) return alert('Please select a patient')
        setLoading(true)
        let res;
        const payload = {
            patient_id: selectedPatientId,
            appointment_id: appointmentId || urlAppointmentId,
            date,
            line_items: lines.filter(l => l.description || l.product_id), // Filter out empty lines on save
            status,
            total_discount: globalDiscount,
            payments: payments
        };

        if (initialInvoice?.id) {
            res = await updateInvoice(initialInvoice.id, payload);
        } else {
            res = await createInvoice(payload);
        }

        if (res.success) {
            router.refresh()
            if (onClose) {
                onClose()
            } else {
                router.push('/hms/billing')
            }
        } else {
            alert(res.error || 'Failed to save')
        }
        setLoading(false)
    }

    // --- RENDER START ---
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200"
            onClick={() => onClose ? onClose() : router.back()}
        >
            <div
                className="relative w-full max-w-[96vw] h-[95vh] sm:h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 ring-1 ring-slate-900/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 1. Header (Dense) */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-lg text-white shadow-md shadow-indigo-500/20">
                            <Receipt className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                                {initialInvoice ? 'Edit' : 'New'} Invoice
                            </h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                    {selectedPatientId ? 'Patient Selected' : 'Select Patient'}
                                </span>
                                <span className="text-[10px] text-slate-400">•</span>
                                <p className="text-[10px] text-slate-500 font-medium">Create bill for patient</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Patient Select (Searchable) */}
                        <div className="w-56 sm:w-72 relative group">
                            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-slate-400">
                                <User className="h-3.5 w-3.5" />
                            </div>
                            <div className="pl-7">
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
                                        )
                                            .slice(0, 50)
                                            .map(p => ({
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
                                    placeholder="Search Patient..."
                                    className="w-full text-xs border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    inputId="patient-search-input"
                                />
                            </div>
                        </div>

                        {/* Date (Inline) */}
                        <div className="relative">
                            <Calendar className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                            <input
                                type="date"
                                className="text-xs pl-8 pr-2 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md outline-none w-32 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-600 dark:text-slate-300 font-medium"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => onClose ? onClose() : router.back()}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-all duration-200 hover:rotate-90"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* 2. Scrollable Body (Table) */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 relative scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0 z-20 shadow-sm text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-4 py-3 w-10 text-center bg-slate-50 dark:bg-slate-900">#</th>
                                <th className="px-4 py-3 w-[40%] bg-slate-50 dark:bg-slate-900">Item Details</th>
                                <th className="px-2 py-3 w-32 text-right bg-slate-50 dark:bg-slate-900">Qty / UOM</th>
                                <th className="px-2 py-3 w-28 text-right bg-slate-50 dark:bg-slate-900">Price</th>
                                <th className="px-2 py-3 w-24 text-right bg-slate-50 dark:bg-slate-900">Disc</th>
                                <th className="px-2 py-3 w-28 text-right bg-slate-50 dark:bg-slate-900">Tax</th>
                                <th className="px-4 py-3 text-right bg-slate-50 dark:bg-slate-900">Total</th>
                                <th className="px-2 py-3 w-10 bg-slate-50 dark:bg-slate-900"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {lines.map((line, idx) => (
                                <tr key={line.id} className="bg-white dark:bg-slate-900/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 group transition-colors">
                                    <td className="px-4 py-3 text-[11px] text-slate-400 text-center font-mono">{idx + 1}</td>
                                    <td className="px-4 py-2">
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
                                            onSearch={async (query) => {
                                                const lower = query.toLowerCase()
                                                return billableOptions
                                                    .filter(item =>
                                                        item.label.toLowerCase().includes(lower) ||
                                                        (item.sku && item.sku.toLowerCase().includes(lower)) ||
                                                        (item.description && item.description.toLowerCase().includes(lower))
                                                    )
                                                    .slice(0, 50)
                                                    .map(item => ({
                                                        id: item.id,
                                                        label: `${item.label} - ₹${item.price}`,
                                                        subLabel: `${item.sku ? `[${item.sku}] ` : ''}${item.description || ''}`.trim()
                                                    }))
                                            }}
                                            defaultOptions={billableOptions.slice(0, 50).map(item => ({
                                                id: item.id,
                                                label: `${item.label} - ₹${item.price}`,
                                                subLabel: `${item.sku ? `[${item.sku}] ` : ''}${item.description || ''}`.trim()
                                            }))}
                                            placeholder="Search item..."
                                            className="w-full text-xs font-medium"
                                        />
                                        {/* Description field for visibility (especially for non-product items like consultation) */}
                                        <input
                                            type="text"
                                            className="w-full mt-1.5 px-2 py-1 text-[11px] bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 focus:border-indigo-500/50 rounded outline-none text-slate-600 dark:text-slate-400 font-medium"
                                            placeholder="Additional description..."
                                            value={line.description || ''}
                                            onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 rounded-md px-1.5 py-0.5 border border-transparent focus-within:border-indigo-500 transition-all">
                                                <input
                                                    id={`qty-${line.id}`}
                                                    type="number"
                                                    min="1"
                                                    className="w-14 text-right bg-transparent border-none px-0 py-1 text-xs outline-none font-bold text-slate-700 dark:text-slate-200"
                                                    value={line.quantity}
                                                    onChange={(e) => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                                                    onKeyDown={(e) => {
                                                        if ((e.key === 'Enter' || e.key === 'ArrowDown') && line.quantity > 0) {
                                                            e.preventDefault()
                                                            handleAddItem()
                                                        }
                                                    }}
                                                />
                                                <div className="w-px h-3 bg-slate-200 dark:bg-slate-700 mx-0.5" />
                                                <select
                                                    value={line.uom || 'PCS'}
                                                    onChange={(e) => updateLine(line.id, 'uom', e.target.value)}
                                                    className="w-auto min-w-[3rem] bg-transparent text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border-none outline-none cursor-pointer hover:underline focus:ring-0 text-left"
                                                >
                                                    <option value={line.base_uom || 'PCS'}>{line.base_uom || 'PCS'}</option>
                                                    {line.pack_uom && line.pack_uom !== (line.base_uom || 'PCS') && (
                                                        <option value={line.pack_uom}>
                                                            {line.pack_uom} {line.conversion_factor > 1 ? `(${line.conversion_factor})` : ''}
                                                        </option>
                                                    )}
                                                </select>
                                            </div>
                                            {line.uom !== (line.base_uom || 'PCS') && line.conversion_factor > 1 && (
                                                <div className="text-[9px] text-slate-500 font-medium mr-1 mt-0.5 animate-in fade-in slide-in-from-right-1">
                                                    = {line.quantity * line.conversion_factor} {line.base_uom || 'PCS'}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-2 py-2">
                                        <div className="relative">
                                            <span className="absolute left-1 top-1 text-[10px] text-slate-400">₹</span>
                                            <input type="number" min="0" className="w-full text-right bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 pl-3 pr-1 py-1 text-xs outline-none font-medium focus:border-indigo-500 focus:bg-indigo-50/20 text-slate-700 dark:text-slate-200" value={line.unit_price} onChange={(e) => updateLine(line.id, 'unit_price', parseFloat(e.target.value) || 0)} />
                                        </div>
                                    </td>
                                    <td className="px-2 py-2">
                                        <input type="number" min="0" className="w-full text-right bg-transparent hover:bg-red-50 dark:hover:bg-red-900/10 border-b border-transparent hover:border-red-200 dark:hover:border-red-900/30 px-1 py-1 text-xs outline-none font-medium text-red-500 placeholder-red-200" value={line.discount_amount || ''} placeholder="0" onChange={(e) => updateLine(line.id, 'discount_amount', parseFloat(e.target.value) || 0)} />
                                    </td>
                                    <td className="px-2 py-2">
                                        <select className="w-full text-right bg-transparent text-[11px] outline-none text-slate-600 dark:text-slate-400 cursor-pointer hover:text-indigo-600" value={line.tax_rate_id} onChange={(e) => updateLine(line.id, 'tax_rate_id', e.target.value)}>
                                            <option value="">No Tax</option>
                                            {taxConfig.taxRates.map(t => <option key={t.id} value={t.id}>{t.rate}%</option>)}
                                        </select>
                                        <div className="text-[10px] text-slate-400 text-right mt-0.5">₹{line.tax_amount?.toFixed(2)}</div>
                                    </td>
                                    <td className="px-4 py-2 text-right text-xs font-bold text-slate-800 dark:text-slate-100 font-mono tracking-tight bg-slate-50/30 dark:bg-slate-900/30">
                                        ₹{((line.quantity * line.unit_price) - (line.discount_amount || 0) + (line.tax_amount || 0)).toFixed(2)}
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <button onClick={() => handleRemoveItem(line.id)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-full transition-all disabled:opacity-0" disabled={lines.length === 1}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {/* Quick Add Row */}
                            <tr>
                                <td colSpan={8} className="px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                                    <button onClick={handleAddItem} className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-md transition-all">
                                        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-0.5 rounded">
                                            <Plus className="h-3 w-3" />
                                        </div>
                                        Add Line Item
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Empty State / Hints */}
                    {lines.length < 3 && (
                        <div className="p-12 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 opacity-60 pointer-events-none">
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-full mb-3">
                                <Search className="h-8 w-8 text-slate-200 dark:text-slate-700" />
                            </div>
                            <p className="text-xs font-medium">Search items or medicines to add to bill</p>
                        </div>
                    )}
                </div>

                {/* 3. Footer (Fixed) */}
                <div className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)] z-20">
                    <div className="flex flex-col sm:flex-row h-full">
                        {/* Left Side: Payment Details */}
                        <div className="flex-1 p-4 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex flex-col gap-2 mb-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <CreditCard className="h-3 w-3" /> Payment Breakdown
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500">
                                            {balanceDue < 0 ? 'Advance / Change:' : 'Balance Due:'}
                                        </span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${balanceDue > 1 ? "bg-red-100 text-red-600 dark:text-red-400 dark:bg-red-500/10" : balanceDue < 0 ? "bg-blue-100 text-blue-600 dark:text-blue-400 dark:bg-blue-500/10" : "bg-emerald-100 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/10"}`}>
                                            {balanceDue > 1 ? `₹${balanceDue.toFixed(2)}` : balanceDue < 0 ? `₹${Math.abs(balanceDue).toFixed(2)}` : 'PAID'}
                                        </span>
                                    </div>
                                </div>

                                {patientBalance && patientBalance.type === 'advance' && patientBalance.amount > 0 && (
                                    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/10 p-2 rounded-md border border-blue-100 dark:border-blue-800">
                                        <div className="flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                            <span className="text-[10px] font-medium text-blue-700 dark:text-blue-300">
                                                Available Credit: <span className="font-bold">₹{patientBalance.amount.toFixed(2)}</span>
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                // 1. Determine how much we CAN pay with credit
                                                // Use grandTotal because balanceDue might be 0 if there's a default 'cash' entry
                                                const amountToUse = Math.min(grandTotal, patientBalance.amount);

                                                if (amountToUse <= 0) {
                                                    toast({ title: "Nothing to apply", description: "Invoice total is 0 or uncalculated." });
                                                    return;
                                                }

                                                // 2. "Magic": Replace existing payments with this Advance entry
                                                // This ensures the user sees something change immediately.
                                                // If there's a remainder, the user will see a "Balance Due" and can add another payment (Cash/Card).
                                                setPayments([
                                                    {
                                                        method: 'advance',
                                                        amount: amountToUse,
                                                        reference: 'Advance Adjustment'
                                                    }
                                                ]);

                                                toast({
                                                    title: "Credit Applied",
                                                    description: `Applied ₹${amountToUse.toFixed(2)} from patient advance.`
                                                });
                                            }}
                                            className="text-[10px] bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-800 dark:text-blue-200 px-2 py-1 rounded font-bold transition-colors"
                                        >
                                            Apply Credit
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                                {payments.map((p, idx) => (
                                    <div key={idx} className="flex items-center gap-2 group">
                                        <div className="flex-1 flex items-center bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 focus-within:ring-2 ring-indigo-500/20 focus-within:border-indigo-400 transition-all shadow-sm">
                                            <div className="pl-2 pr-1 text-slate-400">
                                                {p.method === 'cash' && <Banknote className="h-3.5 w-3.5" />}
                                                {p.method === 'card' && <CreditCard className="h-3.5 w-3.5" />}
                                                {p.method === 'upi' && <Smartphone className="h-3.5 w-3.5" />}
                                                {p.method === 'bank_transfer' && <Landmark className="h-3.5 w-3.5" />}
                                                {p.method === 'advance' && <User className="h-3.5 w-3.5" />}
                                            </div>
                                            <select
                                                className="text-xs bg-transparent border-none outline-none w-full py-2 font-medium text-slate-700 dark:text-slate-200 h-8"
                                                value={p.method}
                                                onChange={(e) => {
                                                    const newPayments = [...payments]
                                                    newPayments[idx].method = e.target.value as any
                                                    setPayments(newPayments)
                                                }}
                                            >
                                                <option value="cash">Cash</option>
                                                <option value="card">Card</option>
                                                <option value="upi">UPI</option>
                                                <option value="bank_transfer">Transfer</option>
                                                <option value="advance">Advance</option>
                                            </select>
                                        </div>

                                        <div className="relative">
                                            <span className="absolute left-2.5 top-2 text-[10px] text-slate-400 pointer-events-none">₹</span>
                                            <input
                                                type="number"
                                                className="w-28 text-sm text-right bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md pl-5 pr-3 py-1.5 outline-none focus:ring-2 ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-emerald-600 dark:text-emerald-400 h-8 shadow-sm"
                                                value={p.amount}
                                                onChange={(e) => {
                                                    const newPayments = [...payments]
                                                    newPayments[idx].amount = parseFloat(e.target.value) || 0
                                                    setPayments(newPayments)
                                                }}
                                            />
                                        </div>

                                        <button onClick={() => setPayments(payments.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all disabled:hidden" disabled={payments.length === 1}>
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => setPayments([...payments, { method: 'cash', amount: Math.max(0, balanceDue), reference: '' }])} className="mt-2 text-[10px] font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-2 py-1.5 rounded transition-colors flex items-center justify-center gap-1 w-full border border-dashed border-indigo-200 dark:border-indigo-800">
                                <Plus className="h-3 w-3" /> Split Payment (Add Mode)
                            </button>
                        </div>

                        {/* Right Side: Totals & Actions */}
                        <div className="p-4 w-full sm:w-80 flex flex-col justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50 sm:bg-transparent">
                            <div className="space-y-1.5 pt-1">
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="text-slate-700 dark:text-slate-200">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <span className="text-slate-500">Tax</span>
                                    <span className="text-indigo-500">₹{totalTax.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <span className="text-slate-500">Discount</span>
                                    <div className="relative w-20">
                                        <input type="number" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1 text-right outline-none text-red-500 focus:ring-1 ring-red-500/20" value={globalDiscount || ''} placeholder="0" onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                                    <span className="font-bold text-slate-800 dark:text-slate-100">Grand Total</span>
                                    <span className="font-bold text-2xl text-slate-900 dark:text-white tracking-tighter">₹{grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                                <button
                                    onClick={() => handleSave('draft')}
                                    disabled={loading}
                                    className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border-b-2 active:translate-y-0.5 active:border-b-0"
                                >
                                    Draft
                                </button>
                                <button
                                    onClick={() => handleSave('paid' as any)}
                                    disabled={loading}
                                    className={`px-3 py-2.5 text-white text-xs font-bold rounded-xl hover:shadow-lg flex items-center justify-center gap-1.5 transition-all border-b-2 active:translate-y-0.5 active:border-b-0 ${balanceDue < 0 ? "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/20 border-blue-800" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/20 border-indigo-800"}`}
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <DollarSign className="h-4 w-4" />}
                                    {balanceDue < 0 ? 'Advance Receipt' : 'Collect'}
                                </button>
                                <button
                                    onClick={() => handleSave('paid' as any)}
                                    disabled={loading}
                                    className="col-span-2 lg:col-span-1 px-3 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all border-b-2 border-emerald-800 active:translate-y-0.5 active:border-b-0"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                                    WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
