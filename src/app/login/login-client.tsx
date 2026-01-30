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

    const appName = branding?.app_name || "Ziona";

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black overflow-hidden relative font-sans selection:bg-indigo-500/30">

            {/* Futuristic Background - Moving Aurora */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px]" />
                <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] animate-pulse delay-700" />
            </div>

            {/* Grid Overlay for Tech Feel */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none mix-blend-overlay"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-[420px] w-full relative z-10"
            >
                {/* Glass Card */}
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-black/50 relative overflow-hidden group">

                    {/* Top Shine Effect */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                    <div className="text-center mb-10 relative">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-24 h-24 mx-auto mb-6 relative"
                        >
                            {/* Logo Glow */}
                            <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full" />

                            <div className="relative w-full h-full bg-black/20 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner overflow-hidden">
                                {branding?.logo_url ? (
                                    <img src={branding.logo_url} alt={appName} className="w-full h-full object-contain p-3" />
                                ) : (
                                    <Sparkles className="text-indigo-400 w-10 h-10" />
                                )}
                            </div>
                        </motion.div>

                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                            {appName}
                        </h1>
                        <p className="text-indigo-200/60 text-sm font-medium">
                            Welcome back. Please sign in.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-indigo-200/70 ml-1 uppercase tracking-wider">Email Address</label>
                            <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : 'scale-100'}`}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-indigo-400' : 'text-zinc-500'}`} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm font-medium"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-semibold text-indigo-200/70 uppercase tracking-wider">Password</label>
                                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot?</a>
                            </div>
                            <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : 'scale-100'}`}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-indigo-400' : 'text-zinc-500'}`} />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative overflow-hidden bg-white text-black py-4 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                            {/* Button Shine Animation */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent z-0" />
                        </button>
                    </form>

                    {/* Bottom Link */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-indigo-200/40">
                            Protected by Ziona Secure Identity
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
