import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        let { patientId, appointmentId, vitals, diagnosis, complaint, examination, plan, medicines, labTests } = body

        // If patientId is missing but appointmentId is present, try to find patientId from appointment
        if (!patientId && appointmentId) {
            const appointment = await prisma.hms_appointments.findUnique({
                where: { id: appointmentId },
                select: { patient_id: true }
            });
            if (appointment) {
                patientId = appointment.patient_id;
            }
        }

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
            // 3. Create new prescription using Raw SQL
            const pId = crypto.randomUUID();
            await tx.$executeRaw`
                INSERT INTO prescription (
                    id, tenant_id, company_id, patient_id, appointment_id,
                    vitals, diagnosis, complaint, examination, plan,
                    visit_date, created_at, updated_at, doctor_id
                ) VALUES (
                    CAST(${pId} AS uuid),
                    CAST(${session.user.tenantId} AS uuid),
                    CAST(${userCompanyId || null} AS uuid),
                    CAST(${patientId} AS uuid),
                    CAST(${appointmentId || null} AS uuid),
                    ${vitals || ''},
                    ${diagnosis || ''},
                    ${complaint || ''},
                    ${examination || ''},
                    ${plan || ''},
                    NOW(), NOW(), NOW(),
                    CAST(${session.user.id || null} AS uuid)
                )
            `;

            // 3.1 Create Prescription Items
            for (const med of resolvedMedicines) {
                const dosageParts = (med.dosage || '0-0-0').split('-').map((n: string) => parseInt(n) || 0)
                await tx.$executeRaw`
                    INSERT INTO prescription_items (
                        id, prescription_id, medicine_id, 
                        morning, afternoon, evening, night, days, created_at
                    ) VALUES (
                        gen_random_uuid(),
                        CAST(${pId} AS uuid),
                        CAST(${med.resolvedId} AS uuid),
                        ${dosageParts[0] || 0},
                        ${dosageParts[1] || 0},
                        ${dosageParts[2] || 0},
                        ${dosageParts[3] || 0},
                        ${parseInt(med.days) || 3},
                        NOW()
                    )
                `;
            }

            // Fetch created prescription for return (mimic original behavior)
            const prArr: any[] = await tx.$queryRaw`
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
                JOIN prescription_items pi ON p.id = pi.prescription_id
                JOIN hms_product prod ON pi.medicine_id = prod.id
                WHERE p.id::text = CAST(${pId} AS text)
                GROUP BY p.id
            `;
            const pr = prArr[0];


            // 4. Handle Lab Orders
            if (labTests && labTests.length > 0) {
                // 4a. Resolve Lab Test IDs (Handle custom labs)
                const resolvedLabTests = [];
                for (const test of labTests) {
                    let tId = test.id;
                    let testName = test.name || test.testName;

                    if (!testName) continue; // Skip invalid

                    // Check if this ID actually exists? Or just search by name?
                    // Simplest strategy: try to find by ID if it looks valid, then name.
                    // Since frontend generates random UUIDs for custom tests, we can treat them as "unknown" if they don't match db.

                    let existingTest = null;

                    // If ID is potentially valid (not checking format strictly here, but assuming db lookup handles it)
                    if (tId) {
                        existingTest = await tx.hms_lab_test.findUnique({ where: { id: tId } }).catch(() => null);
                    }

                    if (!existingTest) {
                        // Try finding by name
                        existingTest = await tx.hms_lab_test.findFirst({
                            where: {
                                name: { equals: testName, mode: 'insensitive' },
                                tenant_id: session.user.tenantId
                            }
                        });
                    }

                    if (existingTest) {
                        tId = existingTest.id;
                    } else {
                        // Create new Lab Test
                        const newTest = await tx.hms_lab_test.create({
                            data: {
                                tenant_id: session.user.tenantId,
                                company_id: userCompanyId || (await tx.company.findFirst({ where: { tenant_id: session.user.tenantId } }))?.id || null,
                                name: testName,
                                code: `LAB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                            }
                        });
                        tId = newTest.id;
                    }

                    resolvedLabTests.push({ ...test, resolvedId: tId });
                }

                // Clear existing REQUESTED lab orders for this appointment to avoid duplicates on update
                if (appointmentId) {
                    await tx.hms_lab_order.deleteMany({
                        where: {
                            encounter_id: appointmentId,
                            status: 'requested',
                            tenant_id: session.user.tenantId
                        }
                    })
                }

                // Ensure we have a valid company_id (UUID or null, NOT empty string)
                let finalCompanyId = userCompanyId;
                if (!finalCompanyId) {
                    const c = await tx.company.findFirst({ where: { tenant_id: session.user.tenantId } });
                    finalCompanyId = c?.id || null;
                }

                if (resolvedLabTests.length > 0) {
                    const labOrderId = crypto.randomUUID();
                    const orderNumber = `LAB-${Date.now()}`;

                    await tx.$executeRaw`
                        INSERT INTO hms_lab_order (
                            id, tenant_id, company_id, patient_id, encounter_id, 
                            status, order_number, ordered_at, created_at
                        ) VALUES (
                            CAST(${labOrderId} AS uuid),
                            CAST(${session.user.tenantId} AS uuid),
                            CAST(${finalCompanyId} AS uuid),
                            CAST(${patientId} AS uuid),
                            CAST(${appointmentId || null} AS uuid),
                            'requested',
                            ${orderNumber},
                            NOW(), NOW()
                        )
                    `;

                    for (const test of resolvedLabTests) {
                        await tx.$executeRaw`
                            INSERT INTO hms_lab_order_line (
                                id, tenant_id, company_id, order_id, test_id, status, price, created_at
                            ) VALUES (
                                gen_random_uuid(),
                                CAST(${session.user.tenantId} AS uuid),
                                CAST(${finalCompanyId} AS uuid),
                                CAST(${labOrderId} AS uuid),
                                CAST(${test.resolvedId} AS uuid),
                                'pending',
                                ${test.price || 0},
                                NOW()
                            )
                        `;
                    }
                }
            }

            // 5. Automate Patient Flow: Mark appointment status
            if (appointmentId) {
                const targetStatus = (labTests && labTests.length > 0) ? 'in_progress' : 'completed';
                await tx.$executeRaw`
                    UPDATE hms_appointments 
                    SET status = ${targetStatus},
                        updated_at = NOW()
                    WHERE id::text = CAST(${appointmentId} AS text)
                `;

                // Use Next.js revalidation to update all dashboards
                const { revalidatePath } = await import('next/cache')
                revalidatePath('/hms/doctor/dashboard')
                revalidatePath('/hms/reception/dashboard')
                revalidatePath('/hms/nursing')
                revalidatePath('/hms/patients/[id]', 'page')
            }

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
