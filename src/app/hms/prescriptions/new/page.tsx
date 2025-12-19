'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Save, Printer } from 'lucide-react'

export default function NewPrescriptionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patientId')

    const [patientInfo, setPatientInfo] = useState<any>(null)
    const [prescriptionData, setPrescriptionData] = useState({
        vitals: '',
        diagnosis: '',
        complaint: '',
        examination: '',
        plan: '',
        prescription: ''
    })

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

    const savePrescription = async () => {
        // TODO: Implement save to database
        alert('Prescription saved!')
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-5xl mx-auto">

                {/* Action Buttons - Top */}
                <div className="mb-4 flex gap-3 print:hidden">
                    <button
                        onClick={savePrescription}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        Save
                    </button>
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
                <div className="bg-white shadow-lg" style={{ minHeight: '1000px' }}>

                    {/* Header - Patient Info */}
                    <div className="border-b-2 border-black p-4">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <div className="flex">
                                <span className="font-bold w-32">Name</span>
                                <span className="mx-2">:</span>
                                <span>{patientInfo ? `${patientInfo.first_name} ${patientInfo.last_name}` : 'Loading...'}</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold w-32">UHID</span>
                                <span className="mx-2">:</span>
                                <span>{patientId?.substring(0, 12) || 'N/A'}</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold w-32">Age/Gender</span>
                                <span className="mx-2">:</span>
                                <span>{patientInfo?.age || 'N/A'} / {patientInfo?.gender || 'N/A'}</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold w-32">Speciality</span>
                                <span className="mx-2">:</span>
                                <span>EMERGENCY MEDICINE</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold w-32">Phone</span>
                                <span className="mx-2">:</span>
                                <span>{patientInfo?.contact?.phone || 'N/A'}</span>
                            </div>
                            <div className="flex col-span-2">
                                <span className="font-bold w-32">Assessment Date & Time</span>
                                <span className="mx-2">:</span>
                                <span>ED PHYSICIAN</span>
                                <span className="ml-16">{new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Writing Pad Area */}
                    <div className="p-6">

                        {/* VITALS */}
                        <div className="mb-6">
                            <h3 className="font-bold text-sm mb-2">VITALS</h3>
                            <div
                                contentEditable
                                suppressContentEditableWarning
                                className="min-h-[60px] border-b border-gray-300 focus:outline-none focus:border-blue-500 p-2"
                                onInput={(e) => setPrescriptionData({ ...prescriptionData, vitals: e.currentTarget.textContent || '' })}
                            ></div>
                        </div>

                        {/* DIAGNOSIS */}
                        <div className="mb-6">
                            <h3 className="font-bold text-sm">DIAGNOSIS:</h3>
                            <div
                                contentEditable
                                suppressContentEditableWarning
                                className="min-h-[50px] border-b border-gray-300 focus:outline-none focus:border-blue-500 p-2"
                                onInput={(e) => setPrescriptionData({ ...prescriptionData, diagnosis: e.currentTarget.textContent || '' })}
                            ></div>
                        </div>

                        {/* PRESENTING COMPLAINT */}
                        <div className="mb-6">
                            <h3 className="font-bold text-sm">PRESENTING COMPLAINT :</h3>
                            <div
                                contentEditable
                                suppressContentEditableWarning
                                className="min-h-[60px] border-b border-gray-300 focus:outline-none focus:border-blue-500 p-2"
                                onInput={(e) => setPrescriptionData({ ...prescriptionData, complaint: e.currentTarget.textContent || '' })}
                            ></div>
                        </div>

                        {/* GENERAL EXAMINATION */}
                        <div className="mb-6">
                            <h3 className="font-bold text-sm">GENERAL EXAMINATION :</h3>
                            <div
                                contentEditable
                                suppressContentEditableWarning
                                className="min-h-[100px] border-b border-gray-300 focus:outline-none focus:border-blue-500 p-2"
                                onInput={(e) => setPrescriptionData({ ...prescriptionData, examination: e.currentTarget.textContent || '' })}
                            ></div>
                        </div>

                        {/* PLAN */}
                        <div className="mb-6">
                            <h3 className="font-bold text-sm">PLAN:</h3>
                            <div
                                contentEditable
                                suppressContentEditableWarning
                                className="min-h-[60px] border-b border-gray-300 focus:outline-none focus:border-blue-500 p-2"
                                onInput={(e) => setPrescriptionData({ ...prescriptionData, plan: e.currentTarget.textContent || '' })}
                            ></div>
                        </div>

                        {/* PRESCRIPTION */}
                        <div className="mb-8">
                            <h3 className="font-bold text-sm mb-3">PRESCRIPTION</h3>
                            <div
                                contentEditable
                                suppressContentEditableWarning
                                className="min-h-[150px] border-b border-gray-300 focus:outline-none focus:border-blue-500 p-2"
                                onInput={(e) => setPrescriptionData({ ...prescriptionData, prescription: e.currentTarget.textContent || '' })}
                            ></div>
                        </div>

                        {/* Footer - Doctor Signature */}
                        <div className="mt-16 pt-6 border-t-2 border-black flex justify-between">
                            <div>
                                <p className="font-bold">Ed Physician</p>
                                <p className="text-sm">Emergency Medicine</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold mb-12">SIGNATURE:</p>
                                <p className="text-sm">_________________</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
