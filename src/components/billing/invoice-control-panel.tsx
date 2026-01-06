'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    CreditCard,
    Send,
    Printer,
    Download,
    Loader2,
    CheckCircle2,
    XCircle,
    Mail,
    MessageCircle
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { recordPayment, updateInvoiceStatus, shareInvoiceWhatsapp } from '@/app/actions/billing';
import { useToast } from '@/components/ui/use-toast';
import { generateInvoicePDFBase64 } from '@/lib/utils/pdf-generator';

interface InvoiceControlPanelProps {
    invoiceId: string;
    currentStatus: string;
    outstandingAmount: number;
    patientEmail?: string | null;
    invoiceData?: any;
}

export function InvoiceControlPanel({
    invoiceId,
    currentStatus,
    outstandingAmount,
    patientEmail,
    invoiceData
}: InvoiceControlPanelProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paymentReference, setPaymentReference] = useState('');
    const [paymentAmount, setPaymentAmount] = useState(outstandingAmount);

    const router = useRouter();
    const { toast } = useToast();

    // Reset payment form when modal opens
    const openPaymentModal = () => {
        setPaymentMethod('cash');
        setPaymentReference('');
        setPaymentAmount(outstandingAmount);
        setIsPaymentModalOpen(true);
    };

    async function handleStatusChange(newStatus: 'posted' | 'paid') {
        setIsLoading(true);
        try {
            const res = await updateInvoiceStatus(invoiceId, newStatus);
            if (res.success) {
                toast({
                    title: "Status Updated",
                    description: `Invoice marked as ${newStatus}`,
                    variant: "default"
                });
                router.refresh();
            } else {
                toast({
                    title: "Action Failed",
                    description: res.error || "Could not update status",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePaymentConfirm() {
        setIsLoading(true);
        try {
            const res = await recordPayment(invoiceId, {
                amount: Number(paymentAmount),
                method: paymentMethod,
                reference: paymentReference
            });

            if (res.success) {
                toast({
                    title: "Payment Recorded",
                    description: `Received ₹${paymentAmount} via ${paymentMethod.toUpperCase()}`,
                    variant: "default"
                });
                router.refresh();
                setIsPaymentModalOpen(false);
            } else {
                toast({
                    title: "Payment Failed",
                    description: res.error || "Could not record payment",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Transaction failed.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    const base64ToBlob = (base64: string, type: string) => {
        const binStr = atob(base64);
        const len = binStr.length;
        const arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
        }
        return new Blob([arr], { type });
    };

    const handlePrintPdf = async () => {
        if (!invoiceData) {
            window.open(`/hms/billing/${invoiceId}/print`, '_blank');
            return;
        }
        setIsLoading(true);
        try {
            const b64 = await generateInvoicePDFBase64(invoiceData);
            const blob = base64ToBlob(b64, 'application/pdf');
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (e) {
            console.error(e);
            window.open(`/hms/billing/${invoiceId}/print`, '_blank');
        } finally {
            setIsLoading(false);
        }
    };

    async function handleWhatsappShare() {
        setIsLoading(true);
        try {
            const res = await shareInvoiceWhatsapp(invoiceId) as any;
            if (res && res.success) {
                toast({
                    title: "WhatsApp",
                    description: res.message || "Invoice sent to patient.",
                });
            } else {
                toast({
                    title: "Share Failed",
                    description: (res && res.error) || "Could not send WhatsApp",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to connect to WhatsApp service.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* POST ACTION (If Draft) */}
            {currentStatus === 'draft' && (
                <Button
                    onClick={() => handleStatusChange('posted')}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Post Invoice
                </Button>
            )}

            {/* COLLECT PAYMENT (If Posted) */}
            {currentStatus === 'posted' && (
                <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={openPaymentModal}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Collect Payment
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Record Payment</DialogTitle>
                            <DialogDescription>
                                Select payment method to settle the outstanding amount.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <label className="text-xs font-bold text-slate-500 uppercase">Amount to Pay</label>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold font-mono text-slate-400">₹</span>
                                <input
                                    type="number"
                                    min="1"
                                    max={outstandingAmount}
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                    className="text-2xl font-bold font-mono text-slate-900 bg-transparent outline-none w-full"
                                />
                            </div>
                            <div className="text-xs text-slate-500 text-right">
                                Total Outstanding: ₹{outstandingAmount.toFixed(2)}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {['cash', 'card', 'upi'].map((method) => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === method
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-slate-100 hover:border-slate-200 text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="font-bold uppercase text-xs tracking-wider">{method}</div>
                                </button>
                            ))}
                        </div>

                        {(paymentMethod === 'card' || paymentMethod === 'upi') && (
                            <div className="space-y-2 animate-in slide-in-from-top-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Transaction Ref / Last 4 Digits</label>
                                <input
                                    type="text"
                                    value={paymentReference}
                                    onChange={(e) => setPaymentReference(e.target.value)}
                                    placeholder={paymentMethod === 'card' ? "e.g. 1234" : "e.g. UPI Ref ID"}
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                                />
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
                            <Button
                                onClick={handlePaymentConfirm}
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                                Confirm Receipt
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )
            }

            {/* PRINT & SHARE ACTIONS - Always Available */}
            <Button variant="outline" onClick={handlePrintPdf} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-4 w-4" />}
                Print
            </Button>

            <Button
                variant="outline"
                onClick={handleWhatsappShare}
                disabled={isLoading}
                className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
            >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageCircle className="mr-2 h-4 w-4" />}
                WhatsApp
            </Button>
        </div >
    );
}
