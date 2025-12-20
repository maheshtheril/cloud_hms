'use client'

import { SearchableSelect } from '@/components/appointments/searchable-select'
import { User, Stethoscope } from 'lucide-react'
import Link from 'next/link'

interface Patient {
    id: string
    first_name: string
    last_name: string | null
    patient_number: string | null
    gender: string | null
}

interface Doctor {
    id: string
    first_name: string
    last_name: string
    hms_specializations: { name: string } | null
    role: string | null
}

export function PatientDoctorSelectors({
    patients,
    doctors,
    selectedPatientId
}: {
    patients: Patient[]
    doctors: Doctor[]
    selectedPatientId: string
}) {
    const patientOptions = patients.map(p => ({
        id: p.id,
        label: `${p.first_name} ${p.last_name || ''}`.trim(),
        subtitle: `${p.patient_number || 'No Number'} • ${p.gender || 'N/A'}`
    }))

    const doctorOptions = doctors.map(d => ({
        id: d.id,
        label: `Dr. ${d.first_name} ${d.last_name}`,
        subtitle: d.hms_specializations?.name || d.role || 'General Practice'
    }))

    return (
        <>
            {/* Patient Selection Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-xl shadow-blue-100/50 p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Patient Information</h2>
                        <p className="text-sm text-gray-600">Select the patient for this appointment</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-gray-900">
                                Patient <span className="text-red-500">*</span>
                            </label>
                            <Link
                                href="/hms/patients/new"
                                target="_blank"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-medium rounded-lg hover:shadow-md transition-all"
                            >
                                <User className="h-3.5 w-3.5" />
                                Quick Add Patient
                            </Link>
                        </div>

                        <SearchableSelect
                            options={patientOptions}
                            value={selectedPatientId}
                            onChange={() => { }}
                            placeholder="Search patient by name or number"
                            name="patient_id"
                            required
                        />

                        <p className="mt-2 text-xs text-gray-500">
                            💡 Tip: Type patient name or number to search. Use Quick Add button to register new patients.
                        </p>
                    </div>
                </div>
            </div>

            {/* Doctor Selection Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-xl shadow-blue-100/50 p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Stethoscope className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Healthcare Provider</h2>
                        <p className="text-sm text-gray-600">Select attending doctor or clinician</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Doctor / Clinician <span className="text-red-500">*</span>
                    </label>

                    <SearchableSelect
                        options={doctorOptions}
                        onChange={() => { }}
                        placeholder="Search doctor by name"
                        name="clinician_id"
                        required
                    />
                </div>
            </div>
        </>
    )
}
