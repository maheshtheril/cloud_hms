'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import {
    Activity, HeartPulse, UserCheck, Syringe,
    ClipboardList, BedDouble, TestTube2, AlertCircle,
    Clock, Search, Filter, ChevronRight
} from "lucide-react"
import { useRouter } from "next/navigation"

interface NursingActionCenterProps {
    pendingTriage: any[]
    activeAdmissions: any[]
    pendingSamples: any[]
}

export function NursingActionCenter({ pendingTriage, activeAdmissions, pendingSamples }: NursingActionCenterProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const quickActions = [
        {
            title: 'Vitals & Triage',
            icon: HeartPulse,
            color: 'text-pink-600',
            bg: 'bg-pink-50 dark:bg-pink-900/20',
            border: 'border-pink-100 dark:border-pink-800',
            desc: 'Record patient vitals',
            link: '/hms/nursing/vitals' // or specific page
        },
        {
            title: 'Medication',
            icon: Syringe,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-100 dark:border-blue-800',
            desc: 'Administer due meds',
            link: '/hms/nursing/medications'
        },
        {
            title: 'Sample Collection',
            icon: TestTube2,
            color: 'text-violet-600',
            bg: 'bg-violet-50 dark:bg-violet-900/20',
            border: 'border-violet-100 dark:border-violet-800',
            desc: 'Collect lab samples',
            link: '/hms/labs/collection'
        },
        {
            title: 'IPD Rounds',
            icon: BedDouble,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            border: 'border-emerald-100 dark:border-emerald-800',
            desc: 'Monitor admitted patients',
            link: '/hms/nursing/wards'
        }
    ]

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-6rem)]">

            {/* Left Column: Tasks & Queue */}
            <div className="flex-1 space-y-6">

                {/* Header Section */}
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Activity className="h-6 w-6 text-pink-500" />
                        Nursing Station
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage patient care, vitals, and ward duties
                    </p>
                </div>

                {/* Queue Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">
                                <HeartPulse className="h-6 w-6" />
                            </div>
                            <span className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded-full">{pendingTriage.length}</span>
                        </div>
                        <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Pending Vitals</div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{pendingTriage.length}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                                <BedDouble className="h-6 w-6" />
                            </div>
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">{activeAdmissions.length}</span>
                        </div>
                        <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Active Inpatients</div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activeAdmissions.length}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="h-10 w-10 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600">
                                <TestTube2 className="h-6 w-6" />
                            </div>
                            <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2 py-1 rounded-full">{pendingSamples.length}</span>
                        </div>
                        <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Sample Tasks</div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{pendingSamples.length}</div>
                    </div>
                </div>

                {/* Priority Queue (Triage) */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Clock className="h-5 w-5 text-slate-400" />
                            Awaiting Vitals / Triage
                        </h3>
                        <div className="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            Today's Queue
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[400px] overflow-y-auto">
                        {pendingTriage.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <UserCheck className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                                <p>No patients waiting for vitals assessment</p>
                            </div>
                        ) : (
                            pendingTriage.map((task) => (
                                <div key={task.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between cursor-pointer" onClick={() => router.push(`/hms/nursing/vitals/${task.id}`)}>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                            {task.patient_name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{task.patient_name}</h4>
                                            <p className="text-xs text-slate-500">
                                                {new Date(task.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {task.doctor_name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-xs font-medium bg-pink-50 text-pink-600 px-2 py-1 rounded border border-pink-100">
                                            Assess
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-400" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* Right Column: Quick Actions & Alerts */}
            <div className="w-full lg:w-80 space-y-6">
                {/* Quick Actions */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <ClipboardList className="h-5 w-5 text-slate-500" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        {quickActions.map((action) => (
                            <motion.button
                                key={action.title}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router.push(action.link)}
                                className={`flex items-start gap-3 p-4 rounded-xl border text-left bg-white dark:bg-slate-900 shadow-sm group hover:shadow-md transition-all ${action.border}`}
                            >
                                <div className={`p-2 rounded-lg ${action.bg} ${action.color}`}>
                                    <action.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {action.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium leading-relaxed">
                                        {action.desc}
                                    </p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Notifications / Alerts Placeholder */}
                <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-100 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-sm text-amber-800 dark:text-amber-200">Shift Reminder</h4>
                            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                Handover notes required for Ward 2A by 2:00 PM.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
