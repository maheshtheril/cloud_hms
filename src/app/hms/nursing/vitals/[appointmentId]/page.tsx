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
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center gap-4">
                <Link href="/hms/nursing" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="h-6 w-6 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Patient Assessment</h1>
                    <p className="text-sm text-slate-500">
                        {appointment.hms_patient?.first_name} {appointment.hms_patient?.last_name} • {appointment.hms_patient?.gender}
                        {appointment.hms_patient?.dob && (
                            <> • {new Date().getFullYear() - new Date(appointment.hms_patient.dob).getFullYear()} Y</>
                        )}
                    </p>
                </div>
            </div>

            <div className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-8 space-y-8">
                {/* Patient Summary Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start">
                    {appointment.hms_patient?.profile_image_url ? (
                        <img src={appointment.hms_patient.profile_image_url} className="h-24 w-24 rounded-2xl object-cover shadow-lg" alt="Profile" />
                    ) : (
                        <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                            {appointment.hms_patient?.first_name?.[0]}
                        </div>
                    )}

                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-center md:text-left">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">UHID</p>
                            <p className="text-lg font-mono font-bold text-slate-700 mt-1">{appointment.hms_patient?.id.substring(0, 8)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Doctor</p>
                            <p className="text-lg font-bold text-slate-700 mt-1">Dr. {appointment.hms_clinician?.first_name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Type</p>
                            <span className="inline-flex items-center mt-1 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase">
                                {appointment.type || 'Consultation'}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Blood Group</p>
                            <p className="text-lg font-bold text-rose-600 mt-1">{(appointment.hms_patient as any)?.blood_group || '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Vitals Form */}
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
