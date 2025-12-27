'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertPayment } from '@/app/actions/accounting/payments';
import { searchSuppliers, getOutstandingPurchaseBills } from '@/app/actions/accounting/helpers';
import { ArrowLeft, Save, Loader2, Calendar, CreditCard, Building2, FileText, ArrowRight } from 'lucide-react';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

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
        <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-rose-500/30">
            <Toaster />
            {/* Header */}
            <div className="border-b border-white/5 bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-[1000px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="h-10 w-10 rounded-full hover:bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-semibold text-white tracking-tight">New Payment</h1>
                            <p className="text-xs text-neutral-500 mt-1">Record money paid out</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1000px] mx-auto px-6 py-12">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Main Card */}
                    <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-8 space-y-8 backdrop-blur-sm">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Payee Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                    <Building2 className="h-3 w-3" /> Paid To (Vendor)
                                </label>
                                <SearchableSelect
                                    value={partnerId}
                                    onChange={handleVendorChange}
                                    onSearch={async (q) => searchSuppliers(q)}
                                    placeholder="Select Vendor..."
                                    className="w-full bg-neutral-950 border border-white/10 rounded-lg text-sm"
                                    isDark
                                />
                                <p className="text-[10px] text-neutral-600">Search by Name or GSTIN</p>
                            </div>

                            {/* Amount - HERO */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-rose-500 uppercase tracking-wider flex items-center gap-2">
                                    Amount Paid
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 font-semibold text-xl">₹</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-4 py-4 bg-neutral-950 border border-rose-500/30 rounded-xl text-3xl font-bold text-white placeholder:text-neutral-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all font-mono"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Outstanding Bills Section */}
                        {partnerId && (bills.length > 0 || isFetchingBills) && (
                            <div className="space-y-4 border-t border-white/5 pt-8">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                        <FileText className="h-3 w-3 text-amber-500" /> Outstanding Bills
                                    </label>
                                    {bills.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const firstId = bills[0].id;
                                                const remaining = Number(amount) || 0;
                                                if (remaining > 0) handleAllocationChange(firstId, remaining.toString());
                                            }}
                                            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest"
                                        >
                                            Auto-Allocate (FIFO)
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {isFetchingBills ? (
                                        <div className="md:col-span-2 py-8 flex flex-col items-center justify-center gap-2 text-neutral-600">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest">Scanning Supplier Ledger...</span>
                                        </div>
                                    ) : (
                                        bills.map((bill) => (
                                            <div key={bill.id} className="group relative bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl p-4 transition-all flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-white tracking-tight">{bill.number}</span>
                                                    <span className="text-[10px] text-neutral-500 font-medium">Outstanding: ₹{bill.outstanding.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-rose-500/50">₹</span>
                                                        <input
                                                            type="number"
                                                            value={allocations[bill.id] || ''}
                                                            placeholder="0"
                                                            onChange={(e) => handleAllocationChange(bill.id, e.target.value)}
                                                            className="w-28 pl-7 pr-3 py-2 bg-black/40 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all text-right font-mono"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAllocationChange(bill.id, bill.outstanding.toString())}
                                                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                                                        title="Pay Full"
                                                    >
                                                        <ArrowRight className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="h-px bg-white/5 w-full"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Date */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                    <Calendar className="h-3 w-3" /> Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-indigo-500/50 transition-colors [color-scheme:dark]"
                                />
                            </div>

                            {/* Method */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                    <CreditCard className="h-3 w-3" /> Payment Method
                                </label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none"
                                >
                                    <option value="bank_transfer">Bank Transfer / NEFT</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="upi">UPI</option>
                                    <option value="card">Corporate Card</option>
                                    <option value="cash">Petty Cash</option>
                                </select>
                            </div>

                            {/* Reference */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Reference No.</label>
                                <input
                                    type="text"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="e.g. UTR-998877"
                                    className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-neutral-700"
                                />
                            </div>
                        </div>

                        {/* Memo */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Memo / Notes</label>
                            <textarea
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                placeholder="Payment description..."
                                rows={3}
                                className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-neutral-700 resize-none"
                            />
                        </div>

                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium shadow-lg shadow-rose-900/20 hover:shadow-rose-900/40 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Payment
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
