'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth" // Correct auth import
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { isUUID, safeNum } from "@/lib/utils/is-uuid"

export async function getAppointmentsProp(start: Date, end: Date) {
    const session = await auth();
    if (!session?.user?.companyId) return { success: false, error: "Unauthorized" };

    try {
        const appointments = await prisma.hms_appointments.findMany({
            where: {
                tenant_id: session.user.tenantId, // Strict scope
                company_id: session.user.companyId,
                starts_at: {
                    gte: start,
                    lte: end
                },
                deleted_at: null
            }
        });

        // Manual fetch of patients
        const patientIds = appointments.map(a => a.patient_id).filter(id => id) as string[];
        const patients = await prisma.hms_patient.findMany({
            where: {
                id: { in: patientIds },
                tenant_id: session.user.tenantId // Filter by tenant
            },
            select: { id: true, first_name: true, last_name: true, patient_number: true }
        });

        const patientMap = new Map(patients.map(p => [p.id, p]));

        // Transform for calendar
        const events = appointments.map(apt => {
            const patient = apt.patient_id ? patientMap.get(apt.patient_id) : null;
            return {
                id: apt.id,
                title: patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient',
                start: apt.starts_at,
                end: apt.ends_at,
                resource: apt,
                status: apt.status
            };
        });

        return { success: true, data: events };
    } catch (error) {
        console.error("Failed to fetch appointments:", error);
        return { success: false, error: "Failed to fetch appointments" };
    }
}

export async function createAppointment(formData: FormData) {
    const session = await auth();
    // Allow if tenantId is present. Fallback companyId to tenantId if missing.
    if (!session?.user?.id || !session?.user?.tenantId) {
        return { error: "Unauthorized" }
    }
    const companyId = session.user.companyId || session.user.tenantId;

    const patientId = formData.get("patient_id") as string
    const clinicianId = formData.get("clinician_id") as string
    const dateStr = formData.get("date") as string
    const timeStr = formData.get("time") as string

    // Advanced Fields
    const type = formData.get("type") as string || 'consultation'
    const mode = formData.get("mode") as string || 'in_person'
    const priority = formData.get("priority") as string || 'normal'
    const notes = formData.get("notes") as string

    if (!patientId || !clinicianId || !dateStr || !timeStr) {
        return { error: "Missing required fields" }
    }

    // Combine date and time
    const startsAt = new Date(`${dateStr}T${timeStr}:00`)

    // =====================================================================
    // [SERVER-SIDE REG FEE GUARD] — Two-pronged, cannot be bypassed
    // 1. Check metadata flags
    // 2. Check for outstanding registration invoices in DB
    // =====================================================================
    const [patient, unpaidRegInvoice] = await Promise.all([
        prisma.hms_patient.findUnique({
            where: { id: patientId },
            select: { metadata: true, created_at: true }
        }),
        // Look for any outstanding invoice that has a registration-related line
        prisma.hms_invoice.findFirst({
            where: {
                patient_id: patientId,
                status: { in: ['draft', 'posted'] },
                outstanding_amount: { gt: 0 },
                hms_invoice_lines: {
                    some: {
                        description: { contains: 'egistration', mode: 'insensitive' }
                    }
                }
            },
            select: { id: true, outstanding_amount: true }
        })
    ]);

    if (unpaidRegInvoice) {
        return { error: `⛔ Registration fee of ₹${Number(unpaidRegInvoice.outstanding_amount).toFixed(0)} is outstanding. Collect it before booking.` };
    }

    if (patient) {
        const meta = (patient.metadata as any) || {};
        const expiryStr = meta.registration_expiry;
        const isAwaitingPayment = meta.status === 'awaiting_payment';
        const isFeesNotPaid = meta.registration_fees_paid !== true && meta.registration_fees_paid !== undefined;
        const isExpired = expiryStr ? new Date(expiryStr) < new Date() : false;

        if (isAwaitingPayment) {
            return { error: `⛔ Registration fee is pending. Collect it before booking an appointment.` };
        }
        if (isExpired) {
            return { error: `⛔ Patient's registration has expired. Renew the registration before booking.` };
        }
    }
    // =====================================================================

    // NUCLEAR LOCK: Prevent concurrent bookings for the same patient/clinician on this day
    const lockKey = `${patientId}_${clinicianId}_${dateStr}`;
    const startOfDay = new Date(`${dateStr}T00:00:00`);
    const endOfDay = new Date(`${dateStr}T23:59:59`);
    let createdApt;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // [ATOMIC-GUARD] Acquire session-level lock for this specific booking context
            await tx.$executeRawUnsafe(`SELECT pg_advisory_xact_lock(hashtext('${lockKey}'))`);

            // 1. DUPLICATE CHECK (Inside lock)
            const existing = await tx.hms_appointments.findFirst({
                where: {
                    patient_id: patientId,
                    clinician_id: clinicianId,
                    starts_at: {
                        gte: startOfDay,
                        lte: endOfDay
                    },
                    status: { notIn: ['cancelled'] },
                    deleted_at: null
                }
            })

            if (existing) {
                return { _isDuplicate: true, data: existing };
            }

            // 2. Fetch doctor's slot duration (using tx)
            const clinician = await tx.hms_clinicians.findUnique({
                where: { id: clinicianId },
                select: { consultation_slot_duration: true }
            })

            const durationMinutes = clinician?.consultation_slot_duration || 30
            const endsAt = new Date(startsAt.getTime() + durationMinutes * 60000)

            // 3. Create Appointment
            const created = await tx.$queryRaw`
                INSERT INTO hms_appointments (
                    id, tenant_id, company_id, patient_id, clinician_id,
                    starts_at, ends_at, type, mode, priority, notes, status, created_by, branch_id
                ) VALUES (
                    gen_random_uuid(),
                    ${session.user.tenantId}::uuid,
                    ${companyId}::uuid,
                    ${patientId}::uuid,
                    ${clinicianId}::uuid,
                    ${startsAt}::timestamptz,
                    ${endsAt}::timestamptz,
                    ${type},
                    ${mode},
                    ${priority},
                    ${notes || null},
                    'scheduled',
                    ${session.user.id}::uuid,
                    ${session.user.current_branch_id || null}::uuid
                )
                RETURNING *
            `;
            return (created as any)[0];
        });

        if ((result as any)._isDuplicate) {
            console.log(`[BOOKING-DEDUPLICATED] Patient ${patientId} already booked for ${dateStr}. Returning existing.`);
            return { success: true, data: result.data };
        }

        createdApt = result;
    } catch (error: any) {
        console.error("CRITICAL_BOOKING_FAILURE:", error.message)
        return { error: `Appointment allocation failed: ${error.message}` }
    }

    const source = formData.get("source") as string
    const nextAction = formData.get("next_action") as string

    if (nextAction === 'prescribe') {
        redirect(`/hms/prescriptions/new?patientId=${patientId}&appointmentId=${createdApt.id}`)
    }

    if (nextAction === 'bill') {
        redirect(`/hms/billing/new?patientId=${patientId}&appointmentId=${createdApt.id}`)
    }

    if (source === 'dashboard' || source === 'terminal') {
        revalidatePath("/hms/reception/dashboard")
        revalidatePath("/hms/dashboard")
        return { success: true, data: createdApt }
    }

    // Default Fallback
    redirect("/hms/appointments")
}

