'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import crypto from 'crypto'

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
            WHERE company_id::text = CAST(${companyId} AS text)
            AND (code = 'WH-MAIN' OR location_type::text = 'warehouse')
            LIMIT 1
        `;

        let location = locations[0];

        // Fallback: Find ANY location
        if (!location) {
            const anyLoc: any[] = await prisma.$queryRaw`
                SELECT id, tenant_id, company_id, name, code, location_type::text as location_type 
                FROM hms_stock_location 
                WHERE company_id::text = CAST(${companyId} AS text)
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
                    'warehouse'
                )
                RETURNING *
            `;
            location = createdArr[0];
        }

        const locationId = location.id
        if (!locationId) return { error: "Stock Location not found or could not be created" }

        // 2. Transaction
        await prisma.$transaction(async (tx: any) => {
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
                    'out',
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
                SELECT id::text as id FROM hms_stock_levels 
                WHERE tenant_id::text = CAST(${tenantId} AS text)
                AND company_id::text = CAST(${companyId} AS text)
                AND product_id::text = CAST(${data.productId} AS text)
                AND location_id::text = CAST(${locationId} AS text)
                AND batch_id IS NULL
                LIMIT 1
            `;

            if (levels.length > 0) {
                // Update existing
                await tx.$executeRaw`
                    UPDATE hms_stock_levels 
                    SET quantity = quantity - CAST(${data.quantity} AS numeric),
                        updated_at = NOW()
                    WHERE id::text = CAST(${levels[0].id} AS text)
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
            WHERE company_id::text = CAST(${companyId} AS text)
            AND (code = 'WH-MAIN' OR location_type::text = 'warehouse')
            LIMIT 1
        `;

        let location = locations[0];

        // Fallback: Find ANY location
        if (!location) {
            const anyLoc: any[] = await prisma.$queryRaw`
                SELECT id, tenant_id, company_id, name, code, location_type::text as location_type 
                FROM hms_stock_location 
                WHERE company_id::text = CAST(${companyId} AS text)
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
                    'warehouse'
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
        const products = await (prisma as any).hms_product.findMany({
            where: { id: { in: productIds } },
            include: {
                hms_product_price_history: {
                    orderBy: { valid_from: 'desc' },
                    take: 1
                }
            }
        });
        products.forEach((p: any) => productMap.set(p.id, p));

        await prisma.$transaction(async (tx: any) => {
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
                        'out',
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
                    SELECT id::text as id FROM hms_stock_levels 
                    WHERE tenant_id::text = CAST(${tenantId} AS text)
                    AND company_id::text = CAST(${companyId} AS text)
                    AND product_id::text = CAST(${item.productId} AS text)
                    AND location_id::text = CAST(${locationId} AS text)
                    AND batch_id IS NULL
                    LIMIT 1
                `;

                if (levels.length > 0) {
                    await tx.$executeRaw`
                        UPDATE hms_stock_levels 
                        SET quantity = quantity - CAST(${item.quantity} AS numeric),
                            updated_at = NOW()
                        WHERE id::text = CAST(${levels[0].id} AS text)
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

            // Find existing DRAFT invoice for this encounter deeply with Raw SQL
            const invoices: any[] = await tx.$queryRaw`
                SELECT id::text FROM hms_invoice 
                WHERE company_id::text = CAST(${companyId} AS text)
                AND appointment_id::text = CAST(${data.encounterId} AS text)
                AND status::text = 'draft'
                LIMIT 1
            `;

            let invoiceId = invoices[0]?.id;

            // If no draft invoice exists, create one
            if (!invoiceId) {
                // Generate Invoice Number
                const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
                const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                const invoiceNumber = `INV-${dateStr}-${randomSuffix}`;

                invoiceId = crypto.randomUUID();

                await tx.$executeRaw`
                    INSERT INTO hms_invoice (
                        id, tenant_id, company_id, patient_id, appointment_id,
                        invoice_number, invoice_no, invoice_date, issued_at,
                        status, currency, total, subtotal, total_tax, 
                        outstanding_amount, outstanding, created_by
                    ) VALUES (
                        CAST(${invoiceId} AS uuid),
                        CAST(${tenantId} AS uuid),
                        CAST(${companyId} AS uuid),
                        CAST(${data.patientId} AS uuid),
                        CAST(${data.encounterId} AS uuid),
                        ${invoiceNumber},
                        ${invoiceNumber},
                        CURRENT_DATE,
                        NOW(),
                        'draft',
                        'INR',
                        0, 0, 0, 0, 0,
                        CAST(${userId} AS uuid)
                    )
                `;
            }

            // Get current max line index
            const lineIdxResult: any[] = await tx.$queryRaw`
                SELECT COALESCE(MAX(line_idx), 0) as max_idx 
                FROM hms_invoice_lines 
                WHERE invoice_id::text = CAST(${invoiceId} AS text)
            `;
            let nextLineIdx = Number(lineIdxResult[0].max_idx) + 1;

            for (const item of data.items) {
                const product = productMap.get(item.productId);
                if (!product) continue;

                // Determine Price (Priority: Price History > Base Price > 0)
                const price = product.hms_product_price_history?.[0]?.price?.toNumber() || Number(product.price) || 0;
                const netAmount = price * item.quantity;

                await tx.$executeRaw`
                    INSERT INTO hms_invoice_lines (
                        id, tenant_id, company_id, invoice_id, line_idx,
                        product_id, description, quantity, unit_price, net_amount, metadata
                    ) VALUES (
                        gen_random_uuid(),
                        CAST(${tenantId} AS uuid),
                        CAST(${companyId} AS uuid),
                        CAST(${invoiceId} AS uuid),
                        ${nextLineIdx++},
                        CAST(${product.id} AS uuid),
                        ${`(Nursing) ${product.name}`},
                        ${item.quantity},
                        ${price},
                        ${netAmount},
                        ${JSON.stringify({ source: 'nursing_consumption' })}::jsonb
                    )
                `;
            }

            // Update Invoice Totals based on ALL lines (active aggregation for safety)
            const agg: any[] = await tx.$queryRaw`
                SELECT 
                    SUM(net_amount) as subtotal,
                    SUM(tax_amount) as total_tax
                FROM hms_invoice_lines 
                WHERE invoice_id::text = CAST(${invoiceId} AS text)
            `;

            const newSubtotal = Number(agg[0].subtotal || 0);
            const newTax = Number(agg[0].total_tax || 0);
            const newTotal = newSubtotal + newTax;

            await tx.$executeRaw`
                UPDATE hms_invoice 
                SET subtotal = ${newSubtotal},
                    total_tax = ${newTax},
                    total = ${newTotal},
                    outstanding_amount = ${newTotal},
                    outstanding = ${newTotal},
                    updated_at = NOW()
                WHERE id::text = CAST(${invoiceId} AS text)
            `;

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
