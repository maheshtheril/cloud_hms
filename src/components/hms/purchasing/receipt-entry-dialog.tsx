'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createPurchaseReceipt, getPendingPurchaseOrders } from '@/app/actions/receipt';
import { scanInvoiceFromUrl } from '@/app/actions/scan-invoice';
import { searchSuppliers, searchProducts, createProductQuick, getCompanyDetails } from '@/app/actions/purchase';
import { updateSupplierPricingDefaults, getSupplierPricingDefaults } from '@/app/actions/supplier-pricing';

import {
    Loader2, Plus, Trash2, ArrowLeft, CheckCircle2,
    ScanLine, Box, ArrowRight, X, Scan,
    Receipt, Info, Calculator, Calendar as CalendarIcon,
    AlertCircle, Sparkles, FileText
} from 'lucide-react';
import { SearchableSelect, type Option } from '@/components/ui/searchable-select';
import { FileUpload } from '@/components/ui/file-upload';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { SupplierDialog } from '@/components/hms/purchasing/supplier-dialog';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const PACKING_OPTIONS = ['1 Strip', '1 Box', '1 Bottle', '10x10', '1x10', '1x15', '1 Unit', '1 kg', '1 L'];
const TAX_OPTIONS = ['0', '5', '12', '18', '28'];

type ReceiptItem = {
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
    salePrice?: number;
    marginPct?: number;
    markupPct?: number;
    pricingStrategy?: 'mrp_discount' | 'cost_markup' | 'custom' | 'manual';
    mrpDiscountPct?: number;
    taxRate?: number;
    taxAmount?: number;
    hsn?: string;
    packing?: string;
    uom?: string;
    schemeDiscount?: number;
    discountPct?: number;
    discountAmt?: number;
};

