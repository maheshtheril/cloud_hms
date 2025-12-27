import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const templates = await prisma.hms_prescription_template.findMany({
            where: { tenant_id: session.user.tenantId },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json({ success: true, templates })
    } catch (error) {
        console.error('Error fetching templates:', error)
        return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, description, medicines } = body

        if (!name || !medicines) {
            return NextResponse.json({ error: 'Name and medicines are required' }, { status: 400 })
        }

        const template = await prisma.hms_prescription_template.create({
            data: {
                tenant_id: session.user.tenantId,
                name,
                description,
                medicines
            }
        })

        return NextResponse.json({ success: true, template })
    } catch (error) {
        console.error('Error saving template:', error)
        return NextResponse.json({ error: 'Failed to save template' }, { status: 500 })
    }
}
