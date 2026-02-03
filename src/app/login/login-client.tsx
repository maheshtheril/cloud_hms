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
        <div className="min-h-screen w-full flex bg-background font-sans overflow-hidden">

            {/* Left Side - Cinematic Image */}
            <div className="hidden lg:flex w-1/2 xl:w-3/5 relative bg-slate-900 overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src="/login-bg.png"
                        alt="Medical Background"
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-900/10" />
                    <div className="absolute inset-0 bg-indigo-950/20 mix-blend-overlay" />
                </motion.div>

                <div className="relative z-10 w-full h-full flex flex-col justify-between p-16 text-white">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center gap-2 text-indigo-300 mb-6">
                            <Activity className="w-5 h-5 animate-pulse" />
                            <span className="text-xs font-bold tracking-[0.2em] uppercase">Enterprise Medical System</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="max-w-2xl"
                    >
                        <h1 className="text-5xl xl:text-7xl font-bold tracking-tight mb-6 leading-tight">
                            The Future of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                                Healthcare
                            </span>
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
                            Streamline patient care, manage operations efficiently, and experience the next generation of hospital management.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 lg:p-12 xl:p-16 relative bg-background">
                {/* Mobile Background Blob */}
                <div className="lg:hidden absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute -top-[20%] -right-[20%] w-[80%] h-[80%] rounded-full bg-indigo-500/10 blur-[100px]" />
                    <div className="absolute -bottom-[20%] -left-[20%] w-[80%] h-[80%] rounded-full bg-cyan-500/10 blur-[100px]" />
                </div>

                <div className="w-full max-w-[420px] relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
                                    {branding?.logo_url ? (
                                        <img src={branding.logo_url} alt="Logo" className="w-8 h-8 object-contain" />
                                    ) : (
                                        <Building2 className="w-6 h-6" />
                                    )}
                                </div>
                                <span className="text-2xl font-bold tracking-tight text-foreground">{appName}</span>
                            </div>

                            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Welcome back</h2>
                            <p className="text-muted-foreground">Please enter your credentials to access the workspace.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground ml-0.5">Email Address</label>
                                <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.01]' : ''}`}>
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-primary' : 'text-muted-foreground/70'}`} />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="block w-full pl-12 pr-4 py-4 bg-secondary/50 border border-border hover:border-primary/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                                        placeholder="name@hospital.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-foreground ml-0.5">Password</label>
                                    <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors">Forgot password?</a>
                                </div>
                                <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.01]' : ''}`}>
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-primary' : 'text-muted-foreground/70'}`} />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        className="block w-full pl-12 pr-4 py-4 bg-secondary/50 border border-border hover:border-primary/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-base tracking-wide shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group flex items-center justify-center gap-2 overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_1.5s_infinite]" />
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In to Dashboard</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <a href="#" className="font-semibold text-primary hover:underline">Contact Administrator</a>
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-8 left-0 right-0 text-center px-8 lg:text-left lg:px-12 lg:left-0 lg:right-auto">
                    <p className="text-xs text-muted-foreground/60">
                        &copy; {new Date().getFullYear()} {appName}. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}
