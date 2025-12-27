'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertPayment } from '@/app/actions/accounting/payments';
import { searchSuppliers, getOutstandingPurchaseBills } from '@/app/actions/accounting/helpers';
import {
    ArrowLeft, Save, Loader2, Calendar, CreditCard,
    Building2, FileText, ArrowRight, Wallet, Info
} from 'lucide-react';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewPaymentPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [partnerId, setPartnerId] = useState<string | null>(null);
    const [partnerName, setPartnerName] = useState('');
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('bank_transfer');
    const [reference, setReference] = useState('');
    const [memo, setMemo] = useState('');

    // Allocation State
    const [bills, setBills] = useState<any[]>([]);
    const [allocations, setAllocations] = useState<Record<string, number>>({});
    const [isFetchingBills, setIsFetchingBills] = useState(false);

    // Fetch bills when vendor changes
    const handleVendorChange = async (id: string | null, opt?: any) => {
        setPartnerId(id);
        setPartnerName(opt?.label || '');
        if (id) {
            setIsFetchingBills(true);
            const res = await getOutstandingPurchaseBills(id);
            if (res.success) {
                setBills(res.data || []);
                setAllocations({});
            }
            setIsFetchingBills(false);
        } else {
            setBills([]);
            setAllocations({});
        }
    };

    const handleAllocationChange = (billId: string, val: string) => {
        const num = Number(val);
        const newAllocations = { ...allocations, [billId]: num };
        setAllocations(newAllocations);

        // Update total amount based on allocations
        const total = Object.values(newAllocations).reduce((sum, a) => sum + a, 0);
        if (total > 0) setAmount(total.toString());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!partnerId) {
            toast({ title: "Validation Error", description: "Please select a Payee/Vendor", variant: "destructive" });
            return;
        }
        if (!amount || Number(amount) <= 0) {
            toast({ title: "Validation Error", description: "Please enter a valid amount", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        const res = await upsertPayment({
            type: 'outbound',
            partner_id: partnerId,
            amount: Number(amount),
            method,
            reference,
            date: new Date(date),
            memo,
            allocations: Object.entries(allocations)
                .filter(([_, amt]) => amt > 0)
                .map(([id, amt]) => ({ invoiceId: id, amount: amt }))
        });

        if (res.error) {
            toast({ title: "Error", description: res.error, variant: "destructive" });
            setIsSubmitting(false);
        } else {
            toast({ title: "Success", description: "Payment recorded successfully" });
            router.push('/hms/accounting/payments');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 font-sans relative overflow-hidden text-neutral-900 dark:text-neutral-100">
            <Toaster />

            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            {/* Header */}
            <div className="border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.back()}
                            className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-neutral-400 hover:text-rose-500 dark:hover:text-rose-500 transition-colors border border-slate-200 dark:border-white/10"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </motion.button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                New Payment Protocol
                                <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-500 border border-rose-500/20 uppercase tracking-widest font-black">Outbound</span>
                            </h1>
                            <p className="text-[10px] text-slate-500 dark:text-neutral-500 font-bold uppercase tracking-[0.15em]">Settle vendor liabilities & expenses</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="h-10 px-6 rounded-xl text-xs font-bold text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="h-10 px-8 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Commit Payment
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1200px] mx-auto px-6 py-12">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Form Details */}
                    <div className="lg:col-span-8 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/70 dark:bg-neutral-900/40 border border-slate-200 dark:border-white/5 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Wallet className="h-32 w-32" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                {/* Payee Selection */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Building2 className="h-3 w-3 text-rose-500" /> Destination Vendor
                                    </label>
                                    <SearchableSelect
                                        value={partnerId}
                                        onChange={handleVendorChange}
                                        onSearch={async (q) => searchSuppliers(q)}
                                        placeholder="Identify supplier..."
                                        className="w-full bg-slate-100/50 dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm"
                                        isDark
                                    />
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/5 border border-blue-500/10 rounded text-[10px] text-blue-500 font-bold uppercase tracking-tighter">
                                        <Info className="h-3 w-3" /> Search by Name or GSTIN
                                    </div>
                                </div>

                                {/* Amount - HERO */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        Transaction Value
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-500 font-black text-2xl">₹</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full pl-12 pr-6 py-6 bg-slate-100/50 dark:bg-neutral-950 border border-slate-200 dark:border-rose-500/30 rounded-2xl text-4xl font-black text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-neutral-800 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all font-mono"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-slate-200 dark:bg-white/5 my-10" />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                                {/* Date */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Calendar className="h-3 w-3" /> Registry Date
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-100/50 dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-700 dark:text-neutral-200 focus:outline-none focus:border-rose-500/50 transition-colors [color-scheme:dark] font-bold"
                                    />
                                </div>

                                {/* Method */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <CreditCard className="h-3 w-3" /> Disbursal Vector
                                    </label>
                                    <select
                                        value={method}
                                        onChange={(e) => setMethod(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-100/50 dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-700 dark:text-neutral-200 focus:outline-none focus:border-rose-500/50 transition-colors appearance-none font-bold cursor-pointer"
                                    >
                                        <option value="bank_transfer">BANK TRANSFER / NEFT</option>
                                        <option value="cheque">CHEQUE</option>
                                        <option value="upi">UPI / QR SCAN</option>
                                        <option value="card">CORPORATE CARD</option>
                                        <option value="cash">PETTY CASH</option>
                                    </select>
                                </div>

                                {/* Reference */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-[0.2em]">Ref Protocol</label>
                                    <input
                                        type="text"
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        placeholder="e.g. UTR-987"
                                        className="w-full px-4 py-3 bg-slate-100/50 dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-700 dark:text-neutral-200 focus:outline-none focus:border-rose-500/50 transition-colors placeholder:text-slate-300 dark:placeholder:text-neutral-800 font-mono font-bold uppercase tracking-wider"
                                    />
                                </div>
                            </div>

                            {/* Memo */}
                            <div className="mt-8 space-y-2 relative z-10">
                                <label className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-[0.2em]">Audit Notes</label>
                                <textarea
                                    value={memo}
                                    onChange={(e) => setMemo(e.target.value)}
                                    placeholder="Enter additional transaction context..."
                                    rows={3}
                                    className="w-full px-4 py-4 bg-slate-100/50 dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-2xl text-xs text-slate-700 dark:text-neutral-200 focus:outline-none focus:border-rose-500/50 transition-colors placeholder:text-slate-300 dark:placeholder:text-neutral-800 resize-none font-medium leading-relaxed"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Bills & Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <AnimatePresence>
                            {partnerId ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white/70 dark:bg-neutral-900/40 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl"
                                >
                                    <div className="p-6 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                                                <FileText className="h-3 w-3" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Outstanding Bills</span>
                                        </div>
                                        {bills.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const firstId = bills[0].id;
                                                    const remaining = Number(amount) || 0;
                                                    if (remaining > 0) handleAllocationChange(firstId, remaining.toString());
                                                }}
                                                className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-[0.1em]"
                                            >
                                                Auto-Allocate
                                            </button>
                                        )}
                                    </div>

                                    <div className="p-6 space-y-4 max-h-[400px] overflow-auto">
                                        {isFetchingBills ? (
                                            <div className="py-12 flex flex-col items-center justify-center gap-3">
                                                <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scanning Ledgers...</span>
                                            </div>
                                        ) : bills.length === 0 ? (
                                            <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                                                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center mb-4 border border-slate-200 dark:border-white/10">
                                                    <CheckCircle2 className="h-6 w-6 text-slate-300 dark:text-neutral-600" />
                                                </div>
                                                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Zero Balance</p>
                                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium">No open bills for this vendor</p>
                                            </div>
                                        ) : (
                                            bills.map((bill) => (
                                                <motion.div
                                                    key={bill.id}
                                                    whileHover={{ x: 4 }}
                                                    className="group bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-4 transition-all"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-slate-900 dark:text-white tracking-widest uppercase">{bill.number}</span>
                                                            <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-bold uppercase tracking-tighter">Outstanding: ₹{bill.outstanding.toLocaleString()}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAllocationChange(bill.id, bill.outstanding.toString())}
                                                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                                                        >
                                                            <ArrowRight className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-rose-500/50">₹</span>
                                                        <input
                                                            type="number"
                                                            value={allocations[bill.id] || ''}
                                                            placeholder="Allocated amount"
                                                            onChange={(e) => handleAllocationChange(bill.id, e.target.value)}
                                                            className="w-full pl-7 pr-3 py-2.5 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500/50 transition-all text-right font-mono font-bold"
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>

                                    <div className="p-6 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Allocated</span>
                                            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">₹{Object.values(allocations).reduce((sum, a) => sum + a, 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-slate-100/50 dark:bg-neutral-900/20 border border-dashed border-slate-300 dark:border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center"
                                >
                                    <div className="h-16 w-16 rounded-2xl bg-white dark:bg-neutral-800 flex items-center justify-center mb-6 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
                                        <Building2 className="h-6 w-6 text-slate-300 dark:text-neutral-600" />
                                    </div>
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Awaiting Identity</h3>
                                    <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-tighter">Select a vendor to scan for outstanding liabilities</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </form>
            </div>
        </div>
    );
}
