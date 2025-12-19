'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Pen, Eraser, Trash2, Sparkles, Camera, Plus, X } from 'lucide-react'

export default function NewPrescriptionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patientId')
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [recognizedText, setRecognizedText] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [medicines, setMedicines] = useState<any[]>([])
    const [patientInfo, setPatientInfo] = useState<any>(null)

    // Canvas drawing setup
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        canvas.width = canvas.offsetWidth
        canvas.height = 400

        // Set drawing styles
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#1e40af'
    }, [])

    // Fetch patient data
    useEffect(() => {
        if (!patientId) return;

        fetch(`/api/patients/${patientId}`)
            .then(res => res.json())
            .then(data => {
                if (data.patient) {
                    setPatientInfo(data.patient)
                }
            })
            .catch(err => {
                console.error('Failed to fetch patient:', err)
                setPatientInfo({ first_name: 'Unknown', last_name: 'Patient' })
            })
    }, [patientId])

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        setIsDrawing(true)
        ctx.beginPath()
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return

        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.stroke()
    }

    const stopDrawing = () => {
        setIsDrawing(false)
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setRecognizedText('')
    }

    const recognizeHandwriting = async () => {
        const canvas = canvasRef.current
        if (!canvas) return

        setIsProcessing(true)

        try {
            // Convert canvas to blob
            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((blob) => resolve(blob!), 'image/png')
            })

            // Create FormData
            const formData = new FormData()
            formData.append('image', blob, 'handwriting.png')

            // Send to API
            const response = await fetch('/api/recognize-handwriting', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (data.text) {
                setRecognizedText(data.text)
            }
        } catch (error) {
            console.error('Error recognizing handwriting:', error)
            alert('Failed to recognize handwriting')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                                <Sparkles className="h-8 w-8 text-indigo-500 animate-pulse" />
                                AI-Powered Prescription
                            </h1>
                            <p className="text-gray-600 mt-1">Patient: {patientInfo ? ` ` : 'Loading...'} | Age: {patientInfo?.age || 'N/A'} | Gender: {patientInfo?.gender || 'N/A'}</p>
                        </div>
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Handwriting Canvas */}
                    <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Pen className="h-5 w-5 text-indigo-500" />
                            Write Prescription
                        </h2>

                        <div className="relative border-4 border-dashed border-indigo-200 rounded-2xl overflow-hidden bg-white">
                            <canvas
                                ref={canvasRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                className="w-full cursor-crosshair"
                                style={{ height: '400px' }}
                            />
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={clearCanvas}
                                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                            >
                                <Trash2 className="h-5 w-5" />
                                Clear
                            </button>
                            <button
                                onClick={recognizeHandwriting}
                                disabled={isProcessing}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" />
                                        Recognize Text
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Recognized Text & Prescription */}
                    <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Camera className="h-5 w-5 text-purple-500" />
                            Recognized Text
                        </h2>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4 min-h-[200px]">
                            {recognizedText ? (
                                <p className="text-gray-900 whitespace-pre-wrap">{recognizedText}</p>
                            ) : (
                                <p className="text-gray-400 italic">Write on the canvas and click "Recognize Text"</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-bold mb-3">Add Medicines</h3>
                            <button className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                                <Plus className="h-5 w-5" />
                                Add Medicine
                            </button>
                        </div>

                        <div className="mt-6">
                            <button className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-2xl shadow-indigo-500/50">
                                Save Prescription
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



