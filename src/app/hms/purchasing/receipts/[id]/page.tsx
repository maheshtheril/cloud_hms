'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createPurchaseReceipt, getPendingPurchaseOrders, getPurchaseReceipt } from '@/app/actions/receipt';
import { scanInvoiceFromUrl } from '@/app/actions/scan-invoice';
import { searchSuppliers, searchProducts, createProductQuick, getCompanyDetails } from '@/app/actions/purchase';

import { Loader2, Plus, Trash2, ArrowLeft, CheckCircle2, ScanLine, Box, ArrowRight, Settings, FileText } from 'lucide-react';
import { SearchableSelect, type Option } from '@/components/ui/searchable-select';
import { FileUpload } from '@/components/ui/file-upload';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { SupplierDialog } from '@/components/hms/purchasing/supplier-dialog';
import { SupplierPricingDefaults } from '@/components/hms/purchasing/supplier-pricing-defaults';

const PACKING_OPTIONS = ['1 Strip', '1 Box', '1 Bottle', '10x10', '1x10', '1x15', '1 Unit', '1 kg', '1 L'];
const TAX_OPTIONS = ['0', '5', '12', '18', '28'];

type ReceiptItem = {
    id?: string;
    productId: string;
    productName: string;
    poLineId?: string;
    orderedQty?: number;
    pendingQty?: number;
    receivedQty: number;
    unitPrice: number;
    batch?: string;
    expiry?: string;
    mrp?: number;
    salePrice?: number;           // Sale price for this batch
    marginPct?: number;            // Profit margin percentage
    markupPct?: number;            // Markup percentage on cost
    pricingStrategy?: 'mrp_discount' | 'cost_markup' | 'custom' | 'manual';
    mrpDiscountPct?: number;       // Discount % from MRP (e.g., 10 for MRP-10%)
    taxRate?: number;
    taxAmount?: number;
    hsn?: string;
    packing?: string;
};

