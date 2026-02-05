import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();
        const tenantId = session?.user?.tenantId;
        const companyId = session?.user?.companyId;

        if (!tenantId || !companyId) {
            return NextResponse.json({ error: 'No session' }, { status: 401 });
        }

        // Try to create a minimal test clinician
        const result = await prisma.hms_clinicians.create({
            data: {
                tenant_id: tenantId,
                company_id: companyId,
                first_name: 'Test',
                last_name: 'User',
                email: `test-${Date.now()}@example.com`,
                working_days: ['Monday', 'Tuesday'],
                document_urls: [], // Empty array
                is_active: true,
            }
        });

        return NextResponse.json({
            success: true,
            id: result.id,
            message: 'Test clinician created successfully'
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            code: error.code,
            meta: error.meta,
            stack: error.stack?.split('\n').slice(0, 5)
        }, { status: 500 });
    }
}
