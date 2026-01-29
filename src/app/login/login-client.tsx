'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Layers, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface Branding {
    app_name: string | null;
    logo_url: string | null;
    name: string | null;
    isPublic: boolean;
}

export default function LoginClient({ branding }: { branding: Branding | null }) {
    const [isLoading, setIsLoading] = useState(false)

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

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-950 overflow-hidden relative">

            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-[120px] animate-pulse delay-1000" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-md w-full relative z-10"
            >
                <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/60 dark:border-white/5 ring-1 ring-black/5">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20 overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 p-0.5"
                        >
                            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[1.4rem] flex items-center justify-center overflow-hidden">
                                {branding?.logo_url ? (
                                    <img src={branding.logo_url} alt={branding.app_name || 'Logo'} className="h-full w-full object-contain p-2" />
                                ) : (
                                    <Layers className="text-indigo-600 h-8 w-8" />
                                )}
                            </div>
                        </motion.div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            {branding?.app_name || branding?.name || "Enterprise ERP"}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm font-medium">
                            {branding?.app_name || branding?.name ? `Access your ${branding.app_name} workspace` : "Secure single sign-on for your team"}
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Identity</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-sm"
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Secret Key</label>
                                <a href="#" className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 uppercase tracking-wider">Recovery?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Initialize Session
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}
