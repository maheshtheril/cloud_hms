import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

/**
 * API to fetch patient's recent prescriptions with medicines
 * Used by pharmacy to auto-fill sale bill
 * 
 * GET /api/prescriptions/by-patient/[patientId]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ patientId: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { patientId } = await params

        // Fetch recent prescriptions for the patient (last 30 days)
        const prescriptions = await prisma.prescription.findMany({
            where: {
                tenant_id: session.user.tenantId,
                patient_id: patientId,
                created_at: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                }
            },
            include: {
                prescription_items: {
                    include: {
                        hms_product: {
                            select: {
                                id: true,
                                name: true,
                                price: true, // Use price field (not sale_price)
                                active: true,
                                category: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            },
            take: 5 // Last 5 prescriptions
        })

        // Transform data for pharmacy sale bill
        const result = prescriptions.map(rx => ({
            prescription_id: rx.id,
            visit_date: rx.visit_date,
            diagnosis: rx.diagnosis,
            doctor_id: rx.doctor_id,

            // Medicines with calculated quantities
            medicines: rx.prescription_items
                .filter((item: any) => item.hms_product?.active) // Only active medicines
                .map((item: any) => {
                    // Calculate total quantity based on dosage
                    // morning + afternoon + evening + night = doses per day
                    const dosesPerDay =
                        (item.morning || 0) +
                        (item.afternoon || 0) +
                        (item.evening || 0) +
                        (item.night || 0)

                    const totalDoses = dosesPerDay * (item.days || 0)

                    return {
                        id: item.medicine_id,
                        name: item.hms_product?.name || 'Unknown Medicine',
                        category: item.hms_product?.category,

                        // Dosage info
                        morning: item.morning,
                        afternoon: item.afternoon,
                        evening: item.evening,
                        night: item.night,
                        days: item.days,

                        // Calculated quantity
                        quantity: totalDoses,

                        // Pricing
                        unit_price: item.hms_product?.price ?
                            Number(item.hms_product.price) : 0,

                        // Description for invoice
                        description: `${item.hms_product?.name} - ${dosesPerDay}x daily for ${item.days} days`
                    }
                })
        }))

        // Get most recent prescription (if any)
        const latestPrescription = result.length > 0 ? result[0] : null

        console.log('📋 Fetched prescriptions for pharmacy:', {
            patientId,
            prescriptionCount: result.length,
            latestPrescriptionId: latestPrescription?.prescription_id,
            medicineCount: latestPrescription?.medicines.length || 0
        })

        return NextResponse.json({
            success: true,
            patient_id: patientId,
            prescriptions: result,
            latest: latestPrescription
        })

    } catch (error) {
        console.error('Error fetching prescriptions:', error)
        return NextResponse.json({
            error: 'Failed to fetch prescriptions',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
