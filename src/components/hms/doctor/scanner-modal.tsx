'use client'

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Upload, X, Check, FileText, Smartphone, Wand2, Image as ImageIcon, Loader2 } from "lucide-react"
import { jsPDF } from "jspdf"
import { saveDoctorNote } from "@/app/actions/doctor-notes"
import { toast } from "sonner"

interface ScannerModalProps {
    isOpen: boolean
    onClose: () => void
    doctorName: string
    doctorId: string
    patientId: string
    patientName: string
    appointmentId?: string
}

export function ScannerModal({ isOpen, onClose, doctorName, doctorId, patientId, patientName, appointmentId }: ScannerModalProps) {
    const [step, setStep] = useState<'capture' | 'preview' | 'result'>('capture')
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [filter, setFilter] = useState<'none' | 'magic' | 'bw'>('none')
    const [isProcessing, setIsProcessing] = useState(false)
    const [extractedText, setExtractedText] = useState("")
    const [pdfBase64, setPdfBase64] = useState<string | null>(null)

    const videoRef = useRef<HTMLVideoElement>(null)
    const [isCameraActive, setIsCameraActive] = useState(false)

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('capture')
            setImageSrc(null)
            setFilter('none')
            setExtractedText("")
            setPdfBase64(null)
            setIsProcessing(false)
            startCamera()
        } else {
            stopCamera()
        }
        return () => stopCamera()
    }, [isOpen])

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                setIsCameraActive(true)
            }
        } catch (err) {
            console.error("Camera error:", err)
            setIsCameraActive(false)
        }
    }

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream
            stream.getTracks().forEach(track => track.stop())
            setIsCameraActive(false)
        }
    }

    const captureImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas")
            canvas.width = videoRef.current.videoWidth
            canvas.height = videoRef.current.videoHeight
            const ctx = canvas.getContext("2d")
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0)
                setImageSrc(canvas.toDataURL("image/jpeg"))
                setStep('preview')
                stopCamera()
            }
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string)
                setStep('preview')
                stopCamera()
            }
            reader.readAsDataURL(file)
        }
    }

    const processDocument = async () => {
        if (!imageSrc) return

        setIsProcessing(true)

        try {
            // 1. Generate PDF
            const pdf = new jsPDF()
            const imgProps = pdf.getImageProperties(imageSrc)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

            // Add image to PDF (apply filter logic if needed via canvas, for now raw image)
            pdf.addImage(imageSrc, 'JPEG', 0, 0, pdfWidth, pdfHeight)
            const generatedPdfBase64 = pdf.output('datauristring')
            setPdfBase64(generatedPdfBase64)

            // 2. OCR Extraction
            // Convert base64 to file-like object for API
            const base64Response = await fetch(imageSrc);
            const blob = await base64Response.blob();
            const formData = new FormData()
            formData.append('image', blob, 'scan.jpg')

            const response = await fetch('/api/recognize-handwriting', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()
            if (data.success) {
                setExtractedText(data.text)
                setStep('result')
            } else {
                toast.error("OCR Failed: " + data.error)
            }

        } catch (error) {
            console.error("Processing error:", error)
            toast.error("Failed to process document")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleSave = async () => {
        if (!pdfBase64) return

        setIsProcessing(true)
        const result = await saveDoctorNote({
            doctorId,
            patientId,
            appointmentId,
            content: extractedText,
            pdfBase64
        })

        setIsProcessing(false)
        if (result.success) {
            toast.success("Prescription Scanned & Saved!")
            onClose()
        } else {
            toast.error(result.error)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                            <Smartphone className="h-5 w-5 text-blue-500" />
                            Rx Scanner
                        </h3>
                        <p className="text-xs font-bold text-slate-500">Patient: {patientName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950/50">

                    {step === 'capture' && (
                        <div className="flex flex-col items-center justify-center h-full gap-8 py-8">
                            {isCameraActive ? (
                                <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-xl ring-4 ring-white dark:ring-slate-800">
                                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                    <button
                                        onClick={captureImage}
                                        className="absolute bottom-6 left-1/2 -translate-x-1/2 h-16 w-16 bg-white rounded-full border-4 border-slate-200 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
                                    >
                                        <div className="h-12 w-12 bg-red-500 rounded-full" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full max-w-md aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                                    <p className="font-bold text-slate-400">Camera not available</p>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-slate-400 uppercase">OR</span>
                            </div>

                            <label className="cursor-pointer bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center gap-2 hover:border-blue-500 transition-colors">
                                <Upload className="h-8 w-8 text-blue-500" />
                                <span className="font-bold text-sm text-slate-600 dark:text-slate-300">Upload Saved Image</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                            </label>
                        </div>
                    )}

                    {step === 'preview' && imageSrc && (
                        <div className="h-full flex flex-col items-center">
                            <div className="flex-1 w-full max-w-2xl relative">
                                <img
                                    src={imageSrc}
                                    alt="Preview"
                                    className={`w-full h-full object-contain rounded-lg shadow-lg ${filter === 'bw' ? 'grayscale contrast-125' :
                                            filter === 'magic' ? 'contrast-125 brightness-110 saturate-150' : ''
                                        }`}
                                />
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setFilter('none')}
                                    className={`px-4 py-2 rounded-full text-xs font-black border transition-all ${filter === 'none' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
                                >
                                    Original
                                </button>
                                <button
                                    onClick={() => setFilter('magic')}
                                    className={`px-4 py-2 rounded-full text-xs font-black border transition-all flex items-center gap-1 ${filter === 'magic' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600'}`}
                                >
                                    <Wand2 className="h-3 w-3" /> Magic Color
                                </button>
                                <button
                                    onClick={() => setFilter('bw')}
                                    className={`px-4 py-2 rounded-full text-xs font-black border transition-all ${filter === 'bw' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
                                >
                                    B&W Document
                                </button>
                            </div>

                            <div className="mt-8 flex gap-4 w-full max-w-sm">
                                <button onClick={() => setStep('capture')} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl">Retake</button>
                                <button
                                    onClick={processDocument}
                                    disabled={isProcessing}
                                    className="flex-1 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                                    Process & Scan
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'result' && (
                        <div className="flex flex-col lg:flex-row h-full gap-6">
                            {/* PDF Preview Side */}
                            <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden flex flex-col">
                                <div className="p-3 bg-slate-300 dark:bg-slate-900 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 text-center">
                                    Generated PDF Preview
                                </div>
                                <div className="flex-1 p-4 flex items-center justify-center">
                                    {pdfBase64 ? (
                                        <iframe src={pdfBase64} className="w-full h-full rounded-lg bg-white" title="PDF Preview"></iframe>
                                    ) : (
                                        <div className="text-red-500 font-bold">PDF Generation Failed</div>
                                    )}
                                </div>
                            </div>

                            {/* Extracted Text Side */}
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b border-blue-100 dark:border-blue-800/50 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        AI Extracted Text
                                    </div>
                                    <textarea
                                        value={extractedText}
                                        onChange={(e) => setExtractedText(e.target.value)}
                                        className="flex-1 p-4 w-full resize-none outline-none bg-transparent font-mono text-sm leading-relaxed"
                                        placeholder="AI recognition failed to extract text..."
                                    />
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={isProcessing}
                                    className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                                >
                                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                                    SAVE RECORD
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
