'use client'

import { createPatient } from "@/app/actions/patient"
import Link from "next/link"
import { X, User, Phone, Calendar, ChevronDown, Camera, Upload } from "lucide-react"
import { useActionState, useState } from "react"

const initialState = {
    error: "",
    success: false
}

interface CreatePatientFormProps {
    tenantCountry?: string
}

export function CreatePatientForm({ tenantCountry = 'IN' }: CreatePatientFormProps) {
    const [state, action, isPending] = useActionState(createPatient, initialState);
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [useAge, setUseAge] = useState(true); // Toggle between Age and DOB
    const [age, setAge] = useState('');
    const [ageUnit, setAgeUnit] = useState('Years');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');

    // Auto-calculate DOB from Age
    const handleAgeChange = (value: string, unit: string) => {
        setAge(value);
        setAgeUnit(unit);

        if (value) {
            const currentDate = new Date();
            let years = 0;

            if (unit === 'Years') {
                years = parseInt(value);
            } else if (unit === 'Months') {
                years = parseInt(value) / 12;
            } else if (unit === 'Days') {
                years = parseInt(value) / 365;
            }

            const birthYear = currentDate.getFullYear() - Math.floor(years);
            const calculatedDob = new Date(birthYear, currentDate.getMonth(), currentDate.getDate());
            setDob(calculatedDob.toISOString().split('T')[0]);
        }
    };

    // Auto-calculate Age from DOB
    const handleDobChange = (value: string) => {
        setDob(value);

        if (value) {
            const birthDate = new Date(value);
            const today = new Date();
            let ageYears = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                ageYears--;
            }

            setAge(ageYears.toString());
            setAgeUnit('Years');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Add New Patient</h2>
                    <Link href="/hms/patients" className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                        <X className="h-6 w-6" />
                    </Link>
                </div>

                <form action={action} className="flex-1 overflow-y-auto p-4 space-y-3">

                    {state?.error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg">
                            {state.error}
                        </div>
                    )}

                    {/* Basic Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Patient Name */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
                                Patient Name<span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <select className="w-28 px-2 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none bg-white text-gray-900 cursor-pointer text-sm">
                                    <option value="">Title</option>
                                    <option>Mr</option>
                                    <option>Mrs</option>
                                    <option>Ms</option>
                                    <option>Dr</option>
                                    <option>Md</option>
                                    <option>Smt</option>
                                    <option>Baby</option>
                                    <option>Master</option>
                                    <option>Sri</option>
                                    <option>Kumari</option>
                                </select>
                                <div className="relative flex-1">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        name="first_name"
                                        required
                                        placeholder="Enter Name"
                                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900"
                                    />
                                </div>
                            </div>
                            <p className="text-[10px] text-red-500">Enter the Name of the Patient</p>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
                                Phone Number<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    name="phone"
                                    required
                                    type="tel"
                                    placeholder="Enter Number"
                                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
                                Gender<span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                {['M', 'F', 'Other'].map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setGender(g)}
                                        className={`flex-1 py-2 rounded-lg border-2 font-semibold transition-all ${gender === g
                                            ? 'bg-blue-500 border-blue-500 text-white'
                                            : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300'
                                            }`}
                                    >
                                        {g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other'}
                                    </button>
                                ))}
                            </div>
                            <input type="hidden" name="gender" value={gender.toLowerCase()} />
                        </div>

                        {/* Age or DOB */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
                                Age or DOB<span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-1.5">
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => handleAgeChange(e.target.value, ageUnit)}
                                    placeholder="Age"
                                    className="w-16 px-2 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all text-blue-500 font-medium text-sm text-center"
                                />
                                <select
                                    value={ageUnit}
                                    onChange={(e) => handleAgeChange(age, e.target.value)}
                                    className="px-2 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none bg-white text-gray-900 cursor-pointer text-xs"
                                >
                                    <option>Years</option>
                                    <option>Months</option>
                                    <option>Days</option>
                                </select>
                                <div className="relative flex-1">
                                    <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="date"
                                        name="dob"
                                        value={dob}
                                        onChange={(e) => handleDobChange(e.target.value)}
                                        placeholder="DOB"
                                        className="w-full pl-8 pr-2 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all text-gray-900 text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preferred Language */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Preferred Language</label>
                            <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none bg-white text-gray-900 cursor-pointer text-sm">
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Tamil</option>
                                <option>Telugu</option>
                                <option>Marathi</option>
                            </select>
                        </div>

                        {/* City */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">City</label>
                            <input
                                name="city"
                                placeholder="Enter City"
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all text-gray-900 text-sm"
                            />
                        </div>

                        {/* Address */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Address</label>
                            <input
                                name="street"
                                placeholder="Enter Address"
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all text-gray-900 text-sm"
                            />
                        </div>

                        {/* Pin */}
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Pin</label>
                            <input
                                name="zip"
                                placeholder="Enter Pin"
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all text-gray-900 text-sm"
                            />
                        </div>
                    </div>

                    {/* More Details Toggle */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setShowMoreDetails(!showMoreDetails)}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                            If you want to add more details, <span className="underline">Click Here</span>
                        </button>
                    </div>

                    {/* Additional Details Section */}
                    {showMoreDetails && (
                        <div className="space-y-6 border-t-2 border-gray-200 pt-6">
                            <h3 className="font-bold text-gray-800 text-base">Additional Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Marital Status */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Marital Status</label>
                                    <div className="flex gap-2">
                                        <select className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none bg-white text-gray-900 cursor-pointer">
                                            <option>Marital Status</option>
                                            <option>Single</option>
                                            <option>Married</option>
                                            <option>Divorced</option>
                                            <option>Widowed</option>
                                        </select>
                                        <div className="relative w-40">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="date"
                                                placeholder="Since"
                                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-900"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Blood Group */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Blood Group</label>
                                    <select
                                        name="blood_group"
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none bg-white text-gray-900 cursor-pointer"
                                    >
                                        <option value="">Blood group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option>B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>

                                {/* Spouse Name */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Spouse Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            placeholder="Enter Spouse Name"
                                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-900"
                                        />
                                    </div>
                                </div>

                                {/* Spouse Blood Group */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Spouse Blood Group</label>
                                    <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none bg-white text-gray-900 cursor-pointer">
                                        <option>Blood group</option>
                                        <option>A+</option>
                                        <option>A-</option>
                                        <option>B+</option>
                                        <option>B-</option>
                                        <option>AB+</option>
                                        <option>AB-</option>
                                        <option>O+</option>
                                        <option>O-</option>
                                    </select>
                                </div>

                                {/* Referred By */}
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Referred By</label>
                                    <div className="flex gap-2">
                                        <input
                                            placeholder="Doctor Name"
                                            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-900 text-blue-400"
                                        />
                                        <select className="w-48 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none bg-white text-gray-900 cursor-pointer">
                                            <option>Speciality</option>
                                            <option>Cardiology</option>
                                            <option>Neurology</option>
                                            <option>Orthopedics</option>
                                            <option>Pediatrics</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Existing ID */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Existing ID (if any)</label>
                                    <input
                                        placeholder="Enter ID"
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-900"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Enter Email"
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-900"
                                    />
                                </div>

                                {/* Channel */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Channel (How did the patient hear about you?)</label>
                                    <input
                                        placeholder="Enter Channel"
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-900"
                                    />
                                </div>

                                {/* C/O */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">C/O</label>
                                    <input
                                        placeholder="Enter C/O"
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-900"
                                    />
                                </div>

                                {/* Occupation */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Occupation</label>
                                    <input
                                        placeholder="Enter Occupation"
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-900"
                                    />
                                </div>

                                {/* Tag */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Tag</label>
                                    <input
                                        placeholder="Enter Tag"
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-900"
                                    />
                                </div>

                                {/* Mobile 2 */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Mobile 2</label>
                                    <input
                                        type="tel"
                                        placeholder="Enter Secondary Number"
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-900"
                                    />
                                </div>

                                {/* Aadhar Number */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Aadhar Number</label>
                                    <input
                                        placeholder="Aadhar Card Number"
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-900"
                                    />
                                </div>

                                {/* Photo Upload */}
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Patient Photo</label>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                                        >
                                            <Camera className="h-5 w-5" />
                                            Camera
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 px-6 py-2 bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 rounded-lg font-semibold transition-colors"
                                        >
                                            <Upload className="h-5 w-5" />
                                            Upload
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="border-t-2 border-gray-200 pt-6 space-y-3">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-base shadow-lg transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Creating...' : 'Add & Create Rx'}
                        </button>

                        <p className="text-center text-gray-500 font-medium">or</p>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                className="py-2 bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-200 rounded-lg font-semibold transition-colors"
                            >
                                Add & Create Bill
                            </button>
                            <button
                                type="button"
                                className="py-2 bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-200 rounded-lg font-semibold transition-colors"
                            >
                                Add & Create Appointment
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

