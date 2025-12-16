import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus } from "lucide-react"

import SearchInput from "@/components/search-input"

export default async function PatientsPage({
    searchParams
}: {
    searchParams: Promise<{
        q?: string
    }>
}) {
    const { q } = await searchParams;
    const query = q || ''

    const patients = await prisma.hms_patient.findMany({
        take: 20,
        orderBy: { updated_at: 'desc' },
        where: query ? {
            OR: [
                { first_name: { contains: query, mode: 'insensitive' } },
                { last_name: { contains: query, mode: 'insensitive' } },
                { patient_number: { contains: query, mode: 'insensitive' } }
            ]
        } : undefined
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
                    <p className="text-gray-500">Manage patient records and admission history.</p>
                </div>
                <Link
                    href="/hms/patients/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Register Patient</span>
                </Link>
            </div>

            {/* Search Bar Placeholder */}
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <SearchInput placeholder="Search patients by name, phone, or ID..." />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                        <tr>
                            <th className="p-4 font-medium">Patient Name</th>
                            <th className="p-4 font-medium">Phone</th>
                            <th className="p-4 font-medium">Gender</th>
                            <th className="p-4 font-medium">Blood Group</th>
                            <th className="p-4 font-medium">Last Visit</th>
                            <th className="p-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {patients.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No patients found. Get started by registering a new patient.
                                </td>
                            </tr>
                        ) : (
                            patients.map((patient: any) => (
                                <tr key={patient.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4">
                                        <p className="font-semibold text-gray-800">{patient.first_name} {patient.last_name}</p>
                                        <p className="text-xs text-gray-400">ID: {patient.patient_number || 'N/A'}</p>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {/* Cast contact to any to access JSON fields */}
                                        {(patient.contact as any)?.phone || (patient as any).phone || '-'}
                                    </td>
                                    <td className="p-4 text-gray-600 capitalize">{patient.gender || '-'}</td>
                                    <td className="p-4 text-gray-600">{patient.blood_group || '-'}</td>
                                    <td className="p-4 text-gray-600">
                                        {patient.updated_at ? new Date(patient.updated_at).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="p-4">
                                        <Link
                                            href={`/hms/patients/${patient.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
