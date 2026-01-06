import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NursingActionCenter } from "@/components/hms/nursing/nursing-action-center"
import { redirect } from "next/navigation"

export default async function NursingDashboardPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/auth/signin")
    }

    const tenantId = session.user.tenantId
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    // Parallel Data Fetching
    const [appointments, admittedPatients, pendingSamples] = await Promise.all([
        // 1. Fetch Today's Appointments (for triage/vitals)
        prisma.hms_appointments.findMany({
            where: {
                tenant_id: tenantId,
                starts_at: {
                    gte: todayStart,
                    lte: todayEnd
                }
            },
            include: {
                hms_patient: true,
                hms_clinician: true
            },
            orderBy: {
                starts_at: 'asc'
            }
        }),

        // 2. Fetch Admitted Patients (if table exists, otherwise empty)
        // Adjusting query based on typical schema pattern, if hms_admission exists
        prisma.hms_admission?.findMany({
            where: {
                tenant_id: tenantId,
                discharged_at: null
            },
            include: {
                hms_patient: true
            },
            orderBy: {
                admitted_at: 'desc'
            }
        }).catch(() => []) || [], // Fallback if table doesn't exist/error

        // 3. Fetch Pending Lab Orders
        prisma.hms_lab_order.findMany({
            where: {
                tenant_id: tenantId,
                status: 'requested'
            },
            include: {
                hms_patient: true
            }
        }).catch(() => [])
    ])

    // Fetch Vitals Status for Appointments
    const appointmentIds = appointments.map(a => a.id)
    const vitals = await prisma.hms_vitals.findMany({
        where: { encounter_id: { in: appointmentIds } },
        select: { encounter_id: true }
    })
    const vitalsDoneSet = new Set(vitals.map(v => v.encounter_id))

    // Categorize Appointments
    const pendingTriage = appointments.filter(a => !vitalsDoneSet.has(a.id))

    // Transform data for the component
    // Transform data for the component
    const formattedPendingTriage = pendingTriage.map(apt => ({
        id: apt.id,
        patient_name: `${apt.hms_patient?.first_name} ${apt.hms_patient?.last_name || ''}`.trim(),
        patient_id: apt.hms_patient?.patient_number,
        patient_gender: apt.hms_patient?.gender,
        patient_dob: apt.hms_patient?.dob,
        doctor_name: `Dr. ${apt.hms_clinician?.first_name} ${apt.hms_clinician?.last_name || ''}`,
        time: apt.starts_at,
        status: apt.status,
        priority: apt.priority,
        reason: apt.notes || apt.type
    }))

    const formattedAdmissions = (admittedPatients as any[]).map(adm => ({
        id: adm.id,
        patient_name: `${adm.hms_patient?.first_name} ${adm.hms_patient?.last_name || ''}`.trim(),
        bed: adm.bed || 'Unassigned',
        doctor: 'Assigned Doctor',
        admission_date: adm.admitted_at
    }))

    const formattedSamples = (pendingSamples as any[]).map(order => ({
        id: order.id,
        patient_name: `${order.hms_patient?.first_name} ${order.hms_patient?.last_name || ''}`.trim(),
        test_name: 'Lab Order',
        collected_at: order.ordered_at
    }))

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <NursingActionCenter
                pendingTriage={formattedPendingTriage}
                activeAdmissions={formattedAdmissions}
                pendingSamples={formattedSamples}
            />
        </div>
    )
}
