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
        <div className={isDialog ? "h-full flex flex-col" : "fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-2"}>
            <div className={`bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col border border-white/20 ${isDialog ? 'h-full shadow-none border-none' : ''}`}>

                {/* Compact Header */}
                <div className="px-6 py-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-between relative overflow-hidden border-b border-indigo-500/20">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                                Patient Master <span className="text-indigo-400">Registration</span>
                            </h2>
                            <p className="text-indigo-200/50 text-[9px] font-black uppercase tracking-[0.2em]">Institutional Health Registry • v2.4</p>
                        </div>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="h-10 w-10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl flex items-center justify-center transition-all active:scale-95 border border-white/10">
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Dense Tab Navigation */}
                <div className="px-6 pt-4">
                    <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/50">
                        {[
                            { id: 'basic', label: 'Identity', icon: User },
                            { id: 'residency', label: 'Residency', icon: MapPin },
                            { id: 'vault', label: 'Vault', icon: Fingerprint }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-[0.9rem] text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm border border-slate-200/50'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                    }`}
                            >
                                <tab.icon className={`h-3.5 w-3.5 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Compressed Form Content */}
                <form onSubmit={async (e) => {
                    e.preventDefault();

                    // Smart Tab Validation Interceptor
                    const formData = new FormData(e.currentTarget);
                    const requiredFields = [
                        { name: 'first_name', tab: 'basic' },
                        { name: 'last_name', tab: 'basic' },
                        { name: 'phone', tab: 'residency' }
                    ];

                    for (const field of requiredFields) {
                        const value = formData.get(field.name);
                        if (!value || value.toString().trim() === '') {
                            // If field is missing, switch to that tab immediately
                            if (activeTab !== field.tab) {
                                setActiveTab(field.tab as any);
                                await new Promise(resolve => setTimeout(resolve, 100));
                            }
                            setMessage({ type: 'error', text: `Missing mandatory field: ${field.name.replace('_', ' ')}` });
                            const element = e.currentTarget.querySelector(`[name="${field.name}"]`) as HTMLElement;
                            element?.focus();
                            return;
                        }

                        // Phone Number Specific Validation (10 Digits)
                        if (field.name === 'phone') {
                            const phoneRegex = /^\d{10}$/;
                            // Remove non-digit characters for check
                            const cleanPhone = value.toString().replace(/\D/g, '');
                            if (!phoneRegex.test(cleanPhone)) {
                                if (activeTab !== field.tab) {
                                    setActiveTab(field.tab as any);
                                    await new Promise(resolve => setTimeout(resolve, 100));
                                }
                                setMessage({ type: 'error', text: 'Phone number must be exactly 10 digits' });
                                const element = e.currentTarget.querySelector(`[name="${field.name}"]`) as HTMLElement;
                                element?.focus();
                                return;
                            }
                        }
                    }

                    setIsPending(true);
                    setMessage(null);
                    try {
                        const res = await createPatient(null, formData);
                        if (res?.error) {
                            setMessage({ type: 'error', text: res.error });
                        } else if (onSuccess) {
                            onSuccess(res);
                        } else {
                            setMessage({ type: 'success', text: "Patient profile synchronized successfully." });
                            setTimeout(() => window.location.reload(), 1000);
                        }
                    } catch (err: any) {
                        setMessage({ type: 'error', text: "Systems offline or validation failed." });
                    } finally {
                        setIsPending(false);
                    }
                }} id="patient-master-form" className="flex-1 overflow-hidden flex flex-col bg-slate-50/30">

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        {message && (
                            <div className={`mb-4 p-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                <span className="font-bold text-[11px] uppercase tracking-wide">{message.text}</span>
                            </div>
                        )}

                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">

                            {/* TAB 1: CORE IDENTITY - Optimized Grid */}
                            <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                            <Activity className="h-3 w-3 text-indigo-500" /> Identity Profile
                                        </h3>
                                        <div className="flex gap-3">
                                            <div className="w-1/4">
                                                <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">Title</label>
                                                <select name="title" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs outline-none focus:border-indigo-500 transition-colors">
                                                    <option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Dr.</option><option>Master</option><option>Baby</option>
                                                </select>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">First Name</label>
                                                <input name="first_name" type="text" placeholder="John" required className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs outline-none focus:border-indigo-500 transition-colors" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">Last Name</label>
                                            <input name="last_name" type="text" placeholder="Doe" required className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs outline-none focus:border-indigo-500 transition-colors" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">Gender</label>
                                                <select name="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs outline-none focus:border-indigo-500 transition-colors">
                                                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">Blood Group</label>
                                                <select name="blood_group" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs outline-none focus:border-indigo-500 transition-colors">
                                                    <option value="">Unknown</option>
                                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                            <Calendar className="h-3 w-3 text-emerald-500" /> Vital Timing
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">Age ({ageUnit})</label>
                                                <input type="number" value={age} onChange={(e) => handleAgeChange(e.target.value, ageUnit)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-emerald-50 dark:border-emerald-900/20 rounded-xl font-black text-emerald-600 text-base" />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">Unit</label>
                                                <select value={ageUnit} onChange={(e) => handleAgeChange(age, e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs">
                                                    <option>Years</option><option>Months</option><option>Days</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">Date of Birth</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                                <input name="dob" type="date" value={dob} onChange={(e) => handleDobChange(e.target.value)} className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs" />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-900 rounded-2xl text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                                                    <Shield className="h-4 w-4 text-emerald-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Medical ID Generation</p>
                                                    <p className="text-[10px] font-bold opacity-60 italic">Automated Ledger Link</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TAB 2: RESIDENCY - High Link Density */}
                            <div className={activeTab === 'residency' ? 'block' : 'hidden'}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                            <Phone className="h-3 w-3 text-indigo-500" /> Contact Grid
                                        </h3>
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">Mobile Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                                <input name="phone" type="tel" placeholder="e.g. +91 98765..." required className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">Institutional Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                                <input name="email" type="email" placeholder="john@example.com" className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                            <MapPin className="h-3 w-3 text-emerald-500" /> Geographic Logistics
                                        </h3>
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">Address Line</label>
                                            <input name="street" type="text" placeholder="Street, Area" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs mb-3" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input name="city" type="text" placeholder="City" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs" />
                                                <input name="zip" type="text" placeholder="Pin code" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TAB 3: IDENTITY VAULT - Compact UI */}
                            <div className={activeTab === 'vault' ? 'block' : 'hidden'}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                            <Camera className="h-3 w-3 text-indigo-500" /> Digital Artifacts
                                        </h3>
                                        <div className="flex gap-4">
                                            <div className="flex-1 space-y-2">
                                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider">Bio Photo</label>
                                                <FileUpload
                                                    onUploadComplete={(url) => setProfileImageUrl(url)}
                                                    folder="patients/profiles"
                                                    label="Photo"
                                                    accept="image/*"
                                                    showCamera={true}
                                                />
                                                <input type="hidden" name="profile_image_url" value={profileImageUrl} />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider">Doc ID</label>
                                                <FileUpload
                                                    onUploadComplete={(url) => setIdCardUrl(url)}
                                                    folder="patients/ids"
                                                    label="ID Card"
                                                    accept="application/pdf,image/*"
                                                />
                                                <input type="hidden" name="id_card_url" value={idCardUrl} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                            <Shield className="h-3 w-3 text-emerald-500" /> Fiscal Vault
                                        </h3>
                                        <div className="bg-slate-900 rounded-[1.2rem] p-5 text-white shadow-xl relative overflow-hidden">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                                <span className="text-[8px] font-black uppercase text-emerald-400 tracking-widest">Accounts Receivable</span>
                                            </div>
                                            <div className="text-xl font-black tracking-tight mb-2 uppercase text-emerald-50">Auto-Ledger Synchronized</div>
                                            <p className="text-[9px] text-slate-400 font-bold leading-relaxed mb-4">
                                                World-Standard IFRS/GAAP categorization. Clinical Revenue Hub integrated.
                                            </p>
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                                                <Activity className="h-2.5 w-2.5 text-emerald-400" />
                                                <span className="text-[8px] font-black uppercase text-white tracking-widest">Institutional Lock Enabled</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dense Footer */}
                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between rounded-b-[2rem]">
                        <div className="text-slate-400 text-[8px] font-black uppercase tracking-[0.3em] hidden md:block italic">
                            Secure Healthcare Node • v2.4.1
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : <CheckCircle2 className="h-3.5 w-3.5" />}
                                Commit Registration
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
