'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateHMSSettings, updatePaymentGatewaySettings } from "@/app/actions/settings"
import { Shield, CreditCard, Save, Calendar, Sparkles, AlertCircle, CheckCircle, Stethoscope, Zap, Eye, EyeOff, ToggleLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function HMSSettingsForm({ settings, products, doctors = [], gatewaySettings }: { settings: any, products: any[], doctors?: any[], gatewaySettings?: any }) {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string, debug?: string } | null>(null)

    const [registrationFee, setRegistrationFee] = useState(settings.registrationFee)
    const [registrationValidity, setRegistrationValidity] = useState(settings.registrationValidity)
    const [enableCardIssuance, setEnableCardIssuance] = useState(settings.enableCardIssuance)
    const [selectedProductId, setSelectedProductId] = useState(settings.registrationProductId)
    const [consultationBillingMode, setConsultationBillingMode] = useState(settings.consultationBillingMode || 'post_visit')
    const [defaultDoctorId, setDefaultDoctorId] = useState(settings.defaultDoctorId || '')

    // Payment Gateway Settings
    const [gatewayEnabled, setGatewayEnabled] = useState(gatewaySettings?.enabled ?? false)
    const [gatewayKeyId, setGatewayKeyId] = useState(gatewaySettings?.keyId ?? '')
    const [gatewayKeySecret, setGatewayKeySecret] = useState('')  // Never pre-filled for security
    const [gatewayUpiVpa, setGatewayUpiVpa] = useState(gatewaySettings?.upiVpa ?? '')
    const [gatewayBusinessName, setGatewayBusinessName] = useState(gatewaySettings?.businessName ?? '')
    const [showSecret, setShowSecret] = useState(false)
    const [hasExistingSecret, setHasExistingSecret] = useState(gatewaySettings?.hasKeySecret ?? false)

    // CRITICAL: Sync local state when settings props change (after router.refresh)
    useEffect(() => {
        setRegistrationFee(settings.registrationFee);
        setRegistrationValidity(settings.registrationValidity);
        setEnableCardIssuance(settings.enableCardIssuance);
        setSelectedProductId(settings.registrationProductId);
        setConsultationBillingMode(settings.consultationBillingMode || 'post_visit');
        setDefaultDoctorId(settings.defaultDoctorId || '');
    }, [settings]);

    useEffect(() => {
        if (gatewaySettings) {
            setGatewayEnabled(gatewaySettings.enabled ?? false);
            setGatewayKeyId(gatewaySettings.keyId ?? '');
            setGatewayUpiVpa(gatewaySettings.upiVpa ?? '');
            setGatewayBusinessName(gatewaySettings.businessName ?? '');
            setHasExistingSecret(gatewaySettings.hasKeySecret ?? false);
        }
    }, [gatewaySettings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        const loadingToast = toast({
            title: "Saving Configuration",
            description: "Updating hospital settings and products...",
        });

        try {
            console.log("Submitting HMS settings...");
            const [res, gatewayRes] = await Promise.all([
                updateHMSSettings({
                    registrationFee: parseFloat(String(registrationFee)),
                    registrationValidity: parseInt(String(registrationValidity)),
                    enableCardIssuance: !!enableCardIssuance,
                    consultationBillingMode: consultationBillingMode,
                    productId: selectedProductId,
                    defaultDoctorId: defaultDoctorId || null
                }),
                updatePaymentGatewaySettings({
                    enabled: gatewayEnabled,
                    keyId: gatewayKeyId,
                    keySecret: gatewayKeySecret || undefined,
                    upiVpa: gatewayUpiVpa,
                    businessName: gatewayBusinessName,
                })
            ]);
            // Merge errors from both
            if (!res.success) {
                setMsg({ type: 'error', text: res.error || 'Failed to save HMS settings.', debug: res.debug });
                toast({ title: "Save Failed", description: res.error || "Please check your input.", variant: "destructive" });
                return;
            }
            if (!gatewayRes.success) {
                setMsg({ type: 'error', text: gatewayRes.error || 'Failed to save gateway settings.' });
                toast({ title: "Gateway Save Failed", description: gatewayRes.error, variant: "destructive" });
                return;
            }
            // Fake res to reuse existing success flow
            const res2 = res as any;

            if (loadingToast) loadingToast.dismiss();

            setMsg({ type: 'success', text: 'Configuration saved successfully.' });
            toast({ title: "Success", description: "HMS & Payment Gateway settings updated." });
            if (gatewayKeySecret) { setGatewayKeySecret(''); setHasExistingSecret(true); }
            router.refresh();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            void res2;
        } catch (err: any) {
            if (loadingToast) loadingToast.dismiss();
            console.error("Critical error in settings save:", err);
            setMsg({
                type: 'error',
                text: 'Network or Critical System Error',
                debug: err.message
            });
            toast({
                title: "Critical Error",
                description: "The connection to the server was lost.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Status Message */}
            {msg && (
                <div className={`p-5 rounded-2xl flex flex-col gap-2 border shadow-sm ${msg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    <div className="flex items-center gap-3">
                        {msg.type === 'success' ? (
                            <Sparkles className="h-5 w-5 text-emerald-500" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="text-sm font-black uppercase tracking-tight">{msg.text}</span>
                    </div>
                    {msg.debug && (
                        <div className="mt-1 p-2 bg-red-100/50 rounded-lg text-[10px] font-mono whitespace-pre-wrap break-all opacity-70 border border-red-200 text-red-800">
                            <strong>System Debug:</strong> {msg.debug}
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 0. Registration Product Mapping */}
                <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">Financial Mapping</span>
                            </div>
                            <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 italic">Registration Service Product</h3>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">Select the item from your Inventory Master that should appear on the Patient Invoice.</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <select
                            value={selectedProductId || ''}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-black text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer hover:bg-white dark:hover:bg-slate-900"
                        >
                            <option value="">-- AUTO-PILOT (System searches for Registration Product) --</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} [{p.sku}] - ₹{parseFloat(p.price || '0').toFixed(2)}
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center gap-2 px-1">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                {products.length} Mappable Services Found
                            </p>
                        </div>
                    </div>
                </div>

                {/* DEFAULT DOCTOR CARD */}
                <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Stethoscope className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.2em] bg-teal-50 dark:bg-teal-900/40 px-2 py-0.5 rounded-md">OP Booking</span>
                            </div>
                            <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 italic">Default Doctor for OP Booking</h3>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">Pre-select a doctor when the OP booking form opens. Receptionist can still change it. Leave as <strong>None</strong> to keep current behaviour (manual selection).</p>
                        </div>
                    </div>
                    <select
                        value={defaultDoctorId}
                        onChange={(e) => setDefaultDoctorId(e.target.value)}
                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-black text-slate-900 dark:text-white outline-none focus:border-teal-500 transition-all appearance-none cursor-pointer hover:bg-white dark:hover:bg-slate-900"
                    >
                        <option value="">-- None (Manual Selection - Current Behaviour) --</option>
                        {doctors.map(d => (
                            <option key={d.id} value={d.id}>
                                Dr. {d.first_name} {d.last_name || ''}
                            </option>
                        ))}
                    </select>
                    {defaultDoctorId && (
                        <p className="mt-2 text-[10px] text-teal-600 font-bold uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            OP booking will pre-select this doctor on load
                        </p>
                    )}
                </div>

                {/* 1. Registration Fee Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">Registration Fee</h3>
                            <p className="text-xs text-slate-500 font-medium">Standard charge for new patients</p>
                        </div>
                    </div>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={registrationFee}
                            onChange={(e) => setRegistrationFee(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-lg text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 uppercase tracking-wider">INR</div>
                    </div>
                    <p className="mt-3 text-[10px] text-slate-400 leading-normal">
                        This update will modify the <span className="font-bold text-indigo-500">Master Product Price</span>. All future registrations will use this new rate automatically.
                    </p>
                </div>

                {/* 2. Expiry Duration Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">Registration Validity</h3>
                            <p className="text-xs text-slate-500 font-medium">Renewal duration for patients</p>
                        </div>
                    </div>

                    <div className="relative">
                        <input
                            type="number"
                            min="1"
                            max="3650"
                            value={registrationValidity}
                            onChange={(e) => setRegistrationValidity(e.target.value)}
                            className="w-full pl-4 pr-16 py-3 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-lg text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-colors"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 uppercase tracking-wider">Days</div>
                    </div>
                    <p className="mt-3 text-[10px] text-slate-400 leading-normal">
                        System will default to this validity period for all new registrations.
                    </p>
                </div>

                {/* 3. Consultation Billing Mode */}
                <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/30 rounded-[2.5rem] p-8 shadow-xl shadow-indigo-500/5 group">
                    <div className="flex items-center gap-5 mb-8">
                        <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/40 group-hover:rotate-6 transition-transform">
                            <CreditCard className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 rounded-full">Billing Automation</span>
                            </div>
                            <h3 className="font-black text-2xl text-slate-900 dark:text-white italic tracking-tight">Consultation Billing Mode</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest opacity-70">Define when patients are billed for doctor consultations</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: 'at_booking', label: 'At Booking', desc: 'Pre-paid model. Bill created and shown immediately during appointment setup.', icon: '⚡' },
                            { id: 'post_visit', label: 'After Visit', desc: 'Post-paid model. Fees hidden during booking, billed after the clinical visit.', icon: '🩺' },
                            { id: 'none', label: 'No Automatic Bill', desc: 'Manual billing only. No consultation fees are added automatically.', icon: '🚫' }
                        ].map(mode => (
                            <label
                                key={mode.id}
                                className={`relative flex flex-col p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${consultationBillingMode === mode.id
                                    ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-[1.02]'
                                    : 'bg-slate-50/50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 hover:border-slate-200 opacity-60 hover:opacity-100'
                                    }`}
                                onClick={() => setConsultationBillingMode(mode.id)}
                            >
                                <input type="radio" name="billingMode" value={mode.id} className="hidden" checked={consultationBillingMode === mode.id} onChange={() => { }} />
                                <div className="text-3xl mb-4">{mode.icon}</div>
                                <span className={`text-sm font-black uppercase tracking-widest mb-2 ${consultationBillingMode === mode.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                                    {mode.label}
                                </span>
                                <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                                    {mode.desc}
                                </p>
                                {consultationBillingMode === mode.id && (
                                    <div className="absolute top-4 right-4 h-6 w-6 bg-indigo-500 rounded-full flex items-center justify-center animate-in zoom-in">
                                        <CheckCircle className="h-3 w-3 text-white" />
                                    </div>
                                )}
                            </label>
                        ))}
                    </div>
                </div>

                {/* 3. Card Issuance Toggle */}
                <div className="md:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Shield className="h-6 w-6 text-indigo-300" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Patient ID Card Issuance</h3>
                            <p className="text-xs text-slate-300 font-medium opacity-80">Enable automatic print-queue for new registrations</p>
                        </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={enableCardIssuance}
                            onChange={(e) => setEnableCardIssuance(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                </div>

            </div>

            {/* 4. History Table (The "Amount and Date" part requested) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-sm">Fee Change History</h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4">Effective Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Registration Expiry</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {settings.feeHistory?.length > 0 ? (
                                settings.feeHistory.map((fee: any) => (
                                    <tr key={fee.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-700 dark:text-slate-300">
                                                {new Date(fee.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-medium lowercase italic">
                                                {new Date(fee.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-black text-slate-900 dark:text-white">
                                            ₹{parseFloat(fee.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                                            {fee.validity} Days
                                        </td>
                                        <td className="px-6 py-4">
                                            {fee.active ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-tighter ring-1 ring-emerald-200 dark:ring-emerald-800">
                                                    <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    Current
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-tighter">Archived</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                                        No historical fee records found. Configuration saved will appear here.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Gateway Card */}
            <div className="bg-gradient-to-r from-violet-950 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-violet-800/40">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Zap className="h-6 w-6 text-yellow-300" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-violet-300 uppercase tracking-[0.2em] bg-violet-800/40 px-2 py-0.5 rounded-md">UPI Payments</span>
                                {gatewayEnabled && (
                                    <span className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em] bg-emerald-900/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                                        Live
                                    </span>
                                )}
                            </div>
                            <h3 className="font-bold text-lg text-white">Payment Gateway — Razorpay</h3>
                            <p className="text-xs text-violet-300 font-medium opacity-80">Plug & Play UPI QR payments on billing forms</p>
                        </div>
                    </div>
                    {/* Enable Toggle */}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={gatewayEnabled}
                            onChange={(e) => setGatewayEnabled(e.target.checked)}
                            className="sr-only peer"
                            id="gateway-enabled-toggle"
                        />
                        <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                </div>

                <div className={`space-y-4 transition-all duration-300 ${!gatewayEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
                    {/* Business Name */}
                    <div>
                        <label className="block text-[10px] font-black text-violet-300 uppercase tracking-widest mb-1.5">Hospital / Business Name</label>
                        <input
                            type="text"
                            value={gatewayBusinessName}
                            onChange={(e) => setGatewayBusinessName(e.target.value)}
                            placeholder="e.g. City General Hospital"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 font-bold outline-none focus:border-violet-400 transition-colors"
                        />
                        <p className="text-[10px] text-violet-400 mt-1">Shown to patient on Razorpay payment screen</p>
                    </div>

                    {/* UPI VPA */}
                    <div>
                        <label className="block text-[10px] font-black text-violet-300 uppercase tracking-widest mb-1.5">Hospital UPI ID (VPA)</label>
                        <input
                            type="text"
                            value={gatewayUpiVpa}
                            onChange={(e) => setGatewayUpiVpa(e.target.value)}
                            placeholder="e.g. cityhospital@hdfc"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 font-bold outline-none focus:border-violet-400 transition-colors"
                        />
                        <p className="text-[10px] text-violet-400 mt-1">UPI address where patients' payments will be received</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Key ID */}
                        <div>
                            <label className="block text-[10px] font-black text-violet-300 uppercase tracking-widest mb-1.5">Razorpay Key ID</label>
                            <input
                                type="text"
                                value={gatewayKeyId}
                                onChange={(e) => setGatewayKeyId(e.target.value)}
                                placeholder="rzp_test_xxxxxxxxxxxx"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 font-mono text-sm outline-none focus:border-violet-400 transition-colors"
                            />
                            <p className="text-[10px] text-violet-400 mt-1">Starts with rzp_test_ or rzp_live_</p>
                        </div>

                        {/* Key Secret */}
                        <div>
                            <label className="block text-[10px] font-black text-violet-300 uppercase tracking-widest mb-1.5">
                                Razorpay Key Secret
                                {hasExistingSecret && !gatewayKeySecret && (
                                    <span className="ml-2 text-emerald-400 normal-case font-bold text-[9px] bg-emerald-900/40 px-1.5 py-0.5 rounded">
                                        ✓ Saved
                                    </span>
                                )}
                            </label>
                            <div className="relative">
                                <input
                                    type={showSecret ? 'text' : 'password'}
                                    value={gatewayKeySecret}
                                    onChange={(e) => setGatewayKeySecret(e.target.value)}
                                    placeholder={hasExistingSecret ? '••••••• (leave blank to keep existing)' : 'Enter your Key Secret'}
                                    className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 font-mono text-sm outline-none focus:border-violet-400 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSecret(!showSecret)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                                >
                                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <p className="text-[10px] text-violet-400 mt-1">Never stored in browser. Server-only encryption.</p>
                        </div>
                    </div>

                    {!gatewayKeyId && (
                        <div className="flex items-start gap-3 p-4 bg-amber-900/30 rounded-xl border border-amber-700/40">
                            <ToggleLeft className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-300 font-medium">
                                No keys yet? That's OK — save and come back here after you get your Razorpay API keys.
                                The gateway button on the billing form will be hidden until keys are entered.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    Save Configuration
                </button>
            </div>
        </form>
    )
}
