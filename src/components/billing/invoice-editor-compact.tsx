'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, Search, Save, FileText, Calendar, User, DollarSign, Receipt, X, Loader2, CreditCard, Banknote, Smartphone, Landmark, MessageCircle, Maximize2, Minimize2, Check, Send, CheckCircle2, QrCode, Printer, ArrowRight } from 'lucide-react'
import { createInvoice, updateInvoice, getPatientBalance, createQuickPatient } from '@/app/actions/billing'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'

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

    // --- 1. STATE HOOKS (Top Level) ---
    const [loading, setLoading] = useState(false)
    const [isMaximized, setIsMaximized] = useState(false)
    const [isQuickPatientOpen, setIsQuickPatientOpen] = useState(false)
    const [quickPatientName, setQuickPatientName] = useState('')
    const [quickPatientPhone, setQuickPatientPhone] = useState('')
    const [isCreatingPatient, setIsCreatingPatient] = useState(false)
    const [isWalkIn, setIsWalkIn] = useState(false)
    const [walkInName, setWalkInName] = useState('')
    const [walkInPhone, setWalkInPhone] = useState('')
    const [extraPatients, setExtraPatients] = useState<any[]>([])
    const [selectedPatientId, setSelectedPatientId] = useState(initialInvoice?.patient_id || initialPatientId || searchParams.get('patientId') || '')
    const [date, setDate] = useState(initialInvoice?.invoice_date ? new Date(initialInvoice.invoice_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
    const [globalDiscount, setGlobalDiscount] = useState(Number(initialInvoice?.total_discount || 0))

    const getDefaultTaxId = () => {
        if (taxConfig.defaultTax?.id) return taxConfig.defaultTax.id;
        return '';
    };
    const defaultTaxId = getDefaultTaxId();

    const [lines, setLines] = useState<any[]>(initialInvoice?.hms_invoice_lines ? initialInvoice.hms_invoice_lines
        .filter((l: any) => l.description || l.product_id)
        .map((l: any) => ({
            id: l.id || Date.now() + Math.random(),
            product_id: l.product_id || '',
            description: l.description,
            quantity: Number(l.quantity),
            uom: l.uom || 'PCS',
            base_uom: 'PCS',
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

    // --- 2. CALCULATIONS (Depend on State) ---
    const subtotal = useMemo(() => lines.reduce((sum, line) => sum + ((line.quantity * line.unit_price) - (line.discount_amount || 0)), 0), [lines])
    const totalTax = useMemo(() => lines.reduce((sum, line) => sum + (line.tax_amount || 0), 0), [lines])
    const grandTotal = useMemo(() => Math.max(0, subtotal + totalTax - globalDiscount), [subtotal, totalTax, globalDiscount])
    const totalPaid = useMemo(() => payments.reduce((sum, p) => sum + (p.amount || 0), 0), [payments])
    const balanceDue = useMemo(() => Math.max(0, grandTotal - totalPaid), [grandTotal, totalPaid])
    const changeAmount = useMemo(() => Math.max(0, totalPaid - grandTotal), [grandTotal, totalPaid])

    // --- 3. ACTIONS ---
    const handleSave = useCallback(async (status: 'draft' | 'posted' | 'paid') => {
        if (loading) return;

        if (!isWalkIn && !selectedPatientId) {
            toast({ title: "Missing Patient", description: "Please select a patient or switch to Walk-in mode.", variant: "destructive" });
            return;
        }
        if (isWalkIn && !walkInName) {
            toast({ title: "Missing Name", description: "Please enter the Walk-in Customer's Name.", variant: "destructive" });
            return;
        }
        if (lines.length === 0 || (lines.length === 1 && !lines[0].description && !lines[0].product_id)) {
            toast({ title: "Empty Invoice", description: "Add at least one item.", variant: "destructive" });
            return;
        }
        if (isWalkIn && balanceDue > 1) {
            toast({ title: "Payment Required", description: "Walk-in customers must pay the full amount immediately.", variant: "destructive" });
            return;
        }

        setLoading(true);
        const billingMetadata: any = {};
        if (isWalkIn) {
            billingMetadata.is_walk_in = true;
            billingMetadata.patient_name = walkInName;
            billingMetadata.patient_phone = walkInPhone;
        }

        let finalizedPayments = [...payments];
        if (changeAmount > 0.01) {
            const excess = changeAmount;
            let remainingToDeduct = excess;
            finalizedPayments = finalizedPayments.map(p => {
                if (remainingToDeduct <= 0) return p;
                const deduct = Math.min(p.amount, remainingToDeduct);
                remainingToDeduct -= deduct;
                return { ...p, amount: p.amount - deduct };
            }).filter(p => p.amount > 0);
            toast({ title: "Cash Change Given", description: `\u20B9${excess.toFixed(2)} returned to customer.` });
        }

        const payload = {
            patient_id: isWalkIn ? null : selectedPatientId,
            appointment_id: appointmentId || searchParams.get('appointmentId'),
            date,
            line_items: lines.filter(l => l.description || l.product_id),
            status,
            total_discount: globalDiscount,
            payments: finalizedPayments,
            billing_metadata: billingMetadata
        };

        try {
            let res;
            if (initialInvoice?.id) res = await updateInvoice(initialInvoice.id, payload);
            else res = await createInvoice(payload);

            if (res.success) {
                toast({ title: "Bill Saved", description: `Successfully ${status === 'draft' ? 'saved draft' : 'posted payment'}.` });
                if (onClose) onClose();
                else if (res.data?.id) router.replace(`/hms/billing/${res.data.id}`);
            } else {
                setLoading(false);
                toast({ title: "Save Failed", description: res.error || "Please check your network or form data.", variant: "destructive" });
            }
        } catch (err: any) {
            setLoading(false);
            toast({ title: "System Error", description: err.message || "An unexpected error occurred.", variant: "destructive" });
        }
    }, [loading, isWalkIn, selectedPatientId, walkInName, walkInPhone, lines, balanceDue, payments, changeAmount, appointmentId, searchParams, date, globalDiscount, initialInvoice, onClose, router, toast]);

    const handleQuickPatientCreate = async () => {
        if (!quickPatientName || !quickPatientPhone) {
            toast({ title: "Missing Fields", description: "Name and Phone are required for Walk-in.", variant: "destructive" });
            return;
        }
        setIsCreatingPatient(true);
        const res = await createQuickPatient(quickPatientName, quickPatientPhone) as any;
        if (res.success && res.data) {
            toast({ title: "Patient Created", description: "Walk-in patient added successfully." });
            setExtraPatients(prev => [...prev, res.data]);
            setSelectedPatientId(res.data.id);
            setIsQuickPatientOpen(false);
            setQuickPatientName('');
            setQuickPatientPhone('');
        } else {
            toast({ title: "Error", description: res.error || "Failed to create patient", variant: "destructive" });
        }
        setIsCreatingPatient(false);
    }

    // --- 4. EFFECTS ---
    useEffect(() => {
        if (selectedPatientId) setIsWalkIn(false);
    }, [selectedPatientId]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F7') { e.preventDefault(); document.getElementById('pos-main-input')?.focus(); }
            if (e.key === 'F8') { e.preventDefault(); handleSave(balanceDue > 1 ? 'posted' : 'paid'); }
            if (e.key === 'F9') { e.preventDefault(); handleSave('paid' as any); }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [balanceDue, handleSave]);

    // --- 5. RENDER HELPERS ---
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

    const [lastAddedId, setLastAddedId] = useState<number | null>(null)
    useEffect(() => {
        if (lastAddedId) {
            setTimeout(() => {
                const el = document.getElementById(`product-search-${lastAddedId}`)
                if (el) el.focus()
            }, 50)
            setLastAddedId(null)
        }
    }, [lastAddedId])

    const handleAddItem = () => {
        const newId = Date.now()
        setLines([...lines, { id: newId, product_id: '', description: '', quantity: 1, unit_price: 0, uom: 'PCS', base_uom: 'PCS', tax_rate_id: defaultTaxId, tax_amount: 0, discount_amount: 0 }])
        setLastAddedId(newId)
    }

    const handleRemoveItem = (id: number) => { if (lines.length > 1) setLines(lines.filter(l => l.id !== id)) }

    const updateLine = (id: number, field: string, value: any) => {
        setLines(lines.map(line => {
            if (line.id === id) {
                const updated = { ...line, [field]: value }
                if (field === 'product_id') {
                    const product = billableItems.find(i => i.id === value)
                    if (product) {
                        updated.description = product.description || product.label
                        updated.base_price = product.metadata?.basePrice || product.price || 0;
                        updated.pack_price = product.metadata?.packPrice || product.price || 0;
                        updated.conversion_factor = product.metadata?.conversionFactor || 1;
                        updated.pack_uom = product.metadata?.packUom || 'PCS';
                        updated.base_uom = product.metadata?.baseUom || 'PCS';
                        updated.uom = updated.base_uom;
                        updated.unit_price = updated.base_price;
                        const taxToUse = product.categoryTaxId || defaultTaxId;
                        updated.tax_rate_id = taxToUse;
                    }
                }
                if (field === 'uom') {
                    const selectedUom = (value || '').toUpperCase();
                    if (line.base_price) {
                        if (selectedUom === 'PCS' || selectedUom === (line.base_uom || 'PCS').toUpperCase()) updated.unit_price = line.base_price;
                        else if (line.pack_uom && selectedUom === line.pack_uom.toUpperCase() && line.pack_price) updated.unit_price = line.pack_price;
                    }
                }
                const currentTaxId = field === 'tax_rate_id' ? value : updated.tax_rate_id;
                const taxRateObj = taxConfig.taxRates.find(t => t.id === currentTaxId);
                const rate = taxRateObj ? taxRateObj.rate : 0;
                const baseTotal = (updated.quantity * updated.unit_price) - (updated.discount_amount || 0);
                updated.tax_amount = (Math.max(0, baseTotal) * rate) / 100;
                return updated
            }
            return line
        }))
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 ${isMaximized ? 'p-0' : 'p-2 sm:p-4'}`}
            onClick={() => onClose ? onClose() : router.back()}
        >
            <div
                className={`relative flex flex-col bg-white dark:bg-slate-900 shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 ring-1 ring-slate-900/10 transition-all duration-300 ${isMaximized ? 'w-full h-full rounded-none' : 'w-full max-w-[96vw] h-[95vh] sm:h-[90vh] rounded-xl'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-lg text-white shadow-md shadow-indigo-500/20">
                            <Receipt className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight italic">{initialInvoice ? 'EDIT' : 'NEW'} INVOICE TERMINAL</h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global HMS POS System</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleAddItem}
                            className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            >
                                {isMaximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onClose ? onClose() : router.back()}
                                className="h-7 w-7 text-slate-400 hover:text-red-500"
                            >
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Patient / Meta Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <User className="h-3 w-3" /> Patient Selection
                            </Label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsWalkIn(!isWalkIn)}
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all ${isWalkIn ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-500 border border-transparent hover:bg-slate-200'}`}
                                >
                                    Walk-in Mode
                                </button>
                                {!isWalkIn && (
                                    <button
                                        onClick={() => setIsQuickPatientOpen(true)}
                                        className="text-[10px] font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="h-2.5 w-2.5" /> Quick Add
                                    </button>
                                )}
                            </div>
                        </div>
                        {isWalkIn ? (
                            <div className="flex gap-2 animate-in slide-in-from-left-2 duration-200">
                                <Input
                                    placeholder="Customer Name"
                                    value={walkInName}
                                    onChange={(e) => setWalkInName(e.target.value)}
                                    className="h-9 text-sm"
                                />
                                <Input
                                    placeholder="Phone"
                                    value={walkInPhone}
                                    onChange={(e) => setWalkInPhone(e.target.value)}
                                    className="h-9 text-sm"
                                />
                            </div>
                        ) : (
                            <SearchableSelect
                                defaultOptions={patients.concat(extraPatients).map(p => ({ label: p.name, id: p.id, subLabel: p.phone }))}
                                onSearch={async (q) => {
                                    const all = patients.concat(extraPatients).map(p => ({ label: p.name, id: p.id, subLabel: p.phone }));
                                    return all.filter(p => p.label.toLowerCase().includes(q.toLowerCase()) || (p.subLabel && p.subLabel.includes(q)));
                                }}
                                value={selectedPatientId}
                                onChange={(val) => setSelectedPatientId(val)}
                                placeholder="Search Patient..."
                                className="w-full"
                            />
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" /> Invoice Date
                        </Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="h-9 text-sm font-bold"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <DollarSign className="h-3 w-3" /> Pricing Strategy
                        </Label>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg px-3 py-1.5 flex flex-col justify-center">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Automatic Mode</span>
                                <span className="text-xs font-black text-slate-700 dark:text-slate-300">STANDARD PRICING</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Pane */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-slate-50/30 dark:bg-slate-900/30">
                    <div className="flex-1 overflow-auto p-4 pt-2">
                        <table className="w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-20">
                                <tr className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
                                    <th className="text-left py-2.5 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest rounded-l-lg">Item / Service</th>
                                    <th className="text-center py-2.5 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-24">Qty</th>
                                    <th className="text-center py-2.5 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-24">UOM</th>
                                    <th className="text-right py-2.5 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-32 text-indigo-500">Unit Price</th>
                                    <th className="text-right py-2.5 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-32">Total</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {lines.map((line) => (
                                    <tr key={line.id} className="group hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 px-3">
                                            <SearchableSelect
                                                inputId={`product-search-${line.id}`}
                                                defaultOptions={billableOptions.map(o => ({ label: o.label, id: o.id, subLabel: o.sku }))}
                                                onSearch={async (q) => {
                                                    return billableOptions
                                                        .filter(o => o.label.toLowerCase().includes(q.toLowerCase()) || (o.sku && o.sku.toLowerCase().includes(q.toLowerCase())))
                                                        .map(o => ({ label: o.label, id: o.id, subLabel: o.sku }));
                                                }}
                                                value={line.product_id}
                                                onChange={(val) => updateLine(line.id, 'product_id', val)}
                                                placeholder="Choose Item..."
                                                variant="ghost"
                                                className="w-full"
                                            />
                                        </td>
                                        <td className="py-3 px-3">
                                            <Input
                                                type="number"
                                                value={line.quantity}
                                                onChange={(e) => updateLine(line.id, 'quantity', Number(e.target.value))}
                                                className="h-8 text-center bg-transparent group-hover:bg-white dark:group-hover:bg-slate-800 border-none shadow-none focus:ring-1 focus:ring-indigo-500 transition-all rounded-lg font-bold"
                                            />
                                        </td>
                                        <td className="py-3 px-3">
                                            <Input
                                                value={line.uom}
                                                onChange={(e) => updateLine(line.id, 'uom', e.target.value)}
                                                className="h-8 text-center bg-transparent group-hover:bg-white dark:group-hover:bg-slate-800 border-none shadow-none focus:ring-1 focus:ring-indigo-500 transition-all rounded-lg text-[11px] font-black uppercase tracking-widest"
                                            />
                                        </td>
                                        <td className="py-3 px-3">
                                            <Input
                                                type="number"
                                                value={line.unit_price}
                                                onChange={(e) => updateLine(line.id, 'unit_price', Number(e.target.value))}
                                                className="h-8 text-right bg-transparent group-hover:bg-white dark:group-hover:bg-slate-800 border-none shadow-none focus:ring-1 focus:ring-indigo-500 transition-all rounded-lg font-black text-indigo-600 dark:text-indigo-400"
                                            />
                                        </td>
                                        <td className="py-3 px-3 text-right text-sm font-black text-slate-700 dark:text-slate-300 tracking-tight">
                                            ₹{(line.quantity * line.unit_price).toFixed(2)}
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveItem(line.id)}
                                                className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* THE ZENITH POS TERMINAL: WORLD CLASS UPGRADE */}
                    <div className="bg-[#0f172a] text-slate-100 shadow-[0_-8px_30px_rgb(0,0,0,0.5)] p-6 z-30 ring-1 ring-white/5 relative overflow-hidden shrink-0">
                        {/* Status Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500 opacity-30"></div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex gap-2">
                                <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-1.5 px-3 rounded-xl">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">READY FOR TENDER</span>
                                </div>
                                <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 p-1.5 px-3 rounded-xl">
                                    <Send className="h-3 w-3 text-indigo-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Live Sync</span>
                                </div>
                            </div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                                ZENITH POS v2.0 <Check className="h-3 w-3 text-emerald-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                            {/* Left: Financial Breakdown */}
                            <div className="lg:col-span-3 grid grid-cols-2 gap-3">
                                <div className="bg-slate-800/20 border border-white/5 rounded-2xl p-4 transition-all hover:bg-slate-800/40 group">
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1 group-hover:text-slate-500">Subtotal</p>
                                    <p className="text-xl font-black tracking-tighter text-slate-400">₹{subtotal.toFixed(2)}</p>
                                </div>
                                <div className="bg-slate-800/20 border border-white/5 rounded-2xl p-4 transition-all hover:bg-slate-800/40 group">
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1 group-hover:text-slate-500">Tax</p>
                                    <p className="text-xl font-black tracking-tighter text-slate-400">₹{totalTax.toFixed(2)}</p>
                                </div>
                                <div className="bg-slate-800/20 border border-white/5 rounded-2xl p-4 transition-all hover:bg-slate-800/40 group flex flex-col justify-center">
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1 group-hover:text-slate-500">Discount</p>
                                    <div className="relative">
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600 font-black text-sm">₹</span>
                                        <input
                                            type="number"
                                            value={globalDiscount}
                                            onChange={(e) => setGlobalDiscount(Number(e.target.value))}
                                            className="w-full bg-transparent border-none p-0 pl-4 text-xl font-black tracking-tighter text-indigo-500 focus:ring-0 placeholder-slate-800"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className={`border rounded-2xl p-4 transition-all flex flex-col justify-center ${changeAmount > 0.01 ? 'bg-pink-500/10 border-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.1)]' : 'bg-slate-800/20 border-white/5'}`}>
                                    <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${changeAmount > 0.01 ? 'text-pink-400 animate-pulse' : 'text-slate-600'}`}>
                                        {changeAmount > 0.01 ? 'RETURN CASH' : 'TENDERED'}
                                    </p>
                                    <p className={`text-xl font-black tracking-tighter ${changeAmount > 0.01 ? 'text-pink-400' : 'text-slate-300'}`}>
                                        ₹{changeAmount > 0.01 ? changeAmount.toFixed(2) : totalPaid.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Middle: THE PRIME INPUT ZONE */}
                            <div className="lg:col-span-5 flex flex-col gap-6">
                                <div className="text-center group">
                                    <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-3 group-hover:scale-110 transition-transform">Net Payable</p>
                                    <div className="inline-flex items-center gap-6 bg-slate-950/50 border-2 border-slate-800 px-10 py-5 rounded-[2rem] shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] transition-all hover:border-indigo-500/50">
                                        <div className="flex flex-col items-start mr-2">
                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Total Bill</span>
                                            <span className="text-4xl font-black tracking-tighter text-slate-700 opacity-50">₹{grandTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="w-px h-16 bg-slate-800 shadow-[1px_0_0_rgba(255,255,255,0.05)]"></div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">To Collect</span>
                                            <span className={`text-7xl font-black tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] ${balanceDue > 0 ? 'text-white' : 'text-emerald-400 italic'}`}>
                                                ₹{balanceDue.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 bg-slate-900/40 p-5 rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur-sm">
                                    {/* Payment Method Selector Tabs */}
                                    <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 gap-1 shadow-inner">
                                        {[
                                            { id: 'cash', label: 'CASH', icon: Banknote, color: 'text-emerald-400' },
                                            { id: 'upi', label: 'UPI / QR', icon: QrCode, color: 'text-indigo-400' },
                                            { id: 'card', label: 'CARD', icon: CreditCard, color: 'text-blue-400' }
                                        ].map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => {
                                                    setPayments([{ ...payments[0], method: m.id as any }]);
                                                    document.getElementById('pos-main-input')?.focus();
                                                }}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${payments[0]?.method === m.id ? 'bg-slate-800 text-white shadow-lg ring-1 ring-white/10 scale-[1.02]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}
                                            >
                                                <m.icon className={`h-4 w-4 ${payments[0]?.method === m.id ? m.color : 'text-slate-700'}`} />
                                                <span className="text-[10px] font-black tracking-[0.2em]">{m.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none transition-all group-focus-within/input:scale-110">
                                            {payments[0]?.method === 'cash' && <Banknote className="h-7 w-7 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]" />}
                                            {payments[0]?.method === 'upi' && <QrCode className="h-7 w-7 text-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]" />}
                                            {payments[0]?.method === 'card' && <CreditCard className="h-7 w-7 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]" />}
                                        </div>
                                        <input
                                            id="pos-main-input"
                                            className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl py-8 pl-16 pr-40 text-5xl font-black tracking-tighter text-white placeholder-slate-900 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]"
                                            placeholder="0.00"
                                            type="number"
                                            autoFocus
                                            value={payments[0]?.amount || ''}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                setPayments([{ ...payments[0], amount: val }]);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Tab') {
                                                    e.preventDefault();
                                                    setPayments([{ ...payments[0], amount: grandTotal }]);
                                                }
                                                if (e.key === 'Enter') handleSave(balanceDue > 1 ? 'posted' : 'paid');
                                            }}
                                        />
                                        <div className="absolute inset-y-0 right-5 flex items-center">
                                            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-2xl shadow-lg ring-1 ring-white/5">
                                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] block mb-0.5 text-center">Settlement</span>
                                                <span className="text-[11px] font-black text-indigo-500 tracking-widest flex items-center justify-center gap-1.5">
                                                    EXACT <div className="bg-slate-800 px-1.5 py-0.5 rounded text-[8px] border border-slate-700 text-slate-400">TAB</div>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Denominations & References Contextual */}
                                    <div className="flex gap-3">
                                        {payments[0]?.method === 'cash' ? (
                                            <div className="flex-1 flex gap-2">
                                                {[100, 200, 500, 2000].map(amt => (
                                                    <button
                                                        key={amt}
                                                        onClick={() => setPayments([{ ...payments[0], amount: (payments[0]?.amount || 0) + amt }])}
                                                        className="flex-1 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/30 h-12 rounded-2xl text-[11px] font-black tracking-widest text-emerald-500 transition-all active:scale-95 shadow-md"
                                                    >
                                                        +{amt}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex-1 relative group">
                                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                                    <Landmark className="h-4 w-4 text-slate-700 group-focus-within:text-indigo-400 transition-colors" />
                                                </div>
                                                <input
                                                    placeholder="REFERENCE / TXN ID..."
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl h-12 pl-11 pr-4 text-[11px] font-black tracking-[0.2em] text-indigo-400 placeholder-slate-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
                                                    value={payments[0]?.reference || ''}
                                                    onChange={(e) => setPayments([{ ...payments[0], reference: e.target.value }])}
                                                />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setPayments([{ ...payments[0], amount: 0, reference: '' }])}
                                            className="bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 px-6 h-12 rounded-2xl text-[10px] font-black tracking-[0.2em] text-red-500 transition-all uppercase hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                                        >
                                            CLR
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right: WORLD CLASS ACTION CONTROLS */}
                            <div className="lg:col-span-4 flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-3 h-full">
                                    <button
                                        onClick={() => {
                                            setPayments([{ method: 'cash', amount: grandTotal }]);
                                            handleSave('paid');
                                        }}
                                        disabled={loading}
                                        className="h-full min-h-[160px] bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_50px_rgba(16,185,129,0.4)] hover:-translate-y-1 active:translate-y-1 active:scale-[0.98] disabled:opacity-50 group relative overflow-hidden"
                                    >
                                        <div className="absolute -top-6 -right-6 p-6 opacity-10 transition-transform group-hover:scale-150 rotate-12 scale-125">
                                            <Banknote className="h-32 w-32" />
                                        </div>
                                        <div className="bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-xl border border-white/20">
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Direct Cash</span>
                                        </div>
                                        <div className="text-center relative z-10">
                                            <span className="block text-3xl font-black leading-tight tracking-tighter italic">FINALIZE</span>
                                            <span className="text-[10px] font-bold opacity-70 tracking-[0.3em] flex items-center justify-center gap-1.5 uppercase">Cash Settle <ArrowRight className="h-3 w-3" /></span>
                                        </div>
                                        <div className="absolute bottom-4 right-6 text-[10px] font-black opacity-30 tracking-widest">[F8]</div>
                                    </button>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => {
                                                setPayments([{ ...payments[0], method: 'upi', amount: grandTotal }]);
                                                document.getElementById('pos-main-input')?.focus();
                                                toast({ title: "UPI Settlement Selected", description: "Terminal pre-filled with grand total." });
                                            }}
                                            disabled={loading}
                                            className="flex-1 bg-slate-900 hover:bg-[#1e2235] border border-white/5 text-white rounded-[1.5rem] flex flex-col items-center justify-center gap-2 transition-all shadow-xl hover:-translate-y-1 hover:border-indigo-500/30 active:scale-95 group relative overflow-hidden"
                                        >
                                            <QrCode className="h-7 w-7 text-indigo-400 mb-1 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                            <span className="text-[9px] font-black tracking-[0.3em] text-indigo-400/80">OVER-THE-AIR</span>
                                            <span className="text-xs font-black tracking-[0.2em] italic">UPI PAY</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setPayments([{ ...payments[0], method: 'card', amount: grandTotal }]);
                                                document.getElementById('pos-main-input')?.focus();
                                                toast({ title: "Card Terminal Selected", description: "Insert or swipe to complete." });
                                            }}
                                            disabled={loading}
                                            className="flex-1 bg-slate-900 hover:bg-[#1e2235] border border-white/5 text-white rounded-[1.5rem] flex flex-col items-center justify-center gap-2 transition-all shadow-xl hover:-translate-y-1 hover:border-blue-500/30 active:scale-95 group relative overflow-hidden"
                                        >
                                            <CreditCard className="h-7 w-7 text-blue-400 mb-1 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                            <span className="text-[9px] font-black tracking-[0.3em] text-blue-400/80">PHYSICAL</span>
                                            <span className="text-xs font-black tracking-[0.2em] italic">CARD SCAN</span>
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleSave('posted')}
                                        disabled={loading || balanceDue === 0}
                                        className="col-span-2 h-20 bg-slate-950 border-2 border-slate-900 hover:border-indigo-500/30 text-slate-500 rounded-3xl flex items-center justify-center gap-5 transition-all hover:bg-slate-900 group active:scale-[0.98] disabled:opacity-20 shadow-inner"
                                    >
                                        <div className="bg-slate-900 p-3 rounded-2xl group-hover:bg-indigo-500/10 transition-colors shadow-lg">
                                            <Smartphone className="h-5 w-5 text-slate-600 group-hover:text-indigo-400" />
                                        </div>
                                        <div className="flex flex-col items-start translate-y-0.5">
                                            <span className="text-[11px] font-black tracking-[0.4em] uppercase group-hover:text-slate-300">FINALIZE ON CREDIT</span>
                                            <span className="text-[8px] font-bold text-slate-700 tracking-[0.2em]">ACCOUNT RECEIVABLE / PAY LATER</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls Legend */}
                <div className="px-6 py-3 bg-[#0a0f1d] border-t border-white/5 flex items-center justify-between z-40 shrink-0">
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <span className="bg-slate-800 text-slate-400 text-[10px] font-black px-2 py-1 rounded-lg border border-slate-700 shadow-lg italic">F7</span>
                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Tender Focus</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-slate-800 text-slate-400 text-[10px] font-black px-2 py-1 rounded-lg border border-slate-700 shadow-lg italic">F8</span>
                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Rapid Settle</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-slate-800 text-slate-400 text-[10px] font-black px-2 py-1 rounded-lg border border-slate-700 shadow-lg italic">F9</span>
                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Full Thermal Print</span>
                        </div>
                    </div>
                    {loading && (
                        <div className="flex items-center gap-3 text-indigo-400 text-[11px] font-black animate-pulse tracking-[0.2em] italic">
                            <Loader2 className="h-4 w-4 animate-spin" /> ENCRYPTING TRANSACTION DATA...
                        </div>
                    )}
                </div>

                {/* Quick Patient Dialog */}
                <Dialog open={isQuickPatientOpen} onOpenChange={setIsQuickPatientOpen}>
                    <DialogContent className="max-w-md bg-[#0f172a] border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-[2.5rem]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tighter text-white italic flex items-center gap-3">
                                <div className="bg-indigo-600 p-2 rounded-xl">
                                    <User className="h-5 w-5" />
                                </div>
                                QUICK PATIENT ONBOARDING
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Instant registration for walk-in billing.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-6">
                            <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Identity / Name</Label>
                                <Input
                                    value={quickPatientName}
                                    onChange={(e) => setQuickPatientName(e.target.value)}
                                    placeholder="Enter Customer Name"
                                    className="h-16 text-xl font-black border-2 border-slate-800 bg-slate-950 text-white rounded-2xl focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Contact / Phone</Label>
                                <Input
                                    value={quickPatientPhone}
                                    onChange={(e) => setQuickPatientPhone(e.target.value)}
                                    placeholder="10-Digit Mobile Number"
                                    className="h-16 text-xl font-black border-2 border-slate-800 bg-slate-950 text-white rounded-2xl focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-3">
                            <Button variant="ghost" onClick={() => setIsQuickPatientOpen(false)} className="font-black text-slate-500 hover:text-white hover:bg-slate-900 rounded-xl h-14 uppercase tracking-widest">DISCARD</Button>
                            <Button
                                onClick={handleQuickPatientCreate}
                                disabled={isCreatingPatient}
                                className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-black h-14 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 group"
                            >
                                {isCreatingPatient ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5 transition-transform group-hover:scale-125" />} REGISTER & BILL
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
