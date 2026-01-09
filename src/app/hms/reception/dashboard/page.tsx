import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { ReceptionActionCenter } from "@/components/hms/reception/reception-action-center"
import { redirect } from "next/navigation"
import { ShiftManager } from "@/components/hms/reception/shift-manager"

export default async function ReceptionDashboardPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/auth/signin")
    }

    let tenantId = session.user.tenantId
    let companyId = session.user.companyId

    // SELF-HEALING: If context missing for reception user, fetch or assign default
    if ((!tenantId || !companyId) && session.user.email === 'rece@live.com') {
        const dbUser = await prisma.app_user.findFirst({ where: { email: session.user.email } });

        if (dbUser) {
            if (dbUser.tenant_id && dbUser.company_id) {
                tenantId = dbUser.tenant_id;
                companyId = dbUser.company_id;
            } else {
                // Assign First Provider
                const defaultCompany = await prisma.company.findFirst();
                if (defaultCompany) {
                    await prisma.app_user.update({
                        where: { id: dbUser.id },
                        data: { company_id: defaultCompany.id, tenant_id: defaultCompany.tenant_id }
                    });
                    tenantId = defaultCompany.tenant_id;
                    companyId = defaultCompany.id;
                }
            }
        }
    }

    if (!tenantId || !companyId) {
        return <div className="flex h-screen items-center justify-center text-red-500 font-bold">Access Denied: System has no Companies configured to assign.</div>
    }
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    // Parallel Data Fetching
    const [appointments, patients, doctors, todayPayments, todayExpenses] = await Promise.all([
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
            where: { OR: [{ company_id: companyId }, { tenant_id: tenantId }] },
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
                OR: [{ company_id: companyId }, { tenant_id: tenantId }]
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

        // 4. Fetch Today's Payments (Inbound)
        prisma.hms_invoice_payments.findMany({
            where: {
                tenant_id: tenantId,
                paid_at: {
                    gte: todayStart,
                    lte: todayEnd
                }
            },
            include: {
                hms_invoice: {
                    select: {
                        invoice_number: true,
                        hms_patient: {
                            select: {
                                first_name: true,
                                last_name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                paid_at: 'desc'
            }
        }),

        // 5. Fetch Today's Expenses (Petty Cash/Outbound)
        prisma.payments.findMany({
            where: {
                tenant_id: tenantId,
                metadata: {
                    path: ['type'],
                    equals: 'outbound'
                },
                created_at: {
                    gte: todayStart,
                    lte: todayEnd
                }
            },
            orderBy: { created_at: 'desc' }
        })
    ]);

    // Calculate Total Collection
    const totalCollection = todayPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const collectionByMethod = todayPayments.reduce((acc, p) => {
        const method = p.method as string || 'Other';
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

    const totalExpenses = todayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 max-w-7xl mx-auto space-y-6">
            {/* ShiftManager moved to Action Center */}
            <ReceptionActionCenter
                todayAppointments={formattedAppointments}
                patients={patients}
                doctors={doctors}
                dailyCollection={totalCollection}
                collectionBreakdown={collectionByMethod}
                todayPayments={todayPayments}
                todayExpenses={todayExpenses}
                totalExpenses={totalExpenses}
            />
        </div>
    )
}
