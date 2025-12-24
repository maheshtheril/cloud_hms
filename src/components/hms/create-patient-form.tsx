'use client'

import { createPatient, createPatientQuick } from "@/app/actions/patient"
import { X, User, Phone, Calendar, Camera, FileText, Shield, MapPin, Mail, AlertCircle, CheckCircle2, Fingerprint, Activity } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileUpload } from "@/components/ui/file-upload"

interface CreatePatientFormProps {
    tenantCountry?: string
    onClose?: () => void
    onSuccess?: (patient: any) => void
    isDialog?: boolean
}

export function CreatePatientForm({ tenantCountry = 'IN', onClose, onSuccess, isDialog = false }: CreatePatientFormProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'basic' | 'residency' | 'vault'>('basic');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isPending, setIsPending] = useState(false);

    // State for Vault
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [idCardUrl, setIdCardUrl] = useState('');

    // State for Age/DOB logic
    const [age, setAge] = useState('');
    const [ageUnit, setAgeUnit] = useState('Years');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('male');

    const handleAgeChange = (value: string, unit: string) => {
        setAge(value);
        setAgeUnit(unit);
        if (value) {
            const currentDate = new Date();
            let years = 0;
            if (unit === 'Years') years = parseInt(value);
            else if (unit === 'Months') years = parseInt(value) / 12;
            else if (unit === 'Days') years = parseInt(value) / 365;

            const birthYear = currentDate.getFullYear() - Math.floor(years);
            const calculatedDob = new Date(birthYear, currentDate.getMonth(), currentDate.getDate());
            setDob(calculatedDob.toISOString().split('T')[0]);
        }
    };

    const handleDobChange = (value: string) => {
        setDob(value);
        if (value) {
            const birthDate = new Date(value);
            const today = new Date();
            let ageYears = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) ageYears--;
            setAge(ageYears.toString());
            setAgeUnit('Years');
        }
    };

    return (
        <div className={isDialog ? "h-full flex flex-col" : "fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4"}>
            <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/20 ${isDialog ? 'h-full shadow-none border-none' : ''}`}>

                {/* Header */}
                <div className="p-8 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 flex items-center justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                                <User className="h-6 w-6 text-white" />
                            </div>
                            Patient Master Registration
                        </h2>
                        <p className="text-blue-100 text-xs font-bold mt-1 uppercase tracking-[0.2em] opacity-80">World-Class Healthcare Standards</p>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="h-12 w-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95 border border-white/20">
                            <X className="h-6 w-6" />
                        </button>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="px-8 pt-6">
                    <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-[1.5rem] border border-slate-200/50">
                        {[
                            { id: 'basic', label: 'Core Identity', icon: User },
                            { id: 'residency', label: 'Residency & Contact', icon: MapPin },
                            { id: 'vault', label: 'Identity Vault', icon: Fingerprint }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm border border-slate-200/50 scale-[1.02]'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                    }`}
                            >
                                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    setIsPending(true);
                    setMessage(null);
                    try {
                        const res = await createPatient(null, formData);
                        if (res?.error) {
                            setMessage({ type: 'error', text: res.error });
                        } else if (onSuccess) {
                            onSuccess(res);
                        } else {
                            // Professional feedback before refresh
                            setMessage({ type: 'success', text: "Patient profile synchronized successfully." });
                            setTimeout(() => window.location.reload(), 1000);
                        }
                    } catch (err: any) {
                        setMessage({ type: 'error', text: "Systems offline or validation failed. Please review mandatory fields." });
                    } finally {
                        setIsPending(false);
                    }
                }} id="patient-master-form" className="flex-1 overflow-hidden flex flex-col">

                    <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                        {message && (
                            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                <span className="font-bold text-sm">{message.text}</span>
                            </div>
                        )}

                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* TAB 1: CORE IDENTITY */}
                            <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6 bg-white dark:bg-slate-800/40 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                            <Activity className="h-4 w-4 text-indigo-500" /> Professional Identity
                                        </h3>
                                        <div className="flex gap-4">
                                            <div className="w-1/3">
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Title</label>
                                                <select name="title" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-sm">
                                                    <option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Dr.</option><option>Master</option><option>Baby</option>
                                                </select>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">First Name</label>
                                                <input name="first_name" type="text" placeholder="e.g. John" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Last Name</label>
                                            <input name="last_name" type="text" placeholder="e.g. Doe" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-sm" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Gender</label>
                                                <select name="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-sm">
                                                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Blood Group</label>
                                                <select name="blood_group" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-sm">
                                                    <option value="">Unknown</option>
                                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 bg-white dark:bg-slate-800/40 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                            <Calendar className="h-4 w-4 text-emerald-500" /> Vital Chronology
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Age ({ageUnit})</label>
                                                <input type="number" value={age} onChange={(e) => handleAgeChange(e.target.value, ageUnit)} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-emerald-50 dark:border-emerald-900/20 rounded-2xl font-black text-emerald-600 text-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Unit</label>
                                                <select value={ageUnit} onChange={(e) => handleAgeChange(age, e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-sm">
                                                    <option>Years</option><option>Months</option><option>Days</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Date of Birth</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <input name="dob" type="date" value={dob} onChange={(e) => handleDobChange(e.target.value)} className="w-full pl-12 p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-sm" />
                                            </div>
                                        </div>
                                        <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className="h-12 w-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                                                    <Shield className="h-6 w-6 text-emerald-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Medical ID Status</p>
                                                    <p className="text-sm font-bold opacity-80">Automatic Generation on Save</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TAB 2: RESIDENCY & CONTACT */}
                            <div className={activeTab === 'residency' ? 'block' : 'hidden'}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6 bg-white dark:bg-slate-800/40 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                            <Phone className="h-4 w-4 text-indigo-500" /> Primary Communication
                                        </h3>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Mobile Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <input name="phone" type="tel" placeholder="e.g. +91 9876543210" className="w-full pl-12 p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <input name="email" type="email" placeholder="e.g. john@example.com" className="w-full pl-12 p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 bg-white dark:bg-slate-800/40 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                            <MapPin className="h-4 w-4 text-emerald-500" /> Residency Logistics
                                        </h3>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Residential Address</label>
                                            <input name="street" type="text" placeholder="Street Name, Area" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-sm mb-4" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input name="city" type="text" placeholder="City" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-sm" />
                                                <input name="zip" type="text" placeholder="Pin Code" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TAB 3: IDENTITY VAULT & FISCAL */}
                            <div className={activeTab === 'vault' ? 'block' : 'hidden'}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6 bg-white dark:bg-slate-800/40 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                            <Camera className="h-4 w-4 text-indigo-500" /> Visual & ID Persona
                                        </h3>
                                        <div className="flex gap-6">
                                            <div className="flex-1 space-y-3">
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">Patient Photo</label>
                                                <FileUpload
                                                    onUploadComplete={(url) => setProfileImageUrl(url)}
                                                    folder="patients/profiles"
                                                    label="Capture Photo"
                                                    accept="image/*"
                                                />
                                                <input type="hidden" name="profile_image_url" value={profileImageUrl} />
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <label className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">National ID Card</label>
                                                <FileUpload
                                                    onUploadComplete={(url) => setIdCardUrl(url)}
                                                    folder="patients/ids"
                                                    label="Upload ID"
                                                    accept="application/pdf,image/*"
                                                />
                                                <input type="hidden" name="id_card_url" value={idCardUrl} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 bg-white dark:bg-slate-800/40 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                            <Shield className="h-4 w-4 text-emerald-500" /> Fiscal Engineering
                                        </h3>
                                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em]">Active Fiscal Group</span>
                                                </div>
                                            </div>
                                            <div className="text-3xl font-black tracking-tighter mb-4 uppercase text-emerald-50">Accounts Receivable</div>
                                            <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6">
                                                World-Standard categorization for Clinical Revenue. Integrated with the institutional General Ledger for automated clinical receivables tracking.
                                            </p>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 w-fit">
                                                <Activity className="h-3 w-3 text-emerald-400" />
                                                <span className="text-[10px] font-black uppercase text-white tracking-widest">Auto-Ledger Enabled</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer - Sticky */}
                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between rounded-b-[2.5rem]">
                        <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest hidden md:block italic">
                            Validated through Healthcare Protocol 2.4.1
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-4 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : <CheckCircle2 className="h-4 w-4" />}
                                Finalise Patient Master
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
