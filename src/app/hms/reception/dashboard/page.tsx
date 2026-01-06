import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { ReceptionActionCenter } from "@/components/hms/reception/reception-action-center"
import { redirect } from "next/navigation"

export default async function ReceptionDashboardPage() {
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
    const [appointments, patients, doctors, todayPayments] = await Promise.all([
        // 1. Fetch Today's Appointments
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

        // 2. Fetch Patients (for selection)
        prisma.hms_patient.findMany({
            where: tenantId ? { tenant_id: tenantId } : undefined,
            take: 100, // Limit for dropdown performance
            orderBy: { updated_at: 'desc' },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                patient_number: true,
                dob: true,
                gender: true,
                contact: true
            }
        }),

        // 3. Fetch Doctors
        prisma.hms_clinicians.findMany({
            where: {
                is_active: true,
                tenant_id: tenantId
            },
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

        // 4. Fetch Today's Payments
        prisma.hms_invoice_payments.findMany({
            where: {
                tenant_id: tenantId,
                paid_at: {
                    gte: todayStart,
                    lte: todayEnd
                }
            },
            select: {
                amount: true,
                method: true
            }
        })
    ]);

    // Calculate Total Collection
    const totalCollection = todayPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const collectionByMethod = todayPayments.reduce((acc, p) => {
        const method = p.method || 'Other';
        acc[method] = (acc[method] || 0) + Number(p.amount);
        return acc;
    }, {} as Record<string, number>);

    // Transform appointments to friendly format
    const formattedAppointments = appointments.map(apt => ({
        id: apt.id,
        patient_id: apt.patient_id, // Include raw ID
        clinician_id: apt.clinician_id, // Include raw ID
        start_time: apt.starts_at,
        status: apt.status,
        patient: apt.hms_patient,
        clinician: apt.hms_clinician
    }));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <ReceptionActionCenter
                todayAppointments={formattedAppointments}
                patients={patients}
                doctors={doctors}
                dailyCollection={totalCollection}
                collectionBreakdown={collectionByMethod}
            />
        </div>
    )
}
