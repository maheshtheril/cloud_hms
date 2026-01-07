'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, AlertCircle, ShoppingBag, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createSalesReturn } from '@/app/actions/returns';
import { motion, AnimatePresence } from 'framer-motion';

type SalesReturnItem = {
    invoiceLineId: string;
    productId: string;
    description: string;
    soldQty: number;
    returnQty: number;
    unitPrice: number;
};

interface SalesReturnDialogProps {
    isOpen: boolean;
    onClose: () => void;
    invoiceId: string;
    patientId: string;
    patientName: string;
    initialItems: SalesReturnItem[];
    onSuccess?: () => void;
}

export function SalesReturnDialog({
    isOpen,
    onClose,
    invoiceId,
    patientId,
    patientName,
    initialItems,
    onSuccess
}: SalesReturnDialogProps) {
    const { toast } = useToast();
    const [items, setItems] = useState<SalesReturnItem[]>([]);
    const [reason, setReason] = useState('Patient Return / Change of mind');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setItems(initialItems.map(i => ({ ...i, returnQty: 0 })));
        }
    }, [isOpen, initialItems]);

    const totalReturnAmount = items.reduce((sum, item) => sum + (item.returnQty * item.unitPrice), 0);

    const handleSubmit = async () => {
        const itemsToReturn = items.filter(i => i.returnQty > 0);
        if (itemsToReturn.length === 0) {
            toast({ title: "No items", description: "Please enter return quantity for at least one item.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await createSalesReturn({
                invoiceId,
                patientId,
                reason,
                items: itemsToReturn.map(i => ({
                    invoiceLineId: i.invoiceLineId,
                    productId: i.productId,
                    qtyToReturn: i.returnQty,
                    unitPrice: i.unitPrice
                }))
            });

            if (res.error) {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            } else {
                toast({ title: "Return Recorded", description: `Credit Note generated successfully.` });
                onSuccess?.();
                onClose();
            }
        } catch (err) {
            toast({ title: "Error", description: "Failed to process return.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-background border-border shadow-2xl rounded-2xl">
                <DialogHeader className="px-8 py-6 border-b border-border bg-emerald-500/5">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                            <RotateCcw className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold tracking-tight">Sales Return (Credit Note)</DialogTitle>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-black mt-1">
                                Patient: <span className="text-foreground">{patientName}</span>
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-8 space-y-8 flex-1 overflow-hidden flex flex-col">
                    <div className="space-y-4">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Return Reason</Label>
                        <Input
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="e.g., Wrong medication, patient requested refund..."
                            className="h-12 bg-background border-border text-foreground font-medium rounded-xl focus:ring-emerald-500/20 focus:border-emerald-500/50"
                        />
                    </div>

                    <div className="flex-1 flex flex-col min-h-0 bg-muted/20 border border-border rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border bg-muted/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <div className="col-span-6">Item Description</div>
                            <div className="col-span-2 text-right">Sold</div>
                            <div className="col-span-2 text-center">Return Qty</div>
                            <div className="col-span-2 text-right">Refund</div>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="divide-y divide-border/50">
                                {items.map((item, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={item.invoiceLineId}
                                        className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-muted/30 transition-colors group"
                                    >
                                        <div className="col-span-6 flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                                                <ShoppingBag className="h-5 w-5 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-foreground truncate">{item.description}</p>
                                                <p className="text-[10px] text-muted-foreground">₹{item.unitPrice.toFixed(2)} / unit</p>
                                            </div>
                                        </div>

                                        <div className="col-span-2 text-right">
                                            <p className="text-sm font-bold text-foreground">{item.soldQty}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Billed</p>
                                        </div>

                                        <div className="col-span-2 flex justify-center px-2">
                                            <div className="relative group/input w-24">
                                                <Input
                                                    type="number"
                                                    value={item.returnQty || ''}
                                                    onChange={e => {
                                                        const val = Math.min(item.soldQty, Math.max(0, parseFloat(e.target.value) || 0));
                                                        const n = [...items];
                                                        n[idx].returnQty = val;
                                                        setItems(n);
                                                    }}
                                                    className="h-10 text-center font-bold bg-background border-border group-hover/input:border-emerald-500/50 transition-all rounded-lg"
                                                />
                                                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-500 scale-x-0 group-hover/input:scale-x-100 transition-transform duration-300 rounded-full" />
                                            </div>
                                        </div>

                                        <div className="col-span-2 text-right">
                                            <p className="text-sm font-bold text-foreground">₹{(item.returnQty * item.unitPrice).toFixed(2)}</p>
                                            <p className="text-[10px] text-emerald-500/70 font-black uppercase tracking-tighter">Refund</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500/10 p-2 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-emerald-600" />
                            </div>
                            <p className="text-sm font-medium text-emerald-700/80 max-w-sm">
                                Recording this return will restock items and generate a Credit Note for the patient.
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Total Refund Value</p>
                            <p className="text-2xl font-black text-emerald-600">₹{totalReturnAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-8 py-6 border-t border-border bg-muted/30 gap-3">
                    <Button variant="ghost" onClick={onClose} className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-background">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || totalReturnAmount === 0}
                        className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white flex gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Post Credit Note & Restock
                                <RotateCcw className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
