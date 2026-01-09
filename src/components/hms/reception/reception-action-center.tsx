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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ReceptionActionCenter({ todayAppointments, patients, doctors, dailyCollection = 0, collectionBreakdown = {}, todayPayments = [], todayExpenses = [], totalExpenses = 0 }: ReceptionActionCenterProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [activeModal, setActiveModal] = useState<string | null>(null)
    const [editingAppointment, setEditingAppointment] = useState<any>(null)
    const [selectedDoctor, setSelectedDoctor] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [patientSearchQuery, setPatientSearchQuery] = useState("")
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

    // Filter Logic for Appointments
    const filteredAppointments = todayAppointments.filter(apt => {
        const matchesDoctor = selectedDoctor === 'all' || apt.clinician?.id === selectedDoctor
        const matchesSearch = searchQuery === '' ||
            `${apt.patient?.first_name} ${apt.patient?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.patient?.patient_number?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesDoctor && matchesSearch
    })

    // Filter Logic for Patients
    const filteredPatients = patients.filter(p => {
        const fullName = `${p.first_name} ${p.last_name}`.toLowerCase()
        const q = patientSearchQuery.toLowerCase()
        return fullName.includes(q) || p.patient_number?.toLowerCase().includes(q) || p.contact?.mobile?.includes(q)
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
        { id: 'register', title: 'New Patient', icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800' },
        { id: 'appointment', title: 'Schedule', icon: CalendarPlus, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800' },
        { id: 'billing', title: 'Billing', icon: CreditCard, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-100 dark:border-violet-800' },
        { id: 'expense', title: 'Expenses', icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800' }
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* 1. TOP PREMIUM STATS STRIP */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="p-4 bg-white dark:bg-slate-900 border-none shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expected</p>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">{todayAppointments.length}</h3>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-indigo-500" />
                    </div>
                </Card>
                {/* FINANCIAL CARDS REMOVED FOR CLEANER LAYOUT */}
                <Card className="p-4 bg-white dark:bg-slate-900 border-none shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In Waiting</p>
                        <h3 className="text-xl font-black text-blue-600">{todayAppointments.filter(a => a.status === 'arrived').length}</h3>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                </Card>
            </div>

            {/* 2. DUAL-PANEL FOCUS AREA */}
            <div className="flex flex-col xl:flex-row gap-8 min-h-[700px]">

                {/* LEFT: TODAY'S SCHEDULE */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/20 dark:shadow-indigo-500/10 text-white">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">Today's Patient Flow</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Bookings & Arrivals</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search schedule..."
                                    className="pl-9 h-9 w-[180px] text-xs bg-slate-100 dark:bg-slate-800 border-none shadow-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                                <SelectTrigger className="h-9 w-[160px] text-xs border-none bg-slate-100 dark:bg-slate-800 shadow-none">
                                    <SelectValue placeholder="All Doctors" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Doctors</SelectItem>
                                    {doctors.map(d => (
                                        <SelectItem key={d.id} value={d.id}>Dr. {d.last_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Card className="border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden flex-1 h-full">
                        <div className="overflow-y-auto max-h-[700px] custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-md z-10">
                                    <tr className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-6 py-4">Time</th>
                                        <th className="px-6 py-4">Patient</th>
                                        <th className="px-6 py-4">Doctor</th>
                                        <th className="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredAppointments.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-20 text-center text-slate-400">
                                                <Activity className="h-10 w-10 mx-auto mb-2 opacity-10" />
                                                <p className="font-bold text-sm">No scheduled items found</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAppointments.map((apt) => (
                                            <tr key={apt.id} className="group hover:bg-indigo-50/30 dark:hover:bg-slate-800/50 transition-all">
                                                <td className="px-6 py-5">
                                                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">
                                                        {new Date(apt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
                                                            <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                                                                {apt.patient?.first_name?.[0]}{apt.patient?.last_name?.[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                                                {apt.patient?.first_name} {apt.patient?.last_name}
                                                            </div>
                                                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                                <Badge variant="outline" className="text-[8px] py-0 px-1 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">{apt.patient?.patient_number}</Badge>
                                                                <span>•</span>
                                                                <span>{apt.type}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                                                        <Stethoscope className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                                                        Dr. {apt.clinician?.last_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        {apt.status === 'scheduled' ? (
                                                            <Button
                                                                size="sm"
                                                                className="h-8 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-full px-4 text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/20"
                                                                onClick={() => handleStatusUpdate(apt.id, 'arrived')}
                                                            >
                                                                Check In
                                                            </Button>
                                                        ) : (
                                                            <Badge className={`
                                                                text-[9px] font-black uppercase px-2 py-0.5 rounded-full border-none
                                                                ${apt.status === 'arrived' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                                                                    apt.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}
                                                            `}>
                                                                {apt.status}
                                                            </Badge>
                                                        )}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleEditClick(apt)}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleStatusUpdate(apt.id, 'cancelled')} className="text-red-600"><CheckCircle className="h-4 w-4 mr-2 rotate-45" /> Cancel</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* RIGHT: REGISTRY & ACTIONS */}
                <div className="w-full xl:w-96 space-y-6">
                    {/* QUICK ACTIONS CARD */}
                    <Card className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-slate-900 dark:to-indigo-950 text-white border-none shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-indigo-100">Front Desk Ops</h3>
                        <div className="grid grid-cols-2 gap-3 relative z-10">
                            {actions.map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => handleAction(action.id)}
                                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/20 group active:scale-95"
                                >
                                    <div className={`p-2 rounded-xl bg-white shadow-xl mb-2 ${action.color}`}>
                                        <action.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-50 dark:text-slate-200">{action.title}</span>
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* PATIENT REGISTRY PANEL */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-400" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Master Patient Registry</h3>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search all patients..."
                                className="pl-10 h-11 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none font-medium"
                                value={patientSearchQuery}
                                onChange={(e) => setPatientSearchQuery(e.target.value)}
                            />
                        </div>
                        <Card className="border border-slate-100 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 overflow-hidden">
                            <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                                {filteredPatients.length === 0 ? (
                                    <div className="p-8 text-center text-xs text-slate-400 italic">Enter search to find patients...</div>
                                ) : (
                                    filteredPatients.slice(0, 10).map((p) => (
                                        <div
                                            key={p.id}
                                            className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-indigo-50/30 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                                            onClick={() => router.push(`/hms/patients/${p.id}`)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${p.first_name}`} />
                                                    <AvatarFallback>{p.first_name?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{p.first_name} {p.last_name}</div>
                                                    <div className="text-[10px] text-slate-500 font-bold tracking-tighter">{p.patient_number}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setActiveModal('appointment'); }}><CalendarPlus className="h-3 w-3" /></Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); router.push(`/hms/billing/new?patientId=${p.id}`); }}><CreditCard className="h-3 w-3 text-emerald-500" /></Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full h-10 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 border-t border-slate-100 dark:border-slate-800"
                                onClick={() => router.push('/hms/patients')}
                            >
                                View Full Directory <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                        </Card>
                    </div>

                    {/* LIVE FEEDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                        {/* LIVE COLLECTION FEED */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                                <IndianRupee className="h-4 w-4 text-emerald-500" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center justify-between w-full">
                                    Live Revenue
                                    <span className="text-emerald-600">₹{dailyCollection.toLocaleString()}</span>
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {todayPayments.length === 0 ? (
                                    <div className="p-4 text-[10px] text-slate-400 text-center border border-dashed rounded-xl">No revenue recorded yet</div>
                                ) : (
                                    todayPayments.slice(0, 3).map((pmt, i) => (
                                        <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 px-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-extrabold">IN</div>
                                                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate max-w-[120px]">
                                                    {pmt.hms_invoice?.hms_patient?.first_name || 'Counter Sale'}
                                                </div>
                                            </div>
                                            <div className="text-xs font-black text-slate-900 dark:text-white">₹{Number(pmt.amount).toLocaleString()}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* LIVE EXPENSE FEED */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                                <Wallet className="h-4 w-4 text-rose-500" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center justify-between w-full">
                                    Live Expenses
                                    <span className="text-rose-600">₹{totalExpenses.toLocaleString()}</span>
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {todayExpenses.length === 0 ? (
                                    <div className="p-4 text-[10px] text-slate-400 text-center border border-dashed rounded-xl">No expenses recorded yet</div>
                                ) : (
                                    todayExpenses.slice(0, 3).map((exp, i) => (
                                        <div key={i} className="p-3 rounded-xl bg-rose-50/30 dark:bg-rose-900/10 flex items-center justify-between border border-rose-100/50 dark:border-rose-900/20">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 px-2 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-[10px] font-extrabold">OUT</div>
                                                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate max-w-[120px]">
                                                    {exp.payee_name || 'General'}
                                                </div>
                                            </div>
                                            <div className="text-xs font-black text-rose-600 dark:text-rose-400">₹{Number(exp.amount).toLocaleString()}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. MODALS (RESTORED & STYLED) */}
            <Dialog open={activeModal === 'register'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-white dark:bg-slate-900 border-none shadow-2xl">
                    <CreatePatientForm onClose={() => setActiveModal(null)} />
                </DialogContent>
            </Dialog>

            <Dialog open={activeModal === 'appointment'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0 bg-white dark:bg-slate-900 border-none shadow-2xl">
                    <AppointmentForm onClose={() => setActiveModal(null)} patients={patients} doctors={doctors} />
                </DialogContent>
            </Dialog>

            <Dialog open={activeModal === 'edit-appointment'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0 bg-white dark:bg-slate-900 border-none shadow-2xl">
                    {editingAppointment && <AppointmentForm onClose={() => setActiveModal(null)} patients={patients} doctors={doctors} editingAppointment={editingAppointment} />}
                </DialogContent>
            </Dialog>

            <Dialog open={activeModal === 'checkin'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Quick Check-In</DialogTitle></DialogHeader>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {todayAppointments.filter(a => a.status === 'scheduled').map(apt => (
                            <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => handleStatusUpdate(apt.id, 'arrived')}>
                                <div><div className="font-bold">{apt.patient?.first_name} {apt.patient?.last_name}</div><div className="text-xs text-slate-500">{new Date(apt.start_time).toLocaleTimeString()} with Dr. {apt.clinician?.last_name}</div></div>
                                <Button size="sm" variant="ghost">Check In</Button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={activeModal === 'billing'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Billing Options</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => router.push('/hms/billing/new')}><CreditCard className="h-6 w-6" />New Invoice</Button>
                        <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => router.push('/hms/billing')}><Search className="h-6 w-6" />Search Invoices</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={activeModal === 'collection-report'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900 shadow-2xl">
                    <DialogHeader><DialogTitle className="text-2xl font-black">Daily Collection Summary</DialogTitle></DialogHeader>
                    <div className="mt-4"><table className="w-full text-sm">
                        <thead><tr className="border-b"><th className="pb-2 text-left text-xs uppercase tracking-widest text-slate-400">Ref</th><th className="pb-2 text-right text-xs uppercase tracking-widest text-slate-400">Amount</th></tr></thead>
                        <tbody>{todayPayments.map((p, i) => (<tr key={i} className="border-b last:border-0 hover:bg-slate-50"><td className="py-3 text-sm font-bold">{p.hms_invoice?.invoice_number || 'Counter Sale'}</td><td className="py-3 text-right font-black text-green-600">₹{Number(p.amount).toLocaleString()}</td></tr>))}</tbody>
                    </table></div>
                </DialogContent>
            </Dialog>

            <Dialog open={activeModal === 'expense-report'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900 shadow-2xl">
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
                                    <th className="p-3 font-semibold text-right">Amount</th>
                                    <th className="p-3 font-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {todayExpenses?.map((expense: any, i: number) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-3 text-slate-500">{new Date(expense.created_at || expense.payment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="p-3 font-mono text-xs text-slate-500">{expense.payment_number}</td>
                                        <td className="p-3 font-medium text-slate-900 dark:text-white">{expense.payee_name || '-'}</td>
                                        <td className="p-3 text-slate-600">{(expense.payment_lines?.[0]?.metadata as any)?.account_name || 'General'}</td>
                                        <td className="p-3 text-right font-bold text-rose-600 dark:text-rose-400">₹{Number(expense.amount).toLocaleString('en-IN')}</td>
                                        <td className="p-3 text-center">
                                            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setViewingPayment(expense)}>View Voucher</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={!!viewingPayment} onOpenChange={() => setViewingPayment(null)}>
                <DialogContent className="max-w-[850px] p-0 overflow-hidden bg-white">
                    {viewingPayment && <PettyCashVoucher payment={viewingPayment} onClose={() => setViewingPayment(null)} />}
                </DialogContent>
            </Dialog>
        </div>
    )
}