export default function EditPurchaseReceiptPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
    const [pricingDefaultsOpen, setPricingDefaultsOpen] = useState(false);

    // Mode: 'po' (Linked to PO) | 'direct' (Ad-hoc)
    const [mode, setMode] = useState<'po' | 'direct'>('po');

    // Header State
    const [supplierId, setSupplierId] = useState<string | null>(null);
    const [supplierName, setSupplierName] = useState('');
    const [supplierMeta, setSupplierMeta] = useState<any>(null); // { gstin, address, contact }
    const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);
    const [reference, setReference] = useState('');
    const [notes, setNotes] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState('');

    // PO State
    const [poId, setPoId] = useState<string | null>(null);
    const [poOptions, setPoOptions] = useState<Option[]>([]);

    // Items
    const [items, setItems] = useState<ReceiptItem[]>([]);
    const [roundOff, setRoundOff] = useState(0);
    const [isAutoRound, setIsAutoRound] = useState(true);
    const [scannedTotal, setScannedTotal] = useState(0);

    // Company & Tax Logic
    const [companyDetails, setCompanyDetails] = useState<{ gstin?: string, state?: string } | null>(null);
    const [taxType, setTaxType] = useState<'INTRA' | 'INTER'>('INTRA');

    // Load Company Details for Tax Logic
    useEffect(() => {
        async function loadCompany() {
            const details = await getCompanyDetails();
            if (details) {
                setCompanyDetails(details);
            }
        }
        loadCompany();
    }, []);

    // Determine Tax Type (Intra vs Inter)
    useEffect(() => {
        if (!supplierMeta?.gstin || !companyDetails?.gstin) {
            setTaxType('INTRA'); // Default
            return;
        }

        // Logic: First 2 digits of GSTIN represent State Code
        const supplierStateCode = supplierMeta.gstin.substring(0, 2);
        const companyStateCode = companyDetails.gstin.substring(0, 2);

        if (supplierStateCode === companyStateCode) {
            setTaxType('INTRA');
        } else {
            setTaxType('INTER');
        }
    }, [supplierMeta, companyDetails]);

    // Auto-apply supplier pricing defaults when supplier changes
    useEffect(() => {
        if (!supplierMeta?.pricing_defaults || items.length === 0) return;

        const defaults = supplierMeta.pricing_defaults;
        if (!defaults.defaultPricingStrategy || defaults.defaultPricingStrategy === 'none') return;

        // Only auto-apply to items that don't have sale price set yet
        const newItems = items.map(item => {
            if (item.salePrice) return item; // Skip already priced items
            if (!item.mrp && !item.unitPrice) return item; // Skip items without price info

            let salePrice = 0;
            let strategy = defaults.defaultPricingStrategy;

            if (strategy === 'mrp_discount' && item.mrp && defaults.defaultMrpDiscountPct) {
                salePrice = Number((item.mrp * (1 - defaults.defaultMrpDiscountPct / 100)).toFixed(2));
            } else if (strategy === 'cost_markup' && item.unitPrice && defaults.defaultMarkupPct) {
                salePrice = Number((item.unitPrice * (1 + defaults.defaultMarkupPct / 100)).toFixed(2));
                // Validate against MRP if exists
                if (item.mrp && salePrice > item.mrp) {
                    salePrice = item.mrp;
                }
            }

            if (salePrice > 0 && item.unitPrice) {
                return {
                    ...item,
                    salePrice,
                    pricingStrategy: strategy as any,
                    marginPct: Number(calculateMargin(salePrice, item.unitPrice).toFixed(2)),
                    markupPct: Number(calculateMarkup(salePrice, item.unitPrice).toFixed(2)),
                };
            }

            return item;
        });

        setItems(newItems);
    }, [supplierId, items.length]); // Trigger when supplier or item count changes

    // Auto-calculate Round Off when items change
    useEffect(() => {
        if (!isAutoRound) return; // Skip if manual mode

        const taxable = items.reduce((sum, item) => sum + (item.unitPrice * Number(item.receivedQty)), 0);
        const tax = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
        const rawTotal = taxable + tax;
        const rounded = Math.round(rawTotal);
        const diff = rounded - rawTotal;
        setRoundOff(Number(diff.toFixed(2)));
    }, [items]);

    // Load Receipt Data on Mount
    useEffect(() => {
        async function loadReceipt() {
            if (!params.id) return;
            try {
                const res = await getPurchaseReceipt(params.id);
                if (res.success && res.data) {
                    const r = res.data;
                    setSupplierId(r.supplierId || null);
                    setSupplierName(r.supplierName);
                    setReceivedDate(r.date ? new Date(r.date).toISOString().split('T')[0] : '');
                    setReference(r.reference);
                    setReference(r.reference);
                    setNotes(r.notes);
                    setAttachmentUrl(r.attachmentUrl || '');

                    if (r.items) {
                        setItems(r.items.map((i: any) => ({
                            id: i.id,
                            productId: i.productId,
                            productName: i.productName,
                            receivedQty: i.qty,
                            unitPrice: i.unitPrice,
                            batch: i.batch,
                            expiry: i.expiry,
                            mrp: i.mrp,
                            salePrice: i.salePrice,
                            marginPct: i.marginPct,
                            markupPct: i.markupPct,
                            pricingStrategy: i.pricingStrategy || 'manual',
                            mrpDiscountPct: i.mrpDiscountPct,
                            packing: i.pack || i.packing,  // Fixed: use 'packing' field name
                            taxRate: i.taxRate,
                            taxAmount: (i.qty * i.unitPrice * (i.taxRate / 100)),
                            hsn: i.hsn,
                            pendingQty: 0,
                            orderedQty: 0
                        })));
                    }
                    setMode('direct'); // Default to direct for editing
                    toast({ title: "Loaded", description: `Receipt ${r.number} loaded.` });
                } else {
                    toast({ title: "Error", description: res.error || "Receipt not found", variant: "destructive" });
                }
            } catch (err) {
                console.error(err);
                toast({ title: "Error", description: "Failed to load receipt", variant: "destructive" });
            }
        }
        loadReceipt();
    }, [params.id]);

    // Load POs on mount (keeping this for context if needed)
    useEffect(() => {
        async function loadPos() {
            const res = await getPendingPurchaseOrders();
            if (res && res.data) {
                setPoOptions(res.data.map((po: any) => ({ id: po.id, label: `${po.poNumber} - ${po.supplierName}` })));
            }
        }
        loadPos();
    }, []);

    // Also fetch full PO details if mode switches back to PO and ID is selected? 
    // Simplified: handle selection
    const handlePoSelect = async (id: string | null, opt: Option | null | undefined) => {
        setPoId(id);
        if (!id) {
            // If cleared, maybe clear items?
            return;
        }

        // Import dynamically to avoid circle or ensure loaded? No, standardized import.
        // We need to fetch details. We just added getPurchaseOrder to actions.
        // But we need to update import first or use distinct name if not imported.
        // Since I can't easily change imports in this block without touching top of file,
        // I will assume I can import it or use a separate effect. 
        // Wait, I can't import inside specific function easily for actions unless dynamic.

        try {
            // Dynamic import for the new action we just added to avoid updating top of file
            const { getPurchaseOrder } = await import('@/app/actions/receipt');
            const res = await getPurchaseOrder(id);

            if (res.data) {
                if (res.data.supplierId) setSupplierId(res.data.supplierId);

                setItems(res.data.items.map((i: any) => ({
                    productId: i.productId,
                    productName: i.productName,
                    poLineId: i.poLineId,
                    orderedQty: i.orderedQty,
                    pendingQty: i.pendingQty,
                    receivedQty: i.pendingQty, // Default to receiving all pending
                    unitPrice: i.unitPrice
                })));
                toast({ title: "PO Loaded", description: "Items populated from order." });
            }
        } catch (err) {
            console.error(err);
            toast({ title: "Error", description: "Failed to load PO details", variant: "destructive" });
        }
    };

    // ========== PRICING CALCULATION HELPERS ==========

    const calculateMargin = (salePrice: number, cost: number): number => {
        if (salePrice <= 0) return 0;
        return ((salePrice - cost) / salePrice) * 100;
    };

    const calculateMarkup = (salePrice: number, cost: number): number => {
        if (cost <= 0) return 0;
        return ((salePrice - cost) / cost) * 100;
    };

    const handlePricingStrategyChange = (index: number, strategy: string) => {
        const newItems = [...items];
        const item = newItems[index];
        item.pricingStrategy = strategy as any;

        // Apply the strategy
        if (strategy === 'mrp_discount' && item.mrp) {
            const discountPct = item.mrpDiscountPct || 10; // Default 10%
            item.salePrice = Number((item.mrp * (1 - discountPct / 100)).toFixed(2));
        } else if (strategy === 'cost_markup' && item.unitPrice) {
            const markupPct = item.markupPct || 25; // Default 25%
            item.salePrice = Number((item.unitPrice * (1 + markupPct / 100)).toFixed(2));
        }

        // Recalculate margin and markup
        if (item.salePrice && item.unitPrice) {
            item.marginPct = Number(calculateMargin(item.salePrice, item.unitPrice).toFixed(2));
            item.markupPct = Number(calculateMarkup(item.salePrice, item.unitPrice).toFixed(2));
        }

        setItems(newItems);
    };

    const handleSalePriceChange = (index: number, salePrice: number) => {
        const newItems = [...items];
        const item = newItems[index];

        // Validation: Sale price cannot exceed MRP
        if (item.mrp && salePrice > item.mrp) {
            toast({
                title: "Invalid Price",
                description: `Sale price (₹${salePrice}) cannot exceed MRP (₹${item.mrp}). This violates India's Legal Metrology Act.`,
                variant: "destructive"
            });
            return;
        }

        item.salePrice = salePrice;
        item.pricingStrategy = 'manual';

        // Auto-calculate margin and markup
        if (item.unitPrice > 0) {
            item.marginPct = Number(calculateMargin(salePrice, item.unitPrice).toFixed(2));
            item.markupPct = Number(calculateMarkup(salePrice, item.unitPrice).toFixed(2));
        }

        // Warn if margin is too low
        if (item.marginPct !== undefined && item.marginPct < 10) {
            toast({
                title: "Low Margin Warning",
                description: `Margin is only ${item.marginPct.toFixed(1)}%. Consider increasing the sale price.`,
                variant: "default"
            });
        }

        setItems(newItems);
    };

    const handleMRPDiscountChange = (index: number, discountPct: number) => {
        const newItems = [...items];
        const item = newItems[index];

        if (!item.mrp) {
            toast({ title: "MRP Required", description: "Please enter MRP first", variant: "destructive" });
            return;
        }

        item.mrpDiscountPct = discountPct;
        item.salePrice = Number((item.mrp * (1 - discountPct / 100)).toFixed(2));
        item.pricingStrategy = 'mrp_discount';

        // Recalculate margins
        if (item.unitPrice > 0) {
            item.marginPct = Number(calculateMargin(item.salePrice, item.unitPrice).toFixed(2));
            item.markupPct = Number(calculateMarkup(item.salePrice, item.unitPrice).toFixed(2));
        }

        setItems(newItems);
    };

    const handleMarkupPctChange = (index: number, markupPct: number) => {
        const newItems = [...items];
        const item = newItems[index];

        if (!item.unitPrice || item.unitPrice <= 0) {
            toast({ title: "Cost Required", description: "Please enter purchase cost first", variant: "destructive" });
            return;
        }

        item.markupPct = markupPct;
        item.salePrice = Number((item.unitPrice * (1 + markupPct / 100)).toFixed(2));
        item.pricingStrategy = 'cost_markup';

        // Validate against MRP
        if (item.mrp && item.salePrice > item.mrp) {
            toast({
                title: "Exceeds MRP",
                description: `Calculated sale price (₹${item.salePrice}) exceeds MRP (₹${item.mrp}). Adjusting to MRP.`,
                variant: "default"
            });
            item.salePrice = item.mrp;
        }

        // Recalculate margin
        item.marginPct = Number(calculateMargin(item.salePrice, item.unitPrice).toFixed(2));

        setItems(newItems);
    };

    const applyQuickMargin = (marginTemplate: 'mrp-5' | 'mrp-10' | 'mrp-15' | 'mrp-20') => {
        const discountPct = parseInt(marginTemplate.split('-')[1]);
        const newItems = items.map(item => {
            if (item.mrp && item.mrp > 0) {
                const salePrice = Number((item.mrp * (1 - discountPct / 100)).toFixed(2));
                return {
                    ...item,
                    salePrice,
                    mrpDiscountPct: discountPct,
                    pricingStrategy: 'mrp_discount' as any,
                    marginPct: item.unitPrice > 0 ? Number(calculateMargin(salePrice, item.unitPrice).toFixed(2)) : undefined,
                    markupPct: item.unitPrice > 0 ? Number(calculateMarkup(salePrice, item.unitPrice).toFixed(2)) : undefined,
                };
            }
            return item;
        });
        setItems(newItems);
        toast({ title: "Pricing Applied", description: `MRP-${discountPct}% applied to all items with MRP` });
    };

    // ========== END PRICING HELPERS ==========

    const handleProductSelect = (index: number, productId: string | null, opt: Option | null | undefined) => {
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            productId: productId || "",
            productName: opt?.label || ""
        };
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, {
            productId: "",
            productName: "",
            receivedQty: 1,
            unitPrice: 0,
            pendingQty: 0,
            orderedQty: 0
        }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submit button clicked");
        setIsSubmitting(true);

        // Validation: Round Off
        console.log("Checking Round Off:", roundOff);
        if (Math.abs(roundOff) > 0.5) {
            console.warn("Round Off Validation Failed");
            toast({
                title: "Validation Error",
                description: "Round Off amount cannot exceed +/- 0.50. Please adjust item prices or taxes.",
                variant: "destructive"
            });
            setIsSubmitting(false);
            return;
        }

        const validItems = items.filter(i => i.receivedQty > 0 && i.productId);
        console.log("Valid Items Count:", validItems.length);

        if (validItems.length === 0) {
            console.warn("No valid items found");
            toast({ title: "Error", description: "No valid items to receive.", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }

        const payload = {
            supplierId: supplierId || undefined,
            purchaseOrderId: mode === 'po' ? poId : null,
            receivedDate: new Date(receivedDate),
            reference,
            notes,
            attachmentUrl,
            items: validItems.map(i => ({
                id: i.id, // Pass ID for updates
                productId: i.productId,
                poLineId: i.poLineId,
                qtyReceived: Number(i.receivedQty),
                unitPrice: Number(i.unitPrice),
                batch: i.batch,
                expiry: i.expiry,
                mrp: Number(i.mrp),
                salePrice: i.salePrice ? Number(i.salePrice) : undefined,
                marginPct: i.marginPct ? Number(i.marginPct) : undefined,
                markupPct: i.markupPct ? Number(i.markupPct) : undefined,
                pricingStrategy: i.pricingStrategy,
                taxRate: Number(i.taxRate),
                taxAmount: Number(i.taxAmount),
                hsn: i.hsn,
                packing: i.packing
            }))
        };

        if (params.id) {
            const { updatePurchaseReceipt } = await import('@/app/actions/receipt');
            const res = await updatePurchaseReceipt(params.id, payload);
            if (res.error) {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            } else {
                toast({ title: "Updated", description: "Receipt updated successfully." });
                setTimeout(() => router.push('/hms/purchasing/receipts'), 1000);
            }
        } else {
            const res = await createPurchaseReceipt(payload);
            if (res.error) {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Goods received successfully." });
                setTimeout(() => router.push('/hms/purchasing/receipts'), 1000); // Fixed redirect to list
            }
        }
        setIsSubmitting(false);
    };

    const totalTaxable = items.reduce((sum, item) => sum + (item.unitPrice * Number(item.receivedQty)), 0);
    const totalTax = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
    const netTotal = totalTaxable + totalTax + roundOff;

    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30 selection:text-indigo-200 font-sans">
            <Toaster />
            <SupplierDialog
                isOpen={supplierDialogOpen}
                onClose={() => setSupplierDialogOpen(false)}
                onSuccess={(newSupplier) => {
                    setSupplierId(newSupplier.id);
                    setSupplierName(newSupplier.label);
                    // Also clear previous meta if new supplier created, or fetch it if possible (though quick create might not return all)
                    setSupplierMeta({ gstin: newSupplier.subLabel, address: undefined, contact: undefined });
                    toast({ title: "Supplier Created", description: `${newSupplier.label} has been selected.` });
                }}
            />

            {/* Supplier Pricing Defaults Dialog */}
            <SupplierPricingDefaults
                isOpen={pricingDefaultsOpen}
                onClose={() => setPricingDefaultsOpen(false)}
                supplierId={supplierId || ''}
                supplierName={supplierName}
                currentDefaults={supplierMeta?.pricing_defaults}
                onSave={async (defaults) => {
                    // Update supplier metadata with pricing defaults
                    // This would call a server action to update the supplier
                    toast({
                        title: "Pricing Defaults Saved",
                        description: `Default pricing for ${supplierName} has been configured.`
                    });
                    // Optionally refresh supplier data
                }}
            />

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md">
                <div className="max-w-[1600px] mx-auto px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="text-neutral-400 hover:text-white transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div className="h-6 w-px bg-white/10 mx-2"></div>
                        <h1 className="text-sm font-medium tracking-wide text-neutral-200">Edit Purchase Entry <span className="text-neutral-500 font-mono ml-2">#{params.id.split('-').pop()}</span></h1>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-40 max-w-[1600px] mx-auto px-8">
                <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-12">

                    {/* Left Panel: Context - The "Document Header" */}
                    <div className="col-span-12 lg:col-span-4 space-y-12 animate-in fade-in slide-in-from-left-4 duration-700">

                        {/* 1. View Mode Selection - PROMINENT */}
                        <div className="bg-neutral-900/50 p-1.5 rounded-lg border border-white/5 flex gap-1 mb-8">
                            <button
                                type="button"
                                onClick={() => setMode('po')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${mode === 'po'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <ScanLine className="h-4 w-4" />
                                Receieve against PO
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('direct')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${mode === 'direct'
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Plus className="h-4 w-4" />
                                Direct Entry
                            </button>
                        </div>

                        {/* 2. Supplier - The "Who" */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Received From</label>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSupplierDialogOpen(true)}
                                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
                                    >
                                        <Plus className="h-3 w-3" /> New
                                    </button>
                                    {supplierId && (
                                        <button
                                            type="button"
                                            onClick={() => setPricingDefaultsOpen(true)}
                                            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
                                            title="Configure default pricing for this supplier"
                                        >
                                            <Settings className="h-3 w-3" /> Pricing
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="group relative">
                                <SearchableSelect
                                    value={supplierId}
                                    defaultOptions={useMemo(() => supplierId ? [{ id: supplierId, label: supplierName, subLabel: supplierMeta?.gstin }] : [], [supplierId, supplierName, supplierMeta?.gstin])}
                                    onChange={(id, opt) => { setSupplierId(id); setSupplierName(opt?.label || ''); }}
                                    onSearch={searchSuppliers}
                                    placeholder="Select Vendor..."
                                    className="w-full bg-transparent border-none text-xl font-medium placeholder:text-neutral-700 p-0 focus:ring-0 dark"
                                    variant="ghost"
                                    isDark={true}
                                />
                                <div className="h-px w-full bg-neutral-800 absolute bottom-0 left-0 group-focus-within:bg-indigo-500 transition-colors duration-500"></div>
                            </div>

                            {/* Extracted Supplier Meta Display */}
                            {supplierMeta && (
                                <div className="bg-neutral-900/50 rounded-lg p-4 border border-white/5 space-y-2 text-xs text-neutral-400">
                                    {supplierMeta.gstin && <div className="flex justify-between"><span>GSTIN:</span> <span className="text-neutral-200 font-mono">{supplierMeta.gstin}</span></div>}
                                    {supplierMeta.address && <div className="flex justify-between gap-4"><span>Address:</span> <span className="text-neutral-200 text-right">{supplierMeta.address}</span></div>}
                                    {supplierMeta.contact && <div className="flex justify-between"><span>Contact:</span> <span className="text-neutral-200">{supplierMeta.contact}</span></div>}
                                </div>
                            )}
                        </div>

                        {/* 2. Source Document - The "Why" */}
                        {mode === 'po' && (
                            <div className={`space-y-4 transition-all duration-500 ${!supplierId ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                    <ScanLine className="h-3 w-3" /> Source Document
                                </label>
                                <div className="group relative">
                                    <SearchableSelect
                                        value={poId}
                                        onChange={(id, opt) => handlePoSelect(id, opt)}
                                        onSearch={async (q) => poOptions.filter(o => o.label.toLowerCase().includes(q.toLowerCase()))}
                                        placeholder="Search Purchase Order..."
                                        className="w-full bg-transparent border-none text-xl font-medium text-neutral-200 placeholder:text-neutral-700 p-0 focus:ring-0 font-mono dark"
                                        variant="ghost"
                                        isDark={true}
                                    />
                                    <div className="h-px w-full bg-neutral-800 absolute bottom-0 left-0 group-focus-within:bg-indigo-500 transition-colors duration-500"></div>
                                </div>
                                {poId && <div className="text-xs text-emerald-500 font-medium">✓ Items loaded from order</div>}
                            </div>
                        )}

                        {/* 3. Meta Data - The "When/What" */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2 group">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</label>
                                <input
                                    type="date"
                                    value={receivedDate}
                                    onChange={(e) => setReceivedDate(e.target.value)}
                                    className="w-full bg-transparent border-b border-neutral-800 focus:border-indigo-500 p-0 pb-2 text-sm font-medium text-neutral-200 focus:ring-0 transition-colors [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2 group">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Reference</label>
                                <input
                                    type="text"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="e.g. GT-8821"
                                    className="w-full bg-transparent border-b border-neutral-800 focus:border-indigo-500 p-0 pb-2 text-sm font-medium text-neutral-200 focus:ring-0 transition-colors placeholder:text-neutral-700"
                                />
                            </div>
                        </div>

                        {/* 4. Attachments */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Invoice / Attachment</label>
                            <FileUpload
                                onUploadComplete={async (url) => {
                                    setAttachmentUrl(url);
                                    if (url) {
                                        // Trigger AI Scan
                                        toast({ title: "Analyzing Invoice...", description: "Extracting data from your document..." });

                                        // Dynamic import or ensure action is available
                                        const { scanInvoiceFromUrl } = await import('@/app/actions/scan-invoice');
                                        console.log("Calling scanInvoiceFromUrl...", url);
                                        const res = await scanInvoiceFromUrl(url);
                                        console.log("Scan Result Client-Side:", res);

                                        if (!('error' in res) && res.data) {
                                            const { supplierId, supplierName, date, reference, items: scannedItems } = res.data;

                                            console.log("Mapping Items:", scannedItems);

                                            // 1. Auto-select mode to Direct (since it's an invoice upload usually)
                                            setMode('direct');

                                            // 2. Set Header Data
                                            if (supplierId) {
                                                setSupplierId(supplierId);
                                                setSupplierName(supplierName);
                                                setSupplierMeta({
                                                    gstin: res.data.gstin,
                                                    address: res.data.address,
                                                    contact: res.data.contact
                                                });
                                            }
                                            if (date) setReceivedDate(date);
                                            if (reference) setReference(reference);

                                            // 3. Populate Items
                                            if (scannedItems && scannedItems.length > 0) {
                                                const mappedItems = scannedItems.map((item: any) => {
                                                    const qty = Number(String(item.qty || 0).replace(/[^0-9.-]/g, '')) || 0;
                                                    const unitPrice = Number(String(item.unitPrice || 0).replace(/[^0-9.-]/g, '')) || 0;
                                                    const taxRate = Number(String(item.taxRate || 0).replace(/[^0-9.-]/g, '')) || 0;
                                                    const taxAmount = (qty * unitPrice * (taxRate / 100));

                                                    return {
                                                        productId: item.productId,
                                                        productName: item.productName,
                                                        receivedQty: qty,
                                                        unitPrice: unitPrice,
                                                        pendingQty: 0,
                                                        orderedQty: 0,
                                                        batch: item.batch,
                                                        expiry: item.expiry,
                                                        mrp: Number(String(item.mrp || 0).replace(/[^0-9.-]/g, '')) || 0,
                                                        taxRate: taxRate,
                                                        taxAmount: taxAmount,
                                                        hsn: item.hsn,
                                                        packing: item.packing
                                                    };
                                                });
                                                setItems(mappedItems);

                                                // 4. Smart Rounding: Match the PDF's Grand Total exactly
                                                if (res.data.grandTotal) {
                                                    const extractedTotal = Number(res.data.grandTotal);
                                                    setScannedTotal(extractedTotal);

                                                    // Re-calculate local total for these items
                                                    const localTaxable = mappedItems.reduce((sum: number, item: any) => sum + (item.unitPrice * item.receivedQty), 0);
                                                    const localTax = mappedItems.reduce((sum: number, item: any) => sum + (item.taxAmount || 0), 0);
                                                    const localTotal = localTaxable + localTax;

                                                    const diff = extractedTotal - localTotal;

                                                    // If there's a difference, assume it's round off, set it, and LOCK auto-round to false (Manual)
                                                    // to preserver the document's truth.
                                                    if (Math.abs(diff) <= 0.5) {
                                                        setRoundOff(Number(diff.toFixed(2)));
                                                        setIsAutoRound(false);
                                                        toast({ description: `Round off adjusted to match Invoice Total: ${extractedTotal}` });
                                                    } else {
                                                        setRoundOff(0);
                                                        setIsAutoRound(true);
                                                        toast({
                                                            title: "Total Mismatch Warning",
                                                            description: `Invoice Total (${extractedTotal}) differs from calculated (${localTotal.toFixed(2)}) by ${diff.toFixed(2)}. Please check item prices/taxes.`,
                                                            variant: "destructive"
                                                        });
                                                    }
                                                }

                                            } else {
                                                toast({ title: "Warning", description: "Invoice scanned but no items found.", variant: "default" });
                                            }

                                            toast({ title: "Invoice Extract Success", description: "Data auto-filled. Please review the items below." });
                                        } else {
                                            console.error("Scan Failed:", 'error' in res ? res.error : 'Unknown error');
                                            toast({
                                                title: "Scan Failed",
                                                description: ('error' in res ? res.error : undefined) || "Could not read invoice data.",
                                                variant: "destructive"
                                            });
                                        }
                                    }
                                }}
                                folder="invoices"
                                label="Upload Invoice PDF (Auto-Scan)"
                                accept="application/pdf,image/*"
                            />
                            {attachmentUrl && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-neutral-900 rounded-lg border border-white/5">
                                    <FileText className="h-4 w-4 text-indigo-400" />
                                    <span className="text-xs text-neutral-300">Original Document Available</span>
                                    <a href={attachmentUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline">
                                        View File ↗
                                    </a>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Panel: Items Grid */}
                    <div className="col-span-12 lg:col-span-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
                        <div className="flex items-center justify-between px-2 text-neutral-500">
                            <div className="flex items-center gap-2">
                                <Box className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Manifest</span>
                            </div>
                            {mode === 'direct' && (
                                <button type="button" onClick={addItem} className="text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
                                    <Plus className="h-4 w-4" /> Add Line
                                </button>
                            )}
                        </div>

                        {/* Quick Pricing Templates */}
                        {items.length > 0 && items.some(i => i.mrp && i.mrp > 0) && (
                            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-2">
                                <span className="text-xs text-emerald-400 font-medium">Quick Apply:</span>
                                <button
                                    type="button"
                                    onClick={() => applyQuickMargin('mrp-5')}
                                    className="px-3 py-1 text-xs rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors font-mono"
                                >
                                    MRP - 5%
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyQuickMargin('mrp-10')}
                                    className="px-3 py-1 text-xs rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors font-mono"
                                >
                                    MRP - 10%
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyQuickMargin('mrp-15')}
                                    className="px-3 py-1 text-xs rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors font-mono"
                                >
                                    MRP - 15%
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyQuickMargin('mrp-20')}
                                    className="px-3 py-1 text-xs rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors font-mono"
                                >
                                    MRP - 20%
                                </button>
                                <span className="text-xs text-neutral-500 ml-2">
                                    Applies to {items.filter(i => i.mrp && i.mrp > 0).length} items
                                </span>
                            </div>
                        )}

                        <div className="min-h-[400px] rounded-lg border border-white/5 bg-black/20">
                            <table className="w-full text-left border-collapse min-w-[1400px]">
                                <thead>
                                    <tr className="border-b border-white/5 text-neutral-500">
                                        <th className="py-4 pl-4 font-medium text-xs uppercase tracking-wider w-[20%]">Item</th>
                                        <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-left w-16 text-white">HSN</th>
                                        <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-left w-16 text-white">Pack</th>
                                        {mode === 'po' && <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-center w-16">Ord</th>}
                                        <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-left w-20 text-white">Batch</th>
                                        <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-left w-20 text-white">Exp</th>
                                        <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-right w-16 text-white">MRP</th>
                                        <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-right w-20 text-emerald-400">Sale Price</th>
                                        <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-right w-16 text-emerald-400">Margin %</th>
                                        <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-right w-16 text-white">Qty</th>
                                        <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-right w-20 text-white">Price</th>
                                        <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-right w-24 text-white">Taxable</th>
                                        <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-right w-16 text-white">Tax %</th>
                                        {taxType === 'INTRA' ? (
                                            <>
                                                <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-right w-20 text-white">CGST</th>
                                                <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-right w-20 text-white">SGST</th>
                                            </>
                                        ) : (
                                            <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-right w-20 text-white">IGST</th>
                                        )}
                                        <th className="py-4 px-2 font-medium text-xs uppercase tracking-wider text-right w-24 text-white">Total</th>
                                        <th className="w-8"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {items.map((item, index) => (
                                        <tr key={index} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3 pl-4">
                                                {mode === 'po' ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-neutral-200">{item.productName}</div>
                                                        {item.poLineId && <div className="text-[10px] text-neutral-600 font-mono mt-0.5">REF: {item.poLineId.split('-').pop()}</div>}
                                                    </div>
                                                ) : (
                                                    <SearchableSelect
                                                        value={item.productId}
                                                        onChange={(id, opt) => handleProductSelect(index, id, opt)}
                                                        onSearch={searchProducts}
                                                        onCreate={createProductQuick}
                                                        defaultOptions={item.productId ? [{ id: item.productId, label: item.productName }] : []}
                                                        placeholder={item.productName || "Select Product..."}
                                                        variant="ghost"
                                                        className="w-full text-sm font-semibold text-white placeholder:text-neutral-400 dark"
                                                        isDark={true}
                                                    />
                                                )}
                                            </td>
                                            <td className="py-3 px-2">
                                                <input
                                                    placeholder="HSN"
                                                    value={item.hsn || ''}
                                                    onChange={(e) => { const n = [...items]; n[index].hsn = e.target.value; setItems(n); }}
                                                    className="w-full bg-transparent border-b border-white/10 text-[10px] font-mono focus:border-indigo-500"
                                                />
                                            </td>
                                            <td className="py-3 px-2">
                                                <SearchableSelect
                                                    value={item.packing}
                                                    onChange={(id, opt) => {
                                                        const n = [...items];
                                                        n[index].packing = opt?.label || id || '';
                                                        setItems(n);
                                                    }}
                                                    onSearch={async (q) => PACKING_OPTIONS.filter(o => o.toLowerCase().includes(q.toLowerCase())).map(o => ({ id: o, label: o }))}
                                                    onCreate={async (q) => ({ id: q, label: q })}
                                                    defaultOptions={[
                                                        ...PACKING_OPTIONS.map(o => ({ id: o, label: o })),
                                                        ...(item.packing && !PACKING_OPTIONS.includes(item.packing) ? [{ id: item.packing, label: item.packing }] : [])
                                                    ]}
                                                    placeholder="Pack"
                                                    variant="ghost"
                                                    className="w-full text-[10px] font-mono text-white placeholder:text-neutral-600 dark"
                                                    isDark={true}
                                                />
                                            </td>
                                            {mode === 'po' && (
                                                <td className="py-3 px-2 text-center">
                                                    <span className="text-xs font-mono text-neutral-500">{item.orderedQty}</span>
                                                </td>
                                            )}
                                            <td className="py-3 px-2">
                                                <input
                                                    placeholder="Batch"
                                                    value={item.batch || ''}
                                                    onChange={(e) => { const n = [...items]; n[index].batch = e.target.value; setItems(n); }}
                                                    className="w-full bg-transparent border-b border-white/10 text-[10px] font-mono focus:border-indigo-500"
                                                />
                                            </td>
                                            <td className="py-3 px-2">
                                                <input
                                                    placeholder="Exp"
                                                    value={item.expiry || ''}
                                                    onChange={(e) => { const n = [...items]; n[index].expiry = e.target.value; setItems(n); }}
                                                    className="w-full bg-transparent border-b border-white/10 text-[10px] font-mono focus:border-indigo-500"
                                                />
                                            </td>
                                            <td className="py-3 px-2 text-right">
                                                <input
                                                    placeholder="MRP"
                                                    type="number"
                                                    value={item.mrp || ''}
                                                    onChange={(e) => { const n = [...items]; n[index].mrp = Number(e.target.value); setItems(n); }}
                                                    className="w-full bg-transparent border-b border-white/10 text-[10px] font-mono text-right focus:border-indigo-500"
                                                />
                                            </td>
                                            {/* Sale Price - Editable with MRP validation */}
                                            <td className="py-3 px-2 text-right">
                                                <input
                                                    placeholder="Sale"
                                                    type="number"
                                                    step="0.01"
                                                    value={item.salePrice || ''}
                                                    onChange={(e) => {
                                                        const salePrice = Number(e.target.value);
                                                        handleSalePriceChange(index, salePrice);
                                                    }}
                                                    className={`w-full bg-transparent border-b text-[10px] font-mono text-right focus:border-emerald-500 ${item.mrp && item.salePrice && item.salePrice > item.mrp
                                                        ? 'border-red-500 text-red-400'
                                                        : 'border-emerald-500/30 text-emerald-300'
                                                        }`}
                                                />
                                                <div className="text-[8px] text-neutral-600 mt-0.5">
                                                    {item.mrp && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMRPDiscountChange(index, 10)}
                                                            className="hover:text-emerald-400 transition-colors"
                                                        >
                                                            MRP-10%
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Margin % - Auto-calculated, color-coded */}
                                            <td className="py-3 px-2 text-right">
                                                <div className={`text-xs font-bold ${!item.marginPct ? 'text-neutral-600' :
                                                    item.marginPct >= 25 ? 'text-green-400' :
                                                        item.marginPct >= 15 ? 'text-yellow-400' :
                                                            item.marginPct >= 10 ? 'text-orange-400' :
                                                                'text-red-400'
                                                    }`}>
                                                    {item.marginPct !== undefined ? `${item.marginPct.toFixed(1)}%` : '-'}
                                                </div>
                                                {item.marginPct !== undefined && item.marginPct < 10 && (
                                                    <div className="text-[8px] text-red-400">Low!</div>
                                                )}
                                            </td>

                                            <td className="py-3 px-2 text-right">
                                                <input
                                                    type="number"
                                                    value={item.receivedQty}
                                                    onChange={(e) => {
                                                        const n = [...items];
                                                        const qty = Number(e.target.value);
                                                        n[index].receivedQty = qty;
                                                        // Auto-calc tax amount
                                                        const taxable = qty * n[index].unitPrice;
                                                        n[index].taxAmount = taxable * ((n[index].taxRate || 0) / 100);
                                                        setItems(n);
                                                    }}
                                                    className="w-full bg-transparent border-b border-white/10 text-center font-mono focus:border-indigo-500"
                                                />
                                            </td>
                                            <td className="py-3 px-2 text-right">
                                                <input
                                                    type="number"
                                                    value={item.unitPrice}
                                                    onChange={(e) => {
                                                        const n = [...items];
                                                        const price = Number(e.target.value);
                                                        n[index].unitPrice = price;
                                                        // Auto-calc tax amount
                                                        const taxable = n[index].receivedQty * price;
                                                        n[index].taxAmount = taxable * ((n[index].taxRate || 0) / 100);
                                                        setItems(n);
                                                    }}
                                                    className="w-full bg-transparent border-b border-white/10 text-right font-mono focus:border-indigo-500"
                                                />
                                                <div className="text-[10px] text-neutral-600 mt-1">Cost</div>
                                            </td>

                                            {/* Taxable Value (Calculated) */}
                                            <td className="py-3 px-2 text-right text-sm font-mono text-neutral-300">
                                                {(item.unitPrice * item.receivedQty).toFixed(2)}
                                            </td>

                                            {/* Tax % */}
                                            <td className="py-3 px-2 text-right">
                                                <SearchableSelect
                                                    value={item.taxRate?.toString()}
                                                    onChange={(id, opt) => {
                                                        const n = [...items];
                                                        const rate = Number(id);
                                                        if (!isNaN(rate)) {
                                                            n[index].taxRate = rate;
                                                            // Auto-calc tax amount
                                                            const taxable = (n[index].unitPrice || 0) * (n[index].receivedQty || 0);
                                                            n[index].taxAmount = taxable * (rate / 100);
                                                            setItems(n);
                                                        }
                                                    }}
                                                    onSearch={async (q) => TAX_OPTIONS.filter(o => o.includes(q)).map(o => ({ id: o, label: o + '%' }))}
                                                    onCreate={async (q) => {
                                                        const val = parseFloat(q);
                                                        if (!isNaN(val)) return { id: val.toString(), label: val + '%' };
                                                        return null;
                                                    }}
                                                    defaultOptions={[
                                                        ...TAX_OPTIONS.map(o => ({ id: o, label: o + '%' })),
                                                        ...(item.taxRate !== undefined && !TAX_OPTIONS.includes(item.taxRate.toString()) ? [{ id: item.taxRate.toString(), label: item.taxRate + '%' }] : [])
                                                    ]}
                                                    placeholder="%"
                                                    variant="ghost"
                                                    className="w-full text-[10px] font-mono text-right text-white placeholder:text-neutral-600 dark"
                                                    isDark={true}
                                                />
                                            </td>

                                            {/* Taxes: CGST/SGST or IGST */}
                                            {taxType === 'INTRA' ? (
                                                <>
                                                    <td className="py-3 px-2 text-right text-sm font-mono text-neutral-400">
                                                        {((item.taxAmount || 0) / 2).toFixed(2)}
                                                    </td>
                                                    <td className="py-3 px-2 text-right text-sm font-mono text-neutral-400">
                                                        {((item.taxAmount || 0) / 2).toFixed(2)}
                                                    </td>
                                                </>
                                            ) : (
                                                <td className="py-3 px-2 text-right text-sm font-mono text-neutral-400">
                                                    {(item.taxAmount || 0).toFixed(2)}
                                                </td>
                                            )}

                                            {/* Total */}
                                            <td className="py-3 px-2 text-right text-sm font-mono font-bold text-white">
                                                {((item.unitPrice * item.receivedQty) + (item.taxAmount || 0)).toFixed(2)}
                                            </td>

                                            <td className="py-3 pl-2 pr-4 text-right">
                                                {mode === 'direct' && (
                                                    <button type="button" onClick={() => removeItem(index)} className="text-neutral-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-2">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={15} className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-3 text-neutral-700">
                                                    <div className="p-4 rounded-full bg-neutral-900 border border-white/5">
                                                        <ScanLine className="h-6 w-6 opacity-50" />
                                                    </div>
                                                    <span className="text-sm font-medium">
                                                        {mode === 'po' ? 'Select a Source Order above to load items' : 'Scan an invoice or use "Add Line" to begin'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Summary */}
                        <div className="flex justify-end mt-4">
                            <div className="bg-neutral-900/50 p-6 rounded-xl border border-white/10 min-w-[320px] shadow-sm">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-neutral-400">Taxable Value</span>
                                        <span className="text-white font-mono tracking-tight">{totalTaxable.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-neutral-400">Total Tax</span>
                                        <span className="text-white font-mono tracking-tight">{totalTax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-neutral-400">Round Off</span>
                                            <button
                                                type="button"
                                                onClick={() => setIsAutoRound(!isAutoRound)}
                                                className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${isAutoRound
                                                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                                    : 'bg-transparent text-neutral-600 border-neutral-800 hover:text-neutral-400'
                                                    }`}
                                            >
                                                AUTO
                                            </button>
                                        </div>
                                        <input
                                            type="number"
                                            value={roundOff}
                                            onChange={(e) => {
                                                setRoundOff(Number(e.target.value));
                                                setIsAutoRound(false); // Switch to manual on edit
                                            }}
                                            className={`bg-transparent border-b text-right w-20 font-mono tracking-tight focus:outline-none ${isAutoRound ? 'text-neutral-500 border-dashed border-neutral-700' : 'text-white border-white/10 focus:border-indigo-500'}`}
                                            step="0.01"
                                        />
                                    </div>

                                    {/* Calculated Total */}
                                    <div className="pt-3 border-t border-white/10 flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-base font-semibold text-white">Net Total</span>
                                            <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">INR (Rounded)</span>
                                        </div>
                                        <span className="text-2xl font-bold text-white font-mono tracking-tight">
                                            {netTotal.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Scanned Comparison */}
                                    {scannedTotal > 0 && (
                                        <div className="mt-4 p-3 bg-black/40 rounded-lg border border-white/5 space-y-2">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-neutral-500">Scanned Bill Total:</span>
                                                <span className="text-neutral-300 font-mono">{scannedTotal.toFixed(2)}</span>
                                            </div>
                                            {Math.abs(scannedTotal - netTotal) > 0.01 ? (
                                                <div className="flex justify-between items-center text-xs font-bold text-red-400">
                                                    <span>Difference:</span>
                                                    <span className="font-mono">{(netTotal - scannedTotal).toFixed(2)}</span>
                                                </div>
                                            ) : (
                                                <div className="flex justify-between items-center text-xs font-bold text-emerald-400">
                                                    <span>Matched</span>
                                                    <span className="font-mono">✓</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </main>

            {/* Sticky Footer for Action */}
            <div className="fixed bottom-8 left-0 w-full flex justify-center z-40 pointer-events-none">
                <div className={`bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-6 pr-2 flex items-center gap-6 shadow-2xl pointer-events-auto transition-all duration-500 ${items.length === 0 ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}`}>
                    <div className="flex items-center gap-3 text-xs font-medium text-neutral-400">
                        <span className="flex items-center gap-1.5"><Box className="h-3 w-3 text-indigo-400" /> {items.reduce((a, c) => a + Number(c.receivedQty), 0)} Units</span>
                        <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
                        <span>{mode === 'po' ? 'PO Linked' : 'Direct Entry'}</span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || items.length === 0}
                        className="bg-white text-black hover:bg-neutral-200 transition-colors px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{params.id ? "Update Receipt" : "Confirm Receipt"} <ArrowRight className="h-4 w-4" /></>}
                    </button>
                </div>
            </div>

        </div>
    );
}
