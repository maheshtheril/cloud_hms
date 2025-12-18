'use client'

import { useState } from 'react'
import { removeSeedPatients, checkSeedPatients } from '@/app/actions/admin'
import { AlertCircle, CheckCircle, Trash2, Search } from 'lucide-react'

export default function DatabaseCleanupPage() {
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleCheck = async () => {
        setChecking(true)
        setResult(null)
        try {
            const res = await checkSeedPatients()
            setResult(res)
        } catch (error) {
            setResult({
                success: false,
                error: 'Failed to check seed patients'
            })
        } finally {
            setChecking(false)
        }
    }

    const handleRemove = async () => {
        if (!confirm('Are you sure you want to remove seed patient data? This action cannot be undone.')) {
            return
        }

        setLoading(true)
        setResult(null)
        try {
            const res = await removeSeedPatients()
            setResult(res)
        } catch (error) {
            setResult({
                success: false,
                error: 'Failed to remove seed patients'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
                        <h1 className="text-3xl font-bold text-white">Database Cleanup</h1>
                        <p className="text-blue-100 mt-2">
                            Remove seed patient data that appears in new tenants
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Information Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-semibold mb-2">What this does:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li>Removes two seed patient records from the database</li>
                                        <li>These records were causing duplicate patients for new tenants</li>
                                        <li>The tenant filtering fix has already been applied, so this is optional</li>
                                        <li>Only admin users can perform this action</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleCheck}
                                disabled={checking || loading}
                                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Search className="h-5 w-5" />
                                <span>{checking ? 'Checking...' : 'Check Seed Patients'}</span>
                            </button>

                            <button
                                onClick={handleRemove}
                                disabled={loading || checking}
                                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 className="h-5 w-5" />
                                <span>{loading ? 'Removing...' : 'Remove Seed Patients'}</span>
                            </button>
                        </div>

                        {/* Results */}
                        {result && (
                            <div className={`rounded-lg p-4 ${result.success
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-red-50 border border-red-200'
                                }`}>
                                <div className="flex gap-3">
                                    {result.success ? (
                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <p className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'
                                            }`}>
                                            {result.success ? 'Success' : 'Error'}
                                        </p>
                                        <p className={`text-sm mt-1 ${result.success ? 'text-green-700' : 'text-red-700'
                                            }`}>
                                            {result.message || result.error}
                                        </p>

                                        {/* Show patient details if found */}
                                        {result.patients && result.patients.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-sm font-semibold text-gray-700 mb-2">
                                                    Patient Records:
                                                </p>
                                                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-3 py-2 text-left font-medium text-gray-700">Name</th>
                                                                <th className="px-3 py-2 text-left font-medium text-gray-700">Patient #</th>
                                                                <th className="px-3 py-2 text-left font-medium text-gray-700">Tenant ID</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {result.patients.map((patient: any) => (
                                                                <tr key={patient.id}>
                                                                    <td className="px-3 py-2 text-gray-800">
                                                                        {patient.first_name} {patient.last_name}
                                                                    </td>
                                                                    <td className="px-3 py-2 text-gray-600">
                                                                        {patient.patient_number}
                                                                    </td>
                                                                    <td className="px-3 py-2 text-gray-500 font-mono text-xs">
                                                                        {patient.tenant_id?.substring(0, 8)}...
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {result.deleted !== undefined && (
                                            <p className="text-sm mt-2 text-green-700">
                                                Deleted: {result.deleted} record(s)
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer Note */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
                            <p className="font-semibold mb-1">Note:</p>
                            <p>
                                The tenant filtering has already been implemented in the code, so even if these
                                seed records exist, they will not appear for new tenants. This cleanup is
                                recommended but optional for maintaining a clean database.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
