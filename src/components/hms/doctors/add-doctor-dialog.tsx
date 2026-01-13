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
    const [isSubmitting, setIsSubmitting] = useState(false)

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="relative w-full max-w-[98vw] xl:max-w-[1600px] bg-slate-50 dark:bg-slate-900 rounded-xl shadow-2xl max-h-[96vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
                {/* Header - Compact Enterprise Style */}
                <div className="bg-white dark:bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <UserCheck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                New Staff Registration
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Create a new personnel profile</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                {/* Form Content - Continuous Scrollable Grid */}
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);

                    const firstName = formData.get("first_name") as string;
                    const lastName = formData.get("last_name") as string;
                    const email = formData.get("email") as string;
                    const roleId = formData.get("role_id") as string;

                    if (!firstName || !lastName) return setMessage({ type: 'error', text: "Full Name is required." });
                    if (!email) return setMessage({ type: 'error', text: "Official Email is required." });
                    if (!roleId) return setMessage({ type: 'error', text: "Institutional Role is required." });

                    setIsSubmitting(true);
                    setMessage(null);

                    try {
                        const res = await createDoctor(formData);
                        if (res?.success) {
                            onClose();
                            // Optional: Trigger full page refresh or toast
                        } else {
                            setMessage({ type: 'error', text: res?.error || "Registration failed." });
                        }
                    } catch (err: any) {
                        setMessage({ type: 'error', text: "System error occurred." });
                    } finally {
                        setIsSubmitting(false);
                    }
                }} className="flex-1 overflow-y-auto">

                    {message && (
                        <div className={`mx-6 mt-6 p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            {message.text}
                        </div>
                    )}

                    <div className="p-6 grid grid-cols-12 gap-6">

                        {/* LEFT COLUMN: Identity & Professional Details (Span 8) */}
                        <div className="col-span-12 xl:col-span-8 space-y-6">

                            {/* Section: Personal Identity */}
                            <div className="bg-white dark:bg-slate-950 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                                    <Fingerprint className="h-4 w-4 text-blue-500" /> Identity Information
                                </h3>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-6 md:col-span-4">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name <span className="text-red-500">*</span></label>
                                        <input type="text" name="first_name" required className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="e.g. Jonathan" />
                                        <p className="text-[10px] text-slate-400 mt-1">Legal first name as per ID.</p>
                                    </div>
                                    <div className="col-span-6 md:col-span-4">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name <span className="text-red-500">*</span></label>
                                        <input type="text" name="last_name" required className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="e.g. Doe" />
                                        <p className="text-[10px] text-slate-400 mt-1">Family name / Surname.</p>
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Email <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                            <input type="email" name="email" required className="w-full pl-9 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="user@organization.com" />
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1">Used for system login & notifications.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Professional Details */}
                            <div className="bg-white dark:bg-slate-950 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-emerald-500" /> Professional Deployment
                                </h3>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-6 md:col-span-3">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Employee ID</label>
                                        <input type="text" name="employee_id" value={empId} onChange={(e) => setEmpId(e.target.value)} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-sm font-mono text-slate-600 dark:text-slate-400 focus:outline-none cursor-not-allowed" readOnly />
                                        <p className="text-[10px] text-slate-400 mt-1">Auto-generated unique identifier.</p>
                                    </div>
                                    <div className="col-span-6 md:col-span-3">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                                        <select name="designation" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option value="">Select Rank...</option>
                                            {WORLD_CLASS_DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-6 md:col-span-3">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                                        <select name="department_id" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option value="">Select Dept...</option>
                                            {renderDepartmentOptions(departments)}
                                        </select>
                                    </div>
                                    <div className="col-span-6 md:col-span-3">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role <span className="text-red-500">*</span></label>
                                        <select name="role_id" required className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option value="">Select Role...</option>
                                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                        </select>
                                        <p className="text-[10px] text-slate-400 mt-1">Determines system access levels.</p>
                                    </div>

                                    <div className="col-span-6 md:col-span-4">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Specialization</label>
                                        <select name="specialization_id" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option value="">None / General Practice</option>
                                            {specializations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-6 md:col-span-4">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Qualification</label>
                                        <select name="qualification" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option value="">Select Highest Degree...</option>
                                            {WORLD_CLASS_QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-6 md:col-span-4">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">License Number</label>
                                        <div className="relative">
                                            <Shield className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                            <input type="text" name="license_no" className="w-full pl-9 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="e.g. LIC-2025-001" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Schedule & Availability */}
                            <div className="bg-white dark:bg-slate-950 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-indigo-500" /> Availability & Shifts
                                </h3>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Shift Start</label>
                                        <input type="time" name="consultation_start_time" defaultValue="09:00" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Shift End</label>
                                        <input type="time" name="consultation_end_time" defaultValue="17:00" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Slot Duration</label>
                                        <div className="relative">
                                            <input type="number" name="consultation_slot_duration" defaultValue="30" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                            <span className="absolute right-3 top-2 text-xs text-slate-400 bg-transparent">Min</span>
                                        </div>
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Consultation Fee</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-xs text-slate-400">$</span>
                                            <input type="number" name="consultation_fee" defaultValue="500" className="w-full pl-6 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                    </div>
                                    <div className="col-span-12">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Weekly Roster</label>
                                        <div className="flex flex-wrap gap-2">
                                            {daysOfWeek.map(day => (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => toggleDay(day)}
                                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${selectedDays.includes(day) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
                                                >
                                                    {day.substring(0, 3)}
                                                </button>
                                            ))}
                                            {selectedDays.map(day => <input key={day} type="hidden" name="working_days" value={day} />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Media & Docs (Span 4) */}
                        <div className="col-span-12 xl:col-span-4 space-y-6">

                            {/* Profile Image */}
                            <div className="bg-white dark:bg-slate-950 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                                    <Camera className="h-4 w-4 text-purple-500" /> Photo & Signature
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Profile Photo</label>
                                        <FileUpload
                                            onUploadComplete={(url) => setProfileImageUrl(url)}
                                            folder="staff/profiles"
                                            label="Click to Upload"
                                            accept="image/*"
                                            showCamera={true}
                                        />
                                        <input type="hidden" name="profile_image_url" value={profileImageUrl} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Digital Signature</label>
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

                            {/* Documents */}
                            <div className="bg-white dark:bg-slate-950 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-orange-500" /> Attachments
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { id: 'license', label: 'License' },
                                        { id: 'id_proof', label: 'ID Proof' }
                                    ].map(doc => (
                                        <div key={doc.id}>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{doc.label}</label>
                                            <FileUpload
                                                onUploadComplete={(url) => setDocumentUrls(prev => ({ ...prev, [doc.id]: url }))}
                                                folder="staff/documents"
                                                label="Upload PDF/IMG"
                                                accept="application/pdf,image/*"
                                            />
                                        </div>
                                    ))}
                                    <input type="hidden" name="document_urls" value={JSON.stringify(Object.values(documentUrls).filter(Boolean))} />
                                </div>
                            </div>

                        </div>
                    </div>
                </form>

                {/* Footer Controls */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 flex justify-between items-center">
                    <div className="text-xs text-slate-400 italic">
                        All fields marked with <span className="text-red-500">*</span> are mandatory.
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={(e) => {
                                const form = e.currentTarget.closest('.relative')?.querySelector('form');
                                if (form) form.requestSubmit();
                            }}
                            disabled={isSubmitting}
                            className={`px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <SaveIcon className="h-4 w-4" />}
                            {isSubmitting ? 'Saving...' : 'Create Staff Profile'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SaveIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    )
}
