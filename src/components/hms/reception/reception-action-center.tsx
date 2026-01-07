'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    UserPlus, CalendarPlus, LogIn, CreditCard,
    PhoneIncoming, IdCard, Users, Search,
    Clock, Stethoscope, ChevronRight, Filter, ChevronDown, CheckCircle, Smartphone, MoreVertical, Edit, Activity, IndianRupee,
    Wallet
} from "lucide-react"
import { ExpenseDialog } from "./expense-dialog"
import { PettyCashVoucher } from "./petty-cash-voucher"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from "@/components/ui/dropdown-menu"
import { CreatePatientForm } from "@/components/hms/create-patient-form"
import { AppointmentForm } from "@/components/appointments/appointment-form"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateAppointmentStatus } from "@/app/actions/appointment"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface ReceptionActionCenterProps {
    todayAppointments: any[]
    patients: any[]
    doctors: any[]
    dailyCollection: number
    collectionBreakdown: Record<string, number>
    todayPayments?: any[]
    todayExpenses?: any[]
    totalExpenses?: number
}

export function ReceptionActionCenter({ todayAppointments, patients, doctors, dailyCollection = 0, collectionBreakdown = {}, todayPayments = [], todayExpenses = [], totalExpenses = 0 }: ReceptionActionCenterProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [activeModal, setActiveModal] = useState<string | null>(null)
    const [editingAppointment, setEditingAppointment] = useState<any>(null)
    const [selectedDoctor, setSelectedDoctor] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [statusLoading, setStatusLoading] = useState<string | null>(null)
    const [viewingPayment, setViewingPayment] = useState<any>(null)

    const handleAction = (actionId: string) => {
        if (actionId === 'register') {
            router.push('/hms/patients/new')
            return
        }
        setActiveModal(actionId as any)
    }

    const handleEditClick = (apt: any) => {
        setEditingAppointment(apt)
        setActiveModal('edit-appointment')
    }

    // Filter Logic
    const filteredAppointments = todayAppointments.filter(apt => {
        const matchesDoctor = selectedDoctor === 'all' || apt.clinician?.id === selectedDoctor
        const matchesSearch = searchQuery === '' ||
            `${apt.patient?.first_name} ${apt.patient?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.patient?.patient_number?.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesDoctor && matchesSearch
    })

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setStatusLoading(id)
        const result = await updateAppointmentStatus(id, newStatus)
        setStatusLoading(null)

        if (result.success) {
            toast({ title: "Status Updated", description: `Appointment marked as ${newStatus}` })
            router.refresh()
        } else {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" })
        }
    }

    const actions = [
        {
            id: 'register',
            title: 'New Patient',
            icon: UserPlus,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            border: 'border-emerald-100 dark:border-emerald-800',
            desc: 'Register new patient details & demographics'
        },
        {
            id: 'appointment',
            title: 'Book Visiting',
            icon: CalendarPlus,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-100 dark:border-blue-800',
            desc: 'Schedule doctor consultation'
        },
        {
            id: 'checkin',
            title: 'Patient Arrival',
            icon: LogIn,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            border: 'border-indigo-100 dark:border-indigo-800',
            desc: 'Mark patient as arrived & generate token'
        },
        {
            id: 'billing',
            title: 'Quick Billing',
            icon: CreditCard,
            color: 'text-violet-600',
            bg: 'bg-violet-50 dark:bg-violet-900/20',
            border: 'border-violet-100 dark:border-violet-800',
            desc: 'Collect fees & issue receipts'
        },
        {
            id: 'inquiry',
            title: 'Call Inquiry',
            icon: PhoneIncoming,
            color: 'text-orange-600',
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            border: 'border-orange-100 dark:border-orange-800',
            desc: 'Log incoming calls & queries'
        },
        {
            id: 'visitor',
            title: 'Gate Pass',
            icon: IdCard,
            color: 'text-rose-600',
            bg: 'bg-rose-50 dark:bg-rose-900/20',
            border: 'border-rose-100 dark:border-rose-800',
            desc: 'Issue visitor passes for IPD'
        },
        {
            id: 'expense',
            title: 'Petty Cash',
            icon: Wallet,
            color: 'text-rose-600',
            bg: 'bg-rose-50 dark:bg-rose-900/20',
            border: 'border-rose-100 dark:border-rose-800',
            desc: 'Record cash payouts / expenses'
        }
    ]

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-6rem)]">

            {/* Main Focus: Today's Schedule (Left Column) */}
            <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                            <Clock className="h-6 w-6 text-indigo-500" />
                            Today's Schedule
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Manage patient flow and arrivals
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search patient..."
                                className="pl-9 w-[200px] h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                            <SelectTrigger className="w-[180px] h-10">
                                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                                <SelectValue placeholder="Filter by Doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Doctors</SelectItem>
                                {doctors.map(doc => (
                                    <SelectItem key={doc.id} value={doc.id}>
                                        Dr. {doc.first_name} {doc.last_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex-1 h-full min-h-[500px]">
                    <div className="p-0 h-full flex flex-col">
                        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50/80 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                            <div className="col-span-2">Time</div>
                            <div className="col-span-4">Patient Details</div>
                            <div className="col-span-3">Doctor</div>
                            <div className="col-span-3 text-right">Status / Action</div>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto custom-scrollbar flex-1">
                            {filteredAppointments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <Clock className="h-12 w-12 mb-4 text-slate-200 dark:text-slate-800" />
                                    <p className="text-lg font-medium">No appointments found</p>
                                    <p className="text-sm">Try adjusting your filters</p>
                                </div>
                            ) : (
                                filteredAppointments.map((apt) => (
                                    <div key={apt.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors items-center group">
                                        {/* Time */}
                                        <div className="col-span-2">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                                                {new Date(apt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {apt.type || 'Consultation'}
                                            </div>
                                        </div>

                                        {/* Patient */}
                                        <div className="col-span-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                                    {apt.patient?.first_name?.[0]}{apt.patient?.last_name?.[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                                        {apt.patient?.first_name} {apt.patient?.last_name}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <span>{apt.patient?.patient_number}</span>
                                                        {apt.patient?.contact?.mobile && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="flex items-center gap-0.5">
                                                                    <Smartphone className="h-3 w-3" /> {apt.patient.contact.mobile}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Doctor */}
                                        <div className="col-span-3">
                                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
                                                Dr. {apt.clinician?.first_name} {apt.clinician?.last_name}
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="col-span-3 flex items-center justify-end gap-2">
                                            <div className="flex items-center gap-2">
                                                {apt.status === 'scheduled' || apt.status === 'confirmed' ? (
                                                    <Button
                                                        size="sm"
                                                        className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
                                                        disabled={statusLoading === apt.id}
                                                        onClick={() => handleStatusUpdate(apt.id, 'arrived')}
                                                    >
                                                        {statusLoading === apt.id ? 'Saving...' : 'Mark Arrived'}
                                                    </Button>
                                                ) : <Badge variant="outline" className={`
                                                ${apt.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        apt.status === 'arrived' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                            apt.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                'bg-slate-100 text-slate-600'} 
                                                capitalize px-2 py-0.5
                                            `}>
                                                    {apt.status}
                                                </Badge>}

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditClick(apt)}>
                                                            <Edit className="h-4 w-4 mr-2" /> Edit Details
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger>
                                                                <Activity className="h-4 w-4 mr-2" /> Change Status
                                                            </DropdownMenuSubTrigger>
                                                            <DropdownMenuPortal>
                                                                <DropdownMenuSubContent>
                                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(apt.id, 'scheduled')}>
                                                                        Scheduled
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(apt.id, 'arrived')}>
                                                                        Arrived
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(apt.id, 'confirmed')}>
                                                                        Confirmed
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(apt.id, 'in_progress')}>
                                                                        In Progress
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(apt.id, 'completed')}>
                                                                        Completed
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(apt.id, 'cancelled')} className="text-red-600 focus:text-red-600">
                                                                        Cancelled
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(apt.id, 'no_show')} className="text-orange-600 focus:text-orange-600">
                                                                        No Show
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuPortal>
                                                        </DropdownMenuSub>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </Card>
            </div>


            {/* Right Column: Actions & Stats */}
            <div className="w-full lg:w-80 xl:w-96 space-y-6 flex-shrink-0">

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    {actions.map((action) => (
                        <motion.button
                            key={action.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAction(action.id)}
                            className={`text-left p-4 rounded-xl border ${action.border} ${action.bg} shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-32`}
                        >
                            <div className={`p-2 w-fit rounded-lg bg-white dark:bg-slate-900 shadow-sm ${action.color}`}>
                                <action.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                    {action.title}
                                </h3>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Queue Summary / Stats */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Users className="h-5 w-5 text-slate-500" />
                        Queue Snapshot
                    </h2>
                    <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                            <div className="text-indigo-100 text-xs font-medium uppercase tracking-wider mb-1">Total Checked In</div>
                            <div className="flex items-end justify-between">
                                <div className="text-3xl font-black">{todayAppointments.filter(a => a.status === 'arrived').length}</div>
                                <div className="text-xs bg-white/20 px-2 py-1 rounded">Patients</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <div className="text-slate-500 text-xs font-medium mb-1">Scheduled</div>
                                <div className="text-xl font-black text-slate-900 dark:text-white">{todayAppointments.filter(a => a.status === 'scheduled').length}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <div className="text-slate-500 text-xs font-medium mb-1">Active Doctors</div>
                                <div className="text-xl font-black text-slate-900 dark:text-white">{doctors.filter(d => d.role === 'Doctor').length}</div>
                            </div>
                            <div
                                onClick={() => setActiveModal('collection-report')}
                                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative overflow-hidden group cursor-pointer hover:shadow-md transition-all active:scale-95"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <IndianRupee className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="text-slate-500 text-xs font-medium mb-1">Total Collection</div>
                                <div className="text-xl font-black text-green-600 dark:text-green-400">
                                    ₹{dailyCollection.toLocaleString('en-IN')}
                                </div>
                                <div className="text-xs text-slate-400 mt-1 font-medium flex items-center justify-between">
                                    <span>Cash: ₹{(collectionBreakdown['cash'] || 0).toLocaleString('en-IN')}</span>
                                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-500">View</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <div className="text-slate-500 text-xs font-medium mb-1">Expenses</div>
                                <div className="text-xl font-black text-rose-600 dark:text-rose-400">
                                    ₹{totalExpenses.toLocaleString('en-IN')}
                                </div>
                                <div className="text-xs text-slate-400 mt-1 font-medium">
                                    {todayExpenses.length} payouts today
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Net Cash Position</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-white">
                                    ₹{(dailyCollection - totalExpenses).toLocaleString('en-IN')}
                                </span>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                <Wallet className="h-5 w-5 text-slate-500" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            {/* MODALS */}

            <Dialog open={activeModal === 'expense'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-lg">
                    <ExpenseDialog onClose={() => setActiveModal(null)} onSuccess={() => router.refresh()} />
                </DialogContent>
            </Dialog>

            {/* 1. Register Patient Modal */}
            <Dialog open={activeModal === 'register'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-white dark:bg-slate-900">
                    <CreatePatientForm onClose={() => setActiveModal(null)} />
                </DialogContent>
            </Dialog>

            {/* 2. Book Appointment Modal */}
            <Dialog open={activeModal === 'appointment'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0 bg-white dark:bg-slate-900">
                    <AppointmentForm
                        onClose={() => setActiveModal(null)}
                        patients={patients}
                        doctors={doctors}
                    />
                </DialogContent>
            </Dialog>

            {/* 2.5 Edit Appointment Modal */}
            <Dialog open={activeModal === 'edit-appointment'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0 bg-white dark:bg-slate-900">
                    {editingAppointment && <AppointmentForm
                        onClose={() => setActiveModal(null)}
                        patients={patients}
                        doctors={doctors}
                        editingAppointment={editingAppointment}
                    />}
                </DialogContent>
            </Dialog>

            {/* 3. Check-In Modal (Simplified for now) */}
            <Dialog open={activeModal === 'checkin'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Quick Check-In</DialogTitle>
                    </DialogHeader>
                    {/* Reusing a simplified appointment list for check-in */}
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        <Input placeholder="Search patient name..." className="mb-4" />
                        {todayAppointments.filter(a => a.status === 'scheduled').map(apt => (
                            <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => handleStatusUpdate(apt.id, 'arrived')}>
                                <div>
                                    <div className="font-bold">{apt.patient?.first_name} {apt.patient?.last_name}</div>
                                    <div className="text-xs text-slate-500">{new Date(apt.start_time).toLocaleTimeString()} with Dr. {apt.clinician?.last_name}</div>
                                </div>
                                <Button size="sm" variant="ghost">Check In</Button>
                            </div>
                        ))}
                        {todayAppointments.filter(a => a.status === 'scheduled').length === 0 && (
                            <div className="text-center text-slate-500 py-4">No scheduled patients found</div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* 4. Billing Placeholder -> Redirects */}
            <Dialog open={activeModal === 'billing'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Billing Options</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => router.push('/hms/billing/new')}>
                            <CreditCard className="h-6 w-6" />
                            New Invoice
                        </Button>
                        <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => router.push('/hms/billing')}>
                            <Search className="h-6 w-6" />
                            Search Invoices
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 5. Daily Collection Report Modal */}
            <Dialog open={activeModal === 'collection-report'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <IndianRupee className="h-5 w-5 text-green-600" />
                            Daily Collection Report
                        </DialogTitle>
                    </DialogHeader>
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden mt-4">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="p-3 font-semibold">Time</th>
                                    <th className="p-3 font-semibold">Ref / Invoice</th>
                                    <th className="p-3 font-semibold">Patient</th>
                                    <th className="p-3 font-semibold">Method</th>
                                    <th className="p-3 font-semibold text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {todayPayments?.map((payment: any, i: number) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-3 text-slate-500">
                                            {new Date(payment.paid_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-3 font-medium text-slate-900 dark:text-white">
                                            {payment.hms_invoice?.invoice_number || '-'}
                                            {payment.payment_reference && <span className="text-xs text-slate-400 block break-all">{payment.payment_reference}</span>}
                                        </td>
                                        <td className="p-3 text-slate-700 dark:text-slate-300">
                                            {payment.hms_invoice?.hms_patient?.first_name} {payment.hms_invoice?.hms_patient?.last_name || ''}
                                        </td>
                                        <td className="p-3 capitalize">
                                            <Badge variant="outline" className={`capitalize ${payment.method === 'cash' ? 'bg-green-50 text-green-700 border-green-200' : ''}`}>
                                                {payment.method}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                                            ₹{Number(payment.amount).toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                ))}
                                {!todayPayments?.length && (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-400">No payments recorded today</td></tr>
                                )}
                            </tbody>
                            <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold border-t border-slate-200 dark:border-slate-800">
                                <tr>
                                    <td colSpan={4} className="p-3 text-right text-slate-600 dark:text-slate-400">Total Collection</td>
                                    <td className="p-3 text-right text-green-600 dark:text-green-400 text-lg">₹{dailyCollection.toLocaleString('en-IN')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 6. Expense Report Modal */}
            <Dialog open={activeModal === 'expense-report'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-rose-600" />
                            Petty Cash / Expenses Report
                        </DialogTitle>
                    </DialogHeader>
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden mt-4">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="p-3 font-semibold">Time</th>
                                    <th className="p-3 font-semibold">Voucher #</th>
                                    <th className="p-3 font-semibold">Payee</th>
                                    <th className="p-3 font-semibold">Category</th>
                                    <th className="p-3 font-semibold">Description</th>
                                    <th className="p-3 font-semibold text-right">Amount</th>
                                    <th className="p-3 font-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {todayExpenses?.map((expense: any, i: number) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-3 text-slate-500">
                                            {new Date(expense.created_at || expense.payment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-3 font-mono text-xs text-slate-500">
                                            {expense.payment_number}
                                        </td>
                                        <td className="p-3 font-medium text-slate-900 dark:text-white">
                                            {expense.payee_name || '-'}
                                        </td>
                                        <td className="p-3 text-slate-600">
                                            {expense.payment_lines?.[0]?.account_chart?.name || 'General'}
                                        </td>
                                        <td className="p-3 text-slate-500 max-w-[150px] truncate" title={expense.memo}>
                                            {expense.memo}
                                        </td>
                                        <td className="p-3 text-right font-bold text-rose-600 dark:text-rose-400">
                                            ₹{Number(expense.amount).toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-3 text-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-xs"
                                                onClick={() => setViewingPayment(expense)}
                                            >
                                                View Voucher
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {!todayExpenses?.length && (
                                    <tr><td colSpan={7} className="p-8 text-center text-slate-400">No expenses recorded today</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 7. View Voucher Modal */}
            <Dialog open={!!viewingPayment} onOpenChange={() => setViewingPayment(null)}>
                <DialogContent className="max-w-[850px] p-0 overflow-hidden bg-white">
                    {viewingPayment && <PettyCashVoucher payment={viewingPayment} onClose={() => setViewingPayment(null)} />}
                </DialogContent>
            </Dialog>

        </div >
    )
}
