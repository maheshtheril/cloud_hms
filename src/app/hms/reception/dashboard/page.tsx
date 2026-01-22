import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { ReceptionActionCenter } from "@/components/hms/reception/reception-action-center"
import { redirect } from "next/navigation"
import { ShiftManager } from "@/components/hms/reception/shift-manager"

export const dynamic = 'force-dynamic'

export default async function ReceptionDashboardPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/auth/signin")
    }

    const tenantId = session.user.tenantId as string
    const companyId = session.user.companyId as string

    if (!tenantId || !companyId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
                <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
                <p>Your account is not fully setup. Please contact admin to assign a Company/Branch.</p>
            </div>
        )
    }
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    // Parallel Data Fetching
    const [appointmentsRaw, patientsList, doctorsList, todayPaymentsList, todayExpensesList, draftCountVal] = await Promise.all([
        prisma.hms_appointments.findMany({
            where: {
                tenant_id: tenantId,
                starts_at: { gte: todayStart, lte: todayEnd }
            },
            include: {
                hms_patient: true,
                hms_clinician: true,
                prescription: { select: { id: true } },
                hms_invoice: { select: { id: true, status: true, total: true, outstanding_amount: true } },
                hms_lab_order: { select: { id: true, status: true } }
            },
            orderBy: { created_at: 'desc' }
        }),
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
                gender: true,
                contact: true
            }
        }),
        prisma.hms_clinicians.findMany({
            where: { is_active: true, tenant_id: tenantId },
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
        prisma.hms_invoice_payments.findMany({
            where: {
                tenant_id: tenantId,
                paid_at: { gte: todayStart, lte: todayEnd }
            },
            include: {
                hms_invoice: {
                    select: {
                        invoice_number: true,
                        hms_patient: { select: { first_name: true, last_name: true } }
                    }
                }
            },
            orderBy: { paid_at: 'desc' }
        }),
        prisma.payments.findMany({
            where: {
                tenant_id: tenantId,
                metadata: { path: ['type'], equals: 'outbound' },
                created_at: { gte: todayStart, lte: todayEnd }
            },
            orderBy: { created_at: 'desc' }
        }),
        prisma.hms_invoice.count({
            where: { company_id: companyId, status: 'draft' }
        })
    ]);

    // Fetch Vitals & Tags
    const appointmentIds = appointmentsRaw.map(a => a.id);
    const [vitalsRaw, tagsRaw] = await Promise.all([
        prisma.hms_vitals.findMany({
            where: { encounter_id: { in: appointmentIds }, tenant_id: tenantId },
            select: { encounter_id: true }
        }),
        prisma.hms_appointment_tags.findMany({
            where: { appointment_id: { in: appointmentIds }, tenant_id: tenantId },
            select: { appointment_id: true, tag: true }
        })
    ]);

    const vitalsSet = new Set(vitalsRaw.map(v => v.encounter_id));

    const tagsMap: Record<string, string[]> = {};
    tagsRaw.forEach(t => {
        if (!tagsMap[t.appointment_id]) tagsMap[t.appointment_id] = [];
        tagsMap[t.appointment_id].push(t.tag);
    });

    // Calculate Total Collection
    const totalCollection = todayPaymentsList.reduce((sum, p) => sum + Number(p.amount), 0);
    const collectionBreakdown = todayPaymentsList.reduce((acc, p) => {
        const method = p.method as string || 'Other';
        acc[method] = (acc[method] || 0) + Number(p.amount);
        return acc;
    }, {} as Record<string, number>);

    // Transform appointments to friendly format
    const formattedAppointments = appointmentsRaw.map(apt => {
        const invoices = apt.hms_invoice || [];
        const labs = apt.hms_lab_order || [];

        const hasPendingInvoice = invoices.some(inv => inv.status !== 'paid' && inv.status !== 'cancelled');
        const isPaid = invoices.length > 0 && invoices.every(inv => inv.status === 'paid');
        const hasPendingLabs = labs.some(l => l.status !== 'completed' && l.status !== 'partial' && l.status !== 'verified');

        return {
            id: apt.id,
            patient_id: apt.patient_id,
            clinician_id: apt.clinician_id,
            start_time: apt.starts_at,
            status: apt.status,
            priority: apt.priority, // Important for highlighting
            type: apt.type, // Visit Type (consultation, emergency, etc.)
            patient: apt.hms_patient,
            clinician: apt.hms_clinician,
            // Enhanced Status Flags
            hasVitals: vitalsSet.has(apt.id),
            hasPrescription: apt.prescription && apt.prescription.length > 0,
            tags: tagsMap[apt.id] || [],
            invoiceStatus: hasPendingInvoice ? 'pending' : (isPaid ? 'paid' : 'none'),
            labStatus: labs.length > 0 ? (hasPendingLabs ? 'pending' : 'completed') : 'none',
        };
    });

    const totalExpenses = todayExpensesList.reduce((sum, e) => sum + Number(e.amount), 0);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 max-w-7xl mx-auto space-y-6">
            {/* ShiftManager moved to Action Center */}
            <ReceptionActionCenter
                todayAppointments={formattedAppointments}
                patients={patientsList}
                doctors={doctorsList}
                dailyCollection={totalCollection}
                collectionBreakdown={collectionBreakdown}
                todayPayments={todayPaymentsList}
                todayExpenses={todayExpensesList}
                totalExpenses={totalExpenses}
                draftCount={draftCountVal}
            />
        </div>
    )
}
