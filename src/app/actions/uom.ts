import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { internalSeedUOMs } from '@/lib/services/uom'

export { internalSeedUOMs };

export async function seedPharmacyUOMs() {
    const session = await auth()
    if (!session?.user?.tenantId || !session?.user?.companyId) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        return await internalSeedUOMs(session.user.tenantId, session.user.companyId)
    } catch (error) {
        return { success: false, error: 'Failed to seed UOMs' }
    }
}

export async function getUOMs() {
    const session = await auth()
    if (!session?.user?.tenantId || !session?.user?.companyId) {
        return { success: false, error: 'Unauthorized' }
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
