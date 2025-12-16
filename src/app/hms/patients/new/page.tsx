import { createPatient } from "@/app/actions/patient"
import Link from "next/link"
import { ArrowLeft, Save, User, MapPin, ShieldAlert, HeartPulse } from "lucide-react"

export default function NewPatientPage() {
    return (
        <form action={createPatient} className="max-w-5xl mx-auto space-y-8 pb-12">

            {/* Header / Sticky Actions */}
            <div className="flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 -mx-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <Link href="/hms/patients" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">New Patient Registration</h1>
                        <p className="text-gray-500 text-sm">Enter comprehensive patient details.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/hms/patients" className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm">
                        Cancel
                    </Link>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2 shadow-sm">
                        <Save className="h-4 w-4" />
                        Save Patient Record
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Section 1: Personal Info */}
                <div className="lg:col-span-8 space-y-8">
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-3">
                            <User className="h-5 w-5 text-blue-600" />
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                                <input name="first_name" required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. John" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                                <input name="last_name" required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Doe" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                                <input type="date" name="dob" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Gender</label>
                                <select name="gender" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-3">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            Contact Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                                <input name="phone" required type="tel" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+1 (555) 000-0000" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <input name="email" type="email" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
                            </div>
                            <div className="col-span-full space-y-1">
                                <label className="text-sm font-medium text-gray-700">Street Address</label>
                                <input name="street" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="123 Main St, Apt 4B" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">City</label>
                                <input name="city" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">State / Province</label>
                                <input name="state" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Postal / Zip Code</label>
                                <input name="zip" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Country</label>
                                <select name="country" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="IN">India</option>
                                    {/* Add more as needed */}
                                </select>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Section 2: Medical & Other (Sidebar Style on Desktop) */}
                <div className="lg:col-span-4 space-y-8">
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-3">
                            <HeartPulse className="h-5 w-5 text-red-500" />
                            Medical Profile
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Blood Group</label>
                                <select name="blood_group" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
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
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Known Allergies</label>
                                <textarea name="allergies" rows={3} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="List any known allergies..."></textarea>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-3">
                            <ShieldAlert className="h-5 w-5 text-orange-500" />
                            Emergency Contact
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Contact Name</label>
                                <input name="emergency_name" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Relation</label>
                                <input name="emergency_relation" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Spouse, Parent" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <input name="emergency_phone" type="tel" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        </form>
    )
}
