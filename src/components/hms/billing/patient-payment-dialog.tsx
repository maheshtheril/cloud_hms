'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, DollarSign, CreditCard, Banknote, CheckCircle2, ChevronDown, ChevronUp, Receipt } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { settlePatientDues, getPatientBalance } from '@/app/actions/billing';
import { getPatientUnbilledItems } from '@/app/actions/billing-details';
import { cn } from "@/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";


interface PatientPaymentDialogProps {
    patientId: string;
    patientName: string;
    onPaymentSuccess?: () => void;
    trigger?: React.ReactNode;
    fixedAmount?: number; // [NEW] Allow overriding balance for specific fee collection
}

export function PatientPaymentDialog({
    patientId,
    patientName,
    onPaymentSuccess,
    trigger,
    fixedAmount
}: PatientPaymentDialogProps) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState<number | null>(null);
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<string>('cash');
    const [reference, setReference] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Bill Details State
    const [billDetails, setBillDetails] = useState<any[]>([]);
    const [showDetails, setShowDetails] = useState(false);

    // Fetch balance & details when opened
    useEffect(() => {
        if (isOpen && patientId) {
            setIsLoading(true);

            // [LOGIC] If fixedAmount is provided, use it. Otherwise fetch balance.
            if (fixedAmount) {
                setAmount(fixedAmount.toString());
            }

            Promise.all([
                getPatientBalance(patientId),
                getPatientUnbilledItems(patientId)
            ])
                .then(([resBalance, resDetails]) => {
                    // Handle Balance
                    if (resBalance.success) {
                        setBalance(resBalance.type === 'due' ? resBalance.balance : 0);
                        // Only auto-fill from balance if NO fixed amount was requested
                        if (!fixedAmount && resBalance.type === 'due' && resBalance.balance) {
                            setAmount(resBalance.balance.toString());
                        }
                    }

                    // Handle Details
                    if (resDetails.success && resDetails.lines) {
                        setBillDetails(resDetails.lines);
                    }
                })
                .catch(err => {
                    console.error(err);
                    toast({ title: "Error", description: "Network error fetching data.", variant: "destructive" });
                })
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, patientId, toast]);

    const handlePayment = async () => {
        const payAmount = parseFloat(amount);
        if (isNaN(payAmount) || payAmount <= 0) {
            toast({ title: "Invalid Amount", description: "Please enter a valid amount greater than 0.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await settlePatientDues(patientId, payAmount, method, reference);

            if (res.error) {
                toast({ title: "Payment Failed", description: res.error, variant: "destructive" });
            } else {
                toast({
                    title: "Payment Successful",
                    description: res.message || `Successfully collected ₹${payAmount}.`,
                    className: "bg-green-50 border-green-200 text-green-900"
                });
                setIsOpen(false);
                onPaymentSuccess?.();
            }
        } catch (err) {
            toast({ title: "Error", description: "Unexpected error during payment.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-200">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Collect Payment
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white p-0 overflow-hidden rounded-2xl border-none shadow-2xl max-h-[90vh] flex flex-col">
                <DialogHeader className="bg-emerald-600 p-6 text-white shrink-0">
                    <DialogTitle className="text-2xl font-black flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-500/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Banknote className="h-6 w-6 text-white" />
                        </div>
                        Record Payment
                    </DialogTitle>
                    <p className="text-emerald-100 font-medium opacity-90">for {patientName}</p>
                </DialogHeader>

                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Balance Display */}
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 text-emerald-600 animate-spin" />
                            ) : (
                                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-emerald-600 font-bold border border-emerald-100 shadow-sm">
                                    ₹
                                </div>
                            )}
                            <div>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Total Outstanding</p>
                                <p className="text-emerald-900 font-medium text-sm">Amount due</p>
                            </div>
                        </div>
                        <div className="text-right">
                            {isLoading ? (
                                <div className="h-8 w-24 bg-emerald-200/50 animate-pulse rounded" />
                            ) : (
                                <p className="text-2xl font-black text-emerald-700 tracking-tight">
                                    ₹{(balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </p>
                            )}
                        </div>
                    </div>


                    {/* Bill Itemization (Collapsible) */}
                    {billDetails.length > 0 && (
                        <Collapsible
                            open={showDetails}
                            onOpenChange={setShowDetails}
                            className="w-full space-y-2"
                        >
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-full flex items-center justify-between p-2 h-auto text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg group">
                                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                        <Receipt className="h-4 w-4" />
                                        {showDetails ? "Hide Item Details" : "View Item Details"} ({billDetails.length})
                                    </span>
                                    {showDetails ? (
                                        <ChevronUp className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-2">
                                <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-2 text-sm max-h-40 overflow-y-auto custom-scrollbar">
                                    <table className="w-full">
                                        <thead className="text-xs text-gray-400 font-medium uppercase border-b border-gray-100">
                                            <tr>
                                                <th className="text-left py-1">Item</th>
                                                <th className="text-right py-1">Qty</th>
                                                <th className="text-right py-1">Amt</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100/50">
                                            {billDetails.map((item, idx) => (
                                                <tr key={idx} className="text-gray-600">
                                                    <td className="py-1.5 pr-2 truncate max-w-[150px]">{item.description}</td>
                                                    <td className="py-1.5 text-right font-mono text-xs">{item.quantity}</td>
                                                    <td className="py-1.5 text-right font-mono text-xs font-medium">₹{item.amount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Amount to Collect</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-9 h-12 text-lg font-bold text-gray-900 border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-xl"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Payment Method</Label>
                                <Select value={method} onValueChange={setMethod}>
                                    <SelectTrigger className="h-12 border-gray-200 focus:ring-emerald-500/20 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                                        <SelectItem value="upi">UPI / QR</SelectItem>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Reference No.</Label>
                                <Input
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    className="h-12 border-gray-200 focus:ring-emerald-500/20 rounded-xl"
                                    placeholder="Txn ID / Ref"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-gray-50 border-t border-gray-100 gap-3 shrink-0">
                    <Button variant="ghost" onClick={() => setIsOpen(false)} className="h-12 px-6 rounded-xl font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-200/50">
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePayment}
                        disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
                        className={cn(
                            "h-12 px-8 rounded-xl font-bold text-white shadow-xl transition-all flex gap-2 w-full sm:w-auto",
                            isSubmitting ? "bg-gray-400" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Confirm Payment
                                <CheckCircle2 className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
