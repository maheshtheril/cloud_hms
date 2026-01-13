'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import {
    Activity, HeartPulse, UserCheck, Syringe,
    ClipboardList, BedDouble, TestTube2, AlertCircle,
    Clock, Search, Filter, ChevronRight
} from "lucide-react"
import { useRouter } from "next/navigation"
import { differenceInYears } from "date-fns"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import NursingVitalsForm from "@/components/nursing/vitals-form"
import { UsageForm } from "./usage-form"

interface NursingActionCenterProps {
    pendingTriage: any[]
    completedTriage?: any[]
    activeAdmissions: any[]
    pendingSamples: any[]
}

export function NursingActionCenter({ pendingTriage, completedTriage = [], activeAdmissions, pendingSamples }: NursingActionCenterProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTask, setSelectedTask] = useState<any>(null)
    const [selectedUsageTask, setSelectedUsageTask] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue')

    const quickActions = [
        {
            title: 'Vitals & Triage',
            icon: HeartPulse,
            color: 'text-pink-600',
            bg: 'bg-pink-50 dark:bg-pink-900/20',
            border: 'border-pink-100 dark:border-pink-800',
            desc: 'Record patient vitals',
            link: '/hms/nursing/vitals'
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

    const displayedTasks = (activeTab === 'queue' ? pendingTriage : completedTriage).filter(task => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            task.patient_name.toLowerCase().includes(q) ||
            (task.patient_id && task.patient_id.toString().toLowerCase().includes(q))
        );
    })

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-6rem)] relative">

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
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-pink-300 transition-colors" onClick={() => setActiveTab('queue')}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">
                                <HeartPulse className="h-6 w-6" />
                            </div>
                            <span className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded-full">{pendingTriage.length}</span>
                        </div>
                        <div className={`text-xs font-medium uppercase tracking-wider ${activeTab === 'queue' ? 'text-pink-600 font-bold' : 'text-slate-500'}`}>Pending Vitals</div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{pendingTriage.length}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => setActiveTab('history')}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                                <UserCheck className="h-6 w-6" />
                            </div>
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">{completedTriage.length}</span>
                        </div>
                        <div className={`text-xs font-medium uppercase tracking-wider ${activeTab === 'history' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>Completed Today</div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{completedTriage.length}</div>
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
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab('queue')}
                                className={`text-sm font-bold flex items-center gap-2 pb-2 border-b-2 transition-all ${activeTab === 'queue' ? 'text-pink-600 border-pink-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
                            >
                                <Clock className="h-4 w-4" />
                                Awaiting Vitals
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`text-sm font-bold flex items-center gap-2 pb-2 border-b-2 transition-all ${activeTab === 'history' ? 'text-emerald-600 border-emerald-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
                            >
                                <UserCheck className="h-4 w-4" />
                                Completed
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 pr-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-pink-100 outline-none w-48"
                                />
                            </div>
                            <div className="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                {displayedTasks.length} Patients
                            </div>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
                        {displayedTasks.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                {activeTab === 'queue' ? (
                                    <>
                                        <UserCheck className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                                        <p>No patients waiting for vitals assessment</p>
                                    </>
                                ) : (
                                    <>
                                        <ClipboardList className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                                        <p>No vitals recorded yet today</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            displayedTasks.map((task) => {
                                const isHighPriority = ['high', 'urgent', 'emergency'].includes(task.priority?.toLowerCase());
                                return (
                                    <div
                                        key={task.id}
                                        className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between cursor-pointer border-l-4 ${activeTab === 'history' ? 'border-emerald-500 bg-emerald-50/5' :
                                            isHighPriority ? 'border-red-500 bg-red-50/10' : 'border-transparent'
                                            }`}
                                        onClick={() => setSelectedTask(task)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold shadow-sm ${task.patient_gender?.toLowerCase() === 'female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {task.patient_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{task.patient_name}</h4>
                                                    {isHighPriority && activeTab === 'queue' && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Urgent</span>}
                                                    {activeTab === 'history' && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded uppercase flex items-center gap-1">Done</span>}
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5 font-medium flex items-center gap-2">
                                                    <span className="capitalize">{task.patient_gender || 'Unknown'}</span>
                                                    <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                                    <span>{task.patient_dob ? differenceInYears(new Date(), new Date(task.patient_dob)) + 'y' : '-'}</span>
                                                    <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                                    <span className="text-slate-400">ID: {task.patient_id || 'N/A'}</span>
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1 truncate max-w-[200px]">
                                                    {task.reason || 'General Visit'} • {task.doctor_name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 text-right">
                                            <div className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(task.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedUsageTask(task);
                                                    }}
                                                    className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-500 hover:bg-orange-100 hover:text-orange-600 transition-colors"
                                                    title="Record Consumables Usage"
                                                >
                                                    <ClipboardList className="h-4 w-4" />
                                                </button>
                                                <div className={`flex items-center gap-1 font-bold text-xs px-3 py-1.5 rounded-full transition-all shadow-sm ${activeTab === 'history' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white'
                                                    }`}>
                                                    {activeTab === 'history' ? 'Edit' : 'Assess'} <ChevronRight className="h-3 w-3" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
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

            {/* Modal for Vitals */}
            <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
                <DialogContent className="max-w-[95vw] h-[95vh] flex flex-col p-0 overflow-hidden bg-slate-50/95 backdrop-blur-xl border-slate-200 focus:outline-none">
                    {/* Sticky Header inside Modal */}
                    <div className="flex items-center gap-4 px-6 py-4 bg-white/50 backdrop-blur-md border-b border-slate-100 flex-none z-10">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold ${selectedTask?.patient_gender?.toLowerCase() === 'female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                            {selectedTask?.patient_name?.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-slate-900">{selectedTask?.patient_name}</h2>
                            <p className="text-sm text-slate-500 flex items-center gap-2 flex-wrap">
                                <span className="capitalize">{selectedTask?.patient_gender}</span>
                                {selectedTask?.patient_dob && (
                                    <>
                                        <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                        <span>{differenceInYears(new Date(), new Date(selectedTask.patient_dob))}Y</span>
                                    </>
                                )}
                                {selectedTask?.patient_blood_group && (
                                    <>
                                        <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                        <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded textxs font-bold ring-1 ring-red-100">{selectedTask.patient_blood_group}</span>
                                    </>
                                )}
                                <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                <span className="text-indigo-600 font-medium">#{selectedTask?.patient_id}</span>
                            </p>
                        </div>
                        {selectedTask?.reason && (
                            <div className="hidden sm:block text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chief Complaint</span>
                                <span className="text-sm font-bold text-slate-700">{selectedTask.reason}</span>
                            </div>
                        )}
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                        {selectedTask && (
                            <NursingVitalsForm
                                patientId={selectedTask.patient_uuid}
                                encounterId={selectedTask.id}
                                tenantId={selectedTask.tenant_id}
                                isModal={true}
                                onCancel={() => setSelectedTask(null)}
                            />
                        )}
                    </div>

                    {/* Fixed Footer */}
                    <div className="p-4 border-t border-slate-200 bg-white/80 backdrop-blur-md flex justify-end gap-3 flex-none z-10">
                        <button
                            onClick={() => setSelectedTask(null)}
                            className="px-6 py-3 rounded-full text-slate-500 font-bold hover:bg-slate-100 transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="nursing-vitals-form"
                            className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-slate-900/20 flex items-center gap-2 hover:bg-black transition-colors"
                        >
                            Save Assessment
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal for Usage */}
            <Dialog open={!!selectedUsageTask} onOpenChange={(open) => !open && setSelectedUsageTask(null)}>
                <DialogContent className="max-w-md p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold">Record Consumption</h2>
                        <p className="text-sm text-slate-500">For {selectedUsageTask?.patient_name}</p>
                    </div>
                    {selectedUsageTask && (
                        <UsageForm
                            patientId={selectedUsageTask.patient_uuid}
                            encounterId={selectedUsageTask.id}
                            patientName={selectedUsageTask.patient_name}
                            isModal={true}
                            onCancel={() => setSelectedUsageTask(null)}
                            onSuccess={() => {
                                setSelectedUsageTask(null)
                                router.refresh()
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

        </div>
    )
}
