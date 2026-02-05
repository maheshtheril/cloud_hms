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
        console.log(`[GET /api/prescriptions/${id}] Fetching for tenant: ${session.user.tenantId}`)

        // Use Raw SQL for consistency
        const prescriptions: any[] = await prisma.$queryRaw`
            SELECT p.*, 
                JSON_AGG(JSON_BUILD_OBJECT(
                    'id', pi.id,
                    'medicine_id', pi.medicine_id,
                    'morning', pi.morning,
                    'afternoon', pi.afternoon,
                    'evening', pi.evening,
                    'night', pi.night,
                    'days', pi.days,
                    'hms_product', JSON_BUILD_OBJECT(
                        'id', prod.id,
                        'name', prod.name,
                        'sku', prod.sku,
                        'price', prod.price
                    )
                )) as prescription_items
            FROM prescription p
            LEFT JOIN prescription_items pi ON p.id = pi.prescription_id
            LEFT JOIN hms_product prod ON pi.medicine_id = prod.id
            WHERE p.id::text = CAST(${id} AS text)
            AND p.tenant_id::text = CAST(${session.user.tenantId} AS text)
            GROUP BY p.id
            LIMIT 1
        `;

        const prescription = prescriptions[0];

        if (!prescription) {
            return NextResponse.json({ success: true, prescription: null, vitals: null })
        }

        // Fetch vitals if linked to an appointment
        let vitals = null;
        if (prescription.appointment_id) {
            const vitalsArr: any[] = await prisma.$queryRaw`
                SELECT v.* FROM hms_vitals v
                WHERE v.encounter_id::text = CAST(${prescription.appointment_id} AS text)
                LIMIT 1
            `;
            vitals = vitalsArr[0];
        }

        // Format for frontend
        let medicines = [];
        if (prescription.prescription_items && Array.isArray(prescription.prescription_items)) {
            medicines = prescription.prescription_items
                .filter((item: any) => item && item.medicine_id && item.hms_product && item.hms_product.id)
                .map((item: any) => ({
                    id: item.hms_product.id,
                    name: item.hms_product.name,
                    dosage: `${item.morning || 0}-${item.afternoon || 0}-${item.evening || 0}-${item.night || 0}`,
                    days: (item.days || 3).toString(),
                    timing: 'After Food',
                    quantity: ((item.morning || 0) + (item.afternoon || 0) + (item.evening || 0) + (item.night || 0)) * (item.days || 0)
                }));
        }

        return NextResponse.json({
            success: true,
            prescription: {
                ...prescription,
                medicines
            },
            vitals: vitals || null
        })
    } catch (error) {
        console.error('Error fetching prescription:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
