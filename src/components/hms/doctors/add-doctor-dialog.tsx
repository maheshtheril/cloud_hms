'use client'

import { useState } from 'react'
import { X, Mail, Phone, Award, Calendar, Briefcase, GraduationCap, Shield } from 'lucide-react'

interface AddDocFormProps {
    isOpen: boolean
    onClose: () => void
}

export function AddDoctorDialog({ isOpen, onClose }: AddDocFormProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
                    >
                        <X className="h-5 w-5 text-white" />
                    </button>
                    <h2 className="text-3xl font-black text-white">Add Clinical Staff</h2>
                    <p className="text-blue-100 mt-2">Register a new healthcare professional (Doctor, Nurse, Therapist, etc.)</p>
                </div>

                {/* Form */}
                <form action="/api/doctors" method="POST" className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Personal Information */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="h-4 w-4 text-blue-600" />
                                </div>
                                Personal Information
                            </h3>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                required
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-gray-900"
                                placeholder="John"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                required
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-gray-900"
                                placeholder="Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-gray-900"
                                placeholder="doctor@hospital.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-gray-900"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        {/* Professional Details */}
                        <div className="md:col-span-2 mt-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Briefcase className="h-4 w-4 text-purple-600" />
                                </div>
                                Professional Details
                            </h3>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Role / Position <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="role_id"
                                required
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-gray-900"
                            >
                                <option value="">Select Role</option>
                                <option>👨‍⚕️ Doctor / Physician</option>
                                <option>👩‍⚕️ Nurse</option>
                                <option>🩺 Nurse Practitioner</option>
                                <option>💉 Clinical Nurse Specialist</option>
                                <option>🧑‍⚕️ Physician Assistant</option>
                                <option>🧘 Physiotherapist</option>
                                <option>🧠 Psychologist / Therapist</option>
                                <option>🦷 Dentist</option>
                                <option>👓 Optometrist</option>
                                <option>💊 Pharmacist</option>
                                <option>🔬 Lab Technician</option>
                                <option>📸 Radiographer</option>
                                <option>🩻 Anesthesiologist</option>
                                <option>🏥 Surgeon</option>
                                <option>👶 Midwife</option>
                                <option>🧑‍🔬 Medical Assistant</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Specialization
                            </label>
                            <select
                                name="specialization_id"
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-gray-900"
                            >
                                <option value="">Select Specialization (Optional)</option>
                                <option>Cardiology</option>
                                <option>Neurology</option>
                                <option>Pediatrics</option>
                                <option>Orthopedics</option>
                                <option>General Practice</option>
                                <option>Emergency Medicine</option>
                                <option>Internal Medicine</option>
                                <option>Oncology</option>
                                <option>Radiology</option>
                                <option>Anesthesiology</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                License Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="license_no"
                                required
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-gray-900"
                                placeholder="MED123456"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                Qualification
                            </label>
                            <input
                                type="text"
                                name="qualification"
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-gray-900"
                                placeholder="MBBS, MD"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Years of Experience
                            </label>
                            <input
                                type="number"
                                name="experience_years"
                                min="0"
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-gray-900"
                                placeholder="10"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                        >
                            Add Staff Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
