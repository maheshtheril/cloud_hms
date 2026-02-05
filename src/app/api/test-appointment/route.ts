import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();
        const body = await req.json();

        const { patientId, clinicianId, dateStr, timeStr } = body;

        // Log what we're trying to create
        const startsAt = new Date(`${dateStr}T${timeStr}:00`);
        const endsAt = new Date(startsAt.getTime() + 30 * 60000);

        const appointmentData = {
            tenant_id: session?.user?.tenantId,
            company_id: session?.user?.companyId || session?.user?.tenantId,
            patient_id: patientId,
            clinician_id: clinicianId,
            starts_at: startsAt,
            ends_at: endsAt,
            type: 'consultation',
            mode: 'in_person',
            priority: 'normal',
            status: 'scheduled',
            created_by: session?.user?.id,
            branch_id: session?.user?.current_branch_id || null
        };

        // Check for null values
        const nullFields = Object.entries(appointmentData)
            .filter(([key, value]) => value === null || value === undefined)
            .map(([key]) => key);

        // Try to create
        try {
            const result = await prisma.hms_appointments.create({
                data: appointmentData as any
            });

            return NextResponse.json({
                success: true,
                id: result.id,
                nullFields: nullFields
            });
        } catch (createError: any) {
            return NextResponse.json({
                success: false,
                error: createError.message,
                code: createError.code,
                meta: createError.meta,
                nullFields: nullFields,
                attemptedData: appointmentData
            }, { status: 500 });
        }

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
