'use client'

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const COLORS = ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#64748b']

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                <p className="text-slate-300 text-xs font-semibold mb-1 uppercase tracking-wider">{label}</p>
                <p className="text-white text-sm font-bold">
                    {payload[0].name}: <span className="text-indigo-400">{payload[0].value.toLocaleString()}</span>
                </p>
            </div>
        )
    }
    return null
}

export function GrowthChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" name="Leads" />
            </AreaChart>
        </ResponsiveContainer>
    )
}

export function ActivityDonut({ data }: { data: any[] }) {
    // Transform empty data to avoid crash or empty look
    const chartData = data.length > 0 ? data : [{ name: 'No Activity', value: 1 }]

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={data.length > 0 ? COLORS[index % COLORS.length] : '#334155'} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            </PieChart>
        </ResponsiveContainer>
    )
}

export function PipelineBar({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" opacity={0.1} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} hide />
                <YAxis dataKey="stageName" type="category" stroke="#94a3b8" fontSize={10} width={100} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" fill="#ec4899" radius={[0, 10, 10, 0]} barSize={20} name="Deal Value ($)">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}

export function PerformanceBar({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={30} name="Revenue Won ($)">
                    <Cell fill="url(#colorGrowth)" />
                    {/* Reusing gradient logic via style not ideal here, simple fill + gradient defs better */}
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                            <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                    {data.map((entry, index) => <Cell key={index} fill="url(#barGradient)" />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
