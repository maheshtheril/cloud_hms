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

        // Create prescription and update appointment status in a transaction
        const prescription = await prisma.$transaction(async (tx) => {
            const userCompanyId = (session.user as any).companyId;

            // 1. Resolve medicine IDs (handle custom medicines)
            const resolvedMedicines = [];
            for (const med of medicines) {
                let mId = med.id || med.medicineId;

                // If ID is missing, try to find by name or create a new product
                if (!mId || mId === '' || mId === 'undefined') {
                    if (!med.name) continue; // Skip if no name

                    // Ensure we have a company_id for the product
                    let targetCompanyId = userCompanyId;
                    if (!targetCompanyId) {
                        const firstCompany = await tx.company.findFirst({
                            where: { tenant_id: session.user.tenantId },
                            select: { id: true }
                        });
                        targetCompanyId = firstCompany?.id;
                    }

                    if (!targetCompanyId) {
                        throw new Error(`Cannot create product "${med.name}" because no company is associated with this tenant.`);
                    }

                    const existingProduct = await tx.hms_product.findFirst({
                        where: {
                            name: { equals: med.name, mode: 'insensitive' },
                            tenant_id: session.user.tenantId
                        }
                    });

                    if (existingProduct) {
                        mId = existingProduct.id;
                    } else {
                        const newProduct = await tx.hms_product.create({
                            data: {
                                tenant_id: session.user.tenantId,
                                company_id: targetCompanyId,
                                sku: `MED-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                                name: med.name,
                                is_active: true,
                                is_stockable: true,
                                price: 0,
                                uom: 'Unit'
                            }
                        });
                        mId = newProduct.id;
                    }
                }
                if (!mId || mId === '' || mId === 'undefined') {
                    throw new Error(`Technical Error: Could not resolve product ID for "${med.name}". Please ensure the medicine exists in the catalog or can be auto-created.`);
                }

                resolvedMedicines.push({ ...med, resolvedId: mId });
            }

            // 1.5 Safety check: Ensure all medicines have an ID
            if (resolvedMedicines.length === 0 && medicines.length > 0) {
                throw new Error("No valid medicines were found in the request.");
            }

            // 2. Clear existing prescription for this appointment if any
            if (appointmentId) {
                const existing = await (tx.prescription as any).findFirst({
                    where: { appointment_id: appointmentId, tenant_id: session.user.tenantId }
                })
                if (existing) {
                    await (tx.prescription as any).delete({ where: { id: existing.id } })
                }
            }

            // 3. Create new prescription
            const pr = await (tx.prescription as any).create({
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
                        create: resolvedMedicines.map((med: any) => {
                            const dosageParts = (med.dosage || '0-0-0').split('-').map((n: string) => parseInt(n) || 0)
                            return {
                                medicine_id: med.resolvedId,
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

            return pr
        })

        return NextResponse.json({
            success: true,
            prescriptionId: prescription.id,
            medicines: (prescription as any).prescription_items.map((item: any) => ({
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
