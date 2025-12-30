import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        console.log('🔍 GET prescription by appointment ID:', id)

        const prescription = await (prisma.prescription as any).findFirst({
            where: {
                appointment_id: id,
                tenant_id: session.user.tenantId
            },
            include: {
                prescription_items: {
                    include: {
                        hms_product: true
                    }
                }
            }
        })

        if (!prescription) {
            return NextResponse.json({ success: true, prescription: null })
        }

        // Format for frontend
        const medicines = (prescription as any).prescription_items.map((item: any) => ({
            id: item.hms_product.id,
            name: item.hms_product.name,
            dosage: `${item.morning}-${item.afternoon}-${item.evening}-${item.night}`,
            days: item.days.toString(),
            timing: 'After Food', // Defaulting as it's not in DB yet
            quantity: (item.morning + item.afternoon + item.evening + item.night) * item.days
        }))

        return NextResponse.json({
            success: true,
            prescription: {
                ...prescription,
                medicines
            }
        })
    } catch (error) {
        console.error('Error fetching prescription by appointment:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
