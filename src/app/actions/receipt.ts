'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { AccountingService } from '@/lib/services/accounting'
import { hms_purchase_status, hms_receipt_status } from "@prisma/client"

export type PurchaseReceiptData = {
    supplierId?: string
    purchaseOrderId?: string | null
    receivedDate: Date
    reference?: string
    notes?: string
    attachmentUrl?: string
    items: {
        productId: string
        poLineId?: string
        qtyReceived: number
        unitPrice?: number
        locationId?: string
        batch?: string
        expiry?: string
        mrp?: number
        salePrice?: number           // Sale price for this batch
        marginPct?: number            // Profit margin percentage
        markupPct?: number            // Markup percentage on cost
        pricingStrategy?: string      // How the price was set
        mrpDiscountPct?: number       // Discount % from MRP (e.g., 10 for MRP-10%)
        taxRate?: number
        taxAmount?: number
        hsn?: string
        packing?: string
        // UOM Pack/Unit Support
        purchaseUOM?: string          // UOM used for purchase (e.g., "Strip")
        baseUOM?: string              // Product's base UOM (e.g., "Unit")
        conversionFactor?: number     // Conversion factor (e.g., 1 Strip = 15 Units)
        salePricePerUnit?: number     // Sale price for base UOM (calculated)
        discountPct?: number
        discountAmt?: number
        schemeDiscount?: number
        freeQty?: number
    }[]
}

export async function getPendingPurchaseOrders() {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    const pos = await prisma.hms_purchase_order.findMany({
        where: {
            company_id: session.user.companyId,
            status: { in: ['approved', 'partially_received'] as any }
        },
        include: {
            hms_supplier: true
        }
    });

    return {
        data: pos.map(po => ({
            id: po.id,
            poNumber: po.name,
            supplierName: po.hms_supplier?.name || "Unknown"
        }))
    };
}

export async function getPurchaseOrder(id: string) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    const po = await prisma.hms_purchase_order.findUnique({
        where: { id },
        include: {
            hms_supplier: true,
            hms_purchase_order_line: {
                include: {
                    hms_product: true
                }
            }
        }
    });

    if (!po) return { error: "PO not found" };

    const supplierMeta = po.hms_supplier?.metadata as Record<string, any> || {};

    return {
        data: {
            id: po.id,
            supplierId: po.supplier_id,
            supplierName: po.hms_supplier?.name || "Unknown",
            supplierGstin: supplierMeta.gstin || supplierMeta.GSTIN || undefined,
            items: po.hms_purchase_order_line.map(line => {
                const lineMeta = line.metadata as Record<string, any> || {};
                const productMeta = line.hms_product?.metadata as Record<string, any> || {};

                const ordered = Number(line.qty);
                const received = Number(line.received_qty || 0);
                const pending = Math.max(0, ordered - received);

                return {
                    poLineId: line.id,
                    productId: line.product_id,
                    productName: line.hms_product?.name || "Unknown Product",
                    orderedQty: ordered,
                    receivedQty: 0,
                    pendingQty: pending,
                    unitPrice: Number(line.unit_price),
                    // If tax info exists in line, use it
                    taxRate: lineMeta.tax_rate || productMeta.taxRate || productMeta.tax_rate || 0,
                    hsn: lineMeta.hsn || productMeta.hsn || "",
                    packing: lineMeta.packing || productMeta.packing || ""
                };
            })
        }
    };
}

