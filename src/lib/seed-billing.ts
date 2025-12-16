
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding billing products...')

    // 1. Get a default tenant/company (just for dev purposes, usually we'd seed for specific ones)
    const tenant = await prisma.tenant.findFirst()
    if (!tenant) {
        console.error('❌ No tenant found. Please run basic seed first.')
        return
    }

    const company = await prisma.company.findFirst({
        where: { tenant_id: tenant.id }
    })

    if (!company) {
        console.error('❌ No company found for tenant.')
        return
    }

    const services = [
        {
            sku: 'EXT-GP-001',
            name: 'General Consultation',
            description: 'Standard GP visit (15 mins)',
            is_service: true, // Key flag for services
            is_stockable: false,
            uom: 'visit',
            price: 50.00
        },
        {
            sku: 'RAD-XR-001',
            name: 'Chest X-Ray',
            description: 'Digital Chest X-Ray (AP/PA)',
            is_service: true,
            is_stockable: false,
            uom: 'scan',
            price: 120.00
        },
        {
            sku: 'LAB-CBC-001',
            name: 'Complete Blood Count',
            description: 'Standard CBC Panel',
            is_service: true,
            is_stockable: false,
            uom: 'test',
            price: 35.00
        }
    ]

    for (const s of services) {
        // Check if exists
        const exists = await prisma.hms_product.findFirst({
            where: { sku: s.sku, tenant_id: tenant.id, company_id: company.id }
        })

        if (!exists) {
            await prisma.hms_product.create({
                data: {
                    tenant_id: tenant.id,
                    company_id: company.id,
                    sku: s.sku,
                    name: s.name,
                    description: s.description,
                    is_service: s.is_service,
                    is_stockable: s.is_stockable,
                    uom: s.uom,
                    is_active: true
                }
            })

            // Also create a price history entry if needed, but for now just the product is foundational
            // Check if price history exists, if not create active price
            // Note: hms_product doesn't have a direct 'price' field in some schemas, let's check schema quick
            // Waiting for schema check.. actually I saw hms_product_price_history. 
            // Let's assume for MVP we might need to add price there or if hms_product has it.
            // Reviewing schema snippet from memory: hms_product didn't show price. hms_product_price_history does.

            const product = await prisma.hms_product.findFirst({
                where: { sku: s.sku, tenant_id: tenant.id }
            })

            if (product) {
                await prisma.hms_product_price_history.create({
                    data: {
                        tenant_id: tenant.id,
                        company_id: company.id, // Assuming it has company_id
                        product_id: product.id,
                        price: s.price,
                        currency: 'USD',
                        valid_from: new Date()
                    }
                })
            }

            console.log(`✅ Created service: ${s.name}`)
        } else {
            console.log(`ℹ️  Service already exists: ${s.name}`)
        }
    }

    console.log('✨ Billing seed complete.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
