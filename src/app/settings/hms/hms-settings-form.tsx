'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateHMSSettings, updatePaymentGatewaySettings, updateWhatsAppSettings, updatePDFSettings } from "@/app/actions/settings"
import { Shield, CreditCard, Save, Calendar, Sparkles, AlertCircle, CheckCircle, Stethoscope, Zap, Eye, EyeOff, ToggleLeft, MessageSquare, FileText, AlignLeft, AlignCenter, AlignRight, Type } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function HMSSettingsForm({ settings, products, doctors = [], gatewaySettings, whatsappSettings, pdfSettings }: { settings: any, products: any[], doctors?: any[], gatewaySettings?: any, whatsappSettings?: any, pdfSettings?: any }) {
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

    // WhatsApp Settings
    const [whatsappEnabled, setWhatsappEnabled] = useState(whatsappSettings?.enabled ?? false)
    const [whatsappInstanceId, setWhatsappInstanceId] = useState(whatsappSettings?.instanceId ?? '')
    const [whatsappToken, setWhatsappToken] = useState('') // Masked
    const [whatsappAutoSendBill, setWhatsappAutoSendBill] = useState(whatsappSettings?.autoSendBill ?? false)
    const [showWhatsappToken, setShowWhatsappToken] = useState(false)
    const [hasExistingWhatsappToken, setHasExistingWhatsappToken] = useState(whatsappSettings?.hasToken ?? false)

    // PDF Print Settings
    const [pdfHeaderAlignment, setPdfHeaderAlignment] = useState<'left' | 'center' | 'right'>(pdfSettings?.headerAlignment || 'right')
    const [pdfShowLogo, setPdfShowLogo] = useState(pdfSettings?.showLogo ?? true)
    const [pdfHospitalNameSize, setPdfHospitalNameSize] = useState(pdfSettings?.hospitalNameSize || 16)
    const [pdfAddressSize, setPdfAddressSize] = useState(pdfSettings?.addressSize || 10)
    const [pdfShowContactInfo, setPdfShowContactInfo] = useState(pdfSettings?.showContactInfo ?? true)

    // Sync local state when settings props change
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

    useEffect(() => {
        if (whatsappSettings) {
            setWhatsappEnabled(whatsappSettings.enabled ?? false);
            setWhatsappInstanceId(whatsappSettings.instanceId ?? '');
            setWhatsappAutoSendBill(whatsappSettings.autoSendBill ?? false);
            setHasExistingWhatsappToken(whatsappSettings.hasToken ?? false);
        }
    }, [whatsappSettings]);

    useEffect(() => {
        if (pdfSettings) {
            setPdfHeaderAlignment(pdfSettings.headerAlignment || 'right');
            setPdfShowLogo(pdfSettings.showLogo ?? true);
            setPdfHospitalNameSize(pdfSettings.hospitalNameSize || 16);
            setPdfAddressSize(pdfSettings.addressSize || 10);
            setPdfShowContactInfo(pdfSettings.showContactInfo ?? true);
        }
    }, [pdfSettings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        const loadingToast = toast({
            title: "Saving Configuration",
            description: "Updating hospital settings and products...",
        });

        try {
            const [res, gatewayRes, whatsappRes, pdfRes] = await Promise.all([
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
                }),
                updateWhatsAppSettings({
                    enabled: whatsappEnabled,
                    instanceId: whatsappInstanceId,
                    token: whatsappToken || undefined,
                    autoSendBill: whatsappAutoSendBill
                }),
                updatePDFSettings({
                    headerAlignment: pdfHeaderAlignment,
                    showLogo: pdfShowLogo,
                    hospitalNameSize: pdfHospitalNameSize,
                    addressSize: pdfAddressSize,
                    showContactInfo: pdfShowContactInfo
                })
            ]);

            if (!res.success) throw new Error(res.error || "Failed to save HMS settings");
            if (!gatewayRes.success) throw new Error(gatewayRes.error || "Failed to save Gateway settings");
            if (!whatsappRes.success) throw new Error(whatsappRes.error || "Failed to save WhatsApp settings");
            if (!pdfRes.success) throw new Error(pdfRes.error || "Failed to save PDF settings");

            if (loadingToast) loadingToast.dismiss();

            setMsg({ type: 'success', text: 'Configuration saved successfully.' });
            toast({ title: "Success", description: "All settings updated." });

            if (gatewayKeySecret) { setGatewayKeySecret(''); setHasExistingSecret(true); }
            if (whatsappToken) { setWhatsappToken(''); setHasExistingWhatsappToken(true); }

            router.refresh();
        } catch (err: any) {
            if (loadingToast) loadingToast.dismiss();
            setMsg({ type: 'error', text: err.message || 'Failed to save configuration' });
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-24">
            {/* Status Message */}
            {msg && (
                <div className={`p-5 rounded-2xl flex flex-col gap-2 border shadow-sm ${msg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    <div className="flex items-center gap-3">
                        {msg.type === 'success' ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="text-sm font-black uppercase tracking-tight">{msg.text}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Registration Product Mapping */}
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
                        </div>
                    </div>
                    <select
                        value={selectedProductId || ''}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-black text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">-- AUTO-PILOT (System searches for Registration Product) --</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} [{p.sku}] - ₹{parseFloat(p.price || '0').toFixed(2)}</option>
                        ))}
                    </select>
                </div>

                {/* Default Doctor */}
                <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Stethoscope className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.2em] bg-teal-50 dark:bg-teal-900/40 px-2 py-0.5 rounded-md">OP Booking</span>
                            </div>
                            <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 italic">Default Doctor</h3>
                        </div>
                    </div>
                    <select
                        value={defaultDoctorId}
                        onChange={(e) => setDefaultDoctorId(e.target.value)}
                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-black text-slate-900 dark:text-white outline-none focus:border-teal-500 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">-- None (Manual Selection) --</option>
                        {doctors.map(d => (
                            <option key={d.id} value={d.id}>Dr. {d.first_name} {d.last_name || ''}</option>
                        ))}
                    </select>
                </div>

                {/* Registration Fee */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Fee Amount</h3>
                    </div>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                        <input
                            type="number"
                            value={registrationFee}
                            onChange={(e) => setRegistrationFee(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-lg outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Registration Validity */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Validity Period</h3>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={registrationValidity}
                            onChange={(e) => setRegistrationValidity(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold text-lg outline-none focus:border-emerald-500"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 uppercase tracking-wider">Days</div>
                    </div>
                </div>

                {/* Consultation Billing Mode */}
                <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-6 shadow-sm group">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 italic">Consultation Billing Mode</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: 'at_booking', label: 'At Booking', icon: '⚡' },
                            { id: 'post_visit', label: 'After Visit', icon: '🩺' },
                            { id: 'none', label: 'Manual Only', icon: '🚫' }
                        ].map(mode => (
                            <button
                                key={mode.id}
                                type="button"
                                onClick={() => setConsultationBillingMode(mode.id)}
                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${consultationBillingMode === mode.id ? 'border-indigo-500 bg-white dark:bg-slate-800 shadow-md' : 'border-slate-100 dark:border-slate-800 opacity-60'}`}
                            >
                                <span className="text-2xl">{mode.icon}</span>
                                <span className="text-xs font-black uppercase tracking-widest">{mode.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* WhatsApp Cloud API */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 italic">WhatsApp Cloud API</h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={whatsappEnabled} onChange={(e) => setWhatsappEnabled(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                    </div>
                    <div className={`space-y-4 ${!whatsappEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
                        <input type="text" value={whatsappInstanceId} onChange={(e) => setWhatsappInstanceId(e.target.value)} placeholder="Instance ID" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" />
                        <div className="relative">
                            <input type={showWhatsappToken ? 'text' : 'password'} value={whatsappToken} onChange={(e) => setWhatsappToken(e.target.value)} placeholder={hasExistingWhatsappToken ? '••••••••••••••••' : 'API Token'} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" />
                            <button type="button" onClick={() => setShowWhatsappToken(!showWhatsappToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                {showWhatsappToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <label className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl cursor-pointer">
                            <input type="checkbox" checked={whatsappAutoSendBill} onChange={(e) => setWhatsappAutoSendBill(e.target.checked)} className="h-4 w-4 accent-emerald-500" />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 italic">Auto-send Bill PDFs</span>
                        </label>
                    </div>
                </div>

                {/* PDF Print Layout */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm group">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center">
                            <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 italic">PDF Print Layout</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-2">
                            {['left' as const, 'center' as const, 'right' as const].map(pos => (
                                <button key={pos} type="button" onClick={() => setPdfHeaderAlignment(pos)} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${pdfHeaderAlignment === pos ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800 opacity-60'}`}>
                                    {pos === 'left' ? <AlignLeft className="h-4 w-4" /> : pos === 'center' ? <AlignCenter className="h-4 w-4" /> : <AlignRight className="h-4 w-4" />}
                                    <span className="text-[10px] font-black uppercase">{pos}</span>
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase text-slate-400">Hospital Name Size</span>
                                <input type="range" min="12" max="24" value={pdfHospitalNameSize} onChange={(e) => setPdfHospitalNameSize(parseInt(e.target.value))} className="w-full accent-indigo-600" />
                                <div className="text-center text-[10px] font-bold text-indigo-600">{pdfHospitalNameSize}px</div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase text-slate-400">Address Size</span>
                                <input type="range" min="8" max="14" value={pdfAddressSize} onChange={(e) => setPdfAddressSize(parseInt(e.target.value))} className="w-full accent-indigo-600" />
                                <div className="text-center text-[10px] font-bold text-indigo-600">{pdfAddressSize}px</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-3 text-xs font-bold italic text-slate-700 dark:text-slate-300 cursor-pointer">
                                <input type="checkbox" checked={pdfShowLogo} onChange={(e) => setPdfShowLogo(e.target.checked)} className="h-4 w-4 accent-indigo-600" />
                                Show Hospital Logo
                            </label>
                            <label className="flex items-center gap-3 text-xs font-bold italic text-slate-700 dark:text-slate-300 cursor-pointer">
                                <input type="checkbox" checked={pdfShowContactInfo} onChange={(e) => setPdfShowContactInfo(e.target.checked)} className="h-4 w-4 accent-indigo-600" />
                                Show Contact Details
                            </label>
                        </div>
                    </div>
                </div>

                {/* Payment Gateway */}
                <div className="md:col-span-2 bg-gradient-to-r from-violet-950 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-violet-800/40">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Zap className="h-6 w-6 text-yellow-300" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Razorpay Gateway</h3>
                                <p className="text-xs text-violet-300 font-medium opacity-80">UPI QR Payments on Billing</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={gatewayEnabled} onChange={(e) => setGatewayEnabled(e.target.checked)} className="sr-only peer" />
                            <div className="w-14 h-7 bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                    </div>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!gatewayEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
                        <input type="text" value={gatewayBusinessName} onChange={(e) => setGatewayBusinessName(e.target.value)} placeholder="Hospital Business Name" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40" />
                        <input type="text" value={gatewayUpiVpa} onChange={(e) => setGatewayUpiVpa(e.target.value)} placeholder="UPI ID (VPA)" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40" />
                        <input type="text" value={gatewayKeyId} onChange={(e) => setGatewayKeyId(e.target.value)} placeholder="Razorpay Key ID" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40" />
                        <div className="relative">
                            <input type={showSecret ? 'text' : 'password'} value={gatewayKeySecret} onChange={(e) => setGatewayKeySecret(e.target.value)} placeholder={hasExistingSecret ? '••••••••' : 'Key Secret'} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40" />
                            <button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50 flex justify-center">
                <div className="max-w-4xl w-full flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-2xl transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="h-5 w-5" />}
                        <span>Save Settings</span>
                    </button>
                </div>
            </div>
        </form>
    )
}
