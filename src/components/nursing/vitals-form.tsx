'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Activity, Thermometer, Heart, Wind, PersonStanding,
    Weight, Ruler, Save, Loader2, Calculator, Info
} from "lucide-react"
import { saveVitals } from "@/app/actions/nursing-v2"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
    patientId: string
    encounterId: string
    tenantId: string
    initialData?: any
}

export default function NursingVitalsForm({ patientId, encounterId, tenantId, initialData }: Props) {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    // State
    const [height, setHeight] = useState(initialData?.height || '')
    const [weight, setWeight] = useState(initialData?.weight || '')
    const [bmi, setBmi] = useState('')
    const [bmiStatus, setBmiStatus] = useState('')

    const [temp, setTemp] = useState(initialData?.temperature || '')
    const [pulse, setPulse] = useState(initialData?.pulse || '')
    const [bpSys, setBpSys] = useState(initialData?.systolic || '')
    const [bpDia, setBpDia] = useState(initialData?.diastolic || '')
    const [map, setMap] = useState('') // Mean Arterial Pressure
    const [spo2, setSpo2] = useState(initialData?.spo2 || '')
    const [resp, setResp] = useState(initialData?.respiration || '')

    const [notes, setNotes] = useState(initialData?.notes || '')

    // BMI Calc
    useEffect(() => {
        if (height && weight) {
            const h = parseFloat(height) / 100
            const w = parseFloat(weight)
            if (h > 0) {
                const val = (w / (h * h)).toFixed(1)
                setBmi(val)
                const num = parseFloat(val)
                if (num < 18.5) setBmiStatus('Underweight')
                else if (num < 25) setBmiStatus('Normal')
                else if (num < 30) setBmiStatus('Overweight')
                else setBmiStatus('Obese')
            }
        } else {
            setBmi('')
            setBmiStatus('')
        }
    }, [height, weight])

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const res = await saveVitals({
                tenantId,
                patientId,
                encounterId,
                height,
                weight,
                temperature: temp,
                pulse,
                systolic: bpSys,
                diastolic: bpDia,
                spo2,
                respiration: resp,
                notes
            })

            if (res.success) {
                toast({
                    title: "Vitals Recorded",
                    description: "Assessments saved successfully."
                })
                router.push('/hms/nursing')
                router.refresh()
            } else {
                toast({
                    title: "Error",
                    description: res.error,
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to save vitals",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Physical Stats */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <PersonStanding className="h-48 w-48 text-indigo-900" />
                    </div>

                    <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-indigo-500" />
                        Anthropometry
                    </h2>

                    <div className="space-y-6 relative z-10">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Height (cm)</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={e => setHeight(e.target.value)}
                                        className="w-full text-3xl font-black text-slate-900 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all group-hover:border-indigo-100"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-4 top-5 text-sm font-bold text-slate-400">cm</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Weight (kg)</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={e => setWeight(e.target.value)}
                                        className="w-full text-3xl font-black text-slate-900 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all group-hover:border-indigo-100"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-4 top-5 text-sm font-bold text-slate-400">kg</span>
                                </div>
                            </div>
                        </div>

                        {bmi && (
                            <div className="bg-indigo-50 rounded-2xl p-4 flex items-center justify-between border border-indigo-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                        <Calculator className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-indigo-400 uppercase">BMI Score</p>
                                        <p className="text-xl font-black text-indigo-900">{bmi}</p>
                                    </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-lg text-sm font-bold ${bmiStatus === 'Normal' ? 'bg-green-100 text-green-700' :
                                    bmiStatus === 'Overweight' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {bmiStatus}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Vitals */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Activity className="h-48 w-48 text-pink-900" />
                    </div>

                    <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-pink-500" />
                        Vital Signs
                    </h2>

                    <div className="grid grid-cols-2 gap-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Thermometer className="h-3 w-3" /> Temp (°F)
                            </label>
                            <input
                                type="number"
                                value={temp}
                                onChange={e => setTemp(e.target.value)}
                                className="w-full text-2xl font-bold text-slate-900 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-pink-50 focus:border-pink-500 outline-none transition-all"
                                placeholder="98.6"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Heart className="h-3 w-3" /> Pulse (bpm)
                            </label>
                            <input
                                type="number"
                                value={pulse}
                                onChange={e => setPulse(e.target.value)}
                                className="w-full text-2xl font-bold text-slate-900 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-pink-50 focus:border-pink-500 outline-none transition-all"
                                placeholder="72"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Wind className="h-3 w-3" /> SpO2 (%)
                            </label>
                            <input
                                type="number"
                                value={spo2}
                                onChange={e => setSpo2(e.target.value)}
                                className="w-full text-2xl font-bold text-slate-900 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-pink-50 focus:border-pink-500 outline-none transition-all"
                                placeholder="98"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">BP (mm Hg)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={bpSys}
                                    onChange={e => setBpSys(e.target.value)}
                                    className="w-full text-xl font-bold text-slate-900 bg-slate-50 border-2 border-slate-100 rounded-xl p-4 focus:border-pink-500 outline-none"
                                    placeholder="120"
                                />
                                <span className="text-slate-300">/</span>
                                <input
                                    type="number"
                                    value={bpDia}
                                    onChange={e => setBpDia(e.target.value)}
                                    className="w-full text-xl font-bold text-slate-900 bg-slate-50 border-2 border-slate-100 rounded-xl p-4 focus:border-pink-500 outline-none"
                                    placeholder="80"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 mb-4">Nurse Assessment Notes</h2>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full min-h-[100px] p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                    placeholder="Enter any complaints, allergies, or observations..."
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pb-12">
                <button
                    onClick={() => router.back()}
                    className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Save Vitals & Complete Triage
                </button>
            </div>
        </div>
    )
}
