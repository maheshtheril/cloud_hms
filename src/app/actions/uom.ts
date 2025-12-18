'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ==================== UOM Categories ====================

export async function getUOMCategories() {
    const session = await auth()
    if (!session?.user?.companyId) return { error: "Unauthorized" }

    try {
        const categories = await prisma.hms_uom_category.findMany({
            where: { company_id: session.user.companyId },
            include: {
                hms_uom: {
                    where: { is_active: true },
                    orderBy: { name: 'asc' }
                }
            },
            orderBy: { name: 'asc' }
        })

        return { success: true, data: categories }
    } catch (error) {
        console.error("Failed to fetch UOM categories:", error)
        return { error: "Failed to load UOM categories" }
    }
}

export async function createUOMCategory(name: string) {
    const session = await auth()
    if (!session?.user?.companyId || !session?.user?.tenantId) {
        return { error: "Unauthorized" }
    }

    try {
        const category = await prisma.hms_uom_category.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                name
            }
        })

        revalidatePath('/hms/inventory/uom')
        return { success: true, data: category }
    } catch (error) {
        console.error("Failed to create UOM category:", error)
        return { error: "Failed to create UOM category" }
    }
}

// ==================== UOMs ====================

export async function getUOMs(categoryId?: string) {
    const session = await auth()
    if (!session?.user?.companyId) return { error: "Unauthorized" }

    try {
        const uoms = await prisma.hms_uom.findMany({
            where: {
                company_id: session.user.companyId,
                is_active: true,
                ...(categoryId && { category_id: categoryId })
            },
            include: {
                hms_uom_category: true
            },
            orderBy: { name: 'asc' }
        })

        return { success: true, data: uoms }
    } catch (error) {
        console.error("Failed to fetch UOMs:", error)
        return { error: "Failed to load UOMs" }
    }
}

export async function createUOM(data: {
    name: string
    categoryId: string
    uomType: 'reference' | 'bigger' | 'smaller'
    ratio?: number
    rounding?: number
}) {
    const session = await auth()
    if (!session?.user?.companyId || !session?.user?.tenantId) {
        return { error: "Unauthorized" }
    }

    try {
        const uom = await prisma.hms_uom.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                category_id: data.categoryId,
                name: data.name,
                uom_type: data.uomType,
                ratio: data.ratio || 1.0,
                rounding: data.rounding || 0.01,
                is_active: true
            }
        })

        revalidatePath('/hms/inventory/uom')
        return { success: true, data: uom }
    } catch (error) {
        console.error("Failed to create UOM:", error)
        return { error: "Failed to create UOM" }
    }
}

// ==================== Product UOM Conversions ====================

export async function getProductUOMConversions(productId: string) {
    const session = await auth()
    if (!session?.user?.companyId) return { error: "Unauthorized" }

    try {
        const conversions = await prisma.hms_product_uom_conversion.findMany({
            where: {
                product_id: productId,
                company_id: session.user.companyId
            }
        })

        return { success: true, data: conversions }
    } catch (error) {
        console.error("Failed to fetch product UOM conversions:", error)
        return { error: "Failed to load UOM conversions" }
    }
}

export async function createProductUOMConversion(data: {
    productId: string
    fromUOM: string
    toUOM: string
    factor: number
}) {
    const session = await auth()
    if (!session?.user?.companyId || !session?.user?.tenantId) {
        return { error: "Unauthorized" }
    }

    if (data.factor <= 0) {
        return { error: "Conversion factor must be positive" }
    }

    try {
        const conversion = await prisma.hms_product_uom_conversion.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                product_id: data.productId,
                from_uom: data.fromUOM,
                to_uom: data.toUOM,
                factor: data.factor
            }
        })

        // Also create reverse conversion
        await prisma.hms_product_uom_conversion.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                product_id: data.productId,
                from_uom: data.toUOM,
                to_uom: data.fromUOM,
                factor: 1 / data.factor
            }
        })

        revalidatePath('/hms/inventory/products')
        return { success: true, data: conversion }
    } catch (error) {
        console.error("Failed to create UOM conversion:", error)
        return { error: "Failed to create UOM conversion" }
    }
}

