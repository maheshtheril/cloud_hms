'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Activity, FlaskConical, Users, Clock, Calendar,
    ChevronRight, Search, Bell, FileText, CheckCircle2,
    AlertCircle, TrendingUp, TestTube2, Microscope,
    ArrowRight, Check, Loader2
} from "lucide-react"
import { useRouter } from "next/navigation"
import { updateLabOrderStatus, updateLabOrderReport } from "@/app/actions/lab"

interface LabDashboardProps {
    labStaffName: string
    orders: any[]
    stats: {
        total: number
        pending: number
        completed: number
    }
}

export function LabDashboardClient({ labStaffName, orders, stats }: LabDashboardProps) {
    const router = useRouter()
    const [selectedTab, setSelectedTab] = useState<'pending' | 'completed'>('pending')
    const [searchQuery, setSearchQuery] = useState('')

    // Filter logic
    const pendingOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled')
    const completedOrders = orders.filter(o => o.status === 'completed')

    const displayedOrders = (selectedTab === 'pending' ? pendingOrders : completedOrders).filter(o =>
        o.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.order_number?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    }

    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    const handleStatusUpdate = async () => {
        if (!selectedOrder) return

        const currentStatus = selectedOrder.status
        let nextStatus = ''

        if (currentStatus === 'requested') nextStatus = 'collected'
        else if (currentStatus === 'collected') nextStatus = 'in_progress'
        else if (currentStatus === 'in_progress') nextStatus = 'completed'
        else return

        setIsUpdating(true)
        try {
            const res = await updateLabOrderStatus({
                orderId: selectedOrder.id,
                status: nextStatus as any
            })

            if (res.success) {
                // Determine if we should close the modal or just update local state
                // For better UX, let's update local state so user sees the progress, then close if completed?
                // Or just close. Let's close for now as the list will refresh.
                setSelectedOrder(null)
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsUpdating(false)
        }
    }

    // Status Steps Definition
    const steps = [
        { id: 'requested', label: 'Requested' },
        { id: 'collected', label: 'Collected' },
        { id: 'in_progress', label: 'In Progress' },
        { id: 'completed', label: 'Completed' },
    ]

    const getCurrentStepIndex = (status: string) => steps.findIndex(s => s.id === status)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight"
                        >
                            Lab Dashboard <span className="text-xl font-medium text-slate-400 block sm:inline sm:ml-2">| {labStaffName}</span>
                        </motion.h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by Patient or Order ID..."
                                className="pl-9 pr-4 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-violet-100 outline-none w-full sm:w-80 shadow-sm"
                            />
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
                            <TestTube2 className="h-24 w-24 text-violet-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="h-12 w-12 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center text-violet-600 mb-4">
                                <Activity className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.total}</h3>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Total Orders Today</p>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Clock className="h-24 w-24 text-amber-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
                                <Microscope className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.pending}</h3>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Pending / Processing</p>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <CheckCircle2 className="h-24 w-24 text-emerald-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                                <FileText className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.completed}</h3>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Results Released</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* MAIN CONTENT AREA */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <FlaskConical className="h-5 w-5 text-violet-500" />
                            Worklist
                        </h2>

                        <div className="bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex">
                            <button
                                onClick={() => setSelectedTab('pending')}
                                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${selectedTab === 'pending' ? 'bg-violet-50 text-violet-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Queue
                            </button>
                            <button
                                onClick={() => setSelectedTab('completed')}
                                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${selectedTab === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                History
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {displayedOrders.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="bg-white/40 dark:bg-slate-900/40 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200"
                                >
                                    <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <TestTube2 className="h-8 w-8 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 font-medium">No lab orders found.</p>
                                </motion.div>
                            ) : (
                                displayedOrders.map((order, index) => (
                                    <motion.div
                                        key={order.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-violet-200 transition-all group relative overflow-hidden"
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-2 ${order.status === 'completed' ? 'bg-emerald-500' :
                                            order.status === 'in_progress' ? 'bg-amber-500' : 'bg-slate-200'
                                            }`} />

                                        <div className="flex flex-col lg:flex-row lg:items-center gap-6 pl-4">

                                            {/* Order Time & Patient Avatar */}
                                            <div className="flex items-center gap-6 min-w-[200px]">
                                                <div className="text-center min-w-[60px]">
                                                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                                                        {new Date(order.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).split(' ')[0]}
                                                    </p>
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                                        {new Date(order.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).split(' ')[1]}
                                                    </p>
                                                </div>
                                                <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-black shadow-inner">
                                                    {order.patient_name.charAt(0)}
                                                </div>
                                            </div>

                                            {/* Main Details */}
                                            <div className="flex-1 space-y-3">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                        {order.patient_name}
                                                    </h3>
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] bg-slate-100 text-slate-500 font-bold border border-slate-200 uppercase tracking-wider">
                                                        #{order.order_number || 'N/A'}
                                                    </span>
                                                    {order.priority === 'urgent' && (
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] bg-red-100 text-red-700 font-bold border border-red-200 uppercase tracking-wider animate-pulse">
                                                            URGENT
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {order.tests.map((test: any, tIdx: number) => (
                                                        <span key={tIdx} className="px-3 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs font-bold border border-violet-100">
                                                            {test.test_name}
                                                        </span>
                                                    ))}
                                                    {order.tests.length === 0 && <span className="text-slate-400 italic text-sm">No specific tests listed</span>}
                                                </div>

                                                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" /> Dr. {order.doctor_name || 'Unknown'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-3 mt-4 lg:mt-0 lg:ml-auto">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="h-12 px-8 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-xl shadow-violet-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 w-full lg:w-auto justify-center"
                                                >
                                                    {order.status === 'requested' ? 'Collect Sample' : 'Enter Results'}
                                                    <ArrowRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Modal for Lab Order Details */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setSelectedOrder(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-800 flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                                <div>
                                    <h3 className="text-xl font-black">Order #{selectedOrder.order_number}</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                        {new Date(selectedOrder.time).toLocaleString()}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <AlertCircle className="h-6 w-6 rotate-45 text-slate-400" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                                {/* Status Stepper */}
                                <div className="relative">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 rounded-full" />
                                    <div
                                        className="absolute top-1/2 left-0 h-1 bg-violet-600 -translate-y-1/2 rounded-full transition-all duration-500"
                                        style={{ width: `${(getCurrentStepIndex(selectedOrder.status) / (steps.length - 1)) * 100}%` }}
                                    />
                                    <div className="relative flex justify-between">
                                        {steps.map((step, idx) => {
                                            const isCompleted = idx <= getCurrentStepIndex(selectedOrder.status)
                                            const isCurrent = idx === getCurrentStepIndex(selectedOrder.status)
                                            return (
                                                <div key={step.id} className="flex flex-col items-center gap-2">
                                                    <div className={`
                                                        w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10
                                                        ${isCompleted
                                                            ? 'bg-violet-600 border-violet-600 text-white'
                                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                                                        }
                                                        ${isCurrent ? 'ring-4 ring-violet-100 dark:ring-violet-900/30 scale-110' : ''}
                                                    `}>
                                                        {isCompleted ? <Check className="h-4 w-4" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                                                    </div>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isCurrent ? 'text-violet-600' : 'text-slate-400'}`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Patient Bio */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-xl font-black text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700">
                                            {selectedOrder.patient_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedOrder.patient_name}</p>
                                        </div>
                                    </div>
                                    <div className="w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prescribed By</p>
                                        <p className="text-base font-bold text-slate-900 dark:text-white">Dr. {selectedOrder.doctor_name}</p>
                                    </div>
                                </div>

                                {/* Tests List */}
                                <div>
                                    <h4 className="font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                        <TestTube2 className="h-5 w-5 text-violet-500" />
                                        Requested Analysis
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedOrder.tests.map((test: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-violet-200 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-violet-500" />
                                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{test.test_name}</span>
                                                </div>
                                                <span className={`
                                                    text-[10px] font-bold px-2 py-1 rounded-lg border uppercase tracking-wider
                                                    ${test.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        (test.status === 'in_progress' || test.status === 'processing') ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                            'bg-slate-50 text-slate-500 border-slate-100'}
                                                `}>
                                                    {test.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex gap-3 shrink-0">
                                {selectedOrder.status !== 'completed' ? (
                                    <button
                                        onClick={handleStatusUpdate}
                                        disabled={isUpdating}
                                        className="flex-1 py-3.5 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-600/20 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                {selectedOrder.status === 'requested' && 'Mark Sample Collected'}
                                                {selectedOrder.status === 'collected' && 'Start Processing'}
                                                {selectedOrder.status === 'in_progress' && 'Release Results'}
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button disabled className="flex-1 py-3.5 bg-emerald-600/10 text-emerald-600 border border-emerald-200 rounded-xl font-bold cursor-default flex items-center justify-center gap-2">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Order Completed
                                    </button>
                                )}

                                <button className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    Print Label
                                </button>
                            </div>

                            {/* Report Upload Section */}
                            {(selectedOrder.status === 'in_progress' || selectedOrder.status === 'completed') && (
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-700">
                                    <h4 className="font-bold mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
                                        <FileText className="h-4 w-4" /> Lab Report
                                    </h4>
                                    {selectedOrder.report_url ? (
                                        <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                Report Attached
                                            </div>
                                            <a
                                                href={selectedOrder.report_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs font-bold text-violet-600 hover:underline"
                                            >
                                                View Report
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <p className="text-xs text-slate-500">
                                                Attach the final lab report.
                                            </p>
                                            <form action={async (formData) => {
                                                const url = formData.get('reportUrl') as string
                                                if (!url) return

                                                // Basic validation
                                                try {
                                                    new URL(url)
                                                } catch {
                                                    alert("Please enter a valid URL")
                                                    return
                                                }

                                                // Calls the server action
                                                const res = await updateLabOrderReport({ orderId: selectedOrder.id, reportUrl: url })
                                                if (res.success) {
                                                    setSelectedOrder(null)
                                                    router.refresh()
                                                } else {
                                                    alert("Failed to upload report")
                                                }
                                            }} className="flex gap-2">
                                                <input
                                                    type="url"
                                                    name="reportUrl"
                                                    placeholder="Paste report URL (e.g. Google Drive link)..."
                                                    required
                                                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 outline-none w-full"
                                                />
                                                <button type="submit" className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors shrink-0">
                                                    Attach Link
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                        </motion.div>
        </div>
    )
}
            </AnimatePresence >
        </div >
    )
}