export async function updateAppointmentDate(id: string, start: Date, end: Date) {
    const session = await auth();
    if (!session?.user?.companyId) return { success: false, error: "Unauthorized" };

    try {
        await prisma.hms_appointments.update({
            where: {
                id,
                company_id: session.user.companyId
            },
            data: {
                starts_at: start,
                ends_at: end
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to update appointment:", error);
        return { success: false, error: "Failed to update appointment" };
    }
}
export async function updateAppointmentStatus(id: string, status: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        await prisma.hms_appointments.update({
            where: {
                id,
                tenant_id: session.user.tenantId // Security: Ensure specific tenant
            },
            data: {
                status,
                updated_by: session.user.id,
                updated_at: new Date()
            }
        });

        revalidatePath("/hms/reception/dashboard")
        revalidatePath("/hms/nursing")
        revalidatePath("/hms/doctor/dashboard")

        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, error: "Failed to update status" };
    }
}

export async function updateAppointmentDetails(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const id = formData.get("id") as string
    const patientId = formData.get("patient_id") as string
    const clinicianId = formData.get("clinician_id") as string
    const dateStr = formData.get("date") as string
    const timeStr = formData.get("time") as string
    const type = formData.get("type") as string
    const mode = formData.get("mode") as string
    const priority = formData.get("priority") as string
    const notes = formData.get("notes") as string

    if (!id || !clinicianId || !dateStr || !timeStr) {
        return { error: "Missing required fields" }
    }

    // Combine date and time
    const startsAt = new Date(`${dateStr}T${timeStr}:00`)

    // Fetch doctor's slot duration to recalculate end time
    const clinician = await prisma.hms_clinicians.findUnique({
        where: { id: clinicianId },
        select: { consultation_slot_duration: true }
    })

    const durationMinutes = clinician?.consultation_slot_duration || 30
    const endsAt = new Date(startsAt.getTime() + durationMinutes * 60000)

    try {
        await prisma.hms_appointments.update({
            where: {
                id,
                tenant_id: session.user.tenantId
            },
            data: {
                patient_id: patientId, // Usually doesn't change, but allowed
                clinician_id: clinicianId,
                starts_at: startsAt,
                ends_at: endsAt,
                type,
                mode,
                priority,
                notes,
                updated_by: session.user.id,
                updated_at: new Date()
            }
        });

    } catch (error) {
        console.error("Failed to update details:", error);
        return { error: "Failed to update appointment details" }
    }

    // Handle redirection outside try/catch
    const source = formData.get("source") as string
    if (source === 'dashboard' || source === 'terminal') {
        revalidatePath("/hms/reception/dashboard")
        revalidatePath("/hms/dashboard")
        return { success: true, data: { ...editingAppointment, id } }
    }

    redirect("/hms/appointments")
}

export async function getAppointmentsByClinician(clinicianId: string, date: string) {
    const session = await auth();
    // Allow if tenantId is present. Fallback companyId to tenantId if missing.
    if (!session?.user?.id || !session?.user?.tenantId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        // Parse date for day range (UTC safe approach for local comparison)
        const startOfDay = new Date(`${date}T00:00:00`)
        const endOfDay = new Date(`${date}T23:59:59`)

        const appointments = await prisma.hms_appointments.findMany({
            where: {
                tenant_id: session.user.tenantId,
                clinician_id: clinicianId,
                starts_at: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: { not: 'cancelled' },
                deleted_at: null
            },
            select: {
                id: true,
                starts_at: true,
                ends_at: true,
                status: true,
                clinician_id: true,
                patient_id: true
            }
        });

        return { success: true, data: appointments }
    } catch (error: any) {
        console.error("Failed to fetch clinician appointments:", error)
        return { success: false, error: "Failed to fetch appointments" }
    }
}

