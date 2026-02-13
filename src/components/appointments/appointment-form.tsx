'use client'

import { createAppointment, updateAppointmentDetails } from "@/app/actions/appointment"
import { ArrowLeft, Calendar, Clock, FileText, CheckCircle, MapPin, Video, Phone, AlertCircle, Stethoscope, IndianRupee, Save } from "lucide-react"
import Link from "next/link"
import { PatientDoctorSelectors } from "@/components/appointments/patient-doctor-selectors"
import { CreatePatientForm } from "@/components/hms/create-patient-form"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ZionaLogo } from "@/components/branding/ziona-logo"
import { Maximize2, Minimize2, Mic, MicOff, ShieldAlert, BadgeCheck, Sparkles, Loader2, Minus } from "lucide-react"
import { getHMSSettings } from "@/app/actions/settings"
import { generateConsultationInvoice, generateOPBookingInvoice, linkInvoiceToAppointment } from "@/app/actions/billing"
import { getPatientById } from "@/app/actions/patient-v10"
import { QuickPaymentGateway } from "@/components/hms/quick-payment-gateway"
import { CreditCard as CardIcon, X, Printer } from "lucide-react"
import { OpSlipDialog } from "@/components/hms/reception/op-slip-dialog"

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
    const { toast } = useToast()
    const router = useRouter()
    const { patient_id: initialPatientId, date: initialDate, time: initialTime } = initialData

    // Derived values for initial state
    const defaultPatientId = editingAppointment?.patient?.id || editingAppointment?.patient_id || initialPatientId || ''
    const defaultDate = editingAppointment
        ? new Date(editingAppointment.start_time).toISOString().split('T')[0]
        : (initialDate || new Date().toISOString().split('T')[0])
    const defaultTime = editingAppointment
        ? new Date(editingAppointment.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        : (initialTime || '')
    const defaultClinicianId = editingAppointment?.clinician?.id || editingAppointment?.clinician_id || ''

    // State
    const [localPatients, setLocalPatients] = useState(patients)
    const [selectedPatientId, setSelectedPatientId] = useState(defaultPatientId)
    const [selectedPatientData, setSelectedPatientData] = useState<any>(null)
    const [showNewPatientModal, setShowNewPatientModal] = useState(false)
    const [selectedClinicianId, setSelectedClinicianId] = useState(defaultClinicianId)
    const [selectedDate, setSelectedDate] = useState(defaultDate)
    const [suggestedTime, setSuggestedTime] = useState(defaultTime)
    const [isMaximized, setIsMaximized] = useState(true)
    const [isListening, setIsListening] = useState(false)
    const [hmsSettings, setHmsSettings] = useState<any>(null)
    const [notes, setNotes] = useState(editingAppointment?.notes || '')
    const [isPending, setIsPending] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState<any>(null) // [NEW] Track save results

    // RCM States
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [invoiceForPayment, setInvoiceForPayment] = useState<any>(null)
    const [isRCMProcessing, setIsRCMProcessing] = useState(false)
    const [pendingFormData, setPendingFormData] = useState<FormData | null>(null)

    // Sync state when editingAppointment changes or prop updates
    useEffect(() => {
        if (editingAppointment) {
            setSelectedPatientId(editingAppointment.patient?.id || editingAppointment.patient_id || '')
            setSelectedClinicianId(editingAppointment.clinician?.id || editingAppointment.clinician_id || '')
            setSelectedDate(new Date(editingAppointment.start_time).toISOString().split('T')[0])
            setSuggestedTime(new Date(editingAppointment.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))
        }
    }, [editingAppointment])

    // Load Initial Patient Data for registration status checks
    useEffect(() => {
        if (selectedPatientId) {
            // Avoid redundant fetch if we already have the data (e.g. from handlePatientCreated)
            if (selectedPatientData?.id === selectedPatientId) return;

            // Clear stale data before fetching new
            setSelectedPatientData(null)

            getPatientById(selectedPatientId).then(res => {
                if (res.success) setSelectedPatientData(res.data)
            })
        } else {
            setSelectedPatientData(null)
        }
    }, [selectedPatientId]) // We check selectedPatientData internally to avoid loop

    // Auto-select first doctor if none specified handled via component default now

    // CORE: Dynamic Time Selection Engine (Reactive Triage)
    useEffect(() => {
        // Only run for new appointments. If editing, we respect current time unless manually changed.
        if (editingAppointment || !selectedClinicianId || !selectedDate || !doctors.length) return;

        const doctor = doctors.find(d => d.id === selectedClinicianId)
        if (!doctor) return;

        const defaultStart = doctor.consultation_start_time || "09:00"
        const defaultEnd = doctor.consultation_end_time || "17:00"

        // Filter for this doctor on selected day
        const doctorApts = appointments.filter(a => {
            const aptDate = new Date(a.starts_at).toISOString().split('T')[0];
            return a.clinician_id === selectedClinicianId && aptDate === selectedDate && a.status !== 'cancelled';
        })

        const now = new Date();
        const localDateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        const isToday = selectedDate === localDateStr;

        // Match Date Safely (Local Time to avoid UTC shift)
        const [year, month, dayOfMonth] = selectedDate.split('-').map(Number);
        const dayStart = new Date(year, month - 1, dayOfMonth);
        const [startH, startM] = defaultStart.split(':').map(Number);
        dayStart.setHours(startH, startM, 0, 0);

        let nextSlotTime: Date;

        if (doctorApts.length === 0) {
            nextSlotTime = (isToday && now > dayStart) ? now : dayStart;
        } else {
            const lastEndApt = doctorApts.reduce((latest, current) => {
                return new Date(current.ends_at) > new Date(latest.ends_at) ? current : latest
            }, doctorApts[0])

            nextSlotTime = new Date(new Date(lastEndApt.ends_at).getTime());
            if (isToday && nextSlotTime < now) nextSlotTime = now;
        }

        const [endH, endM] = defaultEnd.split(':').map(Number);
        const dayEnd = new Date(year, month - 1, dayOfMonth);
        dayEnd.setHours(endH, endM, 0, 0);

        // Debug Log to reveal mismatch
        console.log(`Slotting Logic [${selectedDate}]:`, {
            nextSlot: nextSlotTime.toLocaleTimeString(),
            dayEnd: dayEnd.toLocaleTimeString(),
            isFullyBooked: nextSlotTime >= dayEnd
        });

        if (nextSlotTime >= dayEnd && isToday) {
            setSuggestedTime('Fully Booked')
        } else {
            // Round up to nearest 5 minutes
            const roundedMinutes = Math.ceil(nextSlotTime.getMinutes() / 5) * 5;
            const finalTime = new Date(nextSlotTime);
            finalTime.setMinutes(roundedMinutes, 0, 0);

            // If rounding pushed us past dayEnd, mark booked
            if (finalTime >= dayEnd) {
                setSuggestedTime('Fully Booked')
            } else {
                const hours = finalTime.getHours().toString().padStart(2, '0')
                const minutes = finalTime.getMinutes().toString().padStart(2, '0')
                setSuggestedTime(`${hours}:${minutes}`)
            }
        }
    }, [selectedClinicianId, selectedDate, appointments, doctors, editingAppointment])

    // HMS Settings (Reg Fee, etc.)
    useEffect(() => {
        getHMSSettings().then(res => {
            if (res.success) setHmsSettings(res.settings)
        })
    }, [])

    const checkRegistrationStatus = () => {
        // [FIX] Ensure we are checking the CURRENTLY selected patient data
        if (!selectedPatientData || selectedPatientData.id !== selectedPatientId) {
            return { shouldCharge: true, status: 'loading' };
        }

        const metadata = (selectedPatientData.metadata as any) || {};

        // [AUDIT] Explicit check for 'awaiting_payment' status set during creation
        if (metadata.status === 'awaiting_payment') {
            return { shouldCharge: true, status: 'awaiting_payment' };
        }

        const expiryDateStr = metadata.registration_expiry;
        if (!expiryDateStr) return { shouldCharge: true, status: 'missing_date' };

        const expiryDate = new Date(expiryDateStr);
        // Handle Invalid Date strings
        if (isNaN(expiryDate.getTime())) return { shouldCharge: true, status: 'invalid_date' };

        const isExpired = expiryDate < new Date();

        return {
            shouldCharge: isExpired,
            status: isExpired ? 'expired' : 'valid',
            expiryDate: expiryDateStr
        };
    };

    const handlePatientCreated = (newPatient: any) => {
        console.log("Terminal: Patient created, linking to session...", newPatient.id);

        // 1. Update list and selection
        setLocalPatients(prev => {
            const exists = prev.some(p => p.id === newPatient.id);
            if (exists) return prev;
            return [newPatient, ...prev];
        })
        setSelectedPatientId(newPatient.id)
        setSelectedPatientData(newPatient) // [FIX] Set data immediately to avoid stale checks

        // 2. SUCCESS-EXIT: Modal Closure
        setShowNewPatientModal(false)

        // 3. User Feedback
        toast({
            title: "Patient Linked",
            description: `${newPatient.first_name} is now active in the terminal.`,
            className: "bg-indigo-600 text-white shadow-2xl"
        })

        // 4. Focus Management: Shift focus to the clinician selector for faster flow
        setTimeout(() => {
            const clinicianSelect = document.querySelector('[name="clinician_id"]') as HTMLElement;
            clinicianSelect?.focus();
        }, 300);
    }

    const executeSave = async (data: FormData) => {
        setIsPending(true)
        try {
            const res = editingAppointment ? await updateAppointmentDetails(data) : await createAppointment(data);
            if (res?.error) {
                toast({ title: "Action Failed", description: res.error, variant: "destructive" });
            } else {
                const aptId = editingAppointment?.id || res.data?.id;

                // [NEW] Link pre-generated/paid invoice to appointment
                if (invoiceForPayment?.id && aptId) {
                    await linkInvoiceToAppointment(invoiceForPayment.id, aptId);
                }

                // Ensure consultation invoice exists if not pre-generated
                if (aptId) await generateConsultationInvoice(aptId);

                // [WORLD CLASS] Instead of immediate exit, show Success Stage
                setSaveSuccess(editingAppointment ? { ...editingAppointment, id: aptId } : res.data);

                toast({
                    title: "Medical Record Finalized",
                    description: editingAppointment ? "Clinical encounter updated." : "Session finalized and billing initiated.",
                    className: "bg-emerald-600 text-white"
                });
            }
        } catch (error: any) {
            toast({ title: "Terminal Crash", description: error.message, variant: "destructive" })
        } finally {
            setIsPending(false);
        }
    }

    async function handleSubmit(formData: FormData) {
        if (!selectedPatientId) {
            toast({ title: "Patient Missing", description: "Select a patient to finalize the session.", variant: "destructive" });
            return;
        }

        setIsPending(true)
        try {
            if (!editingAppointment) {
                const regStatus = checkRegistrationStatus();
                const clinician = doctors.find(d => d.id === selectedClinicianId);
                const consultationFee = Number(clinician?.consultation_fee) || 0;
                const totalDue = (regStatus.shouldCharge ? 150 : 0) + consultationFee; // Rough estimate for check

                if (totalDue > 0) {
                    setIsRCMProcessing(true);
                    const invRes = await generateOPBookingInvoice({
                        patientId: selectedPatientId,
                        clinicianId: selectedClinicianId,
                        includeRegistration: regStatus.shouldCharge
                    }) as any;

                    if (invRes.success) {
                        setInvoiceForPayment(invRes.data);
                        setPendingFormData(formData);
                        setIsPaymentOpen(true);
                        setIsPending(false);
                        return;
                    } else if (invRes.error && invRes.error.includes("No fees due")) {
                        // Fall through if it was just zero-fee validation
                    } else {
                        toast({ title: "RCM Error", description: invRes.error, variant: "destructive" });
                        setIsPending(false);
                        setIsRCMProcessing(false);
                        return;
                    }
                }
            }
            await executeSave(formData);
        } catch (error: any) {
            toast({ title: "Finalization Error", description: error.message, variant: "destructive" })
            setIsPending(false)
        }
    }

    const [selectedPriority, setSelectedPriority] = useState(editingAppointment?.priority || 'normal')
    const selectedPatient = localPatients.find(p => p.id === selectedPatientId)
    const activeRegStatus = checkRegistrationStatus();

    // [NEW] SUCCESS STAGE VIEW
    if (saveSuccess) {
        return (
            <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center p-4">
                <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-white/10 p-10 text-center animate-in zoom-in-95 duration-300">
                    <div className="h-24 w-24 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20">
                        <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400 animate-bounce" />
                    </div>

                    <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-2">Saved <span className="text-emerald-600">Successfully</span></h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">Patient flow initiated for OP Consultation</p>

                    <div className="grid grid-cols-1 gap-4 mb-10">
                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Patient</p>
                                <p className="text-lg font-black text-slate-900 dark:text-white">{saveSuccess.patient?.first_name || 'Record'} {saveSuccess.patient?.last_name || ''}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Token No</p>
                                <p className="text-lg font-black text-indigo-600 font-mono">#{saveSuccess.id?.split('-')[0].toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                            <OpSlipDialog
                                appointment={{ ...saveSuccess, patient: saveSuccess.patient || selectedPatientData, clinician: saveSuccess.clinician || doctors.find(d => d.id === selectedClinicianId) }}
                                trigger={
                                    <button className="flex-[1.5] h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-xl shadow-indigo-500/20 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-active active:scale-95 text-sm">
                                        <Printer className="h-6 w-6" /> Print OP Ticket
                                    </button>
                                }
                            />
                            {invoiceForPayment && (
                                <button
                                    onClick={() => window.open(`/hms/billing/${invoiceForPayment.id}/print`, '_blank')}
                                    className="flex-1 h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/20 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-active active:scale-95 text-sm"
                                >
                                    <IndianRupee className="h-5 w-5" /> Print Bill
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => {
                                    setSaveSuccess(null);
                                    setSelectedPatientId('');
                                    setSelectedPatientData(null);
                                    setNotes('');
                                    router.refresh();
                                }}
                                className="h-14 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                            >
                                Register Next
                            </button>
                            <button
                                onClick={() => {
                                    router.refresh();
                                    onClose?.();
                                }}
                                className="h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all"
                            >
                                Dashboard View
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`relative bg-slate-900 border border-white/20 shadow-2xl overflow-hidden transition-all duration-500 ease-in-out ${isMaximized ? 'fixed inset-0 z-[100]' : 'w-full h-full relative'}`}>
            {/* Elite Terminal Header */}
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
                            <span className="text-[10px] font-bold text-indigo-400 tracking-[0.3em] uppercase bg-indigo-500/10 px-2 py-0.5 rounded shadow-inner tracking-widest">Active Encounter</span>
                            <div className="h-1 w-1 rounded-full bg-white/20" />
                            <span className="text-[10px] font-medium text-white/50 tracking-widest uppercase">ZIONA-HMS Deployment: V10.2</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl mr-2 gap-1 px-2">
                        <button type="button" onClick={onMinimize || onClose} className="p-2 hover:bg-white/10 rounded-lg text-white/50 transition-all"><Minus className="h-4 w-4" /></button>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <button type="button" onClick={() => setIsMaximized(!isMaximized)} className="p-2 hover:bg-white/10 rounded-lg text-white/70 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            {isMaximized ? <Minimize2 className="h-3.5 w-3.5 text-indigo-400" /> : <Maximize2 className="h-3.5 w-3.5" />}
                            {isMaximized ? 'Dock Terminal' : 'Fullscreen'}
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            const form = document.getElementById('appointment-terminal-form') as HTMLFormElement;
                            if (form) form.requestSubmit();
                        }}
                        disabled={isPending}
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-500/20 font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center gap-3 border border-indigo-400/20 disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        {editingAppointment ? 'Update Encounter' : 'Save'}
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
                        {/* Status Strip (RCM Snapshot) */}
                        <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-500/5 dark:to-slate-900 rounded-2xl p-4 flex items-center justify-between border border-indigo-100 dark:border-indigo-500/10 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-500/30 font-mono">OP</div>
                                <div className="min-w-[120px]">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-0.5">Patient Number</div>
                                    <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                        {selectedPatient?.patient_number || <span className="text-slate-300 dark:text-slate-700 italic animate-pulse">PENDING</span>}
                                        {selectedPatient && <BadgeCheck className="h-5 w-5 text-emerald-500" />}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="h-10 w-[1px] bg-slate-200 dark:bg-white/10" />
                                <div className="text-right">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5 flex items-center justify-end gap-1">Reg Audit</div>
                                    <div className={`text-sm font-black tracking-tight ${activeRegStatus.shouldCharge ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {activeRegStatus.shouldCharge ? 'PAYMENT REQUIRED' : 'FEES CLEARED'}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5 uppercase">Validity Expiry</div>
                                    <div className="text-xs font-bold text-slate-500">
                                        {activeRegStatus.expiryDate ? new Date(activeRegStatus.expiryDate).toLocaleDateString() : 'N/A (New Record)'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <PatientDoctorSelectors
                            patients={localPatients}
                            doctors={doctors}
                            selectedPatientId={selectedPatientId}
                            selectedClinicianId={selectedClinicianId}
                            onClinicianSelect={setSelectedClinicianId}
                            onPatientSelect={setSelectedPatientId}
                            onNewPatientClick={() => setShowNewPatientModal(true)}
                        />

                        {/* Schedule & Slotting */}
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white dark:border-slate-800 shadow-sm p-4 ring-1 ring-slate-100">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-slate-300 mb-1.5 uppercase tracking-tighter"><Calendar className="h-3.5 w-3.5 inline mr-1" /> Appointment Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full p-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-slate-300 mb-1.5 uppercase tracking-tighter"><Clock className="h-3.5 w-3.5 inline mr-1" /> Estimated Slot</label>
                                    <input
                                        type="time"
                                        name="time"
                                        required={suggestedTime !== 'Fully Booked'} // [FIX] Don't require if fully booked (allowing override)
                                        key={suggestedTime}
                                        defaultValue={suggestedTime === 'Fully Booked' ? '' : suggestedTime}
                                        placeholder={suggestedTime === 'Fully Booked' ? 'Overtime/Booked' : ''}
                                        className={`w-full p-2.5 bg-white dark:bg-slate-950 border ${suggestedTime === 'Fully Booked' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-gray-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-medium`}
                                    />
                                    {suggestedTime === 'Fully Booked' && (
                                        <p className="text-[10px] font-black text-amber-600 mt-1 uppercase tracking-widest animate-pulse">⚠️ Late Hours / Fully Booked (Override possible)</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Clinical Notes (Voice-Enabled) */}
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-5 group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-indigo-500" />
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Reason for Visit / History</h3>
                                </div>
                                <button type="button" onClick={() => setIsListening(!isListening)} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-indigo-500 hover:text-white'}`}>
                                    {isListening ? 'Stop Listening' : 'Voice Dictate'}
                                </button>
                            </div>
                            <textarea
                                name="notes"
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full p-4 bg-slate-50/50 dark:bg-black/50 border border-gray-100 dark:border-white/5 rounded-2xl focus:ring-indigo-500 focus:bg-white outline-none resize-none font-medium text-sm transition-all"
                                placeholder="State symptoms, history, or patient complaint..."
                            ></textarea>
                            <div className="mt-2 flex items-center gap-2 opacity-50">
                                <Sparkles className="h-3 w-3 text-indigo-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Medical Transcription Engine L2 Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 p-6 space-y-6 overflow-y-auto bg-slate-50/30 dark:bg-white/[0.02] custom-scrollbar">
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white dark:border-slate-800 shadow-sm p-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-black uppercase tracking-tighter text-slate-400 mb-1.5 ml-1">Visit Type</label>
                                    <select name="type" defaultValue={editingAppointment?.type || 'consultation'} className="w-full p-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl outline-none font-bold text-sm tracking-tight text-slate-800">
                                        <option value="consultation">🩺 Consultation Visit</option>
                                        <option value="follow_up">🔄 Follow-Up Session</option>
                                        <option value="emergency">🚨 Emergency Admission</option>
                                        <option value="procedure">💉 Clinical Procedure</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-black uppercase tracking-tighter text-slate-400 mb-1.5 ml-1">Encounter Mode</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl cursor-pointer transition-all hover:border-indigo-500 group">
                                            <input type="radio" name="mode" value="in_person" defaultChecked={!editingAppointment || editingAppointment.mode === 'in_person'} className="text-indigo-600 focus:ring-0" />
                                            <span className="text-sm font-black uppercase tracking-tighter text-slate-600 group-hover:text-indigo-600">On-Site Clinic Visit</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl cursor-pointer transition-all hover:border-indigo-500 group">
                                            <input type="radio" name="mode" value="video" defaultChecked={editingAppointment?.mode === 'video'} className="text-indigo-600 focus:ring-0" />
                                            <span className="text-sm font-black uppercase tracking-tighter text-slate-600 group-hover:text-indigo-600">Video Consultation</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white dark:border-slate-800 shadow-sm p-4">
                            <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 text-slate-400 ml-1">Clinical Priority</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['low', 'normal', 'high', 'urgent'].map(p => (
                                    <label key={p} className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${selectedPriority === p ? 'bg-indigo-50 border-indigo-500 shadow-md shadow-indigo-500/10' : 'bg-gray-50 border-gray-100'}`} onClick={() => setSelectedPriority(p)}>
                                        <input type="radio" name="priority" value={p} className="hidden" checked={selectedPriority === p} onChange={() => { }} />
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPriority === p ? 'text-indigo-700' : 'text-slate-400'}`}>{p}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Save Trigger (Legacy Consistency) */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex justify-end shrink-0">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-10 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {editingAppointment ? 'Update Record' : 'Finalize & Save'}
                    </button>
                </div>
            </form>

            {/* Overlays Bridge */}
            {showNewPatientModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 backdrop-blur-lg p-4 animate-in fade-in duration-300">
                    <div className="w-full max-w-5xl shadow-2xl relative">
                        <button
                            onClick={() => setShowNewPatientModal(false)}
                            className="absolute -top-14 right-0 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center gap-2 font-black uppercase text-[10px] tracking-widest transition-all backdrop-blur-xl border border-white/10"
                        >
                            <X className="h-4 w-4" /> Cancel Overlay (Esc)
                        </button>
                        <CreatePatientForm
                            onClose={() => setShowNewPatientModal(false)}
                            onSuccess={handlePatientCreated}
                            hideBilling={true} // Triage terminal will handle fees on finalize
                        />
                    </div>
                </div>
            )}

            {isPaymentOpen && invoiceForPayment && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
                    <div className="w-full max-w-2xl animate-in zoom-in-95 duration-300">
                        <QuickPaymentGateway
                            isOpen={isPaymentOpen}
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
                                toast({ title: "Session Deferred", description: "Payment must be completed to finalize encounter." });
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
