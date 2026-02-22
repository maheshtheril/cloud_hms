import { prisma } from '@/lib/prisma';

export async function internalSeedUOMs(tenantId: string, companyId: string, tx?: any) {
    const db = tx || prisma;
    console.log(`[UOM Service] Seeding UOMs for Tenant: ${tenantId}, Company: ${companyId}`);
    try {
        // 1. Create or get Categories
        const pharmaCategory = await db.hms_uom_category.upsert({
            where: { ux_hms_uom_category_name: { tenant_id: tenantId, company_id: companyId, name: 'Pharmaceutical Packaging' } },
            update: {},
            create: { tenant_id: tenantId, company_id: companyId, name: 'Pharmaceutical Packaging' }
        });

        const serviceCategory = await db.hms_uom_category.upsert({
            where: { ux_hms_uom_category_name: { tenant_id: tenantId, company_id: companyId, name: 'Services' } },
            update: {},
            create: { tenant_id: tenantId, company_id: companyId, name: 'Services' }
        });

        // 2. Define common pharma UOMs
        const uoms = [
            { name: 'PCS', type: 'reference', ratio: 1.0, description: 'Individual pieces/tablets', categoryId: pharmaCategory.id },
            { name: 'PACK-10', type: 'bigger', ratio: 10.0, description: 'Pack of 10 pieces', categoryId: pharmaCategory.id },
            { name: 'PACK-15', type: 'bigger', ratio: 15.0, description: 'Pack of 15 pieces', categoryId: pharmaCategory.id },
            { name: 'PACK-20', type: 'bigger', ratio: 20.0, description: 'Pack of 20 pieces', categoryId: pharmaCategory.id },
            { name: 'PACK-30', type: 'bigger', ratio: 30.0, description: 'Pack of 30 pieces', categoryId: pharmaCategory.id },
            { name: 'STRIP', type: 'bigger', ratio: 10.0, description: 'Strip (typically 10)', categoryId: pharmaCategory.id },
            { name: 'BOX', type: 'bigger', ratio: 100.0, description: 'Box (typically 100)', categoryId: pharmaCategory.id },
            { name: 'BOTTLE', type: 'bigger', ratio: 1.0, description: 'Bottle (count as 1 unit)', categoryId: pharmaCategory.id },
            { name: 'UNIT', type: 'reference', ratio: 1.0, description: 'Standard unit', categoryId: serviceCategory.id },
            { name: 'VISIT', type: 'reference', ratio: 1.0, description: 'Consultation visit', categoryId: serviceCategory.id },
            { name: 'TEST', type: 'reference', ratio: 1.0, description: 'Lab test unit', categoryId: serviceCategory.id },
        ]

        let created = 0
        for (const uom of uoms) {
            await db.hms_uom.upsert({
                where: {
                    ux_hms_uom_name: {
                        tenant_id: tenantId,
                        company_id: companyId,
                        category_id: uom.categoryId,
                        name: uom.name
                    }
                },
                update: {},
                create: {
                    tenant_id: tenantId,
                    company_id: companyId,
                    category_id: uom.categoryId,
                    name: uom.name,
                    uom_type: uom.type,
                    ratio: uom.ratio,
                    is_active: true
                }
            })
            created++
        }

        return {
            success: true,
            message: `Seeded ${created} UOMs`
        }
    } catch (error) {
        console.error('Internal Seed UOM error:', error)
        throw error
    }
}
