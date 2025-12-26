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
    initialData?: any
    registrationFee?: number
    registrationProductId?: string | null
    registrationProductName?: string
    registrationProductDescription?: string
}

export function CreatePatientForm({
    tenantCountry = 'IN',
    onClose,
    onSuccess,
    isDialog = false,
    initialData,
    registrationFee = 500,
    registrationProductId = null,
    registrationProductName = 'Patient Registration Fee',
    registrationProductDescription = 'Standard Service'
}: CreatePatientFormProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'basic' | 'residency' | 'vault'>('basic');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isPending, setIsPending] = useState(false);

    // State for Vault
    const [profileImageUrl, setProfileImageUrl] = useState(initialData?.profile_image_url || initialData?.metadata?.profile_image_url || '');
    const [idCardUrl, setIdCardUrl] = useState(initialData?.metadata?.id_card_url || '');

    // State for Age/DOB logic
    const calculateAge = (dobString: string) => {
        if (!dobString) return { age: '', unit: 'Years' };
        const birthDate = new Date(dobString);
        const today = new Date();
        let ageYears = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) ageYears--;
        return { age: ageYears.toString(), unit: 'Years' };
    };

    const initialAgeData = initialData?.dob ? calculateAge(initialData.dob.toString()) : { age: '', unit: 'Years' };

    const [age, setAge] = useState(initialAgeData.age);
    const [ageUnit, setAgeUnit] = useState(initialAgeData.unit);
    const [dob, setDob] = useState(initialData?.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '');
    const [gender, setGender] = useState(initialData?.gender || 'male');

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
                                Patient Master <span className="text-indigo-400">{initialData ? 'Update' : 'Registration'}</span>
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
                <form noValidate onSubmit={async (e) => {
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
                                await new Promise(resolve => setTimeout(resolve, 100)); // Allow render
                            }
                            setMessage({ type: 'error', text: `Missing mandatory field: ${field.name.replace('_', ' ')}` });

                            // Safe focus with retry
                            setTimeout(() => {
                                const element = document.querySelector(`[name="${field.name}"]`) as HTMLElement;
                                element?.focus();
                            }, 150);
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

                                setTimeout(() => {
                                    const element = document.querySelector(`[name="${field.name}"]`) as HTMLElement;
                                    element?.focus();
                                }, 150);
                                return;
                            }
                        }
                    }

                    setIsPending(true);
                    setMessage(null);
                    try {
                        const res = await createPatient(initialData?.id || null, formData);
                        if ((res as any)?.error) {
                            setMessage({ type: 'error', text: (res as any).error });
                        } else {
                            if ((res as any).invoiceId) {
                                // REDIRECT TO BILLING (Visual Confirmation of Payment)
                                setMessage({ type: 'success', text: "Registration complete. Redirecting to Billing..." });
                                // Small delay to let user see success message
                                setTimeout(() => {
                                    router.push(`/hms/billing/${(res as any).invoiceId}`);
                                }, 800);
                                if (onSuccess) onSuccess(res); // Optional: still call onSuccess for parent refresh
                                return;
                            }

                            if (onSuccess) {
                                // Server-side billing is now handled in createPatient action
                                onSuccess(res);
                            } else {
                                // Standalone mode
                                setMessage({ type: 'success', text: "Patient profile created successfully." });
                                setTimeout(() => window.location.reload(), 1000);
                            }
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
                                                <select defaultValue={initialData?.metadata?.title} name="title" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs outline-none focus:border-indigo-500 transition-colors">
                                                    <option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Dr.</option><option>Master</option><option>Baby</option>
                                                </select>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">First Name</label>
                                                <input defaultValue={initialData?.first_name} name="first_name" type="text" placeholder="John" required className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs outline-none focus:border-indigo-500 transition-colors" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">Last Name</label>
                                            <input defaultValue={initialData?.last_name} name="last_name" type="text" placeholder="Doe" required className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs outline-none focus:border-indigo-500 transition-colors" />
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
                                                <select defaultValue={initialData?.metadata?.blood_group} name="blood_group" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs outline-none focus:border-indigo-500 transition-colors">
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
                                    <div className="space-y-4 bg-whiteダークbg-slate-800/40 p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                            <Phone className="h-3 w-3 text-indigo-500" /> Contact Grid
                                        </h3>
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">Mobile Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                                <input defaultValue={initialData?.contact?.phone} name="phone" type="tel" placeholder="e.g. +91 98765..." required className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">Institutional Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                                <input defaultValue={initialData?.contact?.email} name="email" type="email" placeholder="john@example.com" className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 bg-white dark:bg-slate-800/40 p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                            <MapPin className="h-3 w-3 text-emerald-500" /> Geographic Logistics
                                        </h3>
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-500 mb-1 uppercase tracking-wider">Address Line</label>
                                            <input defaultValue={initialData?.contact?.address?.street} name="street" type="text" placeholder="Street, Area" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs mb-3" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input defaultValue={initialData?.contact?.address?.city} name="city" type="text" placeholder="City" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs" />
                                                <input defaultValue={initialData?.contact?.address?.zip} name="zip" type="text" placeholder="Pin code" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-xs" />
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
                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 md:flex flex-row items-center justify-between rounded-b-[2rem] gap-4">
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input type="checkbox" name="charge_registration" defaultChecked className="peer sr-only" />
                                    <input type="hidden" name="registration_fee" value={registrationFee} />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-100 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-indigo-900 dark:text-indigo-200 tracking-wider group-hover:text-indigo-600 transition-colors">Charge Registration Fee</span>
                                    <span className="text-[8px] font-bold text-slate-400">Standard Service ({registrationFee.toFixed(2)})</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input type="checkbox" name="issue_card" defaultChecked className="peer sr-only" />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-100 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                                </div>
                                <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-wider group-hover:text-emerald-600 transition-colors">Issue Patient Card</span>
                            </label>
                        </div>

                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                            <button
                                type="button"
                                onClick={() => onClose ? onClose() : router.back()}
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
