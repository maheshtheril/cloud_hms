'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateHMSSettings } from "@/app/actions/settings"
import { Shield, CreditCard, Save, Calendar, Sparkles, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function HMSSettingsForm({ settings }: { settings: any }) {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string, debug?: string } | null>(null)

    const [registrationFee, setRegistrationFee] = useState(settings.registrationFee)
    const [registrationValidity, setRegistrationValidity] = useState(settings.registrationValidity)
    const [enableCardIssuance, setEnableCardIssuance] = useState(settings.enableCardIssuance)

    // CRITICAL: Sync local state when settings props change (after router.refresh)
    useEffect(() => {
        setRegistrationFee(settings.registrationFee);
        setRegistrationValidity(settings.registrationValidity);
        setEnableCardIssuance(settings.enableCardIssuance);
    }, [settings]);

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
            const res = await updateHMSSettings({
                registrationFee: parseFloat(String(registrationFee)),
                registrationValidity: parseInt(String(registrationValidity)),
                enableCardIssuance: !!enableCardIssuance
            });

            if (loadingToast) loadingToast.dismiss();

            if (res.success) {
                setMsg({ type: 'success', text: 'Configuration saved successfully.' });
                toast({
                    title: "Success",
                    description: "HMS registration settings updated.",
                });
                router.refresh();
            } else {
                setMsg({
                    type: 'error',
                    text: res.error || 'Failed to save settings.',
                    debug: res.debug
                });
                toast({
                    title: "Save Failed",
                    description: res.error || "Please check your input.",
                    variant: "destructive",
                });
            }
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