export async function createPurchaseReceipt(data: PurchaseReceiptData) {
    const session = await auth()
    if (!session?.user?.companyId || !session?.user?.tenantId) return { error: "Unauthorized: Missing Company or Tenant ID. Please relogin." }
    const companyId = session.user.companyId;

    if (!data.supplierId) return { error: "Supplier is required." }
    if (!data.items || data.items.length === 0) return { error: "Receipt must have items" }

    // Validate sale price for all items
    for (const item of data.items) {
        // 1. Sale price is required
        if (!item.salePrice || item.salePrice <= 0) {
            return { error: "Sale price is required for all items and must be greater than 0." };
        }

        // 2. Sale price should not be greater than MRP
        if (item.mrp && item.salePrice > item.mrp) {
            return { error: `Sale price (${item.salePrice}) cannot be greater than MRP (${item.mrp}).` };
        }

        // 3. Sale price should not be less than net cost (unit price)
        if (item.unitPrice && item.salePrice < item.unitPrice) {
            return { error: `Sale price (${item.salePrice}) cannot be less than net cost/unit price (${item.unitPrice}).` };
        }
    }

    console.log("createPurchaseReceipt payload:", JSON.stringify(data, null, 2));

    try {
        // 0. CHECK FOR DUPLICATES (Supplier + Reference)
        if (data.reference) {
            // Check for duplicates within last 60 days to prevent re-entering same invoice
            const sixtydaysAgo = new Date();
            sixtydaysAgo.setDate(sixtydaysAgo.getDate() - 60);

            const existing = await prisma.hms_purchase_receipt.findFirst({
                where: {
                    company_id: session.user.companyId,
                    supplier_id: data.supplierId,
                    metadata: {
                        path: ['reference'],
                        equals: data.reference
                    },
                    created_at: { gte: sixtydaysAgo }
                }
            });

            if (existing) {
                return { error: `Duplicate: Invoice '${data.reference}' has already been recorded for this supplier in the last 60 days.` };
            }
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Generate Receipt Number
            const count = await tx.hms_purchase_receipt.count({ where: { company_id: companyId } })
            const receiptNumber = `GRN-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

            // 2. Create Receipt Header
            const receipt = await tx.hms_purchase_receipt.create({
                data: {
                    tenant_id: session.user.tenantId!,
                    company_id: companyId!,
                    purchase_order_id: data.purchaseOrderId,
                    supplier_id: data.supplierId, // Added missing supplier_id
                    name: receiptNumber,
                    received_by: session.user.id,
                    receipt_date: data.receivedDate,
                    status: hms_receipt_status.received,
                    metadata: {
                        reference: data.reference,
                        notes: data.notes,
                        attachment_url: data.attachmentUrl
                    },
                }
            })

            // 2b. ensure default location exists for stock
            let defaultLocation = await tx.hms_stock_location.findFirst({
                where: { company_id: companyId, name: 'Main Warehouse' }
            });

            if (!defaultLocation) {
                defaultLocation = await tx.hms_stock_location.create({
                    data: {
                        tenant_id: session.user.tenantId!,
                        company_id: companyId!,
                        name: 'Main Warehouse',
                        code: 'WH-MAIN',
                        location_type: 'warehouse'
                    }
                });
            }

            // Fetch company tax rates to resolve IDs for metadata
            const taxMaps = await tx.company_tax_maps.findMany({
                where: { company_id: companyId },
                include: { tax_rates: true }
            });
            const companyTaxRates = taxMaps.map(m => m.tax_rates).filter(Boolean);

            // 3. Create Receipt Lines & Update Stock
            for (const item of data.items) {
                if (!item.productId) throw new Error("Product ID is missing for one or more items.");

                // Resolve Tax ID from Rate if not provided
                let resolvedTaxId = (item as any).taxId || null;
                if (!resolvedTaxId && item.taxRate) {
                    const match = companyTaxRates.find(tr => Number(tr.rate) === Number(item.taxRate));
                    if (match) resolvedTaxId = match.id;
                }

                // Handle Batch (Create if new, or find)
                let batchId = null;
                if (item.batch) {
                    // Try find
                    const existingBatch = await tx.hms_product_batch.findFirst({
                        where: {
                            company_id: companyId,
                            product_id: item.productId,
                            batch_no: item.batch
                        }
                    });

                    if (existingBatch) {
                        batchId = existingBatch.id;
                        // Update MRP/Cost if changed? optional.
                    } else {
                        // Safe Expiry Parse
                        let validExpiry = null;
                        if (item.expiry) {
                            const d = new Date(item.expiry);
                            if (!isNaN(d.getTime())) validExpiry = d;
                        }

                        const newBatch = await tx.hms_product_batch.create({
                            data: {
                                tenant_id: session.user.tenantId!,
                                company_id: companyId!,
                                product_id: item.productId,
                                batch_no: item.batch,
                                expiry_date: validExpiry,
                                mrp: item.mrp || 0,
                                cost: item.unitPrice || 0,
                                sale_price: item.salePrice,
                                margin_percentage: item.marginPct,
                                markup_percentage: item.markupPct,
                                pricing_strategy: item.pricingStrategy,
                                qty_on_hand: 0 // Ledger will update calculation usually, or we initialize
                            }
                        });
                        batchId = newBatch.id;
                    }
                }

                // A. Create Receipt Line (Using Raw SQL to bypass Prisma null constraint issues)
                const poLineIdVal = item.poLineId || null;
                const batchIdVal = batchId || null;

                await tx.$executeRaw`
                    INSERT INTO "hms_purchase_receipt_line" (
                        "id", 
                        "tenant_id", 
                        "company_id", 
                        "receipt_id", 
                        "product_id", 
                        "po_line_id",
                        "qty", 
                        "unit_price", 
                        "batch_id",
                        "location_id",
                        "metadata", 
                        "created_at"
                    ) VALUES (
                        gen_random_uuid(),
                        ${session.user.tenantId}::uuid,
                        ${companyId}::uuid,
                        ${receipt.id}::uuid,
                        ${item.productId}::uuid,
                        ${poLineIdVal}::uuid,
                        ${Number(item.qtyReceived) || 0},
                        ${Number(item.unitPrice) || 0},
                        ${batchIdVal}::uuid,
                        ${defaultLocation.id}::uuid,
                        ${JSON.stringify({
                    batch: item.batch,
                    expiry: item.expiry,
                    mrp: item.mrp,
                    sale_price: item.salePrice,
                    margin_pct: item.marginPct,
                    markup_pct: item.markupPct,
                    pricing_strategy: item.pricingStrategy,
                    mrp_discount_pct: item.mrpDiscountPct,
                    tax: {
                        id: resolvedTaxId,
                        rate: item.taxRate || 0,
                        amount: item.taxAmount || 0
                    },
                    hsn: item.hsn,
                    packing: item.packing,
                    // UOM data
                    purchase_uom: item.purchaseUOM,
                    base_uom: item.baseUOM,
                    conversion_factor: item.conversionFactor,
                    sale_price_per_unit: item.salePricePerUnit,
                    discount_pct: item.discountPct,
                    discount_amt: item.discountAmt,
                    scheme_discount: item.schemeDiscount,
                    free_qty: item.freeQty
                })}::jsonb,
                        NOW()
                    )
                `;

                // B. Convert UOM to Base for Stock Tracking
                const billedQty = Number(item.qtyReceived) || 0;
                const freeQty = Number(item.freeQty) || 0;
                const totalQty = billedQty + freeQty;

                let stockQty = totalQty;

                // DERIVE CONVERSION FACTOR
                let effectiveConversion = item.conversionFactor || 1;
                const effectiveUOM = (item.purchaseUOM || 'PCS').toUpperCase();

                if (effectiveConversion === 1 && effectiveUOM !== 'PCS') {
                    // 1. Try PACK-10, BOX-15 patterns
                    const packMatch = effectiveUOM.match(/(?:PACK|BOX|STRIP|TRAY)-(\d+)/i);
                    // 2. Try 10S, 10'S, 10X1 patterns
                    const simpleMatch = effectiveUOM.match(/^(\d+)(?:'S|S|X\d+|X)?$/i);

                    if (packMatch) {
                        effectiveConversion = parseInt(packMatch[1]);
                    } else if (simpleMatch) {
                        effectiveConversion = parseInt(simpleMatch[1]);
                    } else if (effectiveUOM === 'STRIP') {
                        effectiveConversion = 10;
                    } else if (effectiveUOM === 'BOX') {
                        effectiveConversion = 1; // Default to 1 if no number
                    }

                    // 3. Fallback: Check packing string if UOM didn't yield anything
                    if (effectiveConversion === 1 && item.packing) {
                        const packMatch2 = item.packing.match(/^(\d+)/);
                        if (packMatch2) effectiveConversion = parseInt(packMatch2[1]);
                    }
                }

                let avgCostPerBaseUnit = billedQty > 0 ? (billedQty * (Number(item.unitPrice) || 0)) / (totalQty * effectiveConversion) : 0;

                // Adjust stock qty by conversion factor
                if (effectiveConversion > 1) {
                    stockQty = totalQty * effectiveConversion;
                    console.log(`[UOM Conversion] ${totalQty} (Incl. ${freeQty} free) ${effectiveUOM} = ${stockQty} Units @ ₹${avgCostPerBaseUnit.toFixed(2)} per Unit`);
                }

                // C. Create Stock Ledger Entry (Inward) - Using BASE units
                await tx.hms_product_stock_ledger.create({
                    data: {
                        tenant_id: session.user.tenantId!,
                        company_id: companyId!,
                        product_id: item.productId,
                        location: defaultLocation.id, // Schema uses 'location' (string)
                        movement_type: 'in',
                        change_qty: stockQty, // ← Stock tracked in BASE units (PCS)
                        balance_qty: 0, // Placeholder, strict balance requires calc
                        reference: receiptNumber,
                        cost: avgCostPerBaseUnit, // ← Average cost per BASE unit
                        batch_id: batchId,
                        created_at: new Date(),
                        metadata: {
                            related_type: 'purchase_receipt',
                            related_id: receipt.id,
                            unit_cost: avgCostPerBaseUnit,
                            // Store original purchase details
                            purchase_qty: item.qtyReceived,
                            purchase_uom: effectiveUOM,
                            conversion_factor: effectiveConversion
                        }
                    }
                })

                // D. Update Product with Tax Rate AND UOM Pricing Data
                if (item.taxRate || item.salePrice) {
                    const currentProduct = await tx.hms_product.findUnique({
                        where: { id: item.productId },
                        select: { metadata: true, price: true }
                    });

                    // Extract UOM and calculate conversion factor
                    const purchaseUOM = effectiveUOM;
                    const conversionFactor = effectiveConversion;

                    // Calculate UOM pricing data for sales
                    const salePricePerPCS = item.salePrice && conversionFactor > 1
                        ? item.salePrice / conversionFactor
                        : item.salePrice;
                    const salePricePerPack = item.salePrice || null;

                    console.log('💰 SAVING UOM PRICING:', {
                        product: item.productId,
                        purchaseUOM: purchaseUOM,
                        conversionFactor: conversionFactor,
                        salePricePerPack,
                        salePricePerPCS
                    });

                    await tx.hms_product.update({
                        where: { id: item.productId },
                        data: {
                            // Update base price (per PCS) and COST
                            price: salePricePerPCS || currentProduct?.price,
                            default_cost: avgCostPerBaseUnit, // Update Last Buy Cost
                            metadata: {
                                ...(currentProduct?.metadata as any || {}),
                                purchase_tax_id: resolvedTaxId,
                                purchase_tax_rate: item.taxRate,
                                tax: { id: resolvedTaxId, rate: item.taxRate },
                                last_purchase_date: new Date().toISOString(),
                                // UOM Pricing Data (Industry Standard)
                                uom_data: {
                                    base_uom: 'PCS',
                                    base_price: salePricePerPCS, // Price per PCS
                                    conversion_factor: conversionFactor, // e.g., 10 for PACK-10
                                    pack_uom: purchaseUOM, // e.g., PACK-10
                                    pack_price: salePricePerPack, // Price per pack
                                    pack_size: conversionFactor // Same as conversion factor
                                }
                            }
                        }
                    });
                }

                // D. Update Main Product Stock (Synced from Ledger)
                const existingStock = await tx.hms_stock_levels.findFirst({
                    where: {
                        company_id: companyId,
                        product_id: item.productId,
                        location_id: defaultLocation.id
                    }
                });

                if (existingStock) {
                    await tx.hms_stock_levels.update({
                        where: { id: existingStock.id },
                        data: {
                            quantity: { increment: stockQty }
                        }
                    });
                } else {
                    await tx.hms_stock_levels.create({
                        data: {
                            tenant_id: session.user.tenantId!,
                            company_id: companyId!,
                            product_id: item.productId,
                            location_id: defaultLocation.id,
                            quantity: stockQty
                        }
                    });
                }
            }

            // 4. Update PO Status if linked
            if (data.purchaseOrderId) {
                // Simple logic: Mark as 'received' if linked. Real logic needs to check if ALL items fully received.
                // For now, we'll set to 'partially_received' or 'received' based on manual check or just leave it.
                // Let's set it to 'partially_received' as safe default.
                await tx.hms_purchase_order.update({
                    where: { id: data.purchaseOrderId },
                    data: { status: hms_purchase_status.partially_received }
                })
            }

            // 6. AUTO-CREATE PURCHASE INVOICE (Bill)
            // This ensures the receipt appears in the "Payments" module as a payable bill.

            // Calculate Totals
            let invoiceSubtotal = 0;
            let invoiceTaxTotal = 0;

            const invoiceLinesData = data.items.map(item => {
                const qty = Number(item.qtyReceived) || 0;
                const price = Number(item.unitPrice) || 0;
                const tax = Number(item.taxAmount) || 0;
                const discount = (Number(item.discountAmt) || 0) + (Number(item.schemeDiscount) || 0);

                const lineTotal = (qty * price) - discount + tax;
                const taxable = (qty * price) - discount;

                invoiceSubtotal += taxable;
                invoiceTaxTotal += tax;

                // Resolve Tax ID again for the invoice line (could pass it through but simpler to re-find in this map context)
                const lineResolvedTaxId = companyTaxRates.find(tr => Number(tr.rate) === Number(item.taxRate))?.id || null;

                return {
                    tenant_id: session.user.tenantId!,
                    company_id: companyId!,
                    product_id: item.productId,
                    description: "Auto-created from Receipt",
                    qty: qty,
                    unit_price: price,
                    tax: { id: lineResolvedTaxId, rate: item.taxRate, amount: tax },
                    line_total: lineTotal
                };
            });

            const invoiceGrandTotal = invoiceSubtotal + invoiceTaxTotal;

            // Create Invoice Header
            const newInvoice = await tx.hms_purchase_invoice.create({
                data: {
                    tenant_id: session.user.tenantId!,
                    company_id: companyId!,
                    supplier_id: data.supplierId,
                    purchase_order_id: data.purchaseOrderId,
                    name: data.reference || receiptNumber.replace('GRN', 'BILL'),
                    invoice_date: data.receivedDate,
                    due_date: data.receivedDate,
                    status: 'posted',
                    currency: 'INR',
                    subtotal: invoiceSubtotal,
                    tax_total: invoiceTaxTotal,
                    total_amount: invoiceGrandTotal,
                    paid_amount: 0,
                    metadata: {
                        source_receipt_id: receipt.id,
                        notes: data.notes
                    }
                }
            });

            // Create Invoice Lines
            for (const line of invoiceLinesData) {
                await tx.hms_purchase_invoice_line.create({
                    data: {
                        ...line,
                        invoice_id: newInvoice.id
                    }
                });
            }

            return { receipt, invoiceId: newInvoice.id };
        })

        if (result.invoiceId) {
            // Trigger Accounting Post via INVOICE (Correct Workflow for AP)
            // This books: Dr Purchase Expense, Dr Input Tax, Cr Accounts Payable
            const accResult = await AccountingService.postPurchaseInvoice(result.invoiceId, session.user.id);

            if (!accResult.success) {
                console.error("Accounting Post Failed (Invoice):", accResult.error);
                return { success: true, data: result.receipt, warning: `Receipt & Bill created, but Accounting failed: ${accResult.error}` };
            }
        }

        revalidatePath('/hms/purchasing/receipts');
        revalidatePath('/hms/accounting/bills'); // Refresh bills page too
        return { success: true, data: result.receipt };

    } catch (error: any) {
        console.error("Failed to create receipt (Full Error):", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        return { error: error.message || "Failed to process receipt" }
    }
}

export async function getPurchaseReceipts() {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        const receipts = await prisma.hms_purchase_receipt.findMany({
            where: {
                company_id: session.user.companyId
            },
            include: {
                hms_supplier: {
                    select: { name: true }
                },
                hms_purchase_receipt_line: true
            },
            orderBy: { created_at: 'desc' }
        });

        return {
            success: true,
            data: receipts.map(r => {
                const totalAmount = r.hms_purchase_receipt_line.reduce((sum, line) => {
                    const meta = line.metadata as any || {};
                    const lineTotal = (Number(line.qty) * Number(line.unit_price)) + (Number(meta.tax_amount) || 0);
                    return sum + lineTotal;
                }, 0);

                return {
                    id: r.id,
                    number: r.name,
                    date: r.receipt_date,
                    supplierName: r.hms_supplier?.name || "Unknown",
                    reference: (r.metadata as any)?.reference || 'N/A',
                    itemCount: r.hms_purchase_receipt_line.length,
                    totalAmount: Number(totalAmount.toFixed(2)),
                    status: r.status
                };
            })
        };
    } catch (error) {
        console.error("Failed to fetch receipts:", error);
        return { error: "Failed to load receipts." };
    }
}

export async function getPurchaseReceipt(id: string) {
    console.log("getPurchaseReceipt called with ID:", id);
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        if (!id || id.length < 10) return { error: "Invalid Receipt ID" };

        // 1. Fetch Receipt & Lines (NO nested product include)
        const receipt = await prisma.hms_purchase_receipt.findUnique({
            where: {
                id,
                company_id: session.user.companyId
            },
            include: {
                hms_supplier: true,
                hms_purchase_receipt_line: true
            }
        });

        console.log("getPurchaseReceipt DB Result:", receipt ? "Found" : "Not Found");

        if (!receipt) return { error: `Receipt not found for ID: ${id}` };

        // 2. Fetch Products manually to avoid missing relation issues
        const productIds = receipt.hms_purchase_receipt_line
            .map(line => line.product_id)
            .filter(Boolean); // Filter nulls if any

        const products = await prisma.hms_product.findMany({
            where: {
                id: { in: productIds }
            },
            select: { id: true, name: true }
        });

        const productMap = new Map(products.map(p => [p.id, p.name]));

        // Helper for safe numbers (handles Decimal, null, undefined)
        const safeNum = (val: any) => {
            if (val === null || val === undefined) return 0;
            const n = Number(val);
            return isNaN(n) ? 0 : n;
        };

        const mappedData = {
            id: receipt.id,
            number: receipt.name,
            date: receipt.receipt_date,
            supplierId: receipt.supplier_id,
            supplierName: receipt.hms_supplier?.name || "Unknown",
            reference: (receipt.metadata as any)?.reference || '',
            notes: (receipt.metadata as any)?.notes || '',
            attachmentUrl: (receipt.metadata as any)?.attachment_url || (receipt.metadata as any)?.attachmentUrl || '',
            items: receipt.hms_purchase_receipt_line.map(line => {
                const meta = line.metadata as any || {};
                return {
                    id: line.id,
                    productId: line.product_id,
                    productName: productMap.get(line.product_id) || "Unknown",
                    qty: safeNum(line.qty),
                    unitPrice: safeNum(line.unit_price),
                    batch: meta.batch || '',
                    batchId: line.batch_id,
                    expiry: meta.expiry || '',
                    mrp: safeNum(meta.mrp),
                    salePrice: safeNum(meta.sale_price),
                    marginPct: safeNum(meta.margin_pct),
                    markupPct: safeNum(meta.markup_pct),
                    pricingStrategy: meta.pricing_strategy || 'manual',
                    mrpDiscountPct: safeNum(meta.mrp_discount_pct),
                    pack: meta.packing || meta.purchase_uom || '',
                    taxRate: safeNum(meta.tax_rate),
                    hsn: meta.hsn || ''
                };
            })
        };

        // Aggressive serialization
        return { success: true, data: JSON.parse(JSON.stringify(mappedData)) };

    } catch (error: any) {
        console.error("Critical Error in getPurchaseReceipt:", error);
        return { error: `Load Error: ${error.message}` };
    }
}

export async function updatePurchaseReceipt(id: string, data: PurchaseReceiptData) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    // Validate sale price for all items
    for (const item of data.items) {
        // 1. Sale price is required
        if (!item.salePrice || item.salePrice <= 0) {
            return { error: "Sale price is required for all items and must be greater than 0." };
        }

        // 2. Sale price should not be greater than MRP
        if (item.mrp && item.salePrice > item.mrp) {
            return { error: `Sale price (${item.salePrice}) cannot be greater than MRP (${item.mrp}).` };
        }

        // 3. Sale price should not be less than net cost (unit price)
        if (item.unitPrice && item.salePrice < item.unitPrice) {
            return { error: `Sale price (${item.salePrice}) cannot be less than net cost/unit price (${item.unitPrice}).` };
        }
    }

    try {
        await prisma.hms_purchase_receipt.update({
            where: { id, company_id: session.user.companyId },
            data: {
                supplier_id: data.supplierId,
                receipt_date: data.receivedDate,
                metadata: {
                    reference: data.reference,
                    notes: data.notes,
                    attachment_url: data.attachmentUrl
                }
            }
        });

        // Fetch company tax rates to resolve IDs for metadata
        const taxMaps = await prisma.company_tax_maps.findMany({
            where: { company_id: session.user.companyId },
            include: { tax_rates: true }
        });
        const companyTaxRates = taxMaps.map(m => m.tax_rates).filter(Boolean);

        for (const item of data.items) {
            // Resolve Tax ID from Rate
            let resolvedTaxId = (item as any).taxId || null;
            if (!resolvedTaxId && item.taxRate) {
                const match = companyTaxRates.find(tr => Number(tr.rate) === Number(item.taxRate));
                if (match) resolvedTaxId = match.id;
            }

            if ((item as any).id) {
                await prisma.hms_purchase_receipt_line.update({
                    where: { id: (item as any).id },
                    data: {
                        unit_price: item.unitPrice,
                        metadata: {
                            batch: item.batch,
                            expiry: item.expiry,
                            mrp: item.mrp,
                            sale_price: item.salePrice,
                            margin_pct: item.marginPct,
                            markup_pct: item.markupPct,
                            pricing_strategy: item.pricingStrategy,
                            mrp_discount_pct: item.mrpDiscountPct,
                            tax: {
                                id: resolvedTaxId,
                                rate: item.taxRate || 0,
                                amount: item.taxAmount || 0
                            },
                            hsn: item.hsn,
                            packing: item.packing,
                            // UOM data
                            purchase_uom: item.purchaseUOM,
                            base_uom: item.baseUOM,
                            conversion_factor: item.conversionFactor,
                            sale_price_per_unit: item.salePricePerUnit
                        }
                    }
                });

                // Update Product Tax Rate (GST Compliance: Sale tax = Purchase tax)
                if (item.productId && item.taxRate) {
                    const currentProduct = await prisma.hms_product.findUnique({
                        where: { id: item.productId },
                        select: { metadata: true }
                    });

                    await prisma.hms_product.update({
                        where: { id: item.productId },
                        data: {
                            metadata: {
                                ...(currentProduct?.metadata as any || {}),
                                purchase_tax_id: resolvedTaxId,
                                purchase_tax_rate: item.taxRate,
                                tax: { id: resolvedTaxId, rate: item.taxRate },
                                last_purchase_date: new Date().toISOString()
                            }
                        }
                    });
                }
            }
        }

        revalidatePath('/hms/purchasing/receipts');
        return { success: true };
    } catch (error) {
        console.error("Failed to update receipt:", error);
        return { error: "Failed to update receipt." };
    }
}
