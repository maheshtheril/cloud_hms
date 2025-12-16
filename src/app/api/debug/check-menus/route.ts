
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const menus = await prisma.menu_items.findMany({
            where: {
                OR: [
                    { module_key: 'hms' },
                    { key: { startsWith: 'hms' } }
                ]
            },
            orderBy: { sort_order: 'asc' },
            include: { other_menu_items: true } // Include children
        })
        return NextResponse.json({ success: true, count: menus.length, data: menus })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 })
    }
}
