import { createAppointment } from "@/app/actions/appointment"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Stethoscope, FileText, CheckCircle, Clock, MapPin, Video, Phone, AlertCircle } from "lucide-react"

export default async function NewAppointmentPage({
    searchParams
}: {
    searchParams: Promise<{
        patient_id?: string
        date?: string
        time?: string
    }>
}) {
    const resolvedParams = await searchParams;
    const { patient_id, date, time } = resolvedParams;

    const session = await auth()
    const tenantId = session?.user?.tenantId

    // Fetch data with better selection
    const [patients, doctors] = await Promise.all([
        prisma.hms_patient.findMany({
            where: tenantId ? { tenant_id: tenantId } : undefined,
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
        prisma.hms_clinicians.findMany({
            where: { is_active: true },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                hms_specializations: { select: { name: true } },
                role: true
            },
            orderBy: { first_name: 'asc' }
        })
    ])

    const selectedPatientId = patient_id || ''

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-12">
            <form action={async (formData) => {
                'use server'
                await createAppointment(formData)
            }} className="max-w-6xl mx-auto p-6 space-y-6">

                {/* Premium Header */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-xl shadow-blue-100/50 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/hms/appointments"
                                className="p-2.5 hover:bg-gray-100 rounded-xl transition-all group"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Book New Appointment
                                </h1>
                                <p className="text-gray-600 text-sm mt-1">Schedule a patient visit with our healthcare providers</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/hms/appointments"
                                className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-sm transition-all"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] font-medium text-sm flex items-center gap-2 transition-all"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - Patient & Doctor (2 cols) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Patient Selection Card */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-xl shadow-blue-100/50 p-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Patient Information</h2>
                                    <p className="text-sm text-gray-600">Select the patient for this appointment</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-semibold text-gray-900">
                                            Patient <span className="text-red-500">*</span>
                                        </label>
                                        <Link
                                            href="/hms/patients/new"
                                            target="_blank"
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-medium rounded-lg hover:shadow-md transition-all"
                                        >
                                            <User className="h-3.5 w-3.5" />
                                            Quick Add Patient
                                        </Link>
                                    </div>
                                    <input
                                        type="text"
                                        name="patient_search"
                                        list="patients-list"
                                        placeholder="Start typing patient name or number..."
                                        defaultValue={selectedPatientId ? patients.find(p => p.id === selectedPatientId)?.first_name + ' ' + patients.find(p => p.id === selectedPatientId)?.last_name : ''}
                                        className="w-full p-3.5 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium transition-all"
                                    />
                                    <input type="hidden" name="patient_id" id="patient_id" value={selectedPatientId} required />
                                    <datalist id="patients-list">
                                        {patients.map(p => (
                                            <option
                                                key={p.id}
                                                value={`${p.first_name} ${p.last_name}`}
                                                data-id={p.id}
                                            >
                                                {p.patient_number} • {p.gender || 'N/A'}
                                            </option>
                                        ))}
                                    </datalist>
                                    <script dangerouslySetInnerHTML={{
                                        __html: `
                                        document.addEventListener('DOMContentLoaded', function() {
                                            const input = document.querySelector('input[name="patient_search"]');
                                            const hiddenInput = document.getElementById('patient_id');
                                            const patients = ${JSON.stringify(patients.map(p => ({
                                            id: p.id,
                                            name: `${p.first_name} ${p.last_name}`,
                                            number: p.patient_number
                                        })))};
                                            
                                            input.addEventListener('input', function() {
                                                const match = patients.find(p => p.name === this.value || p.number === this.value);
                                                if (match) {
                                                    hiddenInput.value = match.id;
                                                } else {
                                                    hiddenInput.value = '';
                                                }
                                            });
                                        });
                                    `}} />
                                    <p className="mt-2 text-xs text-gray-500">
                                        💡 Tip: Type patient name or number to search. Use Quick Add button to register new patients.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Doctor Selection Card */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-xl shadow-blue-100/50 p-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Stethoscope className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Healthcare Provider</h2>
                                    <p className="text-sm text-gray-600">Select attending doctor or clinician</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Doctor / Clinician <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="doctor_search"
                                    list="doctors-list"
                                    placeholder="Start typing doctor name..."
                                    className="w-full p-3.5 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium transition-all"
                                />
                                <input type="hidden" name="clinician_id" id="clinician_id" required />
                                <datalist id="doctors-list">
                                    {doctors.map(d => (
                                        <option
                                            key={d.id}
                                            value={`Dr. ${d.first_name} ${d.last_name}`}
                                            data-id={d.id}
                                        >
                                            {d.hms_specializations?.name || d.role || 'General Practice'}
                                        </option>
                                    ))}
                                </datalist>
                                <script dangerouslySetInnerHTML={{
                                    __html: `
                                    document.addEventListener('DOMContentLoaded', function() {
                                        const input = document.querySelector('input[name="doctor_search"]');
                                        const hiddenInput = document.getElementById('clinician_id');
                                        const doctors = ${JSON.stringify(doctors.map(d => ({
                                        id: d.id,
                                        name: `Dr. ${d.first_name} ${d.last_name}`
                                    })))};
                                        
                                        input.addEventListener('input', function() {
                                            const match = doctors.find(d => d.name === this.value);
                                            if (match) {
                                                hiddenInput.value = match.id;
                                            } else {
                                                hiddenInput.value = '';
                                            }
                                        });
                                    });
                                `}} />
                            </div>
                        </div>

                        {/* Date & Time Card */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-xl shadow-blue-100/50 p-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Calendar className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Schedule</h2>
                                    <p className="text-sm text-gray-600">When should the appointment take place?</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        <Calendar className="h-4 w-4 inline mr-1" />
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        defaultValue={date}
                                        className="w-full p-3.5 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        <Clock className="h-4 w-4 inline mr-1" />
                                        Time <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        required
                                        defaultValue={time}
                                        className="w-full p-3.5 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Visit Details */}
                    <div className="space-y-6">

                        {/* Visit Type & Mode */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-xl shadow-blue-100/50 p-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Visit Details</h2>
                                    <p className="text-sm text-gray-600">Type and mode of consultation</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Visit Type</label>
                                    <select
                                        name="type"
                                        className="w-full p-3.5 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none font-medium"
                                    >
                                        <option value="consultation">🩺 Initial Consultation</option>
                                        <option value="follow_up">🔄 Follow Up Visit</option>
                                        <option value="emergency">🚨 Emergency</option>
                                        <option value="procedure">💉 Procedure</option>
                                        <option value="checkup">✅ Routine Checkup</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Consultation Mode</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        <label className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 rounded-xl cursor-pointer transition-all group">
                                            <input
                                                type="radio"
                                                name="mode"
                                                value="in_person"
                                                defaultChecked
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <MapPin className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                                            <span className="text-sm font-medium text-gray-900">In-Person Visit</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 rounded-xl cursor-pointer transition-all group">
                                            <input
                                                type="radio"
                                                name="mode"
                                                value="video"
                                                className="text-purple-600 focus:ring-purple-500"
                                            />
                                            <Video className="h-4 w-4 text-gray-600 group-hover:text-purple-600" />
                                            <span className="text-sm font-medium text-gray-900">Video Call</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-green-50 border-2 border-gray-200 rounded-xl cursor-pointer transition-all group">
                                            <input
                                                type="radio"
                                                name="mode"
                                                value="phone"
                                                className="text-green-600 focus:ring-green-500"
                                            />
                                            <Phone className="h-4 w-4 text-gray-600 group-hover:text-green-600" />
                                            <span className="text-sm font-medium text-gray-900">Phone Consultation</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-xl shadow-blue-100/50 p-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="h-10 w-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <AlertCircle className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Priority Level</h2>
                                    <p className="text-sm text-gray-600">How urgent is this appointment?</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-3 p-3 bg-green-50 border-2 border-green-200 rounded-xl cursor-pointer transition-all hover:shadow-md">
                                    <input type="radio" name="priority" value="low" className="text-green-600 focus:ring-green-500" />
                                    <span className="text-sm font-medium text-green-700">🟢 Low - Routine care</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 bg-blue-50 border-2 border-blue-300 rounded-xl cursor-pointer transition-all hover:shadow-md">
                                    <input type="radio" name="priority" value="normal" defaultChecked className="text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm font-medium text-blue-700">🔵 Normal - Standard visit</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 bg-orange-50 border-2 border-orange-200 rounded-xl cursor-pointer transition-all hover:shadow-md">
                                    <input type="radio" name="priority" value="high" className="text-orange-600 focus:ring-orange-500" />
                                    <span className="text-sm font-medium text-orange-700">🟠 High - Needs attention soon</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 bg-red-50 border-2 border-red-300 rounded-xl cursor-pointer transition-all hover:shadow-md">
                                    <input type="radio" name="priority" value="urgent" className="text-red-600 focus:ring-red-500" />
                                    <span className="text-sm font-medium text-red-700">🔴 Urgent - Immediate care</span>
                                </label>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-xl shadow-blue-100/50 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="h-5 w-5 text-gray-600" />
                                <h3 className="text-sm font-bold text-gray-900">Chief Complaint / Notes</h3>
                            </div>
                            <textarea
                                name="notes"
                                rows={5}
                                className="w-full p-3.5 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-medium"
                                placeholder="Reason for visit, symptoms, preliminary notes..."
                            ></textarea>
                            <p className="mt-2 text-xs text-gray-500">This information helps prepare for the appointment</p>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    )
}
