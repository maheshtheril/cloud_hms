'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Printer, Plus, Trash2, Copy, Eraser, Clock, Zap, X } from 'lucide-react'

export default function NewPrescriptionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patientId')
    const appointmentId = searchParams.get('appointmentId') // For billing integration

    const [patientInfo, setPatientInfo] = useState<any>(null)
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

    // Converted text
    const [convertedText, setConvertedText] = useState({
        vitals: '',
        diagnosis: '',
        complaint: '',
        examination: '',
        plan: ''
    })
    const [showConverted, setShowConverted] = useState(false)

    // Quick Templates
    const templates = [
        { name: 'Common Cold', meds: [{ name: 'Paracetamol 650mg', dosage: '1-0-1', days: '3' }] },
        { name: 'Fever', meds: [{ name: 'Paracetamol 650mg', dosage: '1-1-1', days: '3' }] },
        { name: 'Gastritis', meds: [{ name: 'Pantoprazole 40mg', dosage: '1-0-1', days: '7' }] }
    ]

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

    // Fetch existing prescription if appointmentId is present
    useEffect(() => {
        if (!appointmentId) return;

        console.log('🔍 Checking for existing prescription for appointment:', appointmentId)
        fetch(`/api/prescriptions/by-appointment/${appointmentId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.prescription) {
                    console.log('✅ Found existing prescription, populating...')
                    const pr = data.prescription;
                    setConvertedText({
                        vitals: pr.vitals || '',
                        diagnosis: pr.diagnosis || '',
                        complaint: pr.complaint || '',
                        examination: pr.examination || '',
                        plan: pr.plan || ''
                    });
                    setSelectedMedicines(pr.medicines || []);
                    setShowConverted(true); // Switch to text mode if data exists
                }
            })
            .catch(err => console.error('Error fetching existing prescription:', err));
    }, [appointmentId]);

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
        console.log('Medicine search:', medicineSearch, 'Available medicines:', medicines.length)
        if (medicineSearch.length >= 1) {
            const filtered = medicines.filter(m =>
                m.name.toLowerCase().includes(medicineSearch.toLowerCase())
            ).slice(0, 10)
            console.log('Filtered medicines:', filtered.length, filtered)
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
                        dosage: `${m.morning}-${m.afternoon}-${m.evening}-${m.night}`,
                        days: m.days,
                        timing: 'After Food'
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
        setSelectedMedicines(template.meds.map((m: any) => ({
            id: '',
            name: m.name,
            dosage: m.dosage,
            days: m.days,
            timing: 'After Food'
        })))
        alert(`✅ Applied "${template.name}" template`)
    }

    const openMedicineModal = (med: any, editIdx: number | null = null) => {
        setCurrentMedicine(med)
        setEditingIndex(editIdx)
        if (editIdx !== null) {
            // Editing existing
            const existing = selectedMedicines[editIdx]
            setModalDosage(existing.dosage)
            setModalDays(existing.days)
            setModalTiming(existing.timing || 'After Food')
        } else {
            // Adding new
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
            // Update existing
            const updated = [...selectedMedicines]
            updated[editingIndex] = medicineData
            setSelectedMedicines(updated)
        } else {
            // Add new
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

        try {
            const res = await fetch('/api/prescriptions/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    appointmentId,
                    vitals: convertedText.vitals || '',
                    diagnosis: convertedText.diagnosis || '',
                    complaint: convertedText.complaint || '',
                    examination: convertedText.examination || '',
                    plan: convertedText.plan || '',
                    medicines: selectedMedicines
                })
            })

            const data = await res.json()

            if (data.success) {
                alert('✅ Prescription saved successfully!')

                if (redirectToBill && data.medicines && data.medicines.length > 0) {
                    // Redirect to billing with medicines AND appointment info
                    const medicineParams = encodeURIComponent(JSON.stringify(data.medicines))
                    const appointmentParam = appointmentId ? `&appointmentId=${appointmentId}` : ''
                    router.push(`/hms/billing/new?patientId=${patientId}&medicines=${medicineParams}${appointmentParam}`)
                } else {
                    // Just go back to patient list
                    router.push('/hms/patients')
                }
            } else {
                alert('❌ Failed to save: ' + (data.error || 'Unknown error'))
            }
        } catch (error) {
            console.error('Save error:', error)
            alert('❌ Failed to save prescription')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Patient Header */}
                <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 border-l-4 border-blue-600">
                    <div className="grid grid-cols-4 gap-6 text-sm">
                        <div>
                            <div className="text-gray-500 text-xs font-medium mb-1">PATIENT NAME</div>
                            <div className="text-xl font-bold text-gray-900">
                                {patientInfo ? `${patientInfo.first_name} ${patientInfo.last_name}`.toUpperCase() : 'Loading...'}
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs font-medium mb-1">AGE / GENDER</div>
                            <div className="text-lg font-semibold text-gray-700">
                                {patientInfo?.age || 'N/A'} Years / {patientInfo?.gender || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs font-medium mb-1">UHID</div>
                            <div className="text-lg font-mono text-gray-700">{patientId?.substring(0, 12) || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs font-medium mb-1">DATE</div>
                            <div className="text-lg font-semibold text-gray-700">
                                {typeof window !== 'undefined' ? new Date().toLocaleDateString('en-IN') : ''}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white shadow-lg rounded-xl p-4 mb-6 print:hidden">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" /> QUICK START
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={loadLastPrescription}
                            disabled={loadingPrevious}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:bg-gray-400"
                        >
                            <Clock className="h-4 w-4" /> {loadingPrevious ? 'Loading...' : 'Copy Last Prescription'}
                        </button>
                        {templates.map((template, idx) => (
                            <button
                                key={idx}
                                onClick={() => applyTemplate(template)}
                                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium"
                            >
                                {template.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Prescription Form */}
                <div className="bg-white shadow-xl rounded-2xl p-8 mb-6">

                    {/* Handwriting Sections */}
                    {[
                        { title: 'VITALS', ref: vitalsCanvasRef, height: 80 },
                        { title: 'DIAGNOSIS', ref: diagnosisCanvasRef, height: 80 },
                        { title: 'PRESENTING COMPLAINT', ref: complaintCanvasRef, height: 100 },
                        { title: 'GENERAL EXAMINATION', ref: examinationCanvasRef, height: 120 },
                        { title: 'PLAN', ref: planCanvasRef, height: 80 }
                    ].map((section, idx) => (
                        <div key={idx} className="mb-6">
                            <h3 className="font-bold text-black text-base mb-2 uppercase tracking-wide">{section.title}</h3>
                            {showConverted ? (
                                <div className="min-h-[80px] p-4 bg-gray-50 border border-gray-300 rounded-lg whitespace-pre-wrap text-base text-black">
                                    {convertedText[section.title.toLowerCase().split(' ')[0] as keyof typeof convertedText] || 'No text recognized'}
                                </div>
                            ) : (
                                <>
                                    <canvas
                                        ref={section.ref}
                                        width={900}
                                        height={section.height}
                                        className="border-2 border-blue-200 rounded-lg cursor-crosshair w-full bg-white hover:border-blue-400 transition print:hidden"
                                        onMouseDown={(e) => startDrawing(e, section.ref.current!)}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                    />
                                    <button
                                        onClick={() => clearCanvas(section.ref.current)}
                                        className="mt-2 px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-xs flex items-center gap-1 print:hidden"
                                    >
                                        <Eraser className="h-3 w-3" /> Clear
                                    </button>
                                </>
                            )}
                        </div>
                    ))}

                    {/* PRESCRIPTION Section */}
                    <div className="mb-6 mt-8">
                        <h3 className="font-bold text-black text-base mb-4 uppercase tracking-wide">PRESCRIPTION</h3>

                        {/* Medicine Search */}
                        <div className="mb-4 print:hidden">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={medicineSearch}
                                    onChange={(e) => setMedicineSearch(e.target.value)}
                                    autoFocus
                                    placeholder="🔍 Start typing medicine name..."
                                    className="w-full px-6 py-4 text-base text-black border-2 border-blue-400 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none font-medium bg-white"
                                />

                                {/* Dropdown */}
                                {showMedicineDropdown && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-blue-500 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                                        {filteredMedicines.length > 0 && (
                                            filteredMedicines.map((med, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => openMedicineModal(med)}
                                                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                                                >
                                                    <div className="font-bold text-black text-base">{med.name}</div>
                                                    <div className="text-sm text-gray-700">Click to configure & add</div>
                                                </div>
                                            ))
                                        )}
                                        {medicineSearch.trim().length > 0 && (
                                            <div
                                                onClick={() => openMedicineModal({ name: medicineSearch.trim(), id: '' })}
                                                className="px-4 py-3 hover:bg-green-50 cursor-pointer bg-green-50 border-t-2 border-green-300"
                                            >
                                                <div className="font-bold text-green-800 text-base">✚ Add "{medicineSearch}" (Custom)</div>
                                                <div className="text-sm text-green-700">Click to configure & add</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-gray-500 mt-2" suppressHydrationWarning>
                                💡 {medicines.length} medicines in database • Click medicine to configure
                            </div>
                        </div>

                        {/* Selected Medicines - COMPACT LIST */}
                        {selectedMedicines.length > 0 && (
                            <div className="space-y-2">
                                {selectedMedicines.map((med, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
                                        <div className="font-bold text-black w-8">{idx + 1}.</div>
                                        <div className="flex-1">
                                            <div className="font-bold text-black text-base">{med.name}</div>
                                            <div className="text-sm text-gray-700">
                                                {med.dosage} × {med.days} Days - {med.timing}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => openMedicineModal(med, idx)}
                                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs print:hidden font-bold"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => removeMedicine(idx)}
                                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-xs print:hidden font-bold"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Signature */}
                    <div className="mt-16 pt-6 border-t-2 border-gray-800 flex justify-between">
                        <div></div>
                        <div className="text-right">
                            <p className="font-bold mb-8 text-gray-800">SIGNATURE:</p>
                            <div className="border-b-2 border-gray-400 w-48"></div>
                            <p className="text-sm mt-2 text-gray-600">Dr. _________________</p>
                        </div>
                    </div>
                </div>


                {/* Bottom Action Buttons */}
                <div className="bg-white shadow-2xl rounded-2xl p-4 mb-6 print:hidden border-t-4 border-blue-500">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button
                            onClick={() => savePrescription(false)}
                            className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-sm shadow-lg transform hover:scale-105 transition"
                        >
                            💾 Save Prescription
                        </button>
                        <button
                            onClick={() => savePrescription(true)}
                            className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-sm shadow-lg transform hover:scale-105 transition"
                        >
                            💊 Save & Create Bill
                        </button>
                        <button
                            onClick={convertAndPrint}
                            disabled={isConverting}
                            className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold text-sm shadow-lg transform hover:scale-105 transition disabled:from-gray-400 disabled:to-gray-400"
                        >
                            <Printer className="inline h-5 w-5 mr-2" />
                            {isConverting ? 'Converting...' : 'Print'}
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-bold text-sm shadow-lg"
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            </div>

            {/* Medicine Configuration Modal */}
            {showMedicineModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Configure Medicine</h2>
                            <button
                                onClick={() => setShowMedicineModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="text-xl font-bold text-blue-600 mb-4">{currentMedicine?.name}</div>

                            {/* Dosage Dropdown */}
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">DOSAGE (Morning-Afternoon-Evening-Night)</label>
                                <select
                                    value={modalDosage}
                                    onChange={(e) => setModalDosage(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-black font-medium focus:border-blue-500 outline-none"
                                >
                                    <option value="1-0-1">1-0-1 (Morning & Evening)</option>
                                    <option value="1-1-1">1-1-1 (Three times a day)</option>
                                    <option value="1-1-1-1">1-1-1-1 (Four times a day)</option>
                                    <option value="0-0-1">0-0-1 (Night only)</option>
                                    <option value="1-0-0">1-0-0 (Morning only)</option>
                                    <option value="0-1-0">0-1-0 (Afternoon only)</option>
                                    <option value="0-0-0-1">0-0-0-1 (Night only)</option>
                                </select>
                            </div>

                            {/* Days Dropdown */}
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">DAYS</label>
                                <select
                                    value={modalDays}
                                    onChange={(e) => setModalDays(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-black font-medium focus:border-blue-500 outline-none"
                                >
                                    <option value="3">3 Days</option>
                                    <option value="5">5 Days</option>
                                    <option value="7">7 Days (1 Week)</option>
                                    <option value="10">10 Days</option>
                                    <option value="15">15 Days</option>
                                    <option value="30">30 Days (1 Month)</option>
                                </select>
                            </div>

                            {/* Timing Dropdown */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">WHEN TO TAKE</label>
                                <select
                                    value={modalTiming}
                                    onChange={(e) => setModalTiming(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-black font-medium focus:border-blue-500 outline-none"
                                >
                                    <option value="After Food">After Food</option>
                                    <option value="Before Food">Before Food</option>
                                    <option value="Empty Stomach">Empty Stomach</option>
                                    <option value="With Food">With Food</option>
                                    <option value="Anytime">Anytime</option>
                                </select>
                            </div>

                            {/* Preview */}
                            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                                <div className="text-sm text-gray-600 mb-1">Preview:</div>
                                <div className="font-bold text-black text-lg">
                                    {modalDosage} × {modalDays} Days - {modalTiming}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={saveMedicineFromModal}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg"
                            >
                                {editingIndex !== null ? 'Update Medicine' : 'Add Medicine'}
                            </button>
                            <button
                                onClick={() => setShowMedicineModal(false)}
                                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl font-bold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
