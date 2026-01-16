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
    date?: string; // Allow per-line date
}

import { ClassicVoucherEditor } from '@/components/accounting/classic-voucher-editor';

export default function NewPaymentPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [classicMode, setClassicMode] = useState(false);

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
        { id: '1', accountId: '', accountName: '', description: '', amount: '', date: new Date().toISOString().split('T')[0] }
    ]);
    const [accounts, setAccounts] = useState<any[]>([]);

    // Load Accounts for Direct Mode
    useEffect(() => {
        if (paymentType === 'direct' && accounts.length === 0) {
            getAccounts('', ['Expense', 'Cost of Goods Sold', 'Other Expense', 'Asset']).then(res => {
                if (res.success) setAccounts(res.data || []);
            });
        }
    }, [paymentType]);

    // --- Bill Logic ---
    const [isManualPayee, setIsManualPayee] = useState(false);

    // --- Bill Logic ---
    const handleVendorChange = async (id: string | null, opt?: any) => {
        setPartnerId(id);
        setPartnerName(opt?.label || '');
        if (id) {
            // Only fetch bills if in Bill Mode. In Direct Mode, we just use the ID.
            if (paymentType === 'bill') {
                setIsFetchingBills(true);
                const res = await getOutstandingPurchaseBills(id);
                if (res.success) {
                    setBills(res.data || []);
                    setAllocations({});
                }
                setIsFetchingBills(false);
            }
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
            amount: '',
            date: date // Default to current batch date
        }]);
    };

    const removeLine = (id: string) => {
        if (directLines.length === 1) return;
        setDirectLines(lines => lines.filter(l => l.id !== id));
    };

    const handleAccountSearch = async (query: string) => {
        // Filter for Expense-like accounts as per world standards for "Record Expense"
        const res = await getAccounts(query, ['Expense', 'Cost of Goods Sold', 'Other Expense', 'Asset']);
        return res.success ? res.data?.map((a: any) => ({
            id: a.id,
            label: `${a.code} - ${a.name}`,
            subLabel: a.type
        })) : [];
    };

    // --- Submission ---
    const handleSavePayload = async (payload: any) => {
        // Internal helper without toast spam if batch
        const res = await upsertPayment(payload);
        return res;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (paymentType === 'bill' && !partnerId) {
            toast({ title: "Validation Error", description: "Please select a Vendor", variant: "destructive" });
            return;
        }

        // Direct Payment Validation
        if (paymentType === 'direct') {
            if (isManualPayee && !payeeName) {
                toast({ title: "Validation Error", description: "Please enter a Payee Name", variant: "destructive" });
                return;
            }
            if (!isManualPayee && !partnerId) {
                toast({ title: "Validation Error", description: "Please select a Vendor (or switch to manual entry)", variant: "destructive" });
                return;
            }
        }

        if (!amount || Number(amount) <= 0) {
            toast({ title: "Validation Error", description: "Please enter a valid amount", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);

        const basePayload: any = {
            type: 'outbound',
            partner_id: partnerId,
            payeeName: (paymentType === 'direct' && isManualPayee) ? payeeName : undefined,
            method,
            reference,
            memo,
        };

        if (paymentType === 'bill') {
            // Bill Payment (Single Date)
            const payload = {
                ...basePayload,
                amount: Number(amount),
                date: new Date(date),
                allocations: Object.entries(allocations)
                    .filter(([_, amt]) => amt > 0)
                    .map(([id, amt]) => ({ invoiceId: id, amount: amt }))
            };

            const res = await handleSavePayload(payload);
            if (res.error) {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Payment recorded successfully" });
                router.push('/hms/accounting/payments');
            }
        } else {
            // Direct Expense (Unified Batch - One Payment Number)
            const validLines = directLines.filter(l => l.accountId && Number(l.amount) > 0);

            if (validLines.length === 0) {
                toast({ title: "Validation Error", description: "Please add at least one valid expense line", variant: "destructive" });
                setIsSubmitting(false);
                return;
            }

            // Calculate Total for the Header
            const totalAmount = validLines.reduce((sum, l) => sum + Number(l.amount), 0);

            const payload = {
                ...basePayload,
                amount: totalAmount,
                date: new Date(date), // The Payment/Voucher Date
                lines: validLines.map(l => {
                    // Start description with date if specific date is set and differs from batch date
                    const lineDate = l.date || date;
                    const descPrefix = lineDate && lineDate !== date ? `[${lineDate}] ` : '';
                    return {
                        accountId: l.accountId,
                        amount: Number(l.amount),
                        description: `${descPrefix}${l.description || ''}`
                    };
                })
            };

            const res = await handleSavePayload(payload);

            if (res.error) {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: `Expense Voucher recorded successfully.` });
                if (!classicMode) router.push('/hms/accounting/payments');
            }
        }

        setIsSubmitting(false);
    };

    if (classicMode) {
        return (
            <ClassicVoucherEditor
                type="payment"
                onSave={handleSavePayload}
                onCancel={() => setClassicMode(false)}
                suppliersSearch={searchSuppliers}
                accountsSearch={handleAccountSearch}
                getBills={getOutstandingPurchaseBills as any}
                currency="₹"
            />
        );
    }

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
                        <button
                            type="button"
                            onClick={() => setClassicMode(true)}
                            className="h-10 px-6 rounded-xl border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-indigo-500"
                        >
                            Classic ERP Mode
                        </button>
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


                {/* Mode Switcher - Centered and Futuristic */}
                <div className="flex justify-center mb-10">
                    <div className="bg-white dark:bg-neutral-900/80 p-1.5 rounded-2xl flex items-center gap-1 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 backdrop-blur-xl">
                        <button
                            onClick={() => setPaymentType('bill')}
                            className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${paymentType === 'bill' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-105' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                        >
                            Pay Vendor Bill
                        </button>
                        <button
                            onClick={() => setPaymentType('direct')}
                            className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${paymentType === 'direct' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20 scale-105' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                        >
                            Record Expenses
                        </button>
                    </div>
                </div>

                {paymentType === 'bill' ? (
                    // --- VENDOR BILL LAYOUT (SPLIT) ---
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column: Vendor & Payment Details */}
                        <div className="lg:col-span-4 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/70 dark:bg-neutral-900/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6 backdrop-blur-2xl shadow-xl relative overflow-hidden"
                            >
                                <div className="space-y-6 relative z-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 dark:text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Building2 className="h-3 w-3 text-indigo-500" /> Vendor Selection
                                        </label>
                                        <SearchableSelect
                                            value={partnerId}
                                            onChange={handleVendorChange}
                                            onSearch={async (q) => searchSuppliers(q)}
                                            placeholder="Search Supplier..."
                                            className="w-full bg-slate-50/50 dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm"
                                            isDark
                                        />
                                    </div>

                                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                Total Payment
                                            </label>
                                            <div className="relative group">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-xl">₹</span>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-2xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono"
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                Allocated automatically to oldest bills unless specified.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</label>
                                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Method</label>
                                            <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold">
                                                <option value="bank_transfer">Bank Transfer</option>
                                                <option value="cheque">Cheque</option>
                                                <option value="upi">UPI</option>
                                                <option value="cash">Cash</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reference</label>
                                        <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="UTR / Cheque No." className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column: Outstanding Bills Table */}
                        <div className="lg:col-span-8 space-y-6">
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/70 dark:bg-neutral-900/40 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-xl min-h-[600px] flex flex-col">
                                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                                    <h3 className="text-sm font-bold flex items-center gap-2"><FileText className="h-4 w-4 text-indigo-500" /> Outstanding Bills</h3>
                                    <div className="text-right">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Allocated</span>
                                        <span className="text-lg font-black font-mono text-indigo-600">₹{Object.values(allocations).reduce((sum: number, a: number) => sum + a, 0).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-auto p-0">
                                    {/* Same Bill Table Logic as before */}
                                    {bills.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400 opacity-50">
                                            <Building2 className="h-12 w-12" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Select Vendor to View Bills</span>
                                        </div>
                                    ) : (
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500">
                                                <tr>
                                                    <th className="px-6 py-3">Bill #</th>
                                                    <th className="px-4 py-3">Date</th>
                                                    <th className="px-4 py-3">Due</th>
                                                    <th className="px-4 py-3 text-right">Total</th>
                                                    <th className="px-4 py-3 text-right">Due</th>
                                                    <th className="px-6 py-3 text-right">Payment</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {bills.map((bill) => (
                                                    <tr key={bill.id} className="hover:bg-slate-50">
                                                        <td className="px-6 py-4 font-bold text-indigo-600">{bill.number}</td>
                                                        <td className="px-4 py-4 text-xs">{new Date(bill.date).toLocaleDateString()}</td>
                                                        <td className="px-4 py-4 text-xs text-slate-500">{bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : '-'}</td>
                                                        <td className="px-4 py-4 text-right font-mono text-xs">{bill.total.toLocaleString()}</td>
                                                        <td className="px-4 py-4 text-right font-mono font-bold text-rose-500 text-xs">{bill.outstanding.toLocaleString()}</td>
                                                        <td className="px-6 py-3 text-right">
                                                            <input
                                                                type="number"
                                                                value={allocations[bill.id] || ''}
                                                                onChange={(e) => handleAllocationChange(bill.id, e.target.value)}
                                                                className="w-24 px-2 py-1 bg-white border border-slate-200 rounded text-right font-mono text-xs focus:border-indigo-500 outline-none"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </form>
                ) : (
                    // --- DIRECT EXPENSE LAYOUT (FUTURISTIC GRID) ---
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-5xl mx-auto"
                    >
                        <div className="bg-white/80 dark:bg-neutral-900 border border-slate-200 dark:border-white/5 rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-xl">
                            {/* Futuristic Header */}
                            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-3">
                                        <Wallet className="h-6 w-6 text-rose-500" />
                                        Expense Recorder
                                    </h2>
                                    <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-bold">Multiple receipts? No problem.</p>
                                </div>
                                <div className="text-right bg-white/10 px-6 py-2 rounded-2xl border border-white/10">
                                    <span className="text-[10px] uppercase font-black text-rose-300 block">Total Expenses</span>
                                    <span className="text-3xl font-black font-mono tracking-tight">₹{Number(amount || 0).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Data Grid (Responsive) */}
                            <div className="p-4 md:p-6">
                                {/* Desktop Table */}
                                <div className="hidden md:block rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-white/5 text-[10px] uppercase font-black text-slate-500 tracking-wider">
                                                <th className="px-4 py-3 w-12 text-center">#</th>
                                                <th className="px-4 py-3 w-48">Expense Type (Category)</th>
                                                <th className="px-4 py-3">Description & Payee</th>
                                                <th className="px-4 py-3 w-40">Date</th>
                                                <th className="px-4 py-3 w-40 text-right">Amount (₹)</th>
                                                <th className="px-2 py-3 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-sm">
                                            {directLines.map((line, idx) => (
                                                <tr key={line.id} className="group hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors">
                                                    <td className="px-4 py-4 text-center font-bold text-slate-300">{idx + 1}</td>
                                                    <td className="px-4 py-4 align-top">
                                                        <SearchableSelect
                                                            value={line.accountId}
                                                            onChange={(id, opt) => updateLine(line.id, 'accountId', id || '')}
                                                            onSearch={handleAccountSearch}
                                                            placeholder="Select Category..."
                                                            className="w-full bg-transparent border-b border-transparent group-hover:bg-white group-hover:border-slate-200 text-sm py-1"
                                                            isDark
                                                        />
                                                    </td>
                                                    <td className="px-4 py-4 align-top">
                                                        <input
                                                            type="text"
                                                            value={line.description}
                                                            onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                                                            placeholder="e.g. Uber to Airport (Paid to Driver)"
                                                            className="w-full bg-transparent font-medium placeholder:font-normal focus:outline-none focus:text-indigo-600 transition-colors"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-4 align-top">
                                                        <input
                                                            type="date"
                                                            value={line.date || date}
                                                            onChange={(e) => updateLine(line.id, 'date', e.target.value)}
                                                            className="w-full bg-transparent font-medium text-slate-500 hover:text-slate-900 border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-4 align-top">
                                                        <input
                                                            type="number"
                                                            value={line.amount}
                                                            onChange={(e) => updateLine(line.id, 'amount', e.target.value)}
                                                            placeholder="0.00"
                                                            className="w-full text-right font-mono font-bold text-rose-500 bg-transparent focus:outline-none focus:bg-rose-50 rounded px-2"
                                                        />
                                                    </td>
                                                    <td className="px-2 py-4 text-center align-top">
                                                        <button onClick={() => removeLine(line.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile List View */}
                                <div className="md:hidden space-y-4">
                                    {directLines.map((line, idx) => (
                                        <div key={line.id} className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 space-y-4 border border-slate-100 dark:border-white/5 relative">
                                            <div className="flex justify-between items-start">
                                                <span className="h-6 w-6 rounded-full bg-slate-200 dark:bg-white/10 text-xs font-bold flex items-center justify-center text-slate-500">#{idx + 1}</span>
                                                <button onClick={() => removeLine(line.id)} className="text-slate-400 hover:text-rose-500 p-1"><Trash2 className="h-4 w-4" /></button>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Category</label>
                                                <SearchableSelect
                                                    value={line.accountId}
                                                    onChange={(id, opt) => updateLine(line.id, 'accountId', id || '')}
                                                    onSearch={handleAccountSearch}
                                                    placeholder="Select Expense Category..."
                                                    className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl"
                                                    isDark
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Details</label>
                                                <input
                                                    type="text"
                                                    value={line.description}
                                                    onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                                                    placeholder="Description & Payee"
                                                    className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Date</label>
                                                    <input
                                                        type="date"
                                                        value={line.date || date}
                                                        onChange={(e) => updateLine(line.id, 'date', e.target.value)}
                                                        className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Amount</label>
                                                    <input
                                                        type="number"
                                                        value={line.amount}
                                                        onChange={(e) => updateLine(line.id, 'amount', e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-slate-200 dark:border-rose-500/30 rounded-xl text-right font-mono font-bold text-rose-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={addLine}
                                        className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 text-xs font-bold uppercase tracking-widest text-slate-400 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" /> Add Another Expense Line
                                    </button>
                                    <button
                                        type="button"
                                        disabled
                                        className="w-full py-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-xs font-bold uppercase tracking-widest text-slate-400 cursor-not-allowed flex items-center justify-center gap-2 opacity-60"
                                    >
                                        <div className="h-4 w-4 rounded bg-slate-200" /> Attach Receipt (Coming Soon)
                                    </button>
                                </div>
                            </div>

                            {/* Batch Settings Footer */}
                            <div className="bg-slate-50 border-t border-slate-200 p-6 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Payment Method</label>
                                        <select value={method} onChange={(e) => setMethod(e.target.value)} className="bg-transparent font-bold text-sm text-slate-700 outline-none cursor-pointer hover:text-indigo-600">
                                            <option value="cash">Petty Cash 💵</option>
                                            <option value="card">Corporate Card 💳</option>
                                            <option value="bank_transfer">Bank Transfer 🏦</option>
                                        </select>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200" />
                                    <div className="flex flex-col">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Batch Date</label>
                                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent font-bold text-sm text-slate-700 outline-none" />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-2"
                                >
                                    <Save className="h-5 w-5" /> Record All Expenses
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
