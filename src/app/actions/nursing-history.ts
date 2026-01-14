'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getConsumptionHistory(encounterId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    // Query Stock Moves to get the authoritative HISTORY of WHO consumed WHAT and WHEN
    const moves = await prisma.hms_stock_move.findMany({
        where: {
            source_reference: encounterId,
            source: 'Nursing Consumption'
        },
        orderBy: {
            created_at: 'desc'
        }
    })

    // Fetch user details manually since created_by might not have a relation set up in schema yet for some models
    // Collecting unique user IDs
    const userIds = [...new Set(moves.map(m => m.created_by).filter(id => id !== null))] as string[]
    const users = await prisma.app_user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, full_name: true }
    })
    const userMap = new Map(users.map(u => [u.id, u.full_name || u.name || 'Unknown']))

    // Fetch product details manually
    const productIds = [...new Set(moves.map(m => m.product_id))]
    const products = await prisma.hms_product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true }
    })
    const productMap = new Map(products.map(p => [p.id, p.name]))

    // Group by Time Window (e.g., recorded within the same minute = one "Entry")
    const events: any[] = []

    moves.forEach(move => {
        const moveTime = new Date(move.created_at).getTime()
        // Find an existing event close to this time (within 2 seconds)
        let event = events.find(e => Math.abs(new Date(e.timestamp).getTime() - moveTime) < 2000 && e.nurseId === move.created_by)

        if (!event) {
            event = {
                id: move.id, // ID of first move in batch
                timestamp: move.created_at,
                nurseName: userMap.get(move.created_by || '') || 'Unknown Nurse',
                nurseId: move.created_by,
                items: []
            }
            events.push(event)
        }

        event.items.push({
            productName: productMap.get(move.product_id) || 'Unknown Item',
            quantity: move.qty.toNumber(),
            uom: move.uom
        })
    })

    // Sort events descending
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return { data: events }
}
