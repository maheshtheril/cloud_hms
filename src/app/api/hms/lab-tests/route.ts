import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q') || ''

        const tests = await prisma.hms_lab_test.findMany({
            where: {
                tenant_id: session.user.tenantId,
                name: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            take: 20
        })

        return NextResponse.json({ success: true, tests })
    } catch (error) {
        console.error('Error fetching lab tests:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
