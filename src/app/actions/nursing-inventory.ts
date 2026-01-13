'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type ConsumeStockData = {
    productId: string
    quantity: number
    patientId: string
    encounterId: string
    notes?: string
}

export async function consumeStock(data: ConsumeStockData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    const { companyId, tenantId, id: userId } = session.user
    if (!companyId || !tenantId) return { error: "Review Account Settings: No Company/Tenant ID" }

    if (!data.productId || data.quantity <= 0) {
        return { error: "Invalid Data: Product and Quantity required" }
    }

    try {
        // 1. Find Location (Main Warehouse for now)
        // Ideally, this should come from the user's assigned "Station" (Nursing Station A, etc.)
        // We will default to the Main Warehouse or the first available warehouse.
        const location = await prisma.hms_stock_location.findFirst({
            where: {
                company_id: companyId,
                OR: [
                    { code: 'WH-MAIN' },
                    { location_type: 'warehouse' }
                ]
            }
        })

        if (!location) {
            return { error: "Configuration Error: No Stock Location found (Warehouse)" }
        }

        const locationId = location.id

        // 2. Transaction
        await prisma.$transaction(async (tx) => {
            // A. Verify Product
            const product = await tx.hms_product.findUnique({
                where: { id: data.productId }
            })
            if (!product) throw new Error("Product not found")

            // B. Create Stock Move (Outbound)
            // We use move_type: 'out' (assuming 'in'/'out' enum convention based on receipt logic)
            // If enum fails, we will know.
            await tx.hms_stock_move.create({
                data: {
                    tenant_id: tenantId,
                    company_id: companyId,
                    product_id: data.productId,
                    location_from: locationId, // From Warehouse
                    location_to: null, // Consumed (gone)
                    qty: data.quantity,
                    uom: product.uom,
                    move_type: 'out', // Outbound
                    source: 'Nursing Consumption',
                    source_reference: data.encounterId, // Link to Encounter ID
                    created_by: userId
                }
            })

            // C. Create Stock Ledger (History)
            await tx.hms_stock_ledger.create({
                data: {
                    tenant_id: tenantId,
                    company_id: companyId,
                    product_id: data.productId,
                    movement_type: 'out',
                    qty: data.quantity, // Negative or Positive? Usually ledger stores quantity magnitude and type indicates direction.
                    // However, for aggregations, signed values are easier. 
                    // Let's look at `inventory.ts` line 764: it sums `quantity` from `hms_stock_levels`.
                    // Ledger is usually just a log.
                    // Let's store positive quantity here as movement_type 'out' handles the semantic.
                    uom: product.uom,
                    from_location_id: locationId,
                    reference: `Patient: ${data.patientId}`,
                    related_type: 'hms_encounter',
                    related_id: data.encounterId,
                    metadata: {
                        notes: data.notes,
                        patient_id: data.patientId
                    }
                }
            })

            // D. Decrement Stock Levels
            // We need to find the specific level record
            const level = await tx.hms_stock_levels.findFirst({
                where: {
                    tenant_id: tenantId,
                    company_id: companyId,
                    product_id: data.productId,
                    location_id: locationId
                }
            })

            if (level) {
                // Determine new quantity
                // We should prevent negative stock? Or allow it? 
                // Many systems allow negative stock if configured. We'll allow it but maybe warn.
                await tx.hms_stock_levels.update({
                    where: { id: level.id },
                    data: {
                        quantity: { decrement: data.quantity },
                        updated_at: new Date()
                    }
                })
            } else {
                // If no level exists, we create one with negative quantity (assuming consumption before receipt possibilities)
                await tx.hms_stock_levels.create({
                    data: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        product_id: data.productId,
                        location_id: locationId,
                        quantity: -data.quantity, // Negative
                        reserved: 0
                    }
                })
            }

            // OPTIONAL: Add to Billing?
            // This would require creating a `hms_bill_item` or similar.
            // For now, we just record inventory usage.
        })

        revalidatePath('/hms/nursing/dashboard')
        revalidatePath('/hms/nursing/inventory/usage')

        return { success: true }
    } catch (error: any) {
        console.error("Consume Stock Error:", error)
        return { error: error.message || "Failed to record usage" }
    }
}

export type ConsumptionItem = {
    productId: string
    quantity: number
    notes?: string
}

export type ConsumeBulkData = {
    items: ConsumptionItem[]
    patientId: string
    encounterId: string
}

