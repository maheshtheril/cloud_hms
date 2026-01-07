import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CompactInvoiceEditor } from "@/components/billing/invoice-editor-compact"
import { getBillableItems, getTaxConfiguration } from "@/app/actions/billing"
import { auth } from "@/auth"

export default async function NewInvoicePage({
    searchParams
}: {
    searchParams: Promise<{
        patientId?: string
        medicines?: string
        items?: string
        appointmentId?: string
        labOrderId?: string
    }>
}) {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) return <div>Unauthorized</div>;

    const { patientId, medicines, items, appointmentId, labOrderId } = await searchParams;
    const tenantId = session.user.tenantId;

    // Parallel data fetching
    const [patients, itemsRes, taxRes] = await Promise.all([
        prisma.hms_patient.findMany({
            where: {
                tenant_id: tenantId // Filter by current user's tenant
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                contact: true,
                patient_number: true,
                dob: true,
                gender: true,
                metadata: true
            },
            orderBy: { updated_at: 'desc' },
            take: 50
        }),
        getBillableItems(),
        getTaxConfiguration()
    ]);

    const billableItems = itemsRes.success ? itemsRes.data : [];
    const taxConfig = taxRes.success ? taxRes.data : { defaultTax: null, taxRates: [] };

    // Standardization logic for initial items
    let initialItems = items ? JSON.parse(decodeURIComponent(items)) : (medicines ? JSON.parse(decodeURIComponent(medicines)) : []);

    // IF APPOINTMENT ID IS PRESENT, ENRICH INITIAL ITEMS
    if (appointmentId) {
        const appointment = await prisma.hms_appointments.findUnique({
            where: { id: appointmentId },
            include: {
                hms_clinician: true,
                hms_patient: true,
                hms_lab_order: {
                    include: {
                        hms_lab_order_line: {
                            include: { hms_lab_test: true }
                        }
                    }
                }
            }
        });

        if (appointment) {
            // 1. Add Consultation Fee if clinician has one
            const consultationFee = Number(appointment.hms_clinician?.consultation_fee) || 0;
            if (consultationFee > 0) {
                initialItems.unshift({
                    id: appointment.clinician_id,
                    name: `Consultation Fee - Dr. ${appointment.hms_clinician?.first_name} ${appointment.hms_clinician?.last_name}`,
                    price: consultationFee,
                    quantity: 1,
                    type: 'service'
                });
            }

            // 2. Add Lab Tests
            appointment.hms_lab_order.forEach(order => {
                order.hms_lab_order_line.forEach(line => {
                    if (line.hms_lab_test) {
                        initialItems.push({
                            id: line.test_id,
                            name: `Lab: ${line.hms_lab_test.name}`,
                            price: Number(line.price) || 0,
                            quantity: 1,
                            type: 'service'
                        });
                    }
                });
            });

            // 3. Add Registration Fee if not paid (Check patient metadata)
            const registrationPaid = (appointment.hms_patient?.metadata as any)?.registration_fees_paid;
            if (!registrationPaid) {
                // Fetch the current registration fee from hms_patient_registration_fees if available
                const regFeeRecord = await prisma.hms_patient_registration_fees.findFirst({
                    where: { tenant_id: tenantId, is_active: true }
                });
                if (regFeeRecord) {
                    initialItems.push({
                        id: 'reg-fee',
                        name: 'Registration Fee',
                        price: Number(regFeeRecord.fee_amount),
                        quantity: 1,
                        type: 'service'
                    });
                }
            }
        }
    }

    let effectivePatientId = patientId;

    // IF LAB ORDER ID IS PRESENT (Direct billing from Lab)
    if (labOrderId) {
        const labOrder = await prisma.hms_lab_order.findUnique({
            where: { id: labOrderId },
            include: {
                hms_patient: true,
                hms_lab_order_line: {
                    include: { hms_lab_test: true }
                }
            }
        });

        if (labOrder) {
            // Pre-select patient if not already passed
            if (!effectivePatientId && labOrder.patient_id) {
                effectivePatientId = labOrder.patient_id;
            }

            labOrder.hms_lab_order_line.forEach(line => {
                if (line.hms_lab_test) {
                    // Check if item already exists to avoid dupes if both appointmentId and labOrderId passed
                    const exists = initialItems.some((i: any) => i.name === `Lab: ${line.hms_lab_test!.name}`);
                    if (!exists) {
                        initialItems.push({
                            id: '',
                            name: `Lab: ${line.hms_lab_test.name}`,
                            price: Number(line.price) || 0,
                            quantity: 1,
                            type: 'service'
                        });
                    }
                }
            });
        }
    }

    return (
        <CompactInvoiceEditor
            patients={JSON.parse(JSON.stringify(patients))}
            billableItems={JSON.parse(JSON.stringify(billableItems))}
            taxConfig={JSON.parse(JSON.stringify(taxConfig))}
            initialPatientId={effectivePatientId}
            initialMedicines={initialItems}
            appointmentId={appointmentId}
        />
    )
}
