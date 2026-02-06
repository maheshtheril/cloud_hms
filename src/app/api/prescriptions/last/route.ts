import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const patientId = searchParams.get('patientId')

        if (!patientId) {
            return NextResponse.json({ error: 'Patient ID required' }, { status: 400 })
        }

        // Fetch the most recent prescription for this patient
        const lastPrescription = await prisma.prescription.findFirst({
            where: {
                patient_id: patientId,
                tenant_id: session.user.tenantId
            },
            orderBy: {
                created_at: 'desc'
            },
            include: {
                prescription_items: {
                    include: {
                        hms_product: true
                    }
                }
            }
        })

        if (!lastPrescription) {
            return NextResponse.json({
                success: false,
                message: 'No previous prescription found'
            })
        }

        // Fetch lab orders for this appointment if linked
        let labTests = [];
        if (lastPrescription.appointment_id) {
            const labOrders: any[] = await prisma.$queryRaw`
                SELECT lo.*, 
                    JSON_AGG(JSON_BUILD_OBJECT(
                        'id', lt.id,
                        'name', lt.name,
                        'price', lol.price
                    )) as tests
                FROM hms_lab_order lo
                JOIN hms_lab_order_line lol ON lo.id = lol.order_id
                JOIN hms_lab_test lt ON lol.test_id = lt.id
                WHERE lo.encounter_id::text = CAST(${lastPrescription.appointment_id} AS text)
                AND lo.tenant_id::text = CAST(${session.user.tenantId} AS text)
                AND lo.status = 'requested'
                GROUP BY lo.id
                ORDER BY lo.created_at DESC
                LIMIT 1
            `;
            labTests = labOrders[0]?.tests || [];
        }

        // Transform to frontend format
        const formattedData = {
            vitals: lastPrescription.vitals || '',
            diagnosis: lastPrescription.diagnosis || '',
            complaint: lastPrescription.complaint || '',
            examination: lastPrescription.examination || '',
            plan: lastPrescription.plan || '',
            medicines: lastPrescription.prescription_items?.map((item: any) => ({
                id: item.medicine_id,
                name: item.hms_product?.name || '',
                dosage: `${item.morning || 0}-${item.afternoon || 0}-${item.evening || 0}-${item.night || 0}`,
                days: item.days?.toString() || '3',
                quantity: ((item.morning || 0) + (item.afternoon || 0) + (item.evening || 0) + (item.night || 0)) * (item.days || 3)
            })) || [],
            labTests: labTests
        }

        return NextResponse.json({
            success: true,
            data: formattedData,
            date: lastPrescription.created_at
        })

    } catch (error) {
        console.error('Error fetching last prescription:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch last prescription'
        }, { status: 500 })
    }
}
