'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Mail, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface Branding {
    app_name: string | null;
    logo_url: string | null;
    name: string | null;
    isPublic: boolean;
}

export default function LoginClient({ branding }: { branding: Branding | null }) {
    const [isLoading, setIsLoading] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    // Form State for Login
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        try {
            await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                callbackUrl: "/"
            })
        } catch (error) {
            console.error(error)
            setIsLoading(false)
        }
    }

    const appName = branding?.app_name || "Ziona HMS";

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative font-sans overflow-hidden">

            {/* Clean Medical Background - Soft Gradients */}
            <div className="absolute inset-0 z-0 bg-white">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-cyan-100/50 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-100/50 blur-[100px]" />
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-blue-50 blur-[80px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-[400px] w-full relative z-10"
            >
                {/* Clean Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden ring-1 ring-black/5">

                    <div className="text-center mb-8 relative">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="w-24 h-24 mx-auto mb-4 relative flex items-center justify-center"
                        >
                            {/* Free Floating Logo - No Box */}
                            {branding?.logo_url ? (
                                <img src={branding.logo_url} alt={appName} className="w-full h-full object-contain filter drop-shadow-lg" />
                            ) : (
                                <Sparkles className="text-cyan-600 w-12 h-12" />
                            )}
                        </motion.div>

                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                            {appName}
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Sign in to your account
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Email</label>
                            <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'scale-[1.01]' : 'scale-100'}`}>
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail className={`h-4.5 w-4.5 transition-colors duration-200 ${focusedField === 'email' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-semibold"
                                    placeholder="doctor@hospital.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Help?</a>
                            </div>
                            <div className={`relative transition-all duration-200 ${focusedField === 'password' ? 'scale-[1.01]' : 'scale-100'}`}>
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className={`h-4.5 w-4.5 transition-colors duration-200 ${focusedField === 'password' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-semibold"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mt-2 disabled:opacity-70 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Legal/Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-[10px] uppercase font-bold text-slate-300 tracking-widest">
                            Secure Access
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
