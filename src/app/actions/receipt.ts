'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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
        taxRate?: number
        taxAmount?: number
        hsn?: string
        packing?: string
    }[]
}

export async function getPendingPurchaseOrders() {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    const pos = await prisma.hms_purchase_order.findMany({
        where: {
            company_id: session.user.companyId,
            status: { in: ['approved', 'partially_received'] }
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
            hms_purchase_order_line: {
                include: {
                    hms_product: true
                }
            }
        }
    });

    if (!po) return { error: "PO not found" };

    return {
        data: {
            id: po.id,
            supplierId: po.supplier_id,
            items: po.hms_purchase_order_line.map(line => ({
                poLineId: line.id,
                productId: line.product_id,
                productName: line.hms_product?.name || "Unknown Product",
                orderedQty: Number(line.qty),
                receivedQty: 0, // Default to 0 to let user fill
                pendingQty: Number(line.qty), // Simplified
                unitPrice: Number(line.unit_price)
            }))
        }
    };
}

export async function createPurchaseReceipt(data: PurchaseReceiptData) {
    const session = await auth()
    if (!session?.user?.companyId || !session?.user?.tenantId) return { error: "Unauthorized: Missing Company or Tenant ID. Please relogin." }
    const companyId = session.user.companyId;

    if (!data.supplierId) return { error: "Supplier is required." }
    if (!data.items || data.items.length === 0) return { error: "Receipt must have items" }

    console.log("createPurchaseReceipt payload:", JSON.stringify(data, null, 2));

    try {
        // 0. CHECK FOR DUPLICATES (Supplier + Reference)
        if (data.reference) {
            // Simplify duplicate check: Fetch recent receipts for this supplier and check implementation in JS
            // This avoids potential issues with Prisma JSON filtering syntax in some environments
            const recentReceipts = await prisma.hms_purchase_receipt.findMany({
                where: {
                    company_id: session.user.companyId,
                    supplier_id: data.supplierId,
                },
                select: { metadata: true }
            });

            const existing = recentReceipts.find(r => (r.metadata as any)?.reference === data.reference);

            if (existing) {
                return { error: `Duplicate: Invoice '${data.reference}' has already been recorded for this supplier.` };
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
                    status: 'received',
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

            // 3. Create Receipt Lines & Update Stock
            for (const item of data.items) {
                if (!item.productId) throw new Error("Product ID is missing for one or more items.");

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
                    tax_rate: item.taxRate,
                    tax_amount: item.taxAmount,
                    hsn: item.hsn,
                    packing: item.packing
                })}::jsonb,
                        NOW()
                    )
                `;

                // B. Create Stock Ledger Entry (Inward)
                await tx.hms_product_stock_ledger.create({
                    data: {
                        tenant_id: session.user.tenantId!,
                        company_id: companyId!,
                        product_id: item.productId,
                        location: defaultLocation.id, // Schema uses 'location' (string)
                        movement_type: 'in',
                        change_qty: Number(item.qtyReceived) || 0, // Schema uses change_qty
                        balance_qty: 0, // Placeholder, strict balance requires calc
                        reference: receiptNumber,
                        cost: Number(item.unitPrice) || 0,
                        batch_id: batchId,
                        created_at: new Date(),
                        metadata: {
                            related_type: 'purchase_receipt',
                            related_id: receipt.id,
                            unit_cost: item.unitPrice
                        }
                    }
                })

                // C. Update Product with Purchase Tax Rate (GST Compliance: Sale tax = Purchase tax for local)
                if (item.taxRate) {
                    const currentProduct = await tx.hms_product.findUnique({
                        where: { id: item.productId },
                        select: { metadata: true }
                    });

                    await tx.hms_product.update({
                        where: { id: item.productId },
                        data: {
                            metadata: {
                                ...(currentProduct?.metadata as any || {}),
                                purchase_tax_rate: item.taxRate,
                                last_purchase_date: new Date().toISOString()
                            }
                        }
                    });
                }

                // D. Update Main Product Stock (Optional)
                // await tx.hms_stock_levels.upsert(...) - Skipping for now, relying on ledger
            }

            // 4. Update PO Status if linked
            if (data.purchaseOrderId) {
                // Simple logic: Mark as 'received' if linked. Real logic needs to check if ALL items fully received.
                // For now, we'll set to 'partially_received' or 'received' based on manual check or just leave it.
                // Let's set it to 'partially_received' as safe default.
                await tx.hms_purchase_order.update({
                    where: { id: data.purchaseOrderId },
                    data: { status: 'partially_received' }
                })
            }

            return receipt
        })

        revalidatePath('/hms/purchasing/receipts')
        return { success: true, data: result }

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
            data: receipts.map(r => ({
                id: r.id,
                number: r.name,
                date: r.receipt_date,
                supplierName: r.hms_supplier?.name || "Unknown",
                reference: (r.metadata as any)?.reference || 'N/A',
                itemCount: r.hms_purchase_receipt_line.length,
                status: r.status
            }))
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
            items: receipt.hms_purchase_receipt_line.map(line => {
                const meta = line.metadata as any || {};
                return {
                    id: line.id,
                    productId: line.product_id,
                    productName: productMap.get(line.product_id) || "Unknown",
                    qty: safeNum(line.qty),
                    unitPrice: safeNum(line.unit_price),
                    batch: meta.batch || '',
                    expiry: meta.expiry || '',
                    mrp: safeNum(meta.mrp),
                    pack: meta.packing || '',
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

        for (const item of data.items) {
            if ((item as any).id) {
                await prisma.hms_purchase_receipt_line.update({
                    where: { id: (item as any).id },
                    data: {
                        unit_price: item.unitPrice,
                        metadata: {
                            batch: item.batch,
                            expiry: item.expiry,
                            mrp: item.mrp,
                            tax_rate: item.taxRate,
                            tax_amount: item.taxAmount,
                            hsn: item.hsn,
                            packing: item.packing
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
                                purchase_tax_rate: item.taxRate,
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
