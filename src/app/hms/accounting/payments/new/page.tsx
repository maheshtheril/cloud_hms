'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { upsertPayment } from '@/app/actions/accounting/payments';
import { searchSuppliers, getOutstandingPurchaseBills } from '@/app/actions/accounting/helpers';
import { getAccounts } from '@/app/actions/accounting/chart-of-accounts';
import {
    ArrowLeft, Save, Loader2, Calendar, CreditCard,
    Building2, FileText, ArrowRight, Wallet, Info, CheckCircle2,
    Briefcase, Plus, Trash2, Layers
} from 'lucide-react';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { motion, AnimatePresence } from 'framer-motion';

type PaymentType = 'bill' | 'direct';

interface DirectLine {
    id: string;
    accountId: string;
    accountName: string;
    description: string;
    amount: string;
}

export default function NewPaymentPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mode: Bill Payment vs Direct Expense
    const [paymentType, setPaymentType] = useState<PaymentType>('bill');

    // Common State
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('bank_transfer');
    const [reference, setReference] = useState('');
    const [memo, setMemo] = useState('');

    // Bill Mode State
    const [partnerId, setPartnerId] = useState<string | null>(null);
    const [partnerName, setPartnerName] = useState('');
    const [bills, setBills] = useState<any[]>([]);
    const [allocations, setAllocations] = useState<Record<string, number>>({});
    const [isFetchingBills, setIsFetchingBills] = useState(false);

    // Direct Mode State
    const [payeeName, setPayeeName] = useState('');
    const [directLines, setDirectLines] = useState<DirectLine[]>([
        { id: '1', accountId: '', accountName: '', description: '', amount: '' }
    ]);
    const [accounts, setAccounts] = useState<any[]>([]);

    // Load Accounts for Direct Mode
    useEffect(() => {
        if (paymentType === 'direct' && accounts.length === 0) {
            getAccounts().then(res => {
                if (res.success) setAccounts(res.data || []);
            });
        }
    }, [paymentType]);

    // --- Bill Logic ---
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
        const total = (Object.values(newAllocations) as number[]).reduce((sum, a) => sum + a, 0);
        setAmount(total > 0 ? total.toString() : '');
    };

    const handlePayFull = (bill: any) => {
        const newAllocations = { ...allocations, [bill.id]: bill.outstanding };
        setAllocations(newAllocations);
        const total = (Object.values(newAllocations) as number[]).reduce((sum, a) => sum + a, 0);
        setAmount(total.toString());
    }

    const handleClearAllocations = () => {
        setAllocations({});
        setAmount('');
    }

    // --- Direct Logic ---
    const updateLine = (id: string, field: keyof DirectLine, val: string) => {
        setDirectLines(lines => lines.map(l => l.id === id ? { ...l, [field]: val } : l));

        // If updating amount, update total
        if (field === 'amount') {
            setTimeout(() => { // Defer to let state update
                const total = directLines.reduce((sum, l) => sum + (l.id === id ? Number(val) : Number(l.amount)), 0);
                setAmount(total > 0 ? total.toString() : '');
            }, 0);
        }
    };

    const addLine = () => {
        setDirectLines(lines => [...lines, {
            id: Math.random().toString(36).substr(2, 9),
            accountId: '',
            accountName: '',
            description: '',
            amount: ''
        }]);
    };

    const removeLine = (id: string) => {
        if (directLines.length === 1) return;
        setDirectLines(lines => lines.filter(l => l.id !== id));
    };

    const handleAccountSearch = async (query: string) => {
        const res = await getAccounts(query);
        return res.success ? res.data?.map((a: any) => ({
            value: a.id,
            label: `${a.code} - ${a.name}`,
            subLabel: a.type
        })) : [];
    };

    // --- Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (paymentType === 'bill' && !partnerId) {
            toast({ title: "Validation Error", description: "Please select a Vendor", variant: "destructive" });
            return;
        }

        if (paymentType === 'direct' && !payeeName) {
            toast({ title: "Validation Error", description: "Please enter a Payee Name", variant: "destructive" });
            return;
        }

        if (!amount || Number(amount) <= 0) {
            toast({ title: "Validation Error", description: "Please enter a valid amount", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);

        const payload: any = {
            type: 'outbound',
            partner_id: paymentType === 'bill' ? partnerId : null,
            payeeName: paymentType === 'direct' ? payeeName : undefined,
            amount: Number(amount),
            method,
            reference,
            date: new Date(date),
            memo,
        };

        if (paymentType === 'bill') {
            payload.allocations = Object.entries(allocations)
                .filter(([_, amt]) => amt > 0)
                .map(([id, amt]) => ({ invoiceId: id, amount: amt }));
        } else {
            payload.lines = directLines
                .filter(l => l.accountId && Number(l.amount) > 0)
                .map(l => ({
                    accountId: l.accountId,
                    amount: Number(l.amount),
                    description: l.description
                }));

            if (payload.lines.length === 0) {
                toast({ title: "Validation Error", description: "Please add at least one valid expense line", variant: "destructive" });
                setIsSubmitting(false);
                return;
            }
        }

        const res = await upsertPayment(payload);

        if (res.error) {
            toast({ title: "Error", description: res.error, variant: "destructive" });
            setIsSubmitting(false);
        } else {
            toast({ title: "Success", description: "Payment recorded successfully" });
            router.push('/hms/accounting/payments');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 font-sans relative overflow-hidden text-neutral-900 dark:text-neutral-100 pb-20">
            <Toaster />

            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            {/* Header */}
            <div className="border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
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
                        <div className="hidden md:flex flex-col items-end mr-4">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Payment</span>
                            <span className="text-xl font-black text-rose-500 font-mono">
                                ₹{Number(amount || 0).toLocaleString()}
                            </span>
                        </div>
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
            <div className="max-w-[1400px] mx-auto px-6 py-8">

                {/* Mode Switcher */}
                <div className="flex justify-center mb-8">
                    <div className="bg-slate-100 dark:bg-neutral-900 p-1 rounded-xl flex items-center gap-1 shadow-inner">
                        <button
                            onClick={() => setPaymentType('bill')}
                            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${paymentType === 'bill' ? 'bg-white dark:bg-neutral-800 text-indigo-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Vendor Bill
                        </button>
                        <button
                            onClick={() => setPaymentType('direct')}
                            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${paymentType === 'direct' ? 'bg-white dark:bg-neutral-800 text-rose-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Direct Expense
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left Column: Payment Details */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/70 dark:bg-neutral-900/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6 backdrop-blur-2xl shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <CreditCard className="h-24 w-24" />
                            </div>

                            <div className="space-y-6 relative z-10">
                                {/* Payee Selection */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Building2 className="h-3 w-3 text-rose-500" />
                                        {paymentType === 'bill' ? 'Destination Vendor' : 'Payee Name'}
                                    </label>

                                    {paymentType === 'bill' ? (
                                        <SearchableSelect
                                            value={partnerId}
                                            onChange={handleVendorChange}
                                            onSearch={async (q) => searchSuppliers(q)}
                                            placeholder="Identify supplier..."
                                            className="w-full bg-slate-100/50 dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm"
                                            isDark
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={payeeName}
                                            onChange={(e) => setPayeeName(e.target.value)}
                                            placeholder="e.g. Electric Company, Landlord, Employee..."
                                            className="w-full px-4 py-3 bg-slate-100/50 dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold placeholder:font-normal"
                                        />
                                    )}
                                </div>

                                {/* Amount */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        Total Transaction Value
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 font-black text-xl">₹</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            // Disabled in direct mode if auto-sum is active, but we allow override for now or auto-calc
                                            // Best practice: Let user enter amount, or auto-calc. 
                                            // In direct mode, let's keep it auto-calc from lines for consistency.
                                            readOnly={paymentType === 'direct'}
                                            placeholder="0.00"
                                            className={`w-full pl-10 pr-4 py-4 bg-slate-100/50 dark:bg-neutral-950 border border-slate-200 dark:border-rose-500/30 rounded-2xl text-2xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all font-mono ${paymentType === 'direct' ? 'opacity-80 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400">
                                        {paymentType === 'bill'
                                            ? 'Enter total amount to auto-allocate oldest bills first.'
                                            : 'Total is automatically calculated from expense lines.'}
                                    </p>
                                </div>

                                <div className="h-px bg-slate-200 dark:bg-white/5 my-4" />

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Date */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-[0.2em]">Date</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-slate-100/50 dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold"
                                        />
                                    </div>

                                    {/* Method */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-[0.2em]">Method</label>
                                        <select
                                            value={method}
                                            onChange={(e) => setMethod(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-slate-100/50 dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold"
                                        >
                                            <option value="bank_transfer">BANK TRANSFER</option>
                                            <option value="cheque">CHEQUE</option>
                                            <option value="upi">UPI / QR</option>
                                            <option value="card">CARD</option>
                                            <option value="cash">CASH</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Reference & Memo */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-[0.2em]">Reference / UTR</label>
                                    <input
                                        type="text"
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        placeholder="e.g. UTR-123456"
                                        className="w-full px-3 py-2.5 bg-slate-100/50 dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-[0.2em]">Notes</label>
                                    <textarea
                                        value={memo}
                                        onChange={(e) => setMemo(e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2.5 bg-slate-100/50 dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium resize-none"
                                    />
                                </div>

                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Allocation Table */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white/70 dark:bg-neutral-900/40 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-xl min-h-[600px] flex flex-col">

                            {/* Table Header */}
                            <div className="p-4 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                                        {paymentType === 'bill' ? <FileText className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            {paymentType === 'bill' ? 'Outstanding Bills' : 'Expense Allocation'}
                                        </h3>
                                        <p className="text-[10px] text-slate-500">
                                            {paymentType === 'bill' ? 'Allocate payment amount against specific bills' : 'Categorize expenses to Chart of Accounts'}
                                        </p>
                                    </div>
                                </div>

                                {paymentType === 'bill' && (
                                    <div className="flex items-center gap-3">
                                        {bills.length > 0 && (
                                            <>
                                                <button type="button" onClick={handleClearAllocations} className="text-[10px] font-black text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-[0.1em]">Clear</button>
                                                <div className="h-3 w-px bg-slate-200 dark:bg-white/10" />
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
                                            </>
                                        )}
                                        <div className="text-right">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Allocated</span>
                                            <span className={`text-lg font-black font-mono ${Number(amount) === Object.values(allocations).reduce((a: number, b: number) => a + b, 0) ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                ₹{Object.values(allocations).reduce((sum: number, a: number) => sum + a, 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {paymentType === 'direct' && (
                                    <button
                                        type="button"
                                        onClick={addLine}
                                        className="h-8 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                                    >
                                        <Plus className="h-3 w-3" /> Add Line
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 overflow-auto p-0">
                                {paymentType === 'bill' ? (
                                    // ... Bill Table Logic ...
                                    isFetchingBills ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                                            <Loader2 className="h-8 w-8 animate-spin" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Fetching Ledger...</span>
                                        </div>
                                    ) : !partnerId ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400 opacity-50">
                                            <Building2 className="h-12 w-12" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Select Vendor to View Bills</span>
                                        </div>
                                    ) : bills.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-4 text-emerald-500">
                                            <CheckCircle2 className="h-12 w-12" />
                                            <span className="text-xs font-bold uppercase tracking-widest">All Cleared</span>
                                            <p className="text-[10px] text-slate-400">No outstanding bills found for this vendor.</p>
                                        </div>
                                    ) : (
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-slate-50 dark:bg-white/[0.02] sticky top-0 z-10 text-[10px] uppercase font-black tracking-wider text-slate-500">
                                                <tr>
                                                    <th className="px-6 py-3">Bill #</th>
                                                    <th className="px-4 py-3">Date</th>
                                                    <th className="px-4 py-3">Due Date</th>
                                                    <th className="px-4 py-3 text-right">Total</th>
                                                    <th className="px-4 py-3 text-right">Balance</th>
                                                    <th className="px-6 py-3 text-right w-48">Payment</th>
                                                    <th className="px-2 py-3"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs font-medium text-slate-700 dark:text-slate-300">
                                                {bills.map((bill) => (
                                                    <tr key={bill.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">{bill.number}</td>
                                                        <td className="px-4 py-4">{new Date(bill.date).toLocaleDateString()}</td>
                                                        <td className="px-4 py-4 text-slate-500">{bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : '-'}</td>
                                                        <td className="px-4 py-4 text-right font-mono">{bill.total.toLocaleString()}</td>
                                                        <td className="px-4 py-4 text-right font-mono font-bold text-rose-500">{bill.outstanding.toLocaleString()}</td>
                                                        <td className="px-6 py-3 text-right">
                                                            <input
                                                                type="number"
                                                                value={allocations[bill.id] || ''}
                                                                placeholder="0.00"
                                                                onChange={(e) => handleAllocationChange(bill.id, e.target.value)}
                                                                className={`w-32 px-3 py-2 bg-slate-100 dark:bg-black/20 border rounded-lg text-right font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${(allocations[bill.id] || 0) > 0 ? 'border-indigo-500/50 text-indigo-600 dark:text-indigo-400' : 'border-transparent'}`}
                                                            />
                                                        </td>
                                                        <td className="px-2 py-3 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => handlePayFull(bill)}
                                                                className="text-[10px] font-bold text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all"
                                                            >
                                                                PAY FULL
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            {/* Footer Totals */}
                                            <tfoot className="bg-slate-50 dark:bg-white/[0.02] font-bold text-xs sticky bottom-0 z-10 border-t border-slate-200 dark:border-white/10">
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-4 text-right uppercase tracking-wider text-slate-500">Total Outstanding</td>
                                                    <td className="px-4 py-4 text-right font-mono text-rose-500">{bills.reduce((sum, b) => sum + b.outstanding, 0).toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-right font-mono text-indigo-500">{Object.values(allocations).reduce((sum, a) => sum + a, 0).toLocaleString()}</td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    )
                                ) : (
                                    // --- Direct Expense Table ---
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 dark:bg-white/[0.02] sticky top-0 z-10 text-[10px] uppercase font-black tracking-wider text-slate-500">
                                            <tr>
                                                <th className="px-6 py-3 w-1/3">Expense Account</th>
                                                <th className="px-4 py-3">Description</th>
                                                <th className="px-4 py-3 text-right w-40">Amount</th>
                                                <th className="px-2 py-3 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs font-medium text-slate-700 dark:text-slate-300">
                                            {directLines.map((line) => (
                                                <tr key={line.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors relative">
                                                    <td className="px-6 py-3">
                                                        <SearchableSelect
                                                            value={line.accountId}
                                                            onChange={(id, opt) => updateLine(line.id, 'accountId', id || '')}
                                                            onSearch={handleAccountSearch}
                                                            placeholder="Select Account..."
                                                            className="w-full bg-slate-100/50 dark:bg-neutral-950 border-transparent rounded-lg text-xs"
                                                            isDark
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={line.description}
                                                            onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                                                            placeholder="Details about this expense..."
                                                            className="w-full bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-white/10 focus:border-indigo-500 px-0 py-2 focus:outline-none transition-all"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <input
                                                            type="number"
                                                            value={line.amount}
                                                            placeholder="0.00"
                                                            onChange={(e) => updateLine(line.id, 'amount', e.target.value)}
                                                            className="w-full bg-slate-100 dark:bg-black/20 border border-transparent rounded-lg px-3 py-2 text-right font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                        />
                                                    </td>
                                                    <td className="px-2 py-3 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeLine(line.id)}
                                                            className="text-slate-400 hover:text-rose-500 transition-colors opacity-50 hover:opacity-100"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
