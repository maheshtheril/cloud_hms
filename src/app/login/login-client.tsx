'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Mail, Lock, ArrowRight, Loader2, Sparkles, Building2, Activity } from "lucide-react"
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
        <div className="min-h-screen w-full flex items-center justify-center font-sans overflow-hidden relative">

            {/* Cinematic Background (Fixed Full Screen) */}
            <div className="absolute inset-0 bg-slate-900">
                <motion.div
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src="/login-bg.png"
                        alt="Background"
                        className="w-full h-full object-cover opacity-80"
                    />
                    {/* Gradient Overlays for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-slate-900/40" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950/40 to-slate-950/80" />
                </motion.div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto p-4 flex flex-col items-center justify-center">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    {/* Glassmorphism Card */}
                    <div className="backdrop-blur-xl bg-white/10 dark:bg-black/40 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-3xl overflow-hidden relative">
                        {/* Glow Effect Top */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-[80px]" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-[80px]" />

                        <div className="p-8 md:p-10 relative z-10">

                            {/* Header Section */}
                            <div className="text-center mb-10">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex justify-center mb-6"
                                >
                                    {branding?.logo_url ? (
                                        <div className="w-24 h-24 relative flex items-center justify-center">
                                            {/* Glow behind logo to ensure visibility of dark logos */}
                                            <div className="absolute inset-0 bg-white/10 blur-[30px] rounded-full" />
                                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 rounded-full blur-xl animate-pulse" />

                                            <img
                                                src={branding.logo_url}
                                                alt={appName}
                                                className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 p-0.5 shadow-2xl shadow-cyan-500/30">
                                            <div className="w-full h-full bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                                                <Activity className="w-10 h-10 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-50 to-indigo-100 tracking-[0.15em] uppercase drop-shadow-sm mb-2">
                                        {appName}
                                    </h1>
                                    <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mb-3 opacity-50" />
                                    <p className="text-slate-400 text-xs font-medium tracking-widest uppercase opacity-80">
                                        Secure Enterprise Gateway
                                    </p>
                                </motion.div>
                            </div>

                            {/* Login Form */}
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300 ml-1 uppercase tracking-wider">Email</label>
                                    <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-cyan-400' : 'text-slate-500'}`} />
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="block w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-black/40 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 backdrop-blur-sm"
                                            placeholder="doctor@hospital.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
                                        <a href="#" className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors">Forgot?</a>
                                    </div>
                                    <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-cyan-400' : 'text-slate-500'}`} />
                                        </div>
                                        <input
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            className="block w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-black/40 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 backdrop-blur-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white py-4 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-cyan-900/40 hover:shadow-cyan-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-300 mt-2 disabled:opacity-70 disabled:cursor-not-allowed group flex items-center justify-center gap-2 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                                            <span className="relative z-10">Authenticating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="relative z-10">Sign In to Dashboard</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Footer in Card */}
                        <div className="px-8 pb-6 text-center">
                            <p className="text-xs text-slate-500">
                                Protected by Enterprise Security &copy; {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
