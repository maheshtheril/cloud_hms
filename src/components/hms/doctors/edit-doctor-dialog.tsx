'use client'

import React, { useState } from 'react'
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
    employee_id: string | null
    designation: string | null
    license_no: string | null
    role_id: string | null
    specialization_id: string | null
    department_id: string | null
    experience_years: number | null
    qualification?: string | null
    consultation_start_time: string | null
    consultation_end_time: string | null
    consultation_slot_duration: number | null
    consultation_fee: number | null
}

interface EditDoctorDialogProps {
    isOpen: boolean
    onClose: () => void
    doctor: Doctor
    departments: Department[]
    roles: Role[]
    specializations: Specialization[]
}

function renderDepartmentOptions(departments: Department[], parentId: string | null = null, depth = 0): any {
    return departments
        .filter(dept => {
            const normalizedParentId = dept.parent_id || null;
            return normalizedParentId === parentId;
        })
        .map(dept => {
            const hasChildren = departments.some(d => (d.parent_id || null) === dept.id);
            return (
                <React.Fragment key={dept.id}>
                    <option
                        value={dept.id}
                        disabled={hasChildren}
                        className={depth === 0 ? "font-bold" : ""}
                    >
                        {"\u00A0".repeat(depth * 4)}{depth > 0 ? "↳ " : ""}{dept.name} {hasChildren ? " (Branch)" : ""}
                    </option>
                    {renderDepartmentOptions(departments, dept.id, depth + 1)}
                </React.Fragment>
            );
        });
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
                    <h2 className="text-3xl font-black text-white">Edit Staff Profile</h2>
                    <p className="text-blue-100 mt-2">Update administrative and clinical details for Dr. {doctor.first_name}</p>
                </div>

                {/* Form */}
                {/* Form */}
                <form action={async (formData) => {
                    await updateDoctor(formData)
                    onClose()
                }} className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <input type="hidden" name="id" value={doctor.id} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Administrative & HR Section */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                                <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <Shield className="h-4 w-4 text-amber-600" />
                                </div>
                                Administrative & HR
                            </h3>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Employee ID
                            </label>
                            <input
                                type="text"
                                name="employee_id"
                                defaultValue={doctor.employee_id || ''}
                                className="w-full p-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none font-medium text-gray-900"
                                placeholder="EMP-123"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Job Designation <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="designation"
                                required
                                defaultValue={doctor.designation || ''}
                                className="w-full p-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none font-medium text-gray-900"
                                placeholder="e.g. Senior Consultant"
                            />
                        </div>



                        {/* Basic Information */}
                        <div className="md:col-span-2 mt-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="h-4 w-4 text-blue-600" />
                                </div>
                                Basic Contact Details
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

                        {/* Professional Credentials Section */}
                        <div className="md:col-span-2 mt-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Briefcase className="h-4 w-4 text-purple-600" />
                                </div>
                                Professional Credentials
                            </h3>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Clinical Role <span className="text-red-500">*</span>
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
                                License / Registration No. <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="license_no"
                                required
                                defaultValue={doctor.license_no || ''}
                                className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-gray-900"
                            />
                        </div>

                        <div className="md:col-span-2">
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

                        {/* Clinical Settings */}
                        <div className="md:col-span-2 mt-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Clock className="h-4 w-4 text-green-600" />
                                </div>
                                Consulting Logic & Fee
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

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Consultation Fee (₹) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-3.5 text-gray-400 font-bold">₹</div>
                                <input
                                    type="number"
                                    name="consultation_fee"
                                    required
                                    defaultValue={doctor.consultation_fee || "500"}
                                    min="0"
                                    className="w-full pl-8 p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-bold text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Final Assignment Section */}
                        <div className="md:col-span-2 mt-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                                <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                    <Building2 className="h-4 w-4 text-slate-600" />
                                </div>
                                Organizational Placement (Final Node)
                            </h3>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Assigned Clinical Department
                            </label>
                            <select
                                name="department_id"
                                defaultValue={doctor.department_id || ''}
                                className="w-full p-3.5 bg-slate-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none font-black text-gray-900"
                            >
                                <option value="">Select Terminal Node</option>
                                {renderDepartmentOptions(departments)}
                            </select>
                            <p className="mt-2 text-[10px] text-gray-500 italic">Modify the clinician's placement within the organizational tree (Terminal Node).</p>
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
