'use client'

import { createAppointment, updateAppointmentDetails } from "@/app/actions/appointment"
import { ArrowLeft, Calendar, Clock, FileText, CheckCircle, MapPin, Video, Phone, AlertCircle, Stethoscope, IndianRupee } from "lucide-react"
import Link from "next/link"
import { PatientDoctorSelectors } from "@/components/appointments/patient-doctor-selectors"
import { CreatePatientForm } from "@/components/hms/create-patient-form"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface AppointmentFormProps {
    patients: any[]
    doctors: any[]
    appointments?: any[]
    initialData?: {
        patient_id?: string
        date?: string
        time?: string
    }
    editingAppointment?: any // Pass full object for editing
    onClose?: () => void
}

export function AppointmentForm({ patients, doctors, appointments = [], initialData = {}, editingAppointment, onClose }: AppointmentFormProps) {
    const { patient_id: initialPatientId, date: initialDate, time: initialTime } = initialData

    // Derived state for editing
    const defaultPatientId = editingAppointment?.patient_id || initialPatientId || ''
    const defaultDate = editingAppointment ? new Date(editingAppointment.start_time).toISOString().split('T')[0] : (initialDate || new Date().toISOString().split('T')[0])
    const defaultTime = editingAppointment ? new Date(editingAppointment.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : (initialTime || '')
    const defaultClinicianId = editingAppointment?.clinician?.id || ''

    const [localPatients, setLocalPatients] = useState(patients)
    const [selectedPatientId, setSelectedPatientId] = useState(defaultPatientId)
    const [showNewPatientModal, setShowNewPatientModal] = useState(false)
    const [selectedClinicianId, setSelectedClinicianId] = useState(defaultClinicianId)
    const [suggestedTime, setSuggestedTime] = useState(defaultTime)

    // Sync state when editingAppointment changes (fix for reused component / stale state)
    useEffect(() => {
        if (editingAppointment) {
            setSelectedPatientId(editingAppointment.patient_id || '')
            setSelectedClinicianId(editingAppointment.clinician?.id || '')
            setSuggestedTime(new Date(editingAppointment.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))

            // Ensure patient exists in list (for correct display label)
            if (editingAppointment.patient) {
                setLocalPatients(prev => {
                    const exists = prev.some(p => p.id === editingAppointment.patient.id)
                    if (!exists) {
                        return [{
                            id: editingAppointment.patient.id,
                            first_name: editingAppointment.patient.first_name,
                            last_name: editingAppointment.patient.last_name,
                            patient_number: editingAppointment.patient.patient_number,
                            gender: editingAppointment.patient.gender
                        }, ...prev]
                    }
                    return prev
                })
            }
        } else {
            // Reset to defaults if switching to "New Appointment" mode within same instance (rare but possible)
            setSelectedPatientId(initialData.patient_id || '')
            setSelectedClinicianId('')
            // Time usually stays or defaults, but let's leave time logic to the user interaction or initialData
            setSuggestedTime(initialData.time || '')
        }
    }, [editingAppointment, initialData])

    // ... (Smart slot logic remains, but we might want to skip it on initial load if editing)

    const handleClinicianChange = (clinicianId: string) => {
        setSelectedClinicianId(clinicianId)
        if (!clinicianId) return

        // If we are editing and haven't changed the doctor, keep original time
        if (editingAppointment && clinicianId === editingAppointment.clinician?.id) {
            setSuggestedTime(defaultTime)
            return
        }

        // ... (rest of smart slot logic) ...
        const doctor = doctors.find(d => d.id === clinicianId)
        const defaultStart = doctor?.consultation_start_time || "09:00"
        const defaultEnd = doctor?.consultation_end_time || "17:00"
        const doctorApts = appointments.filter(a => a.clinician_id === clinicianId)

        if (doctorApts.length === 0) {
            setSuggestedTime(defaultStart)
            return
        }

        const lastApt = doctorApts.reduce((latest, current) => {
            return new Date(current.ends_at) > new Date(latest.ends_at) ? current : latest
        }, doctorApts[0])

        if (lastApt && lastApt.ends_at) {
            const lastEnd = new Date(lastApt.ends_at)
            const nextSlotTime = new Date(lastEnd.getTime())
            const [endH, endM] = defaultEnd.split(':').map(Number)
            const endTimeObj = new Date(lastEnd)
            endTimeObj.setHours(endH, endM, 0, 0)

            if (nextSlotTime >= endTimeObj) {
                setSuggestedTime('Fully Booked')
            } else {
                const hours = nextSlotTime.getHours().toString().padStart(2, '0')
                const minutes = nextSlotTime.getMinutes().toString().padStart(2, '0')
                setSuggestedTime(`${hours}:${minutes}`)
            }
        }
    }

    const handlePatientCreated = (newPatient: any) => {
        setLocalPatients(prev => [newPatient, ...prev])
        setSelectedPatientId(newPatient.id)
        setShowNewPatientModal(false)
    }

    const { toast } = useToast()
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        try {
            let res;
            if (editingAppointment) {
                res = await updateAppointmentDetails(formData);
            } else {
                res = await createAppointment(formData);
            }

            if (res?.error) {
                toast({
                    title: "Action Failed",
                    description: res.error,
                    variant: "destructive"
                });
            } else {
                // Success
                toast({
                    title: "Success",
                    description: editingAppointment ? "Appointment updated successfully." : "Appointment booked successfully.",
                    className: "bg-green-600 text-white border-none"
                });

                // Handle Navigation / Closing
                // Note: Server actions might have already thrown redirect() which catches flow here.
                // If we are here, it means no redirect happened (or we caught it? No, redirect throws).
                // If the server action returns, it means it didn't redirect (e.g. error or just success).

                // If we are in a modal (onClose exists)
                if (onClose) {
                    router.refresh();
                    onClose();
                } else {
                    // Standard page
                    // The server action handles redirect for non-modal cases usually, 
                    // but if we preventDefault, we need to handle it.
                    // Actually, let's look at the server actions. They use `redirect()`.
                    // If `redirect()` is called, this client code might stop executing or throw.
                }
            }
        } catch (e) {
            // Ignore redirect errors
        } finally {
            setIsPending(false)
        }
    }

    // Changing form action to onSubmit to intercept and show loading/toast
    // BUT `redirect()` in server action is tricky with try/catch.
    // The previous implementation was `action={async (formData) ...}`. 
    // This is valid. If it didn't redirect, maybe it hit an error path that returned `{ error: ... }`.
    // The previous code did await `createAppointment`, but didn't check the result for errors!
    // It just let it run. If it returned `{error: 'Unauthorized'}`, nothing happened on UI.

    // NEW STRATEGY: 
    // Use `handleSubmit` that calls the action.
    // We must handle the case where the server action returns an error object.

    return (
        <div className="h-full">
            <form action={async (formData) => {
                const res = editingAppointment ? await updateAppointmentDetails(formData) : await createAppointment(formData);
                if (res?.error) {
                    // Show error toast
                    toast({ title: "Error", description: res.error, variant: "destructive" });
                } else {
                    // Success path
                    // If the action redirects, we might not reach here, which is fine.
                    // If it returns success (e.g. updateAppointmentDetails might just return success), show toast.
                    toast({ title: "Success", description: "Appointment Saved", className: "bg-green-600 text-white" });
                    if (onClose) {
                        // Wait a bit for toast then close
                        // But we need to refresh data
                        // The server action should ideally revalidatePath.
                        onClose();
                    }
                }
            }} className="space-y-4 h-full flex flex-col">
                {editingAppointment && <input type="hidden" name="id" value={editingAppointment.id} />}

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
                                    {editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}
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
                                disabled={suggestedTime === 'Fully Booked'}
                                className={`px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-lg hover:shadow-lg hover:scale-[1.02] font-medium text-sm flex items-center gap-2 transition-all ${suggestedTime === 'Fully Booked' ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                            >
                                <CheckCircle className="h-4 w-4" />
                                {editingAppointment ? 'Update Booking' : 'Confirm Booking'}
                            </button>

                            <button
                                type="submit"
                                name="next_action"
                                value="prescribe"
                                disabled={suggestedTime === 'Fully Booked'}
                                className="px-5 py-2 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-700 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 font-medium text-sm flex items-center gap-2 transition-all"
                            >
                                <Stethoscope className="h-4 w-4" />
                                Confirm & Prescribe
                            </button>

                            <button
                                type="submit"
                                name="next_action"
                                value="bill"
                                disabled={suggestedTime === 'Fully Booked'}
                                className="px-5 py-2 bg-white dark:bg-slate-900 text-green-600 dark:text-green-400 border border-green-200 dark:border-slate-700 rounded-lg hover:bg-green-50 dark:hover:bg-slate-800 font-medium text-sm flex items-center gap-2 transition-all"
                            >
                                <IndianRupee className="h-4 w-4" />
                                Confirm & Bill
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden min-h-0">
                    {/* Left Column (Span 8) */}
                    <div className="lg:col-span-8 space-y-4 overflow-y-auto pr-1 custom-scrollbar pb-20">
                        <PatientDoctorSelectors
                            patients={localPatients}
                            doctors={doctors}
                            selectedPatientId={selectedPatientId}
                            selectedClinicianId={selectedClinicianId}
                            onClinicianSelect={handleClinicianChange}
                            onPatientSelect={setSelectedPatientId}
                            onNewPatientClick={() => setShowNewPatientModal(true)}
                        />

                        {/* Schedule Card */}
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
                                        defaultValue={defaultDate}
                                        className="w-full p-2.5 bg-white dark:bg-slate-950 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 dark:text-slate-300 mb-1.5">
                                        <Clock className="h-3.5 w-3.5 inline mr-1" />
                                        Time <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type={suggestedTime === 'Fully Booked' ? 'text' : 'time'}
                                        name="time"
                                        required
                                        key={suggestedTime}
                                        defaultValue={suggestedTime === 'Fully Booked' ? '' : suggestedTime || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        readOnly={suggestedTime === 'Fully Booked'}
                                        placeholder={suggestedTime === 'Fully Booked' ? 'Fully Booked' : ''}
                                        className={`w-full p-2.5 bg-white dark:bg-slate-950 text-gray-900 dark:text-white border ${suggestedTime === 'Fully Booked' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-medium`}
                                    />
                                    {suggestedTime === 'Fully Booked' && (
                                        <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1 animate-pulse">
                                            <AlertCircle className="h-3 w-3" /> No more slots available today
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Notes Card - MOVED HERE BELOW SCHEDULE */}
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white dark:border-slate-800 shadow-sm p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-gray-600 dark:text-slate-400" />
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notes / Brief Complaint</h3>
                            </div>
                            <textarea
                                name="notes"
                                rows={3}
                                defaultValue={editingAppointment?.notes || ''}
                                className="w-full p-2.5 bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none font-medium text-sm"
                                placeholder="Reason for visit, symptoms, or any special instructions..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Right Column (Span 4) */}
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
                                        defaultValue={editingAppointment?.type || 'consultation'}
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
                                            <input type="radio" name="mode" value="in_person" defaultChecked={!editingAppointment || editingAppointment.mode === 'in_person'} className="text-blue-600 focus:ring-blue-500" />
                                            <MapPin className="h-4 w-4 text-gray-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                            <span className="text-sm font-medium text-gray-900 dark:text-slate-200">In-Person Visit</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer transition-all group">
                                            <input type="radio" name="mode" value="video" defaultChecked={editingAppointment?.mode === 'video'} className="text-purple-600 focus:ring-purple-500" />
                                            <Video className="h-4 w-4 text-gray-600 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                                            <span className="text-sm font-medium text-gray-900 dark:text-slate-200">Video Call</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer transition-all group">
                                            <input type="radio" name="mode" value="phone" defaultChecked={editingAppointment?.mode === 'phone'} className="text-green-600 focus:ring-green-500" />
                                            <Phone className="h-4 w-4 text-gray-600 dark:text-slate-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
                                            <span className="text-sm font-medium text-gray-900 dark:text-slate-200">Phone Consultation</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Priority Card */}
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
                                    <input type="radio" name="priority" value="low" defaultChecked={editingAppointment?.priority === 'low'} className="text-green-600 focus:ring-green-500" />
                                    <span className="text-xs font-bold text-green-700 dark:text-green-400">Low</span>
                                </label>
                                <label className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg cursor-pointer transition-all hover:shadow-sm">
                                    <input type="radio" name="priority" value="normal" defaultChecked={!editingAppointment || editingAppointment.priority === 'normal'} className="text-blue-600 focus:ring-blue-500" />
                                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Normal</span>
                                </label>
                                <label className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg cursor-pointer transition-all hover:shadow-sm">
                                    <input type="radio" name="priority" value="high" defaultChecked={editingAppointment?.priority === 'high'} className="text-orange-600 focus:ring-orange-500" />
                                    <span className="text-xs font-bold text-orange-700 dark:text-orange-400">High</span>
                                </label>
                                <label className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg cursor-pointer transition-all hover:shadow-sm">
                                    <input type="radio" name="priority" value="urgent" defaultChecked={editingAppointment?.priority === 'urgent'} className="text-red-600 focus:ring-red-500" />
                                    <span className="text-xs font-bold text-red-700 dark:text-red-400">Urgent</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                {onClose && <input type="hidden" name="source" value="dashboard" />}
            </form>

            {/* Quick Create Patient Modal */}
            {showNewPatientModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <CreatePatientForm
                            onClose={() => setShowNewPatientModal(false)}
                            onSuccess={handlePatientCreated}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