export async function deleteProductUOMConversion(id: string) {
    const session = await auth()
    if (!session?.user?.companyId) return { error: "Unauthorized" }

    try {
        await prisma.hms_product_uom_conversion.delete({
            where: { id }
        })

        revalidatePath('/hms/inventory/products')
        return { success: true }
    } catch (error) {
        console.error("Failed to delete UOM conversion:", error)
        return { error: "Failed to delete UOM conversion" }
    }
}

// ==================== Helper Functions ====================

/**
 * Get conversion factor between two UOMs for a product
 */
export async function getConversionFactor(
    productId: string,
    fromUOM: string,
    toUOM: string
): Promise<number | null> {
    const session = await auth()
    if (!session?.user?.companyId) return null

    try {
        const conversion = await prisma.hms_product_uom_conversion.findFirst({
            where: {
                product_id: productId,
                company_id: session.user.companyId,
                from_uom: fromUOM,
                to_uom: toUOM
            }
        })

        return conversion ? Number(conversion.factor) : null
    } catch (error) {
        console.error("Failed to get conversion factor:", error)
        return null
    }
}

/**
 * Calculate price for a different UOM
 */
export function calculatePriceForUOM(
    basePrice: number,
    conversionFactor: number
): number {
    return basePrice * conversionFactor
}

/**
 * Convert quantity from one UOM to another
 */
export function convertQuantity(
    quantity: number,
    conversionFactor: number
): number {
    return quantity * conversionFactor
}

// ==================== Seed Default UOMs ====================

export async function seedDefaultUOMs() {
    const session = await auth()
    if (!session?.user?.companyId || !session?.user?.tenantId) {
        return { error: "Unauthorized" }
    }

    try {
        // Check if UOMs already exist
        const existing = await prisma.hms_uom_category.count({
            where: { company_id: session.user.companyId }
        })

        if (existing > 0) {
            return { success: true, message: "UOMs already seeded" }
        }

        // Create categories
        const countCategory = await prisma.hms_uom_category.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                name: "Count"
            }
        })

        const weightCategory = await prisma.hms_uom_category.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                name: "Weight"
            }
        })

        const volumeCategory = await prisma.hms_uom_category.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                name: "Volume"
            }
        })

        // Create Count UOMs (for tablets, capsules)
        await prisma.hms_uom.createMany({
            data: [
                {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    category_id: countCategory.id,
                    name: "Unit",
                    uom_type: "reference",
                    ratio: 1.0
                },
                {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    category_id: countCategory.id,
                    name: "Strip",
                    uom_type: "bigger",
                    ratio: 10.0
                },
                {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    category_id: countCategory.id,
                    name: "Box",
                    uom_type: "bigger",
                    ratio: 100.0
                }
            ]
        })

        // Create Weight UOMs
        await prisma.hms_uom.createMany({
            data: [
                {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    category_id: weightCategory.id,
                    name: "mg",
                    uom_type: "smaller",
                    ratio: 0.001
                },
                {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    category_id: weightCategory.id,
                    name: "g",
                    uom_type: "reference",
                    ratio: 1.0
                },
                {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    category_id: weightCategory.id,
                    name: "kg",
                    uom_type: "bigger",
                    ratio: 1000.0
                }
            ]
        })

        // Create Volume UOMs
        await prisma.hms_uom.createMany({
            data: [
                {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    category_id: volumeCategory.id,
                    name: "ml",
                    uom_type: "reference",
                    ratio: 1.0
                },
                {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    category_id: volumeCategory.id,
                    name: "Bottle",
                    uom_type: "bigger",
                    ratio: 100.0
                },
                {
                    tenant_id: session.user.tenantId,
                    company_id: session.user.companyId,
                    category_id: volumeCategory.id,
                    name: "Liter",
                    uom_type: "bigger",
                    ratio: 1000.0
                }
            ]
        })

        revalidatePath('/hms/inventory/uom')
        return {
            success: true,
            message: "Default UOMs created successfully"
        }
    } catch (error) {
        console.error("Failed to seed UOMs:", error)
        return { error: "Failed to seed default UOMs" }
    }
}
