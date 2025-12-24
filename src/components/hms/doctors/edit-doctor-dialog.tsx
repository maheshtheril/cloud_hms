import React, { useState, useEffect } from 'react'
import { updateDoctor } from '@/app/actions/doctor'
import { seedStandardDepartments, quickAddDepartment, WORLD_CLASS_DESIGNATIONS, WORLD_CLASS_QUALIFICATIONS } from '@/app/actions/hms-setup'
import { X, Mail, Phone, Award, Calendar, Briefcase, GraduationCap, Shield, Building2, Clock, Plus, Sparkles, Loader2, CheckCircle2, AlertCircle, Hash, CreditCard, UserCheck, UserCog } from 'lucide-react'

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

export function EditDoctorDialog({ isOpen, onClose, doctor, departments: initialDepartments, roles, specializations }: EditDoctorDialogProps) {
    const [departments, setDepartments] = useState(initialDepartments)
    const [isSeeding, setIsSeeding] = useState(false)
    const [isAddingDept, setIsAddingDept] = useState(false)
    const [newDeptName, setNewDeptName] = useState('')
    const [empId, setEmpId] = useState(doctor.employee_id || '')
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    if (!isOpen) return null

    const handleSeed = async () => {
        setIsSeeding(true)
        setMessage(null)
        const result = await seedStandardDepartments()
        if (result.success) {
            setMessage({ type: 'success', text: result.message! })
            window.location.reload()
        } else {
            setMessage({ type: 'error', text: result.error! })
        }
        setIsSeeding(false)
    }

    const handleQuickAdd = async () => {
        if (!newDeptName.trim()) return
        setIsAddingDept(true)
        setMessage(null)
        const result = await quickAddDepartment(newDeptName)
        if (result.success) {
            setMessage({ type: 'success', text: "Department added!" })
            setDepartments([...departments, result.department!])
            setNewDeptName('')
        } else {
            setMessage({ type: 'error', text: result.error! })
        }
        setIsAddingDept(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-slate-900/60 backdrop-blur-md">
            <div className="relative w-full max-w-[95vw] lg:max-w-7xl bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.3)] max-h-[92vh] flex flex-col overflow-hidden border border-white/20">
                {/* Header - Compact & Premium */}
                <div className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 flex items-center justify-between border-b border-indigo-500/20">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <UserCog className="h-6 w-6 text-white" />
                            </div>
                            Update Profile: <span className="text-blue-400">{doctor.first_name} {doctor.last_name}</span>
                        </h2>
                        <p className="text-indigo-200/60 text-xs font-bold uppercase tracking-widest mt-1">Personnel Management & Compliance</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group active:scale-95"
                    >
                        <X className="h-5 w-5 text-white/70 group-hover:text-white" />
                    </button>
                </div>

                {/* Form - 3 Column Non-Scroll Layout */}
                <form action={async (formData) => {
                    await updateDoctor(formData)
                    onClose()
                }} className="flex-1 overflow-hidden flex flex-col bg-slate-50/30">
                    <input type="hidden" name="id" value={doctor.id} />

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        {message && (
                            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                <span className="font-bold text-sm tracking-tight">{message.text}</span>
                                <button onClick={() => setMessage(null)} className="ml-auto p-1 hover:bg-black/5 rounded-lg transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Column 1: Administrative */}
                            <div className="space-y-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                    <Shield className="h-4 w-4" />
                                    Accountability
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                                            <Hash className="h-3 w-3" /> Employee ID
                                        </label>
                                        <input
                                            type="text"
                                            name="employee_id"
                                            value={empId}
                                            onChange={(e) => setEmpId(e.target.value)}
                                            className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-bold text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Job Designation</label>
                                        <select
                                            name="designation"
                                            defaultValue={doctor.designation || ''}
                                            className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm appearance-none"
                                        >
                                            <option value="">Select Designation</option>
                                            {WORLD_CLASS_DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Clinical Role</label>
                                        <select
                                            name="role_id"
                                            defaultValue={doctor.role_id || ''}
                                            required
                                            className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm"
                                        >
                                            <option value="">Select Clinical Type</option>
                                            {roles.map((role: Role) => (
                                                <option key={role.id} value={role.id}>{role.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Specialization</label>
                                        <select
                                            name="specialization_id"
                                            defaultValue={doctor.specialization_id || ''}
                                            className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm"
                                        >
                                            <option value="">None / General</option>
                                            {specializations.map((spec: Specialization) => (
                                                <option key={spec.id} value={spec.id}>{spec.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                                            <span>Department</span>
                                            <button type="button" onClick={() => setIsAddingDept(!isAddingDept)} className="text-indigo-600 hover:text-indigo-800 text-[9px] font-black">
                                                <Plus className="h-2 w-2" /> NEW
                                            </button>
                                        </label>
                                        {isAddingDept && (
                                            <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
                                                <input
                                                    type="text"
                                                    value={newDeptName}
                                                    onChange={(e) => setNewDeptName(e.target.value)}
                                                    placeholder="Department Name"
                                                    className="flex-1 p-3 bg-blue-50/50 border-2 border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleQuickAdd}
                                                    className="px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setIsAddingDept(false); setNewDeptName('') }}
                                                    className="p-3 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-all"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                        )}
                                        <select
                                            name="department_id"
                                            defaultValue={doctor.department_id || ''}
                                            required
                                            className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm"
                                        >
                                            <option value="">Select Department</option>
                                            {renderDepartmentOptions(departments)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Credentials */}
                            <div className="space-y-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                    <GraduationCap className="h-4 w-4" />
                                    Identity Profile
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">First Name</label>
                                        <input type="text" name="first_name" defaultValue={doctor.first_name} required className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Last Name</label>
                                        <input type="text" name="last_name" defaultValue={doctor.last_name} required className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Qualification</label>
                                    <select
                                        name="qualification"
                                        defaultValue={doctor.qualification || ''}
                                        className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm"
                                    >
                                        <option value="">Select Qualification</option>
                                        {WORLD_CLASS_QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">License Number</label>
                                    <input type="text" name="license_no" defaultValue={doctor.license_no || ''} required className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Professional Email</label>
                                    <input type="email" name="email" defaultValue={doctor.email || ''} required className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Direct Phone</label>
                                    <input type="tel" name="phone" defaultValue={doctor.phone || ''} className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                </div>
                            </div>

                            {/* Column 3: Clinical & Finance */}
                            <div className="space-y-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                    <Clock className="h-4 w-4" />
                                    Operations
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Start Time</label>
                                        <input type="time" name="consultation_start_time" defaultValue={doctor.consultation_start_time || '09:00'} className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">End Time</label>
                                        <input type="time" name="consultation_end_time" defaultValue={doctor.consultation_end_time || '17:00'} className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Slot (Min)</label>
                                        <input type="number" name="consultation_slot_duration" defaultValue={doctor.consultation_slot_duration || 30} className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Fee (₹)</label>
                                        <input type="number" name="consultation_fee" defaultValue={Number(doctor.consultation_fee) || 0} className="w-full p-3 bg-slate-50 border-2 border-emerald-100 outline-none font-bold text-sm text-emerald-700" />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                                        <CreditCard className="h-3.5 w-3.5 text-blue-500" />
                                        Fiscal Mapping
                                    </label>
                                    <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-xl border border-indigo-500/30">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black uppercase text-blue-300 tracking-tighter">Current Head</span>
                                            <div className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-[8px] font-bold uppercase">Locked</div>
                                        </div>
                                        <div className="text-lg font-black tracking-tight mb-1 uppercase">Sundry Debtors</div>
                                        <p className="text-[10px] text-slate-400 font-medium">Mapped for enterprise financial reconciliation.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Experience (Years)</label>
                                    <input type="number" name="experience_years" defaultValue={doctor.experience_years || 0} className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer - Sticky */}
                    <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-[2.5rem]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-sm transition-all active:scale-95 uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-200 flex items-center gap-2 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 uppercase tracking-widest"
                        >
                            <Sparkles className="h-4 w-4" />
                            Update Credentials
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
