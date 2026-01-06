import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { DoctorDashboardClient } from "@/components/hms/doctor/doctor-dashboard-client"
import { ensureHmsMenus } from "@/lib/menu-seeder"

import { initializeDoctorProfile } from "@/app/actions/doctor"
import { Stethoscope, CheckCircle2 } from "lucide-react"

export default async function DoctorDashboardPage() {
    await ensureHmsMenus()
    const session = await auth()

    if (!session?.user?.email) {
        redirect("/auth/signin")
    }

    const tenantId = session.user.tenantId
    const userEmail = session.user.email

    // 1. Identify the Clinician (World-Class Profile Linking)
    // Preference: user_id > email
    let clinician = await prisma.hms_clinicians.findFirst({
        where: {
            user_id: session.user.id,
            tenant_id: tenantId
        }
    })

    if (!clinician) {
        // Fallback: Check by email (for legacy/unlinked accounts)
        clinician = await prisma.hms_clinicians.findFirst({
            where: {
                email: { equals: userEmail, mode: 'insensitive' },
                tenant_id: tenantId
            }
        })
    }

    if (!clinician) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
                        <div className="h-16 w-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Stethoscope className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-black">Welcome, Doctor!</h2>
                        <p className="text-blue-100 mt-2">Let's set up your clinical workspace.</p>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="text-slate-500 text-sm">
                            <p>We found your account <strong>{userEmail}</strong> but it's not linked to a clinical profile yet.</p>
                            <p className="mt-2">Click below to automatically create your profile and access the dashboard.</p>
                        </div>

                        <form action={async (formData) => {
                            'use server'
                            await initializeDoctorProfile(formData)
                        }}>
                            <button
                                type="submit"
                                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="h-5 w-5" />
                                Initialize Profile
                            </button>
                        </form>
                    </div>
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
