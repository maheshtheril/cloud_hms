import React, { useState, useEffect } from 'react'
import { createDoctor } from '@/app/actions/doctor'
import { seedStandardDepartments, quickAddDepartment } from '@/app/actions/hms-setup'
import { WORLD_CLASS_DESIGNATIONS, WORLD_CLASS_QUALIFICATIONS } from '@/app/hms/doctors/constants'
import { X, Mail, Phone, Award, Calendar, Briefcase, GraduationCap, Shield, Building2, Clock, Plus, Sparkles, Loader2, CheckCircle2, AlertCircle, UserCheck, CreditCard, Hash, Image, FileText, Fingerprint, Camera, FileCheck } from 'lucide-react'
import { FileUpload } from '@/components/ui/file-upload'

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

interface AddDocFormProps {
    isOpen: boolean
    onClose: () => void
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

export function AddDoctorDialog({ isOpen, onClose, departments: initialDepartments, roles, specializations }: AddDocFormProps) {
    const [departments, setDepartments] = useState(initialDepartments)
    const [isSeeding, setIsSeeding] = useState(false)
    const [isAddingDept, setIsAddingDept] = useState(false)
    const [newDeptName, setNewDeptName] = useState('')
    const [empId, setEmpId] = useState('')
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [selectedDays, setSelectedDays] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
    const [activeTab, setActiveTab] = useState<'general' | 'clinical' | 'documents'>('general')
    const [profileImageUrl, setProfileImageUrl] = useState('')
    const [signatureUrl, setSignatureUrl] = useState('')
    const [documentUrls, setDocumentUrls] = useState<{ [key: string]: string }>({})

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    // Auto-generate world-class Employee ID
    useEffect(() => {
        if (isOpen && !empId) {
            const date = new Date().toISOString().slice(2, 10).replace(/-/g, '')
            const random = Math.floor(1000 + Math.random() * 9000)
            setEmpId(`EMP-${date}-${random}`)
        }
    }, [isOpen])

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
                {/* Header - More Compact */}
                <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 flex items-center justify-between border-b border-indigo-500/20">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <UserCheck className="h-6 w-6 text-white" />
                            </div>
                            Staff Registration <span className="text-indigo-400">Portal</span>
                        </h2>
                        <p className="text-indigo-200/60 text-xs font-bold uppercase tracking-widest mt-1">Enterprise Clinician Management</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group active:scale-95"
                    >
                        <X className="h-5 w-5 text-white/70 group-hover:text-white" />
                    </button>
                </div>

                {/* Form - 3 Column Layout to Avoid Scrolling */}
                <form action={async (formData) => {
                    setMessage(null)
                    const res = await createDoctor(formData)
                    if (res?.success) {
                        onClose()
                    } else {
                        setMessage({ type: 'error', text: res?.error || "Failed to create clinician profile. Please verify all mandatory fields." })
                    }
                }} className="flex-1 overflow-hidden flex flex-col bg-slate-50/30">

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        {message && (
                            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm shadow-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                <span className="font-bold text-sm tracking-tight">{message.text}</span>
                                <button onClick={() => setMessage(null)} className="ml-auto p-1 hover:bg-black/5 rounded-lg transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {/* World-Class Tablet Navigation */}
                        <div className="flex items-center gap-2 mb-8 bg-slate-100 p-1.5 rounded-[1.5rem] w-fit border border-slate-200 shadow-inner">
                            <button
                                type="button"
                                onClick={() => setActiveTab('general')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black transition-all ${activeTab === 'general' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'}`}
                            >
                                <UserCheck className="h-4 w-4" />
                                General Identity
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('clinical')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black transition-all ${activeTab === 'clinical' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'}`}
                            >
                                <Clock className="h-4 w-4" />
                                Clinical Logic
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('documents')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black transition-all ${activeTab === 'documents' ? 'bg-white text-amber-600 shadow-md' : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'}`}
                            >
                                <Fingerprint className="h-4 w-4" />
                                Identity Vault
                            </button>
                        </div>

                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className={activeTab === 'general' ? 'block' : 'hidden'}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Column 1: Identity */}
                                    <div className="space-y-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                            <GraduationCap className="h-4 w-4 text-indigo-500" />
                                            Identity & Credentials
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">First Name</label>
                                                <input type="text" name="first_name" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-sm" placeholder="e.g. Liam" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Last Name</label>
                                                <input type="text" name="last_name" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-sm" placeholder="e.g. Smith" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Professional Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <input type="email" name="email" className="w-full pl-12 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-sm" placeholder="clinician@hospital.com" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Professional Qualification</label>
                                            <select name="qualification" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-sm">
                                                <option value="">Select Qualification</option>
                                                {WORLD_CLASS_QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Medical License No.</label>
                                            <div className="relative">
                                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <input type="text" name="license_no" className="w-full pl-12 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-sm" placeholder="e.g. MED-2024-XX" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2: Organizational Placement */}
                                    <div className="space-y-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                            <Building2 className="h-4 w-4 text-emerald-500" />
                                            Organizational Placement
                                        </h3>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider flex items-center gap-2"><Hash className="h-3 w-3" /> Employee ID</label>
                                            <input type="text" name="employee_id" value={empId} onChange={(e) => setEmpId(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 font-bold text-sm" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Designation</label>
                                                <select name="designation" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 font-bold text-sm">
                                                    <option value="">Select</option>
                                                    {WORLD_CLASS_DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Clinical Role</label>
                                                <select name="role_id" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 font-bold text-sm">
                                                    <option value="">Select Role</option>
                                                    {roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Specialization</label>
                                            <select name="specialization_id" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 font-bold text-sm">
                                                <option value="">None / General</option>
                                                {specializations.map(spec => <option key={spec.id} value={spec.id}>{spec.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                                                <span>Department</span>
                                                <button type="button" onClick={() => setIsAddingDept(!isAddingDept)} className="text-indigo-600 hover:text-indigo-800 text-[9px] font-black flex items-center gap-1">
                                                    <Plus className="h-2 w-2" /> NEW
                                                </button>
                                            </label>
                                            {isAddingDept && (
                                                <div className="flex gap-2 mb-3 bg-indigo-50/50 p-2 rounded-xl animate-in fade-in slide-in-from-top-1">
                                                    <input
                                                        type="text"
                                                        value={newDeptName}
                                                        onChange={(e) => setNewDeptName(e.target.value)}
                                                        placeholder="Dept Name"
                                                        className="flex-1 p-2 bg-white border border-indigo-100 rounded-lg text-xs font-bold outline-none"
                                                    />
                                                    <button type="button" onClick={handleQuickAdd} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md active:scale-95">
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                            <select name="department_id" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 font-bold text-sm">
                                                <option value="">Select Department</option>
                                                {renderDepartmentOptions(departments)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={activeTab === 'clinical' ? 'block' : 'hidden'}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                            <Clock className="h-4 w-4 text-indigo-500" />
                                            Operational Schedule
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Shift Start</label>
                                                <input type="time" name="consultation_start_time" defaultValue="09:00" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Shift End</label>
                                                <input type="time" name="consultation_end_time" defaultValue="17:00" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Slot (Min)</label>
                                                <input type="number" name="consultation_slot_duration" defaultValue="30" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Experience (Yrs)</label>
                                                <input type="number" name="experience_years" defaultValue="0" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-blue-500" /> Weekly Availability</label>
                                            <div className="flex flex-wrap gap-2">
                                                {daysOfWeek.map(day => (
                                                    <button key={day} type="button" onClick={() => toggleDay(day)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border-2 ${selectedDays.includes(day) ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300"}`}>{day.substring(0, 3).toUpperCase()}</button>
                                                ))}
                                            </div>
                                            {selectedDays.map(day => <input key={day} type="hidden" name="working_days" value={day} />)}
                                        </div>
                                    </div>

                                    <div className="space-y-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                            <CreditCard className="h-4 w-4 text-emerald-500" />
                                            Fee & Fiscal Control
                                        </h3>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Consultation Fee (₹)</label>
                                            <input type="number" name="consultation_fee" defaultValue="500" className="w-full p-4 bg-emerald-50 border-2 border-emerald-100 text-emerald-700 rounded-2xl font-black text-lg outline-none" />
                                        </div>
                                        <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[10px] font-black uppercase text-indigo-300 tracking-widest">Accounting Group</span>
                                                <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                            </div>
                                            <div className="text-2xl font-black tracking-tight mb-2">Sundry Debtors</div>
                                            <p className="text-xs text-indigo-200/50 font-bold leading-relaxed">Integrated with Staff Ledger for automated payroll & settlement cycles.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={activeTab === 'documents' ? 'block' : 'hidden'}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Visual Identity */}
                                    <div className="space-y-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                            <Camera className="h-4 w-4 text-indigo-500" />
                                            Visual Persona
                                        </h3>
                                        <div className="flex gap-6">
                                            <div className="flex-1 space-y-3">
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Profile Portrait</label>
                                                <FileUpload
                                                    onUploadComplete={(url) => setProfileImageUrl(url)}
                                                    folder="staff/profiles"
                                                    label="Upload Photo"
                                                    accept="image/*"
                                                />
                                                <input type="hidden" name="profile_image_url" value={profileImageUrl} />
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">E-Signature</label>
                                                <FileUpload
                                                    onUploadComplete={(url) => setSignatureUrl(url)}
                                                    folder="staff/signatures"
                                                    label="Upload Signature"
                                                    accept="image/*"
                                                />
                                                <input type="hidden" name="signature_url" value={signatureUrl} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Document Vault */}
                                    <div className="space-y-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                            <FileText className="h-4 w-4 text-purple-500" />
                                            Document Vault
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {[
                                                { id: 'license', label: 'Medical License Copy' },
                                                { id: 'id_proof', label: 'National ID Proof' },
                                                { id: 'academic', label: 'Academic Certificates' }
                                            ].map(doc => (
                                                <div key={doc.id} className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><FileText className="h-5 w-5 text-purple-600" /></div>
                                                        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{doc.label}</span>
                                                    </div>
                                                    <FileUpload
                                                        onUploadComplete={(url) => setDocumentUrls(prev => ({ ...prev, [doc.id]: url }))}
                                                        folder="staff/documents"
                                                        label={`Upload ${doc.label}`}
                                                        accept="application/pdf,image/*"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <input type="hidden" name="document_urls" value={JSON.stringify(Object.values(documentUrls).filter(Boolean))} />
                                    </div>
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
                            className="px-8 py-3 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 flex items-center gap-2 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 uppercase tracking-widest"
                        >
                            <Sparkles className="h-4 w-4" />
                            Finalize Registration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
