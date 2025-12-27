import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        await prisma.hms_prescription_template.delete({
            where: {
                id,
                tenant_id: session.user.tenantId
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting template:', error)
        return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
    }
}
