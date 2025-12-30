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

    // Billing Options State
    const [chargeRegistration, setChargeRegistration] = useState(true);

    // Prompt for missing phone
    const [phone, setPhone] = useState(initialData?.contact?.phone || '');
    const [showPhonePrompt, setShowPhonePrompt] = useState(false);

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
        <div className={isDialog ? "h-full flex flex-col" : "fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center z-50 p-4"}>
            <div className={`bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col border border-white/20 dark:border-slate-800 ${isDialog ? 'h-full shadow-none border-none rounded-none' : 'shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]'}`}>

                {/* Ultra-Modern Header */}
                <div className="px-8 py-6 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between z-10 relative">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white transform rotate-3">
                            <User className="h-7 w-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                {initialData ? 'Update Profile' : 'New Patient Registration'}
                            </h2>
                            <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Institutional Health Registry • v3.0 Pro
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="h-10 w-10 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl flex items-center justify-center transition-all active:scale-95">
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* iPhone-style Segmented Control */}
                <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex p-1.5 bg-slate-200/50 dark:bg-slate-800 rounded-2xl relative">
                        {/* Animated Background Indicator would go here with Framer Motion, using CSS for now */}
                        {[
                            { id: 'basic', label: 'Core Identity', icon: User },
                            { id: 'residency', label: 'Contact & Location', icon: MapPin },
                            { id: 'vault', label: 'Digital Vault', icon: Shield }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-500 relative z-10 ${activeTab === tab.id
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md transform scale-[1.02]'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/30'
                                    }`}
                            >
                                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-indigo-500' : ''}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scrollable Form Body */}
                <form noValidate onSubmit={async (e) => {
                    e.preventDefault();
                    // ... (Keeping logic same, just improving layout) ...
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
                            if (field.name === 'phone') {
                                setShowPhonePrompt(true);
                                return;
                            }
                            if (activeTab !== field.tab) {
                                setActiveTab(field.tab as any);
                                await new Promise(resolve => setTimeout(resolve, 100)); // Allow render
                            }
                            setMessage({ type: 'error', text: `Missing mandatory field: ${field.name.replace('_', ' ')}` });
                            setTimeout(() => {
                                const element = document.querySelector(`[name="${field.name}"]`) as HTMLElement;
                                element?.focus();
                            }, 150);
                            return;
                        }
                        if (field.name === 'phone') {
                            const phoneRegex = /^\d{10}$/;
                            const cleanPhone = value.toString().replace(/\D/g, '');
                            if (!phoneRegex.test(cleanPhone)) {
                                setShowPhonePrompt(true);
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
                                // REDIRECT TO BILLING
                                const warning = (res as any).warning;
                                if (warning) {
                                    setMessage({ type: 'error', text: `Registration done, but: ${warning}` });
                                } else {
                                    setMessage({ type: 'success', text: "Registration complete. Redirecting..." });
                                }
                                setTimeout(() => {
                                    router.push(`/hms/billing/${(res as any).invoiceId}`);
                                }, 800);
                                if (onSuccess) onSuccess(res);
                                return;
                            } else if ((res as any).billingError) {
                                setMessage({ type: 'error', text: `Registration done, but Billing Failed: ${(res as any).billingError}` });
                                if (onSuccess) onSuccess(res);
                                return;
                            }

                            if (onSuccess) onSuccess(res);
                            else {
                                setMessage({ type: 'success', text: "Patient profile created successfully." });
                                setTimeout(() => window.location.reload(), 1000);
                            }
                        }
                    } catch (err: any) {
                        setMessage({ type: 'error', text: "Systems offline or validation failed." });
                    } finally {
                        setIsPending(false);
                    }
                }} id="patient-master-form" className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-slate-950 relative">

                    <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin scrollbar-thumb-indigo-100 dark:scrollbar-thumb-slate-800">
                        {message && (
                            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 shadow-lg ${message.type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'bg-gradient-to-r from-rose-500 to-red-500 text-white'
                                }`}>
                                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                </div>
                                <span className="font-bold text-sm tracking-wide">{message.text}</span>
                            </div>
                        )}

                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">

                            {/* TAB 1: IDENTITY */}
                            <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    <div className="lg:col-span-8 space-y-8">
                                        {/* Name Section */}
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                                            <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                <User className="h-4 w-4" /> Personal Details
                                            </h3>
                                            <div className="grid grid-cols-12 gap-4">
                                                <div className="col-span-3">
                                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Title</label>
                                                    <div className="relative">
                                                        <select defaultValue={initialData?.metadata?.title} name="title" className="w-full h-12 px-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all appearance-none">
                                                            <option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Dr.</option><option>Baby</option>
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                                                    </div>
                                                </div>
                                                <div className="col-span-9 grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">First Name</label>
                                                        <input defaultValue={initialData?.first_name} name="first_name" type="text" placeholder="First Name" required onChange={(e) => e.target.value = e.target.value.replace(/\b\w/g, c => c.toUpperCase())} className="w-full h-12 px-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Last Name</label>
                                                        <input defaultValue={initialData?.last_name} name="last_name" type="text" placeholder="Last Name" required onChange={(e) => e.target.value = e.target.value.replace(/\b\w/g, c => c.toUpperCase())} className="w-full h-12 px-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Demographics */}
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                                            <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                <Activity className="h-4 w-4" /> Vitals & Demographics
                                            </h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Gender</label>
                                                    <div className="flex gap-2">
                                                        {['male', 'female', 'other'].map(g => (
                                                            <button key={g} type="button" onClick={() => setGender(g)} className={`flex-1 h-12 rounded-xl border-2 font-bold uppercase text-xs transition-all ${gender === g ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'}`}>
                                                                {g}
                                                            </button>
                                                        ))}
                                                        <input type="hidden" name="gender" value={gender} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Blood Group</label>
                                                    <div className="relative">
                                                        <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-400" />
                                                        <select defaultValue={initialData?.metadata?.blood_group} name="blood_group" className="w-full h-12 pl-12 pr-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all appearance-none">
                                                            <option value="">Select Group</option>
                                                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-12 gap-4">
                                                <div className="col-span-2 md:col-span-5">
                                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Date of Birth</label>
                                                    <input name="dob" type="date" value={dob} onChange={(e) => handleDobChange(e.target.value)} className="w-full h-12 px-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl font-bold text-slate-700 outline-none focus:border-indigo-500" />
                                                </div>
                                                <div className="col-span-2 md:col-span-2 flex items-center justify-center pt-2 md:pt-6">
                                                    <span className="text-xs font-bold text-slate-300">OR</span>
                                                </div>
                                                <div className="col-span-1 md:col-span-3">
                                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Age</label>
                                                    <input type="number" value={age} onChange={(e) => handleAgeChange(e.target.value, ageUnit)} className="w-full h-12 px-4 bg-white dark:bg-slate-800 border-2 border-emerald-100 dark:border-emerald-900/30 rounded-xl font-black text-emerald-600 text-lg outline-none focus:border-emerald-500" placeholder="0" />
                                                </div>
                                                <div className="col-span-1 md:col-span-2">
                                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Unit</label>
                                                    <select value={ageUnit} onChange={(e) => handleAgeChange(age, e.target.value)} className="w-full h-12 px-2 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl font-bold text-xs outline-none focus:border-indigo-500">
                                                        <option>Years</option><option>Months</option><option>Days</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar for ID */}
                                    <div className="lg:col-span-4 space-y-6">
                                        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-32 bg-indigo-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                            <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-4 z-10 relative">Digital Identity</h3>
                                            <div className="space-y-4 relative z-10">
                                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                                                    <label className="block text-[10px] font-bold text-indigo-200 mb-2 uppercase">Profile Photo</label>
                                                    <FileUpload onUploadComplete={(url) => setProfileImageUrl(url)} folder="patients/profiles" label="Upload Photo" accept="image/*" showCamera={true} />
                                                    <input type="hidden" name="profile_image_url" value={profileImageUrl} />
                                                </div>
                                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                                                    <label className="block text-[10px] font-bold text-indigo-200 mb-2 uppercase">Govt ID Proof</label>
                                                    <FileUpload onUploadComplete={(url) => setIdCardUrl(url)} folder="patients/ids" label="Upload Document" accept="application/pdf,image/*" />
                                                    <input type="hidden" name="id_card_url" value={idCardUrl} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TAB 2: RESIDENCY */}
                            <div className={activeTab === 'residency' ? 'block' : 'hidden'}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <Phone className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact Information</h3>
                                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Primary Communication Channels</p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Mobile Number <span className="text-rose-500">*</span></label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                                    <input
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        name="phone"
                                                        type="tel"
                                                        placeholder="e.g. 9876543210"
                                                        required
                                                        className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all text-lg tracking-wide"
                                                    />

                                                    {/* Phone Prompt Overlay */}

                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                                    <input defaultValue={initialData?.contact?.email} name="email" type="email" placeholder="email@example.com" className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                <MapPin className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Residential Address</h3>
                                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Logistics & Billing</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <textarea defaultValue={initialData?.contact?.address?.street} name="street" placeholder="Street Address, Area, Landmark" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all min-h-[100px] resize-none" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input defaultValue={initialData?.contact?.address?.city} name="city" type="text" placeholder="City" className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all" />
                                                <input defaultValue={initialData?.contact?.address?.zip} name="zip" type="text" placeholder="Pincode" className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TAB 3: VAULT */}
                            <div className={activeTab === 'vault' ? 'block' : 'hidden'}>
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                                    <div className="h-32 w-32 bg-slate-100 rounded-full flex items-center justify-center">
                                        <Shield className="h-16 w-16 text-slate-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800">Secure Fiscal Vault</h3>
                                        <p className="text-slate-500 max-w-md mx-auto mt-2">
                                            All financial transactions and privacy records are encrypted and stored in our secure ledger.
                                            <br /><span className="text-xs uppercase tracking-widest font-bold text-indigo-500 mt-2 block">Powered by Blockchain Ledger v4</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Premium Footer with Gradient Visuals */}
                    <div className="px-8 py-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center gap-6">
                            {/* Stylish Checkbox Card */}
                            <label className="group flex items-center gap-4 cursor-pointer p-2 pr-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={chargeRegistration}
                                        onChange={(e) => setChargeRegistration(e.target.checked)}
                                        className="peer sr-only"
                                        name="charge_registration"
                                    />
                                    <input type="hidden" name="registration_fee" value={registrationFee} />
                                    <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500 shadow-inner"></div>
                                </div>
                                <div>
                                    <span className="block text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider group-hover:text-emerald-600 transition-colors">Immediate Billing</span>
                                    <span className="block text-[10px] font-bold text-slate-400">Registration Fee: <span className="text-emerald-500">₹{registrationFee.toFixed(2)}</span></span>
                                </div>
                            </label>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => onClose ? onClose() : router.back()}
                                className="px-6 py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 hover:border-slate-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isPending ? (
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : <CheckCircle2 className="h-4 w-4" />}
                                Complete Registration
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Global Phone Prompt Overlay (Placed here to ensure visibility over tabs) */}
            {showPhonePrompt && (
                <div className="absolute inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm p-8 rounded-3xl shadow-2xl border border-white/20 animate-in zoom-in-95 scale-100 ring-4 ring-indigo-500/20">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 shadow-inner">
                                <Phone className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Mobile Required</h3>
                            <p className="text-slate-500 font-medium text-sm">Please enter the patient's WhatsApp-enabled mobile number to proceed.</p>
                        </div>
                        <div className="space-y-6">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">+91</span>
                                <input
                                    autoFocus
                                    value={phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 10) setPhone(val);
                                    }}
                                    placeholder="Mobile Number"
                                    className="w-full h-16 pl-14 pr-6 text-2xl bg-slate-50 border-2 border-indigo-100 focus:border-indigo-500 rounded-2xl font-black text-slate-800 outline-none tracking-widest text-center transition-all shadow-sm focus:shadow-md"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (phone && phone.length === 10) {
                                        setShowPhonePrompt(false);
                                        const form = document.querySelector('form#patient-master-form') as HTMLFormElement;
                                        if (form) form.requestSubmit();
                                    } else {
                                        setMessage({ type: 'error', text: 'Please enter a valid 10-digit number' });
                                    }
                                }}
                                className="w-full h-16 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="h-5 w-5" />
                                Save & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}
