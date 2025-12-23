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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Selection Card */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white dark:border-slate-800 shadow-sm p-4">
                <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-100 dark:border-slate-800">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                        <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Patient</h2>
                        <p className="text-xs text-gray-600 dark:text-slate-400">Select patient</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-semibold text-gray-900 dark:text-slate-300">
                                Patient <span className="text-red-500">*</span>
                            </label>
                            <Link
                                href="/hms/patients/new"
                                target="_blank"
                                className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
                            >
                                <User className="h-3 w-3" />
                                New
                            </Link>
                        </div>

                        <SearchableSelect
                            options={patientOptions}
                            value={selectedPatientId}
                            onChange={() => { }}
                            placeholder="Search patient..."
                            name="patient_id"
                            required
                            isDark={true}
                            className="text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Doctor Selection Card */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white dark:border-slate-800 shadow-sm p-4">
                <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-100 dark:border-slate-800">
                    <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                        <Stethoscope className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Provider</h2>
                        <p className="text-xs text-gray-600 dark:text-slate-400">Select doctor</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-slate-300 mb-1.5">
                        Doctor / Clinician <span className="text-red-500">*</span>
                    </label>

                    <SearchableSelect
                        options={doctorOptions}
                        onChange={() => { }}
                        placeholder="Search doctor..."
                        name="clinician_id"
                        required
                        isDark={true}
                        className="text-sm"
                    />
                </div>
            </div>
        </div>
    )
}
