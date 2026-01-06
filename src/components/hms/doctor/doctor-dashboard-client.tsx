'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Activity, Stethoscope, Users, Clock, Calendar,
    ChevronRight, Search, Bell, FileText, Pill,
    CheckCircle2, AlertCircle, TrendingUp, User
} from "lucide-react"
import { useRouter } from "next/navigation"
import { differenceInYears } from "date-fns"

interface DoctorDashboardProps {
    doctorName: string
    appointments: any[]
    stats: {
        total: number
        waiting: number
        completed: number
    }
}

export function DoctorDashboardClient({ doctorName, appointments, stats }: DoctorDashboardProps) {
    const router = useRouter()
    const [selectedTab, setSelectedTab] = useState<'queue' | 'history'>('queue')

    // Filter appointments based on tab
    const queue = appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled')
    const history = appointments.filter(a => a.status === 'completed')

    const displayedAppointments = selectedTab === 'queue' ? queue : history

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* HEADER SECTION */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight"
                        >
                            Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{doctorName}</span>
                        </motion.h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Bell className="h-6 w-6 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" />
                            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-slate-50" />
                        </div>
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                            {doctorName.split('Dr. ')[1]?.charAt(0) || 'D'}
                        </div>
                    </div>
                </header>

                {/* STATS GRID */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <motion.div variants={item} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users className="h-24 w-24 text-blue-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.total}</h3>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Total Appointments</p>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Clock className="h-24 w-24 text-orange-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
                                <Clock className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.waiting}</h3>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Waiting Now</p>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <CheckCircle2 className="h-24 w-24 text-emerald-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.completed}</h3>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Completed</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* MAIN CONTENT AREA */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Patient Queue */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Stethoscope className="h-5 w-5 text-blue-500" />
                                Patient Queue
                            </h2>
                            <div className="bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex">
                                <button
                                    onClick={() => setSelectedTab('queue')}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${selectedTab === 'queue' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Waiting
                                </button>
                                <button
                                    onClick={() => setSelectedTab('history')}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${selectedTab === 'history' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Finished
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {displayedAppointments.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="bg-white/40 dark:bg-slate-900/40 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200"
                                    >
                                        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                            <Users className="h-8 w-8 text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 font-medium">No appointments found in this list.</p>
                                    </motion.div>
                                ) : (
                                    displayedAppointments.map((apt, index) => (
                                        <motion.div
                                            key={apt.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all group relative overflow-hidden"
                                        >
                                            {/* Status indicator bar */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${apt.status === 'in_progress' ? 'bg-blue-500' :
                                                apt.vitals_done ? 'bg-emerald-500' : 'bg-slate-200'
                                                }`} />

                                            <div className="flex flex-col md:flex-row md:items-center gap-6 pl-4">

                                                {/* Time & Avatar */}
                                                <div className="flex items-center gap-4 min-w-[180px]">
                                                    <div className="text-right">
                                                        <p className="text-lg font-black text-slate-900 dark:text-white">
                                                            {new Date(apt.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        <p className="text-xs font-bold text-slate-400 capitalize">{apt.status === 'confirmed' ? 'Scheduled' : apt.status.replace('_', ' ')}</p>
                                                    </div>
                                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-bold ${apt.patient_gender === 'Female' ? 'bg-pink-50 text-pink-600' : 'bg-indigo-50 text-indigo-600'
                                                        }`}>
                                                        {apt.patient_name.charAt(0)}
                                                    </div>
                                                </div>

                                                {/* Patient Details */}
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                        {apt.patient_name}
                                                        {apt.vitals_done && (
                                                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                                                                <Activity className="h-3 w-3" /> Vitals Ready
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-3">
                                                        <span>{apt.patient_gender}, {apt.patient_age}Y</span>
                                                        <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                                        <span className="text-slate-400">ID: #{apt.patient_id}</span>
                                                        {apt.blood_group && (
                                                            <>
                                                                <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                                                <span className="text-red-500 font-bold bg-red-50 px-1 rounded">{apt.blood_group}</span>
                                                            </>
                                                        )}
                                                    </p>
                                                    {apt.reason && (
                                                        <div className="mt-2 text-xs font-medium text-slate-600 bg-slate-50 inline-block px-2 py-1 rounded border border-slate-100">
                                                            Reason: {apt.reason}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => router.push(`/hms/prescriptions/new?appointmentId=${apt.id}&patientId=${apt.patient_uuid}`)}
                                                        className="h-10 px-6 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                                    >
                                                        <Stethoscope className="h-4 w-4" />
                                                        Consult
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Quick Info */}
                    <div className="space-y-6">
                        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-sm">
                            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-indigo-500" />
                                Daily Insights
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100">
                                    <span className="text-sm font-medium text-slate-500">Avg. Consult Time</span>
                                    <span className="font-black text-slate-900">12m</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100">
                                    <span className="text-sm font-medium text-slate-500">Patient Satisfaction</span>
                                    <span className="font-black text-slate-900 text-emerald-600">4.9/5</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Pill className="h-32 w-32 rotate-12" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 relative z-10">Drug Database</h3>
                            <p className="text-indigo-100 text-sm mb-6 relative z-10">Search interactions and dosages.</p>
                            <button className="w-full py-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl font-bold hover:bg-white hover:text-indigo-600 transition-colors relative z-10 flex items-center justify-center gap-2">
                                <Search className="h-4 w-4" /> Search Formulary
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
