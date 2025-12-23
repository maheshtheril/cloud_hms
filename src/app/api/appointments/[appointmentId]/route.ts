import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// This API fetches appointment details including consultation fee, services, and lab tests
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

        // Fetch the appointment with patient and clinician details (for fee)
        const appointment = await prisma.hms_appointments.findFirst({
            where: {
                id: appointmentId,
                tenant_id: session.user.tenantId
            },
            include: {
                hms_patient: true,
                hms_clinician: true
            }
        })

        if (!appointment) {
            return NextResponse.json({
                error: 'Appointment not found'
            }, { status: 404 })
        }

        // Fetch appointment services (e.g., consultation fees, procedures)
        const services = await prisma.hms_appointment_services.findMany({
            where: {
                tenant_id: session.user.tenantId,
                appointment_id: appointmentId
            },
            select: {
                id: true,
                service_id: true,
                qty: true,
                unit_price: true,
                total_price: true,
                notes: true
            }
        })

        // Fetch consultation fee from billing rules
        // Try clinician-specific rule first, then department, then default
        const consultationFeeRule = await prisma.hms_billing_rule.findFirst({
            where: {
                tenant_id: session.user.tenantId,
                OR: [
                    {
                        applies_to: 'clinician',
                        applies_to_id: appointment.clinician_id
                    },
                    {
                        applies_to: 'department',
                        applies_to_id: appointment.department_id || undefined
                    }
                ]
            },
            orderBy: [
                // Prioritize clinician-specific rules
                { applies_to: 'asc' }
            ]
        })

        // Standard consultation fee hierarchy:
        // 1. Specific Billing Rule
        // 2. Clinician's own fee (new standard field)
        // 3. Service notes fallback
        // 4. Default 0
        const consultation_fee = consultationFeeRule?.price
            || (appointment as any).hms_clinician?.consultation_fee
            || services.find(s => s.notes?.includes('consultation'))?.unit_price
            || 0

        // Fetch lab orders for this appointment
        // Strategy:
        // 1. First try to find by encounter_id (if appointment has an encounter)
        // 2. Fall back to patient_id + time range (within appointment window)
        // 3. TODO: Add appointment_id column to hms_lab_order for direct linking

        let labOrders;

        // Check if there's an encounter linked to this appointment
        const encounter = await prisma.hms_encounter.findFirst({
            where: {
                tenant_id: session.user.tenantId,
                patient_id: appointment.patient_id,
                started_at: {
                    gte: new Date(new Date(appointment.starts_at).getTime() - 3600000), // 1 hour before
                    lte: new Date(new Date(appointment.ends_at).getTime() + 3600000)   // 1 hour after
                }
            }
        })

        if (encounter) {
            // Better: Find lab orders by encounter_id
            labOrders = await prisma.hms_lab_order.findMany({
                where: {
                    tenant_id: session.user.tenantId,
                    encounter_id: encounter.id
                },
                include: {
                    hms_lab_order_lines: {
                        include: {
                            hms_lab_test: {
                                select: {
                                    id: true,
                                    name: true,
                                    code: true
                                }
                            }
                        }
                    }
                }
            })
        } else {
            // Fallback: Find by patient + time correlation
            // This is less accurate but works when no encounter exists
            labOrders = await prisma.hms_lab_order.findMany({
                where: {
                    tenant_id: session.user.tenantId,
                    patient_id: appointment.patient_id,
                    ordered_at: {
                        gte: new Date(new Date(appointment.starts_at).getTime() - 3600000), // 1 hour before
                        lte: new Date(new Date(appointment.ends_at).getTime() + 3600000)   // 1 hour after
                    }
                },
                include: {
                    hms_lab_order_lines: {
                        include: {
                            hms_lab_test: {
                                select: {
                                    id: true,
                                    name: true,
                                    code: true
                                }
                            }
                        }
                    }
                }
            })
        }

        // Flatten lab tests from all orders
        const lab_tests = labOrders.flatMap(order =>
            order.hms_lab_order_lines.map(line => ({
                id: line.id,
                test_name: line.requested_name || line.hms_lab_test?.name || 'Unknown Test',
                test_code: line.requested_code || line.hms_lab_test?.code,
                test_fee: line.price || 0
            }))
        )

        // Fetch prescriptions linked to this appointment
        const prescription = await (prisma.prescription as any).findFirst({
            where: {
                appointment_id: appointmentId,
                tenant_id: session.user.tenantId
            },
            include: {
                prescription_items: {
                    include: {
                        hms_product: true
                    }
                }
            }
        })

        const prescription_items = prescription ? prescription.prescription_items.map((item: any) => ({
            id: item.hms_product.id,
            name: item.hms_product.name,
            sku: item.hms_product.sku,
            price: Number(item.hms_product.price || 0),
            // Calculate qty: (morning + afternoon + evening + night) * days
            quantity: (item.morning + item.afternoon + item.evening + item.night) * item.days
        })) : []

        // Build response
        const responseData = {
            id: appointment.id,
            patient_id: appointment.patient_id,
            clinician_id: appointment.clinician_id,
            appointment_date: appointment.starts_at,
            consultation_fee: Number(consultation_fee),
            status: appointment.status,
            type: appointment.type,
            mode: appointment.mode,
            services: services.map(s => ({
                id: s.id,
                service_id: s.service_id,
                description: s.notes || 'Service',
                qty: Number(s.qty || 1),
                unit_price: Number(s.unit_price || 0),
                total_price: Number(s.total_price || 0)
            })),
            lab_tests: lab_tests.map(t => ({
                id: t.id,
                test_name: t.test_name,
                test_code: t.test_code,
                test_fee: Number(t.test_fee)
            })),
            prescription_items
        }

        console.log('📋 Appointment billing data fetched:', {
            appointmentId,
            patientId: responseData.patient_id,
            consultationFee: responseData.consultation_fee,
            servicesCount: responseData.services.length,
            labTestsCount: responseData.lab_tests.length,
            prescriptionItemsCount: responseData.prescription_items.length
        })

        return NextResponse.json({
            success: true,
            appointment: responseData
        })

    } catch (error) {
        console.error('Error fetching appointment:', error)
        return NextResponse.json({
            error: 'Failed to fetch appointment',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
