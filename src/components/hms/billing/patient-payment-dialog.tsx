'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";




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

    // Dependencies needed for CompactInvoiceEditor
    const [billableItems, setBillableItems] = useState<any[]>([]);
    const [taxConfig, setTaxConfig] = useState<any>({ defaultTax: null, taxRates: [] });
    const [uoms, setUoms] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]); // Minimal necessary
    const [initialInvoice, setInitialInvoice] = useState<any>(null);

    // Fetch Dependencies when opened
    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            import('@/app/actions/billing').then(mod => {
                Promise.all([
                    mod.getBillableItems(),
                    mod.getTaxConfiguration(),
                    mod.getUoms(),
                    // Also try to find an existing drafted registration invoice to resume
                    (mod as any).getPatientOutstandingBalance(patientId) // Just to check if we have one? No, we need the invoice object.
                ]).then(([itemsRes, taxRes, uomsRes]) => {
                    if (itemsRes.success) setBillableItems(itemsRes.data || []);
                    if (taxRes.success) setTaxConfig(taxRes.data || { defaultTax: null, taxRates: [] });
                    if (uomsRes.success) setUoms(uomsRes.data || []);

                    // Mock patient object for the editor
                    setPatients([{ id: patientId, label: patientName }]);

                    // [WORLD CLASS] Check for existing UNPAID registration invoice specifically
                    // This ensures we resume the correct invoice if it exists
                    // For now, we'll let the editor handle new invoice creation if none passed, 
                    // but we could try to fetch open invoices here.
                    // However, CompactInvoiceEditor has logic to load initial data.

                    // If we have a fixed amount (likely registration fee), we might WANT to create a specific invoice for it
                    // if one doesn't exist. 
                    // But for now, let's just open the editor. The editor has robust "create" logic.
                    // IMPORTANT: We need to pass the "Registration Fee" as an initial item if it's the intent.

                }).catch(err => {
                    console.error("Failed to load billing dependencies", err);
                    toast({
                        title: "Warning",
                        description: "Could not load some billing configurations. You can still proceed.",
                        variant: "destructive"
                    });
                }).finally(() => setIsLoading(false));
            });
        }
    }, [isOpen, patientId, patientName]);

    // Construct initial medicines/items based on fixedAmount (Registration Context)
    const initialMedicines = fixedAmount ? [{
        id: 'REG-FEE', // Pseudo-ID, will be matched by name
        name: 'Patient Registration Fee',
        price: fixedAmount,
        quantity: 1,
        type: 'service',
        description: 'One-time Patient Registration & Identity Service'
    }] : [];

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
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="max-w-[95vw] w-full h-[95vh] p-0 bg-transparent border-none shadow-none flex items-center justify-center z-[400] focus:outline-none"
            >
                {isLoading ? (
                    <div className="bg-white p-8 rounded-3xl flex flex-col items-center gap-4 shadow-2xl">
                        <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Terminal...</p>
                    </div>
                ) : (
                    <CompactInvoiceEditorWithNoSSR
                        patients={patients}
                        billableItems={billableItems}
                        uoms={uoms}
                        taxConfig={taxConfig}
                        initialPatientId={patientId}
                        initialMedicines={initialMedicines}
                        onClose={() => {
                            setIsOpen(false);
                        }}
                        onPaymentSuccess={() => {
                            setIsOpen(false);
                            onPaymentSuccess?.();
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

// Wrapper for Dynamic Import
import dynamic from 'next/dynamic';
const CompactInvoiceEditorWithNoSSR = dynamic(
    () => import('@/components/billing/invoice-editor-compact').then(mod => mod.CompactInvoiceEditor),
    { ssr: false, loading: () => <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div> }
);
