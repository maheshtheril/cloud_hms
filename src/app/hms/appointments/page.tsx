import Link from "next/link"
import { Plus, Calendar, Sparkles, Zap, Filter } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

import SearchInput from "@/components/search-input"
import AppointmentsCalendar from "@/components/appointments/appointments-calendar"

export default async function AppointmentsPage() {
    const session = await auth()
    const tenantId = session?.user?.tenantId

    // Fetch real stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [todayCount, inProgressCount, weekStart] = await Promise.all([
        prisma.hms_appointments.count({
            where: {
                tenant_id: tenantId,
                starts_at: {
                    gte: today,
                    lt: tomorrow
                }
            }
        }),
        prisma.hms_appointments.count({
            where: {
                tenant_id: tenantId,
                status: 'in_progress'
            }
        }),
        (() => {
            const ws = new Date()
            ws.setDate(ws.getDate() - ws.getDay())
            ws.setHours(0, 0, 0, 0)
            return ws
        })()
    ])

    const weekCount = await prisma.hms_appointments.count({
        where: {
            tenant_id: tenantId,
            starts_at: {
                gte: weekStart
            }
        }
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
            <div className="max-w-[1800px] mx-auto space-y-6">

                {/* Futuristic Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-pulse delay-700"></div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                                <Calendar className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl font-black text-white tracking-tight">
                                        Appointment Scheduler
                                    </h1>
                                    <div className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full flex items-center gap-1">
                                        <Sparkles className="h-3 w-3" />
                                        Live Data
                                    </div>
                                </div>
                                <p className="text-blue-100 text-lg mt-1">
                                    Real-time scheduling • Smart conflict detection • Drag & drop
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/20">
                                <div className="text-white/70 text-xs">Today</div>
                                <div className="text-white text-xl font-bold">
                                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                            </div>

                            <Link
                                href="/hms/appointments/new"
                                className="group relative px-8 py-4 bg-white text-indigo-600 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 font-bold shadow-xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <Plus className="h-5 w-5" />
                                <span>Book Appointment</span>
                                <Zap className="h-4 w-4 text-yellow-500" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Real Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                Today
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">{todayCount}</div>
                        <div className="text-sm text-gray-600 font-medium">Scheduled Appointments</div>
                    </div>

                    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                            <div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                                Live
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">{inProgressCount}</div>
                        <div className="text-sm text-gray-600 font-medium">In Progress</div>
                    </div>

                    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full">
                                Week
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">{weekCount}</div>
                        <div className="text-sm text-gray-600 font-medium">This Week</div>
                    </div>
                </div>

                {/* Search & Filters Bar */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <SearchInput placeholder="🔍 Search patients, doctors, or appointment ID..." />
                        </div>
                        <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 flex items-center gap-2 transition-all">
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Calendar Container */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-200 shadow-2xl min-h-[600px]">
                    <AppointmentsCalendar />
                </div>
            </div>
        </div>
    )
}
