'use client'

import { createPatient } from "@/app/actions/patient"
import Link from "next/link"
import { ArrowLeft, Save, User, MapPin, ShieldAlert, HeartPulse, Sparkles, Phone, Mail, Calendar, UserCircle2, Activity } from "lucide-react"
import { useActionState, useState, useEffect } from "react"

const initialState = {
    error: "",
    success: false
}

// Country and State Data
const COUNTRIES = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
]

const STATES_BY_COUNTRY: Record<string, string[]> = {
    'IN': [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
        'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ],
    'US': [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
        'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
        'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
        'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
        'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
        'West Virginia', 'Wisconsin', 'Wyoming'
    ],
    'CA': [
        'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
        'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
        'Prince Edward Island', 'Quebec', 'Saskatchewan',
        'Northwest Territories', 'Nunavut', 'Yukon'
    ],
    'UK': [
        'England', 'Scotland', 'Wales', 'Northern Ireland'
    ],
    'AU': [
        'New South Wales', 'Queensland', 'South Australia', 'Tasmania',
        'Victoria', 'Western Australia', 'Australian Capital Territory',
        'Northern Territory'
    ]
}

interface CreatePatientFormProps {
    tenantCountry?: string
}

export function CreatePatientForm({ tenantCountry = 'IN' }: CreatePatientFormProps) {
    const [state, action, isPending] = useActionState(createPatient, initialState);
    const [selectedCountry, setSelectedCountry] = useState(tenantCountry);
    const [availableStates, setAvailableStates] = useState<string[]>(STATES_BY_COUNTRY[tenantCountry] || []);

    useEffect(() => {
        setAvailableStates(STATES_BY_COUNTRY[selectedCountry] || []);
    }, [selectedCountry]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <form action={action} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

                {state?.error && (
                    <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-600 px-6 py-4 rounded-2xl shadow-lg shadow-red-500/10 animate-in slide-in-from-top">
                        <p className="font-medium flex items-center gap-2">
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            {state.error}
                        </p>
                    </div>
                )}

                {/* Header */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-indigo-500/10 p-6 sticky top-4 z-20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link
                                href="/hms/patients"
                                className="group p-3 bg-gradient-to-br from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                                    <Sparkles className="h-8 w-8 text-indigo-500 animate-pulse" />
                                    New Patient Registration
                                </h1>
                                <p className="text-gray-600 mt-1 font-medium">Create a comprehensive patient profile with care</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/hms/patients"
                                className="px-6 py-3 text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/60 transition-all duration-300 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                            >
                                {isPending ? (
                                    <>
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Saving Patient...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        Save Patient Record
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Personal Information */}
                        <section className="group bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-blue-500/10 p-8 hover:shadow-blue-500/20 transition-all duration-500">
                            <div className="flex items-center gap-3 pb-6 border-b-2 border-gradient-to-r from-blue-500 to-indigo-500 mb-6">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                                    <UserCircle2 className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                                    <p className="text-sm text-gray-600 mt-0.5">Basic details about the patient</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 group/input">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                        <User className="h-4 w-4 text-indigo-500" />
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="first_name"
                                        required
                                        className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 font-medium text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                        <User className="h-4 w-4 text-indigo-500" />
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="last_name"
                                        required
                                        className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 font-medium text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                                        placeholder="Doe"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-purple-500" />
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        name="dob"
                                        className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-300 font-medium text-gray-900 hover:border-gray-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Gender</label>
                                    <select
                                        name="gender"
                                        className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 font-medium text-gray-900 hover:border-gray-300 cursor-pointer"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Contact Details */}
                        <section className="group bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-emerald-500/10 p-8 hover:shadow-emerald-500/20 transition-all duration-500">
                            <div className="flex items-center gap-3 pb-6 border-b-2 border-gradient-to-r from-emerald-500 to-teal-500 mb-6">
                                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                                    <MapPin className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
                                    <p className="text-sm text-gray-600 mt-0.5">How to reach the patient</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-emerald-500" />
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="phone"
                                        required
                                        type="tel"
                                        className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 font-medium text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-blue-500" />
                                        Email Address
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 font-medium text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="col-span-full space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Street Address</label>
                                    <input
                                        name="street"
                                        className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 font-medium text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                                        placeholder="123 Main St, Apt 4B"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">City</label>
                                    <input
                                        name="city"
                                        className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 font-medium text-gray-900 hover:border-gray-300"
                                        placeholder="Mumbai"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">State / Province</label>
                                    <select
                                        name="state"
                                        className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 font-medium text-gray-900 hover:border-gray-300 cursor-pointer"
                                    >
                                        <option value="">Select State</option>
                                        {availableStates.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Postal / Zip Code</label>
                                    <input
                                        name="zip"
                                        className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 font-medium text-gray-900 hover:border-gray-300"
                                        placeholder="400001"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Country</label>
                                    <select
                                        name="country"
                                        value={selectedCountry}
                                        onChange={(e) => setSelectedCountry(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 font-medium text-gray-900 hover:border-gray-300 cursor-pointer"
                                    >
                                        {COUNTRIES.map(country => (
                                            <option key={country.code} value={country.code}>{country.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Medical Profile */}
                        <section className="group bg-gradient-to-br from-rose-50 to-pink-50 backdrop-blur-xl border-2 border-rose-200/50 rounded-3xl shadow-2xl shadow-rose-500/10 p-6 hover:shadow-rose-500/20 transition-all duration-500">
                            <div className="flex items-center gap-3 pb-4 mb-4 border-b-2 border-rose-300">
                                <div className="p-2.5 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg">
                                    <Activity className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Medical Profile</h2>
                                    <p className="text-xs text-gray-600 mt-0.5">Health information</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Blood Group</label>
                                    <select
                                        name="blood_group"
                                        className="w-full px-4 py-3 bg-white/70 border-2 border-rose-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all duration-300 font-medium text-gray-900 hover:border-rose-300 cursor-pointer"
                                    >
                                        <option value="">Unknown</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Known Allergies</label>
                                    <textarea
                                        name="allergies"
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white/70 border-2 border-rose-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all duration-300 font-medium text-gray-900 resize-none placeholder:text-gray-400 hover:border-rose-300"
                                        placeholder="List any known allergies..."
                                    ></textarea>
                                </div>
                            </div>
                        </section>

                        {/* Emergency Contact */}
                        <section className="group bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-xl border-2 border-amber-200/50 rounded-3xl shadow-2xl shadow-amber-500/10 p-6 hover:shadow-amber-500/20 transition-all duration-500">
                            <div className="flex items-center gap-3 pb-4 mb-4 border-b-2 border-amber-300">
                                <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                                    <ShieldAlert className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Emergency Contact</h2>
                                    <p className="text-xs text-gray-600 mt-0.5">In case of emergency</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Contact Name</label>
                                    <input
                                        name="emergency_name"
                                        className="w-full px-4 py-3 bg-white/70 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all duration-300 font-medium text-gray-900 hover:border-amber-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Relation</label>
                                    <input
                                        name="emergency_relation"
                                        className="w-full px-4 py-3 bg-white/70 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all duration-300 font-medium text-gray-900 placeholder:text-gray-400 hover:border-amber-300"
                                        placeholder="e.g. Spouse, Parent"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Phone Number</label>
                                    <input
                                        name="emergency_phone"
                                        type="tel"
                                        className="w-full px-4 py-3 bg-white/70 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all duration-300 font-medium text-gray-900 hover:border-amber-300"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                </div>
            </form>

            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    )
}
