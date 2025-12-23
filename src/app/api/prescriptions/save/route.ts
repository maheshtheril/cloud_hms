import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { patientId, appointmentId, vitals, diagnosis, complaint, examination, plan, medicines } = body

        if (!patientId) {
            return NextResponse.json({ error: 'Patient ID required' }, { status: 400 })
        }

        // Create prescription with all items in a transaction
        const prescription = await prisma.prescription.create({
            data: {
                tenant_id: session.user.tenantId,
                patient_id: patientId,
                appointment_id: appointmentId || null,
                vitals: vitals || '',
                diagnosis: diagnosis || '',
                complaint: complaint || '',
                examination: examination || '',
                plan: plan || '',
                prescription_items: {
                    create: medicines.map((med: any) => {
                        // Parse dosage (e.g., "1-0-1" or "1-1-1-1")
                        const dosageParts = med.dosage.split('-').map((n: string) => parseInt(n) || 0)
                        return {
                            medicine_id: med.id || med.medicineId, // Support both from search and from database
                            morning: dosageParts[0] || 0,
                            afternoon: dosageParts[1] || 0,
                            evening: dosageParts[2] || 0,
                            night: dosageParts[3] || 0,
                            days: parseInt(med.days) || 3
                        }
                    })
                }
            },
            include: {
                prescription_items: {
                    include: {
                        hms_product: {
                            select: {
                                id: true,
                                name: true,
                                sku: true,
                                price: true
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            prescriptionId: prescription.id,
            medicines: prescription.prescription_items.map(item => ({
                id: item.hms_product.id,
                name: item.hms_product.name,
                sku: item.hms_product.sku,
                price: item.hms_product.price,
                quantity: (item.morning + item.afternoon + item.evening + item.night) * item.days
            }))
        })
    } catch (error) {
        console.error('Error saving prescription:', error)
        return NextResponse.json({
            error: 'Failed to save prescription',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
