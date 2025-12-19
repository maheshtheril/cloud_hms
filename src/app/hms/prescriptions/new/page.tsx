'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Printer } from 'lucide-react'

export default function NewPrescriptionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patientId')

    const [patientInfo, setPatientInfo] = useState<any>(null)
    const [formData, setFormData] = useState({
        vitalsDate: new Date().toLocaleString(),
        oxygen: '',
        bp: '',
        pulse: '',
        temperature: '',
        diagnosis: '',
        complaint: '',
        examination: '',
        plan: '',
        prescriptions: ['', '']
    })

    // Fetch patient data
    useEffect(() => {
        if (!patientId) return;
        fetch(`/api/patients/${patientId}`)
            .then(res => res.json())
            .then(data => {
                if (data.patient) setPatientInfo(data.patient)
            })
            .catch(err => console.error(err))
    }, [patientId])

    const addPrescriptionLine = () => {
        setFormData({ ...formData, prescriptions: [...formData.prescriptions, ''] })
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-5xl mx-auto">

                {/* Action Buttons */}
                <div className="mb-4 flex gap-3 print:hidden">
                    <button onClick={() => window.print()} className="px-6 py-2 bg-green-600 text-white rounded font-semibold flex items-center gap-2">
                        <Printer className="h-4 w-4" /> Print
                    </button>
                    <button onClick={() => router.back()} className="px-6 py-2 bg-gray-500 text-white rounded font-semibold">Back</button>
                </div>

                {/* Prescription */}
                <div className="bg-white shadow-lg p-8">

                    {/* Hospital Header */}
                    <div className="text-center mb-6 pb-4 border-b-2 border-black">
                        <h1 className="text-3xl font-bold text-gray-700">HOSPITAL NAME</h1>
                        <p className="text-sm text-gray-600">(ISO 9001:2015 Certified Hospital)</p>
                    </div>

                    {/* Patient Info */}
                    <div className="grid grid-cols-2 gap-x-12 text-sm mb-4 pb-4 border-b border-gray-800">
                        <div>
                            <div className="flex mb-1"><span className="font-bold w-24">Name</span><span className="mx-2">:</span><span>{patientInfo ? `${patientInfo.first_name} ${patientInfo.last_name}`.toUpperCase() : 'Loading...'}</span></div>
                            <div className="flex mb-1"><span className="font-bold w-24">Age/Gender</span><span className="mx-2">:</span><span>{patientInfo?.age || 'N/A'}Y / {patientInfo?.gender || 'N/A'}</span></div>
                            <div className="flex mb-1"><span className="font-bold w-24">Phone</span><span className="mx-2">:</span><span>{patientInfo?.contact?.phone || 'N/A'}</span></div>
                        </div>
                        <div>
                            <div className="flex mb-1"><span className="font-bold w-24">UHID</span><span className="mx-2">:</span><span>{patientId?.substring(0, 12) || 'N/A'}</span></div>
                            <div className="flex mb-1"><span className="font-bold w-24">Speciality:</span><span className="mx-2"></span><span>EMERGENCY MEDICINE</span></div>
                        </div>
                        <div className="col-span-2">
                            <div className="flex mb-1"><span className="font-bold w-48">Assessment by:</span><span className="mx-2"></span><span>ED PHYSICIAN</span></div>
                            <div className="flex mb-1"><span className="font-bold w-48">Assessment Date & Time:</span><span className="mx-2"></span><span>{new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span></div>
                        </div>
                    </div>

                    {/* VITALS */}
                    <div className="mb-4">
                        <h3 className="font-bold text-sm mb-2">VITALS</h3>
                        <div className="grid grid-cols-5 gap-3 text-sm">
                            <div><input type="text" value={formData.vitalsDate} onChange={e => setFormData({ ...formData, vitalsDate: e.target.value })} className="w-full border-b border-gray-400 focus:outline-none" /></div>
                            <div className="flex items-center gap-2"><span className="font-semibold">Oxygen</span><span>:</span><input type="text" value={formData.oxygen} onChange={e => setFormData({ ...formData, oxygen: e.target.value })} placeholder="98" className="w-16 border-b border-gray-400 focus:outline-none" /></div>
                            <div className="flex items-center gap-2"><span className="font-semibold">BP</span><span>:</span><input type="text" value={formData.bp} onChange={e => setFormData({ ...formData, bp: e.target.value })} placeholder="120/70" className="w-20 border-b border-gray-400 focus:outline-none" /></div>
                            <div className="flex items-center gap-2"><span className="font-semibold">Pulse</span><span>:</span><input type="text" value={formData.pulse} onChange={e => setFormData({ ...formData, pulse: e.target.value })} placeholder="96" className="w-16 border-b border-gray-400 focus:outline-none" /></div>
                            <div className="flex items-center gap-2"><span className="font-semibold">Temperature (F)</span><span>:</span><input type="text" value={formData.temperature} onChange={e => setFormData({ ...formData, temperature: e.target.value })} placeholder="98" className="w-16 border-b border-gray-400 focus:outline-none" /></div>
                        </div>
                    </div>

                    {/* DIAGNOSIS */}
                    <div className="mb-4">
                        <h3 className="font-bold text-sm">DIAGNOSIS:</h3>
                        <textarea value={formData.diagnosis} onChange={e => setFormData({ ...formData, diagnosis: e.target.value })} placeholder="A/c Febrile Illness" className="w-full border-b border-gray-400 resize-none focus:outline-none text-sm" rows={2}></textarea>
                    </div>

                    {/* PRESENTING COMPLAINT */}
                    <div className="mb-4">
                        <h3 className="font-bold text-sm">PRESENTING COMPLAINT :</h3>
                        <textarea value={formData.complaint} onChange={e => setFormData({ ...formData, complaint: e.target.value })} placeholder="C/o fever & cold since 1 day. No h/o cough/throat." className="w-full border-b border-gray-400 resize-none focus:outline-none text-sm" rows={2}></textarea>
                    </div>

                    {/* GENERAL EXAMINATION */}
                    <div className="mb-4">
                        <h3 className="font-bold text-sm">GENERAL EXAMINATION :</h3>
                        <textarea value={formData.examination} onChange={e => setFormData({ ...formData, examination: e.target.value })} placeholder="Conscious and oriented&#10;&#10;CHEST- AEBE, NVBS&#10;CVS- S1 & S2 +&#10;CNS- No FND, Moving all 4 limbs&#10;P/A- Soft, Non-Tender, BS +" className="w-full border-b border-gray-400 resize-none focus:outline-none text-sm" rows={6}></textarea>
                    </div>

                    {/* PLAN */}
                    <div className="mb-4">
                        <h3 className="font-bold text-sm">PLAN:</h3>
                        <textarea value={formData.plan} onChange={e => setFormData({ ...formData, plan: e.target.value })} placeholder="Saline Gargle TID" className="w-full border-b border-gray-400 resize-none focus:outline-none text-sm" rows={2}></textarea>
                    </div>

                    {/* PRESCRIPTION */}
                    <div className="mb-6">
                        <h3 className="font-bold text-sm mb-2">PRESCRIPTION</h3>
                        {formData.prescriptions.map((rx, idx) => (
                            <div key={idx} className="flex gap-2 mb-1">
                                <span className="font-semibold text-sm">{idx + 1}.</span>
                                <input type="text" value={rx} onChange={e => {
                                    const newRx = [...formData.prescriptions]
                                    newRx[idx] = e.target.value
                                    setFormData({ ...formData, prescriptions: newRx })
                                }} placeholder="LANOL ER TAB - 1-0-1 x 3 Days" className="flex-1 border-b border-gray-400 focus:outline-none text-sm" />
                            </div>
                        ))}
                        <button onClick={addPrescriptionLine} className="mt-2 text-blue-600 text-sm print:hidden">+ Add Medicine</button>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t-2 border-black flex justify-between">
                        <div></div>
                        <div className="text-right">
                            <p className="font-bold">Ed Physician</p>
                            <p className="text-sm">Emergency Medicine</p>
                            <p className="font-bold mt-8">SIGNATURE:</p>
                            <div className="mt-12 text-sm">{new Date().toLocaleDateString()}</div>
                        </div>
                    </div>

                    {/* Hospital Footer */}
                    <div className="mt-8 text-center text-xs text-gray-600 border-t pt-4">
                        <p>Hospital Address, Contact Details</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

