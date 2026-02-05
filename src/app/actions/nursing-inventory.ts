'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { hms_invoice_status, hms_move_type, hms_location_type } from "@prisma/client"

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
        // 1. Find Location (Robust Lookup)
        // 1. Find Location (Robust Lookup with explicit type casting)
        const locations: any[] = await prisma.$queryRaw`
            SELECT id, tenant_id, company_id, name, code, location_type::text as location_type 
            FROM hms_stock_location 
            WHERE company_id::text = ${companyId}
            AND (code = 'WH-MAIN' OR location_type::text = 'warehouse')
            LIMIT 1
        `;

        let location = locations[0];

        // Fallback: Find ANY location
        if (!location) {
            const anyLoc: any[] = await prisma.$queryRaw`
                SELECT id, tenant_id, company_id, name, code, location_type::text as location_type 
                FROM hms_stock_location 
                WHERE company_id::text = ${companyId}
                LIMIT 1
            `;
            location = anyLoc[0];
        }

        // Final Fallback: Create Default Location
        if (!location) {
            const createdArr: any[] = await prisma.$queryRaw`
                INSERT INTO hms_stock_location (
                    id, tenant_id, company_id, name, code, location_type
                ) VALUES (
                    gen_random_uuid(),
                    CAST(${tenantId} AS uuid),
                    CAST(${companyId} AS uuid),
                    'Main Warehouse',
                    'WH-MAIN',
                    'warehouse'::hms_location_type
                )
                RETURNING *
            `;
            location = createdArr[0];
        }

        const locationId = location.id
        if (!locationId) return { error: "Stock Location not found or could not be created" }

        // 2. Transaction
        await prisma.$transaction(async (tx) => {
            // A. Verify Product
            const product = await tx.hms_product.findUnique({
                where: { id: data.productId }
            })
            if (!product) throw new Error("Product not found")

            // B. Create Stock Move (Outbound)
            await tx.$executeRaw`
                INSERT INTO hms_stock_move (
                    id, tenant_id, company_id, product_id, 
                    location_from, location_to, qty, uom, 
                    move_type, source, source_reference, created_by
                ) VALUES (
                    gen_random_uuid(),
                    CAST(${tenantId} AS uuid),
                    CAST(${companyId} AS uuid),
                    CAST(${data.productId} AS uuid),
                    CAST(${locationId || null} AS uuid),
                    NULL,
                    ${data.quantity},
                    ${product.uom || 'Unit'},
                    'out'::hms_move_type,
                    'Nursing Consumption',
                    CAST(${data.encounterId || null} AS uuid),
                    CAST(${userId || null} AS uuid)
                )
            `;

            // C. Create Stock Ledger (History)
            await tx.$executeRaw`
                INSERT INTO hms_stock_ledger (
                    id, tenant_id, company_id, product_id,
                    related_type, related_id, movement_type,
                    qty, uom, from_location_id, reference, metadata
                ) VALUES (
                    gen_random_uuid(),
                    CAST(${tenantId} AS uuid),
                    CAST(${companyId} AS uuid),
                    CAST(${data.productId} AS uuid),
                    'hms_encounter',
                    CAST(${data.encounterId || null} AS uuid),
                    'out',
                    ${data.quantity},
                    ${product.uom || 'Unit'},
                    CAST(${locationId || null} AS uuid),
                    ${`Patient: ${data.patientId}`},
                    ${JSON.stringify({ notes: data.notes || '', patient_id: data.patientId })}::jsonb
                )
            `;

            // D. Update/Create Stock Levels (Manual Raw UPSERT logic)
            const levels: any[] = await tx.$queryRaw`
                SELECT id FROM hms_stock_levels 
                WHERE tenant_id = CAST(${tenantId} AS uuid)
                AND company_id = CAST(${companyId} AS uuid)
                AND product_id = CAST(${data.productId} AS uuid)
                AND location_id = CAST(${locationId} AS uuid)
                AND batch_id IS NULL
                LIMIT 1
            `;

            if (levels.length > 0) {
                // Update existing
                await tx.$executeRaw`
                    UPDATE hms_stock_levels 
                    SET quantity = quantity - CAST(${data.quantity} AS numeric),
                        updated_at = NOW()
                    WHERE id = ${levels[0].id}
                `;
            } else {
                // Insert new
                await tx.$executeRaw`
                    INSERT INTO hms_stock_levels (
                        id, tenant_id, company_id, product_id, location_id, quantity, updated_at, reserved
                    ) VALUES (
                        gen_random_uuid(),
                        CAST(${tenantId} AS uuid),
                        CAST(${companyId} AS uuid),
                        CAST(${data.productId} AS uuid),
                        CAST(${locationId} AS uuid),
                        CAST(${-data.quantity} AS numeric),
                        NOW(),
                        0
                    )
                `;
            }
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
        // 1. Find Location (Robust Lookup)
        // 1. Find Location (Robust Lookup with explicit type casting)
        const locations: any[] = await prisma.$queryRaw`
            SELECT id, tenant_id, company_id, name, code, location_type::text as location_type 
            FROM hms_stock_location 
            WHERE company_id::text = ${companyId}
            AND (code = 'WH-MAIN' OR location_type::text = 'warehouse')
            LIMIT 1
        `;

        let location = locations[0];

        // Fallback: Find ANY location
        if (!location) {
            const anyLoc: any[] = await prisma.$queryRaw`
                SELECT id, tenant_id, company_id, name, code, location_type::text as location_type 
                FROM hms_stock_location 
                WHERE company_id::text = ${companyId}
                LIMIT 1
            `;
            location = anyLoc[0];
        }

        // Final Fallback: Create Default Location
        if (!location) {
            const createdArr: any[] = await prisma.$queryRaw`
                INSERT INTO hms_stock_location (
                    id, tenant_id, company_id, name, code, location_type
                ) VALUES (
                    gen_random_uuid(),
                    CAST(${tenantId} AS uuid),
                    CAST(${companyId} AS uuid),
                    'Main Warehouse',
                    'WH-MAIN',
                    'warehouse'::hms_location_type
                )
                RETURNING *
            `;
            location = createdArr[0];
        }

        const locationId = location.id
        if (!locationId) return { error: "Stock Location not found or could not be created" }

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

                // Create Stock Move using Raw SQL for better error debugging
                await tx.$executeRaw`
                    INSERT INTO hms_stock_move (
                        id, tenant_id, company_id, product_id, 
                        location_from, location_to, qty, uom, 
                        move_type, source, source_reference, created_by
                    ) VALUES (
                        gen_random_uuid(),
                        CAST(${tenantId} AS uuid),
                        CAST(${companyId} AS uuid),
                        CAST(${item.productId} AS uuid),
                        CAST(${locationId || null} AS uuid),
                        NULL,
                        ${item.quantity},
                        ${product.uom || 'Unit'},
                        'out'::hms_move_type,
                        'Nursing Consumption',
                        CAST(${data.encounterId || null} AS uuid),
                        CAST(${userId || null} AS uuid)
                    )
                `;

                // Create Stock Ledger using Raw SQL
                await tx.$executeRaw`
                    INSERT INTO hms_stock_ledger (
                        id, tenant_id, company_id, product_id,
                        related_type, related_id, movement_type,
                        qty, uom, from_location_id, reference, metadata
                    ) VALUES (
                        gen_random_uuid(),
                        CAST(${tenantId} AS uuid),
                        CAST(${companyId} AS uuid),
                        CAST(${item.productId} AS uuid),
                        'hms_encounter',
                        CAST(${data.encounterId || null} AS uuid),
                        'out',
                        ${item.quantity},
                        ${product.uom || 'Unit'},
                        CAST(${locationId || null} AS uuid),
                        ${`Patient: ${data.patientId}`},
                        ${JSON.stringify({ notes: item.notes || '', patient_id: data.patientId })}::jsonb
                    )
                `;

                // Update/Create Stock Levels (Manual Raw UPSERT logic)
                const levels: any[] = await tx.$queryRaw`
                    SELECT id FROM hms_stock_levels 
                    WHERE tenant_id = CAST(${tenantId} AS uuid)
                    AND company_id = CAST(${companyId} AS uuid)
                    AND product_id = CAST(${item.productId} AS uuid)
                    AND location_id = CAST(${locationId} AS uuid)
                    AND batch_id IS NULL
                    LIMIT 1
                `;

                if (levels.length > 0) {
                    await tx.$executeRaw`
                        UPDATE hms_stock_levels 
                        SET quantity = quantity - CAST(${item.quantity} AS numeric),
                            updated_at = NOW()
                        WHERE id = ${levels[0].id}
                    `;
                } else {
                    await tx.$executeRaw`
                        INSERT INTO hms_stock_levels (
                            id, tenant_id, company_id, product_id, location_id, quantity, updated_at, reserved
                        ) VALUES (
                            gen_random_uuid(),
                            CAST(${tenantId} AS uuid),
                            CAST(${companyId} AS uuid),
                            CAST(${item.productId} AS uuid),
                            CAST(${locationId} AS uuid),
                            CAST(${-item.quantity} AS numeric),
                            NOW(),
                            0
                        )
                    `;
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
                    status: 'draft' as any
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
                        status: 'draft' as any,
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
                        metadata: { source: 'nursing_consumption' }
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
