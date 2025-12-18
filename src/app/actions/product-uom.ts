'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

/**
 * Get product with UOM information and pricing
 */
export async function getProductWithUOM(productId: string) {
    const session = await auth()
    if (!session?.user?.companyId) return { error: "Unauthorized" }

    try {
        const product = await prisma.hms_product.findUnique({
            where: { id: productId },
            include: {
                hms_uom: true,
                hms_product_uom_conversion: true,
                hms_product_batch: {
                    where: { qty_on_hand: { gt: 0 } },
                    orderBy: { expiry_date: 'asc' },
                    take: 1
                }
            }
        })

        if (!product) return { error: "Product not found" }

        // Get latest batch with pricing
        const latestBatch = product.hms_product_batch[0]

        return {
            success: true,
            data: {
                id: product.id,
                name: product.name,
                sku: product.sku,
                baseUOM: product.uom,
                baseUOMId: product.uom_id,
                defaultCost: Number(product.default_cost),
                price: Number(product.price),
                // Batch information
                batch: latestBatch ? {
                    id: latestBatch.id,
                    batchNo: latestBatch.batch_no,
                    mrp: Number(latestBatch.mrp),
                    salePrice: Number(latestBatch.sale_price),
                    cost: Number(latestBatch.cost),
                    qtyOnHand: Number(latestBatch.qty_on_hand),
                    expiryDate: latestBatch.expiry_date
                } : null,
                // Available conversions
                uomConversions: product.hms_product_uom_conversion.map(conv => ({
                    id: conv.id,
                    fromUOM: conv.from_uom,
                    toUOM: conv.to_uom,
                    factor: Number(conv.factor)
                }))
            }
        }
    } catch (error) {
        console.error("Failed to fetch product with UOM:", error)
        return { error: "Failed to load product information" }
    }
}

/**
 * Get available UOMs for a product (base UOM + conversions)
 */
export async function getProductAvailableUOMs(productId: string) {
    const session = await auth()
    if (!session?.user?.companyId) return { error: "Unauthorized" }

    try {
        const product = await prisma.hms_product.findUnique({
            where: { id: productId },
            select: {
                uom: true,
                hms_product_uom_conversion: {
                    select: {
                        to_uom: true,
                        factor: true
                    }
                }
            }
        })

        if (!product) return { error: "Product not found" }

        // Base UOM
        const uoms = [
            {
                uom: product.uom,
                factor: 1.0,
                isBase: true
            }
        ]

        // Additional UOMs from conversions
        const uniqueUOMs = new Set<string>()
        product.hms_product_uom_conversion.forEach(conv => {
            if (!uniqueUOMs.has(conv.to_uom)) {
                uniqueUOMs.add(conv.to_uom)
                uoms.push({
                    uom: conv.to_uom,
                    factor: Number(conv.factor),
                    isBase: false
                })
            }
        })

        return { success: true, data: uoms }
    } catch (error) {
        console.error("Failed to fetch available UOMs:", error)
        return { error: "Failed to load UOMs" }
    }
}

/**
 * Calculate sale price for a specific UOM
 */
export async function calculateSalePriceForUOM(
    productId: string,
    basePrice: number,
    targetUOM: string
): Promise<{ success: boolean; price?: number; error?: string }> {
    const session = await auth()
    if (!session?.user?.companyId) return { success: false, error: "Unauthorized" }

    try {
        const product = await prisma.hms_product.findUnique({
            where: { id: productId },
            select: { uom: true }
        })

        if (!product) return { success: false, error: "Product not found" }

        // If target UOM is same as base UOM, return base price
        if (targetUOM === product.uom) {
            return { success: true, price: basePrice }
        }

        // Get conversion factor
        const conversion = await prisma.hms_product_uom_conversion.findFirst({
            where: {
                product_id: productId,
                company_id: session.user.companyId,
                from_uom: product.uom,
                to_uom: targetUOM
            }
        })

        if (!conversion) {
            return { success: false, error: `No conversion found from ${product.uom} to ${targetUOM}` }
        }

        const calculatedPrice = basePrice * Number(conversion.factor)
        return { success: true, price: calculatedPrice }

    } catch (error) {
        console.error("Failed to calculate UOM price:", error)
        return { success: false, error: "Failed to calculate price" }
    }
}

/**
 * Convert quantity to base UOM for inventory tracking
 */
export async function convertToBaseUOM(
    productId: string,
    quantity: number,
    sourceUOM: string
): Promise<{ success: boolean; baseQuantity?: number; error?: string }> {
    const session = await auth()
    if (!session?.user?.companyId) return { success: false, error: "Unauthorized" }

    try {
        const product = await prisma.hms_product.findUnique({
            where: { id: productId },
            select: { uom: true }
        })

        if (!product) return { success: false, error: "Product not found" }

        // If source UOM is same as base UOM, return quantity as is
        if (sourceUOM === product.uom) {
            return { success: true, baseQuantity: quantity }
        }

        // Get conversion factor from source to base
        const conversion = await prisma.hms_product_uom_conversion.findFirst({
            where: {
                product_id: productId,
                company_id: session.user.companyId,
                from_uom: sourceUOM,
                to_uom: product.uom
            }
        })

        if (!conversion) {
            return { success: false, error: `No conversion found from ${sourceUOM} to ${product.uom}` }
        }

        const baseQuantity = quantity * Number(conversion.factor)
        return { success: true, baseQuantity }

    } catch (error) {
        console.error("Failed to convert to base UOM:", error)
        return { success: false, error: "Failed to convert quantity" }
    }
}

/**
 * Get stock quantity in different UOMs
 */
export async function getStockInUOM(
    productId: string,
    targetUOM: string
): Promise<{ success: boolean; quantity?: number; error?: string }> {
    const session = await auth()
    if (!session?.user?.companyId) return { success: false, error: "Unauthorized" }

    try {
        // Get total stock in base UOM
        const stockLevels = await prisma.hms_stock_levels.findMany({
            where: {
                product_id: productId,
                company_id: session.user.companyId
            }
        })

        const totalBaseStock = stockLevels.reduce(
            (sum, level) => sum + Number(level.quantity),
            0
        )

        // Get product base UOM
        const product = await prisma.hms_product.findUnique({
            where: { id: productId },
            select: { uom: true }
        })

        if (!product) return { success: false, error: "Product not found" }

        // If target is base UOM, return as is
        if (targetUOM === product.uom) {
            return { success: true, quantity: totalBaseStock }
        }

        // Convert to target UOM
        const conversion = await prisma.hms_product_uom_conversion.findFirst({
            where: {
                product_id: productId,
                company_id: session.user.companyId,
                from_uom: product.uom,
                to_uom: targetUOM
            }
        })

        if (!conversion) {
            return { success: false, error: `No conversion found to ${targetUOM}` }
        }

        const convertedQuantity = totalBaseStock * Number(conversion.factor)
        return { success: true, quantity: convertedQuantity }

    } catch (error) {
        console.error("Failed to get stock in UOM:", error)
        return { success: false, error: "Failed to get stock quantity" }
    }
}
