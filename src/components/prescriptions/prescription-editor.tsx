'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Printer, Plus, Trash2, Copy, Eraser, Clock, Zap, X, Save, Thermometer, Brain, Heart, Activity as ActivityIcon, MessageCircle, FileText, Share2, Loader2, User, Pill, CheckCircle2, Search, AlertCircle } from 'lucide-react'
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
    const appointmentId = searchParams.get('appointmentId') // For billing integration

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

    // Handwriting canvases
    const vitalsCanvasRef = useRef<HTMLCanvasElement>(null)
    const diagnosisCanvasRef = useRef<HTMLCanvasElement>(null)
    const complaintCanvasRef = useRef<HTMLCanvasElement>(null)
    const examinationCanvasRef = useRef<HTMLCanvasElement>(null)
    const planCanvasRef = useRef<HTMLCanvasElement>(null)

    const [isDrawing, setIsDrawing] = useState(false)
    const [currentCanvas, setCurrentCanvas] = useState<HTMLCanvasElement | null>(null)
    const [isConverting, setIsConverting] = useState(false)
    const [loadingPrevious, setLoadingPrevious] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const [lastSavedId, setLastSavedId] = useState<string | null>(null)

    // Converted text
    const [convertedText, setConvertedText] = useState({
        vitals: '',
        diagnosis: '',
        complaint: '',
        examination: '',
        plan: ''
    })
    const [showConverted, setShowConverted] = useState(false)
    const [selectedLabs, setSelectedLabs] = useState<any[]>([])
    const [labSearch, setLabSearch] = useState('')
    const [filteredLabs, setFilteredLabs] = useState<any[]>([])
    const [showLabDropdown, setShowLabDropdown] = useState(false)
    const [isSearchingLabs, setIsSearchingLabs] = useState(false)

    // Dynamic Masters from Database
    const [dbTemplates, setDbTemplates] = useState<any[]>([])
    const [loadingTemplates, setLoadingTemplates] = useState(true)

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

                    let vitalsText = '';
                    if (vt) {
                        vitalsText = `T: ${vt.temperature || '-'}°F, P: ${vt.pulse || '-'}bpm, S/D: ${vt.systolic || '-'}/${vt.diastolic || '-'}mmHg, SpO2: ${vt.spo2 || '-'}%, W: ${vt.weight || '-'}kg, H: ${vt.height || '-'}cm. ${vt.notes || ''}`.trim();
                    }

                    if (pr) {
                        setConvertedText({
                            vitals: pr.vitals || vitalsText,
                            diagnosis: pr.diagnosis || '',
                            complaint: pr.complaint || '',
                            examination: pr.examination || '',
                            plan: pr.plan || ''
                        });
                        setSelectedMedicines(pr.medicines || []);
                        setShowConverted(true);

                        if (!patientId && pr.patient_id) {
                            setResolvedPatientId(pr.patient_id);
                            fetch(`/api/patients/${pr.patient_id}`)
                                .then(res => res.json())
                                .then(pData => {
                                    if (pData.patient) setPatientInfo(pData.patient)
                                });
                        }
                    } else if (vt) {
                        // Only vitals found (Nurse done, Doctor starting)
                        setConvertedText(prev => ({
                            ...prev,
                            vitals: vitalsText
                        }));
                        setShowConverted(true);
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

    // Initialize canvases
    useEffect(() => {
        const canvases = [vitalsCanvasRef, diagnosisCanvasRef, complaintCanvasRef, examinationCanvasRef, planCanvasRef]
        canvases.forEach(ref => {
            if (ref.current) {
                const ctx = ref.current.getContext('2d')
                if (ctx) {
                    ctx.fillStyle = '#ffffff'
                    ctx.fillRect(0, 0, ref.current.width, ref.current.height)
                }
            }
        })
    }, [])

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        setIsDrawing(true)
        setCurrentCanvas(canvas)
        const rect = canvas.getBoundingClientRect()
        ctx.beginPath()
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#000'
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !currentCanvas) return
        const ctx = currentCanvas.getContext('2d')
        if (!ctx) return
        const rect = currentCanvas.getBoundingClientRect()
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.stroke()
    }

    const stopDrawing = () => {
        setIsDrawing(false)
        setCurrentCanvas(null)
    }

    const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
        // e.preventDefault() // Explicitly handling preventing default in canvas props if needed, but it's tricky in React
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        setIsDrawing(true)
        setCurrentCanvas(canvas)
        const rect = canvas.getBoundingClientRect()
        const touch = e.touches[0]
        ctx.beginPath()
        ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top)
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#000'
    }

    const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !currentCanvas) return
        // e.preventDefault() 
        const ctx = currentCanvas.getContext('2d')
        if (!ctx) return
        const rect = currentCanvas.getBoundingClientRect()
        const touch = e.touches[0]
        ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top)
        ctx.stroke()
    }

    const clearCanvas = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
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
                vitals: template.vitals || prev.vitals,
                diagnosis: template.diagnosis || prev.diagnosis,
                complaint: template.complaint || prev.complaint,
                examination: template.examination || prev.examination,
                plan: template.plan || prev.plan
            }))
            setShowConverted(true)
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

    const runTranscription = async () => {
        setIsConverting(true)
        try {
            const canvases = [
                { ref: vitalsCanvasRef, field: 'vitals' },
                { ref: diagnosisCanvasRef, field: 'diagnosis' },
                { ref: complaintCanvasRef, field: 'complaint' },
                { ref: examinationCanvasRef, field: 'examination' },
                { ref: planCanvasRef, field: 'plan' }
            ]

            const converted: any = { ...convertedText }
            let hasAnyContent = false

            for (const { ref, field } of canvases) {
                if (!ref.current) continue

                // Check if canvas is empty (simplified check)
                const ctx = ref.current.getContext('2d')
                if (!ctx) continue

                // Check if any pixels are drawn (rough check by looking at data)
                // If it's empty, we might skip it to save API calls

                await new Promise((resolve) => {
                    ref.current!.toBlob(async (blob) => {
                        if (!blob || blob.size < 1000) { // Very small blobs are likely empty
                            resolve(null)
                            return
                        }

                        hasAnyContent = true
                        const formData = new FormData()
                        formData.append('image', blob, `${field}.jpg`)
                        try {
                            const res = await fetch('/api/recognize-handwriting', {
                                method: 'POST',
                                body: formData
                            })
                            const data = await res.json()
                            if (data.text) converted[field] = data.text
                        } catch (err) {
                            console.error(`Failed to transcribe ${field}`, err)
                        }
                        resolve(null)
                    }, 'image/jpeg', 0.8)
                })
            }

            setConvertedText(converted)
            if (hasAnyContent) setShowConverted(true)
            return converted
        } catch (error) {
            console.error('Transcription Error:', error)
            return convertedText
        } finally {
            setIsConverting(false)
        }
    }

    const savePrescription = async (redirectToBill = false) => {
        setIsSaving(true)
        try {
            // 1. Perform transcription first if not already done or if we want to ensure latest
            let finalTexts = convertedText
            if (!showConverted) {
                finalTexts = await runTranscription()
            }

            const response = await fetch('/api/prescriptions/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: resolvedPatientId,
                    appointmentId,
                    vitals: finalTexts.vitals || '',
                    diagnosis: finalTexts.diagnosis || '',
                    complaint: finalTexts.complaint || '',
                    examination: finalTexts.examination || '',
                    plan: finalTexts.plan || '',
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
                    // Don't close so they can keep editing
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
                // Frontend no longer opens popups. Backend handles automatic sending.
                // res.whatsappUrl is ignored to prevent manual share mode from interrupting workflow.
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
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 p-4 lg:p-6 flex justify-between items-center shrink-0 supports-[backdrop-filter]:bg-white/60">
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
                    <div className="lg:col-span-3 space-y-6">
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
                        {/* Control Bar */}
                        <div className="flex justify-between items-center bg-white/70 backdrop-blur-md rounded-2xl p-2 border border-white/60 shadow-sm sticky top-0 z-30">
                            <h2 className="text-sm font-black text-slate-800 tracking-tight px-3">Clinical Findings</h2>
                            <div className="flex gap-2">
                                {!showConverted ? (
                                    <Button
                                        size="sm"
                                        onClick={runTranscription}
                                        disabled={isConverting}
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200/50 text-xs px-4 h-9"
                                    >
                                        {isConverting ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Zap className="mr-2 h-3 w-3" />}
                                        Transcribe
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setShowConverted(false)}
                                        className="text-slate-500 hover:bg-slate-50 font-bold rounded-xl border-slate-200 h-9 text-xs"
                                    >
                                        <Eraser className="mr-2 h-3 w-3" /> Draw
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Canvases */}
                        <div className="space-y-4">
                            {[
                                { title: 'VITALS', ref: vitalsCanvasRef, height: 80, key: 'vitals', icon: ActivityIcon },
                                { title: 'DIAGNOSIS', ref: diagnosisCanvasRef, height: 80, key: 'diagnosis', icon: Brain },
                                { title: 'PRESENTING COMPLAINT', ref: complaintCanvasRef, height: 100, key: 'complaint', icon: AlertCircle },
                                { title: 'GENERAL EXAMINATION', ref: examinationCanvasRef, height: 120, key: 'examination', icon: Search },
                                { title: 'PLAN', ref: planCanvasRef, height: 80, key: 'plan', icon: FileText }
                            ].map((section, idx) => (
                                <div key={idx} className="bg-white rounded-3xl p-1 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="px-4 py-2 flex items-center gap-2 border-b border-slate-50 mb-1">
                                        <section.icon className="h-3 w-3 text-slate-400" />
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{section.title}</h3>
                                    </div>

                                    {showConverted ? (
                                        <textarea
                                            value={convertedText[section.key as keyof typeof convertedText] || ''}
                                            onChange={(e) => setConvertedText({ ...convertedText, [section.key]: e.target.value })}
                                            className="w-full min-h-[80px] p-4 bg-transparent border-none rounded-b-2xl text-slate-700 text-sm leading-relaxed font-medium focus:ring-0 resize-y"
                                            placeholder={`No ${section.title.toLowerCase()} recorded...`}
                                        />
                                    ) : (
                                        <div className="relative group">
                                            <canvas
                                                ref={section.ref}
                                                width={900}
                                                height={section.height}
                                                className="w-full bg-slate-50/30 rounded-b-2xl cursor-crosshair touch-none mix-blend-multiply"
                                                onMouseDown={(e) => startDrawing(e, section.ref.current!)}
                                                onMouseMove={draw}
                                                onMouseUp={stopDrawing}
                                                onMouseLeave={stopDrawing}
                                                onTouchStart={(e) => startDrawingTouch(e, section.ref.current!)}
                                                onTouchMove={drawTouch}
                                                onTouchEnd={stopDrawing}
                                                style={{ touchAction: 'none' }}
                                            />
                                            <button
                                                onClick={() => clearCanvas(section.ref.current)}
                                                className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-lg text-slate-300 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Clear"
                                            >
                                                <Eraser className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
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
                                                className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
                                <Activity className="h-3 w-3" /> Lab Orders
                            </h3>

                            {/* Search */}
                            <div className="relative group mb-4">
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
                                        <button onClick={() => removeLabTest(lab.id)} className="hover:bg-violet-200/50 rounded-full p-0.5 text-violet-400 hover:text-violet-700 transition-colors">
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
            <div className="sticky bottom-0 z-40 bg-white/80 backdrop-blur-md border-t border-slate-200/50 p-4 flex justify-between items-center">
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

            {/* Medicine Modal */}
            <AnimatePresence>
                {showMedicineModal && (
                    <div className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
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
                        className="w-full max-w-5xl h-[90vh] shadow-2xl overflow-hidden"
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

function Loader2(props: any) {
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
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
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
