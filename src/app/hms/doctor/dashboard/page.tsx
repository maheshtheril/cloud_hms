import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { DoctorDashboardClient } from "@/components/hms/doctor/doctor-dashboard-client"
import { ensureHmsMenus } from "@/lib/menu-seeder"

export default async function DoctorDashboardPage() {
    await ensureHmsMenus()
    const session = await auth()

    if (!session?.user?.email) {
        redirect("/auth/signin")
    }

    const tenantId = session.user.tenantId
    const userEmail = session.user.email

    // 1. Identify the Clinician
    const clinician = await prisma.hms_clinicians.findFirst({
        where: {
            email: userEmail,
            tenant_id: tenantId
        }
    })

    if (!clinician) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
                <div className="text-center p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
                    <p>Your user profile is not linked to a Clinician record.</p>
                    <p className="text-xs mt-4 opacity-50">Email: {userEmail}</p>
                </div>
            </div>
        )
    }

    // 2. Fetch Today's Appointments
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const appointments = await prisma.hms_appointments.findMany({
        where: {
            clinician_id: clinician.id,
            tenant_id: tenantId,
            starts_at: {
                gte: todayStart,
                lte: todayEnd
            },
            status: { not: 'cancelled' } // viewing active ones
        },
        include: {
            hms_patient: true
        },
        orderBy: {
            starts_at: 'asc'
        }
    })

    // 3. Check Vitals Status
    const appointmentIds = appointments.map(a => a.id)
    const vitals = await prisma.hms_vitals.findMany({
        where: {
            encounter_id: { in: appointmentIds }
        },
        select: {
            encounter_id: true
        }
    })
    const vitalsSet = new Set(vitals.map(v => v.encounter_id))

    // 4. Transform Data
    const formattedAppointments = appointments.map(apt => {
        const isVitalsDone = vitalsSet.has(apt.id)

        return {
            id: apt.id,
            time: apt.starts_at,
            status: apt.status,
            patient_name: `${apt.hms_patient.first_name} ${apt.hms_patient.last_name || ''}`.trim(),
            patient_id: apt.hms_patient.patient_number,
            patient_uuid: apt.patient_id,
            patient_gender: apt.hms_patient.gender || 'Unknown',
            patient_age: apt.hms_patient.dob
                ? new Date().getFullYear() - new Date(apt.hms_patient.dob).getFullYear()
                : 0,
            blood_group: (apt.hms_patient as any).blood_group, // Cast as any if simple typing misses it
            reason: apt.notes || apt.type,
            vitals_done: isVitalsDone
        }
    })

    // 5. Calculate Stats
    const stats = {
        total: appointments.length,
        waiting: formattedAppointments.filter(a => a.status === 'confirmed' || a.status === 'checked_in').length,
        completed: formattedAppointments.filter(a => a.status === 'completed').length
    }

    return (
        <DoctorDashboardClient
            doctorName={`Dr. ${clinician.first_name} ${clinician.last_name}`}
            appointments={formattedAppointments}
            stats={stats}
        />
    )
}
