'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar, User, Phone, Stethoscope, FileText, Save, Printer } from 'lucide-react'

export default function NewPrescriptionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patientId')

    const [patientInfo, setPatientInfo] = useState<any>(null)
    const [vitals, setVitals] = useState({
        bp: '',
        oxygen: '',
        pulse: '',
        temperature: ''
    })
    const [diagnosis, setDiagnosis] = useState('')
    const [complaint, setComplaint] = useState('')
    const [examination, setExamination] = useState('')
    const [plan, setPlan] = useState('')
    const [medicines, setMedicines] = useState<any[]>([])
    const [newMedicine, setNewMedicine] = useState({ name: '', dosage: '', duration: '' })

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

    const addMedicine = () => {
        if (newMedicine.name) {
            setMedicines([...medicines, { ...newMedicine, id: Date.now() }])
            setNewMedicine({ name: '', dosage: '', duration: '' })
        }
    }

    const removeMedicine = (id: number) => {
        setMedicines(medicines.filter(m => m.id !== id))
    }

    const savePrescription = async () => {
        // TODO: Implement save to database
        alert('Prescription saved! (Database integration pending)')
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg border-2 border-gray-300">

                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-lg">
                    <h1 className="text-3xl font-bold text-center">MEDICAL PRESCRIPTION</h1>
                </div>

                <div className="p-8">
                    {/* Patient Information */}
                    <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b-2">
                        <div>
                            <label className="font-semibold text-gray-700">Name:</label>
                            <p className="text-lg">{patientInfo ? `${patientInfo.first_name} ${patientInfo.last_name}` : 'Loading...'}</p>
                        </div>
                        <div>
                            <label className="font-semibold text-gray-700">UHID:</label>
                            <p className="text-lg">{patientId?.substring(0, 12) || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="font-semibold text-gray-700">Age/Gender:</label>
                            <p className="text-lg">{patientInfo?.age || 'N/A'} / {patientInfo?.gender || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="font-semibold text-gray-700">Speciality:</label>
                            <p className="text-lg">General Medicine</p>
                        </div>
                        <div>
                            <label className="font-semibold text-gray-700">Phone:</label>
                            <p className="text-lg">{patientInfo?.contact?.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="font-semibold text-gray-700">Assessment Date & Time:</label>
                            <p className="text-lg">{new Date().toLocaleString()}</p>
                        </div>
                    </div>

                    {/* VITALS */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <Stethoscope className="h-5 w-5" />
                            VITALS
                        </h2>
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600">BP</label>
                                <input
                                    type="text"
                                    value={vitals.bp}
                                    onChange={e => setVitals({ ...vitals, bp: e.target.value })}
                                    placeholder="120/70"
                                    className="w-full border-2 border-gray-300 rounded p-2 mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Oxygen (%)</label>
                                <input
                                    type="text"
                                    value={vitals.oxygen}
                                    onChange={e => setVitals({ ...vitals, oxygen: e.target.value })}
                                    placeholder="98"
                                    className="w-full border-2 border-gray-300 rounded p-2 mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Pulse</label>
                                <input
                                    type="text"
                                    value={vitals.pulse}
                                    onChange={e => setVitals({ ...vitals, pulse: e.target.value })}
                                    placeholder="96"
                                    className="w-full border-2 border-gray-300 rounded p-2 mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Temperature (F)</label>
                                <input
                                    type="text"
                                    value={vitals.temperature}
                                    onChange={e => setVitals({ ...vitals, temperature: e.target.value })}
                                    placeholder="98"
                                    className="w-full border-2 border-gray-300 rounded p-2 mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* DIAGNOSIS */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">DIAGNOSIS:</h2>
                        <textarea
                            value={diagnosis}
                            onChange={e => setDiagnosis(e.target.value)}
                            placeholder="Enter diagnosis..."
                            className="w-full border-2 border-gray-300 rounded p-3 h-20"
                        />
                    </div>

                    {/* PRESENTING COMPLAINT */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">PRESENTING COMPLAINT:</h2>
                        <textarea
                            value={complaint}
                            onChange={e => setComplaint(e.target.value)}
                            placeholder="E.g., C/o fever & cold since 1 day..."
                            className="w-full border-2 border-gray-300 rounded p-3 h-20"
                        />
                    </div>

                    {/* GENERAL EXAMINATION */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">GENERAL EXAMINATION:</h2>
                        <textarea
                            value={examination}
                            onChange={e => setExamination(e.target.value)}
                            placeholder="E.g., Conscious and oriented, CHEST- AEBE, NVBS, CVS- S1 & S2 +..."
                            className="w-full border-2 border-gray-300 rounded p-3 h-24"
                        />
                    </div>

                    {/* PLAN */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">PLAN:</h2>
                        <textarea
                            value={plan}
                            onChange={e => setPlan(e.target.value)}
                            placeholder="E.g., Saline Gargle TID..."
                            className="w-full border-2 border-gray-300 rounded p-3 h-20"
                        />
                    </div>

                    {/* PRESCRIPTION */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">PRESCRIPTION:</h2>

                        {/* Medicine List */}
                        <div className="mb-4">
                            {medicines.map((med, index) => (
                                <div key={med.id} className="flex items-center gap-3 mb-2 p-3 bg-gray-50 rounded border">
                                    <span className="font-semibold w-8">{index + 1}.</span>
                                    <span className="flex-1">{med.name}</span>
                                    <span className="text-gray-600">{med.dosage}</span>
                                    <span className="text-gray-600">{med.duration}</span>
                                    <button
                                        onClick={() => removeMedicine(med.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Medicine Form */}
                        <div className="grid grid-cols-12 gap-2">
                            <input
                                type="text"
                                placeholder="Medicine Name (e.g., LANOL ER TAB)"
                                value={newMedicine.name}
                                onChange={e => setNewMedicine({ ...newMedicine, name: e.target.value })}
                                className="col-span-5 border-2 border-gray-300 rounded p-2"
                            />
                            <input
                                type="text"
                                placeholder="Dosage (e.g., 1-0-1)"
                                value={newMedicine.dosage}
                                onChange={e => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                                className="col-span-3 border-2 border-gray-300 rounded p-2"
                            />
                            <input
                                type="text"
                                placeholder="Duration (e.g., x 3 Days)"
                                value={newMedicine.duration}
                                onChange={e => setNewMedicine({ ...newMedicine, duration: e.target.value })}
                                className="col-span-3 border-2 border-gray-300 rounded p-2"
                            />
                            <button
                                onClick={addMedicine}
                                className="col-span-1 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Footer - Doctor Signature */}
                    <div className="mt-8 pt-6 border-t-2 flex justify-between items-end">
                        <div>
                            <p className="font-semibold text-gray-700">Physician</p>
                            <p className="text-gray-600">General Medicine</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-gray-700">SIGNATURE:</p>
                            <div className="border-b-2 border-gray-400 w-48 h-16"></div>
                            <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex gap-3">
                        <button
                            onClick={savePrescription}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                        >
                            <Save className="h-5 w-5" />
                            Save Prescription
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                        >
                            <Printer className="h-5 w-5" />
                            Print
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="px-6 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-bold"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
