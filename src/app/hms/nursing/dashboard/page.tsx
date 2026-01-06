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
                discharge_date: null
            },
            include: {
                hms_patient: true,
                hms_clinician: true, // Primary doctor
                hms_bed: true // if beds are linked
            },
            orderBy: {
                admission_date: 'desc'
            }
        }).catch(() => []) || [], // Fallback if table doesn't exist/error

        // 3. Fetch Pending Lab Samples
        prisma.hms_lab_sample?.findMany({
            where: {
                tenant_id: tenantId,
                status: 'pending'
            },
            include: {
                hms_patient: true,
                hms_lab_test: true
            }
        }).catch(() => []) || []
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
    const formattedPendingTriage = pendingTriage.map(apt => ({
        id: apt.id,
        patient_name: `${apt.hms_patient?.first_name} ${apt.hms_patient?.last_name || ''}`.trim(),
        patient_id: apt.hms_patient?.patient_number,
        doctor_name: `Dr. ${apt.hms_clinician?.first_name} ${apt.hms_clinician?.last_name || ''}`,
        time: apt.starts_at,
        status: apt.status
    }))

    const formattedAdmissions = (admittedPatients as any[]).map(adm => ({
        id: adm.id,
        patient_name: `${adm.hms_patient?.first_name} ${adm.hms_patient?.last_name || ''}`.trim(),
        bed: adm.hms_bed?.code || 'Unassigned',
        doctor: `Dr. ${adm.hms_clinician?.first_name || ''}`,
        admission_date: adm.admission_date
    }))

    const formattedSamples = (pendingSamples as any[]).map(sample => ({
        id: sample.id,
        patient_name: `${sample.hms_patient?.first_name} ${sample.hms_patient?.last_name || ''}`.trim(),
        test_name: sample.hms_lab_test?.name || 'Unknown Test',
        collected_at: sample.collected_at
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
