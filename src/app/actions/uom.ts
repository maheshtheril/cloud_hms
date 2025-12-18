'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function seedPharmacyUOMs() {
    const session = await auth()
    if (!session?.user?.tenantId || !session?.user?.companyId) {
        return { error: 'Unauthorized' }
    }

    const tenantId = session.user.tenantId
    const companyId = session.user.companyId

    try {
        // 1. Create or get UOM Category
        let category = await prisma.hms_uom_category.findFirst({
            where: {
                tenant_id: tenantId,
                company_id: companyId,
                name: 'Pharmaceutical Packaging'
            }
        })

        if (!category) {
            category = await prisma.hms_uom_category.create({
                data: {
                    tenant_id: tenantId,
                    company_id: companyId,
                    name: 'Pharmaceutical Packaging'
                }
            })
        }

        // 2. Define common pharma UOMs
        const uoms = [
            { name: 'PCS', type: 'reference', ratio: 1.0, description: 'Individual pieces/tablets' },
            { name: 'PACK-10', type: 'bigger', ratio: 10.0, description: 'Pack of 10 pieces' },
            { name: 'PACK-15', type: 'bigger', ratio: 15.0, description: 'Pack of 15 pieces' },
            { name: 'PACK-20', type: 'bigger', ratio: 20.0, description: 'Pack of 20 pieces' },
            { name: 'PACK-30', type: 'bigger', ratio: 30.0, description: 'Pack of 30 pieces' },
            { name: 'STRIP', type: 'bigger', ratio: 10.0, description: 'Strip (typically 10)' },
            { name: 'BOX', type: 'bigger', ratio: 100.0, description: 'Box (typically 100)' },
            { name: 'BOTTLE', type: 'bigger', ratio: 1.0, description: 'Bottle (count as 1 unit)' },
        ]

        let created = 0
        let skipped = 0

        for (const uom of uoms) {
            const existing = await prisma.hms_uom.findFirst({
                where: {
                    tenant_id: tenantId,
                    company_id: companyId,
                    category_id: category.id,
                    name: uom.name
                }
            })

            if (!existing) {
                await prisma.hms_uom.create({
                    data: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        category_id: category.id,
                        name: uom.name,
                        uom_type: uom.type,
                        ratio: uom.ratio,
                        is_active: true
                    }
                })
                created++
            } else {
                skipped++
            }
        }

        return {
            success: true,
            message: `Seeded ${created} UOMs (${skipped} already existed)`
        }

    } catch (error) {
        console.error('Seed UOM error:', error)
        return { error: 'Failed to seed UOMs' }
    }
}

export async function getUOMs() {
    const session = await auth()
    if (!session?.user?.tenantId || !session?.user?.companyId) {
        return { error: 'Unauthorized' }
    }

    const uoms = await prisma.hms_uom.findMany({
        where: {
            tenant_id: session.user.tenantId,
            company_id: session.user.companyId,
            is_active: true
        },
        include: {
            hms_uom_category: {
                select: { name: true }
            }
        },
        orderBy: {
            ratio: 'asc'
        }
    })

    return { success: true, data: uoms }
}

// Helper: Convert quantity from one UOM to base (PCS)
export async function convertToBase(productId: string, qty: number, fromUom: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return 0

    // Check if there's a product-specific conversion
    const conversion = await prisma.hms_product_uom_conversion.findFirst({
        where: {
            tenant_id: session.user.tenantId,
            product_id: productId,
            from_uom: fromUom,
            to_uom: 'PCS'
        }
    })

    if (conversion) {
        return qty * Number(conversion.factor)
    }

    // Fallback: Use UOM ratio
    const uom = await prisma.hms_uom.findFirst({
        where: {
            tenant_id: session.user.tenantId,
            name: fromUom,
            is_active: true
        }
    })

    if (uom) {
        return qty * Number(uom.ratio)
    }

    // Default: assume 1:1
    return qty
}
