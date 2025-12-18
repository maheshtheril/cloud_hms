import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import { Users, Calendar, TrendingUp, Plus, Clock, ChevronRight, CheckCircle, IndianRupee, Activity } from 'lucide-react'

export default async function HMSDashboard() {
    // Get session for tenant filtering
    const session = await auth()
    const tenantId = session?.user?.tenantId

    // 1. Fetch Stats
    const patientCount = await prisma.hms_patient.count({
        where: tenantId ? { tenant_id: tenantId } : undefined
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todaysAppointmentsRaw = await prisma.hms_appointments.findMany({
        where: {
            starts_at: {
                gte: today,
                lt: tomorrow
            }
        },
        orderBy: { starts_at: 'asc' }
    })

    // Manual join since relation fields are missing in schema
    const patientIds = todaysAppointmentsRaw.map(a => a.patient_id);
    const patients = await prisma.hms_patient.findMany({
        where: {
            id: { in: patientIds },
            ...(tenantId ? { tenant_id: tenantId } : {})
        }
    });

    const todaysAppointments = todaysAppointmentsRaw.map(apt => {
        const patient = patients.find(p => p.id === apt.patient_id);
        return {
            ...apt,
            hms_patient: patient
        };
    });

    const todaysInvoices = await prisma.hms_invoice.findMany({
        where: {
            created_at: {
                gte: today,
                lt: tomorrow
            }
        }
    })

    const todaysRevenue = todaysInvoices.reduce((sum, inv) => sum + Number(inv.outstanding_amount || 0), 0)

    const recentPatients = await prisma.hms_patient.findMany({
        where: tenantId ? { tenant_id: tenantId } : undefined,
        take: 5,
        orderBy: { created_at: 'desc' }
    })

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                    <p className="text-gray-500">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/hms/appointments/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        New Appointment
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Patients</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-gray-800">{patientCount}</p>
                            <span className="text-xs text-green-600 flex items-center font-medium bg-green-50 px-1.5 py-0.5 rounded-full">
                                <TrendingUp className="h-3 w-3 mr-1" /> +12%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Visits Today</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-gray-800">{todaysAppointments.length}</p>
                            <span className="text-xs text-gray-400 font-normal">
                                / {todaysAppointments.length + 4} slots
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <IndianRupee className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Revenue Today</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-gray-800">${todaysRevenue.toFixed(2)}</p>
                            <span className="text-xs text-green-600 flex items-center font-medium bg-green-50 px-1.5 py-0.5 rounded-full">
                                <TrendingUp className="h-3 w-3 mr-1" /> +5%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Schedule (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-600" />
                                Today's Schedule
                            </h2>
                            <Link href="/hms/appointments" className="text-sm text-blue-600 font-medium hover:underline flex items-center">
                                View Calendar <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {todaysAppointments.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-4">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No appointments today</h3>
                                    <p className="text-gray-500 mt-1">Enjoy your free time or manage patient records.</p>
                                </div>
                            ) : (
                                todaysAppointments.map(apt => (
                                    <div key={apt.id} className="p-4 flex items-center hover:bg-gray-50 transition-colors group">
                                        <div className="w-20 text-center flex-shrink-0">
                                            <p className="text-sm font-bold text-gray-900">
                                                {new Date(apt.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {apt.duration_minutes || 30} min
                                            </p>
                                        </div>
                                        <div className="flex-1 ml-4 border-l-2 border-transparent group-hover:border-blue-500 pl-4 py-1 transition-colors">
                                            <p className="font-medium text-gray-900">
                                                {apt.hms_patient ? `${apt.hms_patient.first_name} ${apt.hms_patient.last_name}` : 'Unknown Patient'}
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                                <span className="capitalize">{apt.type || 'Consultation'}</span> • <span className="capitalize">{apt.mode || 'In-Person'}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {apt.status}
                                            </span>
                                            <Link
                                                href={`/hms/appointments/${apt.id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Quick Actions & New Patients (1/3 width) */}
                <div className="space-y-8">

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                        <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link href="/hms/patients/new" className="block w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 p-3 rounded-lg flex items-center gap-3 transition-colors">
                                <div className="p-2 bg-white/20 rounded-full">
                                    <Users className="h-4 w-4" />
                                </div>
                                <span className="font-medium">Register Patient</span>
                            </Link>
                            <Link href="/hms/billing/new" className="block w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 p-3 rounded-lg flex items-center gap-3 transition-colors">
                                <div className="p-2 bg-white/20 rounded-full">
                                    <IndianRupee className="h-4 w-4" />
                                </div>
                                <span className="font-medium">Create Invoice</span>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Patients */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-800">New Patients</h2>
                            <Link href="/hms/patients" className="text-xs font-medium text-blue-600 hover:text-blue-700">All Patients</Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {recentPatients.map(p => (
                                <Link key={p.id} href={`/hms/patients/${p.id}`} className="block p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs uppercase">
                                            {p.first_name?.[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{p.first_name} {p.last_name}</p>
                                            <p className="text-xs text-gray-500 truncate">{p.patient_number}</p>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(p.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
