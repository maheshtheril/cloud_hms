'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    UserPlus, CalendarPlus, LogIn, CreditCard,
    PhoneIncoming, IdCard, Users, Search,
    Clock, Stethoscope, ChevronRight
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreatePatientForm } from "@/components/hms/create-patient-form"
import { AppointmentForm } from "@/components/appointments/appointment-form"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ReceptionActionCenterProps {
    todayAppointments: any[]
    patients: any[]
    doctors: any[]
}

export function ReceptionActionCenter({ todayAppointments, patients, doctors }: ReceptionActionCenterProps) {
    const [activeModal, setActiveModal] = useState<null | 'register' | 'appointment' | 'billing' | 'checkin' | 'visitor'>(null)
    const [searchQuery, setSearchQuery] = useState("")

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
        }
    ]

    return (
        <div className="space-y-8">
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {actions.map((action) => (
                    <motion.button
                        key={action.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveModal(action.id as any)}
                        className={`text-left p-6 rounded-2xl border ${action.border} ${action.bg} backdrop-blur-sm shadow-sm hover:shadow-md transition-all group`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm group-hover:shadow-md transition-shadow ${action.color}`}>
                                <action.icon className="h-6 w-6" />
                            </div>
                            <ChevronRight className={`h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity ${action.color}`} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                            {action.title}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            {action.desc}
                        </p>
                    </motion.button>
                ))}
            </div>

            {/* Dashboard Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Appointments Widget */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                            <Clock className="h-5 w-5 text-indigo-500" />
                            Today's Schedule
                        </h2>
                        <Badge variant="outline" className="px-3 py-1">
                            {todayAppointments.length} Appointments
                        </Badge>
                    </div>

                    <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {todayAppointments.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    No appointments scheduled for today
                                </div>
                            ) : (
                                todayAppointments.map((apt) => (
                                    <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="text-center min-w-[3.5rem]">
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {new Date(apt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full mt-1 ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                        apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {apt.status}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">
                                                    {apt.patient?.first_name} {apt.patient?.last_name}
                                                </h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Stethoscope className="h-3 w-3" />
                                                    Dr. {apt.clinician?.first_name} {apt.clinician?.last_name}
                                                </div>
                                            </div>
                                        </div>
                                        <Button size="sm" variant={apt.status === 'arrived' ? 'secondary' : 'default'} disabled={apt.status === 'arrived'}>
                                            {apt.status === 'arrived' ? 'Arrived' : 'Mark Arrival'}
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Queue Summary / Stats */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Users className="h-5 w-5 text-indigo-500" />
                        Queue Status
                    </h2>
                    <div className="grid gap-3">
                        <div className="p-4 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                            <div className="text-indigo-100 text-sm font-medium mb-1">Total Checked In</div>
                            <div className="text-3xl font-black">12</div>
                            <div className="mt-2 text-xs bg-indigo-500/50 px-2 py-1 rounded w-fit">+4 from last hour</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <div className="text-slate-500 text-sm font-medium mb-1">Waiting Area</div>
                            <div className="text-3xl font-black text-slate-900 dark:text-white">5</div>
                            <div className="mt-2 text-xs text-slate-400">Avg wait: 14 mins</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <div className="text-slate-500 text-sm font-medium mb-1">Doctors Active</div>
                            <div className="text-3xl font-black text-slate-900 dark:text-white">{doctors.filter(d => d.role === 'Doctor').length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}

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

            {/* 3. Check-In Modal (Simplified for now) */}
            <Dialog open={activeModal === 'checkin'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Patient Arrival Check-In</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search appointment or patient name..." className="pl-10" />
                        </div>
                        <div className="text-sm text-slate-500 text-center py-8">
                            (This would connect to a dedicated check-in logic)
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 4. Billing Placeholder */}
            <Dialog open={activeModal === 'billing'} onOpenChange={() => setActiveModal(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Quick POS / Billing</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center text-slate-500">
                            Cash Register / POS Module Integration
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}
