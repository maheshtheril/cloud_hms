'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Printer, Plus, Trash2, Copy, Eraser, Clock, Zap, X, Save, Thermometer, Brain, Heart, Activity as ActivityIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface PrescriptionEditorProps {
    isModal?: boolean
    onClose?: () => void
}

export function PrescriptionEditor({ isModal = false, onClose }: PrescriptionEditorProps) {
    const router = useRouter()
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

    // Converted text
    const [convertedText, setConvertedText] = useState({
        vitals: '',
        diagnosis: '',
        complaint: '',
        examination: '',
        plan: ''
    })
    const [showConverted, setShowConverted] = useState(false)

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

    // Fetch existing prescription if appointmentId is present
    useEffect(() => {
        if (!appointmentId) return;

        fetch(`/api/prescriptions/by-appointment/${appointmentId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.prescription) {
                    const pr = data.prescription;
                    setConvertedText({
                        vitals: pr.vitals || '',
                        diagnosis: pr.diagnosis || '',
                        complaint: pr.complaint || '',
                        examination: pr.examination || '',
                        plan: pr.plan || ''
                    });
                    setSelectedMedicines(pr.medicines || []);
                    setShowConverted(true);

                    // If we don't have patientId from URL, get it from prescription/appointment
                    if (!patientId && pr.patient_id) {
                        setResolvedPatientId(pr.patient_id);
                        fetch(`/api/patients/${pr.patient_id}`)
                            .then(res => res.json())
                            .then(pData => {
                                if (pData.patient) setPatientInfo(pData.patient)
                            });
                    }
                }
            })
            .catch(err => console.error('Error fetching existing prescription:', err));
    }, [appointmentId, patientId]);

    // Fetch medicines
    useEffect(() => {
        fetch('/api/medicines')
            .then(res => res.json())
            .then(data => {
                if (data.medicines) setMedicines(data.medicines)
            })
            .catch(err => console.error(err))
    }, [])

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
        if (selectedMedicines.length === 0) {
            alert('❌ Add at least one medicine to create a master template')
            return
        }

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

    const convertAndPrint = async () => {
        setIsConverting(true)
        try {
            const canvases = [
                { ref: vitalsCanvasRef, field: 'vitals' },
                { ref: diagnosisCanvasRef, field: 'diagnosis' },
                { ref: complaintCanvasRef, field: 'complaint' },
                { ref: examinationCanvasRef, field: 'examination' },
                { ref: planCanvasRef, field: 'plan' }
            ]

            const converted: any = {}
            for (const { ref, field } of canvases) {
                if (!ref.current) continue
                await new Promise((resolve) => {
                    ref.current!.toBlob(async (blob) => {
                        if (!blob) {
                            converted[field] = ''
                            resolve(null)
                            return
                        }
                        const formData = new FormData()
                        formData.append('image', blob, `${field}.jpg`)
                        try {
                            const res = await fetch('/api/recognize-handwriting', {
                                method: 'POST',
                                body: formData
                            })
                            const data = await res.json()
                            converted[field] = data.text || ''
                        } catch (err) {
                            converted[field] = ''
                        }
                        resolve(null)
                    }, 'image/jpeg', 0.8)
                })
            }
            setConvertedText(converted)
            setShowConverted(true)
            setTimeout(() => window.print(), 500)
        } catch (error) {
            console.error('Error:', error)
            alert('Failed to convert. Printing as handwritten.')
            window.print()
        } finally {
            setIsConverting(false)
        }
    }

    const savePrescription = async (redirectToBill = false) => {
        if (selectedMedicines.length === 0) {
            alert('❌ Please add at least one medicine')
            return
        }

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
                    medicines: selectedMedicines
                })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                if (redirectToBill && data.medicines && data.medicines.length > 0) {
                    const medicineParams = encodeURIComponent(JSON.stringify(data.medicines))
                    const appointmentParam = appointmentId ? `&appointmentId=${appointmentId}` : ''
                    router.push(`/hms/billing/new?patientId=${resolvedPatientId}&medicines=${medicineParams}${appointmentParam}`)
                } else if (onClose) {
                    onClose()
                } else {
                    router.push('/hms/patients')
                }
            } else {
                const errorMsg = data.error || 'Unknown error';
                const details = data.details || '';
                alert(`❌ Failed to save (${response.status}): ${errorMsg}\n${details ? `Details: ${details}` : ''}`)
            }
        } catch (error) {
            console.error('Save error:', error)
            alert('❌ Failed to save prescription')
        } finally {
            setIsSaving(false)
        }
    }

    const content = (
        <div className={`flex flex-col h-full bg-white relative overflow-hidden ${isModal ? 'rounded-2xl shadow-2xl border border-slate-200' : 'min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Stethoscope className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">New Prescription</h1>
                        <p className="text-sm text-slate-500 font-medium">Create and manage patient prescription</p>
                    </div>
                </div>
                {isModal && (
                    <button
                        onClick={onClose || (() => router.back())}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6 text-slate-400" />
                    </button>
                )}
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Patient Card */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Name</p>
                                <p className="text-base font-bold text-slate-900 truncate">
                                    {patientInfo ? `${patientInfo.first_name} ${patientInfo.last_name}`.toUpperCase() : 'Loading...'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Age / Gender</p>
                                <p className="text-base font-bold text-slate-700">
                                    {patientInfo?.age || 'N/A'} Years / {patientInfo?.gender || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UHID</p>
                                <p className="text-base font-mono font-bold text-slate-700">
                                    {patientId?.substring(0, 12) || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                                <p className="text-base font-bold text-slate-700">
                                    {new Date().toLocaleDateString('en-IN')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tools */}
                    <div className="flex flex-wrap gap-2 print:hidden backdrop-blur-sm bg-white/50 p-4 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={loadLastPrescription}
                            disabled={loadingPrevious}
                            className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 font-bold px-4 h-10 rounded-xl"
                        >
                            <Clock className="mr-2 h-4 w-4" />
                            {loadingPrevious ? 'Loading...' : 'Copy Last Rx'}
                        </Button>
                        <div className="h-10 w-px bg-slate-100 mx-2" />
                        {dbTemplates.map((template, idx) => (
                            <motion.div
                                key={template.id || idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => applyTemplate(template)}
                                    className="bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100 font-bold px-4 h-10 rounded-xl hover:border-indigo-300 transition-all flex items-center gap-2"
                                >
                                    {getTemplateIcon(template.name)}
                                    {template.name}
                                </Button>
                            </motion.div>
                        ))}
                        {dbTemplates.length === 0 && !loadingTemplates && (
                            <span className="text-slate-400 text-sm font-medium italic py-2">No master protocols yet. Create one below.</span>
                        )}
                    </div>

                    {/* Handwriting Sections */}
                    <div className="space-y-8 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                        {[
                            { title: 'VITALS', ref: vitalsCanvasRef, height: 80 },
                            { title: 'DIAGNOSIS', ref: diagnosisCanvasRef, height: 80 },
                            { title: 'PRESENTING COMPLAINT', ref: complaintCanvasRef, height: 100 },
                            { title: 'GENERAL EXAMINATION', ref: examinationCanvasRef, height: 120 },
                            { title: 'PLAN', ref: planCanvasRef, height: 80 }
                        ].map((section, idx) => (
                            <div key={idx} className="space-y-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{section.title}</h3>
                                {showConverted ? (
                                    <div className="min-h-[80px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 leading-relaxed font-medium">
                                        {convertedText[section.title.toLowerCase().split(' ')[0] as keyof typeof convertedText] || 'No content'}
                                    </div>
                                ) : (
                                    <div className="group relative">
                                        <canvas
                                            ref={section.ref}
                                            width={900}
                                            height={section.height}
                                            className="border-2 border-slate-100 rounded-xl cursor-crosshair w-full bg-white group-hover:border-blue-200 transition-all duration-300"
                                            onMouseDown={(e) => startDrawing(e, section.ref.current!)}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseLeave={stopDrawing}
                                        />
                                        <button
                                            onClick={() => clearCanvas(section.ref.current)}
                                            className="absolute top-2 right-2 p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-400 shadow-sm transition-all"
                                            title="Clear"
                                        >
                                            <Eraser className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* MEDICINE Section */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">PRESCRIPTION / MEDICINES</h3>

                            {/* Search */}
                            <div className="relative print:hidden group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    value={medicineSearch}
                                    onChange={(e) => setMedicineSearch(e.target.value)}
                                    placeholder="Search medicine or type custom name..."
                                    className="w-full pl-12 pr-6 py-4 text-base font-medium border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                                />

                                {showMedicineDropdown && (
                                    <div className="absolute z-[60] w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 p-2">
                                        {filteredMedicines.map((med, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => openMedicineModal(med)}
                                                className="p-3 hover:bg-blue-50 cursor-pointer rounded-xl flex items-center justify-between group/item"
                                            >
                                                <span className="font-bold text-slate-700 group-hover/item:text-blue-600">{med.name}</span>
                                                <Plus className="h-4 w-4 text-slate-300" />
                                            </div>
                                        ))}
                                        {medicineSearch.trim() && (
                                            <div
                                                onClick={() => openMedicineModal({ name: medicineSearch.trim() })}
                                                className="p-3 bg-blue-50 hover:bg-blue-100 cursor-pointer rounded-xl flex items-center gap-3 mt-1"
                                            >
                                                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                                    <Plus className="h-5 w-5" />
                                                </div>
                                                <span className="font-bold text-blue-700 uppercase text-xs tracking-wider">Add Custom: {medicineSearch}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* List */}
                            <div className="space-y-3">
                                {selectedMedicines.map((med, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 group transition-all hover:border-blue-200">
                                        <div className="h-8 w-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-400">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900">{med.name}</p>
                                            <div className="flex gap-4 mt-1 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{med.dosage}</span>
                                                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{med.days} Days</span>
                                                <span className="text-blue-600">{med.timing}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" onClick={() => openMedicineModal(med, idx)}>
                                                <Copy className="h-4 w-4 text-slate-400" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => removeMedicine(idx)} className="hover:text-red-600 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-50">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={saveCurrentAsTemplate}
                                    className="flex-1 border-indigo-100 text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl shadow-sm h-12"
                                >
                                    <Save className="mr-2 h-4 w-4" /> Save as Master Protocol
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <footer className="sticky bottom-0 z-40 bg-white/80 backdrop-blur-md border-t border-slate-100 p-6 shrink-0">
                <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4">
                    <Button
                        onClick={() => savePrescription(false)}
                        disabled={isSaving}
                        className="bg-slate-900 hover:bg-black text-white px-8 py-6 rounded-2xl shadow-xl shadow-slate-200"
                    >
                        {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                        Save Prescription
                    </Button>
                    <Button
                        onClick={() => savePrescription(true)}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-2xl shadow-xl shadow-blue-200"
                    >
                        <Receipt className="mr-2 h-5 w-5" />
                        Save & Create Bill
                    </Button>
                    <Button
                        variant="outline"
                        onClick={convertAndPrint}
                        disabled={isConverting}
                        className="px-8 py-6 rounded-2xl border-slate-200 hover:bg-slate-50"
                    >
                        {isConverting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Printer className="mr-2 h-5 w-5" />}
                        Digitize & Print
                    </Button>
                    {!isModal && (
                        <Button variant="ghost" onClick={() => router.back()} className="px-8 py-6 rounded-2xl">
                            Cancel
                        </Button>
                    )}
                </div>
            </footer>

            {/* Medicine Config Modal */}
            {showMedicineModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMedicineModal(false)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configuring Medicine</p>
                                    <h2 className="text-2xl font-black text-slate-900 line-clamp-2">{currentMedicine?.name}</h2>
                                </div>
                                <button onClick={() => setShowMedicineModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                                    <X className="h-6 w-6 text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dosage Schedule</label>
                                    <select
                                        value={modalDosage}
                                        onChange={(e) => setModalDosage(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-blue-50 transition-all outline-none appearance-none"
                                    >
                                        <option value="1-0-1">Morning & Evening (1-0-1)</option>
                                        <option value="1-1-1">Three times daily (1-1-1)</option>
                                        <option value="1-1-1-1">Four times daily (1-1-1-1)</option>
                                        <option value="0-0-1">At Night (0-0-1)</option>
                                        <option value="1-0-0">Morning Only (1-0-0)</option>
                                        <option value="1-1-0">Morning & Noon (1-1-0)</option>
                                        <option value="SOS">When Required (SOS)</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Duration (Days)</label>
                                        <select
                                            value={modalDays}
                                            onChange={(e) => setModalDays(e.target.value)}
                                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-blue-50 transition-all outline-none appearance-none"
                                        >
                                            {[3, 5, 7, 10, 14, 21, 30].map(d => (
                                                <option key={d} value={d.toString()}>{d} Days</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Timing</label>
                                        <select
                                            value={modalTiming}
                                            onChange={(e) => setModalTiming(e.target.value)}
                                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-blue-50 transition-all outline-none appearance-none"
                                        >
                                            <option value="After Food">After Food</option>
                                            <option value="Before Food">Before Food</option>
                                            <option value="Empty Stomach">Empty Stomach</option>
                                            <option value="With Food">With Food</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-100">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Result Confirmation</p>
                                    <p className="text-xl font-black mt-1">Take {modalDosage} for {modalDays} days {modalTiming.toLowerCase()}.</p>
                                </div>
                            </div>

                            <Button onClick={saveMedicineFromModal} className="w-full bg-slate-900 hover:bg-black text-white py-8 rounded-2xl font-bold text-lg">
                                Add to Prescription
                            </Button>
                        </div>
                    </div>
                </div>
            )}
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
