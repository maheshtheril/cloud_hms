import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { DashboardClient } from "@/components/hms/dashboard-client"

export default async function DashboardPage() {
    const session = await auth()
    const tenantId = session?.user?.tenantId
    const companyId = session?.user?.companyId

    if (!tenantId || !companyId) {
        return <div>Unauthorized</div>
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Fetch essential data in parallel
    const [
        patients,
        doctors,
        rawAppointments,
        totalPatientsCount,
        pendingBillsCount,
        revenueAggregate
    ] = await Promise.all([
        // 1. Patients for modal (limit to recent/active)
        prisma.hms_patient.findMany({
            where: { tenant_id: tenantId },
            take: 100,
            orderBy: { updated_at: 'desc' },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                patient_number: true,
                dob: true,
                gender: true
            }
        }),

        // 2. Doctors for modal
        prisma.hms_clinicians.findMany({
            where: { is_active: true },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                hms_specializations: { select: { name: true } },
                role: true,
                consultation_start_time: true,
                consultation_end_time: true,
                consultation_slot_duration: true
            },
            orderBy: { first_name: 'asc' }
        }),

        // 3. Today's Appointments (Manual Fetch without include)
        prisma.hms_appointments.findMany({
            where: {
                company_id: companyId,
                starts_at: {
                    gte: today,
                    lt: tomorrow
                },
                deleted_at: null
            },
            orderBy: {
                starts_at: 'asc'
            }
        }),

        // 4. Stats: Total Patients
        prisma.hms_patient.count({
            where: { tenant_id: tenantId }
        }),

        // 5. Stats: Pending Bills
        prisma.hms_invoice.count({
            where: {
                company_id: companyId,
                status: { in: ['draft', 'posted'] }
            }
        }),

        // 6. Stats: Revenue (This Month)
        prisma.hms_invoice.aggregate({
            where: {
                company_id: companyId,
                status: 'paid',
                issued_at: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            },
            _sum: {
                total: true
            }
        })
    ])

    // Manual enrichment of appointments
    const patientIds = [...new Set(rawAppointments.map(a => a.patient_id).filter(Boolean))] as string[]
    const clinicianIds = [...new Set(rawAppointments.map(a => a.clinician_id).filter(Boolean))] as string[]

    const [relatedPatients, relatedClinicians] = await Promise.all([
        prisma.hms_patient.findMany({
            where: { id: { in: patientIds } },
            select: { id: true, first_name: true, last_name: true, patient_number: true }
        }),
        prisma.hms_clinicians.findMany({
            where: { id: { in: clinicianIds } },
            select: { id: true, first_name: true, last_name: true }
        })
    ])

    const patientMap = new Map(relatedPatients.map(p => [p.id, p]))
    const clinicianMap = new Map(relatedClinicians.map(c => [c.id, c]))

    const appointments = rawAppointments.map(apt => ({
        ...apt,
        patient: patientMap.get(apt.patient_id as string) || { first_name: 'Unknown', last_name: '', patient_number: 'N/A' },
        clinician: clinicianMap.get(apt.clinician_id as string) || { first_name: 'Unknown', last_name: '' }
    }))

    const stats = {
        totalPatients: totalPatientsCount,
        todayAppointments: appointments.length,
        pendingBills: pendingBillsCount,
        revenue: revenueAggregate._sum.total ? Number(revenueAggregate._sum.total) : 0
    }

    return (
        <DashboardClient
            user={JSON.parse(JSON.stringify(session.user))}
            stats={stats}
            appointments={JSON.parse(JSON.stringify(appointments))}
            patients={JSON.parse(JSON.stringify(patients))}
            doctors={JSON.parse(JSON.stringify(doctors))}
        />
    )
}
