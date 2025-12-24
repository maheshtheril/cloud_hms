'use client'

import { useState } from "react"
import { updateHMSSettings } from "@/app/actions/settings"
import { Shield, CreditCard, Save, Calendar, Sparkles } from "lucide-react"

export function HMSSettingsForm({ settings }: { settings: any }) {
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [registrationFee, setRegistrationFee] = useState(settings.registrationFee)
    const [registrationValidity, setRegistrationValidity] = useState(settings.registrationValidity)
    const [enableCardIssuance, setEnableCardIssuance] = useState(settings.enableCardIssuance)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        const res = await updateHMSSettings({
            registrationFee,
            registrationValidity,
            enableCardIssuance
        });

        if (res.success) {
            setMsg({ type: 'success', text: 'Configuration saved successfully.' });
        } else {
            setMsg({ type: 'error', text: res.error || 'Failed to save settings.' });
        }
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Status Message */}
            {msg && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    <div className={`h-2 w-2 rounded-full ${msg.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-bold">{msg.text}</span>
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

                {/* 2. Validity Period Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">Validity Period</h3>
                            <p className="text-xs text-slate-500 font-medium">Registration renewal cycle</p>
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
                        System will prompt for renewal if a patient visits after this period.
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
