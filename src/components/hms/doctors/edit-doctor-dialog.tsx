'use client'

import { useState } from 'react'
import { updateDoctor } from '@/app/actions/doctor'
import { X, Mail, Phone, Award, Calendar, Briefcase, GraduationCap, Shield, Building2, Clock } from 'lucide-react'

interface Department {
    id: string
    name: string
    parent_id: string | null
}

interface Role {
    id: string
    name: string
}

interface Specialization {
    id: string
    name: string
}

interface Doctor {
    id: string
    first_name: string
    last_name: string
    email: string | null
    phone: string | null
    license_no: string | null
    role_id: string | null
    specialization_id: string | null
    department_id: string | null
    experience_years: number | null
    consultation_start_time: string | null
    consultation_end_time: string | null
    consultation_slot_duration: number | null
}

interface EditDoctorDialogProps {
    isOpen: boolean
    onClose: () => void
    doctor: Doctor
    departments: Department[]
    roles: Role[]
    specializations: Specialization[]
}

export function EditDoctorDialog({ isOpen, onClose, doctor, departments, roles, specializations }: EditDoctorDialogProps) {
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
                    <h2 className="text-3xl font-black text-white">Edit Staff Member</h2>
                    <p className="text-blue-100 mt-2">Update details and schedule for {doctor.first_name} {doctor.last_name}</p>
                </div>

                {/* Form */}
                {/* Form */}
                <form action={async (formData) => {
                    await updateDoctor(formData)
                    onClose()
                }} className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <input type="hidden" name="id" value={doctor.id} />

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
                                defaultValue={doctor.first_name}
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-gray-900"
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
                                defaultValue={doctor.last_name || ''}
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-gray-900"
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
                                defaultValue={doctor.email || ''}
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-gray-900"
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
                                defaultValue={doctor.phone || ''}
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-gray-900"
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
                            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Department {departments.length > 0 && <span className="text-red-500">*</span>}
                            </label>
                            <select
                                name="department_id"
                                required={departments.length > 0}
                                defaultValue={doctor.department_id || ''}
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-gray-900"
                            >
                                <option value="">
                                    {departments.length === 0 ? 'No departments available' : 'Select Department'}
                                </option>
                                {departments
                                    .filter(dept => !dept.parent_id)
                                    .map(parentDept => (
                                        <>
                                            <option key={parentDept.id} value={parentDept.id}>
                                                {parentDept.name}
                                            </option>
                                            {departments
                                                .filter(child => child.parent_id === parentDept.id)
                                                .map(childDept => (
                                                    <option key={childDept.id} value={childDept.id}>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;↳ {childDept.name}
                                                    </option>
                                                ))}
                                        </>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Role / Position <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="role_id"
                                required
                                defaultValue={doctor.role_id || ''}
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-gray-900"
                            >
                                <option value="">Select Role</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Specialization
                            </label>
                            <select
                                name="specialization_id"
                                defaultValue={doctor.specialization_id || ''}
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-gray-900"
                            >
                                <option value="">Select Specialization (Optional)</option>
                                {specializations.map(spec => (
                                    <option key={spec.id} value={spec.id}>{spec.name}</option>
                                ))}
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
                                defaultValue={doctor.license_no || ''}
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-gray-900"
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
                                defaultValue={doctor.experience_years || ''}
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-gray-900"
                            />
                        </div>

                        {/* Consulting Settings */}
                        <div className="md:col-span-2 mt-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Clock className="h-4 w-4 text-green-600" />
                                </div>
                                Consulting Schedule (Defaults)
                            </h3>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Start Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                name="consultation_start_time"
                                required
                                defaultValue={doctor.consultation_start_time || "09:00"}
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-medium text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                End Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                name="consultation_end_time"
                                required
                                defaultValue={doctor.consultation_end_time || "17:00"}
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-medium text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Slot Duration (Minutes)
                            </label>
                            <input
                                type="number"
                                name="consultation_slot_duration"
                                required
                                defaultValue={doctor.consultation_slot_duration || "30"}
                                step="5"
                                min="5"
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-medium text-gray-900"
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
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
