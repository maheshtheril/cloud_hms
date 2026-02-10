import { getIntelligenceSummary } from "@/app/actions/crm/intelligence"
import Link from "next/link"
import {
    Brain,
    Users,
    Network,
    Target,
    MapPin,
    ShieldCheck,
    ArrowUpRight,
    Workflow,
    Boxes,
    Zap,
    TrendingUp,
    AlertCircle,
    Building2,
    Activity,
    ChevronRight,
    Search
} from "lucide-react"

export default async function IntelligenceDashboard() {
    const data = await getIntelligenceSummary()

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
            {/* World-Class Background Bloom */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse animation-delay-2000" />
            </div>

            <div className="relative container mx-auto py-12 px-6 max-w-7xl space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-600 rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.4)]">
                                <Brain className="w-8 h-8 text-white animate-pulse" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
                                    Strategic Intelligence
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">System Live • Real-time Monitoring</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/crm/dashboard" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all flex items-center gap-2 group">
                            <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Command Center</span>
                        </Link>
                    </div>
                </div>

                {/* Primary Intelligence Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* 1. Org Architecture Core */}
                    <Link href="/crm/org-chart" className="group col-span-1 lg:col-span-2">
                        <div className="h-full glass-card bg-gradient-to-br from-indigo-500/10 to-transparent p-8 rounded-[2rem] border border-white/10 hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-indigo-600/20 transition-all" />

                            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                                <div className="flex justify-between items-start">
                                    <div className="p-4 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 shadow-inner">
                                        <Network className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <ArrowUpRight className="w-6 h-6 text-indigo-500 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 translate-x-2 group-hover:translate-x-0 transition-all" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-white tracking-tight leading-none">Organizational<br />Hierarchy</h2>
                                    <p className="text-slate-400 font-medium text-sm max-w-sm">Deconstruct the command structure. Manage reporting lines, department logic, and leadership flow.</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Human Assets</p>
                                        <div className="text-2xl font-black text-white">{data.org.employees}</div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Departments</p>
                                        <div className="text-2xl font-black text-white">{data.org.departments}</div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Strategic Roles</p>
                                        <div className="text-2xl font-black text-white">{data.org.designations}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* 2. Target Matrix */}
                    <Link href="/crm/targets" className="group">
                        <div className="h-full glass-card bg-emerald-500/5 p-8 rounded-[2rem] border border-white/10 hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
                            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                                <div className="flex justify-between items-start">
                                    <div className="p-4 bg-emerald-600/20 rounded-2xl border border-emerald-500/30 shadow-inner">
                                        <Target className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <Activity className="w-6 h-6 text-emerald-500 animate-pulse" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-white tracking-tight leading-none text-gradient-primary">Performance<br />Velocity</h2>
                                    <p className="text-slate-400 font-medium text-sm">Gated target tracking. Real-time progression analysis and milestone enforcement.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Global Progress</span>
                                            <span className="text-lg font-black text-emerald-400">{data.performance.avgProgression}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${data.performance.avgProgression}%` }} />
                                        </div>
                                    </div>
                                    {data.performance.blockedMilestones > 0 && (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                                            <AlertCircle className="w-4 h-4 text-rose-500" />
                                            <span className="text-[10px] font-black text-rose-500 uppercase">{data.performance.blockedMilestones} Blocking Factors Detected</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* 3. Data Integrity & AI IQ */}
                    <div className="group glass-card bg-amber-500/5 p-8 rounded-[2rem] border border-white/10 transition-all duration-500 relative overflow-hidden">
                        <div className="relative z-10 flex flex-col h-full gap-8">
                            <div className="flex justify-between items-start">
                                <div className="p-4 bg-amber-600/20 rounded-2xl border border-amber-500/30 shadow-inner">
                                    <ShieldCheck className="w-8 h-8 text-amber-400" />
                                </div>
                                <div className="px-3 py-1 bg-amber-500/20 rounded-full text-[8px] font-black text-amber-500 uppercase tracking-widest border border-amber-500/30">
                                    Active Guard
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-white tracking-tight">Data Integrity</h2>
                                <p className="text-slate-400 font-medium text-xs">Lead enrichment and duplicate intelligence monitoring.</p>
                            </div>

                            <div className="space-y-6 pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Search className="w-4 h-4 text-slate-500" />
                                        <span className="text-[10px] font-black uppercase text-slate-500">Duplicate Risk</span>
                                    </div>
                                    <span className={`text-sm font-black ${data.integrity.duplicateRisk > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                        {data.integrity.duplicateRisk > 0 ? `${data.integrity.duplicateRisk} Flagged` : '0 Issues'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Workflow className="w-4 h-4 text-slate-500" />
                                        <span className="text-[10px] font-black uppercase text-slate-500">AI Scoring Avg</span>
                                    </div>
                                    <span className="text-sm font-black text-indigo-400">{data.integrity.score}/100</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Field Intelligence */}
                    <Link href="/crm/attendance" className="group">
                        <div className="h-full glass-card bg-purple-500/5 p-8 rounded-[2rem] border border-white/10 hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden">
                            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                                <div className="flex justify-between items-start">
                                    <div className="p-4 bg-purple-600/20 rounded-2xl border border-purple-500/30 shadow-inner">
                                        <MapPin className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <ArrowUpRight className="w-6 h-6 text-purple-500 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-white tracking-tight leading-none text-gradient-primary">Field Intelligence</h2>
                                    <p className="text-slate-400 font-medium text-sm">Active GPS tracking and field team synchronization metrics.</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="space-y-1">
                                        <div className="text-2xl font-black text-white">{data.field.activeClockIns}</div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Active Check-ins</p>
                                    </div>
                                    <div className="h-10 w-px bg-white/10" />
                                    <div className="space-y-1">
                                        <div className="text-2xl font-black text-white">{data.field.coverage}%</div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Region Coverage</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* 5. Quick Sync Module */}
                    <div className="group glass-card bg-slate-800/20 p-8 rounded-[2rem] border border-white/5 transition-all duration-500 flex flex-col justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Boxes className="w-5 h-5 text-indigo-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Structural Assets</h3>
                            </div>
                            <div className="space-y-4">
                                <Link href="/crm/departments" className="flex items-center justify-between group/line">
                                    <span className="text-xs font-bold text-slate-300 group-hover/line:text-indigo-400 transition-colors">Internal Departments</span>
                                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover/line:text-indigo-500 group-hover/line:translate-x-1 transition-all" />
                                </Link>
                                <div className="h-px bg-white/5" />
                                <Link href="/crm/employees" className="flex items-center justify-between group/line">
                                    <span className="text-xs font-bold text-slate-300 group-hover/line:text-indigo-400 transition-colors">Personnel Directory</span>
                                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover/line:text-indigo-500 group-hover/line:translate-x-1 transition-all" />
                                </Link>
                                <div className="h-px bg-white/5" />
                                <Link href="/crm/reports" className="flex items-center justify-between group/line">
                                    <span className="text-xs font-bold text-slate-300 group-hover/line:text-indigo-400 transition-colors">Intelligence Reports</span>
                                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover/line:text-indigo-500 group-hover/line:translate-x-1 transition-all" />
                                </Link>
                            </div>
                        </div>

                        <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Security Status</p>
                            <p className="text-[10px] font-bold text-slate-400">All structural links encrypted and verified. Global sync active.</p>
                        </div>
                    </div>

                </div>

                {/* Bottom Decorative Footer */}
                <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-4 opacity-40">
                    <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-500">Seeakk Intelligence Framework • v2.23.0</p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" />
                            <span className="text-[8px] font-black uppercase">High Fidelity Monitoring</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3" />
                            <span className="text-[8px] font-black uppercase">Data Integrity Secured</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
