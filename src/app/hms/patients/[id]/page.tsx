import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, User, Phone, MapPin, Clock, FileText, Plus, Edit, Mail } from "lucide-react"
import { EditPatientButton } from "@/components/hms/patients/edit-patient-button"
import { PatientPaymentDialog } from "@/components/hms/billing/patient-payment-dialog"
import { PatientConsumptionDialog } from "@/components/hms/billing/patient-consumption-dialog"

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const patient = await prisma.hms_patient.findUnique({
        where: { id },
        include: {
            hms_appointments: {
                orderBy: { starts_at: 'desc' },
                take: 20 // Increased to get more context for consumption
            },
            hms_invoice: {
                orderBy: { created_at: 'desc' },
                take: 5
            },
            prescription: {
                orderBy: { created_at: 'desc' },
                take: 5,
                include: {
                    prescription_items: {
                        include: {
                            hms_product: true
                        }
                    }
                }
            },
            hms_vitals: {
                orderBy: { recorded_at: 'desc' },
                take: 10
            }
        }
    })

    if (!patient) {
        return notFound()
    }

    // Fetch Nursing Consumption History (Linked to Encounters/Appointments)
    const appointmentIds = patient.hms_appointments.map(a => a.id)
    const consumptionHistory = await prisma.hms_stock_move.findMany({
        where: {
            source_reference: { in: appointmentIds },
            source: 'Nursing Consumption'
        },
        include: {
            hms_product: true // using include for name, assuming relation exists or will be fixed, fallback to ID if issues
        },
        orderBy: { created_at: 'desc' },
        take: 20
    })

    // Fallback manual product fetch if relation fails (defensive)
    let productMap = new Map<string, string>();
    if (consumptionHistory.some(c => !c.hms_product)) {
        const pIds = [...new Set(consumptionHistory.map(c => c.product_id))]
        const prods = await prisma.hms_product.findMany({ where: { id: { in: pIds } }, select: { id: true, name: true } })
        productMap = new Map(prods.map(p => [p.id, p.name]))
    }

    const patientAny = patient as any

    // Merge Clinical Events for Timeline
    const timelineEvents = [
        ...patient.hms_vitals.map(v => ({
            type: 'vital',
            date: v.recorded_at,
            data: v
        })),
        ...consumptionHistory.map(c => ({
            type: 'consumption',
            date: c.created_at,
            productName: c.hms_product?.name || productMap.get(c.product_id) || 'Unknown Item',
            data: c
        }))
    ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/hms/patients" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{patientAny.first_name} {patientAny.last_name}</h1>
                        <p className="text-gray-500 flex items-center gap-2">
                            <span>ID: {patientAny.patient_number || 'N/A'}</span>
                            <span className="text-gray-300">•</span>
                            <span className="capitalize">{patientAny.gender || 'Unknown Gender'}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <PatientPaymentDialog
                        patientId={patientAny.id}
                        patientName={`${patientAny.first_name} ${patientAny.last_name}`}
                    />
                    <PatientConsumptionDialog
                        patientId={patientAny.id}
                        patientName={`${patientAny.first_name} ${patientAny.last_name}`}
                    />
                    <EditPatientButton patient={patientAny} />
                    <Link
                        href={`/hms/prescriptions/new?patientId=${patientAny.id}`}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2"
                    >
                        <FileText className="h-4 w-4" />
                        Prescribe
                    </Link>
                    <Link
                        href={`/hms/appointments/new?patient_id=${patientAny.id}`}
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
                                    <p className="text-gray-900">{(patientAny.contact as any)?.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-gray-900">{(patientAny.contact as any)?.email || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Bio / Demographics</p>
                                    <p className="text-gray-900">
                                        Born: {patientAny.dob ? new Date(patientAny.dob).toLocaleDateString() : 'Unknown'}
                                        {patientAny.dob && ` (${new Date().getFullYear() - new Date(patientAny.dob).getFullYear()} yrs)`}
                                    </p>
                                    <p className="text-gray-900">
                                        Blood Group: {(patientAny.metadata as any)?.blood_group || 'Unknown'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <div className="text-gray-900">
                                        {(patientAny.contact as any)?.address?.street && <p>{(patientAny.contact as any).address.street}</p>}
                                        <p>
                                            {[(patientAny.contact as any)?.address?.city, (patientAny.contact as any)?.address?.state, (patientAny.contact as any)?.address?.zip].filter(Boolean).join(', ')}
                                        </p>
                                        {(patientAny.contact as any)?.address?.country && <p>{(patientAny.contact as any).address.country}</p>}
                                        {!((patientAny.contact as any)?.address) && 'No address on file'}
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            {(patientAny.contact as any)?.emergency_contact?.name && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-sm font-medium text-gray-500 mb-1">Emergency Contact</p>
                                    <p className="text-gray-900 font-medium">{(patientAny.contact as any).emergency_contact.name} <span className="text-gray-500 text-sm">({(patientAny.contact as any).emergency_contact.relation})</span></p>
                                    <p className="text-gray-600 text-sm">{(patientAny.contact as any).emergency_contact.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-semibold text-gray-900 mb-4">Quick Stats</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{patientAny.hms_appointments.length}</p>
                                <p className="text-xs text-blue-600 font-medium">Visits</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{patientAny.hms_invoice.length}</p>
                                <p className="text-xs text-green-600 font-medium">Invoices</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity Feed */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Clinical Timeline (New World Standard Feature) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-orange-600" />
                                Clinical Timeline
                            </h2>
                            <span className="text-xs font-medium text-gray-500">Recent Activity</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {timelineEvents.length === 0 ? (
                                <p className="p-8 text-center text-gray-500 text-sm">No clinical history recorded.</p>
                            ) : (
                                timelineEvents.map((event: any, i: number) => (
                                    <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex gap-4">
                                        <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${event.type === 'vital' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                                            }`}>
                                            {event.type === 'vital' ? <FileText className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="font-bold text-sm text-gray-800">
                                                    {event.type === 'vital' ? 'Vitals Recorded' : 'Stock Consumed'}
                                                </p>
                                                <span className="text-xs text-gray-400">
                                                    {event.date ? new Date(event.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                                                </span>
                                            </div>

                                            <div className="mt-1 text-sm text-gray-600">
                                                {event.type === 'vital' ? (
                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                                        {event.data.temperature && <span>Temp: <b>{Number(event.data.temperature)}°C</b></span>}
                                                        {event.data.systolic && <span>BP: <b>{Number(event.data.systolic)}/{Number(event.data.diastolic)}</b></span>}
                                                        {event.data.pulse && <span>Pulse: <b>{Number(event.data.pulse)}</b></span>}
                                                        {event.data.spo2 && <span>SpO2: <b>{Number(event.data.spo2)}%</b></span>}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900">{event.productName}</span>
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                                            Qty: {Number(event.data.qty)} {event.data.uom}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

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
                            {patientAny.hms_appointments.length === 0 ? (
                                <p className="p-8 text-center text-gray-500 text-sm">No appointment history.</p>
                            ) : (
                                patientAny.hms_appointments.map((apt: any) => (
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
                            {patientAny.hms_invoice.length === 0 ? (
                                <p className="p-8 text-center text-gray-500 text-sm">No invoices found.</p>
                            ) : (
                                patientAny.hms_invoice.map((inv: any) => (
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
