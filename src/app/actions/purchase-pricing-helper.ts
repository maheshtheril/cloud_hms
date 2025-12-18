'use server'

import { auth } from '@/auth'

/**
 * 🎯 INSTANT UOM PURCHASE HELPER
 * 
 * Use this when entering purchases to auto-calculate unit prices from pack prices
 * 
 * Example:
 * const pricing = await calculatePurchasePricing({
 *   packPrice: 30,      // ₹30 per strip
 *   packSalePrice: 45,  // ₹45 selling price per strip
 *   conversionFactor: 15 // 1 strip = 15 tablets
 * })
 * 
 * Returns:
 * {
 *   unitCost: 2,           // ₹30 ÷ 15 = ₹2 per tablet
 *   unitSalePrice: 3,      // ₹45 ÷ 15 = ₹3 per tablet
 *   marginPct: 50,         // (3-2)/2 × 100 = 50%
 *   markupPct: 50          // (3-2)/2 × 100 = 50%
 * }
 */

type PurchasePricingInput = {
    packPrice: number           // Purchase price per pack (e.g., ₹30/strip)
    packSalePrice: number       // Selling price per pack (e.g., ₹45/strip)
    conversionFactor: number    // Pack to unit conversion (e.g., 15 tablets per strip)
    mrp?: number                // Optional MRP for validation
}

type PurchasePricingResult = {
    // Pack level
    packCost: number
    packSalePrice: number

    // Unit level (calculated)
    unitCost: number
    unitSalePrice: number

    // Metrics
    marginPct: number
    markupPct: number

    // For form submission
    purchaseUOM: string
    baseUOM: string
    conversionFactor: number

    // Validation
    isValid: boolean
    errors?: string[]
}

export async function calculatePurchasePricing(
    input: PurchasePricingInput
): Promise<PurchasePricingResult> {
    const errors: string[] = []

    // Validations
    if (input.packPrice <= 0) {
        errors.push("Pack price must be greater than 0")
    }

    if (input.packSalePrice <= 0) {
        errors.push("Sale price must be greater than 0")
    }

    if (input.conversionFactor <= 0) {
        errors.push("Conversion factor must be greater than 0")
    }

    if (input.packSalePrice < input.packPrice) {
        errors.push("Sale price cannot be less than cost price")
    }

    if (input.mrp && input.packSalePrice > input.mrp) {
        errors.push(`Sale price (₹${input.packSalePrice}) cannot exceed MRP (₹${input.mrp})`)
    }

    // Calculate unit prices
    const unitCost = input.packPrice / input.conversionFactor
    const unitSalePrice = input.packSalePrice / input.conversionFactor

    // Calculate margins
    const marginPct = input.packSalePrice > 0
        ? ((input.packSalePrice - input.packPrice) / input.packSalePrice) * 100
        : 0

    const markupPct = input.packPrice > 0
        ? ((input.packSalePrice - input.packPrice) / input.packPrice) * 100
        : 0

    return {
        packCost: input.packPrice,
        packSalePrice: input.packSalePrice,
        unitCost: Number(unitCost.toFixed(2)),
        unitSalePrice: Number(unitSalePrice.toFixed(2)),
        marginPct: Number(marginPct.toFixed(2)),
        markupPct: Number(markupPct.toFixed(2)),
        purchaseUOM: "Strip", // Can be parameterized
        baseUOM: "Unit",
        conversionFactor: input.conversionFactor,
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
    }
}

/**
 * 🎯 QUICK CALCULATOR - Use in console or admin tools
 * 
 * Example:
 * const calc = quickCalc("30/45/15")
 * // Input: "packCost/packSale/factor"
 * // Returns: Complete pricing breakdown
 */
export async function quickCalc(input: string): Promise<PurchasePricingResult | { error: string }> {
    try {
        const [packPrice, packSalePrice, conversionFactor] = input.split('/').map(Number)

        if (!packPrice || !packSalePrice || !conversionFactor) {
            return { error: "Format: packPrice/packSalePrice/conversionFactor (e.g., 30/45/15)" }
        }

        return await calculatePurchasePricing({
            packPrice,
            packSalePrice,
            conversionFactor
        })
    } catch (error) {
        return { error: "Invalid input format. Use: packPrice/packSalePrice/conversionFactor" }
    }
}

/**
 * 🎯 BATCH CALCULATOR - Calculate for multiple products at once
 * 
 * Example:
 * const batch = await batchCalculate([
 *   { name: "Paracetamol", packPrice: 30, packSalePrice: 45, factor: 15 },
 *   { name: "Ibuprofen", packPrice: 40, packSalePrice: 60, factor: 10 }
 * ])
 */
