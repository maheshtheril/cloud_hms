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
import { updateInvoiceStatus, shareInvoiceWhatsapp } from '@/app/actions/billing';
import { useToast } from '@/components/ui/use-toast';

interface InvoiceControlPanelProps {
    invoiceId: string;
    currentStatus: string;
    outstandingAmount: number;
    patientEmail?: string | null;
}

export function InvoiceControlPanel({
    invoiceId,
    currentStatus,
    outstandingAmount,
    patientEmail
}: InvoiceControlPanelProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    async function handleStatusChange(newStatus: 'posted' | 'paid') {
        setIsLoading(true);
        try {
            const res = await updateInvoiceStatus(invoiceId, newStatus);
            if (res.success) {
                toast({
                    title: "Status Updated",
                    description: `Invoice marked as ${newStatus}`,
                    variant: "default" // success
                });
                router.refresh();
                setIsPaymentModalOpen(false);
            } else {
                toast({
                    title: "Action Failed",
                    description: res.error || "Could not update status",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleWhatsappShare() {
        setIsLoading(true);
        try {
            const res = await shareInvoiceWhatsapp(invoiceId) as any;
            if (res && res.success) {
                toast({
                    title: "WhatsApp",
                    description: res.message || "Manual share mode active.",
                });

                if (res.whatsappUrl) {
                    window.open(res.whatsappUrl, '_blank');
                }
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
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Collect Payment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record Payment</DialogTitle>
                            <DialogDescription>
                                Confirm receipt of payment for this invoice. This will close the invoice and post to cash journals.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <span className="text-slate-600 font-medium">Amount Due</span>
                                <span className="text-xl font-bold font-mono">₹{outstandingAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
                            <Button
                                onClick={() => handleStatusChange('paid')}
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                                Confirm Cash Receipt
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* PRINT & SHARE ACTIONS - Always Available */}
            <Button variant="outline" onClick={() => window.open(`/hms/billing/${invoiceId}/print`, '_blank')}>
                <Printer className="mr-2 h-4 w-4" />
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

            <Button variant="outline" disabled={true} title="Email feature coming soon">
                <Mail className="mr-2 h-4 w-4" />
                Email
            </Button>
        </div>
    );
}
