'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Printer, Plus, Trash2, Copy, Eraser, Clock, Zap, X, Save, Thermometer, Brain, Heart, Activity as ActivityIcon, MessageCircle, FileText, Share2, Loader2, User, Pill, CheckCircle2, Search, AlertCircle, PenTool, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/ui/use-toast'
import { sharePrescriptionWhatsapp } from '@/app/actions/prescription'

interface PrescriptionEditorProps {
    isModal?: boolean
    onClose?: () => void
}

export function PrescriptionEditor({ isModal = false, onClose }: PrescriptionEditorProps) {
    const router = useRouter()
    const { toast } = useToast()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patientId')
    const appointmentId = searchParams.get('appointmentId')

    const [patientInfo, setPatientInfo] = useState<any>(null)
    const [resolvedPatientId, setResolvedPatientId] = useState<string | null>(patientId)
    const [medicines, setMedicines] = useState<any[]>([])
    const [selectedMedicines, setSelectedMedicines] = useState<any[]>([])

    // Medicine search & modal
    const [medicineSearch, setMedicineSearch] = useState('')
    const [filteredMedicines, setFilteredMedicines] = useState<any[]>([])
    const [showMedicineDropdown, setShowMedicineDropdown] = useState(false)
    const [showMedicineModal, setShowMedicineModal] = useState(false)
    const [currentMedicine, setCurrentMedicine] = useState<any>(null)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    // Medicine config in modal
    const [modalDosage, setModalDosage] = useState('1-0-1')
    const [modalDays, setModalDays] = useState('5')
    const [modalTiming, setModalTiming] = useState('After Food')

    // SCRIBBLE / HANDWRITING MODAL STATE
    const [scribbleModalOpen, setScribbleModalOpen] = useState(false)
    const [scribbleTarget, setScribbleTarget] = useState<keyof typeof convertedText | null>(null)
    const [isConvertingScribble, setIsConvertingScribble] = useState(false)
    const scribbleCanvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)

    const [isSaving, setIsSaving] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const [lastSavedId, setLastSavedId] = useState<string | null>(null)

    // Clinical Text Fields
    const [convertedText, setConvertedText] = useState({
        // Vitals are separate now, stored for legacy/save compatibility if needed, but display is changing
        vitals: '',
        diagnosis: '',
        complaint: '',
        examination: '',
        plan: ''
    })

    // Structured Vitals State
    const [vitalsData, setVitalsData] = useState<any>(null)

    const [selectedLabs, setSelectedLabs] = useState<any[]>([])
    const [labSearch, setLabSearch] = useState('')
    const [filteredLabs, setFilteredLabs] = useState<any[]>([])
    const [showLabDropdown, setShowLabDropdown] = useState(false)
    const [isSearchingLabs, setIsSearchingLabs] = useState(false)

    // Dynamic Masters from Database
    const [dbTemplates, setDbTemplates] = useState<any[]>([])
    const [loadingTemplates, setLoadingTemplates] = useState(true)
    const [loadingPrevious, setLoadingPrevious] = useState(false)

    // Helper to get icon for a template
    const getTemplateIcon = (name: string) => {
        const lower = name.toLowerCase()
        if (lower.includes('fever') || lower.includes('cold')) return <Thermometer className="h-3 w-3" />
        if (lower.includes('heart') || lower.includes('tension')) return <Heart className="h-3 w-3" />
        if (lower.includes('brain') || lower.includes('migraine')) return <Brain className="h-3 w-3" />
        if (lower.includes('diabetes') || lower.includes('sugar')) return <ActivityIcon className="h-3 w-3" />
        return <Zap className="h-3 w-3" />
    }

    // Fetch master templates
    useEffect(() => {
        fetch('/api/prescriptions/templates')
            .then(res => res.json())
            .then(data => {
                if (data.success) setDbTemplates(data.templates)
            })
            .catch(err => console.error('Error fetching templates:', err))
            .finally(() => setLoadingTemplates(false))
    }, [])

    // Fetch patient data
    useEffect(() => {
        if (!patientId) return;
        fetch(`/api/patients/${patientId}`)
            .then(res => res.json())
            .then(data => {
                if (data.patient) setPatientInfo(data.patient)
            })
            .catch(err => console.error(err))
    }, [patientId])

    // If no patientId but have appointmentId, fetch appointment to get patientId
    useEffect(() => {
        if (patientId || !appointmentId) return;

        fetch(`/api/appointments/${appointmentId}`)
            .then(res => res.json())
            .then(data => {
                if (data.appointment?.patient_id) {
                    setResolvedPatientId(data.appointment.patient_id);
                    fetch(`/api/patients/${data.appointment.patient_id}`)
                        .then(res => res.json())
                        .then(pData => {
                            if (pData.patient) setPatientInfo(pData.patient)
                        });
                }
            })
            .catch(err => console.error('Error fetching appointment for patient info:', err));
    }, [appointmentId, patientId]);

    // Fetch existing prescription and nurse vitals if appointmentId is present
    useEffect(() => {
        if (!appointmentId) return;

        fetch(`/api/prescriptions/by-appointment/${appointmentId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const pr = data.prescription;
                    const vt = data.vitals;

                    if (vt) {
                        setVitalsData(vt);
                        // Also populate text version for legacy save if needed, or if doctor wants to edit raw text
                        const vitalsStr = `T: ${vt.temperature || '-'}°F, P: ${vt.pulse || '-'}bpm, BP: ${vt.systolic || '-'}/${vt.diastolic || '-'}mmHg, SpO2: ${vt.spo2 || '-'}%, Wt: ${vt.weight || '-'}kg`.trim();
                        setConvertedText(prev => ({ ...prev, vitals: vitalsStr }));
                    }

                    if (pr) {
                        setConvertedText({
                            vitals: pr.vitals || (vt ? `T: ${vt.temperature || '-'}°F, P: ${vt.pulse || '-'}bpm, BP: ${vt.systolic || '-'}/${vt.diastolic || '-'}mmHg, SpO2: ${vt.spo2 || '-'}%, Wt: ${vt.weight || '-'}kg` : ''),
                            diagnosis: pr.diagnosis || '',
                            complaint: pr.complaint || '',
                            examination: pr.examination || '',
                            plan: pr.plan || ''
                        });
                        setSelectedMedicines(pr.medicines || []);

                        if (!patientId && pr.patient_id) {
                            setResolvedPatientId(pr.patient_id);
                            fetch(`/api/patients/${pr.patient_id}`)
                                .then(res => res.json())
                                .then(pData => {
                                    if (pData.patient) setPatientInfo(pData.patient)
                                });
                        }
                    }
                }
            })
            .catch(err => console.error('Error fetching existing data:', err));
    }, [appointmentId, patientId]);

    useEffect(() => {
        fetch('/api/medicines')
            .then(res => res.json())
            .then(data => {
                if (data.medicines) setMedicines(data.medicines)
            })
            .catch(err => console.error(err))
    }, [])

    // Fetch lab tests
    useEffect(() => {
        const timer = setTimeout(() => {
            if (labSearch.trim()) {
                setIsSearchingLabs(true)
                fetch(`/api/hms/lab-tests?q=${encodeURIComponent(labSearch)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            setFilteredLabs(data.tests)
                            setShowLabDropdown(true)
                        }
                    })
                    .finally(() => setIsSearchingLabs(false))
            } else {
                setFilteredLabs([])
                setShowLabDropdown(false)
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [labSearch])

    const addLabTest = (test: any) => {
        if (!selectedLabs.find(l => l.id === test.id)) {
            setSelectedLabs([...selectedLabs, test])
        }
        setLabSearch('')
        setShowLabDropdown(false)
    }

    const removeLabTest = (id: string) => {
        setSelectedLabs(selectedLabs.filter(l => l.id !== id))
    }

    // Filter medicines as user types
    useEffect(() => {
        if (medicineSearch.length >= 1) {
            const filtered = medicines.filter(m =>
                m.name.toLowerCase().includes(medicineSearch.toLowerCase())
            ).slice(0, 10)
            setFilteredMedicines(filtered)
            setShowMedicineDropdown(true)
        } else {
            setShowMedicineDropdown(false)
        }
    }, [medicineSearch, medicines])


    // ------------------------------------------------------------------------
    // SCRIBBLE / DRAWING LOGIC (Now in a modal context)
    // ------------------------------------------------------------------------

    const openScribbleModal = (target: keyof typeof convertedText) => {
        setScribbleTarget(target)
        setScribbleModalOpen(true)
        // Reset canvas after modal opens (need a small delay or effect, handled in useEffect typically, 
        // but here we'll just ensure it's clear when we access it)
    }

    useEffect(() => {
        if (scribbleModalOpen && scribbleCanvasRef.current) {
            const canvas = scribbleCanvasRef.current
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.fillStyle = '#ffffff'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }
        }
    }, [scribbleModalOpen])

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = scribbleCanvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        setIsDrawing(true)
        const rect = canvas.getBoundingClientRect()
        ctx.beginPath()
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#000'
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !scribbleCanvasRef.current) return
        const ctx = scribbleCanvasRef.current.getContext('2d')
        if (!ctx) return
        const rect = scribbleCanvasRef.current.getBoundingClientRect()
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.stroke()
    }

    const stopDrawing = () => {
        setIsDrawing(false)
    }

    const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = scribbleCanvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        setIsDrawing(true)
        const rect = canvas.getBoundingClientRect()
        const touch = e.touches[0]
        ctx.beginPath()
        ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top)
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#000'
    }

    const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !scribbleCanvasRef.current) return
        const ctx = scribbleCanvasRef.current.getContext('2d')
        if (!ctx) return
        const rect = scribbleCanvasRef.current.getBoundingClientRect()
        const touch = e.touches[0]
        ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top)
        ctx.stroke()
    }

    const clearScribbleCanvas = () => {
        const canvas = scribbleCanvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const saveScribble = async () => {
        if (!scribbleCanvasRef.current || !scribbleTarget) return

        setIsConvertingScribble(true)
        try {
            await new Promise((resolve) => {
                scribbleCanvasRef.current!.toBlob(async (blob) => {
                    if (!blob) { resolve(null); return; }

                    const formData = new FormData()
                    formData.append('image', blob, 'scribble.jpg')
                    try {
                        const res = await fetch('/api/recognize-handwriting', {
                            method: 'POST',
                            body: formData
                        })
                        const data = await res.json()
                        if (data.text) {
                            setConvertedText(prev => ({
                                ...prev,
                                [scribbleTarget]: (prev[scribbleTarget] ? prev[scribbleTarget] + ' ' : '') + data.text
                            }))
                            setScribbleModalOpen(false)
                        } else {
                            alert("Could not recognize text. Please try writing more clearly.");
                        }
                    } catch (err) {
                        console.error("Transcription failed", err)
                        alert("Error converting handwriting.");
                    }
                    resolve(null)
                }, 'image/jpeg', 0.9)
            })
        } finally {
            setIsConvertingScribble(false)
        }
    }


    const loadLastPrescription = async () => {
        if (!patientId) return
        setLoadingPrevious(true)
        try {
            const res = await fetch(`/api/prescriptions/last?patientId=${patientId}`)
            const data = await res.json()
            if (data.success && data.data) {
                if (data.data.medicines && data.data.medicines.length > 0) {
                    setSelectedMedicines(data.data.medicines.map((m: any) => ({
                        id: m.medicineId,
                        name: m.medicineName,
                        dosage: `${m.morning || '0'}-${m.afternoon || '0'}-${m.evening || '0'}-${m.night || '0'}`,
                        days: m.days,
                        timing: m.timing || 'After Food'
                    })))
                }
                alert(`✅ Loaded prescription from ${new Date(data.date).toLocaleDateString()}!`)
            } else {
                alert('ℹ️ No previous prescription found')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('❌ Failed to load')
        } finally {
            setLoadingPrevious(false)
        }
    }

    const applyTemplate = (template: any) => {
        // Handle both older format and DB format
        const templateMeds = Array.isArray(template.medicines) ? template.medicines : template.meds;

        setSelectedMedicines(templateMeds.map((m: any) => ({
            id: m.id || m.medicineId || '',
            name: m.name,
            dosage: m.dosage,
            days: m.days || 5,
            timing: m.timing || 'After Food'
        })))

        // Populate clinical fields if present
        if (template.diagnosis || template.plan || template.complaint || template.examination || template.vitals) {
            setConvertedText(prev => ({
                ...prev,
                // vitals: template.vitals || prev.vitals, // Don't overwrite nurse vitals with template vitals usually
                diagnosis: template.diagnosis || prev.diagnosis,
                complaint: template.complaint || prev.complaint,
                examination: template.examination || prev.examination,
                plan: template.plan || prev.plan
            }))
        }
    }

    const saveCurrentAsTemplate = async () => {
        const name = prompt("Enter Master Template Name (e.g., 'Hypertension Protocol'):")
        if (!name) return;

        try {
            const res = await fetch('/api/prescriptions/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    medicines: selectedMedicines,
                    vitals: convertedText.vitals,
                    diagnosis: convertedText.diagnosis,
                    complaint: convertedText.complaint,
                    examination: convertedText.examination,
                    plan: convertedText.plan
                })
            })
            const data = await res.json()
            if (data.success) {
                alert('✅ Saved to Master Protocols!')
                setDbTemplates(prev => [...prev, data.template])
            } else {
                alert('❌ Failed: ' + data.error)
            }
        } catch (err) {
            console.error(err)
            alert('❌ Connection error')
        }
    }

    const openMedicineModal = (med: any, editIdx: number | null = null) => {
        setCurrentMedicine(med)
        setEditingIndex(editIdx)
        if (editIdx !== null) {
            const existing = selectedMedicines[editIdx]
            setModalDosage(existing.dosage)
            setModalDays(existing.days)
            setModalTiming(existing.timing || 'After Food')
        } else {
            setModalDosage('1-0-1')
            setModalDays('5')
            setModalTiming('After Food')
        }
        setShowMedicineModal(true)
        setMedicineSearch('')
        setShowMedicineDropdown(false)
    }

    const saveMedicineFromModal = () => {
        const medicineData = {
            id: currentMedicine?.id || '',
            name: currentMedicine?.name || '',
            dosage: modalDosage,
            days: modalDays,
            timing: modalTiming
        }

        if (editingIndex !== null) {
            const updated = [...selectedMedicines]
            updated[editingIndex] = medicineData
            setSelectedMedicines(updated)
        } else {
            setSelectedMedicines([...selectedMedicines, medicineData])
        }

        setShowMedicineModal(false)
        setCurrentMedicine(null)
        setEditingIndex(null)
    }

    const removeMedicine = (index: number) => {
        setSelectedMedicines(selectedMedicines.filter((_, i) => i !== index))
    }

    const savePrescription = async (redirectToBill = false) => {
        setIsSaving(true)
        try {
            const response = await fetch('/api/prescriptions/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: resolvedPatientId,
                    appointmentId,
                    vitals: convertedText.vitals || '',
                    diagnosis: convertedText.diagnosis || '',
                    complaint: convertedText.complaint || '',
                    examination: convertedText.examination || '',
                    plan: convertedText.plan || '',
                    medicines: selectedMedicines,
                    labTests: selectedLabs
                })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setLastSavedId(data.prescriptionId)
                if (redirectToBill && data.medicines && data.medicines.length > 0) {
                    const medicineParams = encodeURIComponent(JSON.stringify(data.medicines))
                    const appointmentParam = appointmentId ? `&appointmentId=${appointmentId}` : ''
                    router.push(`/hms/billing/new?patientId=${resolvedPatientId}&medicines=${medicineParams}${appointmentParam}`)
                } else if (!redirectToBill) {
                    toast({
                        title: "Prescription Saved",
                        description: "Your changes have been saved successfully.",
                    })
                }
                return data.prescriptionId;
            } else {
                const errorMsg = String(data.error || 'Unknown error');
                const details = String(data.details || '');
                alert(`❌ Failed to save (${response.status}): ${errorMsg}\n${details ? `Details: ${details}` : ''}`)
                return null;
            }
        } catch (error) {
            console.error('Save error:', error)
            alert('❌ Failed to save prescription')
            return null;
        } finally {
            setIsSaving(false)
        }
    }

    const handleWhatsappShare = async () => {
        setIsSharing(true);
        const pId = await savePrescription(false);
        if (!pId) {
            setIsSharing(false);
            return;
        }

        setIsSharing(true);
        try {
            const res = await sharePrescriptionWhatsapp(pId!);
            if (res.success) {
                toast({
                    title: "WhatsApp",
                    description: String(res.message || "Sent successfully."),
                });
            } else {
                toast({
                    title: "Share Failed",
                    description: String(res.error || "Could not share prescription"),
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive"
            });
        } finally {
            setIsSharing(false);
        }
    }

    const content = (
        <div className={`flex flex-col h-full bg-slate-50/50 relative overflow-hidden ${isModal ? 'rounded-3xl shadow-2xl border border-white/20' : 'h-[92vh] max-w-[98vw] mx-auto border border-slate-200/60 rounded-2xl shadow-xl'}`}>

            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 p-4 lg:p-6 flex justify-between items-center shrink-0 supports-[backdrop-filter]:bg-white/60 print:hidden">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                        <Stethoscope className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">New Prescription</h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Clinical Workspace</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.print()}
                        className="rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 print:hidden"
                        title="Print Prescription"
                    >
                        <Printer className="h-5 w-5" />
                    </Button>
                    {!isModal && (
                        <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 bg-slate-100/50 px-3 py-1.5 rounded-full border border-slate-200/50">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </div>
                    )}
                    {isModal && (
                        <button
                            onClick={onClose || (() => router.back())}
                            className="h-10 w-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600 hover:rotate-90"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    )}
                </div>
            </header>

            {/* Scrollable Content - 3 Column Grid */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto pb-24">

                    {/* LEFT COLUMN: Patient Info & Templates (Col Span 3) */}
                    <div className="lg:col-span-3 space-y-6 print:hidden">
                        {/* Patient Card */}
                        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-white/60 shadow-lg shadow-slate-200/50 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <User className="h-3 w-3" /> Patient Details
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xl font-black text-slate-900 leading-tight">
                                            {patientInfo ? `${patientInfo.first_name} ${patientInfo.last_name || ''}` : 'Loading...'}
                                        </p>
                                        <p className="text-sm font-medium text-slate-500 mt-1">
                                            {patientInfo?.age ? `${patientInfo.age} Y` : '--'} • {patientInfo?.gender || '--'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                        <span className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 font-mono">
                                            {patientId?.substring(0, 8) || '####'}...
                                        </span>
                                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold border border-green-100">
                                            Active Visit
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Tools / Templates */}
                        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-white/60 shadow-lg shadow-slate-200/50">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Zap className="h-3 w-3" /> Quick Protocols
                            </h3>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={loadLastPrescription}
                                disabled={loadingPrevious}
                                className="w-full justify-start mb-3 bg-orange-50/50 text-orange-700 border-orange-200/50 hover:bg-orange-100 font-bold h-11 rounded-xl"
                            >
                                <Clock className="mr-2 h-4 w-4" />
                                {loadingPrevious ? 'Loading...' : 'Copy Last Rx'}
                            </Button>

                            <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto pr-1">
                                {dbTemplates.map((template, idx) => (
                                    <Button
                                        key={template.id || idx}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => applyTemplate(template)}
                                        className="w-full justify-start bg-indigo-50/50 text-indigo-700 border-indigo-100/50 hover:bg-indigo-100 font-bold h-10 rounded-xl transition-all"
                                    >
                                        {getTemplateIcon(template.name)}
                                        <span className="ml-2 truncate">{template.name}</span>
                                    </Button>
                                ))}
                                {dbTemplates.length === 0 && !loadingTemplates && (
                                    <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <p className="text-xs text-slate-400 font-medium">No master protocols.</p>
                                    </div>
                                )}
                            </div>
                            <button onClick={saveCurrentAsTemplate} className="w-full mt-3 py-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-1">
                                <Plus className="h-3 w-3" /> Save findings as Protocol
                            </button>
                        </div>
                    </div>

                    {/* CENTER COLUMN: Clinical Canvas (Col Span 5) */}
                    <div className="lg:col-span-6 space-y-6">

                        {/* VITALS DISPLAY (ReadOnly / Nurse Entered) */}
                        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-4 border border-white/60 shadow-sm relative overflow-hidden">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <ActivityIcon className="h-3 w-3" /> Latest Vitals (By Nurse)
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                <div className="bg-red-50 text-red-700 px-3 py-2 rounded-xl border border-red-100 shadow-sm min-w-[80px]">
                                    <span className="text-[10px] uppercase font-bold text-red-400 block">Pulse</span>
                                    <span className="text-lg font-black">{vitalsData?.pulse || '--'} <span className="text-xs font-medium opacity-70">bpm</span></span>
                                </div>
                                <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-xl border border-blue-100 shadow-sm min-w-[80px]">
                                    <span className="text-[10px] uppercase font-bold text-blue-400 block">BP</span>
                                    <span className="text-lg font-black">{vitalsData?.systolic || '--'}/{vitalsData?.diastolic || '--'}</span>
                                </div>
                                <div className="bg-orange-50 text-orange-700 px-3 py-2 rounded-xl border border-orange-100 shadow-sm min-w-[80px]">
                                    <span className="text-[10px] uppercase font-bold text-orange-400 block">Temp</span>
                                    <span className="text-lg font-black">{vitalsData?.temperature || '--'} <span className="text-xs font-medium opacity-70">°F</span></span>
                                </div>
                                <div className="bg-teal-50 text-teal-700 px-3 py-2 rounded-xl border border-teal-100 shadow-sm min-w-[80px]">
                                    <span className="text-[10px] uppercase font-bold text-teal-400 block">SpO2</span>
                                    <span className="text-lg font-black">{vitalsData?.spo2 || '--'} <span className="text-xs font-medium opacity-70">%</span></span>
                                </div>
                                <div className="bg-slate-50 text-slate-700 px-3 py-2 rounded-xl border border-slate-200 shadow-sm min-w-[80px]">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Weight</span>
                                    <span className="text-lg font-black">{vitalsData?.weight || '--'} <span className="text-xs font-medium opacity-70">kg</span></span>
                                </div>
                            </div>
                        </div>

                        {/* CLINICAL SECTIONS (Text + Scribble Popup) */}
                        <div className="space-y-4">
                            {[
                                { title: 'DIAGNOSIS', height: 80, key: 'diagnosis' as keyof typeof convertedText, icon: Brain },
                                { title: 'PRESENTING COMPLAINT', height: 100, key: 'complaint' as keyof typeof convertedText, icon: AlertCircle },
                                { title: 'GENERAL EXAMINATION', height: 120, key: 'examination' as keyof typeof convertedText, icon: Search },
                                { title: 'PLAN', height: 80, key: 'plan' as keyof typeof convertedText, icon: FileText }
                            ].map((section, idx) => (
                                <div key={idx} className="bg-white rounded-3xl p-1 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative">
                                    <div className="px-4 py-2 flex items-center justify-between border-b border-slate-50 mb-1">
                                        <div className="flex items-center gap-2">
                                            <section.icon className="h-3 w-3 text-slate-400" />
                                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{section.title}</h3>
                                        </div>
                                        <button
                                            onClick={() => openScribbleModal(section.key)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 hover:bg-blue-50 text-slate-400 hover:text-blue-600 p-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                                            title="Click to Scribble, then convert to text"
                                        >
                                            <PenTool className="h-3 w-3" /> Scribble
                                        </button>
                                    </div>

                                    <textarea
                                        value={convertedText[section.key] || ''}
                                        onChange={(e) => setConvertedText({ ...convertedText, [section.key]: e.target.value })}
                                        onDoubleClick={() => openScribbleModal(section.key)}
                                        className="w-full min-h-[80px] p-4 bg-transparent border-none rounded-b-2xl text-slate-700 text-sm leading-relaxed font-medium focus:ring-0 resize-y"
                                        placeholder={`Type ${section.title.toLowerCase()} or double-click to scribble...`}
                                        style={{ minHeight: section.height }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Medicines & Labs (Col Span 3) */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Medicines Card */}
                        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-white/60 shadow-lg shadow-blue-100/20">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Pill className="h-3 w-3" /> Prescription
                            </h3>

                            {/* Search */}
                            <div className="relative print:hidden group mb-4">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Search className="h-4 w-4" />
                                </div>
                                <input
                                    type="text"
                                    value={medicineSearch}
                                    onChange={(e) => setMedicineSearch(e.target.value)}
                                    placeholder="Add Medicine..."
                                    className="w-full pl-9 pr-3 py-3 text-sm font-bold border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                                />
                                {showMedicineDropdown && (
                                    <div className="absolute z-[60] w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto p-2">
                                        {filteredMedicines.map((med, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => openMedicineModal(med)}
                                                className="p-2.5 hover:bg-blue-50 cursor-pointer rounded-xl flex items-center justify-between text-sm"
                                            >
                                                <span className="font-bold text-slate-700">{med.name}</span>
                                                <Plus className="h-3 w-3 text-slate-300" />
                                            </div>
                                        ))}
                                        {medicineSearch.trim() && (
                                            <div
                                                onClick={() => openMedicineModal({ name: medicineSearch.trim() })}
                                                className="p-2.5 bg-blue-50/50 hover:bg-blue-100 cursor-pointer rounded-xl flex items-center gap-2 mt-1"
                                            >
                                                <Plus className="h-3 w-3 text-blue-600" />
                                                <span className="font-bold text-blue-700 text-xs">Custom: {medicineSearch}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Rx List */}
                            <div className="space-y-3 min-h-[200px]">
                                {selectedMedicines.length === 0 ? (
                                    <div className="text-center py-8 opacity-50">
                                        <Pill className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                                        <p className="text-xs text-slate-400 font-bold">No medicines added</p>
                                    </div>
                                ) : (
                                    selectedMedicines.map((med, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors group relative">
                                            <div onClick={() => openMedicineModal(med, idx)} className="cursor-pointer">
                                                <p className="font-black text-slate-800 text-sm">{med.name}</p>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                                                    <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md">{med.dosage}</span>
                                                    <span>• {med.days} days</span>
                                                    <span>• {med.timing}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeMedicine(idx)}
                                                className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Labs Card */}
                        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-white/60 shadow-lg shadow-violet-100/20">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ActivityIcon className="h-3 w-3" /> Lab Orders
                            </h3>

                            {/* Search */}
                            <div className="relative group mb-4 print:hidden">
                                <input
                                    type="text"
                                    value={labSearch}
                                    onChange={(e) => setLabSearch(e.target.value)}
                                    placeholder="Add Lab Test..."
                                    className="w-full pl-4 pr-3 py-3 text-sm font-bold border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all shadow-sm"
                                />
                                {isSearchingLabs && <Loader2 className="absolute right-3 top-3.5 h-4 w-4 animate-spin text-slate-400" />}
                                {showLabDropdown && (
                                    <div className="absolute z-[60] w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto p-2">
                                        {filteredLabs.map((test, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => addLabTest(test)}
                                                className="p-2.5 hover:bg-violet-50 cursor-pointer rounded-xl flex items-center justify-between text-sm"
                                            >
                                                <span className="font-bold text-slate-700">{test.name}</span>
                                                <Plus className="h-3 w-3 text-slate-300" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Lab List */}
                            <div className="flex flex-wrap gap-2">
                                {selectedLabs.map((lab, idx) => (
                                    <div key={idx} className="bg-violet-50 border border-violet-100 pl-3 pr-2 py-1.5 rounded-xl flex items-center gap-2">
                                        <span className="text-xs font-bold text-violet-700">{lab.name}</span>
                                        <button onClick={() => removeLabTest(lab.id)} className="hover:bg-violet-200/50 rounded-full p-0.5 text-violet-400 hover:text-violet-700 transition-colors print:hidden">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                {selectedLabs.length === 0 && (
                                    <p className="text-xs text-slate-400 text-center w-full font-medium italic py-2">No labs ordered</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="sticky bottom-0 z-40 bg-white/80 backdrop-blur-md border-t border-slate-200/50 p-4 flex justify-between items-center print:hidden">
                <Button
                    variant="ghost"
                    onClick={onClose || (() => router.back())}
                    className="text-slate-500 font-bold hover:bg-slate-100 rounded-xl"
                >
                    Cancel
                </Button>

                <div className="flex gap-3">
                    <Button
                        onClick={handleWhatsappShare}
                        disabled={isSharing}
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100 font-bold rounded-xl shadow-sm"
                    >
                        {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4 mr-2" />}
                        WhatsApp
                    </Button>
                    <Button
                        onClick={() => savePrescription(false)}
                        disabled={isSaving}
                        className="bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl shadow-lg shadow-slate-900/20 px-8"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Prescription
                    </Button>
                </div>
            </div>

            {/* SCRIBBLE MODAL */}
            <AnimatePresence>
                {scribbleModalOpen && (
                    <div className="absolute inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-3xl w-full max-w-4xl h-[70vh] flex flex-col shadow-2xl border border-white/40 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                    <PenTool className="h-5 w-5 text-indigo-600" />
                                    Scribble Notes
                                    <span className="text-xs font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                                        {scribbleTarget?.toUpperCase()}
                                    </span>
                                </h3>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearScribbleCanvas}
                                        className="text-slate-500 hover:text-red-500 border-slate-200"
                                    >
                                        <Eraser className="h-4 w-4 mr-1" /> Clear
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setScribbleModalOpen(false)}
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 bg-white relative cursor-crosshair overflow-hidden group touch-none">
                                {/* Grid Pattern */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                    style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                                </div>
                                <canvas
                                    ref={scribbleCanvasRef}
                                    width={1000}
                                    height={600}
                                    className="w-full h-full touch-none"
                                    onMouseDown={(e) => startDrawing(e)}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawingTouch}
                                    onTouchMove={drawTouch}
                                    onTouchEnd={stopDrawing}
                                />
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-50 text-xs font-medium text-slate-400 bg-white/80 px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                                    Draw your thoughts freely
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
                                <Button
                                    onClick={() => setScribbleModalOpen(false)}
                                    variant="ghost"
                                    className="font-bold text-slate-500"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={saveScribble}
                                    disabled={isConvertingScribble}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 font-bold px-8"
                                >
                                    {isConvertingScribble ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                                    Convert to Text
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Medicine Modal */}
            <AnimatePresence>
                {showMedicineModal && (
                    <div className="absolute inset-0 z-[60] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100"
                        >
                            <h3 className="text-xl font-black text-slate-900 mb-1">{currentMedicine?.name || 'Add Medicine'}</h3>
                            <p className="text-sm text-slate-500 font-bold mb-6">Configure dosage and duration</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Frequency (M-A-E-N)</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {['1-0-0-1', '1-0-1-0', '1-1-1-0', '1-0-1', '0-0-1', '1-0-0'].map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setModalDosage(d)}
                                                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${modalDosage === d ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        value={modalDosage}
                                        onChange={e => setModalDosage(e.target.value)}
                                        className="w-full mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-center tracking-widest outline-none focus:ring-2 focus:ring-blue-100 transition-all text-lg"
                                        placeholder="1-0-1"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Duration (Days)</label>
                                        <input
                                            type="number"
                                            value={modalDays}
                                            onChange={e => setModalDays(e.target.value)}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Timing</label>
                                        <select
                                            value={modalTiming}
                                            onChange={e => setModalTiming(e.target.value)}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none"
                                        >
                                            <option value="After Food">After Food</option>
                                            <option value="Before Food">Before Food</option>
                                            <option value="With Food">With Food</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <Button onClick={() => setShowMedicineModal(false)} variant="ghost" className="flex-1 rounded-xl font-bold text-slate-500 hover:bg-slate-100">Cancel</Button>
                                <Button onClick={saveMedicineFromModal} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200">
                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Save
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )

    if (isModal) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
                    onClick={() => router.back()}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="w-[98vw] h-[95vh] rounded-3xl shadow-2xl overflow-hidden bg-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {content}
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        )
    }

    return content
}

function Stethoscope(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 1 0-.2.3Z" />
            <path d="M10 2v2" />
            <path d="M14 2v2" />
            <path d="M3 10v2a2 2 0 0 0 2 2h2" />
            <path d="M17 14h2a2 2 0 0 0 2-2v-2" />
            <path d="M12 14v6" />
            <path d="M7 20h10" />
            <path d="M3 6h18" />
        </svg>
    )
}

function Receipt(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V2l-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2Z" />
            <path d="M16 8h-9" />
            <path d="M16 12h-9" />
            <path d="M15 16h-8" />
        </svg>
    )
}
