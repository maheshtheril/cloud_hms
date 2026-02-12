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
import { generateConsultationInvoice, generateRegistrationInvoice } from "@/app/actions/billing"
import { getPatientById } from "@/app/actions/patient-v10"
import { QuickPaymentGateway } from "@/components/hms/quick-payment-gateway"
import { CreditCard as CardIcon } from "lucide-react"

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
    const [selectedPatientData, setSelectedPatientData] = useState<any>(null)
    const [showNewPatientModal, setShowNewPatientModal] = useState(false)
    const [selectedClinicianId, setSelectedClinicianId] = useState(defaultClinicianId)
    const [suggestedTime, setSuggestedTime] = useState(defaultTime)
    const [isMaximized, setIsMaximized] = useState(true)
    const [isListening, setIsListening] = useState(false)
    const [hmsSettings, setHmsSettings] = useState<any>(null)
    const [notes, setNotes] = useState(editingAppointment?.notes || '')

    // RCM States
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [invoiceForPayment, setInvoiceForPayment] = useState<any>(null)
    const [isRCMProcessing, setIsRCMProcessing] = useState(false)
    const [pendingFormData, setPendingFormData] = useState<FormData | null>(null)

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

    // Fetch Full Patient Data for Audit
    useEffect(() => {
        if (selectedPatientId) {
            getPatientById(selectedPatientId).then(res => {
                if (res.success) setSelectedPatientData(res.data)
            })
        } else {
            setSelectedPatientData(null)
        }
    }, [selectedPatientId])

    // Aggressive Doctor Auto-Selection (Ensures it happens as soon as doctors load)
    useEffect(() => {
        if (!selectedClinicianId && doctors.length > 0) {
            setSelectedClinicianId(doctors[0].id)
        }
    }, [doctors, selectedClinicianId])

    // Keyboard Shortcut
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

    // Fetch HMS settings
    useEffect(() => {
        getHMSSettings().then(res => {
            if (res.success) setHmsSettings(res.settings)
        })
    }, [])

    const checkRegistrationStatus = () => {
        if (!selectedPatientData) return { shouldCharge: true, status: 'new' };

        const metadata = (selectedPatientData.metadata as any) || {};
        const expiryDateStr = metadata.registration_expiry;

        if (!expiryDateStr) return { shouldCharge: true, status: 'missing_date' };

        const expiryDate = new Date(expiryDateStr);
        const isExpired = expiryDate < new Date();

        return {
            shouldCharge: isExpired,
            status: isExpired ? 'expired' : 'valid',
            expiryDate: expiryDateStr
        };
    };

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

    const handleClinicianChange = (clinicianId: string) => {
        setSelectedClinicianId(clinicianId)
        if (!clinicianId) return

        if (editingAppointment && clinicianId === editingAppointment.clinician?.id) {
            setSuggestedTime(defaultTime)
            return
        }

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

    const { toast } = useToast()
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const handlePatientCreated = (newPatient: any) => {
        setLocalPatients(prev => [newPatient, ...prev])
        setSelectedPatientId(newPatient.id)
        setShowNewPatientModal(false)
    }

    const executeSave = async (data: FormData) => {
        setIsPending(true)
        try {
            let res;
            if (editingAppointment) {
                res = await updateAppointmentDetails(data);
            } else {
                res = await createAppointment(data);
            }

            if (res?.error) {
                toast({ title: "Action Failed", description: res.error, variant: "destructive" });
            } else {
                // [RCM] Save to Bill
                const aptId = editingAppointment?.id || res.data?.id;
                if (aptId) {
                    await generateConsultationInvoice(aptId);
                }

                toast({
                    title: "Medical Record Finalized",
                    description: editingAppointment ? "Clinical encounter updated successfully." : "Appointment and billing sequence initiated.",
                    className: "bg-emerald-600 text-white"
                });

                if (onClose) {
                    router.refresh();
                    onClose();
                } else {
                    router.push("/hms/reception/dashboard");
                }
            }
        } catch (error: any) {
            toast({ title: "Internal Terminal Error", description: error.message, variant: "destructive" })
        } finally {
            setIsPending(false);
        }
    }

    async function handleSubmit(formData: FormData) {
        if (!selectedPatientId) {
            toast({ title: "Patient Missing", description: "Please select a patient to finalize the encounter.", variant: "destructive" });
            return;
        }

        setIsPending(true)
        try {
            if (!editingAppointment) {
                const regStatus = checkRegistrationStatus();
                if (regStatus.shouldCharge) {
                    setIsRCMProcessing(true);
                    const invRes = await generateRegistrationInvoice(selectedPatientId);
                    if (invRes.success) {
                        setInvoiceForPayment(invRes.data);
                        setPendingFormData(formData);
                        setIsPaymentOpen(true);
                        setIsPending(false);
                        return;
                    } else {
                        toast({ title: "RCM Error", description: invRes.error, variant: "destructive" });
                    }
                }
            }
            await executeSave(formData);
        } catch (error: any) {
            toast({ title: "Submission Error", description: error.message, variant: "destructive" })
            setIsPending(false)
        }
    }

    const [selectedPriority, setSelectedPriority] = useState(editingAppointment?.priority || 'normal')
    const selectedPatient = localPatients.find(p => p.id === selectedPatientId)
    const activeRegStatus = checkRegistrationStatus();

    return (
        <div className={`relative bg-slate-900 border border-white/20 shadow-2xl overflow-hidden transition-all duration-500 ease-in-out ${isMaximized ? 'fixed inset-0 z-[100]' : 'w-full h-full relative'}`}>
            {/* Elite Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0 shadow-2xl relative z-30">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all group">
                            <ArrowLeft className="h-6 w-6 text-white/70 group-hover:text-white" />
                        </button>
                        <div className="bg-white rounded-lg p-1">
                            <ZionaLogo size={32} variant="icon" theme="light" speed="slow" colorScheme="signature" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight italic uppercase flex items-center gap-2 text-white">
                            OP Clinical Terminal <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                        </h1>
                        <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] font-bold text-indigo-400 tracking-[0.3em] uppercase bg-indigo-500/10 px-2 py-0.5 rounded shadow-inner">Ready for Triage</span>
                            <div className="h-1 w-1 rounded-full bg-white/20" />
                            <span className="text-[10px] font-medium text-white/50 tracking-widest uppercase">Deployment Node: ZIONA-HMS.V10</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl mr-2 gap-1 px-2">
                        <button type="button" onClick={onMinimize || onClose} className="p-2 hover:bg-white/10 rounded-lg text-white/50 transition-all"><Minus className="h-4 w-4" /></button>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <button type="button" onClick={() => setIsMaximized(!isMaximized)} className="p-2 hover:bg-white/10 rounded-lg text-white/70 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            {isMaximized ? <Minimize2 className="h-3.5 w-3.5 text-indigo-400" /> : <Maximize2 className="h-3.5 w-3.5" />}
                            {isMaximized ? 'Float' : 'Full'}
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            const form = document.getElementById('appointment-terminal-form') as HTMLFormElement;
                            if (form) form.requestSubmit();
                        }}
                        disabled={isPending}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl shadow-xl shadow-emerald-500/20 font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center gap-3 border border-emerald-400/20 disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                        {editingAppointment ? 'Update Encounter' : 'Finalize Session & Save'}
                    </button>
                </div>
            </div>

            <form
                id="appointment-terminal-form"
                onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }}
                className="flex flex-col h-[calc(100%-88px)] overflow-hidden bg-white dark:bg-slate-950"
            >
                {editingAppointment && <input type="hidden" name="id" value={editingAppointment.id} />}
                <input type="hidden" name="source" value="dashboard" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 overflow-hidden">
                    <div className="lg:col-span-8 p-6 space-y-6 overflow-y-auto border-r border-gray-100 dark:border-white/5 custom-scrollbar">
                        {/* Status Strip */}
                        <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-500/5 dark:to-slate-900 rounded-2xl p-4 flex items-center justify-between border border-indigo-100 dark:border-indigo-500/10 shadow-sm transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-500/30">OP#</div>
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
                                        <IndianRupee className="h-2.5 w-2.5" /> Reg Status
                                    </div>
                                    <div className={`text-sm font-black tracking-tight ${activeRegStatus.shouldCharge ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {activeRegStatus.shouldCharge ? 'FEES DUE' : 'VALID / PAID'}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Expiry</div>
                                    <div className="text-xs font-bold text-slate-500">{activeRegStatus.expiryDate ? new Date(activeRegStatus.expiryDate).toLocaleDateString() : 'New Patient'}</div>
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

                        {/* Schedule */}
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white dark:border-slate-800 shadow-sm p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 dark:text-slate-300 mb-1.5"><Calendar className="h-3.5 w-3.5 inline mr-1" /> Date</label>
                                    <input type="date" name="date" required defaultValue={defaultDate} className="w-full p-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 dark:text-slate-300 mb-1.5"><Clock className="h-3.5 w-3.5 inline mr-1" /> Time</label>
                                    <input type={suggestedTime === 'Fully Booked' ? 'text' : 'time'} name="time" required key={suggestedTime} defaultValue={suggestedTime === 'Fully Booked' ? '' : suggestedTime} readOnly={suggestedTime === 'Fully Booked'} placeholder={suggestedTime === 'Fully Booked' ? 'Fully Booked' : ''} className={`w-full p-2.5 bg-white dark:bg-slate-950 border ${suggestedTime === 'Fully Booked' ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-medium`} />
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-5 group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-indigo-500" />
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Chief Complaint / Notes</h3>
                                </div>
                                <button type="button" onClick={startListening} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}>
                                    {isListening ? 'Listening...' : 'Voice Input'}
                                </button>
                            </div>
                            <textarea name="notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-4 bg-slate-50/50 dark:bg-black/50 border border-gray-100 dark:border-white/5 rounded-2xl focus:ring-indigo-500 outline-none resize-none font-medium text-sm transition-all" placeholder="State symptoms, history..."></textarea>
                        </div>
                    </div>

                    <div className="lg:col-span-4 p-6 space-y-6 overflow-y-auto bg-slate-50/30 dark:bg-white/[0.02] custom-scrollbar">
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white dark:border-slate-800 shadow-sm p-4">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 dark:text-slate-300 mb-1.5">Visit Type</label>
                                    <select name="type" defaultValue={editingAppointment?.type || 'consultation'} className="w-full p-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg outline-none font-medium text-sm">
                                        <option value="consultation">🩺 Initial Consultation</option>
                                        <option value="follow_up">🔄 Follow Up Visit</option>
                                        <option value="emergency">🚨 Emergency</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 dark:text-slate-300 mb-1.5">Consultation Mode</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        <label className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer transition-all">
                                            <input type="radio" name="mode" value="in_person" defaultChecked={!editingAppointment || editingAppointment.mode === 'in_person'} className="text-blue-600" />
                                            <span className="text-sm font-medium">In-Person Visit</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer transition-all">
                                            <input type="radio" name="mode" value="video" defaultChecked={editingAppointment?.mode === 'video'} className="text-purple-600" />
                                            <span className="text-sm font-medium">Video Call</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white dark:border-slate-800 shadow-sm p-4">
                            <label className="block text-sm font-semibold mb-3">Priority</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['low', 'normal', 'high', 'urgent'].map(p => (
                                    <label key={p} className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${selectedPriority === p ? 'bg-indigo-50 border-indigo-500' : 'bg-gray-50 border-gray-100'}`} onClick={() => setSelectedPriority(p)}>
                                        <input type="radio" name="priority" value={p} className="hidden" checked={selectedPriority === p} onChange={() => { }} />
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${selectedPriority === p ? 'text-indigo-700' : 'text-gray-400'}`}>{p}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Modals */}
            {showNewPatientModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <CreatePatientForm onClose={() => setShowNewPatientModal(false)} onSuccess={handlePatientCreated} hideBilling={true} />
                    </div>
                </div>
            )}

            {isPaymentOpen && invoiceForPayment && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
                    <div className="w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <QuickPaymentGateway
                            invoice={invoiceForPayment}
                            onSuccess={async () => {
                                setIsPaymentOpen(false);
                                if (pendingFormData) {
                                    await executeSave(pendingFormData);
                                }
                            }}
                            onClose={() => {
                                setIsPaymentOpen(false);
                                setIsRCMProcessing(false);
                            }}
                        />
                    </div>
                </div>
            )}
        </div >
    )
}
