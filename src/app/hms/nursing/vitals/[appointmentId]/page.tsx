import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, User, Activity, Thermometer, Heart, Wind, PersonStanding, Weight, Ruler } from "lucide-react"
import Link from "next/link"
import NursingVitalsForm from "@/components/nursing/vitals-form"

// We'll separate the client form for better interactivity
export default async function NursingPatientPage(props: { params: Promise<{ appointmentId: string }> }) {
    const params = await props.params
    const session = await auth()
    const tenantId = session?.user?.tenantId
    const { appointmentId } = params

    const appointment = await prisma.hms_appointments.findUnique({
        where: { id: appointmentId },
        include: {
            hms_patient: true,
            hms_clinician: true
        }
    })

    if (!appointment || appointment.tenant_id !== tenantId) {
        notFound()
    }

    // Check if vitals already exist
    const existingVitals = await prisma.hms_vitals.findFirst({
        where: { encounter_id: appointmentId }
    })

    return (
        <div className="min-h-screen bg-slate-50 relative isolate overflow-hidden font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent -z-20" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 opacity-60" />
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-pink-100/40 rounded-full blur-3xl -z-10 -translate-x-1/3 -translate-y-1/3 opacity-60" />

            {/* Glass Header */}
            <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm px-6 py-4 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-4">
                    <Link href="/hms/nursing/dashboard" className="p-2 hover:bg-white/80 rounded-full transition-colors group border border-transparent hover:border-slate-200">
                        <ArrowLeft className="h-5 w-5 text-slate-500 group-hover:text-slate-900" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Clinical Assessment</h1>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <span className="text-slate-900">{appointment.hms_patient?.first_name} {appointment.hms_patient?.last_name}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>{appointment.hms_patient?.gender}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>{appointment.hms_patient?.dob ? `${new Date().getFullYear() - new Date(appointment.hms_patient.dob).getFullYear()}Y` : '-'}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">{appointment.type}</span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attending</p>
                        <p className="text-sm font-bold text-slate-700">Dr. {appointment.hms_clinician?.first_name}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                        {appointment.hms_clinician?.first_name?.[0]}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto w-full p-4 md:p-8">
                <NursingVitalsForm
                    patientId={appointment.patient_id!}
                    encounterId={appointmentId}
                    initialData={existingVitals}
                    tenantId={tenantId!}
                />
            </div>
        </div>
    )
}
