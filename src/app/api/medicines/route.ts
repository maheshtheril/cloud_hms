import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch medicines/products from inventory
        const medicines = await prisma.hms_item.findMany({
            where: {
                tenant_id: session.user.tenantId,
                // Optionally filter by category if you have a "Medicine" category
            },
            select: {
                id: true,
                name: true,
                sku: true
            },
            orderBy: {
                name: 'asc'
            },
            take: 500 // Limit for performance
        })

        return NextResponse.json({ medicines })
    } catch (error) {
        console.error('Error fetching medicines:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
