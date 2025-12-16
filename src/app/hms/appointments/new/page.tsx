import { createAppointment } from "@/app/actions/appointment"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Save, Calendar, User, Stethoscope, FileText, CheckCircle } from "lucide-react"

export default async function NewAppointmentPage({
    searchParams
}: {
    searchParams: Promise<{
        patient_id?: string
        date?: string
        time?: string
    }>
}) {
    // Await searchParams before accessing
    const resolvedParams = await searchParams;
    const { patient_id, date, time } = resolvedParams;

    // Fetch data for dropdowns
    const patients = await prisma.hms_patient.findMany({
        take: 50,
        orderBy: { updated_at: 'desc' },
        select: { id: true, first_name: true, last_name: true, patient_number: true }
    })

    const doctors = await prisma.hms_clinicians.findMany({
        where: { is_active: true },
        select: { id: true, first_name: true, last_name: true, hms_specializations: { select: { name: true } } }
    })

    const selectedPatientId = patient_id || ''

    return (
        <form action={async (formData) => {
            'use server'
            await createAppointment(formData)
        }} className="max-w-5xl mx-auto space-y-8 pb-12">

            {/* Sticky Header */}
            <div className="flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 -mx-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <Link href="/hms/appointments" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Book Appointment</h1>
                        <p className="text-gray-500 text-sm">Schedule a new patient visit.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/hms/appointments" className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm">
                        Cancel
                    </Link>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2 shadow-sm">
                        <CheckCircle className="h-4 w-4" />
                        Confirm Booking
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Col: Who & When */}
                <div className="space-y-8">
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-3">
                            <User className="h-5 w-5 text-blue-600" />
                            Patient & Provider
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Patient <span className="text-red-500">*</span></label>
                                <select
                                    name="patient_id"
                                    required
                                    defaultValue={selectedPatientId}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="">Select Patient</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.first_name} {p.last_name} ({p.patient_number})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Doctor / Clinician <span className="text-red-500">*</span></label>
                                <select
                                    name="clinician_id"
                                    required
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="">Select Doctor</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>
                                            Dr. {d.first_name} {d.last_name} - {d.hms_specializations?.name || 'General'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-3">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            Date & Time
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
                                <input type="date" name="date" required defaultValue={date} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Time <span className="text-red-500">*</span></label>
                                <input type="time" name="time" required defaultValue={time} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Col: Visit Details */}
                <div className="space-y-8">
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-3">
                            <Stethoscope className="h-5 w-5 text-purple-600" />
                            Visit Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Visit Type</label>
                                <select name="type" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                    <option value="consultation">Initial Consultation</option>
                                    <option value="follow_up">Follow Up</option>
                                    <option value="emergency">Emergency</option>
                                    <option value="procedure">Procedure</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Mode</label>
                                <select name="mode" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                    <option value="in_person">In-Person</option>
                                    <option value="video">Video Call</option>
                                    <option value="phone">Phone</option>
                                </select>
                            </div>

                            <div className="col-span-full space-y-1">
                                <label className="text-sm font-medium text-gray-700">Priority</label>
                                <div className="flex gap-4 p-2 bg-gray-50 rounded-lg">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="priority" value="low" className="text-blue-600" />
                                        <span className="text-sm text-gray-600">Low</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="priority" value="normal" defaultChecked className="text-blue-600" />
                                        <span className="text-sm text-gray-600">Normal</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="priority" value="high" className="text-blue-600" />
                                        <span className="text-sm text-gray-600">High</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="priority" value="urgent" className="text-red-600" />
                                        <span className="text-sm text-red-600 font-medium">Urgent</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-3">
                            <FileText className="h-5 w-5 text-gray-500" />
                            Chief Complaint / Notes
                        </h2>
                        <div className="space-y-1">
                            {/* <label className="text-sm font-medium text-gray-700">Notes</label> */}
                            <textarea
                                name="notes"
                                rows={4}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Reason for visit, symptoms, or internal notes..."
                            ></textarea>
                        </div>
                    </section>
                </div>

            </div>
        </form>
    )
}
