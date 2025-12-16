import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, User, Phone, MapPin, Clock, FileText, Plus, Edit, Mail } from "lucide-react"

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
    const patient = await prisma.hms_patient.findUnique({
        where: { id: params.id },
        include: {
            hms_appointments: {
                orderBy: { starts_at: 'desc' },
                take: 5
            },
            hms_invoice: {
                orderBy: { created_at: 'desc' },
                take: 5
            }
        }
    })

    if (!patient) {
        return notFound()
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/hms/patients" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{patient.first_name} {patient.last_name}</h1>
                        <p className="text-gray-500 flex items-center gap-2">
                            <span>ID: {patient.patient_number || 'N/A'}</span>
                            <span className="text-gray-300">•</span>
                            <span className="capitalize">{patient.gender || 'Unknown Gender'}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Profile
                    </button>
                    <Link
                        href={`/hms/appointments/new?patient_id=${patient.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Book Appointment
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Basic Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Patient Details</h2>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="text-gray-900">{(patient.contact as any)?.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-gray-900">{(patient.contact as any)?.email || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Bio / Demographics</p>
                                    <p className="text-gray-900">
                                        Born: {patient.dob ? new Date(patient.dob).toLocaleDateString() : 'Unknown'}
                                        {patient.dob && ` (${new Date().getFullYear() - new Date(patient.dob).getFullYear()} yrs)`}
                                    </p>
                                    <p className="text-gray-900">
                                        Blood Group: {(patient.metadata as any)?.blood_group || 'Unknown'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <div className="text-gray-900">
                                        {(patient.contact as any)?.address?.street && <p>{(patient.contact as any).address.street}</p>}
                                        <p>
                                            {[(patient.contact as any)?.address?.city, (patient.contact as any)?.address?.state, (patient.contact as any)?.address?.zip].filter(Boolean).join(', ')}
                                        </p>
                                        {(patient.contact as any)?.address?.country && <p>{(patient.contact as any).address.country}</p>}
                                        {!((patient.contact as any)?.address) && 'No address on file'}
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            {(patient.contact as any)?.emergency_contact?.name && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-sm font-medium text-gray-500 mb-1">Emergency Contact</p>
                                    <p className="text-gray-900 font-medium">{(patient.contact as any).emergency_contact.name} <span className="text-gray-500 text-sm">({(patient.contact as any).emergency_contact.relation})</span></p>
                                    <p className="text-gray-600 text-sm">{(patient.contact as any).emergency_contact.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-semibold text-gray-900 mb-4">Quick Stats</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{patient.hms_appointments.length}</p>
                                <p className="text-xs text-blue-600 font-medium">Visits</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{patient.hms_invoice.length}</p>
                                <p className="text-xs text-green-600 font-medium">Invoices</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity Feed */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Appointments Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Recent Appointments
                            </h2>
                            <Link href="/hms/appointments" className="text-xs font-medium text-blue-600 hover:text-blue-700">View All</Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {patient.hms_appointments.length === 0 ? (
                                <p className="p-8 text-center text-gray-500 text-sm">No appointment history.</p>
                            ) : (
                                patient.hms_appointments.map(apt => (
                                    <div key={apt.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                                                {new Date(apt.starts_at).getDate()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Consultation</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(apt.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                                            {apt.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Invoices Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Billing History
                            </h2>
                            <Link href="/hms/billing" className="text-xs font-medium text-blue-600 hover:text-blue-700">View All</Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {patient.hms_invoice.length === 0 ? (
                                <p className="p-8 text-center text-gray-500 text-sm">No invoices found.</p>
                            ) : (
                                patient.hms_invoice.map(inv => (
                                    <div key={inv.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <div>
                                            <p className="font-medium text-gray-900">{inv.invoice_no}</p>
                                            <p className="text-xs text-gray-500">{new Date(inv.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">${Number(inv.outstanding_amount).toFixed(2)}</p>
                                            <p className={`text-xs capitalize ${inv.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                                                {inv.status}
                                            </p>
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
