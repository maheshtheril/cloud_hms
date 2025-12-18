import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkPurchaseOrders() {
    try {
        console.log('🔍 Checking purchase orders in database...\n')

        // 1. Count total purchase orders
        const totalCount = await prisma.hms_purchase_order.count()
        console.log(`📊 Total purchase orders in database: ${totalCount}`)

        if (totalCount === 0) {
            console.log('\n✅ DATABASE IS CLEAN - No purchase orders exist')
            console.log('This means the issue is NOT in the database.')
            console.log('Check your browser cache or frontend state.')
            return
        }

        console.log('\n⚠️  FOUND PURCHASE ORDERS IN DATABASE\n')

        // 2. Get all purchase orders with tenant info
        const orders = await prisma.hms_purchase_order.findMany({
            include: {
                hms_supplier: {
                    select: { name: true }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        console.log('📋 Purchase Orders Details:\n')
        orders.forEach((po, index) => {
            console.log(`${index + 1}. PO: ${po.name || po.id.slice(0, 8)}`)
            console.log(`   Tenant ID: ${po.tenant_id}`)
            console.log(`   Company ID: ${po.company_id}`)
            console.log(`   Supplier: ${po.hms_supplier?.name || 'N/A'}`)
            console.log(`   Status: ${po.status}`)
            console.log(`   Amount: ${po.total_amount}`)
            console.log(`   Created: ${po.created_at}`)
            console.log('')
        })

        // 3. Group by tenant
        const byTenant = orders.reduce((acc, po) => {
            const tid = po.tenant_id
            if (!acc[tid]) acc[tid] = []
            acc[tid].push(po)
            return acc
        }, {} as Record<string, typeof orders>)

        console.log('\n📊 Purchase Orders by Tenant:\n')
        for (const [tenantId, tenantOrders] of Object.entries(byTenant)) {
            console.log(`Tenant: ${tenantId.slice(0, 16)}...`)
            console.log(`  Orders: ${tenantOrders.length}`)
            console.log('')
        }

        // 4. Get tenant info
        console.log('\n👥 Tenant Information:\n')
        const tenants = await prisma.tenant.findMany({
            orderBy: { created_at: 'desc' }
        })

        tenants.forEach((tenant, index) => {
            const orderCount = byTenant[tenant.id]?.length || 0
            console.log(`${index + 1}. ${tenant.name}`)
            console.log(`   ID: ${tenant.id}`)
            console.log(`   Created: ${tenant.created_at}`)
            console.log(`   Purchase Orders: ${orderCount}`)
            console.log('')
        })

        // 5. Summary
        console.log('\n📌 SUMMARY:')
        console.log(`Total tenants: ${tenants.length}`)
        console.log(`Total purchase orders: ${totalCount}`)
        console.log(`Tenants with orders: ${Object.keys(byTenant).length}`)

        if (Object.keys(byTenant).length > 0) {
            console.log('\n⚠️  ACTION REQUIRED:')
            console.log('If these are test/demo orders, delete them:')
            console.log('DELETE FROM hms_purchase_order WHERE tenant_id = \'<tenant-id>\';')
        }

    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkPurchaseOrders()
