'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth" // Correct auth import
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

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

    // PREVENT DUPLICATES: Check if patient already has an appointment with this doctor today
    const startOfDay = new Date(`${dateStr}T00:00:00`)
    const endOfDay = new Date(`${dateStr}T23:59:59`)

    const existing = await prisma.hms_appointments.findFirst({
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
        return { error: `DUPLICATE_ENTRY: This patient already has an active appointment with this doctor on ${dateStr}. Please reschedule or update the existing record.` }
    }

    // Fetch doctor's slot duration
    const clinician = await prisma.hms_clinicians.findUnique({
        where: { id: clinicianId },
        select: { consultation_slot_duration: true }
    })

    const durationMinutes = clinician?.consultation_slot_duration || 30
    const endsAt = new Date(startsAt.getTime() + durationMinutes * 60000)

    // CRITICAL: Ensure company_id is NEVER null
    const finalCompanyId = companyId || session.user.tenantId;
    if (!finalCompanyId) {
        console.error('CRITICAL: No company_id available', { session: session.user });
        return { error: "System configuration error: missing company context" };
    }

    let createdApt;
    try {
        // Use raw SQL to get the ACTUAL error message from PostgreSQL
        const result: any = await prisma.$queryRaw`
            INSERT INTO hms_appointments (
                id, tenant_id, company_id, patient_id, clinician_id,
                starts_at, ends_at, type, mode, priority, notes, status, created_by, branch_id
            ) VALUES (
                gen_random_uuid(),
                ${session.user.tenantId}::uuid,
                ${finalCompanyId}::uuid,
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

        createdApt = result[0];
    } catch (error: any) {
        console.error("Failed to create appointment:", error)
        console.error("Error detail:", error.message)
        console.error("Error code:", error.code)
        return { error: `Failed to create appointment: ${error.message}` }
    }

    const source = formData.get("source") as string
    const nextAction = formData.get("next_action") as string

    if (nextAction === 'prescribe') {
        redirect(`/hms/prescriptions/new?patientId=${patientId}&appointmentId=${createdApt.id}`)
    }

    if (nextAction === 'bill') {
        redirect(`/hms/billing/new?patientId=${patientId}&appointmentId=${createdApt.id}`)
    }

    if (source === 'dashboard') {
        revalidatePath("/hms/reception/dashboard")
        revalidatePath("/hms/dashboard")
        return { success: true }
    }

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
    if (source === 'dashboard') {
        revalidatePath("/hms/reception/dashboard")
        return { success: true }
    }
    redirect("/hms/appointments")
}
