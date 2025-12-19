'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Printer, Plus, Trash2, Copy, Eraser, Mic, Zap, Clock } from 'lucide-react'

export default function NewPrescriptionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patientId')

    const [patientInfo, setPatientInfo] = useState<any>(null)
    const [medicines, setMedicines] = useState<any[]>([])
    const [selectedMedicines, setSelectedMedicines] = useState<any[]>([])

    // Medicine search
    const [medicineSearch, setMedicineSearch] = useState('')
    const [filteredMedicines, setFilteredMedicines] = useState<any[]>([])
    const [showMedicineDropdown, setShowMedicineDropdown] = useState(false)

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
        {
            name: 'Common Cold',
            meds: [
                { name: 'Paracetamol 650mg', dosage: '1-0-1', days: '3' },
                { name: 'Cetirizine 10mg', dosage: '0-0-1', days: '5' },
                { name: 'Vitamin C', dosage: '1-0-0', days: '7' }
            ]
        },
        {
            name: 'Fever',
            meds: [
                { name: 'Paracetamol 650mg', dosage: '1-1-1', days: '3' },
                { name: 'Pantoprazole 40mg', dosage: '1-0-0', days: '5' }
            ]
        },
        {
            name: 'Gastritis',
            meds: [
                { name: 'Pantoprazole 40mg', dosage: '1-0-1', days: '7' },
                { name: 'Domperidone 10mg', dosage: '1-0-1', days: '5' }
            ]
        }
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
                        days: m.days
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
            days: m.days
        })))
        alert(`✅ Applied "${template.name}" template`)
    }


    const addMedicineFromSearch = (med: any) => {
        setSelectedMedicines([...selectedMedicines, {
            id: med.id,
            name: med.name,
            dosage: '1-0-1',
            days: '5'
        }])
        setMedicineSearch('')
        setShowMedicineDropdown(false)
    }

    const addCustomMedicine = () => {
        if (medicineSearch.trim().length === 0) return

        // Add as custom medicine (not from database)
        setSelectedMedicines([...selectedMedicines, {
            id: '', // No ID since it's custom
            name: medicineSearch.trim(),
            dosage: '1-0-1',
            days: '5'
        }])
        setMedicineSearch('')
        setShowMedicineDropdown(false)
    }

    const handleMedicineKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            // If there are filtered results, add the first one
            if (filteredMedicines.length > 0) {
                addMedicineFromSearch(filteredMedicines[0])
            } else {
                // Otherwise add as custom medicine
                addCustomMedicine()
            }
        }
    }

    const removeMedicine = (index: number) => {
        setSelectedMedicines(selectedMedicines.filter((_, i) => i !== index))
    }

    const updateMedicine = (index: number, field: string, value: string) => {
        const updated = [...selectedMedicines]
        updated[index][field] = value
        setSelectedMedicines(updated)
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Patient Header - Prominent */}
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

                {/* Quick Actions - Templates & Copy Last */}
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
                            <h3 className="font-bold text-gray-800 text-sm mb-2 uppercase tracking-wide">{section.title}</h3>
                            {showConverted ? (
                                <div className="min-h-[80px] p-4 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-wrap text-sm">
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

                    {/* Medicines Section - FUTURISTIC */}
                    <div className="mb-6 mt-8">
                        <h3 className="font-bold text-gray-800 text-sm mb-4 uppercase tracking-wide">PRESCRIPTION</h3>

                        {/* Smart Medicine Search */}
                        <div className="mb-4 print:hidden">
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={medicineSearch}
                                        onChange={(e) => setMedicineSearch(e.target.value)}
                                        onKeyPress={handleMedicineKeyPress}
                                        placeholder="🔍 Start typing medicine name (dropdown will appear)..."
                                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
                                    />


                                    {/* Dropdown with results */}
                                    {showMedicineDropdown && (
                                        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-blue-500 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                                            {filteredMedicines.length > 0 && (
                                                filteredMedicines.map((med, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => addMedicineFromSearch(med)}
                                                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                                                    >
                                                        <div className="font-semibold text-gray-800">{med.name}</div>
                                                        <div className="text-xs text-gray-500">From database</div>
                                                    </div>
                                                ))
                                            )}
                                            {/* Custom medicine option */}
                                            {medicineSearch.trim().length > 0 && (
                                                <div
                                                    onClick={addCustomMedicine}
                                                    className="px-4 py-3 hover:bg-green-50 cursor-pointer bg-green-50 border-t-2 border-green-300"
                                                >
                                                    <div className="font-semibold text-green-700">✚ Add "{medicineSearch}" (Custom)</div>
                                                    <div className="text-xs text-green-600">Click or press Enter to add</div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={addCustomMedicine}
                                    disabled={medicineSearch.trim().length === 0}
                                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Plus className="h-5 w-5" /> Add
                                </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-2" suppressHydrationWarning>
                                💡 {medicines.length} medicines in database • Press Enter or click + to add custom
                            </div>
                        </div>

                        {/* Selected Medicines List */}
                        {selectedMedicines.length > 0 && (
                            <div className="space-y-2">
                                {selectedMedicines.map((med, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                        <div className="font-bold text-gray-700 w-8">{idx + 1}.</div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">{med.name}</div>
                                            <div className="flex gap-2 mt-1 print:hidden">
                                                <input
                                                    type="text"
                                                    value={med.dosage}
                                                    onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                                                    placeholder="1-0-1"
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-xs"
                                                />
                                                <input
                                                    type="text"
                                                    value={med.days}
                                                    onChange={(e) => updateMedicine(idx, 'days', e.target.value)}
                                                    placeholder="Days"
                                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                                                />
                                            </div>
                                            <div className="text-sm text-gray-600 hidden print:block">
                                                {med.dosage} × {med.days} Days
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeMedicine(idx)}
                                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs print:hidden"
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
                <div className="sticky bottom-6 bg-white shadow-2xl rounded-2xl p-4 flex gap-3 justify-center print:hidden border-t-4 border-blue-500">
                    <button
                        onClick={convertAndPrint}
                        disabled={isConverting}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-lg flex items-center gap-3 disabled:from-gray-400 disabled:to-gray-400 shadow-lg transform hover:scale-105 transition"
                    >
                        <Printer className="h-6 w-6" /> {isConverting ? 'Converting...' : 'Convert & Print'}
                    </button>
                    <button
                        onClick={() => {
                            setShowConverted(false)
                            window.print()
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg flex items-center gap-3 shadow-lg transform hover:scale-105 transition"
                    >
                        <Printer className="h-6 w-6" /> Print Handwritten
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold shadow-lg"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    )
}
