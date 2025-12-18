import { prisma } from './src/lib/prisma'

async function debugPurchaseOrders() {
    try {
        // Get all purchase orders with their tenant and company info
        const orders = await prisma.hms_purchase_order.findMany({
            select: {
                id: true,
                name: true,
                tenant_id: true,
                company_id: true,
                created_at: true,
                hms_supplier: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        console.log('\\n=== PURCHASE ORDERS DEBUG ===\\n')
        console.log(`Total purchase orders found: ${orders.length}\\n`)

        if (orders.length === 0) {
            console.log('No purchase orders in database')
            return
        }

        // Group by tenant_id
        const byTenant = new Map<string, typeof orders>()
        orders.forEach(order => {
            const existing = byTenant.get(order.tenant_id) || []
            existing.push(order)
            byTenant.set(order.tenant_id, existing)
        })

        console.log(`Unique tenants with purchase orders: ${byTenant.size}\\n`)

        // Show details for each tenant
        for (const [tenantId, tenantOrders] of byTenant.entries()) {
            console.log(`--- Tenant ID: ${tenantId} ---`)
            console.log(`   Orders count: ${tenantOrders.length}`)
            console.log(`   Company IDs: ${[...new Set(tenantOrders.map(o => o.company_id))].join(', ')}`)
            console.log(`   Orders:`)

            tenantOrders.forEach(order => {
                console.log(`      - ${order.name || order.id.slice(0, 8)}: ${order.hms_supplier.name} (${new Date(order.created_at).toISOString().split('T')[0]})`)
            })
            console.log('')
        }

        // Get all tenants to see if there are orphaned orders
        const allTenants = await prisma.tenant.findMany({
            select: {
                id: true,
                name: true,
                created_at: true
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        console.log('\\n=== ALL TENANTS ===\\n')
        console.log(`Total tenants: ${allTenants.length}\\n`)

        allTenants.forEach(tenant => {
            const orderCount = byTenant.get(tenant.id)?.length || 0
            console.log(`- ${tenant.name} (${tenant.id.slice(0, 8)}...): ${orderCount} orders`)
        })

    } catch (error) {
        console.error('Debug failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

debugPurchaseOrders()