export async function consumeStockBulk(data: ConsumeBulkData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    const { companyId, tenantId, id: userId } = session.user
    if (!companyId || !tenantId) return { error: "Review Account Settings: No Company/Tenant ID" }

    if (!data.items || data.items.length === 0) {
        return { error: "No items to record" }
    }

    try {
        const location = await prisma.hms_stock_location.findFirst({
            where: {
                company_id: companyId,
                OR: [
                    { code: 'WH-MAIN' },
                    { location_type: 'warehouse' }
                ]
            }
        })

        if (!location) {
            return { error: "Configuration Error: No Stock Location found (Warehouse)" }
        }

        const locationId = location.id

        // Fetch Product Details deeply for both Inventory and Billing
        const productMap = new Map();
        const productIds = data.items.map(i => i.productId);
        const products = await prisma.hms_product.findMany({
            where: { id: { in: productIds } },
            include: {
                hms_product_price_history: {
                    orderBy: { valid_from: 'desc' },
                    take: 1
                }
            }
        });
        products.forEach(p => productMap.set(p.id, p));

        await prisma.$transaction(async (tx) => {
            // ---------------------------------------------------------
            // 1. INVENTORY MOVEMENT
            // ---------------------------------------------------------
            for (const item of data.items) {
                if (item.quantity <= 0) continue

                const product = productMap.get(item.productId);
                if (!product) throw new Error(`Product ID ${item.productId} not found`)

                // Create Stock Move
                await tx.hms_stock_move.create({
                    data: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        product_id: item.productId,
                        location_from: locationId, // From Warehouse
                        location_to: null, // Consumed (gone)
                        qty: item.quantity,
                        uom: product.uom || 'Unit',
                        move_type: 'out',
                        source: 'Nursing Consumption',
                        source_reference: data.encounterId,
                        created_by: userId
                    }
                })

                // Create Stock Ledger
                await tx.hms_stock_ledger.create({
                    data: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        product_id: item.productId,
                        movement_type: 'out',
                        qty: item.quantity,
                        uom: product.uom || 'Unit',
                        from_location_id: locationId,
                        reference: `Patient: ${data.patientId}`,
                        related_type: 'hms_encounter',
                        related_id: data.encounterId,
                        metadata: {
                            notes: item.notes,
                            patient_id: data.patientId
                        }
                    }
                })

                // Update Stock Levels
                const level = await tx.hms_stock_levels.findFirst({
                    where: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        product_id: item.productId,
                        location_id: locationId
                    }
                })

                if (level) {
                    await tx.hms_stock_levels.update({
                        where: { id: level.id },
                        data: {
                            quantity: { decrement: item.quantity },
                            updated_at: new Date()
                        }
                    })
                } else {
                    await tx.hms_stock_levels.create({
                        data: {
                            tenant_id: tenantId,
                            company_id: companyId,
                            product_id: item.productId,
                            location_id: locationId,
                            quantity: -item.quantity,
                            reserved: 0
                        }
                    })
                }
            }

            // ---------------------------------------------------------
            // 2. BILLING INTEGRATION (Create/Update Invoice)
            // ---------------------------------------------------------

            // Find existing DRAFT invoice for this encounter
            let invoice = await tx.hms_invoice.findFirst({
                where: {
                    company_id: companyId,
                    appointment_id: data.encounterId,
                    status: 'draft'
                }
            });

            // If no draft invoice exists, create one
            if (!invoice) {
                // Generate Invoice Number (Simplified logic for now, standard is handy)
                const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
                const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                const invoiceNumber = `INV-${dateStr}-${randomSuffix}`;

                invoice = await tx.hms_invoice.create({
                    data: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        patient_id: data.patientId,
                        appointment_id: data.encounterId,
                        invoice_number: invoiceNumber,
                        invoice_date: new Date(),
                        status: 'draft',
                        currency: 'INR',
                        total: 0,
                        subtotal: 0,
                        total_tax: 0,
                        outstanding_amount: 0,
                        created_by: userId
                    }
                });
            }

            // Get current max line index
            const maxLine = await tx.hms_invoice_lines.aggregate({
                where: { invoice_id: invoice.id },
                _max: { line_idx: true }
            });
            let nextLineIdx = (maxLine._max.line_idx || 0) + 1;

            // Add new lines
            let addedTotal = 0;

            for (const item of data.items) {
                const product = productMap.get(item.productId);
                if (!product) continue;

                // Determine Price (Priority: Price History > Base Price > 0)
                const price = product.hms_product_price_history?.[0]?.price?.toNumber() || Number(product.price) || 0;
                const netAmount = price * item.quantity;

                await tx.hms_invoice_lines.create({
                    data: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        invoice_id: invoice.id,
                        line_idx: nextLineIdx++,
                        product_id: product.id,
                        description: `(Nursing) ${product.name}`,
                        quantity: item.quantity,
                        unit_price: price,
                        net_amount: netAmount,
                        check_in_at: new Date()
                    }
                });

                addedTotal += netAmount;
            }

            // Update Invoice Totals based on ALL lines (active aggregation for safety)
            // We re-aggregate to ensure the invoice total strictly reflects all lines including previous ones.
            const agg = await tx.hms_invoice_lines.aggregate({
                where: { invoice_id: invoice.id },
                _sum: { net_amount: true, tax_amount: true }
            });

            const newSubtotal = Number(agg._sum.net_amount || 0);
            const newTax = Number(agg._sum.tax_amount || 0);
            const newTotal = newSubtotal + newTax; // Discount handled separately if needed, simplified here

            await tx.hms_invoice.update({
                where: { id: invoice.id },
                data: {
                    subtotal: newSubtotal,
                    total_tax: newTax,
                    total: newTotal,
                    outstanding_amount: newTotal, // Assuming no partial payments on draft yet
                    updated_at: new Date()
                }
            });

        })

        revalidatePath('/hms/nursing/dashboard')
        revalidatePath('/hms/nursing/inventory/usage')
        // Revalidate billing so Cashier sees the update
        revalidatePath('/hms/billing')

        return { success: true }
    } catch (error: any) {
        console.error("Consume Bulk Stock Error:", error)
        return { error: error.message || "Failed to record usage" }
    }
}
