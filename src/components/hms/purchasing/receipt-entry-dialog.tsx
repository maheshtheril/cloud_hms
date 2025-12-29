"use client";

import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Plus, Search, Trash2, Receipt, ArrowRight, X,
    Calendar as CalendarIcon, FileText, Sparkles, Loader2, Scan,
    Maximize2, Minimize2, RotateCcw
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SearchableSelect, type Option } from "@/components/ui/searchable-select";
import { Toaster } from "@/components/ui/toaster";
import { getSuppliersList, getProductsPremium, getProduct, findOrCreateProduct } from "@/app/actions/inventory";
import { getPendingPurchaseOrders, createPurchaseReceipt, getPurchaseOrder } from "@/app/actions/receipt";
import { motion } from "framer-motion";
import { getCompanyDetails } from "@/app/actions/purchase";
import { scanInvoiceFromUrl as scanInvoiceAction } from "@/app/actions/scan-invoice";
import { SupplierDialog } from "./supplier-dialog";
import { ProductCreationDialog } from "@/components/inventory/product-creation-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";

type ReceiptItem = {
    productId: string;
    productName: string;
    poLineId?: string;
    orderedQty?: number;
    pendingQty?: number;
    receivedQty: number;
    unitPrice: number;
    batch: string;
    expiry: string;
    mrp: number;
    salePrice: number;
    marginPct: number;
    markupPct?: number;
    pricingStrategy?: 'manual' | 'mrp_discount';
    mrpDiscountPct?: number;
    taxRate: number;
    taxAmount: number;
    hsn: string;
    packing: string;
    uom?: string;
    schemeDiscount?: number;
    discountPct?: number;
    discountAmt?: number;
    freeQty?: number;
};

interface ReceiptEntryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const TAX_OPTIONS = [0, 5, 12, 18, 28];

