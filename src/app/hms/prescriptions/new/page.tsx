'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Save, Printer } from 'lucide-react'

export default function NewPrescriptionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patientId')

    const [patientInfo, setPatientInfo] = useState<any>(null)

    // Fetch patient data
    useEffect(() => {
        if (!patientId) return;

        fetch(`/api/patients/${patientId}`)
            .then(res => res.json())
            .then(data => {
                if (data.patient) {
                    setPatientInfo(data.patient)
                }
            })
            .catch(err => console.error('Failed to fetch patient:', err))
    }, [patientId])

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-5xl mx-auto">

                {/* Action Buttons */}
                <div className="mb-4 flex gap-3 print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold flex items-center gap-2"
                    >
                        <Printer className="h-4 w-4" />
                        Print
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded font-semibold"
                    >
                        Back
                    </button>
                </div>

                {/* Prescription Pad */}
                <div className="bg-white shadow-lg border-2 border-gray-800">

                    {/* Header */}
                    <div className="border-b-4 border-black p-6">
                        <table className="w-full text-sm">
                            <tbody>
                                <tr>
                                    <td className="font-bold py-1 w-32">Name</td>
                                    <td className="px-2">:</td>
                                    <td className="py-1">{patientInfo ? `${patientInfo.first_name} ${patientInfo.last_name}`.toUpperCase() : 'Loading...'}</td>
                                    <td className="font-bold py-1 w-32">UHID</td>
                                    <td className="px-2">:</td>
                                    <td className="py-1">{patientId?.substring(0, 12) || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold py-1">Age/Gender</td>
                                    <td className="px-2">:</td>
                                    <td className="py-1">{patientInfo?.age || 'N/A'}Y / {patientInfo?.gender || 'N/A'}</td>
                                    <td className="font-bold py-1">Speciality:</td>
                                    <td className="px-2"></td>
                                    <td className="py-1">EMERGENCY MEDICINE</td>
                                </tr>
                                <tr>
                                    <td className="font-bold py-1">Phone</td>
                                    <td className="px-2">:</td>
                                    <td className="py-1">{patientInfo?.contact?.phone || 'N/A'}</td>
                                    <td colSpan={3}></td>
                                </tr>
                                <tr>
                                    <td className="font-bold py-1">Assessment by:</td>
                                    <td className="px-2"></td>
                                    <td className="py-1">ED PHYSICIAN</td>
                                    <td colSpan={3}></td>
                                </tr>
                                <tr>
                                    <td className="font-bold py-1">Assessment Date & Time:</td>
                                    <td className="px-2"></td>
                                    <td className="py-1" colSpan={4}>{new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Body - Writing Areas */}
                    <div className="p-6">

                        {/* VITALS */}
                        <div className="mb-8">
                            <h3 className="font-bold text-base mb-2">VITALS</h3>
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="border-b border-gray-400 h-6"></div>
                                ))}
                            </div>
                        </div>

                        {/* DIAGNOSIS */}
                        <div className="mb-8">
                            <h3 className="font-bold text-base mb-2">DIAGNOSIS:</h3>
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="border-b border-gray-400 h-6"></div>
                                ))}
                            </div>
                        </div>

                        {/* PRESENTING COMPLAINT */}
                        <div className="mb-8">
                            <h3 className="font-bold text-base mb-2">PRESENTING COMPLAINT :</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="border-b border-gray-400 h-6"></div>
                                ))}
                            </div>
                        </div>

                        {/* GENERAL EXAMINATION */}
                        <div className="mb-8">
                            <h3 className="font-bold text-base mb-2">GENERAL EXAMINATION :</h3>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="border-b border-gray-400 h-6"></div>
                                ))}
                            </div>
                        </div>

                        {/* PLAN */}
                        <div className="mb-8">
                            <h3 className="font-bold text-base mb-2">PLAN:</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="border-b border-gray-400 h-6"></div>
                                ))}
                            </div>
                        </div>

                        {/* PRESCRIPTION */}
                        <div className="mb-12">
                            <h3 className="font-bold text-base mb-3">PRESCRIPTION</h3>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="border-b border-gray-400 h-6"></div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-24 pt-6 border-t-4 border-black flex justify-between">
                            <div>
                                <p className="font-bold">Ed Physician</p>
                                <p className="text-sm mt-1">Emergency Medicine</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold mb-16">SIGNATURE:</p>
                                <div className="border-b-2 border-black w-48"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
