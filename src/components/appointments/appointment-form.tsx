'use client'

import { createAppointment, updateAppointmentDetails } from "@/app/actions/appointment"
import { ArrowLeft, Calendar, Clock, FileText, CheckCircle, MapPin, Video, Phone, AlertCircle, Stethoscope, IndianRupee } from "lucide-react"
import Link from "next/link"
import { PatientDoctorSelectors } from "@/components/appointments/patient-doctor-selectors"
import { CreatePatientForm } from "@/components/hms/create-patient-form"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ZionaLogo } from "@/components/branding/ziona-logo"
import { Maximize2, Minimize2, Mic, MicOff, ShieldAlert, BadgeCheck, Sparkles, Loader2, Minus } from "lucide-react"
import { getHMSSettings } from "@/app/actions/settings"

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
    onMinimize?: () => void
}

export function AppointmentForm({ patients, doctors, appointments = [], initialData = {}, editingAppointment, onClose, onMinimize }: AppointmentFormProps) {
    const { patient_id: initialPatientId, date: initialDate, time: initialTime } = initialData

    // Derived state for editing
    const defaultPatientId = editingAppointment?.patient?.id || editingAppointment?.patient_id || initialPatientId || ''
    const defaultDate = editingAppointment ? new Date(editingAppointment.start_time).toISOString().split('T')[0] : (initialDate || new Date().toISOString().split('T')[0])
    const defaultTime = editingAppointment ? new Date(editingAppointment.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : (initialTime || '')
    const defaultClinicianId = editingAppointment?.clinician?.id || editingAppointment?.clinician_id || ''

    const [localPatients, setLocalPatients] = useState(patients)
    const [selectedPatientId, setSelectedPatientId] = useState(defaultPatientId)
    const [showNewPatientModal, setShowNewPatientModal] = useState(false)
    const [selectedClinicianId, setSelectedClinicianId] = useState(defaultClinicianId)
    const [suggestedTime, setSuggestedTime] = useState(defaultTime)
    const [isMaximized, setIsMaximized] = useState(true)
    const [isListening, setIsListening] = useState(false)
    const [hmsSettings, setHmsSettings] = useState<any>(null)
    const [notes, setNotes] = useState(editingAppointment?.notes || '')

    // Sync state when editingAppointment changes or initialData changes
    useEffect(() => {
        if (editingAppointment) {
            setSelectedPatientId(editingAppointment.patient?.id || editingAppointment.patient_id || '')
            setSelectedClinicianId(editingAppointment.clinician?.id || editingAppointment.clinician_id || '')
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
            // Reset to defaults
            setSelectedPatientId(initialPatientId || '')
            setSuggestedTime(initialTime || '')
        }
    }, [editingAppointment, initialPatientId, initialDate, initialTime])

    // Aggressive Doctor Auto-Selection (Ensures it happens as soon as doctors load)
    useEffect(() => {
        if (!selectedClinicianId && doctors.length > 0) {
            setSelectedClinicianId(doctors[0].id)
        }
    }, [doctors, selectedClinicianId])

    // Keyboard Shortcut: Ctrl+N to open New Patient, Ctrl+M to toggle maximize
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey || e.altKey) && e.key === 'n') {
                e.preventDefault()
                setShowNewPatientModal(true)
            }
            if ((e.ctrlKey || e.metaKey || e.altKey) && e.key === 'm') {
                e.preventDefault()
                if (onMinimize) onMinimize()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Fetch HMS settings for registration info
    useEffect(() => {
        getHMSSettings().then(res => {
            if (res.success) setHmsSettings(res.settings)
        })
    }, [])

    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (!SpeechRecognition) {
            toast({ title: "Unsupported", description: "Voice input is not supported in this browser.", variant: "destructive" })
            return
        }

        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onstart = () => setIsListening(true)
        recognition.onend = () => setIsListening(false)
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setNotes((prev: string) => (prev ? `${prev} ${transcript}` : transcript))
        }

        recognition.start()
    }

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

    const [selectedPriority, setSelectedPriority] = useState(editingAppointment?.priority || 'normal')
    const selectedPatient = localPatients.find(p => p.id === selectedPatientId)

    return (
        <div className={`transition-all duration-500 bg-white dark:bg-slate-950 flex flex-col ${isMaximized ? 'fixed inset-0 z-[100]' : 'h-full relative'}`}>
            <form action={async (formData) => {
                const res = editingAppointment ? await updateAppointmentDetails(formData) : await createAppointment(formData);
                if (res?.error) {
                    toast({ title: "Error", description: res.error, variant: "destructive" });
                } else {
                    toast({ title: "Success", description: "Appointment Saved", className: "bg-green-600 text-white" });
                    if (onClose) onClose();
                }
            }} className={`flex-1 flex flex-col overflow-hidden ${isMaximized ? 'w-full h-full' : ''}`}>
                {editingAppointment && <input type="hidden" name="id" value={editingAppointment.id} />}

                {/* Premium Header - Elite Dynamic Terminal */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0 shadow-2xl">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-xl transition-all group"
                                title="Exit Terminal (Esc)"
                            >
                                <ArrowLeft className="h-6 w-6 text-white/70 group-hover:text-white" />
                            </button>
                            <div className="bg-white rounded-lg p-1">
                                <ZionaLogo size={32} variant="icon" theme="light" speed="slow" colorScheme="signature" />
                            </div>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10 mx-2" />
                        <div>
                            <h1 className="text-xl font-black tracking-tight italic uppercase flex items-center gap-2">
                                OP Clinical Terminal <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                            </h1>
                            <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-[10px] font-bold text-indigo-400 tracking-[0.3em] uppercase bg-indigo-500/10 px-2 py-0.5 rounded shadow-inner">
                                    Ready for Triage
                                </span>
                                <div className="h-1 w-1 rounded-full bg-white/20" />
                                <span className="text-[10px] font-medium text-white/50 tracking-widest uppercase">
                                    Deployment Node: Cloud-HMS.V2
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Window Controls */}
                        <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl mr-2 gap-1 px-2">
                            <button
                                type="button"
                                onClick={onMinimize || onClose}
                                className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all"
                                title="Minimize Terminal (Alt+M)"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <button
                                type="button"
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                            >
                                {isMaximized ? <Minimize2 className="h-3.5 w-3.5 text-indigo-400" /> : <Maximize2 className="h-3.5 w-3.5" />}
                                {isMaximized ? 'Float Terminal' : 'Fullscreen'}
                            </button>
                        </div>

                        <div className="flex items-center gap-3 pr-2 border-r border-white/10 mr-2">
                            <button
                                type="submit"
                                name="next_action"
                                value="bill"
                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                            >
                                <IndianRupee className="h-4 w-4" /> Confirm & Post Bill
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/20 font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                        >
                            <CheckCircle className="h-4 w-4" /> Finalize Booking
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 overflow-hidden bg-white dark:bg-slate-950">
                    {/* Left Column (Span 8) */}
                    <div className="lg:col-span-8 p-6 space-y-6 overflow-y-auto border-r border-gray-100 dark:border-white/5 custom-scrollbar">
                        {/* Status Strip - ALWAYS SHOW Billing/OP Ticket Info */}
                        <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-500/5 dark:to-slate-900 rounded-2xl p-4 flex items-center justify-between border border-indigo-100 dark:border-indigo-500/10 shadow-sm transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-500/30">
                                    OP#
                                </div>
                                <div className="min-w-[120px]">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-0.5">OP Ticket Number</div>
                                    <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                        {selectedPatient?.patient_number || <span className="text-slate-300 dark:text-slate-700 italic animate-pulse">AUTO-GENERATE</span>}
                                        {selectedPatient && <BadgeCheck className="h-5 w-5 text-emerald-500" />}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="h-10 w-[1px] bg-slate-200 dark:bg-white/10" />

                                <div className="text-right">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5 flex items-center justify-end gap-1">
                                        <IndianRupee className="h-2.5 w-2.5" /> Registration Fee
                                    </div>
                                    <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {hmsSettings ? `₹ ${hmsSettings.registrationFee}` : <Loader2 className="h-4 w-4 animate-spin inline ml-2" />}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Validity Period</div>
                                    <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                                        <BadgeCheck className="h-4 w-4" /> {hmsSettings ? `${hmsSettings.registrationValidity} Days` : '...'}
                                    </div>
                                </div>
                            </div>
                        </div>
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
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-5 group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-indigo-500" />
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Chief Complaint / Notes</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={startListening}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-indigo-500 hover:text-white'}`}
                                >
                                    {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                                    {isListening ? 'Listening...' : 'Voice Input'}
                                </button>
                            </div>
                            <textarea
                                name="notes"
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full p-4 bg-slate-50/50 dark:bg-black/50 text-slate-900 dark:text-white border border-gray-100 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none font-medium text-sm transition-all"
                                placeholder="State symptoms, history, or patient's primary complaint. Use the voice input for faster typing..."
                            ></textarea>
                            <div className="mt-2 flex items-center gap-2">
                                <Sparkles className="h-3 w-3 text-indigo-400" />
                                <span className="text-[10px] text-slate-400 font-medium">Auto-Formatting via Clinical Engine L4 enabled</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Span 4) */}
                    <div className="lg:col-span-4 p-6 space-y-6 overflow-y-auto bg-slate-50/30 dark:bg-white/[0.02] custom-scrollbar">
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
                                <label className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer shadow-sm ${selectedPriority === 'low' ? 'bg-green-100 border-green-500 scale-[1.02]' : 'bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-800/30'}`} onClick={() => setSelectedPriority('low')}>
                                    <input type="radio" name="priority" value="low" className="hidden" checked={selectedPriority === 'low'} onChange={() => { }} />
                                    <div className={`h-3 w-3 rounded-full border-2 ${selectedPriority === 'low' ? 'bg-green-600 border-green-600' : 'border-green-300'}`} />
                                    <span className={`text-xs font-black uppercase tracking-wider ${selectedPriority === 'low' ? 'text-green-700' : 'text-green-600/40'}`}>Low</span>
                                </label>
                                <label className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer shadow-sm ${selectedPriority === 'normal' ? 'bg-blue-100 border-blue-500 scale-[1.02]' : 'bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-800/30'}`} onClick={() => setSelectedPriority('normal')}>
                                    <input type="radio" name="priority" value="normal" className="hidden" checked={selectedPriority === 'normal'} onChange={() => { }} />
                                    <div className={`h-3 w-3 rounded-full border-2 ${selectedPriority === 'normal' ? 'bg-blue-600 border-blue-600' : 'border-blue-300'}`} />
                                    <span className={`text-xs font-black uppercase tracking-wider ${selectedPriority === 'normal' ? 'text-blue-700' : 'text-blue-600/40'}`}>Normal</span>
                                </label>
                                <label className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer shadow-sm ${selectedPriority === 'high' ? 'bg-orange-100 border-orange-500 scale-[1.02]' : 'bg-orange-50/50 border-orange-100 dark:bg-orange-900/10 dark:border-orange-800/30'}`} onClick={() => setSelectedPriority('high')}>
                                    <input type="radio" name="priority" value="high" className="hidden" checked={selectedPriority === 'high'} onChange={() => { }} />
                                    <div className={`h-3 w-3 rounded-full border-2 ${selectedPriority === 'high' ? 'bg-orange-600 border-orange-600' : 'border-orange-300'}`} />
                                    <span className={`text-xs font-black uppercase tracking-wider ${selectedPriority === 'high' ? 'text-orange-700' : 'text-orange-600/40'}`}>High</span>
                                </label>
                                <label className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer shadow-sm ${selectedPriority === 'urgent' ? 'bg-red-100 border-red-500 scale-[1.02]' : 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-800/30'}`} onClick={() => setSelectedPriority('urgent')}>
                                    <input type="radio" name="priority" value="urgent" className="hidden" checked={selectedPriority === 'urgent'} onChange={() => { }} />
                                    <div className={`h-3 w-3 rounded-full border-2 animate-pulse ${selectedPriority === 'urgent' ? 'bg-red-600 border-red-600' : 'border-red-300'}`} />
                                    <span className={`text-xs font-black uppercase tracking-wider ${selectedPriority === 'urgent' ? 'text-red-700' : 'text-red-600/40'}`}>Urgent</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                {onClose && <input type="hidden" name="source" value="dashboard" />}
            </form>

            {/* Quick Create Patient Modal */}
            {
                showNewPatientModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200">
                            <CreatePatientForm
                                onClose={() => setShowNewPatientModal(false)}
                                onSuccess={handlePatientCreated}
                            />
                        </div>
                    </div>
                )
            }
        </div >
    )
}
