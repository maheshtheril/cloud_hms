import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { FileText, Plus, Search, Filter, ArrowRight, User, Calendar } from "lucide-react"
import Link from "next/link"

export default async function PrescriptionsPage() {
    const session = await auth()
    const tenantId = session?.user?.tenantId
    const companyId = session?.user?.companyId

    // Fetch recent prescriptions
    const prescriptionsRes = await prisma.prescription.findMany({
        where: { tenant_id: tenantId },
        take: 10,
        orderBy: { created_at: 'desc' },
        include: {
            hms_patient: {
                select: { id: true, first_name: true, last_name: true, patient_number: true }
            }
        }
    })
    const prescriptions = prescriptionsRes as any[]

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                            <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        Prescriptions
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Manage patient medications, clinical findings, and treatment plans.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search prescriptions..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/30">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Recent Prescriptions</span>
                    <button className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-colors text-slate-400">
                        <Filter className="h-4 w-4" />
                    </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {prescriptions.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400 mb-4">
                                <FileText className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No prescriptions found</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6 text-sm">
                                Create your first prescription from the patient list or after an appointment.
                            </p>
                            <Link
                                href="/hms/patients"
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 inline-flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                New Prescription
                            </Link>
                        </div>
                    ) : (
                        prescriptions.map((pr) => (
                            <Link
                                href={`/hms/prescriptions/new?patientId=${pr.patient_id}&appointmentId=${pr.appointment_id || ''}&prescriptionId=${pr.id}`}
                                key={pr.id}
                                className="p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors group block"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shadow-sm">
                                            {pr.hms_patient?.first_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                {pr.hms_patient?.first_name} {pr.hms_patient?.last_name}
                                            </h4>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {pr.hms_patient?.patient_number}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(pr.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 rounded-lg transition-all">
                                            <ArrowRight className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Guidance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl text-white shadow-xl shadow-indigo-500/20">
                    <h3 className="text-xl font-black mb-2 tracking-tight">How to create a prescription?</h3>
                    <p className="text-white/80 text-sm mb-6 font-medium leading-relaxed">
                        Prescriptions are best created directly from the Patient Profile or instantly after booking an Appointment. This ensures all medical context is automatically linked.
                    </p>
                    <div className="flex gap-2">
                        <Link href="/hms/patients" className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold transition-all">
                            View Patients
                        </Link>
                        <Link href="/hms/appointments" className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold transition-all">
                            Appointments
                        </Link>
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">AI Handwriting?</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 font-medium leading-relaxed">
                        Use our premium AI feature to scan handwritten notes into digital text. Navigate to a new prescription to try it out.
                    </p>
                    <Link href="/hms/patients" className="text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                        Get Started <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
