'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth" // Correct auth import
import { redirect } from "next/navigation"

export async function getAppointmentsProp(start: Date, end: Date) {
    const session = await auth();
    if (!session?.user?.companyId) return { success: false, error: "Unauthorized" };

    try {
        const appointments = await prisma.hms_appointments.findMany({
            where: {
                company_id: session.user.companyId,
                starts_at: {
                    gte: start,
                    lte: end
                },
                deleted_at: null
            },
            include: {
                hms_patient: {
                    select: {
                        first_name: true,
                        last_name: true,
                        patient_number: true
                    }
                }
            }
        });

        // Transform for calendar
        const events = appointments.map(apt => ({
            id: apt.id,
            title: `${apt.hms_patient?.first_name} ${apt.hms_patient?.last_name}`,
            start: apt.starts_at,
            end: apt.ends_at,
            resource: apt,
            status: apt.status
        }));

        return { success: true, data: events };
    } catch (error) {
        console.error("Failed to fetch appointments:", error);
        return { success: false, error: "Failed to fetch appointments" };
    }
}

export async function createAppointment(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || !session.user.companyId || !session.user.tenantId) {
        return { error: "Unauthorized" }
    }

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
    const endsAt = new Date(startsAt.getTime() + 30 * 60000) // Default 30 mins

    try {
        await prisma.hms_appointments.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                patient_id: patientId,
                clinician_id: clinicianId,
                starts_at: startsAt,
                ends_at: endsAt,
                type,
                mode,
                priority,
                notes,
                status: 'scheduled',
                created_by: session.user.id
            }
        })
    } catch (error) {
        console.error("Failed to create appointment:", error)
        return { error: "Failed to create appointment" }
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
