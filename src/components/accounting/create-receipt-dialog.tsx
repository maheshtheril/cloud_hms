'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertPayment } from '@/app/actions/accounting/payments';
import { searchPatients } from '@/app/actions/accounting/helpers';
import {
    Save, Loader2, Calendar, CreditCard, User,
    Receipt, FileText, CheckCircle2, AlertCircle, X, ArrowRight
} from 'lucide-react';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface CreateReceiptDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreateReceiptDialog({ open, onOpenChange, onSuccess }: CreateReceiptDialogProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [partnerId, setPartnerId] = useState<string | null>(null);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('cash');
    const [reference, setReference] = useState('');
    const [memo, setMemo] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!partnerId) {
            toast({ title: "Missing Payer", description: "Please select who the receipt is from.", variant: "destructive", className: "bg-red-950 border-red-900 text-white" });
            return;
        }
        if (!amount || Number(amount) <= 0) {
            toast({ title: "Invalid Amount", description: "Please enter a positive amount.", variant: "destructive", className: "bg-red-950 border-red-900 text-white" });
            return;
        }

        setIsSubmitting(true);
        const res = await upsertPayment({
            type: 'inbound',
            partner_id: partnerId,
            amount: Number(amount),
            method,
            reference,
            date: new Date(date),
            memo,
            posted: true
        });

        if (res.error) {
            toast({ title: "Failed to Save", description: res.error, variant: "destructive", className: "bg-red-950 border-red-900 text-white" });
            setIsSubmitting(false);
        } else {
            toast({
                title: "Receipt Saved",
                description: `Successfully recorded receipt for ₹${amount}`,
                className: "bg-black border-emerald-900 text-white"
            });
            setIsSubmitting(false);
            onOpenChange(false);
            onSuccess?.();
            router.refresh();
            // Reset form (optional, but good UX if they open it again)
            setAmount('');
            setPartnerId(null);
            setReference('');
            setMemo('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 bg-neutral-950 border-white/10 text-neutral-200 shadow-2xl rounded-2xl border-0 ring-0">
                {/* Decorative Backgrounds - Moved inside a wrapper that clips ONLY background, not content */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px]" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]" />
                </div>


                <div className="flex flex-col md:flex-row h-full relative z-20 isolate">

                    {/* LEFT PANEL: PRIMARY INPUTS - High Z-Index to keep dropdowns above other content */}
                    <div className="flex-1 p-8 space-y-8 relative z-50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-900/20">
                                <Receipt className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-white tracking-tight">New Receipt</DialogTitle>
                                <DialogDescription className="text-neutral-500 text-xs">Record inbound payment</DialogDescription>
                            </div>
                        </div>

                        <form id="receipt-form" onSubmit={handleSubmit} className="space-y-8">
                            {/* Payer Selection */}
                            <div className="space-y-3 relative z-10">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                    <User className="h-3 w-3 text-indigo-400" /> Received From
                                </label>
                                <SearchableSelect
                                    value={partnerId}
                                    onChange={(id) => setPartnerId(id)}
                                    onSearch={async (q) => searchPatients(q)}
                                    placeholder="Search Patient..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl text-base hover:border-white/20 focus-within:border-emerald-500/50 transition-all shadow-inner"
                                    isDark
                                />
                            </div>

                            {/* Amount - HERO */}
                            <div className="space-y-3 relative z-10">
                                <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Total Amount
                                </label>
                                <div className="relative group/amount">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 font-medium text-3xl">₹</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-14 pr-6 py-6 bg-white/5 border border-white/10 rounded-2xl text-4xl font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-mono tracking-tight shadow-lg"
                                        autoFocus
                                    />
                                    {/* Subtle Glow */}
                                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none group-focus-within/amount:ring-emerald-500/30" />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT PANEL: DETAILS (Darker Glass) - Lower Z-Index */}
                    <div className="w-full md:w-[380px] bg-black/40 border-l border-white/5 p-8 flex flex-col justify-between backdrop-blur-md relative z-10">
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Transaction Details</h3>

                            {/* Date */}
                            <div className="space-y-2">
                                <label className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-neutral-300 focus:outline-none focus:border-white/20 transition-colors [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Method */}
                            <div className="space-y-3">
                                <label className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium">Payment Method</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['cash', 'upi', 'card', 'bank'].map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => setMethod(m)}
                                            className={cn(
                                                "px-3 py-2 rounded-lg text-xs font-medium border transition-all capitalize flex items-center justify-center gap-2",
                                                method === m
                                                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                                                    : "bg-white/5 border-transparent text-neutral-500 hover:bg-white/10 hover:text-neutral-300"
                                            )}
                                        >
                                            {m === 'cash' && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Reference */}
                            <div className="space-y-2">
                                <label className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium">Reference ID</label>
                                <input
                                    type="text"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="Optional..."
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-neutral-300 focus:outline-none focus:border-white/20 transition-colors placeholder:text-neutral-700"
                                />
                            </div>

                            {/* Memo */}
                            <div className="space-y-2">
                                <label className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium">Notes</label>
                                <textarea
                                    value={memo}
                                    onChange={(e) => setMemo(e.target.value)}
                                    placeholder="Type a note..."
                                    rows={2}
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-neutral-300 focus:outline-none focus:border-white/20 transition-colors placeholder:text-neutral-700 resize-none"
                                />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
                            <button
                                type="button"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                                className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-neutral-400 hover:bg-white/5 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="receipt-form"
                                disabled={isSubmitting}
                                className={cn(
                                    "flex-[2] py-3 px-4 rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all",
                                    isSubmitting
                                        ? "bg-neutral-800 cursor-not-allowed text-neutral-500"
                                        : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20 hover:shadow-emerald-900/40"
                                )}
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Receipt"}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
