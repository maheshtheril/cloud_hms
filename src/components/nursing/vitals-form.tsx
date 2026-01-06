'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Activity, Thermometer, Heart, Wind, PersonStanding,
    Weight, Ruler, Save, Loader2, Calculator, Info,
    X
} from "lucide-react"
import { saveVitals, getVitals } from "@/app/actions/nursing-v2"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
    patientId: string
    encounterId: string
    tenantId: string
    initialData?: any
    onCancel?: () => void
    isModal?: boolean
}

export default function NursingVitalsForm({ patientId, encounterId, tenantId, initialData, onCancel, isModal }: Props) {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(!initialData)

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

    // Fetch if needed
    useEffect(() => {
        if (!initialData) {
            const fetchExisting = async () => {
                const data = await getVitals(encounterId)
                if (data) {
                    setHeight(data.height?.toString() || '')
                    setWeight(data.weight?.toString() || '')
                    setTemp(data.temperature?.toString() || '')
                    setPulse(data.pulse?.toString() || '')
                    setBpSys(data.systolic?.toString() || '')
                    setBpDia(data.diastolic?.toString() || '')
                    setSpo2(data.spo2?.toString() || '')
                    setResp(data.respiration?.toString() || '')
                    setNotes(data.notes || '')
                }
                setFetching(false)
            }
            fetchExisting()
        }
    }, [encounterId, initialData])

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

    // MAP Calc
    useEffect(() => {
        if (bpSys && bpDia) {
            const s = parseInt(bpSys)
            const d = parseInt(bpDia)
            if (!isNaN(s) && !isNaN(d)) {
                const m = d + (s - d) / 3
                setMap(Math.round(m).toString())
            } else {
                setMap('')
            }
        }
    }, [bpSys, bpDia])


    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
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
                    title: "Assessment Saved",
                    description: "Vitals recorded successfully.",
                    className: "bg-green-600 text-white border-none"
                })
                if (onCancel) onCancel() // Close modal if in modal
                else router.back()
                router.refresh()
            } else {
                toast({
                    title: "Error",
                    description: res.error,
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save vitals",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }
    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <form id="nursing-vitals-form" onSubmit={handleSubmit}>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className={`grid grid-cols-1 md:grid-cols-12 gap-6 ${isModal ? '' : 'pb-24'}`}
            >
                {/* ANTHROPOMETRY SECTION */}
                <motion.div variants={item} className="md:col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-white/60 shadow-xl shadow-slate-200/50 h-full relative overflow-hidden group">
                        {/* Gradient BG */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 to-purple-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <Ruler className="h-4 w-4" /> Body Metrics
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 ring-1 ring-slate-200/50 focus-within:ring-indigo-500 transition-all">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Height (cm)</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={e => setHeight(e.target.value)}
                                        className="w-full text-2xl font-black text-slate-900 outline-none bg-transparent placeholder-slate-200"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 ring-1 ring-slate-200/50 focus-within:ring-indigo-500 transition-all">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={e => setWeight(e.target.value)}
                                        className="w-full text-2xl font-black text-slate-900 outline-none bg-transparent placeholder-slate-200"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* BMI Widget */}
                            <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg shadow-slate-900/10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
                                <div className="flex justify-between items-end relative z-10">
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">BMI Score</p>
                                        <p className="text-4xl font-black tracking-tight">{bmi || '--.-'}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${bmiStatus === 'Normal' ? 'bg-green-500/20 text-green-300' :
                                        bmiStatus === 'Overweight' ? 'bg-orange-500/20 text-orange-300' :
                                            bmiStatus === 'Obese' ? 'bg-red-500/20 text-red-300' : 'bg-slate-800 text-slate-500'
                                        }`}>
                                        {bmiStatus || 'Waiting'}
                                    </div>
                                </div>
                                {/* Visual Bar */}
                                <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-blue-500 w-[18.5%]" />
                                    <div className="h-full bg-green-500 w-[24.9%]" />
                                    <div className="h-full bg-orange-500 w-[15%]" />
                                    <div className="h-full bg-red-500 flex-1" />
                                </div>
                                {bmi && (
                                    <div className="w-1 h-3 bg-white absolute bottom-[26px] transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                                        style={{ left: `${Math.min(Math.max((parseFloat(bmi) / 40) * 100, 0), 100)}%` }} />
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* VITALS GRID */}
                <motion.div variants={item} className="md:col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">

                    {/* Heart Rate */}
                    <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-xl shadow-red-100/20 hover:shadow-red-200/40 transition-shadow">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2"><Heart className="h-4 w-4 text-rose-500/80 animate-pulse" /> Heart Rate</span>
                            <span className="text-[10px] text-slate-400">Normal: 60-100</span>
                        </h4>
                        <div className="flex items-baseline gap-2">
                            <input
                                type="number"
                                value={pulse}
                                onChange={e => setPulse(e.target.value)}
                                className="w-full text-5xl font-black text-slate-900 outline-none bg-transparent placeholder-slate-200"
                                placeholder="--"
                            />
                            <span className="text-sm font-bold text-slate-400">bpm</span>
                        </div>
                    </div>

                    {/* SpO2 */}
                    <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-xl shadow-cyan-100/20 hover:shadow-cyan-200/40 transition-shadow">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2"><Wind className="h-4 w-4 text-cyan-500/80" /> SpO2</span>
                            <span className="text-[10px] text-slate-400">Normal: 95-100%</span>
                        </h4>
                        <div className="flex items-baseline gap-2">
                            <input
                                type="number"
                                value={spo2}
                                onChange={e => setSpo2(e.target.value)}
                                className="w-full text-5xl font-black text-slate-900 outline-none bg-transparent placeholder-slate-200"
                                placeholder="--"
                            />
                            <span className="text-sm font-bold text-slate-400">%</span>
                        </div>
                    </div>

                    {/* Blood Pressure */}
                    <div className="sm:col-span-2 bg-gradient-to-br from-indigo-50/50 to-white/50 rounded-3xl p-6 border border-white/60 shadow-xl shadow-indigo-100/20">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="h-4 w-4" /> Blood Pressure
                            </h4>
                            {map && <span className="text-xs font-bold text-indigo-600 bg-white/50 px-2 py-1 rounded-lg border border-indigo-100">MAP: {map}</span>}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200/50 focus-within:ring-indigo-500">
                                <div className="flex justify-between">
                                    <label className="text-[10px] font-bold text-indigo-300 uppercase">Systolic</label>
                                    <span className="text-[10px] text-indigo-200">90-120</span>
                                </div>
                                <input
                                    type="number"
                                    value={bpSys}
                                    onChange={e => setBpSys(e.target.value)}
                                    className="w-full text-4xl font-black text-indigo-900 outline-none bg-transparent placeholder-indigo-100"
                                    placeholder="120"
                                />
                            </div>
                            <span className="text-2xl font-black text-indigo-200">/</span>
                            <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200/50 focus-within:ring-indigo-500">
                                <div className="flex justify-between">
                                    <label className="text-[10px] font-bold text-indigo-300 uppercase">Diastolic</label>
                                    <span className="text-[10px] text-indigo-200">60-80</span>
                                </div>
                                <input
                                    type="number"
                                    value={bpDia}
                                    onChange={e => setBpDia(e.target.value)}
                                    className="w-full text-4xl font-black text-indigo-900 outline-none bg-transparent placeholder-indigo-100"
                                    placeholder="80"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Temperature */}
                    <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-xl shadow-orange-100/20 hover:shadow-orange-200/40 transition-shadow">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2"><Thermometer className="h-4 w-4 text-orange-500" /> Temp</span>
                            <span className="text-[10px] text-slate-400">Normal: 97-99</span>
                        </h4>
                        <div className="flex items-baseline gap-2">
                            <input
                                type="number"
                                value={temp}
                                onChange={e => setTemp(e.target.value)}
                                className="w-full text-5xl font-black text-slate-900 outline-none bg-transparent placeholder-slate-200"
                                placeholder="--"
                            />
                            <span className="text-sm font-bold text-slate-400">°F</span>
                        </div>
                    </div>

                    {/* Respiration */}
                    <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-xl shadow-teal-100/20 hover:shadow-teal-200/40 transition-shadow">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2"><Activity className="h-4 w-4 text-teal-500" /> Respiration</span>
                            <span className="text-[10px] text-slate-400">Normal: 12-20</span>
                        </h4>
                        <div className="flex items-baseline gap-2">
                            <input
                                type="number"
                                value={resp}
                                onChange={e => setResp(e.target.value)}
                                className="w-full text-5xl font-black text-slate-900 outline-none bg-transparent placeholder-slate-200"
                                placeholder="--"
                            />
                            <span className="text-sm font-bold text-slate-400">bpm</span>
                        </div>
                    </div>

                </motion.div>

                {/* NOTES */}
                <motion.div variants={item} className="md:col-span-12 space-y-6">
                    <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 block">Observations & Notes</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="w-full min-h-[100px] bg-white/50 border border-slate-200 rounded-2xl p-4 text-lg font-medium outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-sans"
                            placeholder="Clinical notes..."
                        />
                    </div>
                </motion.div>

                {/* ACTION BAR - Floating if NOT modal, Inline if Modal?
                Actually nice floating bar works well in Modal too if using relative positioning or if modal is large enough.
                Let's use Sticky Bottom if in modal, or Fixed Bottom if page.
            */}
                {isModal ? null : (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className="fixed bottom-0 left-0 w-full p-4 flex justify-center z-50 pointer-events-none"
                    >
                        <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full p-2 flex items-center gap-2 pointer-events-auto transform hover:scale-[1.02] transition-transform">
                            <button
                                type="button"
                                onClick={() => onCancel ? onCancel() : router.back()}
                                className="px-6 py-3 rounded-full text-slate-500 font-bold hover:bg-slate-100 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <div className="w-px h-6 bg-slate-200" />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-slate-900/20 flex items-center gap-2 hover:bg-black disabled:opacity-50 transition-colors"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Assessment
                            </button>
                        </div>
                    </motion.div>
                )}

            </motion.div>
        </form>
    )
}
