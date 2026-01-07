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
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Top Highlights Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-white dark:bg-slate-900 border-none shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Active Patients</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{patients.length}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Users className="h-6 w-6 text-indigo-500 group-hover:text-white" />
                    </div>
                </Card>
                <Card className="p-4 bg-white dark:bg-slate-900 border-none shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Daily Collection</p>
                        <h3 className="text-2xl font-black text-green-600">₹{dailyCollection.toLocaleString()}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors cursor-pointer" onClick={() => setActiveModal('collection-report')}>
                        <IndianRupee className="h-6 w-6 text-green-500 group-hover:text-white" />
                    </div>
                </Card>
                <Card className="p-4 bg-white dark:bg-slate-900 border-none shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">In-Queue</p>
                        <h3 className="text-2xl font-black text-blue-600">{todayAppointments.filter(a => a.status === 'arrived').length}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Activity className="h-6 w-6 text-blue-500 group-hover:text-white" />
                    </div>
                </Card>
                <Card className="p-4 bg-white dark:bg-slate-900 border-none shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Next Slot</p>
                        <h3 className="text-sm font-bold truncate text-slate-900 dark:text-white">
                            {todayAppointments.find(a => a.status === 'scheduled')?.patient?.first_name || 'No Pending'}
                        </h3>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <Clock className="h-6 w-6 text-amber-500 group-hover:text-white" />
                    </div>
                </Card>
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Main Content Area */}
                <div className="flex-1 space-y-6">
                    <Tabs defaultValue="registry" className="w-full">
                        <div className="flex items-center justify-between mb-6">
                            <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 h-12">
                                <TabsTrigger value="registry" className="px-6 h-10 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                                    <Users className="h-4 w-4 mr-2" />
                                    Patient Registry
                                </TabsTrigger>
                                <TabsTrigger value="schedule" className="px-6 h-10 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Today's Schedule
                                </TabsTrigger>
                            </TabsList>
                            <Button onClick={() => handleAction('register')} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-lg shadow-indigo-600/20">
                                <UserPlus className="h-4 w-4 mr-2" />
                                New Registration
                            </Button>
                        </div>

                        <TabsContent value="registry" className="mt-0 outline-none">
                            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input
                                            placeholder="Search by name, patient ID or mobile..."
                                            className="pl-10 h-11 bg-white border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                                            value={patientSearchQuery}
                                            onChange={(e) => setPatientSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" className="h-11">
                                            <Filter className="h-4 w-4 mr-2" /> Filters
                                        </Button>
                                        <Select defaultValue="desc">
                                            <SelectTrigger className="h-11 w-40">
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="desc">Latest First</SelectItem>
                                                <SelectItem value="asc">Oldest First</SelectItem>
                                                <SelectItem value="name">Name A-Z</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-xs font-bold uppercase text-slate-500 tracking-wider">
                                                <th className="px-6 py-4 text-left">Patient Details</th>
                                                <th className="px-6 py-4 text-left">Patient ID</th>
                                                <th className="px-6 py-4 text-left">Last Contact</th>
                                                <th className="px-6 py-4 text-left">Status</th>
                                                <th className="px-6 py-4 text-right">Rapid Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {filteredPatients.map((p) => (
                                                <tr key={p.id} className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${p.first_name}`} />
                                                                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                                                                    {p.first_name?.[0]}{p.last_name?.[0]}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => router.push(`/hms/patients/${p.id}`)}>
                                                                    {p.first_name} {p.last_name}
                                                                </div>
                                                                <div className="text-xs text-slate-500 flex items-center gap-2">
                                                                    {p.gender} • {new Date().getFullYear() - new Date(p.dob).getFullYear()} Yrs
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="secondary" className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                            {p.patient_number}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                            {p.contact?.mobile}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400">Primary Mobile</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {todayAppointments.some(a => a.patient_id === p.id) ? (
                                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Active Today</Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-slate-400 border-slate-200 font-normal">Registered</Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button variant="ghost" size="icon" title="Book Visit" className="h-9 w-9 text-blue-600 hover:bg-blue-50" onClick={() => setActiveModal('appointment')}>
                                                                <CalendarPlus className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" title="Generate Bill" className="h-9 w-9 text-emerald-600 hover:bg-emerald-50" onClick={() => router.push(`/hms/billing/new?patientId=${p.id}`)}>
                                                                <IndianRupee className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" title="View Profile" className="h-9 w-9 text-slate-400 hover:bg-slate-100">
                                                                <ChevronRight className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-center">
                                    <p className="text-xs text-slate-500 italic">Showing {filteredPatients.length} of {patients.length} available patients</p>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="schedule" className="mt-0 outline-none">
                            <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                                    <h3 className="font-bold text-lg">Today's Daily Schedule</h3>
                                    <div className="flex gap-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <Input
                                                placeholder="Search schedule..."
                                                className="pl-9 w-[200px]"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                                            <SelectTrigger className="w-[180px]">
                                                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                                                <SelectValue placeholder="All Doctors" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Doctors</SelectItem>
                                                {doctors.map(doc => (
                                                    <SelectItem key={doc.id} value={doc.id}>Dr. {doc.first_name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredAppointments.length === 0 ? (
                                        <div className="py-20 text-center text-slate-400">
                                            <Clock className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                            <p>No appointments scheduled for today</p>
                                        </div>
                                    ) : (
                                        filteredAppointments.map(apt => (
                                            <div key={apt.id} className="flex items-center p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="w-24 flex-shrink-0">
                                                    <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                                                        {new Date(apt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                                <div className="flex-1 flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                                        {apt.patient?.first_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold">{apt.patient?.first_name} {apt.patient?.last_name}</h4>
                                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Stethoscope className="h-3 w-3" /> Dr. {apt.clinician?.last_name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge className={`
                                                        ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                            apt.status === 'arrived' ? 'bg-purple-100 text-purple-700' :
                                                                apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}
                                                    `}>
                                                        {apt.status}
                                                    </Badge>
                                                    {apt.status === 'scheduled' && (
                                                        <Button size="sm" onClick={() => handleStatusUpdate(apt.id, 'arrived')}>Check In</Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Sidebar: Shortcuts & Health Snapshot */}
                <div className="w-full xl:w-80 space-y-6">
                    <Card className="p-6 border-none shadow-xl bg-indigo-600 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <h3 className="font-bold mb-4 relative z-10">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3 relative z-10">
                            {actions.map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => handleAction(action.id)}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 group"
                                >
                                    <action.icon className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform text-white" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{action.title}</span>
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6 border-none shadow-xl bg-white dark:bg-slate-900">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-indigo-500" />
                            Efficiency Matrix
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-500">Wait Time (Avg)</span>
                                    <span className="text-indigo-600">12 Mins</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[40%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-500">Queue Load</span>
                                    <span className="text-blue-600">High</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[75%]" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-none shadow-xl bg-slate-900 text-white overflow-hidden relative">
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500" />
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Net Position</span>
                            <Wallet className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="text-3xl font-black mb-1">₹{(dailyCollection - totalExpenses).toLocaleString()}</div>
                        <div className="text-[10px] text-slate-500">Settled Daily Cash Total</div>
                    </Card>
                </div>
            </div>

            {/* MODALS (Existing logic preserved, just styling applied if needed) */}
            <Dialog open={activeModal === 'expense'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-lg">
                    <ExpenseDialog onClose={() => setActiveModal(null)} onSuccess={() => router.refresh()} />
                </DialogContent>
            </Dialog>

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

            {/* Other Modals... (preserved summarized) */}
            <Dialog open={activeModal === 'collection-report'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900 shadow-2xl">
                    <DialogHeader><DialogTitle className="text-2xl font-black">Daily Collection Summary</DialogTitle></DialogHeader>
                    {/* Simplified table for brief summary */}
                    <div className="mt-4"><table className="w-full text-sm">
                        <thead><tr className="border-b"><th className="pb-2 text-left">Ref</th><th className="pb-2 text-right">Amount</th></tr></thead>
                        <tbody>{todayPayments.map((p, i) => (<tr key={i} className="border-b last:border-0"><td className="py-2">{p.hms_invoice?.invoice_number || 'Pmt'}</td><td className="py-2 text-right font-bold">₹{Number(p.amount).toLocaleString()}</td></tr>))}</tbody>
                    </table></div>
                </DialogContent>
            </Dialog>

            {/* 2.5 Edit Appointment Modal */}
            <Dialog open={activeModal === 'edit-appointment'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0 bg-white dark:bg-slate-900 border-none shadow-2xl">
                    {editingAppointment && <AppointmentForm
                        onClose={() => setActiveModal(null)}
                        patients={patients}
                        doctors={doctors}
                        editingAppointment={editingAppointment}
                    />}
                </DialogContent>
            </Dialog>

            {/* 3. Check-In Modal */}
            <Dialog open={activeModal === 'checkin'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Quick Check-In</DialogTitle>
                    </DialogHeader>
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
                    </div>
                </DialogContent>
            </Dialog>

            {/* 4. Billing Placeholder */}
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
