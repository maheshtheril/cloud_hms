import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Mail, Phone, Award, Briefcase, Calendar, Clock, User } from "lucide-react"

export default async function DoctorDetailPage({ params }: { params: { id: string } }) {
    const doctor = await prisma.hms_clinicians.findUnique({
        where: { id: params.id },
        include: {
            hms_roles: true,
            hms_specializations: true
        }
    })

    if (!doctor) {
        return notFound()
    }

    // Fetch upcoming appointments for this doctor
    const upcomingAppointments = await prisma.hms_appointments.findMany({
        where: {
            clinician_id: doctor.id,
            starts_at: {
                gte: new Date() // Future only
            }
        },
        orderBy: { starts_at: 'asc' },
        take: 5,
        include: {
            hms_patient: true
        }
    })

    const totalAppointments = await prisma.hms_appointments.count({
        where: { clinician_id: doctor.id }
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/hms/doctors" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            Dr. {doctor.first_name} {doctor.last_name}
                            <span className={`text-sm px-2 py-0.5 rounded-full border ${doctor.is_active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                                }`}>
                                {doctor.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </h1>
                        <p className="text-gray-500 text-sm">License: {doctor.license_no || 'N/A'}</p>
                    </div>
                </div>

                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2 font-medium">
                    <Calendar className="h-4 w-4" />
                    View Full Schedule
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Profile Card */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl">
                                {doctor.first_name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{doctor.hms_specializations?.name || 'General Practitioner'}</p>
                                <p className="text-sm text-gray-500">{doctor.experience_years ? `${doctor.experience_years} years experience` : 'Experience not listed'}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <span className="text-gray-600 text-sm">{doctor.email || 'No email'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-gray-400" />
                                <span className="text-gray-600 text-sm">{doctor.phone || 'No phone'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Briefcase className="h-5 w-5 text-gray-400" />
                                <span className="text-gray-600 text-sm">{doctor.hms_roles?.name || 'Staff Member'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-blue-900 font-semibold mb-1">Workload</h3>
                        <p className="text-blue-700 text-sm mb-4">Total appointments assigned</p>
                        <p className="text-4xl font-bold text-blue-600">{totalAppointments}</p>
                    </div>
                </div>

                {/* Schedule / Appointments */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Upcoming Schedule
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {upcomingAppointments.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <p>No upcoming appointments scheduled.</p>
                                </div>
                            ) : (
                                upcomingAppointments.map((apt) => (
                                    <div key={apt.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0 w-12 text-center bg-gray-100 rounded p-1">
                                                <div className="text-xs text-gray-500 uppercase">{new Date(apt.starts_at).toLocaleString('default', { month: 'short' })}</div>
                                                <div className="font-bold text-gray-900">{new Date(apt.starts_at).getDate()}</div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 flex items-center gap-2">
                                                    {new Date(apt.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    <span className="text-xs font-normal text-gray-400">({apt.duration_minutes} mins)</span>
                                                </p>
                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {apt.hms_patient ? `${apt.hms_patient.first_name} ${apt.hms_patient.last_name}` : 'Unknown Patient'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {apt.status}
                                            </span>
                                            <Link
                                                href={`/hms/appointments/${apt.id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            >
                                                <ArrowLeft className="h-4 w-4 rotate-180" />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
