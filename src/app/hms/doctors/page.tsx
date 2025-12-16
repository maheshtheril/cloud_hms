import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Stethoscope, Plus } from "lucide-react"

import SearchInput from "@/components/search-input"

export default async function DoctorsPage({
    searchParams
}: {
    searchParams: Promise<{
        q?: string
    }>
}) {
    const { q } = await searchParams;
    const query = q || ''

    // Fetch clinicians with their related role and specialization
    const doctors = await prisma.hms_clinicians.findMany({
        orderBy: { created_at: 'desc' },
        where: query ? {
            OR: [
                { first_name: { contains: query, mode: 'insensitive' } },
                { last_name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
                // Check related specialization name if possible, or local field if used. 
                // Based on previous schema inspection, relation is hms_specializations.
                {
                    hms_specializations: {
                        name: { contains: query, mode: 'insensitive' }
                    }
                }
            ]
        } : undefined,
        include: {
            hms_roles: true,
            hms_specializations: true
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Doctors & Staff</h1>
                    <p className="text-gray-500">Manage your clinical team.</p>
                </div>
                <Link href="/hms/doctors/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                    <Plus className="h-4 w-4" />
                    Add Doctor
                </Link>
            </div>

            {/* Search (Placeholder) */}
            {/* Search */}
            <div className="relative">
                <SearchInput placeholder="Search doctors by name or specialization..." />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Name</th>
                            <th className="p-4 font-semibold text-gray-600">Specialization</th>
                            <th className="p-4 font-semibold text-gray-600">Role</th>
                            <th className="p-4 font-semibold text-gray-600">License No</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {doctors.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No doctors found. Add your first clinical staff member.
                                </td>
                            </tr>
                        ) : (
                            doctors.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">
                                        <Link href={`/hms/doctors/${doc.id}`} className="hover:text-blue-600 transition-colors">
                                            Dr. {doc.first_name} {doc.last_name}
                                        </Link>
                                        <div className="text-xs text-gray-400 font-normal">{doc.email}</div>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
                                            {doc.hms_specializations?.name || 'General'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">{doc.hms_roles?.name || '-'}</td>
                                    <td className="p-4 text-gray-500 font-mono text-sm">{doc.license_no}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${doc.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {doc.is_active ? 'Active' : 'Inactive'}
                                        </span>
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
