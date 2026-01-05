'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import {
    Activity,
    TrendingUp,
    Clock,
    AlertCircle,
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react'

export function AttendanceAnalyticsClient({ data }: { data: any }) {
    if (!data) return (
        <div className="flex flex-col items-center justify-center p-20 text-slate-500 italic bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
            No tactical data available for processing.
        </div>
    )

    const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b']

    const pieData = [
        { name: 'On Time', value: data.summary.totalPunches - data.summary.totalLate },
        { name: 'Late', value: data.summary.totalLate },
    ]

    return (
        <div className="space-y-10">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="glass-card bg-white/5 border-white/10 p-8 rounded-[2.5rem] overflow-hidden relative group transition-all hover:bg-white/[0.08]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <Activity className="h-5 w-5 text-indigo-400" />
                        </div>
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px] font-black">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            8% AVG
                        </Badge>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">Punctuality Rate</p>
                    <p className="text-4xl font-black text-white">{data.summary.punctualityRate}%</p>
                    <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                            style={{ width: `${data.summary.punctualityRate}%` }}
                        />
                    </div>
                </Card>

                <Card className="glass-card bg-white/5 border-white/10 p-8 rounded-[2.5rem] overflow-hidden relative group transition-all hover:bg-white/[0.08]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                            <AlertCircle className="h-5 w-5 text-rose-400" />
                        </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">Total Deviations (Late)</p>
                    <p className="text-4xl font-black text-rose-400">{data.summary.totalLate}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tighter">Last 30 Cycles</p>
                </Card>

                <Card className="glass-card bg-white/5 border-white/10 p-8 rounded-[2.5rem] overflow-hidden relative group transition-all hover:bg-white/[0.08]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <Clock className="h-5 w-5 text-emerald-400" />
                        </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">Avg Shift Duration</p>
                    <p className="text-4xl font-black text-white">{data.summary.avgHoursPerShift}h</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tighter">Authorized Hours</p>
                </Card>

                <Card className="glass-card bg-white/5 border-white/10 p-8 rounded-[2.5rem] overflow-hidden relative group transition-all hover:bg-white/[0.08]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <TrendingUp className="h-5 w-5 text-blue-400" />
                        </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">Operational Density</p>
                    <p className="text-4xl font-black text-white">{data.summary.totalPunches}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tighter">Punches Sync'd</p>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Trend Chart */}
                <Card className="xl:col-span-8 glass-card bg-white/5 border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl border shadow-2xl">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                <TrendingUp className="h-6 w-6 text-indigo-400" />
                                Workforce Activity Trend
                            </h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Personnel Load Factor Over Time</p>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.trends}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#475569"
                                    fontSize={10}
                                    fontWeight="bold"
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="#475569"
                                    fontSize={10}
                                    fontWeight="bold"
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                                    }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Distribution Chart */}
                <Card className="xl:col-span-4 glass-card bg-white/5 border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl border shadow-2xl flex flex-col items-center">
                    <h3 className="text-xl font-black text-white tracking-tight mb-2">Compliance Split</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-10 text-center">Punctuality vs Latency Distribution</p>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full mt-8">
                        {pieData.map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center">
                                <div className="h-2 w-2 rounded-full mb-2" style={{ backgroundColor: COLORS[i] }} />
                                <p className="text-[10px] font-black text-slate-500 uppercase">{item.name}</p>
                                <p className="text-xl font-black text-white">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

function Badge({ children, className, variant = "default" }: any) {
    return (
        <span className={`px-2 py-1 rounded-full border text-[9px] font-black uppercase flex items-center ${className}`}>
            {children}
        </span>
    )
}
