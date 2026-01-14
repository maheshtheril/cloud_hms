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
        orderBy: { created_at: 'desc' },
        take: 20
    })

    // Fetch product details manually
    const pIds = [...new Set(consumptionHistory.map(c => c.product_id))]
    const prods = await prisma.hms_product.findMany({ where: { id: { in: pIds } }, select: { id: true, name: true } })
    const productMap = new Map(prods.map(p => [p.id, p.name]))

    // Fetch User Details for Consumption (Nurses)
    const userIds = [...new Set(consumptionHistory.map(c => c.created_by).filter(Boolean))] as string[]
    const users = await prisma.app_user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, full_name: true } })
    const userMap = new Map(users.map(u => [u.id, u.full_name || u.name || 'Unknown']))

    // Group Consumption into Events (same logic as history action)
    const consumptionEvents: any[] = []
    consumptionHistory.forEach(move => {
        const moveTime = new Date(move.created_at).getTime()
        let event = consumptionEvents.find(e => Math.abs(new Date(e.date).getTime() - moveTime) < 2000 && e.nurseId === move.created_by)

        if (!event) {
            event = {
                type: 'consumption_group',
                date: move.created_at,
                nurseName: userMap.get(move.created_by || '') || 'Unknown Nurse',
                nurseId: move.created_by,
                items: []
            }
            consumptionEvents.push(event)
        }

        event.items.push({
            productName: productMap.get(move.product_id) || 'Unknown Item',
            qty: Number(move.qty),
            uom: move.uom
        })
    })

    const patientAny = patient as any

    // Merge Clinical Events for Timeline
    const timelineEvents = [
        ...patient.hms_vitals.map(v => ({
            type: 'vital',
            date: v.recorded_at,
            data: v
        })),
        ...consumptionEvents
    ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())

    return (
    // Group Timeline Events by Date for World-Class Presentation
    const groupedTimeline: { [key: string]: any[] } = {};
        timelineEvents.forEach(event => {
            const dateKey = new Date(event.date || 0).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            if (!groupedTimeline[dateKey]) groupedTimeline[dateKey] = [];
            groupedTimeline[dateKey].push(event);
        });

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            {/* World-Class Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-5">
                    <Link href="/hms/patients" className="h-10 w-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full transition-colors border border-slate-200">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{patientAny.first_name} {patientAny.last_name}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${patientAny.gender === 'male' ? 'bg-blue-50 text-blue-700' :
                                    patientAny.gender === 'female' ? 'bg-pink-50 text-pink-700' : 'bg-slate-50 text-slate-700'
                                }`}>
                                {patientAny.gender || 'Unknown'}
                            </span>
                        </div>
                        <p className="text-slate-500 flex items-center gap-4 mt-1 text-sm font-medium">
                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>ID: <span className="font-mono text-slate-700">{patientAny.patient_number || 'N/A'}</span></span>
                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>Born: {patientAny.dob ? new Date(patientAny.dob).toLocaleDateString() : '-'}</span>
                            {(patientAny.contact as any)?.phone && <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span><Phone className="h-3 w-3" /> {(patientAny.contact as any).phone}</span>}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all" title="Print Medical Record">
                        <FileText className="h-4 w-4" />
                    </button>
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
                        href={`/hms/appointments/new?patient_id=${patientAny.id}`}
                        className="h-10 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium flex items-center gap-2 shadow-sm shadow-indigo-200 transition-all active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Book Visit
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Timeline (activity feed) - Spans 8 cols */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Timeline Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-indigo-600" />
                            Reference Timeline
                        </h2>
                        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{timelineEvents.length} Events</span>
                    </div>

                    {Object.keys(groupedTimeline).length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-8 w-8 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-medium">No clinical history recorded yet.</p>
                            <p className="text-slate-400 text-sm mt-1">Vitals and consumption events will appear here.</p>
                        </div>
                    ) : (
                        <div className="relative pl-8 border-l-2 border-slate-100 space-y-10">
                            {Object.entries(groupedTimeline).map(([dateString, events]) => (
                                <div key={dateString} className="relative">
                                    {/* Date Header Marker */}
                                    <div className="absolute -left-[41px] top-0 h-5 w-5 rounded-full border-4 border-white bg-slate-300 ring-4 ring-slate-50" />
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 pl-2">{dateString}</h3>

                                    <div className="space-y-4">
                                        {events.map((event: any, i: number) => (
                                            <div key={i} className="group relative bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all duration-300">
                                                {/* Line Connector to Bullet */}
                                                <div className="absolute top-1/2 -left-8 w-6 h-[2px] bg-slate-100 group-hover:bg-indigo-100 transition-colors" />

                                                <div className="flex items-start gap-5">
                                                    {/* Context Icon */}
                                                    <div className={`mt-1 h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${event.type === 'vital' ? 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600' :
                                                            'bg-gradient-to-br from-orange-50 to-amber-100 text-orange-600'
                                                        }`}>
                                                        {event.type === 'vital' ? <FileText className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className={`text-base font-bold ${event.type === 'vital' ? 'text-slate-800' : 'text-slate-900'}`}>
                                                                    {event.type === 'vital' ? 'Vitals Check' : 'Inventory Consumption'}
                                                                </h4>
                                                                {event.type === 'consumption_group' && (
                                                                    <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1">
                                                                        <User className="h-3 w-3" /> Recorded by {event.nurseName}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <span className="text-xs font-mono font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                                {event.date ? new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                            </span>
                                                        </div>

                                                        {/* Details */}
                                                        <div className="mt-4">
                                                            {event.type === 'vital' ? (
                                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
                                                                        <span className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Temp</span>
                                                                        <span className="font-mono text-sm font-bold text-slate-700">{Number(event.data.temperature) || '-'}°C</span>
                                                                    </div>
                                                                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
                                                                        <span className="block text-[10px] uppercase text-slate-400 font-bold mb-1">BP</span>
                                                                        <span className="font-mono text-sm font-bold text-slate-700">{Number(event.data.systolic)}/{Number(event.data.diastolic)}</span>
                                                                    </div>
                                                                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
                                                                        <span className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Pulse</span>
                                                                        <span className="font-mono text-sm font-bold text-slate-700">{Number(event.data.pulse) || '-'}</span>
                                                                    </div>
                                                                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
                                                                        <span className="block text-[10px] uppercase text-slate-400 font-bold mb-1">SpO2</span>
                                                                        <span className="font-mono text-sm font-bold text-slate-700">{Number(event.data.spo2) || '-'}%</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="bg-orange-50/50 rounded-xl border border-orange-100/50 overflow-hidden">
                                                                    {event.items.map((item: any, j: number) => (
                                                                        <div key={j} className="flex justify-between items-center px-4 py-2.5 border-b last:border-0 border-orange-100/50 hover:bg-white/50 transition-colors">
                                                                            <span className="font-medium text-sm text-slate-800">{item.productName}</span>
                                                                            <span className="text-xs font-bold font-mono text-orange-700 bg-orange-100/50 px-2 py-0.5 rounded ml-4 whitespace-nowrap">
                                                                                {item.qty} {item.uom}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Key Info & Actions - Spans 4 cols */}
                <div className="lg:col-span-4 space-y-6">

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 sticky top-6">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            Emergency Contact
                        </h3>
                        {(patientAny.contact as any)?.emergency_contact?.name ? (
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                <p className="font-bold text-red-900 text-lg">{(patientAny.contact as any).emergency_contact.name}</p>
                                <p className="text-red-700 text-sm font-medium mb-2">{(patientAny.contact as any).emergency_contact.relation}</p>
                                <div className="flex items-center gap-2 text-red-800 bg-white/50 p-2 rounded-lg justify-center font-mono font-bold">
                                    <Phone className="h-4 w-4" />
                                    {(patientAny.contact as any).emergency_contact.phone}
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm italic">No emergency contact on file.</p>
                        )}

                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-4">Patient Address</h3>
                            <div className="text-sm text-slate-600 leading-relaxed">
                                {(patientAny.contact as any)?.address?.street && <p>{(patientAny.contact as any).address.street}</p>}
                                <p>
                                    {[(patientAny.contact as any)?.address?.city, (patientAny.contact as any)?.address?.state].filter(Boolean).join(', ')}
                                    {(patientAny.contact as any)?.address?.zip && ` ${(patientAny.contact as any).address.zip}`}
                                </p>
                                {(patientAny.contact as any)?.address?.country && <p className="font-medium">{(patientAny.contact as any).address.country}</p>}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
