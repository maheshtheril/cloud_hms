'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Plus, Trash2, Search, Save, User, DollarSign, Receipt, X,
  Loader2, CreditCard, Banknote, Smartphone, Maximize2,
  Minimize2, Check, QrCode, Clock, ArrowRight, Activity, Package
} from 'lucide-react'
import { createInvoice, updateInvoice, createQuickPatient } from '@/app/actions/billing'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'

export function CompactInvoiceEditor({ patients, billableItems, uoms = [], taxConfig, initialPatientId, initialMedicines, appointmentId, initialInvoice, onClose, currency = '₹' }: {
  patients: any[],
  billableItems: any[],
  uoms?: any[],
  taxConfig: { defaultTax: any, taxRates: any[] },
  initialPatientId?: string,
  initialMedicines?: any[],
  appointmentId?: string,
  initialInvoice?: any,
  onClose?: () => void,
  currency?: string
}) {

  const getUomOptions = (itemType: string, currentUom: string) => {
    // Standard sets
    const serviceUnits = ['SERVICE', 'UNIT', 'VISIT', 'HOUR', 'DAY'];
    const stockUnits = ['PCS', 'STRIP', 'BOX', 'VIAL', 'ML', 'TABLET', 'CAPSULE'];

    // Combine with DB units
    const dbUnitNames = uoms.map(u => u.name.toUpperCase());
    const allUnits = Array.from(new Set([...serviceUnits, ...stockUnits, ...dbUnitNames, (currentUom || '').toUpperCase()]));

    if (itemType === 'service') {
      return allUnits.filter(u => serviceUnits.includes(u) || (u === currentUom?.toUpperCase()) || (uoms.find(du => du.name.toUpperCase() === u && du.uom_type === 'service')));
    }
    return allUnits.filter(u => stockUnits.includes(u) || (u === currentUom?.toUpperCase()) || dbUnitNames.includes(u));
  }

  interface Payment {
    method: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'advance';
    amount: number;
    reference?: string;
  }

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // UI State
  const [loading, setLoading] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isQuickPatientOpen, setIsQuickPatientOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isWalkIn, setIsWalkIn] = useState(false)

  // Form State
  const [quickPatientName, setQuickPatientName] = useState('')
  const [quickPatientPhone, setQuickPatientPhone] = useState('')
  const [isCreatingPatient, setIsCreatingPatient] = useState(false)
  const [walkInName, setWalkInName] = useState('')
  const [walkInPhone, setWalkInPhone] = useState('')
  const [selectedPatientId, setSelectedPatientId] = useState(initialInvoice?.patient_id || initialPatientId || '')
  const [date, setDate] = useState(initialInvoice?.invoice_date ? new Date(initialInvoice.invoice_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])

  const defaultTaxId = taxConfig.defaultTax?.id || ''

  // Robust Line Item State
  const [lines, setLines] = useState<any[]>(initialInvoice?.hms_invoice_lines ? initialInvoice.hms_invoice_lines
    .map((l: any) => ({
      id: l.id || Date.now() + Math.random(),
      product_id: l.product_id || '',
      description: l.description,
      quantity: Number(l.quantity),
      uom: l.uom || 'PCS',
      unit_price: Number(l.unit_price),
      tax_rate_id: l.tax_rate_id,
      tax_amount: Number(l.tax_amount),
      discount_amount: Number(l.discount_amount),
      base_price: l.unit_price, // Fallback
      item_type: l.product_id ? (billableItems.find(bi => bi.id === l.product_id)?.type || 'item') : 'item'
    })) : [
    { id: 1, product_id: '', description: '', quantity: 1, uom: 'PCS', unit_price: 0, tax_rate_id: defaultTaxId, tax_amount: 0, discount_amount: 0, item_type: 'item' }
  ])

  const [payments, setPayments] = useState<Payment[]>([{ method: 'cash', amount: 0, reference: '' }])
  const [globalDiscount, setGlobalDiscount] = useState(Number(initialInvoice?.total_discount || 0))

  // Totals
  const subtotal = lines.reduce((sum, line) => sum + ((line.quantity * line.unit_price) - (line.discount_amount || 0)), 0)
  const totalTax = lines.reduce((sum, line) => sum + (line.tax_amount || 0), 0)
  const grandTotal = Math.max(0, subtotal + totalTax - globalDiscount)
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const balanceDue = Math.max(0, grandTotal - totalPaid)

  // Handlers
  useEffect(() => { if (selectedPatientId) setIsWalkIn(false); }, [selectedPatientId]);

  const handleQuickPatientCreate = async () => {
    if (!quickPatientName || !quickPatientPhone) return;
    setIsCreatingPatient(true);
    const res = await createQuickPatient(quickPatientName, quickPatientPhone) as any;
    if (res.success && res.data) {
      setSelectedPatientId(res.data.id);
      setIsQuickPatientOpen(false);
    }
    setIsCreatingPatient(false);
  }

  const handleAddItem = () => {
    setLines([...lines, { id: Date.now(), product_id: '', description: '', quantity: 1, uom: 'PCS', unit_price: 0, tax_rate_id: defaultTaxId, tax_amount: 0, discount_amount: 0, item_type: 'item' }])
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

        // Logic for Product/Service Selection
        if (field === 'product_id') {
          const item = billableItems.find(bi => bi.id === value)
          if (item) {
            updated.description = item.description || item.label || item.name
            updated.item_type = item.type || 'item'

            // Extract Prices (Support for packing metadata)
            const basePrice = item.metadata?.basePrice || item.price || 0
            updated.base_price = basePrice
            updated.unit_price = basePrice
            updated.uom = item.metadata?.baseUom || 'PCS'
            updated.tax_rate_id = item.categoryTaxId || defaultTaxId

            // Metadata for complex items
            updated.metadata = item.metadata
          }
        }

        // Logic for UOM Changes (strips vs pieces)
        if (field === 'uom' && updated.metadata) {
          const selectedUom = (value || '').toUpperCase()
          const meta = updated.metadata
          if (selectedUom === (meta.packUom || 'STRIP').toUpperCase() && meta.packPrice) {
            updated.unit_price = meta.packPrice
          } else if (selectedUom === (meta.baseUom || 'PCS').toUpperCase()) {
            updated.unit_price = updated.base_price
          }
        }

        // Recalculate Tax
        const taxRateObj = taxConfig.taxRates.find((t: any) => t.id === updated.tax_rate_id)
        const rate = taxRateObj ? taxRateObj.rate : 0
        const lineNet = (updated.quantity * updated.unit_price) - (updated.discount_amount || 0)
        updated.tax_amount = (Math.max(0, lineNet) * rate) / 100

        return updated
      }
      return line
    }))
  }

  const handleSave = async (status: 'draft' | 'posted' | 'paid') => {
    if (loading) return
    setLoading(true)
    const payload = {
      patient_id: isWalkIn ? null : selectedPatientId,
      appointment_id: appointmentId || searchParams.get('appointmentId'),
      date,
      line_items: lines.filter(l => l.description || l.product_id),
      status,
      total_discount: globalDiscount,
      payments: payments.filter(p => p.amount > 0),
      billing_metadata: isWalkIn ? { is_walk_in: true, patient_name: walkInName, patient_phone: walkInPhone } : {}
    }
    const res = await (initialInvoice?.id ? updateInvoice(initialInvoice.id, payload) : createInvoice(payload))
    if (res.success) {
      toast({ title: "Terminal Sync Successful", description: `Transaction recorded as ${status}.` })
      if (onClose) onClose()
      else router.replace(`/hms/billing/${res.data?.id}`)
    } else {
      setLoading(false)
      toast({ title: "Sync Failed", description: res.error, variant: "destructive" })
    }
  }

  // Auto-load Logic for prescriptions
  const loadPrescriptionItems = async () => {
    if (!selectedPatientId) return toast({ title: "Identify Patient", description: "Select a patient to pull records." });
    setLoading(true)
    try {
      const res = await fetch(`/api/prescriptions/by-patient/${selectedPatientId}`)
      const data = await res.json()
      if (data.success && data.latest?.medicines?.length > 0) {
        const newLines = data.latest.medicines.map((m: any) => ({
          id: Math.random(),
          product_id: m.id,
          description: m.name || m.description,
          quantity: m.quantity || 1,
          unit_price: m.price || 0,
          uom: 'PCS',
          tax_rate_id: defaultTaxId,
          tax_amount: 0,
          item_type: 'item'
        }))
        setLines(newLines)
        toast({ title: "History Loaded", description: "Pulled medicines from latest prescription." })
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all ${isMaximized ? 'p-0' : 'p-4'}`} onClick={() => onClose ? onClose() : router.back()}>
      <div className={`relative flex flex-col bg-white dark:bg-slate-900 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-500 ease-out ${isMaximized ? 'w-full h-full' : 'w-full max-w-[98vw] h-[95vh] rounded-[2.5rem]'}`} onClick={e => e.stopPropagation()}>

        {/* 1. Header Area */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 z-20">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-xl shadow-indigo-500/20">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight italic">Zenith Unified Terminal</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 bg-indigo-500/5 px-2 py-0.5 rounded-full">v4.2 PRO</span>
                <div className="h-1 w-1 rounded-full bg-slate-300" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Services & Pharmacy Terminal</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Clinical Loaders */}
            <div className="flex items-center gap-2">
              <button onClick={loadPrescriptionItems} disabled={!selectedPatientId || loading} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all">
                <Package className="h-3.5 w-3.5" /> Pull Prescription
              </button>
            </div>

            {/* Customer Mode Switcher */}
            <div className="flex items-center bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700">
              <button onClick={() => setIsWalkIn(false)} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${!isWalkIn ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}>REGISTERED</button>
              <button onClick={() => { setIsWalkIn(true); setSelectedPatientId(''); }} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${isWalkIn ? 'bg-white dark:bg-slate-700 text-pink-600 shadow-sm' : 'text-slate-500'}`}>WALK-IN GUEST</button>
            </div>

            <div className="w-[450px]">
              {isWalkIn ? (
                <div className="flex gap-2 animate-in slide-in-from-right-4">
                  <Input value={walkInPhone} onChange={e => setWalkInPhone(e.target.value)} placeholder="MOBILE..." className="h-10 bg-white dark:bg-slate-950 border-transparent focus:border-pink-500 rounded-xl text-[10px] font-black tracking-widest uppercase" />
                  <Input value={walkInName} onChange={e => setWalkInName(e.target.value)} placeholder="NAME..." className="h-10 bg-white dark:bg-slate-950 border-transparent focus:border-pink-500 rounded-xl text-[10px] font-black tracking-widest uppercase" />
                </div>
              ) : (
                <SearchableSelect
                  value={selectedPatientId}
                  onChange={id => setSelectedPatientId(id || '')}
                  onCreate={q => { setQuickPatientName(q); setIsQuickPatientOpen(true); return Promise.resolve(null); }}
                  onSearch={async q => {
                    const search = q.toLowerCase();
                    return patients
                      .filter(p =>
                        (p.first_name?.toLowerCase().includes(search)) ||
                        (p.last_name?.toLowerCase().includes(search)) ||
                        (p.patient_number?.toLowerCase().includes(search)) ||
                        (p.contact?.phone && String(p.contact.phone).includes(q))
                      )
                      .map(p => ({
                        id: p.id,
                        label: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unnamed Patient',
                        subLabel: `ID: ${p.patient_number || 'N/A'} | Ph: ${p.contact?.phone || 'N/A'}`
                      }));
                  }}
                  placeholder="SEARCH PATIENT IDENTITY / MOBILE / ID..."
                />
              )}
            </div>

            <div className="flex gap-2 border-l border-slate-200 dark:border-slate-800 pl-6">
              <button onClick={() => setIsMaximized(!isMaximized)} className="p-3 text-slate-400 hover:text-slate-900 transition-all"><Maximize2 className="h-5 w-5" /></button>
              <button onClick={() => onClose ? onClose() : router.back()} className="p-3 text-slate-400 hover:text-red-500 transition-all"><X className="h-5 w-5" /></button>
            </div>
          </div>
        </div>

        {/* 2. Unified Grid (Medicine & Services) */}
        <div className="flex-1 overflow-auto p-6 bg-slate-50/20 dark:bg-slate-950/20 space-y-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-8 py-4">Item Description</th>
                    <th className="px-4 py-4 w-24">Type</th>
                    <th className="px-4 py-4 w-28 text-center">Qty</th>
                    <th className="px-4 py-4 w-32">UOM</th>
                    <th className="px-4 py-4 w-32">Rate</th>
                    <th className="px-4 py-4 w-36">Tax</th>
                    <th className="px-8 py-4 w-36 text-right italic">Total</th>
                    <th className="px-4 py-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900 border-b border-slate-100 dark:border-slate-900">
                  {lines.map(line => (
                    <tr key={line.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all">
                      <td className="px-8 py-3">
                        <SearchableSelect
                          value={line.product_id}
                          onChange={v => updateLine(line.id, 'product_id', v)}
                          onSearch={async q => {
                            const search = q.toLowerCase();
                            return billableItems
                              .filter(i => (i.label?.toLowerCase().includes(search)) || (i.sku?.toLowerCase().includes(search)))
                              .map(i => ({
                                id: i.id,
                                label: i.label || i.name || 'Unnamed Item',
                                subLabel: `[${(i.type || 'item').toUpperCase()}] STOCK: ${i.stock || 0} | ${currency}${i.price}`
                              }));
                          }}
                          placeholder="SEARCH..."
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${line.item_type === 'service' ? 'bg-indigo-500/10 text-indigo-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                          {(line.item_type || 'ITEM').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3"><Input type="number" value={line.quantity} onChange={e => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 0)} className="h-10 bg-transparent border-none text-center font-black text-base focus:ring-0" /></td>
                      <td className="px-4 py-3">
                        <select className="w-full h-10 bg-slate-50 dark:bg-slate-900 border-none rounded-lg px-2 text-[9px] font-black tracking-widest outline-none focus:ring-1 focus:ring-indigo-500" value={line.uom || ''} onChange={e => updateLine(line.id, 'uom', e.target.value)}>
                          {getUomOptions(line.item_type, line.uom).map(u => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3"><Input type="number" value={line.unit_price} onChange={e => updateLine(line.id, 'unit_price', parseFloat(e.target.value) || 0)} className="h-10 bg-transparent border-none font-mono font-black text-slate-400 text-sm focus:ring-0" /></td>
                      <td className="px-4 py-3">
                        <select className="w-full h-10 bg-transparent border border-slate-100 dark:border-slate-800 rounded-lg px-2 text-[8px] font-black outline-none" value={line.tax_rate_id || ''} onChange={e => updateLine(line.id, 'tax_rate_id', e.target.value)}>
                          <option value="">NO_TAX</option>
                          {taxConfig.taxRates.map((t: any) => <option key={t.id} value={t.id}>{t.name} ({t.rate}%)</option>)}
                        </select>
                      </td>
                      <td className="px-8 py-3 text-right font-black text-lg italic tracking-tighter text-slate-800 dark:text-white">{currency}{(line.quantity * line.unit_price).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleRemoveItem(line.id)} className="text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-900">
                <button onClick={handleAddItem} className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600 hover:text-indigo-800 transition-all group">
                  <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-indigo-200 dark:border-indigo-900/40 shadow-sm group-hover:rotate-90 transition-transform"><Plus className="h-4 w-4" /></div>
                  ADD LINE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Global Control Bar */}
        <div className="bg-white dark:bg-[#0c1222] border-t border-slate-100 dark:border-slate-800 px-10 py-6 z-20">
          <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row justify-between items-center gap-8">

            {/* Summary Metrics */}
            <div className="flex gap-10">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"><Receipt className="h-6 w-6 text-indigo-600" /></div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue Load</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white italic tracking-tighter">{lines.filter(l => l.description || l.product_id).length} Active</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><DollarSign className="h-6 w-6 text-emerald-600" /></div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Settlement Total</p>
                  <p className="text-4xl font-black text-emerald-600 tracking-tighter italic drop-shadow-[0_0_20px_rgba(5,150,105,0.1)]">{currency}{grandTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Action Nodes */}
            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
              <button onClick={() => setIsPaymentModalOpen(true)} disabled={loading || lines.filter(l => l.product_id || l.description).length === 0} className="group relative px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 text-lg font-black italic uppercase tracking-tighter overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20 animate-pulse" />
                COLLECT SETTLEMENT <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex gap-3">
                <button onClick={() => handleSave('draft')} disabled={loading || lines.filter(l => l.product_id || l.description).length === 0} className="px-6 py-4 bg-slate-100 dark:bg-slate-800 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all">Save Draft</button>
                <button onClick={() => handleSave('posted')} disabled={loading || lines.filter(l => l.product_id || l.description).length === 0} className="px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg">Post Credit</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ZENITH SETTLE TERMINAL OVERLAY */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden bg-white dark:bg-[#0a0f1e] border-none shadow-[0_60px_150px_rgba(0,0,0,0.1)] dark:shadow-[0_60px_150px_rgba(0,0,0,0.9)] rounded-[3rem] ring-1 ring-slate-200 dark:ring-white/10 z-[100]">
          <div className="flex flex-col">
            {/* Header & Amount Summary */}
            <div className="p-10 bg-white dark:bg-slate-900/40 border-b border-slate-200 dark:border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-5 -rotate-12"><Receipt className="h-40 w-40 text-slate-900 dark:text-white" /></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="bg-indigo-600/10 dark:bg-indigo-600/20 p-3 rounded-2xl mb-4 border border-indigo-500/10 dark:border-indigo-500/20">
                  <DollarSign className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-slate-400 dark:text-slate-500 font-black tracking-[0.4em] text-[10px] uppercase mb-2">Total Settlement Due</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-300 dark:text-white/40 italic">{currency}</span>
                  <span className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter italic drop-shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)]">{grandTotal.toFixed(2)}</span>
                </div>
                <div className="mt-4 px-4 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/5">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">
                    Recipient: <span className="text-slate-900 dark:text-indigo-400 font-black">{isWalkIn ? walkInName : (patients.find(p => p.id === selectedPatientId) ? `${patients.find(p => p.id === selectedPatientId).first_name} ${patients.find(p => p.id === selectedPatientId).last_name}` : 'UNIDENTIFIED')}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Settlement Matrix - Now single column or 2x2 but more compact */}
            <div className="p-10 flex flex-col gap-8 bg-slate-50/50 dark:bg-[#0c1222]">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'cash', label: 'CASH', icon: Banknote, color: 'text-emerald-500 dark:text-emerald-400' },
                  { id: 'upi', label: 'UPI / QR', icon: QrCode, color: 'text-indigo-600 dark:text-indigo-400' },
                  { id: 'card', label: 'CARD', icon: CreditCard, color: 'text-blue-600 dark:text-blue-400' },
                  { id: 'bank_transfer', label: 'CREDIT', icon: Clock, color: 'text-amber-600 dark:text-amber-400' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      if (m.id === 'bank_transfer') { setIsPaymentModalOpen(false); handleSave('posted'); }
                      else { setPayments([{ method: m.id as any, amount: grandTotal }]); setIsPaymentModalOpen(false); handleSave('paid'); }
                    }}
                    className="group relative py-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-600 dark:hover:border-white/20 active:scale-95 overflow-hidden shadow-sm dark:shadow-none"
                  >
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/10 group-hover:border-current transition-all">
                      <m.icon className={`h-6 w-6 ${m.color}`} />
                    </div>
                    <span className="text-[10px] font-black tracking-[0.2em] text-slate-500 dark:text-white opacity-60 group-hover:opacity-100 uppercase">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Manual Split / Adjustment Terminal */}
              <div className="group/input relative">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-700 font-black text-xl italic">{currency}</span>
                    <input
                      type="number"
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 h-16 rounded-2xl pl-12 pr-6 text-slate-900 dark:text-white font-black text-2xl focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 dark:placeholder:opacity-20"
                      value={payments[0]?.amount || ''}
                      onChange={e => setPayments([{ ...payments[0], amount: parseFloat(e.target.value) || 0 }])}
                      placeholder="0.00"
                    />
                  </div>
                  <button
                    onClick={() => { setIsPaymentModalOpen(false); handleSave('paid'); }}
                    disabled={loading || !payments[0]?.amount}
                    className="bg-indigo-600 hover:bg-indigo-500 h-16 px-8 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all active:scale-90 shadow-xl shadow-indigo-600/20"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "SETTLE"}
                  </button>
                </div>
                <p className="text-[8px] font-black text-center text-slate-600 uppercase tracking-[0.4em] mt-4 opacity-40">Zenith Pay Protocol Secure Terminal</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QUICK PATIENT DIALOG */}
      <Dialog open={isQuickPatientOpen} onOpenChange={setIsQuickPatientOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 rounded-[3rem] border-none p-12 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
          <DialogHeader><DialogTitle className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white">Quick Identification</DialogTitle><DialogDescription className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Register new medical identity node for {quickPatientName}</DialogDescription></DialogHeader>
          <div className="grid gap-8 py-8">
            <div className="space-y-3"><Label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 pl-2">Sync Mobile Terminal</Label><Input value={quickPatientPhone} onChange={e => setQuickPatientPhone(e.target.value)} className="h-14 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl text-lg font-black tracking-widest transition-all focus:ring-4 focus:ring-indigo-500/10" placeholder="+91..." autoFocus /></div>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setIsQuickPatientOpen(false)} className="text-[10px] font-black uppercase tracking-widest py-6">Abort</Button><button onClick={handleQuickPatientCreate} disabled={!quickPatientPhone || isCreatingPatient} className="bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] px-12 text-white shadow-2xl shadow-indigo-500/30 transition-all flex items-center gap-3">{isCreatingPatient ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Verify & Initialize <Check className="h-4 w-4" /></>}</button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  )
}
