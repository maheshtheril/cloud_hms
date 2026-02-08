'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Plus, Trash2, Search, Save, User, DollarSign, Receipt, X,
  Loader2, CreditCard, Banknote, Smartphone, Maximize2,
  Minimize2, Check, QrCode, Clock, ArrowRight, Activity, Package, Landmark,
  Copy, AlertTriangle
} from 'lucide-react'
import { createInvoice, updateInvoice, cancelInvoice, createQuickPatient, getPatientOutstandingBalance, getPatientLedger, getNextVoucherNumber } from '@/app/actions/billing'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { fixTaxConfiguration } from '@/app/actions/tax-fix'

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

  const { data: session } = useSession()
  const isAdmin = session?.user?.isAdmin

  // UI State
  const [loading, setLoading] = useState(false)
  const [pricingMode, setPricingMode] = useState<'standard' | 'mrp'>('standard')
  const [isMaximized, setIsMaximized] = useState(false)
  const [isQuickPatientOpen, setIsQuickPatientOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isWalkIn, setIsWalkIn] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [lastSavedId, setLastSavedId] = useState<string | null>(null)
  const [patientBalance, setPatientBalance] = useState(0)
  const [includePrevBalance, setIncludePrevBalance] = useState(false)
  const [isLedgerOpen, setIsLedgerOpen] = useState(false)
  const [ledgerData, setLedgerData] = useState<any[]>([])
  const [isFetchingLedger, setIsFetchingLedger] = useState(false)
  const [provisionalNo, setProvisionalNo] = useState<string>("...")
  const amountInputRef = useRef<HTMLInputElement>(null)
  const finalizeButtonRef = useRef<HTMLButtonElement>(null)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [errorDetails, setErrorDetails] = useState({ title: '', message: '' })

  // Focus management for modal
  useEffect(() => {
    if (isPaymentModalOpen) {
      setTimeout(() => amountInputRef.current?.focus(), 150);
    }
  }, [isPaymentModalOpen]);

  // Form State
  const [quickPatientName, setQuickPatientName] = useState('')
  const [quickPatientPhone, setQuickPatientPhone] = useState('')
  const [isCreatingPatient, setIsCreatingPatient] = useState(false)
  const [walkInName, setWalkInName] = useState('')
  const [walkInPhone, setWalkInPhone] = useState('')
  const [selectedPatientId, setSelectedPatientId] = useState(initialInvoice?.patient_id || initialPatientId || '')

  const patientOptions = useMemo(() => patients.map(p => ({
    id: p.id,
    label: p.label || p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unnamed Patient',
    subLabel: `${p.phone || p.contact || ''} ${p.patient_number ? `• UID: ${p.patient_number}` : ''}`
  })), [patients]);

  const itemOptions = useMemo(() => billableItems.map(i => ({
    id: i.id,
    label: i.label || i.name,
    subLabel: `[${(i.type || 'item').toUpperCase()}] ${i.sku ? `SKU: ${i.sku} | ` : ''}${currency}${i.price}`
  })), [billableItems, currency]);

  // Auto-select patient from URL if coming back from registration
  useEffect(() => {
    const pId = searchParams.get('patientId');
    if (pId) {
      setSelectedPatientId(pId);
      setIsWalkIn(false);
    }
  }, [searchParams]);

  const selectedPatientLabel = useMemo(() => {
    if (!selectedPatientId) return ''
    const p = patientOptions.find(p => p.id === selectedPatientId)
    if (p) return p.label
    // Fallback to initial invoice patient name if available
    const inv = initialInvoice as any
    return inv?.hms_patient?.full_name || `${inv?.hms_patient?.first_name || ''} ${inv?.hms_patient?.last_name || ''}`.trim() || inv?.patient_name || ''
  }, [selectedPatientId, patientOptions, initialInvoice])

  const [date, setDate] = useState(initialInvoice?.invoice_date ? new Date(initialInvoice.invoice_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])

  // Fetch provisional number on mount and date change
  useEffect(() => {
    if (!initialInvoice?.invoice_number) {
      getNextVoucherNumber(date).then(res => {
        if (res.success && res.data) setProvisionalNo(res.data);
      });
    } else {
      setProvisionalNo(initialInvoice.invoice_number);
    }
  }, [date, initialInvoice]);

  const defaultTaxId = taxConfig.defaultTax?.id || ''

  // Robust Line Item State
  const [lines, setLines] = useState<any[]>(() => {
    let combinedLines: any[] = []

    // 1. If we are editing an existing invoice (or draft), load those lines first
    if (initialInvoice?.hms_invoice_lines) {
      combinedLines = initialInvoice.hms_invoice_lines.map((l: any) => ({
        id: l.id || Date.now() + Math.random(),
        product_id: l.product_id || '',
        description: l.description,
        quantity: Number(l.quantity),
        uom: l.uom || 'PCS',
        unit_price: Number(l.unit_price),
        tax_rate_id: l.tax_rate_id,
        tax_amount: Number(l.tax_amount),
        discount_amount: Number(l.discount_amount),
        base_price: l.unit_price,
        item_type: l.product_id ? (billableItems.find(bi => bi.id === l.product_id)?.type || 'item') : 'item',
        isFromInvoice: true
      }))
    }

    // 2. If we have initial items passed (doctor prescriptions, nurse items, cons. fees)
    if (initialMedicines && initialMedicines.length > 0) {
      const initialMapped = initialMedicines.map((m: any) => {
        const billable = billableItems.find(bi => bi.id === (m.id || m.product_id) || bi.label === m.name);
        // FIX: Do not auto-exempt services. Trust the Billable Item's tax ID, or fall back to Default Tax.
        const taxId = billable?.categoryTaxId !== undefined ? billable.categoryTaxId : defaultTaxId;
        const finalPrice = billable?.price || Number(m.price || 0);

        // Calculate initial tax
        const taxRateObj = taxConfig.taxRates.find((t: any) => t.id === taxId);
        const rate = taxRateObj ? Number(taxRateObj.rate) : 0;
        const lineNet = (Number(m.quantity || 1) * finalPrice) - 0; // No discount initially
        const taxAmt = (Math.max(0, lineNet) * rate) / 100;

        return {
          id: Math.random() + Date.now(),
          product_id: billable?.id || m.id || '',
          description: m.name || m.description || '',
          quantity: Number(m.quantity || 1),
          uom: m.uom || billable?.uom || 'PCS',
          unit_price: finalPrice,
          tax_rate_id: taxId,
          tax_amount: taxAmt,
          discount_amount: 0,
          base_price: finalPrice,
          item_type: m.type || billable?.type || 'item',
          metadata: billable?.metadata || {}
        }
      });

      // Merge: Add if not already in the draft invoice
      initialMapped.forEach(m => {
        const exists = combinedLines.some(cl => {
          const productMatch = cl.product_id && m.product_id && cl.product_id === m.product_id;
          const descMatch = cl.description?.toLowerCase().trim() === m.description?.toLowerCase().trim();
          return productMatch || descMatch;
        });
        if (!exists) {
          combinedLines.push(m);
        }
      });
    }

    if (combinedLines.length > 0) return combinedLines;

    // 3. Absolute Default: Single empty line
    return [
      { id: 1, product_id: '', description: '', quantity: 1, uom: 'PCS', unit_price: 0, tax_rate_id: defaultTaxId, tax_amount: 0, discount_amount: 0, item_type: 'item' }
    ]
  })

  // Sync Tax Amounts on Mount for initial items
  useEffect(() => {
    if (lines.length > 0) {
      const updatedLines = lines.map(line => {
        const taxRateObj = taxConfig.taxRates.find((t: any) => t.id === line.tax_rate_id)
        const rate = taxRateObj ? Number(taxRateObj.rate) : 0
        const lineNet = (line.quantity * line.unit_price) - (line.discount_amount || 0)
        return {
          ...line,
          tax_amount: (Math.max(0, lineNet) * rate) / 100
        }
      })

      // Only update if changes detected to avoid infinite loop
      const hasChanges = updatedLines.some((l, idx) => l.tax_amount !== lines[idx].tax_amount);
      if (hasChanges) {
        setLines(updatedLines);
      }
    }
  }, []);

  const [payments, setPayments] = useState<Payment[]>([])
  const [activePaymentAmount, setActivePaymentAmount] = useState<string>('')
  const [globalDiscount, setGlobalDiscount] = useState(Number(initialInvoice?.total_discount || 0))

  // Totals
  const subtotal = Number(lines.reduce((sum, line) => sum + ((line.quantity * line.unit_price) - (line.discount_amount || 0)), 0).toFixed(2))
  const totalTax = Number(lines.reduce((sum, line) => sum + (line.tax_amount || 0), 0).toFixed(2))
  const grandTotal = Number(Math.max(0, subtotal + totalTax - globalDiscount).toFixed(2))
  const totalPaid = Number(payments.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2))
  const balanceDue = Number(Math.max(0, grandTotal - totalPaid).toFixed(2))

  // Reliable Settlement Flags (handles floating point precision for currency)
  const settlementTarget = Number((grandTotal + (includePrevBalance ? patientBalance : 0)).toFixed(2))
  const isSurplus = (totalPaid - settlementTarget) > 0.005
  const isDeficit = (settlementTarget - totalPaid) > 0.005
  const isBalanced = !isSurplus && !isDeficit

  // World Class Debt Awareness & Autofocus Node
  useEffect(() => {
    if (selectedPatientId) {
      setIsWalkIn(false);
      getPatientOutstandingBalance(selectedPatientId).then(res => {
        if (res.success) setPatientBalance(res.balance || 0);
      });

      // AUTO FOCUS TO PRODUCT SEARCH
      // We use a slight delay to ensure the patient select dropdown has closed and the grid is interactive
      setTimeout(() => {
        const firstItemSearch = document.getElementById('item-search-0');
        if (firstItemSearch) {
          (firstItemSearch as HTMLInputElement).focus();
        }
      }, 400);
    } else {
      setPatientBalance(0);
    }
  }, [selectedPatientId]);

  // World Class Focus Management: Clear any active focus when loading starts
  useEffect(() => {
    if (loading && typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') {
        document.activeElement.blur();
      }
    }
  }, [loading]);

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
            // Description Polish: Override generic auto-created labels
            const rawDescription = item.description || item.label || item.name;
            updated.description = rawDescription?.includes('Auto-created from') ? (item.label || item.name) : rawDescription;

            updated.item_type = item.type || 'item'

            // Extract Prices (Support for packing metadata)
            const basePrice = item.metadata?.basePrice || item.price || 0
            updated.base_price = basePrice
            updated.unit_price = basePrice
            updated.uom = item.metadata?.baseUom || 'PCS'

            // INTELLIGENT TAX RESOLUTION (UI side fallback)
            let resolvedTaxId = item.categoryTaxId;
            if (!resolvedTaxId && item.categoryTaxRate > 0) {
              const match = taxConfig.taxRates.find((tr: any) => Math.abs(Number(tr.rate) - Number(item.categoryTaxRate)) < 0.1);
              if (match) resolvedTaxId = match.id;
            }
            updated.tax_rate_id = resolvedTaxId || defaultTaxId;

            // Metadata for complex items
            updated.metadata = item.metadata

            // World Class UX: After item selection, move focus to quantity
            setTimeout(() => {
              const lineIndex = lines.findIndex(l => l.id === id);
              const qtyInput = document.getElementById(`qty-input-${lineIndex}`);
              if (qtyInput) (qtyInput as HTMLInputElement).focus();
            }, 100);
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

  const handleSave = async (status: any) => {
    if (loading) return
    const finalPayments = payments.filter(p => p.amount > 0)

    // Auto-paid if fully settled
    const effectiveStatus = (status === 'paid' && totalPaid < grandTotal) ? 'posted' : status;

    if (effectiveStatus === 'paid' && finalPayments.length === 0) {
      return toast({ title: "Payment Required", description: "Apply at least one payment method to mark as paid.", variant: "destructive" });
    }

    // Focus cleanup on sync
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setLoading(true)
    const payload = {
      patient_id: isWalkIn ? null : selectedPatientId,
      appointment_id: appointmentId || searchParams.get('appointmentId') || undefined,
      date,
      line_items: lines.filter(l => l.description || l.product_id),
      status: effectiveStatus,
      total_discount: globalDiscount,
      payments: finalPayments,
      billing_metadata: isWalkIn ? { is_walk_in: true, patient_name: walkInName, patient_phone: walkInPhone } : {}
    }

    try {
      // Execute the save action with a focus on core persistence
      const res = await (initialInvoice?.id ? updateInvoice(initialInvoice.id, payload) : createInvoice(payload))

      if (res.success) {
        let tallyMsg = `Transaction serialized as ${effectiveStatus}.`;
        if (totalPaid > 0) {
          if (totalPaid < grandTotal) {
            tallyMsg = `Partial settlement of ${currency}${totalPaid.toFixed(2)} recorded. Balance ${currency}${balanceDue.toFixed(2)} posted to Patient Credit ledger.`;
          } else if (totalPaid > grandTotal) {
            tallyMsg = `Full settlement recorded with ${currency}${(totalPaid - grandTotal).toFixed(2)} advance deposit detected.`;
          } else {
            tallyMsg = `Invoice fully settled for ${currency}${grandTotal.toFixed(2)}. Connection closed.`;
          }
        }

        toast({ title: "Sync Successful", description: tallyMsg })

        // EXPLICIT CLOSURE: Trigger success state instead of silent redirect
        setLastSavedId(res.data?.id || null)
        setIsSuccess(true)
        setLoading(false)
        setIsPaymentModalOpen(false)
      } else {
        setLoading(false)
        const errorMsg = res.error || "The server rejected the transaction. Please check your data and retry.";
        console.error("Sync Interrupted:", errorMsg);

        setErrorDetails({ title: 'Critical Save Failure', message: errorMsg });
        setIsPaymentModalOpen(false); // nuking this modal first to be sure
        setIsErrorDialogOpen(true);

        toast({
          title: "Sync Interrupted",
          description: errorMsg,
          variant: "destructive"
        })
      }
    } catch (error: any) {
      setLoading(false)
      const errorMsg = error.message || "A network or engine failure occurred.";
      console.error("Terminal Sync Error:", error);

      setErrorDetails({ title: 'Network / Engine Failure', message: errorMsg });
      setIsPaymentModalOpen(false); // nuking this modal first to be sure
      setIsErrorDialogOpen(true);

      toast({
        title: "Network / Engine Failure",
        description: errorMsg,
        variant: "destructive"
      })
    }
  }

  const handleCancelBill = async () => {
    if (!initialInvoice?.id || loading) return
    if (!isAdmin) return toast({ title: "Access Denied", description: "Only financial administrators can void saved transactions.", variant: "destructive" })

    const confirmed = window.confirm("WORLD CLASS SECURITY ALERT: Are you sure you want to VOID this transaction? This will invalidate the ledger node and cannot be undone.")
    if (!confirmed) return

    setLoading(true)
    try {
      const res = await cancelInvoice(initialInvoice.id)
      if (res.success) {
        toast({ title: "Node Invalidated", description: res.message })
        router.push('/hms/billing')
        router.refresh()
      } else {
        toast({ title: "Validation Failed", description: res.error, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "System Error", description: "Failed to communicate with settlement engine.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const applyPricingMode = (mode: 'standard' | 'mrp') => {
    setPricingMode(mode)
    const newLines = lines.map(line => {
      if (!line.product_id) return line;
      const billable = billableItems.find(bi => bi.id === line.product_id);
      if (!billable) return line;

      let newPrice = line.unit_price;
      if (mode === 'mrp' && billable.metadata?.lastMrp) {
        newPrice = Number(billable.metadata.lastMrp);
      } else if (mode === 'standard') {
        newPrice = Number(billable.price);
      }

      // Sync tax for the new price
      const taxRateObj = taxConfig.taxRates.find((t: any) => t.id === line.tax_rate_id)
      const rate = taxRateObj ? Number(taxRateObj.rate) : 0
      const lineNet = (line.quantity * newPrice) - (line.discount_amount || 0)
      const newTax = (Math.max(0, lineNet) * rate) / 100

      return { ...line, unit_price: newPrice, tax_amount: newTax };
    });
    setLines(newLines);
    toast({ title: "Pricing Updated", description: `Switched all lines to ${mode === 'mrp' ? 'MRP' : 'Standard'} pricing.` });
  }

  // Auto-load Logic for prescriptions
  const loadPrescriptionItems = async () => {
    if (!selectedPatientId) return toast({ title: "Identify Patient", description: "Select a patient to pull records." });
    setLoading(true)
    try {
      const res = await fetch(`/api/prescriptions/by-patient/${selectedPatientId}`)
      const data = await res.json()
      if (data.success && data.latest?.medicines?.length > 0) {
        const newLines = data.latest.medicines.map((m: any) => {
          const billable = billableItems.find(bi => bi.id === m.id);
          const taxId = billable?.categoryTaxId !== undefined ? billable.categoryTaxId : defaultTaxId;
          const finalPrice = billable?.price || Number(m.price || 0);

          // Calculate tax
          const taxRateObj = taxConfig.taxRates.find((t: any) => t.id === taxId);
          const rate = taxRateObj ? Number(taxRateObj.rate) : 0;
          const lineNet = (Number(m.quantity || 1) * finalPrice);
          const taxAmt = (Math.max(0, lineNet) * rate) / 100;

          return {
            id: Math.random(),
            product_id: m.id,
            description: m.name || m.description,
            quantity: m.quantity || 1,
            unit_price: finalPrice,
            uom: billable?.uom || 'PCS',
            tax_rate_id: taxId,
            tax_amount: taxAmt,
            item_type: 'item',
            metadata: billable?.metadata || {}
          };
        });
        setLines(newLines)
        toast({ title: "History Loaded", description: "Pulled medicines from latest prescription." })
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  if (isSuccess) {
    // Reset function for "NEXT BILL"
    const handleNextBill = () => {
      setLines([{ id: Date.now(), product_id: '', description: '', quantity: 1, uom: 'PCS', unit_price: 0, tax_rate_id: defaultTaxId, tax_amount: 0, discount_amount: 0, item_type: 'item' }]);
      setPayments([]);
      setGlobalDiscount(0);
      setSelectedPatientId('');
      setIsWalkIn(false);
      setWalkInName('');
      setWalkInPhone('');
      setIsSuccess(false);
      setLastSavedId(null);
      if (onClose) onClose();
      else router.push('/hms/billing');
    };

    return (
      <div className="fixed inset-0 z-[300] bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden border border-white/5 animate-in zoom-in-95 duration-500">
          <div className="p-16 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-8 animate-bounce">
              <Check className="h-12 w-12 text-white stroke-[3px]" />
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-4">TRANSACTION FINALIZED</h1>
            <p className="text-xs font-black uppercase tracking-[0.6em] text-slate-500 mb-12">Serial: {initialInvoice?.invoice_number || 'NEW_ENTRY'} | Ledger Node Synced</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mb-12">
              {/* PRINT RECEIPT */}
              <button
                onClick={() => window.open(`/hms/billing/${lastSavedId}/print`, '_blank')}
                className="group p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:border-indigo-500 transition-all text-center"
              >
                <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                  <Receipt className="h-6 w-6" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Print node</p>
                <p className="text-[11px] font-black text-slate-900 dark:text-white mt-1">RECEIPT</p>
              </button>

              {/* NEW TRANSACTION */}
              <button
                onClick={handleNextBill}
                className="group p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:border-emerald-500 transition-all text-center"
              >
                <div className="bg-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">New Sync</p>
                <p className="text-[11px] font-black text-slate-900 dark:text-white mt-1">NEXT BILL</p>
              </button>

              {/* VIEW LEDGER */}
              <button
                onClick={() => router.push(`/hms/billing/${lastSavedId}`)}
                className="group p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:border-blue-500 transition-all text-center"
              >
                <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  <Search className="h-6 w-6" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Audit Node</p>
                <p className="text-[11px] font-black text-slate-900 dark:text-white mt-1">LEDGER</p>
              </button>

              {/* FINISH & EXIT (World Standard Hub Redirect) */}
              <button
                onClick={() => {
                  if (onClose) onClose();
                  else router.push('/hms/billing');
                }}
                className="group p-8 bg-slate-900 dark:bg-white rounded-[2.5rem] border-4 border-white/10 hover:border-indigo-500 transition-all text-center shadow-2xl shadow-slate-900/50"
              >
                <div className="bg-indigo-500 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-indigo-500/30 group-hover:rotate-12 transition-transform">
                  <ArrowRight className="h-6 w-6" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 opacity-60">Complete</p>
                <p className="text-[11px] font-black text-white dark:text-slate-900 mt-1">EXIT TO HUB</p>
              </button>
            </div>

            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Financial Cycle Closed • Identity Node Deselected</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all ${isMaximized ? 'p-0' : 'p-4'}`} onClick={() => onClose ? onClose() : router.back()}>
      {/* Global Sync Overlay */}
      {loading && (
        <div className="absolute inset-0 z-[200] bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-white/10 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 animate-pulse">Syncing Ledger Node...</p>
          </div>
        </div>
      )}

      <div className={`relative flex flex-col bg-white dark:bg-slate-900 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-500 ease-out ${isMaximized ? 'w-full h-full' : 'w-full max-w-[98vw] h-[95vh] rounded-[2.5rem]'}`} onClick={e => e.stopPropagation()}>

        {/* 1. Header Area */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 z-20">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-xl shadow-indigo-500/20">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight italic">Financial Billing Terminal</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 bg-indigo-500/5 px-2 py-0.5 rounded-full">CORE FINANCE L3</span>
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

              <div className="h-4 w-[1px] bg-slate-200 mx-1" />

              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => applyPricingMode('standard')}
                  className={`px-3 py-1.5 text-[8px] font-black rounded-md transition-all ${pricingMode === 'standard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  INTELLIGENT
                </button>
                <button
                  onClick={() => applyPricingMode('mrp')}
                  className={`px-3 py-1.5 text-[8px] font-black rounded-md transition-all ${pricingMode === 'mrp' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  MRP MODE
                </button>
              </div>
            </div>

            {/* Customer Mode Switcher */}
            <div className="flex items-center bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700">
              <button onClick={() => setIsWalkIn(false)} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${!isWalkIn ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}>REGISTERED</button>
              <button onClick={() => { setIsWalkIn(true); setSelectedPatientId(''); }} className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${isWalkIn ? 'bg-white dark:bg-slate-700 text-pink-600 shadow-sm' : 'text-slate-500'}`}>WALK-IN GUEST</button>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-[400px]">
                {isWalkIn ? (
                  <div className="flex gap-2 animate-in slide-in-from-right-4">
                    <Input value={walkInPhone} onChange={e => setWalkInPhone(e.target.value)} disabled={isPaymentModalOpen || loading} placeholder="MOBILE..." className="h-10 bg-white dark:bg-slate-950 border-transparent focus:border-pink-500 rounded-xl text-[10px] font-black tracking-widest uppercase" />
                    <Input value={walkInName} onChange={e => setWalkInName(e.target.value)} disabled={isPaymentModalOpen || loading} placeholder="NAME..." className="h-10 bg-white dark:bg-slate-950 border-transparent focus:border-pink-500 rounded-xl text-[10px] font-black tracking-widest uppercase" />
                  </div>
                ) : (
                  <SearchableSelect
                    value={selectedPatientId}
                    valueLabel={selectedPatientLabel}
                    options={patientOptions.slice(0, 20)}
                    onChange={id => setSelectedPatientId(id || '')}
                    onCreate={q => { setQuickPatientName(q); setIsQuickPatientOpen(true); return Promise.resolve(null); }}
                    onSearch={async q => {
                      const search = q.toLowerCase();
                      return patientOptions.filter(p =>
                        p.label.toLowerCase().includes(search) ||
                        p.subLabel.toLowerCase().includes(search)
                      );
                    }}
                    placeholder="IDENTIFY PATIENT..."
                    disabled={isPaymentModalOpen || loading}
                  />
                )}
              </div>
              {!isWalkIn && (
                <button
                  onClick={() => router.push(`/hms/patients/new?returnPath=${encodeURIComponent(window.location.pathname)}&autoSelect=true`)}
                  disabled={isPaymentModalOpen || loading}
                  className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95 shrink-0"
                >
                  <Plus className="h-4 w-4" /> New Patient
                </button>
              )}
            </div>
            <div className="flex gap-2 border-l border-slate-200 dark:border-slate-800 pl-6">
              <button onClick={() => setIsMaximized(!isMaximized)} className="p-3 text-slate-400 hover:text-slate-900 transition-all"><Maximize2 className="h-5 w-5" /></button>
              <button onClick={() => onClose ? onClose() : router.back()} className="p-3 text-slate-400 hover:text-red-500 transition-all"><X className="h-5 w-5" /></button>
            </div>
          </div>
        </div>

        {/* 2. Metadata Ribbon & Debt Alert (Regulatory Compliance) */}
        <div className="flex items-center justify-between px-6 py-2 bg-slate-100/50 dark:bg-slate-800/10 border-b border-slate-200/50 dark:border-slate-800/50 z-10 transition-all">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Ledger Identity:</span>
              <span className="text-[10px] font-mono font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-500/10 px-2 py-0.5 rounded cursor-help">
                {provisionalNo}
              </span>
            </div>
            <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-2 group">
              <Clock className="h-3 w-3 text-slate-400 group-hover:text-indigo-500 transition-all" />
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:ring-0 cursor-pointer hover:text-indigo-600 transition-all p-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* World Class Debt Awareness Node */}
            {patientBalance > 0 && !isWalkIn && (
              <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-4 py-1 rounded-full animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600">Previous Balance Detected:</span>
                </div>
                <span className="text-[10px] font-black text-amber-700 bg-amber-500/20 px-2 rounded-md">{currency}{patientBalance.toFixed(2)}</span>
                <button
                  onClick={() => {
                    setIsFetchingLedger(true);
                    setIsLedgerOpen(true);
                    getPatientLedger(selectedPatientId).then(res => {
                      if (res.success) setLedgerData(res.data || []);
                      setIsFetchingLedger(false);
                    });
                  }}
                  className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-600 hover:text-amber-800 underline active:scale-95 transition-all"
                >
                  View Ledger Node
                </button>
              </div>
            )}

            <div className="flex items-center gap-1.5 opacity-60">
              <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Secure Node Enabled</span>
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
                    {taxConfig.taxRates.length === 0 ? (
                      <th className="px-4 py-4 w-36">
                        <div className="flex flex-col items-center">
                          <span className="text-rose-500 animate-pulse text-[10px]">⚠️ NO TAX RATES</span>
                          <button
                            onClick={async () => {
                              if (confirm("Auto-Fix Tax Config? This creates standard GST rates.")) {
                                const res = await fixTaxConfiguration();
                                if (res.success) {
                                  alert("Fixed! Reloading...");
                                  window.location.reload();
                                } else {
                                  alert("Error: " + res.error);
                                }
                              }
                            }}
                            className="mt-1 bg-rose-500 hover:bg-rose-600 text-white text-[9px] px-2 py-0.5 rounded shadow-sm border border-rose-600"
                          >
                            FIX NOW
                          </button>
                        </div>
                      </th>
                    ) : (
                      <th className="px-4 py-4 w-36">Tax %</th>
                    )}
                    <th className="px-8 py-4 w-36 text-right italic">Total</th>
                    <th className="px-4 py-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900 border-b border-slate-100 dark:border-slate-900">
                  {lines.map((line, index) => {
                    const lineTotal = (line.quantity * line.unit_price);
                    const isZeroLine = (line.product_id || line.description) && lineTotal === 0;

                    return (
                      <tr
                        key={line.id}
                        className={`group transition-all relative ${isZeroLine ? 'bg-rose-500/[0.03] dark:bg-rose-500/[0.05]' : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/50'}`}
                      >
                        {isZeroLine && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 animate-pulse z-10" />
                        )}
                        <td className="px-8 py-3">
                          <SearchableSelect
                            inputId={index === 0 ? 'item-search-0' : `item-search-${index}`}
                            value={line.product_id}
                            valueLabel={line.description}
                            options={itemOptions.slice(0, 20)}
                            onChange={v => updateLine(line.id, 'product_id', v)}
                            disabled={isPaymentModalOpen || loading}
                            onSearch={async q => {
                              const search = q.toLowerCase();
                              return itemOptions.filter(i =>
                                i.label.toLowerCase().includes(search) ||
                                i.subLabel.toLowerCase().includes(search)
                              );
                            }}
                            placeholder="SEARCH..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !line.product_id && lines.some(l => l.product_id)) {
                                e.preventDefault();
                                // Automate cleanup: Remove the empty line before settling
                                handleRemoveItem(line.id);
                                setTimeout(() => {
                                  const settleBtn = document.getElementById('settle-button');
                                  if (settleBtn) settleBtn.focus();
                                }, 100);
                              }
                            }}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            disabled={isPaymentModalOpen || loading}
                            onClick={() => {
                              const newType = line.item_type === 'service' ? 'item' : 'service';
                              setLines(prev => prev.map(l => l.id === line.id ? {
                                ...l,
                                item_type: newType
                                // FIX: Do not auto-clear tax when toggling to service.
                                // Tax is now decoupled and preserved.
                              } : l));
                            }}
                            className={`text-[8px] font-black px-1.5 py-0.5 rounded-md transition-all active:scale-95 ${line.item_type === 'service' ? 'bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20' : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'}`}
                          >
                            {(line.item_type || 'ITEM').toUpperCase()}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            id={`qty-input-${index}`}
                            type="number"
                            value={line.quantity}
                            onFocus={(e) => e.target.select()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddItem();
                                // Wait for state update to focus the new search terminal
                                setTimeout(() => {
                                  const nextItemSearch = document.getElementById(`item-search-${index + 1}`);
                                  if (nextItemSearch) nextItemSearch.focus();
                                }, 150);
                              }
                            }}
                            onChange={e => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                            disabled={isPaymentModalOpen || loading}
                            className="h-10 bg-transparent border-none text-center font-black text-base focus:ring-0"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select className="w-full h-10 bg-slate-50 dark:bg-slate-900 border-none rounded-lg px-2 text-[9px] font-black tracking-widest outline-none focus:ring-1 focus:ring-indigo-500" value={line.uom || ''} onChange={e => updateLine(line.id, 'uom', e.target.value)} disabled={isPaymentModalOpen || loading}>
                            {getUomOptions(line.item_type, line.uom).map(u => (
                              <option key={u} value={u}>{u}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3"><Input type="number" value={line.unit_price} onChange={e => updateLine(line.id, 'unit_price', parseFloat(e.target.value) || 0)} disabled={isPaymentModalOpen || loading} className="h-10 bg-transparent border-none font-mono font-black text-slate-400 text-sm focus:ring-0" /></td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <select className="w-full h-8 bg-transparent border border-slate-100 dark:border-slate-800 rounded-lg px-2 text-[8px] font-black outline-none" value={line.tax_rate_id || ''} onChange={e => updateLine(line.id, 'tax_rate_id', e.target.value)} disabled={isPaymentModalOpen || loading}>
                              <option value="">0% (No Tax)</option>
                              {taxConfig.taxRates.map((t: any) => <option key={t.id} value={t.id}>{t.name} ({t.rate}%)</option>)}
                            </select>
                            {line.tax_amount > 0 && (
                              <span className="text-[9px] font-bold text-emerald-600 text-right pr-1">
                                + {currency}{line.tax_amount.toFixed(2)} Tax
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-3 text-right font-black text-lg italic tracking-tighter text-slate-800 dark:text-white">
                          <span className={isZeroLine ? 'text-rose-500 animate-pulse' : ''}>
                            {currency}{(lineTotal + (line.tax_amount || 0)).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleRemoveItem(line.id)} disabled={isPaymentModalOpen || loading} className="text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-900">
                <button onClick={handleAddItem} disabled={isPaymentModalOpen || loading} className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600 hover:text-indigo-800 transition-all group disabled:opacity-50 disabled:cursor-not-allowed">
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
              {initialInvoice?.status === 'cancelled' ? (
                <div className="px-10 py-4 bg-rose-500/10 border-2 border-rose-500/20 rounded-2xl flex items-center gap-3">
                  <X className="h-6 w-6 text-rose-600" />
                  <p className="text-rose-600 font-black italic tracking-wider uppercase">VOIDED TRANSACTION • NO EDITS PERMITTED</p>
                </div>
              ) : (
                <>
                  {isAdmin && initialInvoice?.id && (
                    <button
                      onClick={handleCancelBill}
                      disabled={loading}
                      className="px-6 py-4 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-500/10 border border-rose-500/20 rounded-2xl transition-all mr-2"
                    >
                      Void / Cancel Node
                    </button>
                  )}

                  <button
                    id="settle-button"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();

                      // WORLD STANDARD VALIDATION: Prevent settlement if zero-price items exist
                      const zeroLines = lines.filter(l => (l.product_id || l.description) && (l.quantity * l.unit_price) === 0);
                      if (zeroLines.length > 0) {
                        return toast({
                          title: "Settlement Blocked",
                          description: `You have ${zeroLines.length} item(s) with zero total. Please update the price/quantity or remove them before proceeding.`,
                          variant: "destructive"
                        });
                      }

                      // World Class Focus Management: Clear cursor and lists before overlaying
                      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                      setActivePaymentAmount(grandTotal.toFixed(2));
                      setIsPaymentModalOpen(true);
                    }}
                    disabled={loading || lines.filter(l => l.product_id || l.description).length === 0}
                    className="group relative px-10 py-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-white/20 outline-none text-white rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 text-lg font-black italic uppercase tracking-tighter overflow-hidden focus:translate-y-[-2px] border-2 border-transparent focus:border-white/50"
                  >
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20 animate-pulse" />
                    COLLECT SETTLEMENT <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); handleSave('draft'); }}
                      disabled={loading || lines.filter(l => l.product_id || l.description).length === 0}
                      className="px-6 py-4 bg-slate-100 dark:bg-slate-800 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all"
                    >
                      Save Draft
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); handleSave('posted'); }}
                      disabled={loading || lines.filter(l => l.product_id || l.description).length === 0}
                      className="px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
                    >
                      Post Credit
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* PROFESSIONAL BILLING SETTLEMENT OVERLAY */}
        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="max-w-4xl p-0 overflow-hidden bg-white dark:bg-[#0a0f1e] border-none shadow-[0_60px_200px_rgba(0,0,0,0.2)] dark:shadow-[0_60px_200px_rgba(0,0,0,1)] rounded-[3rem] ring-1 ring-slate-200 dark:ring-white/10"
          >
            <div className="flex flex-col md:flex-row min-h-[500px]">
              {/* COLUMN 1: Audit & Reconciliation (Left) */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-white/5 p-10 flex flex-col gap-8">
                <div>
                  <h3 className="text-slate-400 font-black tracking-[0.4em] text-[8px] uppercase mb-6">Financial Audit Node</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bill Total</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white italic">{currency}{grandTotal.toFixed(2)}</p>
                    </div>
                    {patientBalance > 0 && (
                      <div className="flex justify-between items-center bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
                        <div>
                          <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Previous Debt</p>
                          <p className="text-sm font-black text-amber-700">{currency}{patientBalance.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => setIncludePrevBalance(!includePrevBalance)}
                          className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${includePrevBalance ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-white dark:bg-slate-800 text-amber-600 border border-amber-200 dark:border-amber-900'}`}
                        >
                          {includePrevBalance ? 'INCLUDED' : 'ADD TO TALLY'}
                        </button>
                      </div>
                    )}
                    <div className="h-px bg-slate-200 dark:bg-slate-800 w-full" />
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Settlement Target</p>
                      <p className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter">
                        {currency}{(grandTotal + (includePrevBalance ? patientBalance : 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* History list inside Audit column */}
                {payments.length > 0 && (
                  <div className="space-y-3 flex-1 overflow-auto max-h-[180px] pr-2 custom-scrollbar">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Payment Stream</p>
                    {payments.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900">
                            {p.method === 'cash' && <Banknote className="h-3 w-3 text-emerald-500" />}
                            {p.method === 'upi' && <QrCode className="h-3 w-3 text-indigo-500" />}
                            {p.method === 'card' && <CreditCard className="h-3 w-3 text-blue-500" />}
                            {p.method === 'bank_transfer' && <Clock className="h-3 w-3 text-amber-500" />}
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{p.method}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-black text-slate-900 dark:text-white">{currency}{p.amount.toFixed(2)}</span>
                          <button onClick={() => setPayments(payments.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="h-3 w-3" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tally Summary Overlay Moved here */}
                <div className={`mt-auto p-6 rounded-3xl border transition-all duration-500 ${!isBalanced ? 'bg-amber-500/10 border-amber-500/30 animate-pulse' : 'bg-slate-200/50 dark:bg-slate-800/50 border-white/5'}`}>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isDeficit ? 'bg-amber-100 text-amber-700' : isSurplus ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {isDeficit ? 'Partial / Credit' : isSurplus ? 'Advance / Excess' : 'Balanced'}
                  </span>
                  <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-4 leading-relaxed tracking-tight underline-offset-4 decoration-dotted decoration-slate-300">
                    {isDeficit ?
                      `Deficit: ${currency}${(Math.max(0, settlementTarget - totalPaid)).toFixed(2)} to be carried as debt.` :
                      isSurplus ?
                        `Surplus: ${currency}${(totalPaid - settlementTarget).toFixed(2)} will be credited.` :
                        `Transaction perfectly tallied. Ready for sync.`
                    }
                  </p>
                </div>
              </div>

              {/* COLUMN 2: Matrix Input (Right) */}
              <div className="flex-[1.2] p-10 flex flex-col gap-10 bg-white dark:bg-[#0a0f1e]">


                {/* Manual Split / Adjustment Input */}
                <div className="group/input relative">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-700 font-black text-xl italic">{currency}</span>
                      <input
                        ref={amountInputRef}
                        type="number"
                        className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 h-16 rounded-2xl pl-12 pr-6 text-slate-900 dark:text-white font-black text-2xl focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300"
                        value={activePaymentAmount}
                        onChange={e => setActivePaymentAmount(e.target.value)}
                        placeholder="Enter Amount..."
                        onFocus={(e) => { e.target.select(); e.stopPropagation(); }}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            const amt = parseFloat(activePaymentAmount) || 0;
                            const target = grandTotal + (includePrevBalance ? patientBalance : 0);

                            if (amt > 0) {
                              setPayments(prev => {
                                const newPayments: Payment[] = [...prev, { method: 'cash', amount: amt } as Payment];
                                const currentTotalPaid = newPayments.reduce((sum, p) => sum + p.amount, 0);
                                const remaining = Math.max(0, target - currentTotalPaid);
                                if (remaining === 0) {
                                  setTimeout(() => finalizeButtonRef.current?.focus(), 100);
                                }
                                setTimeout(() => setActivePaymentAmount(remaining > 0 ? remaining.toFixed(2) : ''), 0);
                                return newPayments;
                              });
                            } else if (totalPaid >= target || (payments.length === 0 && amt === 0)) {
                              // If already tallied or user wants to post as credit with 0 paid
                              finalizeButtonRef.current?.focus();
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Settlement Matrix Buttons */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: 'cash', label: 'CASH', icon: Banknote, color: 'text-emerald-500 dark:text-emerald-400' },
                    { id: 'upi', label: 'UPI / QR', icon: QrCode, color: 'text-indigo-600 dark:text-indigo-400' },
                    { id: 'card', label: 'CARD', icon: CreditCard, color: 'text-blue-600 dark:text-blue-400' },
                    { id: 'bank_transfer', label: 'BANK TRANSFER', icon: Landmark, color: 'text-amber-600 dark:text-amber-400' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const amt = parseFloat(activePaymentAmount) || 0;
                        if (amt > 0) {
                          setPayments(prev => {
                            const newPayments: Payment[] = [...prev, { method: m.id as any, amount: amt } as Payment];
                            const currentTotalPaid = newPayments.reduce((sum, p) => sum + p.amount, 0);
                            const remaining = Math.max(0, grandTotal - currentTotalPaid);
                            setTimeout(() => setActivePaymentAmount(remaining > 0 ? remaining.toFixed(2) : ''), 0);
                            return newPayments;
                          });
                        } else {
                          toast({ title: "Amount Required", description: "Enter an amount before selecting a payment method.", variant: "destructive" });
                        }
                      }}
                      className="group relative py-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-600 active:scale-95 shadow-sm dark:shadow-none"
                    >
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/10 group-hover:border-current transition-all">
                        <m.icon className={`h-4 w-4 ${m.color}`} />
                      </div>
                      <span className="text-[8px] font-black tracking-[0.2em] text-slate-500 dark:text-white opacity-60 group-hover:opacity-100 uppercase">{m.label}</span>
                    </button>
                  ))}
                </div>


                {/* Final Conclusion Action */}
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPaymentModalOpen(false); }}
                    className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors border border-slate-200 dark:border-white/5 rounded-2xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPayments([]);
                      setActivePaymentAmount(grandTotal.toFixed(2));
                    }}
                    className="px-6 py-4 text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-600 transition-colors border border-rose-200/50 dark:border-rose-500/20 rounded-2xl"
                  >
                    Reset
                  </button>
                  <button
                    ref={finalizeButtonRef}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      // Safety: Check if there's an un-ledgered amount in the input box
                      const floatingAmt = parseFloat(activePaymentAmount) || 0;
                      if (floatingAmt > 0) {
                        return toast({
                          title: "Unapplied Amount Detected",
                          description: `You have ${currency}${floatingAmt} typed in the amount box that hasn't been ledgered. Please click a payment method (Cash/Card/etc) to apply it, or clear the box before finalizing.`,
                          variant: "destructive"
                        });
                      }

                      // World Class Confirmation Node
                      if (isSurplus) {
                        const confirmed = window.confirm(`AUDIT ALERT: Surplus of ${currency}${(totalPaid - settlementTarget).toFixed(2)} detected. This will be recorded as an ADVANCE deposit in the patient's internal wallet. Proceed with Ledger Entry?`);
                        if (!confirmed) return;
                      } else if (isDeficit && totalPaid > 0) {
                        const confirmed = window.confirm(`AUDIT ALERT: Partial payment detected. ${currency}${(settlementTarget - totalPaid).toFixed(2)} will be carried forward as OUTSTANDING DEBT. Proceed?`);
                        if (!confirmed) return;
                      }

                      handleSave('paid');
                    }}
                    disabled={loading || (payments.length === 0 && (parseFloat(activePaymentAmount) || 0) === 0)}
                    className={`flex-1 h-16 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 col-span-1 ${isDeficit ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20' :
                      isSurplus ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' :
                        'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                      }`}
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                      <>
                        {isDeficit ? (
                          <>POST AS CREDIT <ArrowRight className="h-4 w-4" /></>
                        ) : isSurplus ? (
                          <>RECEIVE ADVANCE <Plus className="h-4 w-4" /></>
                        ) : (
                          <>FINALIZE SETTLEMENT <Check className="h-5 w-5" /></>
                        )}
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[8px] font-black text-center text-slate-600 uppercase tracking-[0.4em] opacity-40">Standard Institutional Billing & Settlement Node</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* QUICK PATIENT DIALOG */}
        <Dialog open={isQuickPatientOpen} onOpenChange={setIsQuickPatientOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 rounded-[3rem] border-none p-12 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
            <DialogHeader><DialogTitle className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white">Quick Identification</DialogTitle><DialogDescription className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Register new medical identity node for {quickPatientName}</DialogDescription></DialogHeader>
            <div className="grid gap-8 py-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 pl-2">Patient Full Name</Label>
                <Input value={quickPatientName} onChange={e => setQuickPatientName(e.target.value)} className="h-14 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl text-lg font-black tracking-widest transition-all focus:ring-4 focus:ring-indigo-500/10" placeholder="NAME..." autoFocus />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 pl-2">Sync Mobile Terminal</Label>
                <Input value={quickPatientPhone} onChange={e => setQuickPatientPhone(e.target.value)} className="h-14 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl text-lg font-black tracking-widest transition-all focus:ring-4 focus:ring-indigo-500/10" placeholder="+91..." />
              </div>
            </div>
            <DialogFooter><Button variant="ghost" onClick={() => setIsQuickPatientOpen(false)} className="text-[10px] font-black uppercase tracking-widest py-6">Abort</Button><button onClick={handleQuickPatientCreate} disabled={!quickPatientPhone || isCreatingPatient} className="bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] px-12 text-white shadow-2xl shadow-indigo-500/30 transition-all flex items-center gap-3">{isCreatingPatient ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Verify & Initialize <Check className="h-4 w-4" /></>}</button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* FINANCIAL LEDGER DIALOG */}
        <Dialog open={isLedgerOpen} onOpenChange={setIsLedgerOpen}>
          <DialogContent className="max-w-4xl bg-white dark:bg-slate-950 rounded-[3rem] border-none p-0 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
            <div className="p-10">
              <DialogHeader className="mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white">Patient Ledger Audit</DialogTitle>
                    <DialogDescription className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">Full financial reconciliation for patient identity node</DialogDescription>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl text-right">
                    <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Total Liability</p>
                    <p className="text-2xl font-black text-amber-700">{currency}{patientBalance.toFixed(2)}</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                {isFetchingLedger ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing Ledger Node...</p>
                  </div>
                ) : ledgerData.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 italic">No financial movements found for this identity node.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-white/5">
                        <th className="py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Date/Time</th>
                        <th className="py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Reference</th>
                        <th className="py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Account Node</th>
                        <th className="py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Debit</th>
                        <th className="py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Credit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                      {ledgerData.map((line, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <td className="py-4 font-mono text-[10px] text-slate-500">
                            {new Date(line.journal_entries?.date).toLocaleDateString()}
                          </td>
                          <td className="py-4">
                            <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase truncate max-w-[150px]">{line.journal_entries?.ref || 'N/A'}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{line.journal_entries?.journals?.name}</p>
                          </td>
                          <td className="py-4">
                            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded uppercase">{line.accounts?.name}</span>
                          </td>
                          <td className="py-4 text-right font-mono text-xs font-black text-rose-500">
                            {line.debit > 0 ? `${currency}${Number(line.debit).toFixed(2)}` : '-'}
                          </td>
                          <td className="py-4 text-right font-mono text-xs font-black text-emerald-500">
                            {line.credit > 0 ? `${currency}${Number(line.credit).toFixed(2)}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-900 flex justify-end">
              <Button onClick={() => setIsLedgerOpen(false)} variant="secondary" className="px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest py-6">
                Close Audit Terminal
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* CRITICAL ERROR DIALOG */}
        <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
          <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] border-none p-0 overflow-hidden shadow-[0_50px_100px_rgba(255,0,0,0.5)]">
            <div className="bg-rose-600 p-8 flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">{errorDetails.title}</h3>
                <p className="text-[10px] font-black text-rose-100 uppercase tracking-widest">System Sync Failure</p>
              </div>
            </div>
            <div className="p-10">
              <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-white/5 mb-8">
                <p className="text-sm font-mono font-medium text-slate-600 dark:text-slate-300 break-words select-text">
                  {errorDetails.message}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(errorDetails.message);
                    toast({ title: "Copied!", description: "Error message copied to clipboard." });
                  }}
                  className="flex-1 flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                >
                  <Copy className="h-4 w-4" /> Copy Error Code
                </button>
                <button
                  onClick={() => setIsErrorDialogOpen(false)}
                  className="px-8 bg-slate-100 dark:bg-slate-800 text-slate-500 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div >
  )
}