export function ReceiptEntryDialog({ isOpen, onClose, onSuccess }: ReceiptEntryDialogProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
    const [isProductCreationOpen, setProductCreationOpen] = useState(false);
    const [globalMargin, setGlobalMargin] = useState<number>(20); // Default to 20%

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

    // Window State
    const [isMaximized, setIsMaximized] = useState(false);

    // Company & Tax Logic
    const [companyDetails, setCompanyDetails] = useState<{ gstin?: string, state?: string } | null>(null);
    const [taxType, setTaxType] = useState<'INTRA' | 'INTER'>('INTRA');

    // Load Company Details
    useEffect(() => {
        if (!isOpen) return;
        async function loadCompany() {
            const details = await getCompanyDetails();
            if (details) setCompanyDetails(details as any);
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
            const baseTotal = item.unitPrice * Number(item.receivedQty);
            const totalDeductions = (item.discountAmt || 0) + (item.schemeDiscount || 0);
            return sum + Math.max(0, baseTotal - totalDeductions);
        }, 0);
        const tax = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
        const rawTotal = taxable + tax;
        const rounded = Math.round(rawTotal);
        setRoundOff(Number((rounded - rawTotal).toFixed(2)));
    }, [items, isAutoRound]);

    // Force Re-calculation mechanism to ensure derived values are correct


    // Load POs
    useEffect(() => {
        if (!isOpen) return;
        async function loadPos() {
            const res = await getPendingPurchaseOrders() as any;
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
            const res = await getPurchaseOrder(id) as any;
            if (res.data) {
                if (res.data.supplierId) {
                    setSupplierId(res.data.supplierId);
                    setSupplierName(res.data.supplierName || '');
                    setSupplierMeta({ gstin: res.data.supplierGstin });
                }
                // Fetch detailed product info to auto-fill Sell Price & MRP
                const enrichedItems = await Promise.all(res.data.items.map(async (i: any) => {
                    const p = await getProduct(i.productId);
                    const cost = i.unitPrice || 0;
                    const sp = p?.price || 0;
                    const taxable = (cost * i.pendingQty) - 0; // PO items usually don't have discount yet
                    return {
                        productId: i.productId,
                        productName: i.productName,
                        poLineId: i.poLineId,
                        orderedQty: i.orderedQty,
                        pendingQty: i.pendingQty,
                        receivedQty: i.pendingQty,
                        unitPrice: cost,
                        batch: '',
                        expiry: '',
                        mrp: p?.mrp || cost,
                        salePrice: sp,
                        marginPct: sp > 0 ? Number(calculateMargin(sp, cost).toFixed(2)) : 0,
                        taxRate: i.taxRate || p?.taxRate || 0,
                        taxAmount: taxable * ((i.taxRate || p?.taxRate || 0) / 100),
                        hsn: i.hsn || p?.hsn || '',
                        packing: i.packing || p?.packing || '',
                        uom: p?.uom || 'PCS',
                        schemeDiscount: 0,
                        discountPct: 0,
                        discountAmt: 0,
                        freeQty: 0
                    };
                }));
                setItems(enrichedItems);
            }
        } catch (err) {
            toast({ title: "Error", description: "Failed to load PO details", variant: "destructive" });
        }
    };

    const calculateMargin = (salePrice: number, cost: number): number => {
        if (salePrice <= 0) return 0;
        return ((salePrice - cost) / salePrice) * 100;
    };

    const updateLineItemCalcs = (item: ReceiptItem): ReceiptItem => {
        const baseTotal = item.unitPrice * item.receivedQty;
        const deductions = (item.discountAmt || 0) + (item.schemeDiscount || 0);
        const taxable = Math.max(0, baseTotal - deductions);
        const taxAmt = taxable * ((item.taxRate || 0) / 100);
        return {
            ...item,
            taxAmount: taxAmt
        };
    };

    const calculateMarkup = (salePrice: number, cost: number): number => {
        if (cost <= 0) return 0;
        return ((salePrice - cost) / cost) * 100;
    };

    const handleSalePriceChange = (index: number, salePrice: number) => {
        const newItems = [...items];
        const item = newItems[index];
        if (item.mrp && salePrice > item.mrp) {
            // Keep it but show a toast warning (non-blocking)
            toast({ title: "Price Warning", description: `Sale price (₹${salePrice}) is higher than MRP (₹${item.mrp})`, variant: "destructive" });
        }
        item.salePrice = salePrice;
        item.pricingStrategy = 'manual';
        if (item.unitPrice > 0) {
            item.marginPct = Number(calculateMargin(salePrice, item.unitPrice).toFixed(2));
            item.markupPct = Number(calculateMarkup(salePrice, item.unitPrice).toFixed(2));
        }
        setItems(newItems);
    };

    const handleProductSelect = async (index: number, id: string | null, opt: Option | null | undefined) => {
        const n = [...items];
        n[index].productId = id || "";
        n[index].productName = opt?.label || "";
        if (id) {
            const p = await getProduct(id);
            if (p) {
                n[index].mrp = p.mrp || 0;
                n[index].salePrice = p.price || 0;
                n[index].hsn = p.hsn || "";
                n[index].packing = p.packing || "";
                n[index].uom = p.uom || "PCS";
                n[index].taxRate = p.taxRate || 0;

                if (n[index].salePrice > 0 && n[index].unitPrice > 0) {
                    n[index].marginPct = Number(calculateMargin(n[index].salePrice, n[index].unitPrice).toFixed(2));
                }

                const taxable = (n[index].unitPrice * n[index].receivedQty) - (n[index].schemeDiscount || 0) - (n[index].discountAmt || 0);
                n[index] = updateLineItemCalcs(n[index]);
            }
        }
        setItems(n);
    };

    const handleMarginChange = (index: number, margin: number) => {
        const n = [...items];
        const item = n[index];
        item.marginPct = margin;
        if (item.unitPrice > 0) {
            const denominator = 1 - margin / 100;
            if (denominator > 0) {
                const calculatedSalePrice = Number((item.unitPrice / denominator).toFixed(2));
                item.salePrice = calculatedSalePrice;
            } else if (item.mrp) {
                item.salePrice = item.mrp;
            }
            item.pricingStrategy = 'manual';
        }
        setItems(n);
    };

    const applyGlobalMargin = () => {
        const margin = globalMargin;
        const newItems = items.map(item => {
            if (item.unitPrice > 0) {
                const denominator = 1 - margin / 100;
                let salePrice = item.salePrice;
                if (denominator > 0) {
                    salePrice = Number((item.unitPrice / denominator).toFixed(2));
                } else if (item.mrp) {
                    salePrice = item.mrp;
                }

                // If sale price exceeds MRP, cap it at MRP unless user manually changes it later
                if (item.mrp && salePrice > item.mrp) {
                    salePrice = item.mrp;
                }

                return {
                    ...item,
                    marginPct: margin,
                    salePrice,
                    pricingStrategy: 'manual' as any,
                    markupPct: item.unitPrice > 0 ? Number(calculateMarkup(salePrice, item.unitPrice).toFixed(2)) : 0
                };
            }
            return item;
        });
        setItems(newItems);
        toast({ title: "Global Margin Applied", description: `Applied ${margin}% margin to all items.` });
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number, field: string) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Look for the same field in the next row
            const nextInput = document.querySelector(`input[data-index="${index + 1}"][data-field="${field}"]`) as HTMLInputElement;
            if (nextInput) {
                nextInput.focus();
                nextInput.select();
            }
        }
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
                    marginPct: item.unitPrice > 0 ? Number(calculateMargin(salePrice, item.unitPrice).toFixed(2)) : 0,
                    markupPct: item.unitPrice > 0 ? Number(calculateMarkup(salePrice, item.unitPrice).toFixed(2)) : 0,
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
            batch: "",
            expiry: "",
            mrp: 0,
            salePrice: 0,
            marginPct: 0,
            taxRate: 0,
            taxAmount: 0,
            hsn: "",
            packing: "",
            schemeDiscount: 0,
            discountPct: 0,
            discountAmt: 0,
            freeQty: 0
        }]);
    };

    const searchSuppliers = async (query: string) => {
        const res = await getSuppliersList(query) as any;
        return res?.data?.map((s: any) => ({
            id: s.id,
            label: s.name,
            subLabel: s.gstin,
            metadata: { gstin: s.gstin, address: s.address }
        })) || [];
    };

    const searchProducts = async (query: string) => {
        const res = await getProductsPremium(query) as any;
        return res?.data?.map((p: any) => ({ id: p.id, label: p.name, subLabel: p.category })) || [];
    };

    const createProductQuick = async (name: string): Promise<Option | null> => {
        setProductCreationOpen(true);
        return null;
    };

    const handleScanInvoice = async (url: string) => {
        setIsScanning(true);
        setScanProgress('Analyzing Invoice...');
        try {
            // Pass supplierId if user has already selected one to get better AI results
            const res = await scanInvoiceAction(url, supplierId || undefined) as any;
            if (res.error) {
                throw new Error(res.error);
            }
            if (res.data) {
                const { supplierId, supplierName, date, reference: ref, items: scannedItems, gstin, address, grandTotal } = res.data;
                if (supplierName) setSupplierName(supplierName);
                if (supplierId) setSupplierId(supplierId);
                setSupplierMeta({ gstin, address });
                if (date) setReceivedDate(date);
                if (ref) setReference(ref);
                if (grandTotal) {
                    const parsedTotal = parseFloat(grandTotal);
                    if (!isNaN(parsedTotal)) {
                        setScannedTotal(parsedTotal);
                        setIsAutoRound(false);
                    }
                }
                if (scannedItems && Array.isArray(scannedItems)) {
                    console.log("Scanned Items:", scannedItems);
                    const mapped = await Promise.all(scannedItems.map(async (item: any) => {
                        try {
                            let pId = item.productId;
                            if (!pId && item.productName) {
                                const pr = await findOrCreateProduct(item.productName, { mrp: Number(item.mrp), hsn: item.hsn });
                                if (pr && !('error' in pr)) pId = pr.productId;
                            }

                            // Safe number parsing
                            // Safe number parsing
                            const qty = !isNaN(parseFloat(item.qty)) ? parseFloat(item.qty) : 0;
                            const price = !isNaN(parseFloat(item.unitPrice)) ? parseFloat(item.unitPrice) : 0;
                            const rate = !isNaN(parseFloat(item.taxRate)) ? parseFloat(item.taxRate) : 0;
                            const freeQty = !isNaN(parseFloat(item.freeQty)) ? parseFloat(item.freeQty) : 0;

                            const rawItem = {
                                productId: pId || "",
                                productName: item.productName || "Unknown Item",
                                poLineId: "",
                                orderedQty: 0,
                                pendingQty: 0,
                                receivedQty: qty,
                                unitPrice: price,
                                batch: item.batch || "",
                                expiry: item.expiry || "",
                                mrp: Number(item.mrp) || price,
                                salePrice: 0,
                                marginPct: 0,
                                taxRate: rate,
                                taxAmount: 0, // Calculated by helper
                                hsn: item.hsn || "",
                                packing: item.packing || "",
                                uom: item.uom || "",
                                schemeDiscount: Number(item.schemeDiscount) || 0,
                                discountPct: Number(item.discountPct) || 0,
                                discountAmt: Number(item.discountAmt) || 0,
                                freeQty: freeQty
                            };
                            return updateLineItemCalcs(rawItem as any);
                        } catch (err) {
                            console.error("Error mapping scanned item:", item, err);
                            // Return a safe dummy item to avoid crashing the whole list
                            return {
                                productId: "",
                                productName: "Error Importing Item",
                                receivedQty: 0,
                                unitPrice: 0,
                                taxAmount: 0
                            } as any;
                        }
                    }));
                    setItems(mapped.filter(i => i.productName !== "Error Importing Item")); // Filter out failed items
                }
                setMode('direct');
                toast({ title: "Scan Success", description: "Details extracted from invoice." });
            }
        } catch (e) {
            toast({ title: "Scan Failed", description: "Failed to read invoice", variant: "destructive" });
        } finally {
            setIsScanning(false);
        }
    };

    const resetForm = () => {
        setItems([]);
        setSupplierId(null);
        setSupplierName('');
        setSupplierMeta(null);
        setReceivedDate(new Date().toISOString().split('T')[0]);
        setReference('');
        setNotes('');
        setAttachmentUrl('');
        setPoId(null);
        setScannedTotal(0);
        setMode('po');
        toast({ title: "Form Cleared", description: "All fields have been reset." });
    };

    const handleSubmit = async () => {
        if (!supplierId || items.length === 0) {
            toast({ title: "Validation Error", description: "Please select a supplier and add at least one item.", variant: "destructive" });
            return;
        }

        // Validate Sale Price
        const invalidPrices = items.filter(i => !i.salePrice || i.salePrice <= 0);
        if (invalidPrices.length > 0) {
            toast({ title: "Missing Prices", description: `Sale Price is mandatory for all items. Found ${invalidPrices.length} items without sale price.`, variant: "destructive" });
            return;
        }

        const totalDifference = Math.abs(netTotal - scannedTotal);
        if (scannedTotal > 0 && totalDifference > 0.01) {
            toast({ title: "Total Mismatch", description: `The calculated total (${netTotal.toFixed(2)}) does not match the scanned total (${scannedTotal.toFixed(2)}). Difference: ${totalDifference.toFixed(2)}`, variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        const payload = {
            supplierId,
            purchaseOrderId: poId,
            receivedDate: new Date(receivedDate),
            reference,
            notes,
            attachmentUrl,
            items: items.map(i => ({
                productId: i.productId,
                poLineId: i.poLineId,
                qtyReceived: i.receivedQty,
                unitPrice: i.unitPrice,
                batch: i.batch,
                expiry: i.expiry,
                mrp: i.mrp,
                salePrice: i.salePrice,
                taxRate: i.taxRate,
                taxAmount: i.taxAmount,
                hsn: i.hsn,
                packing: i.packing,
                purchaseUOM: i.uom,
                schemeDiscount: i.schemeDiscount,
                discountPct: i.discountPct,
                discountAmt: i.discountAmt,
                freeQty: i.freeQty || 0
            }))
        } as any;

        const res = await createPurchaseReceipt(payload) as any;
        if (res.error) {
            toast({ title: "Error", description: res.error, variant: "destructive" });
        } else if (res.warning) {
            toast({ title: "Completed with Warning", description: res.warning, variant: "destructive" });
            onSuccess?.();
            onClose();
        } else {
            toast({ title: "Success", description: "Goods received successfully." });
            onSuccess?.();
            onClose();
        }
        setIsSubmitting(false);
    };

    const totalTaxable = items.reduce((sum, item) => {
        const baseTotal = item.unitPrice * Number(item.receivedQty);
        const totalDeductions = (item.discountAmt || 0) + (item.schemeDiscount || 0);
        const lineTaxable = Math.max(0, baseTotal - totalDeductions);
        return sum + lineTaxable;
    }, 0);
    const totalTax = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
    const netTotal = totalTaxable + totalTax + roundOff;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className={`p-0 overflow-hidden bg-neutral-950 border-white/10 flex flex-col selection:bg-indigo-500/30 transition-all duration-300 ${isMaximized
                    ? 'max-w-none w-screen h-screen rounded-none border-none'
                    : 'max-w-[95vw] w-[1400px] h-[90vh] rounded-2xl'
                    }`}
            >
                <Toaster />
                <SupplierDialog
                    isOpen={supplierDialogOpen}
                    onClose={() => setSupplierDialogOpen(false)}
                    onSuccess={(newSupplier: any) => {
                        setSupplierId(newSupplier.id);
                        setSupplierName(newSupplier.label);
                        setSupplierMeta(newSupplier.metadata || { gstin: newSupplier.subLabel });
                    }}
                />

                <ProductCreationDialog
                    isOpen={isProductCreationOpen}
                    onClose={() => setProductCreationOpen(false)}
                    onSuccess={() => {
                        setProductCreationOpen(false);
                        toast({ title: "Product Created", description: "You can now search for the new product." });
                    }}
                />

                {/* Centered Loading Overlay - Top Level */}
                {isScanning && (
                    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="flex flex-col items-center p-8 rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl space-y-4 max-w-sm w-full">
                            <Scan className="w-12 h-12 text-indigo-500 animate-pulse" />
                            <div className="space-y-2 text-center">
                                <h3 className="text-xl font-bold text-white tracking-tight">AI Scanning...</h3>
                                <p className="text-sm text-neutral-400">{scanProgress || "Analyzing Invoice..."}</p>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-indigo-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                            <p className="text-[10px] text-neutral-500 text-center px-4">
                                May take up to 30s. Retrying automatically if needed.
                            </p>
                        </div>
                    </div>
                )}

                {/* Fixed Title Header */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-neutral-950 shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                            <Receipt className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                                New Purchase Entry
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
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={resetForm}
                                className="text-neutral-500 hover:text-white hover:bg-white/5 rounded-full h-10 w-10"
                                title="Clear Form"
                            >
                                <RotateCcw className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="text-neutral-500 hover:text-white hover:bg-white/5 rounded-full h-10 w-10"
                                title={isMaximized ? "Minimize" : "Maximize"}
                            >
                                {isMaximized ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={onClose} className="text-neutral-500 hover:text-white hover:bg-white/5 rounded-full h-10 w-10">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    {/* Fixed Top Info Grid */}
                    <div className="shrink-0 px-8 py-8 border-b border-white/5 bg-neutral-900/40 backdrop-blur-xl relative overflow-hidden">
                        {/* Shimmer overlay when scanning */}
                        {isScanning && (
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent skew-x-12 z-0"
                            />
                        )}
                        <div className="grid grid-cols-12 gap-10 items-start relative z-10">
                            {/* Vendor Section */}
                            <div className="col-span-12 lg:col-span-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Supplier Entity</label>
                                    <button onClick={() => setSupplierDialogOpen(true)} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Add New +</button>
                                </div>
                                <div className="group relative">
                                    <SearchableSelect
                                        key={`${supplierId}-${supplierName}`} // Force reset on scan
                                        value={supplierId}
                                        valueLabel={supplierName}
                                        defaultOptions={useMemo(() => supplierId ? [{ id: supplierId, label: supplierName, subLabel: supplierMeta?.gstin, metadata: supplierMeta }] : [], [supplierId, supplierName, supplierMeta])}
                                        onChange={(id, opt) => {
                                            setSupplierId(id);
                                            setSupplierName(opt?.label || '');
                                            setSupplierMeta(opt?.metadata || null);
                                        }}
                                        onSearch={searchSuppliers}
                                        placeholder="Search Supplier Name / GSTIN..."
                                        className="w-full bg-transparent border-none text-xl font-bold placeholder:text-neutral-800 p-0 focus:ring-0 dark"
                                        variant="ghost"
                                        isDark={true}
                                    />
                                    <div className="h-px w-full bg-neutral-800 absolute bottom-0 left-0 group-focus-within:bg-indigo-500 transition-all duration-300"></div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {supplierMeta?.gstin && (
                                        <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-mono text-[9px] px-1.5 py-0 h-5">
                                            GST {supplierMeta.gstin}
                                        </Badge>
                                    )}
                                    {supplierMeta?.address && (
                                        <div className="text-[10px] text-neutral-400 font-medium line-clamp-1 flex items-center gap-1.5 opacity-60">
                                            <span className="shrink-0 bg-neutral-800 px-1 rounded-[3px] text-[8px] border border-white/10 text-neutral-300">ADR</span>
                                            {supplierMeta.address}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-6 pt-1">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Received Date</label>
                                    <Input
                                        type="date"
                                        value={receivedDate}
                                        onChange={(e) => setReceivedDate(e.target.value)}
                                        className="bg-white/5 border-white/10 h-11 font-bold text-sm text-white focus:border-indigo-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Invoice #</label>
                                    <Input
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        placeholder="INV-000"
                                        className="bg-white/5 border-white/10 h-11 font-mono font-bold text-white uppercase placeholder:text-neutral-700 focus:border-indigo-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Method/Scan Section */}
                            <div className="col-span-12 lg:col-span-4 space-y-4">
                                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Quick Scan / Order</label>
                                <div className="flex gap-4">
                                    {mode === 'po' ? (
                                        <div className="flex-1">
                                            <SearchableSelect
                                                value={poId}
                                                onChange={(id) => handlePoSelect(id)}
                                                onSearch={async (q) => poOptions.filter(o => o.label.toLowerCase().includes(q.toLowerCase()))}
                                                placeholder="Select PO..."
                                                className="w-full bg-neutral-900/50 border-white/5 h-11 font-mono font-bold"
                                                variant="ghost"
                                                isDark={true}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex-1 h-11 flex items-center px-4 bg-emerald-500/5 border border-emerald-500/10 rounded-md text-[10px] font-black text-emerald-400 uppercase">
                                            Direct Entry
                                        </div>
                                    )}
                                    <div className="shrink-0 w-32 border border-white/5 rounded-md overflow-hidden">
                                        <FileUpload
                                            onUploadComplete={(url) => { if (url) handleScanInvoice(url); }}
                                            className="h-11 border-dashed border-indigo-500/20 bg-indigo-500/[0.02]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Manifest Area - Scrolls vertically */}
                    <div className="flex-1 flex flex-col min-h-0 px-8 py-6 space-y-4">
                        <div className="flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="h-6 w-1 bg-indigo-500 rounded-full"></div>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">Item Manifest</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-white/5 rounded-xl shadow-inner">
                                    <span className="text-[9px] font-black text-neutral-500 uppercase tracking-wider">Bulk Strategy</span>
                                    <div className="flex items-center gap-1.5 bg-neutral-950 border border-white/5 rounded-lg px-2 py-0.5 shadow-sm">
                                        <input
                                            type="number"
                                            value={globalMargin}
                                            onChange={(e) => setGlobalMargin(Number(e.target.value))}
                                            className="w-10 bg-transparent border-none text-[10px] font-black text-green-400 p-0 focus:ring-0 text-center"
                                        />
                                        <span className="text-[9px] font-black text-neutral-600">%</span>
                                    </div>
                                    <button
                                        onClick={applyGlobalMargin}
                                        className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-[9px] font-black rounded-lg transition-all border border-green-500/20 uppercase tracking-widest hover:scale-105 active:scale-95"
                                    >
                                        Apply All
                                    </button>
                                </div>
                                <div className="flex items-center gap-1.5 bg-neutral-900 rounded-xl p-1 border border-white/5">
                                    {['MRP-5', 'MRP-10', 'MRP-12', 'MRP-15'].map(m => (
                                        <button
                                            key={m}
                                            onClick={() => applyQuickMargin(m)}
                                            className="px-3 py-1 text-[9px] font-black rounded-lg hover:bg-white/5 transition-all text-neutral-500 hover:text-white"
                                        >
                                            {m}%
                                        </button>
                                    ))}
                                </div>
                                {mode === 'direct' && (
                                    <button onClick={addItem} className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 hover:bg-indigo-500/10 px-3 py-2 rounded-xl transition-all border border-indigo-500/10">
                                        <Plus className="h-4 w-4" /> ADD LINE
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Table Wrapper - Scrolls both ways */}
                        <div className="flex-1 rounded-2xl border border-white/5 bg-neutral-900/30 overflow-auto custom-scrollbar relative">
                            <table className="w-full text-left border-collapse min-w-[2200px]">
                                <thead>
                                    <tr className="bg-neutral-900 text-[10px] font-black uppercase tracking-widest text-neutral-500 border-b border-white/5 sticky top-0 z-50 shadow-md">
                                        <th className="py-4 pl-6 w-[250px] sticky left-0 z-50 bg-neutral-900 border-r border-white/5">Product Description</th>
                                        <th className="py-4 px-2 w-24">HSN</th>
                                        <th className="py-4 px-2 w-24">Pack</th>
                                        <th className="py-4 px-2 w-24 text-indigo-400">UOM</th>
                                        <th className="py-4 px-2 w-28">Batch</th>
                                        <th className="py-4 px-2 w-24">Exp</th>
                                        <th className="py-4 px-2 w-24 text-right">MRP</th>
                                        <th className="py-4 px-2 w-24 text-right">Sale Price</th>
                                        <th className="py-4 px-2 w-24 text-right text-green-400">Margin %</th>
                                        <th className="py-4 px-2 w-24 text-right">Basic Price</th>
                                        <th className="py-4 px-2 w-20 text-center">Qty</th>
                                        <th className="py-4 px-2 w-20 text-center text-orange-400">Schm Qty</th>
                                        <th className="py-4 px-2 w-20 text-right">Disc %</th>
                                        <th className="py-4 px-2 w-24 text-right">Disc Amt</th>
                                        <th className="py-4 px-2 w-24 text-right">Schm Amt</th>
                                        <th className="py-4 px-2 w-28 text-right">Taxable Val</th>
                                        <th className="py-4 px-2 w-24 text-right">Tax (%)</th>
                                        <th className="py-4 px-2 w-20 text-right">CGST</th>
                                        <th className="py-4 px-2 w-20 text-right">SGST</th>
                                        <th className="py-4 px-2 w-20 text-right">IGST</th>
                                        <th className="py-4 px-2 w-24 text-right">Net Cost</th>
                                        <th className="py-4 pr-6 text-right w-32 sticky right-0 z-50 bg-neutral-900 border-l border-white/5 shadow-xl">Line Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {items.map((item, index) => (
                                        <tr key={index} className="group hover:bg-white/[0.01] transition-all">
                                            <td className="py-4 pl-6 sticky left-0 z-20 bg-neutral-950/20 backdrop-blur-sm border-r border-white/5">
                                                {mode === 'po' ? (
                                                    <div className="space-y-0.5">
                                                        <div className="text-sm font-bold text-white">{item.productName}</div>
                                                        <div className="text-[9px] text-neutral-500 font-mono">ID: {item.productId.split('-').pop()}</div>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-1 items-center">
                                                        <div className="flex-1">
                                                            <SearchableSelect
                                                                value={item.productId}
                                                                onChange={(id, opt) => handleProductSelect(index, id, opt)}
                                                                onSearch={searchProducts}
                                                                onCreate={createProductQuick}
                                                                defaultOptions={item.productId ? [{ id: item.productId, label: item.productName }] : []}
                                                                placeholder="Search..."
                                                                className="w-full text-sm font-bold text-white dark"
                                                                variant="ghost"
                                                                isDark={true}
                                                            />
                                                        </div>
                                                        <button onClick={() => setProductCreationOpen(true)} className="h-6 w-6 flex items-center justify-center rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400">
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 px-2">
                                                <input value={item.hsn || ''} onChange={(e) => { const n = [...items]; n[index].hsn = e.target.value; setItems(n); }} className="w-full bg-transparent border-none text-[12px] font-mono p-0 focus:ring-0 text-neutral-400" />
                                            </td>
                                            <td className="py-4 px-2">
                                                <input value={item.packing || ''} onChange={(e) => { const n = [...items]; n[index].packing = e.target.value; setItems(n); }} className="w-full bg-transparent border-none text-[12px] font-bold p-0 focus:ring-0 text-white" />
                                            </td>
                                            <td className="py-4 px-2">
                                                <input
                                                    value={item.uom || ''}
                                                    onChange={(e) => { const n = [...items]; n[index].uom = e.target.value; setItems(n); }}
                                                    placeholder="PCS/PACK-10"
                                                    className="w-full bg-transparent border-none text-[12px] font-bold p-0 focus:ring-0 text-indigo-400 uppercase placeholder:text-neutral-700"
                                                />
                                            </td>
                                            <td className="py-4 px-2">
                                                <input value={item.batch || ''} onChange={(e) => { const n = [...items]; n[index].batch = e.target.value; setItems(n); }} className="w-full bg-transparent border-none text-[12px] font-mono p-0 focus:ring-0 text-white" />
                                            </td>
                                            <td className="py-4 px-2 text-center">
                                                <input value={item.expiry || ''} onChange={(e) => { const n = [...items]; n[index].expiry = e.target.value; setItems(n); }} placeholder="MM/YY" className="w-full bg-transparent border-none text-[12px] font-mono p-0 focus:ring-0 text-neutral-500 text-center" />
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                <input
                                                    type="number"
                                                    value={item.mrp || ''}
                                                    onFocus={(e) => e.target.select()}
                                                    onKeyDown={(e) => handleKeyDown(e, index, 'mrp')}
                                                    data-index={index}
                                                    data-field="mrp"
                                                    onChange={(e) => { const n = [...items]; n[index].mrp = Number(e.target.value); setItems(n); }}
                                                    className="w-full bg-transparent border-none text-right font-bold focus:ring-0 p-0 text-white"
                                                />
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                <input
                                                    type="number"
                                                    value={item.salePrice || ''}
                                                    onFocus={(e) => e.target.select()}
                                                    onKeyDown={(e) => handleKeyDown(e, index, 'salePrice')}
                                                    data-index={index}
                                                    data-field="salePrice"
                                                    onChange={(e) => handleSalePriceChange(index, Number(e.target.value))}
                                                    className="w-full bg-transparent border-none text-right font-bold text-emerald-400 focus:ring-0 p-0"
                                                />
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                <input
                                                    type="number"
                                                    value={item.marginPct ?? 0}
                                                    onFocus={(e) => e.target.select()}
                                                    onKeyDown={(e) => handleKeyDown(e, index, 'marginPct')}
                                                    data-index={index}
                                                    data-field="marginPct"
                                                    onChange={(e) => handleMarginChange(index, Number(e.target.value))}
                                                    className="w-full bg-transparent border-none text-right font-bold text-green-400 focus:ring-0 p-0"
                                                />
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                <input type="number" value={item.unitPrice} onChange={(e) => {
                                                    const n = [...items];
                                                    n[index].unitPrice = Number(e.target.value);
                                                    n[index] = updateLineItemCalcs(n[index]);
                                                    setItems(n);
                                                }} className="w-full bg-transparent border-none text-right font-bold focus:ring-0 p-0 text-indigo-300" />
                                            </td>
                                            <td className="py-4 px-2 text-center">
                                                <input type="number" value={item.receivedQty} onChange={(e) => {
                                                    const n = [...items];
                                                    n[index].receivedQty = Number(e.target.value);
                                                    // Recalculate discount amount if percentage is set
                                                    if (n[index].discountPct) {
                                                        const baseTotal = n[index].unitPrice * n[index].receivedQty;
                                                        n[index].discountAmt = Number(((baseTotal * n[index].discountPct!) / 100).toFixed(2));
                                                    }
                                                    n[index] = updateLineItemCalcs(n[index]);
                                                    setItems(n);
                                                }} className="w-12 mx-auto bg-neutral-800 rounded p-1 text-center font-bold text-white border-none focus:ring-0" />
                                            </td>
                                            <td className="py-4 px-2 text-center">
                                                <input type="number" value={item.freeQty ?? 0} onChange={(e) => { const n = [...items]; n[index].freeQty = Number(e.target.value); setItems(n); }} className="w-12 mx-auto bg-neutral-800 rounded p-1 text-center font-bold text-orange-400 border-none focus:ring-0" />
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                <input type="number" value={item.discountPct ?? 0} onChange={(e) => {
                                                    const n = [...items];
                                                    const pct = Number(e.target.value);
                                                    n[index].discountPct = pct;
                                                    const baseTotal = n[index].unitPrice * n[index].receivedQty;
                                                    n[index].discountAmt = Number(((baseTotal * pct) / 100).toFixed(2));
                                                    n[index] = updateLineItemCalcs(n[index]);
                                                    setItems(n);
                                                }} className="w-full bg-transparent border-none text-right text-[12px] text-neutral-500 focus:ring-0 p-0" />
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                <input type="number" value={item.discountAmt ?? 0} step="0.01" onChange={(e) => {
                                                    const n = [...items];
                                                    n[index].discountAmt = Number(e.target.value);
                                                    n[index] = updateLineItemCalcs(n[index]);
                                                    setItems(n);
                                                }} className="w-full bg-transparent border-none text-right text-[12px] text-yellow-500 focus:ring-0 p-0 font-bold" />
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                <input type="number" value={item.schemeDiscount ?? 0} step="0.01" onChange={(e) => {
                                                    const n = [...items];
                                                    n[index].schemeDiscount = Number(e.target.value);
                                                    n[index] = updateLineItemCalcs(n[index]);
                                                    setItems(n);
                                                }} className="w-full bg-transparent border-none text-right text-[12px] text-orange-400 focus:ring-0 p-0 font-bold" />
                                            </td>
                                            <td className="py-4 px-2 text-right font-black text-white text-[12px]">
                                                {Math.max(0, (item.unitPrice * item.receivedQty) - (item.discountAmt || 0) - (item.schemeDiscount || 0)).toFixed(2)}
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                <Select value={item.taxRate?.toString() || "0"} onValueChange={(v) => {
                                                    const n = [...items];
                                                    n[index].taxRate = Number(v);
                                                    n[index] = updateLineItemCalcs(n[index]);
                                                    setItems(n);
                                                }}>
                                                    <SelectTrigger className="h-7 w-16 bg-transparent border-white/10 text-[10px] font-mono text-white">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-neutral-900 border-white/10 text-white">
                                                        {TAX_OPTIONS.map(v => <SelectItem key={v} value={String(v)}>{v}%</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                            <td className="py-4 px-2 text-right text-[10px] font-mono text-neutral-500">
                                                {taxType === 'INTRA' ? ((item.taxAmount || 0) / 2).toFixed(2) : '-'}
                                            </td>
                                            <td className="py-4 px-2 text-right text-[10px] font-mono text-neutral-500">
                                                {taxType === 'INTRA' ? ((item.taxAmount || 0) / 2).toFixed(2) : '-'}
                                            </td>
                                            <td className="py-4 px-2 text-right text-[10px] font-mono text-neutral-500">
                                                {taxType === 'INTER' ? (item.taxAmount || 0).toFixed(2) : '-'}
                                            </td>
                                            <td className="py-4 px-2 text-right text-[11px] font-mono font-bold text-indigo-400">
                                                {((item.receivedQty || 0) + (item.freeQty || 0)) > 0
                                                    ? ((Math.max(0, (item.unitPrice * item.receivedQty) - (item.discountAmt || 0) - (item.schemeDiscount || 0)) + (item.taxAmount || 0)) / (Number(item.receivedQty) + Number(item.freeQty || 0))).toFixed(2)
                                                    : '0.00'}
                                            </td>
                                            <td className="py-4 pr-6 text-right font-mono font-black text-white sticky right-0 z-20 bg-neutral-900 border-l border-white/5 shadow-xl">
                                                {(Math.max(0, (item.unitPrice * item.receivedQty) - (item.discountAmt || 0) - (item.schemeDiscount || 0)) + (item.taxAmount || 0)).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* World-Class Fixed Footer */}
                <div className="px-8 py-6 border-t border-white/5 bg-neutral-900/40 backdrop-blur-2xl shrink-0 flex items-center justify-between z-10">
                    <div className="flex items-center gap-12">
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

                        <div className="bg-white/5 px-6 py-2 rounded-2xl border border-white/5 flex flex-col items-center">
                            <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest mb-0.5">Grand Total INR</p>
                            <p className="text-2xl font-black text-white tracking-tighter">₹{netTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>

                        {scannedTotal > 0 && (
                            <div className="flex flex-col items-start px-4 border-l border-white/5">
                                <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Scanned Total</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-mono font-bold text-neutral-300">₹{scannedTotal.toFixed(2)}</p>
                                    <Badge className={Math.abs(scannedTotal - netTotal) < 0.01 ? 'bg-emerald-500/10 text-emerald-400 border-none' : 'bg-rose-500/10 text-rose-400 border-none animate-pulse'}>
                                        {Math.abs(scannedTotal - netTotal) < 0.01 ? 'Matched' : `Mismatch: ₹${(netTotal - scannedTotal).toFixed(2)}`}
                                    </Badge>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {scannedTotal > 0 && Math.abs(netTotal - scannedTotal) > 0.01 && (
                            <div className="bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                                <div className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-ping" />
                                <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Totals Mismatch - Blocked</span>
                            </div>
                        )}
                        <Button variant="ghost" className="text-neutral-400 hover:text-white" onClick={onClose}>Discard</Button>
                        <Button
                            className="bg-white text-black hover:bg-neutral-200 h-12 px-8 rounded-xl font-bold transition-all transform active:scale-95 shadow-xl disabled:opacity-50 disabled:grayscale"
                            disabled={items.length === 0 || isSubmitting || (scannedTotal > 0 && Math.abs(scannedTotal - netTotal) > 0.01)}
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
