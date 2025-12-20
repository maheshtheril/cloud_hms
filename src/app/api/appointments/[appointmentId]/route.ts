import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

// This API fetches appointment details including consultation fee and lab tests
// TODO: Replace with real appointment table when implemented

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ appointmentId: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { appointmentId } = await params

        // TODO: Replace this with actual database query when appointments table exists
        // For now, return structure for demo/testing

        // const appointment = await prisma.hms_appointment.findFirst({
        //     where: {
        //         id: appointmentId,
        //         tenant_id: session.user.tenantId
        //     },
        //     include: {
        //         lab_tests: true
        //     }
        // })

        // TEMPORARY: Mock data for demonstration
        // Remove this when real appointments table is added
        const mockAppointment = {
            id: appointmentId,
            patient_id: 'patient-123',
            consultation_fee: 500.00,
            status: 'completed',
            appointment_date: new Date(),
            doctor_id: session.user.id,
            // Mock lab tests
            lab_tests: [
                {
                    id: 'test-1',
                    test_name: 'CBC Blood Test',
                    test_fee: 800.00
                },
                {
                    id: 'test-2',
                    test_name: 'X-Ray Chest',
                    test_fee: 600.00
                }
            ]
        }

        return NextResponse.json({
            success: true,
            appointment: mockAppointment
        })

    } catch (error) {
        console.error('Error fetching appointment:', error)
        return NextResponse.json({
            error: 'Failed to fetch appointment',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
