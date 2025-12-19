'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Printer, Plus, Trash2, Copy } from 'lucide-react'

export default function NewPrescriptionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patientId')

    const [patientInfo, setPatientInfo] = useState<any>(null)
    const [medicines, setMedicines] = useState<any[]>([])
    const [selectedMedicines, setSelectedMedicines] = useState<any[]>([{
        medicineId: '',
        medicineName: '',
        morning: '1',
        afternoon: '0',
        evening: '1',
        night: '0',
        days: '3'
    }])

    // Prescription data
    const [prescriptionData, setPrescriptionData] = useState({
        vitals: '',
        diagnosis: '',
        complaint: '',
        examination: '',
        plan: ''
    })

    // State for loading previous prescription
    const [loadingPrevious, setLoadingPrevious] = useState(false)

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

    // Fetch medicines
    useEffect(() => {
        fetch('/api/medicines')
            .then(res => res.json())
            .then(data => {
                if (data.medicines) setMedicines(data.medicines)
            })
            .catch(err => console.error(err))
    }, [])



    const loadLastPrescription = async () => {
        if (!patientId) {
            alert('No patient selected')
            return
        }

        setLoadingPrevious(true)
        try {
            const res = await fetch(`/api/prescriptions/last?patientId=${patientId}`)
            const data = await res.json()

            if (data.success && data.data) {
                // Fill prescription data
                setPrescriptionData({
                    vitals: data.data.vitals || '',
                    diagnosis: data.data.diagnosis || '',
                    complaint: data.data.complaint || '',
                    examination: data.data.examination || '',
                    plan: data.data.plan || ''
                })

                // Fill medicines
                if (data.data.medicines && data.data.medicines.length > 0) {
                    setSelectedMedicines(data.data.medicines)
                } else {
                    setSelectedMedicines([{
                        medicineId: '',
                        medicineName: '',
                        morning: '1',
                        afternoon: '0',
                        evening: '1',
                        night: '0',
                        days: '3'
                    }])
                }

                const lastDate = new Date(data.date).toLocaleDateString()
                alert(`✅ Loaded prescription from ${lastDate}!\n\nReview and modify as needed.`)
            } else {
                alert('ℹ️ No previous prescription found for this patient.')
            }
        } catch (error) {
            console.error('Error loading previous prescription:', error)
            alert('❌ Failed to load previous prescription')
        } finally {
            setLoadingPrevious(false)
        }
    }

    const addMedicine = () => {
        setSelectedMedicines([...selectedMedicines, {
            medicineId: '',
            medicineName: '',
            morning: '1',
            afternoon: '0',
            evening: '1',
            night: '0',
            days: '3'
        }])
    }

    const updateMedicine = (index: number, field: string, value: string) => {
        const updated = [...selectedMedicines]
        updated[index][field] = value

        if (field === 'medicineId') {
            const med = medicines.find(m => m.id === value)
            if (med) updated[index].medicineName = med.name
        }

        setSelectedMedicines(updated)
    }

    const removeMedicine = (index: number) => {
        setSelectedMedicines(selectedMedicines.filter((_, i) => i !== index))
    }

    const getDosageString = (med: any) => {
        return `${med.morning}-${med.afternoon}-${med.evening}-${med.night}`
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-5xl mx-auto">

                {/* Action Buttons */}
                <div className="mb-4 flex gap-3 print:hidden">
                    <button
                        onClick={loadLastPrescription}
                        disabled={loadingPrevious || !patientId}
                        className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <Copy className="h-4 w-4" /> {loadingPrevious ? 'Loading...' : 'Copy Last Prescription'}
                    </button>
                    <button
                        onClick={async () => {
                            alert('Prescription saved!')
                            console.log('Data:', { prescriptionData, medicines: selectedMedicines, patientId })
                        }}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                    >
                        Save
                    </button>
                    <button onClick={() => window.print()} className="px-6 py-2 bg-green-600 text-white rounded font-semibold flex items-center gap-2">
                        <Printer className="h-4 w-4" /> Print
                    </button>
                    <button onClick={() => router.back()} className="px-6 py-2 bg-gray-500 text-white rounded font-semibold">Back</button>
                </div>

                {/* Prescription Form */}
                <div className="bg-white shadow-lg p-8">

                    {/* Patient Info */}
                    <div className="text-sm mb-6 pb-4 border-b-2 border-gray-800">
                        <div className="grid grid-cols-2 gap-4">
                            <div><span className="font-bold">Name:</span> {patientInfo ? `${patientInfo.first_name} ${patientInfo.last_name}`.toUpperCase() : 'Loading...'}</div>
                            <div><span className="font-bold">Age/Gender:</span> {patientInfo?.age || 'N/A'}Y / {patientInfo?.gender || 'N/A'}</div>
                            <div><span className="font-bold">UHID:</span> {patientId?.substring(0, 12) || 'N/A'}</div>
                            <div><span className="font-bold">Date:</span> {typeof window !== 'undefined' ? new Date().toLocaleDateString() : ''}</div>
                        </div>
                    </div>

                    {/* VITALS */}
                    <div className="mb-8">
                        <h3 className="font-bold text-black text-lg mb-3">VITALS</h3>
                        <textarea
                            className="w-full border-2 border-gray-300 rounded p-2 min-h-[80px] text-black focus:border-blue-500 focus:outline-none print:border-0"
                            placeholder="Type or use handwriting above..."
                            value={prescriptionData.vitals}
                            onChange={e => setPrescriptionData({ ...prescriptionData, vitals: e.target.value })}
                        ></textarea>
                    </div>

                    {/* DIAGNOSIS */}
                    <div className="mb-8">
                        <h3 className="font-bold text-black text-lg mb-3">DIAGNOSIS:</h3>
                        <textarea
                            className="w-full border-2 border-gray-300 rounded p-2 min-h-[80px] text-black focus:border-blue-500 focus:outline-none print:border-0"
                            placeholder="Type or use handwriting above..."
                            value={prescriptionData.diagnosis}
                            onChange={e => setPrescriptionData({ ...prescriptionData, diagnosis: e.target.value })}
                        ></textarea>
                    </div>

                    {/* PRESENTING COMPLAINT */}
                    <div className="mb-8">
                        <h3 className="font-bold text-black text-lg mb-3">PRESENTING COMPLAINT:</h3>
                        <textarea
                            className="w-full border-2 border-gray-300 rounded p-2 min-h-[100px] text-black focus:border-blue-500 focus:outline-none print:border-0"
                            placeholder="Type or use handwriting above..."
                            value={prescriptionData.complaint}
                            onChange={e => setPrescriptionData({ ...prescriptionData, complaint: e.target.value })}
                        ></textarea>
                    </div>

                    {/* GENERAL EXAMINATION */}
                    <div className="mb-8">
                        <h3 className="font-bold text-black text-lg mb-3">GENERAL EXAMINATION:</h3>
                        <textarea
                            className="w-full border-2 border-gray-300 rounded p-2 min-h-[150px] text-black focus:border-blue-500 focus:outline-none print:border-0"
                            placeholder="Type or use handwriting above..."
                            value={prescriptionData.examination}
                            onChange={e => setPrescriptionData({ ...prescriptionData, examination: e.target.value })}
                        ></textarea>
                    </div>

                    {/* PLAN */}
                    <div className="mb-8">
                        <h3 className="font-bold text-black text-lg mb-3">PLAN:</h3>
                        <textarea
                            className="w-full border-2 border-gray-300 rounded p-2 min-h-[100px] text-black focus:border-blue-500 focus:outline-none print:border-0"
                            placeholder="Type or use handwriting above..."
                            value={prescriptionData.plan}
                            onChange={e => setPrescriptionData({ ...prescriptionData, plan: e.target.value })}
                        ></textarea>
                    </div>

                    {/* PRESCRIPTION */}
                    <div className="mb-8">
                        <h3 className="font-bold text-black text-lg mb-3">PRESCRIPTION</h3>

                        {/* Selected Medicines */}
                        <div className="mb-4">
                            {selectedMedicines.map((med, index) => (
                                <div key={index} className="flex items-start mb-2">
                                    <span className="font-semibold mr-2">{index + 1}.</span>
                                    <div className="flex-1">
                                        <div className="font-medium">{med.medicineName || 'Select medicine'}</div>
                                        <div className="text-sm text-gray-600">
                                            {getDosageString(med)} x {med.days} Days
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeMedicine(index)}
                                        className="text-red-600 print:hidden"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Medicine Selector */}
                        <div className="print:hidden border-t-2 pt-4 mt-6">
                            <h4 className="font-semibold mb-3">Add Medicines:</h4>

                            {selectedMedicines.map((med, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 mb-3 p-3 bg-gray-50 rounded">
                                    <select
                                        value={med.medicineId}
                                        onChange={e => updateMedicine(index, 'medicineId', e.target.value)}
                                        className="col-span-4 border rounded p-2 text-sm"
                                    >
                                        <option value="">Select Medicine</option>
                                        {medicines.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>

                                    <select value={med.morning} onChange={e => updateMedicine(index, 'morning', e.target.value)} className="col-span-1 border rounded p-2 text-sm">
                                        {[0, 1, 2].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                    <span className="col-span-1 text-center text-gray-500">-</span>
                                    <select value={med.afternoon} onChange={e => updateMedicine(index, 'afternoon', e.target.value)} className="col-span-1 border rounded p-2 text-sm">
                                        {[0, 1, 2].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                    <span className="col-span-1 text-center text-gray-500">-</span>
                                    <select value={med.evening} onChange={e => updateMedicine(index, 'evening', e.target.value)} className="col-span-1 border rounded p-2 text-sm">
                                        {[0, 1, 2].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                    <span className="col-span-1 text-center text-gray-500">-</span>
                                    <select value={med.night} onChange={e => updateMedicine(index, 'night', e.target.value)} className="col-span-1 border rounded p-2 text-sm">
                                        {[0, 1, 2].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>

                                    <select value={med.days} onChange={e => updateMedicine(index, 'days', e.target.value)} className="col-span-1 border rounded p-2 text-sm">
                                        {[1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 30].map(d => <option key={d} value={d}>{d}d</option>)}
                                    </select>
                                </div>
                            ))}

                            <button
                                onClick={addMedicine}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" /> Add Medicine
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 pt-6 border-t-2 border-black flex justify-between print:mt-32">
                        <div></div>
                        <div className="text-right">
                            <p className="font-bold mb-8">SIGNATURE:</p>
                            <div className="border-b-2 border-gray-400 w-48"></div>
                            <p className="text-sm mt-2">Dr. _________________</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
