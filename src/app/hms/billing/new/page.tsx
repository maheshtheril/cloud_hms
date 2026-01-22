import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CompactInvoiceEditor } from "@/components/billing/invoice-editor-compact"
import { getBillableItems, getTaxConfiguration, getUoms } from "@/app/actions/billing"
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
        ref?: string
    }>
}) {
    const session = await auth();
    if (!session?.user?.tenantId) return <div>Unauthorized</div>;

    const params = await searchParams;
    const patientId = params.patientId;
    const medicines = params.medicines;
    const items = params.items;
    const appointmentId = params.appointmentId || params.ref;
    const labOrderId = params.labOrderId;
    const tenantId = session.user.tenantId;

    // Parallel data fetching
    const [patients, itemsRes, taxRes, uomsRes, companySettings] = await Promise.all([
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
        getTaxConfiguration(),
        getUoms(),
        prisma.company_settings.findUnique({
            where: { company_id: session.user.companyId || session.user.tenantId },
            include: { currencies: true }
        })
    ]);

    const billableItems = itemsRes.success ? itemsRes.data : [];
    const taxConfig = taxRes.success ? taxRes.data : { defaultTax: null, taxRates: [] };
    const uoms = (uomsRes as any).success ? (uomsRes as any).data : [];
    const currency = companySettings?.currencies?.symbol || '₹';

    // Standardization logic for initial items
    let initialItems = items ? JSON.parse(decodeURIComponent(items)) : (medicines ? JSON.parse(decodeURIComponent(medicines)) : []);
    let initialInvoice = null;

    // IF APPOINTMENT ID IS PRESENT, ENRICH INITIAL ITEMS
    if (appointmentId) {
        // 0. Check for EXISTING DRAFT INVOICE (e.g., from Nursing Consumption)
        const draftInvoice = await prisma.hms_invoice.findFirst({
            where: {
                appointment_id: appointmentId,
                status: 'draft'
            },
            include: {
                hms_invoice_lines: {
                    include: { hms_product: true }
                },
                hms_patient: true
            }
        });

        if (draftInvoice) {
            initialInvoice = draftInvoice;
        }

        const appointment = await prisma.hms_appointments.findUnique({
            where: { id: appointmentId },
            include: {
                hms_clinician: true,
                hms_patient: true
            }
        });

        if (appointment) {
            // 1. Add Consultation Fee if clinician has one
            const consultationFee = Number(appointment.hms_clinician?.consultation_fee) || 0;
            if (consultationFee > 0) {
                // Check if already in draft lines
                const hasConsultation = draftInvoice?.hms_invoice_lines.some(l => l.description?.includes('Consultation Fee'));
                if (!hasConsultation) {
                    initialItems.unshift({
                        id: appointment.clinician_id,
                        name: `Consultation Fee - Dr. ${appointment.hms_clinician?.first_name} ${appointment.hms_clinician?.last_name}`,
                        price: consultationFee,
                        quantity: 1,
                        type: 'service'
                    });
                }
            }

            // 2. Add Registration Fee if not paid (Check patient metadata)
            const registrationPaid = (appointment.hms_patient?.metadata as any)?.registration_fees_paid;
            if (!registrationPaid) {
                const hasRegFee = draftInvoice?.hms_invoice_lines.some(l => l.description === 'Registration Fee') || initialItems.some((i: any) => i.name === 'Registration Fee');

                if (!hasRegFee) {
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
            // 3. Add Nurse Consumables from Stock Moves (Fallback if not already in draft invoice)
            const stockMoves = await prisma.hms_stock_move.findMany({
                where: {
                    source_reference: appointmentId,
                    source: 'Nursing Consumption'
                }
            });

            stockMoves.forEach(move => {
                const alreadyInDraft = draftInvoice?.hms_invoice_lines.some(l => l.product_id === move.product_id);
                const alreadyInInitial = initialItems.some((i: any) => i.id === move.product_id);

                // Lookup product info from billableItems
                const productInfo = billableItems.find((p: any) => p.id === move.product_id);

                if (!alreadyInDraft && !alreadyInInitial && productInfo) {
                    initialItems.push({
                        id: move.product_id,
                        name: `(Nurse) ${productInfo.label}`,
                        price: Number(productInfo.price) || 0,
                        quantity: Number(move.qty),
                        type: 'item'
                    });
                }
            });

            // 4. Add Doctor Prescribed Medicines
            // Try by appointmentId first, then fallback to latest for patient if not found
            let doctorPrescription = await (prisma as any).prescription.findFirst({
                where: { appointment_id: appointmentId },
                include: {
                    prescription_items: {
                        include: { hms_product: true }
                    }
                },
                orderBy: { created_at: 'desc' }
            });

            if (!doctorPrescription && patientId) {
                doctorPrescription = await (prisma as any).prescription.findFirst({
                    where: {
                        patient_id: patientId,
                        created_at: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0)) // Recorded Today
                        }
                    },
                    include: {
                        prescription_items: {
                            include: { hms_product: true }
                        }
                    },
                    orderBy: { created_at: 'desc' }
                });
            }

            if (doctorPrescription) {
                doctorPrescription.prescription_items.forEach((item: any) => {
                    const alreadyInDraft = draftInvoice?.hms_invoice_lines.some(l => l.product_id === item.medicine_id);
                    const alreadyInInitial = initialItems.some((i: any) => i.id === item.medicine_id);

                    if (!alreadyInDraft && !alreadyInInitial && item.hms_product) {
                        const totalQty = (item.morning + item.afternoon + item.evening + item.night) * item.days;
                        if (totalQty > 0) {
                            initialItems.push({
                                id: item.medicine_id,
                                name: item.hms_product.name,
                                price: Number(item.hms_product.price) || 0,
                                quantity: totalQty,
                                type: 'item'
                            });
                        }
                    }
                });
            }

            // 5. [EXCLUDED] Lab Orders for this Encounter (Removed as per Reception Final Bill Standard)
        }
    }

    let effectivePatientId = patientId;

    // [EXCLUDED] Direct Lab Order Billing (Reception skips this for Final Bill #2)
    /*
    if (labOrderId) {
        ... (rest omitted for brevity or just remove it)
    }
    */

    return (
        <CompactInvoiceEditor
            key={`${appointmentId || 'no-apt'}-${patientId || 'no-pat'}`}
            patients={JSON.parse(JSON.stringify(patients))}
            billableItems={JSON.parse(JSON.stringify(billableItems))}
            uoms={JSON.parse(JSON.stringify(uoms))}
            taxConfig={JSON.parse(JSON.stringify(taxConfig))}
            initialPatientId={effectivePatientId}
            initialMedicines={initialItems}
            appointmentId={appointmentId}
            initialInvoice={initialInvoice ? JSON.parse(JSON.stringify(initialInvoice)) : null}
            currency={currency}
        />
    )
}

