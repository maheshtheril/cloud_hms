import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Debug: shows the registration status of the most recently created patients
export async function GET() {
    const session = await auth();
    if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const patients = await prisma.hms_patient.findMany({
        where: { tenant_id: session.user.tenantId },
        orderBy: { created_at: 'desc' },
        take: 5,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            patient_number: true,
            created_at: true,
            metadata: true,
        }
    });

    const result = patients.map(p => ({
        id: p.id,
        name: `${p.first_name} ${p.last_name}`,
        patient_number: p.patient_number,
        created_at: p.created_at,
        metadata_status: (p.metadata as any)?.status,
        registration_fees_paid: (p.metadata as any)?.registration_fees_paid,
        registration_expiry: (p.metadata as any)?.registration_expiry,
        full_metadata: p.metadata,
    }));

    return NextResponse.json({ patients: result });
}