interface ReceiptEntryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ReceiptEntryDialog({ isOpen, onClose, onSuccess }: ReceiptEntryDialogProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);

    // Mode: 'po' (Linked to PO) | 'direct' (Ad-hoc)
    const [mode, setMode] = useState<'po' | 'direct'>('po');

    // Header State
    const [supplierId, setSupplierId] = useState<string | null>(null);
    const [supplierName, setSupplierName] = useState('');
    const [supplierMeta, setSupplierMeta] = useState<any>(null);
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

    // AI Scanning State
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState('');

    // Company & Tax Logic
    const [companyDetails, setCompanyDetails] = useState<{ gstin?: string, state?: string } | null>(null);
    const [taxType, setTaxType] = useState<'INTRA' | 'INTER'>('INTRA');

    // Load Company Details
    useEffect(() => {
        if (!isOpen) return;
        async function loadCompany() {
            const details = await getCompanyDetails();
            if (details) setCompanyDetails(details);
        }
        loadCompany();
    }, [isOpen]);

    // Determine Tax Type
    useEffect(() => {
        if (!supplierMeta?.gstin || !companyDetails?.gstin) {
            setTaxType('INTRA');
            return;
        }
        const supplierStateCode = supplierMeta.gstin.substring(0, 2);
        const companyStateCode = companyDetails.gstin.substring(0, 2);
        setTaxType(supplierStateCode === companyStateCode ? 'INTRA' : 'INTER');
    }, [supplierMeta, companyDetails]);

    // Auto-calculate Round Off
    useEffect(() => {
        if (!isAutoRound) return;
        const taxable = items.reduce((sum, item) => {
            const baseAmount = item.unitPrice * Number(item.receivedQty);
            const totalDiscount = (item.schemeDiscount || 0) + (item.discountAmt || 0);
            return sum + Math.max(0, baseAmount - totalDiscount);
        }, 0);
        const tax = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
        const rawTotal = taxable + tax;
        const rounded = Math.round(rawTotal);
        setRoundOff(Number((rounded - rawTotal).toFixed(2)));
    }, [items, isAutoRound]);

    // Load POs
    useEffect(() => {
        if (!isOpen) return;
        async function loadPos() {
            const res = await getPendingPurchaseOrders();
            if (res?.data) {
                setPoOptions(res.data.map((po: any) => ({ id: po.id, label: `${po.poNumber} - ${po.supplierName}` })));
            }
        }
        loadPos();
    }, [isOpen]);

    const handlePoSelect = async (id: string | null) => {
        setPoId(id);
        if (!id) return;
        try {
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
                    receivedQty: i.pendingQty,
                    unitPrice: i.unitPrice
                })));
            }
        } catch (err) {
            toast({ title: "Error", description: "Failed to load PO details", variant: "destructive" });
        }
    };

    const calculateMargin = (salePrice: number, cost: number): number => {
        if (salePrice <= 0) return 0;
        return ((salePrice - cost) / salePrice) * 100;
    };

    const calculateMarkup = (salePrice: number, cost: number): number => {
        if (cost <= 0) return 0;
        return ((salePrice - cost) / cost) * 100;
    };

    const handleSalePriceChange = (index: number, salePrice: number) => {
        const newItems = [...items];
        const item = newItems[index];
        if (item.mrp && salePrice > item.mrp) {
            toast({ title: "Invalid Price", description: `Sale price cannot exceed MRP (₹${item.mrp})`, variant: "destructive" });
            return;
        }
        item.salePrice = salePrice;
        item.pricingStrategy = 'manual';
        if (item.unitPrice > 0) {
            item.marginPct = Number(calculateMargin(salePrice, item.unitPrice).toFixed(2));
            item.markupPct = Number(calculateMarkup(salePrice, item.unitPrice).toFixed(2));
        }
        setItems(newItems);
    };

    const applyQuickMargin = (marginTemplate: string) => {
        const discountPct = parseFloat(marginTemplate.split('-')[1]);
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
        toast({ title: "Pricing Applied", description: `MRP-${discountPct}% applied to all items` });
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
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        if (Math.abs(roundOff) > 0.5) {
            toast({ title: "Validation Error", description: "Round Off amount cannot exceed +/- 0.50.", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }

        const validItems = items.filter(i => i.receivedQty > 0 && i.productId);
        if (validItems.length === 0) {
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
                packing: i.packing,
                uom: i.uom,
                schemeDiscount: i.schemeDiscount ? Number(i.schemeDiscount) : undefined,
                discountPct: i.discountPct ? Number(i.discountPct) : undefined,
                discountAmt: i.discountAmt ? Number(i.discountAmt) : undefined
            }))
        };

        const res = await createPurchaseReceipt(payload);
        if (res.error) {
            toast({ title: "Error", description: res.error, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Goods received successfully." });
            onSuccess?.();
            onClose();
        }
        setIsSubmitting(false);
    };

    const totalTaxable = items.reduce((sum, item) => {
        const baseAmount = item.unitPrice * Number(item.receivedQty);
        const totalDiscount = (item.schemeDiscount || 0) + (item.discountAmt || 0);
        return sum + Math.max(0, baseAmount - totalDiscount);
    }, 0);
    const totalTax = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
    const netTotal = totalTaxable + totalTax + roundOff;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] p-0 overflow-hidden bg-neutral-950 border-white/10 flex flex-col selection:bg-indigo-500/30">

                <Toaster />
                <SupplierDialog
                    isOpen={supplierDialogOpen}
                    onClose={() => setSupplierDialogOpen(false)}
                    onSuccess={(newSupplier) => {
                        setSupplierId(newSupplier.id);
                        setSupplierName(newSupplier.label);
                        setSupplierMeta({ gstin: newSupplier.subLabel });
                    }}
                />

                {/* World-Class Fixed Header */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-neutral-950/80 backdrop-blur-xl shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                            <Receipt className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                                New Purchase Entry
                                {isScanning && (
                                    <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse px-3">
                                        <Sparkles className="w-3 h-3 mr-1.5" />
                                        AI Scanning...
                                    </Badge>
                                )}
                            </DialogTitle>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Record Supplier Stock Inward</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-neutral-900 rounded-lg p-1 border border-white/5">
                            <button
                                onClick={() => setMode('po')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'po' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
                            >
                                PO LINKED
                            </button>
                            <button
                                onClick={() => setMode('direct')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'direct' ? 'bg-emerald-600 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
                            >
                                DIRECT
                            </button>
                        </div>
                        <Separator orientation="vertical" className="h-8 bg-white/5" />
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-neutral-500 hover:text-white hover:bg-white/5 rounded-full h-10 w-10">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Main Scrollable Content */}
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <div className="px-8 py-8 space-y-12">
                        {/* Header Context Grid */}
                        <div className="grid grid-cols-12 gap-12">
                            {/* Vendor Section */}
                            <div className="col-span-12 lg:col-span-4 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Supplier Entity</label>
                                        <button onClick={() => setSupplierDialogOpen(true)} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Add New +</button>
                                    </div>
                                    <div className="group relative">
                                        <SearchableSelect
                                            value={supplierId}
                                            defaultOptions={useMemo(() => supplierId ? [{ id: supplierId, label: supplierName, subLabel: supplierMeta?.gstin }] : [], [supplierId, supplierName, supplierMeta?.gstin])}
                                            onChange={(id, opt) => { setSupplierId(id); setSupplierName(opt?.label || ''); }}
                                            onSearch={searchSuppliers}
                                            placeholder="Search Supplier Name / GSTIN..."
                                            className="w-full bg-transparent border-none text-xl font-bold placeholder:text-neutral-800 p-0 focus:ring-0 dark"
                                            variant="ghost"
                                            isDark={true}
                                        />
                                        <div className="h-px w-full bg-neutral-800 absolute bottom-0 left-0 group-focus-within:bg-indigo-500 transition-all duration-300 scale-x-100 group-focus-within:scale-x-100 origin-left"></div>
                                    </div>
                                    {supplierMeta?.gstin && (
                                        <Badge variant="outline" className="bg-indigo-500/5 border-indigo-500/10 text-indigo-400/70 text-[10px] font-mono">
                                            GST: {supplierMeta.gstin}
                                        </Badge>
                                    )}
                                </div>

                                {mode === 'po' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Reference PO</label>
                                        <div className="group relative">
                                            <SearchableSelect
                                                value={poId}
                                                onChange={(id) => handlePoSelect(id)}
                                                onSearch={async (q) => poOptions.filter(o => o.label.toLowerCase().includes(q.toLowerCase()))}
                                                placeholder="Select Open Order..."
                                                className="w-full bg-transparent border-none text-xl font-bold text-indigo-300 placeholder:text-neutral-800 p-0 focus:ring-0 font-mono dark"
                                                variant="ghost"
                                                isDark={true}
                                            />
                                            <div className="h-px w-full bg-neutral-800 absolute bottom-0 left-0 group-focus-within:bg-indigo-500 transition-all duration-300"></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Reference & Date */}
                            <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Received Date</label>
                                    <div className="flex items-center gap-3 border-b border-neutral-800 pb-2.5 focus-within:border-indigo-500 transition-colors">
                                        <CalendarIcon className="h-4 w-4 text-neutral-600" />
                                        <input
                                            type="date"
                                            value={receivedDate}
                                            onChange={(e) => setReceivedDate(e.target.value)}
                                            className="bg-transparent border-none p-0 text-sm font-bold text-white focus:ring-0 w-full [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Invoice / Ref</label>
                                    <div className="flex items-center gap-3 border-b border-neutral-800 pb-2.5 focus-within:border-indigo-500 transition-colors">
                                        <FileText className="h-4 w-4 text-neutral-600" />
                                        <input
                                            type="text"
                                            value={reference}
                                            onChange={(e) => setReference(e.target.value)}
                                            placeholder="INV-2024-..."
                                            className="bg-transparent border-none p-0 text-sm font-bold text-white focus:ring-0 w-full placeholder:text-neutral-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* AI Scanning */}
                            <div className="col-span-12 lg:col-span-4">
                                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 relative overflow-hidden group/scan">
                                    <div className="flex items-start justify-between relative z-10">
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                                                <Scan className="w-3.5 h-3.5" />
                                                Smart Ingestion
                                            </h4>
                                            <p className="text-[10px] text-neutral-500 leading-relaxed max-w-[140px]">Upload a PDF to auto-fill items and taxes.</p>
                                        </div>
                                        <FileUpload
                                            disabled={isScanning}
                                            className="w-24 h-24 bg-neutral-900 border-indigo-500/20 group-hover/scan:border-indigo-500/40 transition-all rounded-xl cursor-pointer"
                                            onUploadComplete={async (url) => {
                                                if (!url) return;
                                                setAttachmentUrl(url);
                                                setIsScanning(true);
                                                setScanProgress('Analyzing...');
                                                try {
                                                    const res = await scanInvoiceFromUrl(url);
                                                    if (!('error' in res) && res.data) {
                                                        const { supplierId, supplierName, date, reference: ref, items: scannedItems } = res.data;
                                                        setMode('direct');
                                                        if (supplierId) {
                                                            setSupplierId(supplierId);
                                                            setSupplierName(supplierName);
                                                            setSupplierMeta({ gstin: res.data.gstin });
                                                        }
                                                        if (date) setReceivedDate(date);
                                                        if (ref) setReference(ref);
                                                        if (scannedItems) {
                                                            const { findOrCreateProduct } = await import('@/app/actions/inventory');
                                                            const mapped = await Promise.all(scannedItems.map(async (item: any) => {
                                                                let pId = item.productId;
                                                                if (!pId && item.productName) {
                                                                    const pr = await findOrCreateProduct(item.productName, { mrp: Number(item.mrp), hsn: item.hsn });
                                                                    if (!('error' in pr)) pId = pr.productId;
                                                                }
                                                                const qty = Number(item.qty) || 0;
                                                                const price = Number(item.unitPrice) || 0;
                                                                const rate = Number(item.taxRate) || 0;
                                                                return {
                                                                    productId: pId || "",
                                                                    productName: item.productName,
                                                                    receivedQty: qty,
                                                                    unitPrice: price,
                                                                    batch: item.batch,
                                                                    expiry: item.expiry,
                                                                    mrp: Number(item.mrp),
                                                                    taxRate: rate,
                                                                    taxAmount: (qty * price) * (rate / 100),
                                                                    hsn: item.hsn,
                                                                    packing: item.packing,
                                                                    uom: item.uom
                                                                };
                                                            }));
                                                            setItems(mapped);
                                                            if (res.data.grandTotal) {
                                                                setScannedTotal(Number(res.data.grandTotal));
                                                                setIsAutoRound(false);
                                                            }
                                                        }
                                                        toast({ title: "Scan Success", description: "Invoice details extracted." });
                                                    }
                                                } catch (e) {
                                                    toast({ title: "Scan Failed", variant: "destructive" });
                                                } finally {
                                                    setIsScanning(false);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-12 translate-x-12 blur-3xl group-hover/scan:bg-indigo-500/10 transition-all"></div>
                                </div>
                            </div>
                        </div>

                        {/* Item Manifest */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-1 bg-indigo-500 rounded-full"></div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">Item Manifest</h3>
                                </div>
                                {mode === 'direct' && (
                                    <button onClick={addItem} className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-all">
                                        <Plus className="h-3.5 w-3.5" /> ADD LINE
                                    </button>
                                )}
                            </div>

                            <div className="rounded-2xl border border-white/5 bg-neutral-900/30 overflow-hidden">
                                <table className="w-full text-left border-collapse min-w-[1300px]">
                                    <thead>
                                        <tr className="bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-neutral-500 border-b border-white/5">
                                            <th className="py-4 pl-6 w-[250px]">Product Description</th>
                                            <th className="py-4 px-2 w-24">HSN / Pack</th>
                                            <th className="py-4 px-2 w-24">Batch / Exp</th>
                                            <th className="py-4 px-2 w-24 text-right">MRP</th>
                                            <th className="py-4 px-2 w-24 text-right text-emerald-400">Sale (Ex)</th>
                                            <th className="py-4 px-2 w-20 text-right">Margin</th>
                                            <th className="py-4 px-2 w-24 text-right text-yellow-500">Disc (₹/%)</th>
                                            <th className="py-4 px-2 w-20 text-center">Qty</th>
                                            <th className="py-4 px-2 w-24 text-right">Uni Cost</th>
                                            <th className="py-4 px-2 w-24 text-right">Tax (%)</th>
                                            <th className="py-4 pr-6 text-right w-32">Line Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {items.map((item, index) => (
                                            <tr key={index} className="group hover:bg-white/[0.01] transition-all">
                                                <td className="py-4 pl-6">
                                                    {mode === 'po' ? (
                                                        <div className="space-y-0.5">
                                                            <div className="text-sm font-bold text-white">{item.productName}</div>
                                                            <div className="text-[9px] text-neutral-500 font-mono">ID: {item.productId.split('-').pop()}</div>
                                                        </div>
                                                    ) : (
                                                        <SearchableSelect
                                                            value={item.productId}
                                                            onChange={(id, opt) => {
                                                                const n = [...items];
                                                                n[index].productId = id || "";
                                                                n[index].productName = opt?.label || "";
                                                                setItems(n);
                                                            }}
                                                            onSearch={searchProducts}
                                                            onCreate={createProductQuick}
                                                            defaultOptions={item.productId ? [{ id: item.productId, label: item.productName }] : []}
                                                            placeholder="Search Product..."
                                                            className="w-full text-sm font-bold text-white dark"
                                                            variant="ghost"
                                                            isDark={true}
                                                        />
                                                    )}
                                                </td>
                                                <td className="py-4 px-2">
                                                    <div className="space-y-1">
                                                        <input
                                                            value={item.hsn || ''}
                                                            onChange={(e) => { const n = [...items]; n[index].hsn = e.target.value; setItems(n); }}
                                                            placeholder="HSN" className="w-full bg-transparent border-none text-[11px] font-mono p-0 focus:ring-0 text-neutral-400"
                                                        />
                                                        <input
                                                            value={item.packing || ''}
                                                            onChange={(e) => { const n = [...items]; n[index].packing = e.target.value; setItems(n); }}
                                                            placeholder="Pack" className="w-full bg-transparent border-none text-[11px] font-bold p-0 focus:ring-0 text-white"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2">
                                                    <div className="space-y-1">
                                                        <input
                                                            value={item.batch || ''}
                                                            onChange={(e) => { const n = [...items]; n[index].batch = e.target.value; setItems(n); }}
                                                            placeholder="Batch" className="w-full bg-transparent border-none text-[11px] font-mono p-0 focus:ring-0 text-white"
                                                        />
                                                        <input
                                                            value={item.expiry || ''}
                                                            onChange={(e) => { const n = [...items]; n[index].expiry = e.target.value; setItems(n); }}
                                                            placeholder="MM/YY" className="w-full bg-transparent border-none text-[11px] font-mono p-0 focus:ring-0 text-neutral-500"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2 text-right font-mono font-bold text-white">
                                                    <input
                                                        type="number" value={item.mrp || ''}
                                                        onChange={(e) => { const n = [...items]; n[index].mrp = Number(e.target.value); setItems(n); }}
                                                        className="w-full bg-transparent border-none text-right font-bold focus:ring-0 p-0"
                                                    />
                                                </td>
                                                <td className="py-4 px-2 text-right">
                                                    <input
                                                        type="number" value={item.salePrice || ''}
                                                        onChange={(e) => handleSalePriceChange(index, Number(e.target.value))}
                                                        className="w-full bg-transparent border-none text-right font-bold text-emerald-400 focus:ring-0 p-0"
                                                    />
                                                </td>
                                                <td className="py-4 px-2 text-right">
                                                    <span className={`text-[10px] font-black ${item.marginPct && item.marginPct > 20 ? 'text-green-400' : 'text-neutral-500'}`}>
                                                        {item.marginPct ? `${item.marginPct}%` : '0%'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2 text-right">
                                                    <div className="space-y-1">
                                                        <input
                                                            type="number" value={item.discountAmt || ''}
                                                            onChange={(e) => {
                                                                const n = [...items]; n[index].discountAmt = Number(e.target.value);
                                                                const taxable = (n[index].unitPrice * n[index].receivedQty) - (n[index].schemeDiscount || 0) - (n[index].discountAmt || 0);
                                                                n[index].taxAmount = taxable * ((n[index].taxRate || 0) / 100);
                                                                setItems(n);
                                                            }}
                                                            placeholder="Amt" className="w-full bg-transparent border-none text-right text-[11px] text-yellow-500 focus:ring-0 p-0 font-bold"
                                                        />
                                                        <input
                                                            type="number" value={item.discountPct || ''}
                                                            onChange={(e) => {
                                                                const n = [...items]; const pct = Number(e.target.value); n[index].discountPct = pct;
                                                                n[index].discountAmt = (n[index].unitPrice * n[index].receivedQty * pct) / 100;
                                                                const taxable = (n[index].unitPrice * n[index].receivedQty) - (n[index].schemeDiscount || 0) - (n[index].discountAmt || 0);
                                                                n[index].taxAmount = taxable * ((n[index].taxRate || 0) / 100);
                                                                setItems(n);
                                                            }}
                                                            placeholder="%" className="w-full bg-transparent border-none text-right text-[10px] text-neutral-500 focus:ring-0 p-0"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2 text-center">
                                                    <input
                                                        type="number" value={item.receivedQty}
                                                        onChange={(e) => {
                                                            const n = [...items]; const q = Number(e.target.value); n[index].receivedQty = q;
                                                            const taxable = (n[index].unitPrice * q) - (n[index].schemeDiscount || 0) - (n[index].discountAmt || 0);
                                                            n[index].taxAmount = taxable * ((n[index].taxRate || 0) / 100);
                                                            setItems(n);
                                                        }}
                                                        className="w-12 mx-auto bg-neutral-800 rounded p-1 text-center font-bold text-white border-none focus:ring-1 focus:ring-indigo-500"
                                                    />
                                                </td>
                                                <td className="py-4 px-2 text-right font-mono font-bold text-white">
                                                    <input
                                                        type="number" value={item.unitPrice}
                                                        onChange={(e) => {
                                                            const n = [...items]; const p = Number(e.target.value); n[index].unitPrice = p;
                                                            const taxable = (p * n[index].receivedQty) - (n[index].schemeDiscount || 0) - (n[index].discountAmt || 0);
                                                            n[index].taxAmount = taxable * ((n[index].taxRate || 0) / 100);
                                                            setItems(n);
                                                        }}
                                                        className="w-full bg-transparent border-none text-right font-bold focus:ring-0 p-0"
                                                    />
                                                </td>
                                                <td className="py-4 px-2 text-right">
                                                    <Select
                                                        value={item.taxRate?.toString() || "0"}
                                                        onValueChange={(v) => {
                                                            const n = [...items]; const r = Number(v); n[index].taxRate = r;
                                                            const taxable = (n[index].unitPrice * n[index].receivedQty) - (n[index].schemeDiscount || 0) - (n[index].discountAmt || 0);
                                                            n[index].taxAmount = taxable * (r / 100);
                                                            setItems(n);
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-7 w-16 bg-transparent border-white/10 text-[10px] font-mono">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-neutral-900 border-white/10 text-white">
                                                            {TAX_OPTIONS.map(v => <SelectItem key={v} value={v}>{v}%</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="py-4 pr-6 text-right font-mono font-black text-white">
                                                    {((item.unitPrice * item.receivedQty) - (item.schemeDiscount || 0) - (item.discountAmt || 0) + (item.taxAmount || 0)).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* World-Class Fixed Footer */}
                <div className="px-8 py-6 border-t border-white/5 bg-neutral-900/40 backdrop-blur-2xl shrink-0 flex items-center justify-between z-10">
                    <div className="flex items-center gap-12">
                        {/* Summary Stats */}
                        <div className="flex items-center gap-8">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Total Taxable</p>
                                <p className="text-sm font-mono font-bold text-white">₹{totalTaxable.toFixed(2)}</p>
                            </div>
                            <div className="space-y-1 border-l border-white/5 pl-8">
                                <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Aggregate Tax</p>
                                <p className="text-sm font-mono font-bold text-indigo-400">₹{totalTax.toFixed(2)}</p>
                            </div>
                            <div className="flex flex-col space-y-1 border-l border-white/5 pl-8 group/round">
                                <div className="flex items-center gap-2">
                                    <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Round Off</p>
                                    <button onClick={() => setIsAutoRound(!isAutoRound)} className={`text-[8px] px-1 rounded ${isAutoRound ? 'bg-indigo-500/10 text-indigo-400' : 'bg-neutral-800 text-neutral-500'}`}>AUTO</button>
                                </div>
                                <input
                                    type="number"
                                    value={roundOff}
                                    onChange={(e) => { setRoundOff(Number(e.target.value)); setIsAutoRound(false); }}
                                    className="bg-transparent border-none p-0 text-sm font-mono font-bold text-neutral-400 focus:ring-0 w-16"
                                />
                            </div>
                        </div>

                        {/* Grand Total - PROMINENT */}
                        <div className="bg-white/5 px-6 py-2 rounded-2xl border border-white/5 flex flex-col items-center">
                            <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest mb-0.5">Grand Total INR</p>
                            <p className="text-2xl font-black text-white tracking-tighter transition-all">₹{netTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>

                        {scannedTotal > 0 && (
                            <div className="flex flex-col items-start px-4 border-l border-white/5">
                                <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Scanned Total</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-mono font-bold text-neutral-300">₹{scannedTotal.toFixed(2)}</p>
                                    <Badge className={Math.abs(scannedTotal - netTotal) < 0.1 ? 'bg-emerald-500/10 text-emerald-400 border-none' : 'bg-rose-500/10 text-rose-400 border-none'}>
                                        {Math.abs(scannedTotal - netTotal) < 0.1 ? 'Matched' : `Diff: ₹${(netTotal - scannedTotal).toFixed(2)}`}
                                    </Badge>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-neutral-400 hover:text-white" onClick={onClose}>Discard</Button>
                        <Button
                            className="bg-white text-black hover:bg-neutral-200 h-12 px-8 rounded-xl font-bold transition-all transform active:scale-95 shadow-xl disabled:opacity-50"
                            disabled={items.length === 0 || isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Confirm & Post Entry <ArrowRight className="ml-2 w-5 h-5" /></>}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
