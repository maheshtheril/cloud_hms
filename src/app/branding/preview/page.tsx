'use client';

import { ZionaLogo } from '@/components/branding/ziona-logo';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function BrandingPreviewPage() {
    const colorSchemes = ['signature', 'indigo', 'sunset', 'emerald', 'ocean', 'royal', 'monochrome'] as const;
    const speeds = ['slow', 'normal', 'fast'] as const;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-8 pb-24 font-sans">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* Hero Feature: THE BEST (Signature) */}
                <section className="relative overflow-hidden rounded-[3rem] bg-zinc-900 border border-zinc-800 p-12 text-center shadow-2xl">
                    <div className="absolute top-0 right-0 p-4">
                        <span className="bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Antigravity Signature</span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 flex flex-col items-center"
                    >
                        <ZionaLogo size={200} colorScheme="signature" speed="slow" theme="dark" />

                        <div className="max-w-2xl space-y-4">
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                                THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400">BEST</span> OF ZIONA
                            </h1>
                            <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">
                                Our <span className="text-white">"Antigravity Signature"</span> scheme is designed to unify all industries.
                                Cyan for Health, Purple for Education, and Emerald for Manufacturing—all floating in one Enterprise ecosystem.
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* Grid of Options */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Colors */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-sm">01</span>
                            The Color Spectrum
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {colorSchemes.filter(s => s !== 'signature').map((scheme) => (
                                <Card key={scheme} className="p-6 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-indigo-500 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest group-hover:text-indigo-500">{scheme}</span>
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-zinc-800" />
                                            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-zinc-800" />
                                        </div>
                                    </div>
                                    <ZionaLogo size="md" colorScheme={scheme} speed="normal" />
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Speeds */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center text-white text-sm">02</span>
                            Motion Engine
                        </h2>
                        <div className="space-y-4">
                            {speeds.map((speed) => (
                                <Card key={speed} className="p-6 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 flex items-center gap-6">
                                    <ZionaLogo size="sm" variant="icon" speed={speed} />
                                    <div>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white capitalize">{speed}</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-tighter">
                                            {speed === 'slow' ? 'Premium / Floating' : speed === 'fast' ? 'High Octane / Active' : 'Balanced / Modern'}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Branding Assets / Download Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-sm">03</span>
                        Brand Assets
                    </h2>
                    <Card className="p-8 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -mr-32 -mt-32" />

                        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                            <div className="p-8 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-100 dark:border-zinc-800">
                                <img src="/logo-ziona.svg" alt="Ziona Logo" className="w-32 h-32" />
                            </div>

                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Official Antigravity Logo</h3>
                                <p className="text-slate-500 dark:text-zinc-400 text-sm max-w-md">
                                    Download the high-resolution vector (SVG) version of our signature branding.
                                    Perfect for high-quality printing, office signage, and official documentation.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <a
                                        href="/logo-ziona.svg"
                                        download="Ziona_Antigravity_Logo.svg"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                        </svg>
                                        Download Vector (.SVG)
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Footer Rationale */}
                <Card className="p-10 bg-indigo-600 text-white border-0 rounded-[2rem] shadow-2xl shadow-indigo-500/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold italic">Why the Signature is "The Best"</h3>
                            <p className="opacity-90 leading-relaxed text-sm">
                                To truly be a "Multi-Industry ERP", the logo shouldn't choose one industry. The Signature scheme creates a visual bridge:
                            </p>
                            <ul className="space-y-2 text-xs opacity-80 list-disc list-inside">
                                <li><strong>Blue to Cyan:</strong> Professionalism for Hospitals & Tech</li>
                                <li><strong>Purple to Pink:</strong> Creativity for Schools & Textiles</li>
                                <li><strong>Green to Emerald:</strong> Efficiency for Supermarkets & Factories</li>
                            </ul>
                        </div>
                        <div className="flex flex-col justify-center items-center md:items-end">
                            <ZionaLogo size={80} colorScheme="signature" theme="dark" variant="icon" />
                            <span className="mt-4 text-[10px] font-mono tracking-widest uppercase opacity-50">Antigravity Identity v2.0</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
