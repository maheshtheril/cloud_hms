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

        // Check if prescription table exists
        // @ts-ignore - prescription table doesn't exist yet in schema
        const prescriptionTableExists = prisma.prescription !== undefined

        if (!prescriptionTableExists) {
            return NextResponse.json({
                success: false,
                message: 'Prescription feature not yet configured. Database tables needed.'
            })
        }

        // Fetch the most recent prescription for this patient
        // @ts-ignore - prescription table doesn't exist yet in schema
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
                        medicine: true
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

        // Transform to frontend format
        const formattedData = {
            vitals: lastPrescription.vitals || '',
            diagnosis: lastPrescription.diagnosis || '',
            complaint: lastPrescription.complaint || '',
            examination: lastPrescription.examination || '',
            plan: lastPrescription.plan || '',
            medicines: lastPrescription.prescription_items?.map((item: any) => ({
                medicineId: item.medicine_id,
                medicineName: item.medicine?.name || '',
                morning: item.morning?.toString() || '0',
                afternoon: item.afternoon?.toString() || '0',
                evening: item.evening?.toString() || '0',
                night: item.night?.toString() || '0',
                days: item.days?.toString() || '3'
            })) || []
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
