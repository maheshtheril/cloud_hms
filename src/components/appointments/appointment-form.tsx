'use client'

import { createAppointment } from "@/app/actions/appointment"
import { ArrowLeft, Calendar, Clock, FileText, CheckCircle, MapPin, Video, Phone, AlertCircle } from "lucide-react"
import Link from "next/link"
import { PatientDoctorSelectors } from "@/components/appointments/patient-doctor-selectors"
import { useState } from "react"

interface AppointmentFormProps {
    patients: any[]
    doctors: any[]
    appointments?: any[]
    initialData?: {
        patient_id?: string
        date?: string
        time?: string
    }
    onClose?: () => void
}

export function AppointmentForm({ patients, doctors, appointments = [], initialData = {}, onClose }: AppointmentFormProps) {
    const { patient_id: initialPatientId, date: initialDate, time: initialTime } = initialData
    const [selectedClinicianId, setSelectedClinicianId] = useState('')
    const [suggestedTime, setSuggestedTime] = useState(initialTime || '')

    // Smart Slot Calculation
    const handleClinicianChange = (clinicianId: string) => {
        setSelectedClinicianId(clinicianId)

        if (!clinicianId) return

        // Get doctor's default start time
        const doctor = doctors.find(d => d.id === clinicianId)
        const defaultStart = doctor?.consultation_start_time || "09:00"

        // Filter appointments for this doctor today
        const doctorApts = appointments.filter(a => a.clinician_id === clinicianId)

        if (doctorApts.length === 0) {
            setSuggestedTime(defaultStart)
            return
        }

        // Find the latest end time
        const lastApt = doctorApts.reduce((latest, current) => {
            return new Date(current.ends_at) > new Date(latest.ends_at) ? current : latest
        }, doctorApts[0])

        if (lastApt && lastApt.ends_at) {
            const lastEnd = new Date(lastApt.ends_at)
            // Add a small buffer (e.g., 5 mins) or just start exactly after? User said "according to that".
            // Let's suggest exactly after.
            const nextSlot = lastEnd.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            setSuggestedTime(nextSlot)
        }
    }

    return (
        <form action={async (formData) => {
            await createAppointment(formData)
        }} className="space-y-4 h-full flex flex-col">
            {/* Premium Header - Compact */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white dark:border-slate-800 shadow-sm p-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {onClose ? (
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all group"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                            </button>
                        ) : (
                            <Link
                                href="/hms/appointments"
                                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all group"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                            </Link>
                        )}

                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                Book New Appointment
                            </h1>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {onClose ? (
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg font-medium text-sm transition-all"
                            >
                                Cancel
                            </button>
                        ) : (
                            <Link
                                href="/hms/appointments"
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg font-medium text-sm transition-all"
                            >
                                Cancel
                            </Link>
                        )}

                        <button
                            type="submit"
                            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-lg hover:shadow-lg hover:scale-[1.02] font-medium text-sm flex items-center gap-2 transition-all"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Confirm Booking
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden min-h-0">


                {/* Left Column - Patient & Doctor & Schedule (Span 8) */}
                <div className="lg:col-span-8 space-y-4 overflow-y-auto pr-1 custom-scrollbar pb-20">

                    <PatientDoctorSelectors
                        patients={patients}
                        doctors={doctors}
                        selectedPatientId={initialPatientId || ''}
                        onClinicianSelect={handleClinicianChange} // Pass the handler
                    />

                    {/* Date & Time Card */}
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white dark:border-slate-800 shadow-sm p-4">
                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-100 dark:border-slate-800">
                            <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                                <Calendar className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-gray-900 dark:text-white">Schedule</h2>
                                <p className="text-xs text-gray-600 dark:text-slate-400">When should the appointment take place?</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-slate-300 mb-1.5">
                                    <Calendar className="h-3.5 w-3.5 inline mr-1" />
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    defaultValue={initialDate || new Date().toISOString().split('T')[0]}
                                    className="w-full p-2.5 bg-white dark:bg-slate-950 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-medium [color-scheme:light] dark:[color-scheme:dark]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-slate-300 mb-1.5">
                                    <Clock className="h-3.5 w-3.5 inline mr-1" />
                                    Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    required
                                    key={suggestedTime} // Force re-render when suggestion changes
                                    defaultValue={suggestedTime || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                    className="w-full p-2.5 bg-white dark:bg-slate-950 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-medium [color-scheme:light] dark:[color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Visit Details (Span 4) */}
                <div className="lg:col-span-4 space-y-4 overflow-y-auto pr-1 custom-scrollbar pb-20">

                    {/* Visit Type & Mode */}
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white dark:border-slate-800 shadow-sm p-4">
                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-100 dark:border-slate-800">
                            <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                                <FileText className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-gray-900 dark:text-white">Visit Details</h2>
                                <p className="text-xs text-gray-600 dark:text-slate-400">Type and mode</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-slate-300 mb-1.5">Visit Type</label>
                                <select
                                    name="type"
                                    className="w-full p-2.5 bg-white dark:bg-slate-950 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-medium text-sm"
                                >
                                    <option value="consultation">🩺 Initial Consultation</option>
                                    <option value="follow_up">🔄 Follow Up Visit</option>
                                    <option value="emergency">🚨 Emergency</option>
                                    <option value="procedure">💉 Procedure</option>
                                    <option value="checkup">✅ Routine Checkup</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-slate-300 mb-1.5">Consultation Mode</label>
                                <div className="grid grid-cols-1 gap-2">
                                    <label className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer transition-all group">
                                        <input
                                            type="radio"
                                            name="mode"
                                            value="in_person"
                                            defaultChecked
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <MapPin className="h-4 w-4 text-gray-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-slate-200">In-Person Visit</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer transition-all group">
                                        <input
                                            type="radio"
                                            name="mode"
                                            value="video"
                                            className="text-purple-600 focus:ring-purple-500"
                                        />
                                        <Video className="h-4 w-4 text-gray-600 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-slate-200">Video Call</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer transition-all group">
                                        <input
                                            type="radio"
                                            name="mode"
                                            value="phone"
                                            className="text-green-600 focus:ring-green-500"
                                        />
                                        <Phone className="h-4 w-4 text-gray-600 dark:text-slate-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-slate-200">Phone Consultation</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Priority */}
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white dark:border-slate-800 shadow-sm p-4">
                        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-100 dark:border-slate-800">
                            <div className="h-8 w-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
                                <AlertCircle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-gray-900 dark:text-white">Priority</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg cursor-pointer transition-all hover:shadow-sm">
                                <input type="radio" name="priority" value="low" className="text-green-600 focus:ring-green-500" />
                                <span className="text-xs font-bold text-green-700 dark:text-green-400">Low</span>
                            </label>
                            <label className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg cursor-pointer transition-all hover:shadow-sm">
                                <input type="radio" name="priority" value="normal" defaultChecked className="text-blue-600 focus:ring-blue-500" />
                                <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Normal</span>
                            </label>
                            <label className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg cursor-pointer transition-all hover:shadow-sm">
                                <input type="radio" name="priority" value="high" className="text-orange-600 focus:ring-orange-500" />
                                <span className="text-xs font-bold text-orange-700 dark:text-orange-400">High</span>
                            </label>
                            <label className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg cursor-pointer transition-all hover:shadow-sm">
                                <input type="radio" name="priority" value="urgent" className="text-red-600 focus:ring-red-500" />
                                <span className="text-xs font-bold text-red-700 dark:text-red-400">Urgent</span>
                            </label>
                        </div>
                    </div>

                    {/* Notes - Compact */}
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white dark:border-slate-800 shadow-sm p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-gray-600 dark:text-slate-400" />
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notes</h3>
                        </div>
                        <textarea
                            name="notes"
                            rows={3}
                            className="w-full p-2.5 bg-white dark:bg-slate-950 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none font-medium text-sm"
                            placeholder="Reason for visit..."
                        ></textarea>
                    </div>
                </div>

            </div>
            {onClose && <input type="hidden" name="source" value="dashboard" />}
        </form>
    )
}