export async function batchCalculate(items: Array<{
    name: string
    packPrice: number
    packSalePrice: number
    factor: number
    mrp?: number
}>): Promise<Array<{ name: string } & PurchasePricingResult>> {
    const results = []

    for (const item of items) {
        const pricing = await calculatePurchasePricing({
            packPrice: item.packPrice,
            packSalePrice: item.packSalePrice,
            conversionFactor: item.factor,
            mrp: item.mrp
        })

        results.push({
            name: item.name,
            ...pricing
        })
    }

    return results
}

/**
 * 🎯 VALIDATE PURCHASE DATA - Use before submitting purchase
 * 
 * Validates all pricing rules for a purchase entry
 */
export async function validatePurchaseData(data: {
    items: Array<{
        productName: string
        unitPrice: number
        salePrice?: number
        mrp?: number
        purchaseUOM?: string
        conversionFactor?: number
    }>
}): Promise<{
    isValid: boolean
    errors: Array<{ product: string, error: string }>
    warnings: Array<{ product: string, warning: string }>
}> {
    const errors: Array<{ product: string, error: string }> = []
    const warnings: Array<{ product: string, warning: string }> = []

    for (const item of data.items) {
        // Check 1: Sale price required
        if (!item.salePrice || item.salePrice <= 0) {
            errors.push({
                product: item.productName,
                error: "Sale price is required and must be greater than 0"
            })
        }

        // Check 2: Sale price should not exceed MRP
        if (item.mrp && item.salePrice && item.salePrice > item.mrp) {
            errors.push({
                product: item.productName,
                error: `Sale price (₹${item.salePrice}) exceeds MRP (₹${item.mrp})`
            })
        }

        // Check 3: Sale price should not be less than unit price
        if (item.salePrice && item.unitPrice && item.salePrice < item.unitPrice) {
            errors.push({
                product: item.productName,
                error: `Sale price (₹${item.salePrice}) is less than cost (₹${item.unitPrice})`
            })
        }

        // Warning: Low margin
        if (item.salePrice && item.unitPrice) {
            const marginPct = ((item.salePrice - item.unitPrice) / item.salePrice) * 100
            if (marginPct < 10) {
                warnings.push({
                    product: item.productName,
                    warning: `Low margin: ${marginPct.toFixed(1)}% (consider reviewing pricing)`
                })
            }
        }

        // Warning: Very high margin
        if (item.salePrice && item.unitPrice) {
            const markupPct = ((item.salePrice - item.unitPrice) / item.unitPrice) * 100
            if (markupPct > 200) {
                warnings.push({
                    product: item.productName,
                    warning: `Very high markup: ${markupPct.toFixed(0)}% (verify if correct)`
                })
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    }
}

/**
 * 🎯 PRICING TEMPLATES - Common pricing strategies
 */
export const PRICING_TEMPLATES = {
    // MRP-based pricing
    mrpMinus5: (mrp: number) => mrp * 0.95,
    mrpMinus10: (mrp: number) => mrp * 0.90,
    mrpMinus15: (mrp: number) => mrp * 0.85,
    mrpMinus20: (mrp: number) => mrp * 0.80,

    // Cost-plus pricing
    costPlus25: (cost: number) => cost * 1.25,
    costPlus33: (cost: number) => cost * 1.33,
    costPlus50: (cost: number) => cost * 1.50,
    costPlus100: (cost: number) => cost * 2.00,
}

/**
 * 🎯 APPLY TEMPLATE - Quick apply pricing templates
 */
export async function applyPricingTemplate(
    cost: number,
    mrp: number | undefined,
    template: keyof typeof PRICING_TEMPLATES
): Promise<{ salePrice: number, marginPct: number, markupPct: number }> {
    let salePrice: number

    if (template.startsWith('mrp') && mrp) {
        salePrice = PRICING_TEMPLATES[template](mrp)
    } else if (template.startsWith('cost')) {
        salePrice = PRICING_TEMPLATES[template](cost)
    } else {
        salePrice = cost * 1.25 // Default 25% markup
    }

    const marginPct = ((salePrice - cost) / salePrice) * 100
    const markupPct = ((salePrice - cost) / cost) * 100

    return {
        salePrice: Number(salePrice.toFixed(2)),
        marginPct: Number(marginPct.toFixed(2)),
        markupPct: Number(markupPct.toFixed(2))
    }
}
