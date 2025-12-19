'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Printer, Plus, Trash2, Copy, Eraser } from 'lucide-react'

export default function NewPrescriptionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patientId')

    const [patientInfo, setPatientInfo] = useState<any>(null)
    const [medicines, setMedicines] = useState<any[]>([])
    const [selectedMedicines, setSelectedMedicines] = useState<any[]>([{
        medicineId: '',
        medicineName: '',
        morning: '1',
        afternoon: '0',
        evening: '1',
        night: '0',
        days: '3'
    }])

    // Handwriting canvases for each section
    const vitalsCanvasRef = useRef<HTMLCanvasElement>(null)
    const diagnosisCanvasRef = useRef<HTMLCanvasElement>(null)
    const complaintCanvasRef = useRef<HTMLCanvasElement>(null)
    const examinationCanvasRef = useRef<HTMLCanvasElement>(null)
    const planCanvasRef = useRef<HTMLCanvasElement>(null)
    const medicinesCanvasRef = useRef<HTMLCanvasElement>(null)

    const [isDrawing, setIsDrawing] = useState(false)
    const [currentCanvas, setCurrentCanvas] = useState<HTMLCanvasElement | null>(null)
    const [isConverting, setIsConverting] = useState(false)

    // Converted text
    const [convertedText, setConvertedText] = useState({
        vitals: '',
        diagnosis: '',
        complaint: '',
        examination: '',
        plan: '',
        medicines: ''
    })
    const [showConverted, setShowConverted] = useState(false)

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

    // Initialize all canvases
    useEffect(() => {
        const canvases = [
            vitalsCanvasRef.current,
            diagnosisCanvasRef.current,
            complaintCanvasRef.current,
            examinationCanvasRef.current,
            planCanvasRef.current,
            medicinesCanvasRef.current
        ]

        canvases.forEach(canvas => {
            if (canvas) {
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    ctx.fillStyle = '#ffffff'
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
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

    const convertHandwritingToText = async () => {
        setIsConverting(true)
        try {
            const canvases = [
                { ref: vitalsCanvasRef, field: 'vitals', label: 'Vitals' },
                { ref: diagnosisCanvasRef, field: 'diagnosis', label: 'Diagnosis' },
                { ref: complaintCanvasRef, field: 'complaint', label: 'Presenting Complaint' },
                { ref: examinationCanvasRef, field: 'examination', label: 'General Examination' },
                { ref: planCanvasRef, field: 'plan', label: 'Plan' },
                { ref: medicinesCanvasRef, field: 'medicines', label: 'Medicines' }
            ]

            const converted: any = {}

            for (const { ref, field, label } of canvases) {
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
                            console.error(`Error converting ${field}:`, err)
                            converted[field] = ''
                        }
                        resolve(null)
                    }, 'image/jpeg', 0.8)
                })
            }

            setConvertedText(converted)
            setShowConverted(true)

            // Wait a bit then trigger print
            setTimeout(() => {
                window.print()
            }, 500)

        } catch (error) {
            console.error('Conversion error:', error)
            alert('Failed to convert handwriting. Printing as handwritten.')
            window.print()
        } finally {
            setIsConverting(false)
        }
    }

    const addMedicine = () => {
        setSelectedMedicines([...selectedMedicines, {
            medicineId: '',
            medicineName: '',
            morning: '1',
            afternoon: '0',
            evening: '1',
            night: '0',
            days: '3'
        }])
    }

    const updateMedicine = (index: number, field: string, value: string) => {
        const updated = [...selectedMedicines]
        updated[index][field] = value

        if (field === 'medicineId') {
            const med = medicines.find(m => m.id === value)
            if (med) updated[index].medicineName = med.name
        }

        setSelectedMedicines(updated)
    }

    const removeMedicine = (index: number) => {
        setSelectedMedicines(selectedMedicines.filter((_, i) => i !== index))
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-5xl mx-auto">

                {/* Action Buttons */}
                <div className="mb-4 flex gap-3 print:hidden">
                    <button
                        onClick={convertHandwritingToText}
                        disabled={isConverting}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold flex items-center gap-2 disabled:bg-gray-400"
                    >
                        <Printer className="h-4 w-4" /> {isConverting ? 'Converting...' : 'Convert & Print'}
                    </button>
                    <button
                        onClick={() => {
                            setShowConverted(false)
                            window.print()
                        }}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                    >
                        Print Handwritten
                    </button>
                    <button onClick={() => router.back()} className="px-6 py-2 bg-gray-500 text-white rounded font-semibold">Back</button>
                </div>

                {/* Prescription Form */}
                <div className="bg-white shadow-lg p-8">

                    {/* Patient Info */}
                    <div className="text-sm mb-6 pb-4 border-b-2 border-gray-800">
                        <div className="grid grid-cols-2 gap-4">
                            <div><span className="font-bold">Name:</span> {patientInfo ? `${patientInfo.first_name} ${patientInfo.last_name}`.toUpperCase() : 'Loading...'}</div>
                            <div><span className="font-bold">Age/Gender:</span> {patientInfo?.age || 'N/A'}Y / {patientInfo?.gender || 'N/A'}</div>
                            <div><span className="font-bold">UHID:</span> {patientId?.substring(0, 12) || 'N/A'}</div>
                            <div><span className="font-bold">Date:</span> {typeof window !== 'undefined' ? new Date().toLocaleDateString() : ''}</div>
                        </div>
                    </div>

                    {/* VITALS */}
                    <div className="mb-8">
                        <h3 className="font-bold text-black text-lg mb-3">VITALS</h3>
                        {showConverted ? (
                            <div className="min-h-[100px] p-3 border border-gray-300 rounded whitespace-pre-wrap">{convertedText.vitals || 'No text recognized'}</div>
                        ) : (
                            <>
                                <canvas
                                    ref={vitalsCanvasRef}
                                    width={800}
                                    height={100}
                                    className="border-2 border-blue-300 rounded cursor-crosshair w-full bg-white print:hidden"
                                    onMouseDown={(e) => startDrawing(e, vitalsCanvasRef.current!)}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                />
                                <button
                                    onClick={() => clearCanvas(vitalsCanvasRef.current)}
                                    className="mt-2 px-3 py-1 bg-gray-400 text-white rounded text-sm print:hidden"
                                >
                                    <Eraser className="h-3 w-3 inline mr-1" /> Clear
                                </button>
                            </>
                        )}
                    </div>

                    {/* DIAGNOSIS */}
                    <div className="mb-8">
                        <h3 className="font-bold text-black text-lg mb-3">DIAGNOSIS:</h3>
                        {showConverted ? (
                            <div className="min-h-[100px] p-3 border border-gray-300 rounded whitespace-pre-wrap">{convertedText.diagnosis || 'No text recognized'}</div>
                        ) : (
                            <>
                                <canvas
                                    ref={diagnosisCanvasRef}
                                    width={800}
                                    height={100}
                                    className="border-2 border-blue-300 rounded cursor-crosshair w-full bg-white print:hidden"
                                    onMouseDown={(e) => startDrawing(e, diagnosisCanvasRef.current!)}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                />
                                <button
                                    onClick={() => clearCanvas(diagnosisCanvasRef.current)}
                                    className="mt-2 px-3 py-1 bg-gray-400 text-white rounded text-sm print:hidden"
                                >
                                    <Eraser className="h-3 w-3 inline mr-1" /> Clear
                                </button>
                            </>
                        )}
                    </div>

                    {/* PRESENTING COMPLAINT */}
                    <div className="mb-8">
                        <h3 className="font-bold text-black text-lg mb-3">PRESENTING COMPLAINT:</h3>
                        {showConverted ? (
                            <div className="min-h-[120px] p-3 border border-gray-300 rounded whitespace-pre-wrap">{convertedText.complaint || 'No text recognized'}</div>
                        ) : (
                            <>
                                <canvas
                                    ref={complaintCanvasRef}
                                    width={800}
                                    height={120}
                                    className="border-2 border-blue-300 rounded cursor-crosshair w-full bg-white print:hidden"
                                    onMouseDown={(e) => startDrawing(e, complaintCanvasRef.current!)}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                />
                                <button
                                    onClick={() => clearCanvas(complaintCanvasRef.current)}
                                    className="mt-2 px-3 py-1 bg-gray-400 text-white rounded text-sm print:hidden"
                                >
                                    <Eraser className="h-3 w-3 inline mr-1" /> Clear
                                </button>
                            </>
                        )}
                    </div>

                    {/* GENERAL EXAMINATION */}
                    <div className="mb-8">
                        <h3 className="font-bold text-black text-lg mb-3">GENERAL EXAMINATION:</h3>
                        {showConverted ? (
                            <div className="min-h-[150px] p-3 border border-gray-300 rounded whitespace-pre-wrap">{convertedText.examination || 'No text recognized'}</div>
                        ) : (
                            <>
                                <canvas
                                    ref={examinationCanvasRef}
                                    width={800}
                                    height={150}
                                    className="border-2 border-blue-300 rounded cursor-crosshair w-full bg-white print:hidden"
                                    onMouseDown={(e) => startDrawing(e, examinationCanvasRef.current!)}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                />
                                <button
                                    onClick={() => clearCanvas(examinationCanvasRef.current)}
                                    className="mt-2 px-3 py-1 bg-gray-400 text-white rounded text-sm print:hidden"
                                >
                                    <Eraser className="h-3 w-3 inline mr-1" /> Clear
                                </button>
                            </>
                        )}
                    </div>

                    {/* PLAN */}
                    <div className="mb-8">
                        <h3 className="font-bold text-black text-lg mb-3">PLAN:</h3>
                        {showConverted ? (
                            <div className="min-h-[100px] p-3 border border-gray-300 rounded whitespace-pre-wrap">{convertedText.plan || 'No text recognized'}</div>
                        ) : (
                            <>
                                <canvas
                                    ref={planCanvasRef}
                                    width={800}
                                    height={100}
                                    className="border-2 border-blue-300 rounded cursor-crosshair w-full bg-white print:hidden"
                                    onMouseDown={(e) => startDrawing(e, planCanvasRef.current!)}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                />
                                <button
                                    onClick={() => clearCanvas(planCanvasRef.current)}
                                    className="mt-2 px-3 py-1 bg-gray-400 text-white rounded text-sm print:hidden"
                                >
                                    <Eraser className="h-3 w-3 inline mr-1" /> Clear
                                </button>
                            </>
                        )}
                    </div>

                    {/* PRESCRIPTION/MEDICINES */}
                    <div className="mb-8">
                        <h3 className="font-bold text-black text-lg mb-3">PRESCRIPTION</h3>
                        {showConverted ? (
                            <div className="min-h-[200px] p-3 border border-gray-300 rounded whitespace-pre-wrap">{convertedText.medicines || 'No medicines recognized'}</div>
                        ) : (
                            <>
                                <canvas
                                    ref={medicinesCanvasRef}
                                    width={800}
                                    height={200}
                                    className="border-2 border-blue-300 rounded cursor-crosshair w-full bg-white print:hidden"
                                    onMouseDown={(e) => startDrawing(e, medicinesCanvasRef.current!)}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                />
                                <button
                                    onClick={() => clearCanvas(medicinesCanvasRef.current)}
                                    className="mt-2 px-3 py-1 bg-gray-400 text-white rounded text-sm print:hidden"
                                >
                                    <Eraser className="h-3 w-3 inline mr-1" /> Clear
                                </button>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-16 pt-6 border-t-2 border-black flex justify-between print:mt-32">
                        <div></div>
                        <div className="text-right">
                            <p className="font-bold mb-8">SIGNATURE:</p>
                            <div className="border-b-2 border-gray-400 w-48"></div>
                            <p className="text-sm mt-2">Dr. _________________</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
