import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const count = await prisma.hms_purchase_order.count()

        if (count === 0) {
            return NextResponse.json({
                status: 'clean',
                message: 'No purchase orders in database',
                count: 0
            })
        }

        const orders = await prisma.hms_purchase_order.findMany({
            include: {
                hms_supplier: { select: { name: true } }
            },
            orderBy: { created_at: 'desc' },
            take: 20
        })

        const byTenant = orders.reduce((acc, po) => {
            if (!acc[po.tenant_id]) {
                acc[po.tenant_id] = []
            }
            acc[po.tenant_id].push({
                id: po.id,
                name: po.name,
                supplier: po.hms_supplier?.name,
                created_at: po.created_at
            })
            return acc
        }, {} as Record<string, any[]>)

        return NextResponse.json({
            status: 'has_data',
            total_count: count,
            tenants_with_orders: Object.keys(byTenant).length,
            orders_by_tenant: byTenant,
            recent_orders: orders.slice(0, 5).map(o => ({
                id: o.id,
                name: o.name,
                tenant_id: o.tenant_id,
                company_id: o.company_id,
                supplier: o.hms_supplier?.name,
                created_at: o.created_at
            }))
        })

    } catch (error) {
        return NextResponse.json({
            status: 'error',
            error: (error as Error).message
        }, { status: 500 })
    }
}
