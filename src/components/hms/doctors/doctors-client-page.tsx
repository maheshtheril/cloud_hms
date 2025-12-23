'use client'

import { useState } from 'react'
import Link from "next/link"
import { Stethoscope, Plus, Users, Award, TrendingUp, Sparkles, Mail, Phone, Shield, Search } from "lucide-react"
import { AddDoctorDialog } from "@/components/hms/doctors/add-doctor-dialog"

interface Doctor {
    id: string
    first_name: string
    last_name: string
    email: string | null
    phone: string | null
    employee_id: string | null
    designation: string | null
    license_no: string | null
    is_active: boolean | null
    hms_specializations: { name: string } | null
    hms_roles: { name: string } | null
}

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

interface DoctorsClientPageProps {
    doctors: Doctor[]
    stats: {
        total: number
        active: number
        specializations: number
    }
    departments: Department[]
    roles: Role[]
    specializations: Specialization[]
}

export function DoctorsClientPage({ doctors, stats, departments, roles, specializations }: DoctorsClientPageProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredDoctors = doctors.filter(doc =>
        `${doc.first_name} ${doc.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.hms_specializations?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
            <div className="max-w-[1800px] mx-auto space-y-6">

                {/* Futuristic Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-pulse delay-700"></div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                                <Stethoscope className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl font-black text-white tracking-tight">
                                        Medical Team
                                    </h1>
                                    <div className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full flex items-center gap-1">
                                        <Sparkles className="h-3 w-3" />
                                        World-Class
                                    </div>
                                </div>
                                <p className="text-blue-100 text-lg mt-1">
                                    Expert healthcare professionals • Advanced care • Trusted specialists
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="group relative px-8 py-4 bg-white text-indigo-600 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 font-bold shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            <Plus className="h-5 w-5" />
                            <span>Add Staff Member</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                Total
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">{stats.total}</div>
                        <div className="text-sm text-gray-600 font-medium">Healthcare Professionals</div>
                    </div>

                    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                                Active
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">{stats.active}</div>
                        <div className="text-sm text-gray-600 font-medium">Currently Active</div>
                    </div>

                    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                <Award className="h-6 w-6 text-white" />
                            </div>
                            <div className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full">
                                Diverse
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">{stats.specializations}</div>
                        <div className="text-sm text-gray-600 font-medium">Specializations</div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 shadow-lg">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="🔍 Search by name, email, or specialization..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-gray-900"
                        />
                    </div>
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.length === 0 ? (
                        <div className="md:col-span-2 lg:col-span-3 bg-white/80 backdrop-blur-xl rounded-2xl p-12 text-center border border-gray-200">
                            <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No staff members found</h3>
                            <p className="text-gray-500 mb-6">Add your first healthcare professional (doctor, nurse, therapist, etc.)</p>
                            <button
                                onClick={() => setIsAddDialogOpen(true)}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Staff Member
                            </button>
                        </div>
                    ) : (
                        filteredDoctors.map((doc) => (
                            <Link
                                key={doc.id}
                                href={`/hms/doctors/${doc.id}`}
                                className="group bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                            >
                                {/* Status Badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${doc.is_active
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}>
                                        {doc.is_active ? '✓ Active' : '✗ Inactive'}
                                    </span>
                                    {doc.hms_specializations && (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                            {doc.hms_specializations.name}
                                        </span>
                                    )}
                                </div>

                                {/* Doctor Info */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                        Dr. {doc.first_name} {doc.last_name}
                                    </h3>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-bold text-blue-600">
                                            {doc.designation || doc.hms_roles?.name || 'Medical Professional'}
                                        </p>
                                        {doc.employee_id && (
                                            <p className="text-[10px] text-gray-400 font-mono tracking-tighter">
                                                ID: {doc.employee_id}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-2">
                                    {doc.email && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <span className="truncate">{doc.email}</span>
                                        </div>
                                    )}
                                    {doc.phone && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span>{doc.phone}</span>
                                        </div>
                                    )}
                                    {doc.license_no && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Shield className="h-4 w-4 text-gray-400" />
                                            <span className="font-mono">{doc.license_no}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            <AddDoctorDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                departments={departments}
                roles={roles}
                specializations={specializations}
            />
        </div>
    )
}
