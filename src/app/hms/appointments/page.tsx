import Link from "next/link"
import { Plus, Calendar, Clock, Users, TrendingUp, Sparkles, Zap, Filter } from "lucide-react"

import SearchInput from "@/components/search-input"
import AppointmentsCalendar from "@/components/appointments/appointments-calendar"

export default async function AppointmentsPage() {
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
                                        AI-Powered
                                    </div>
                                </div>
                                <p className="text-blue-100 text-lg mt-1">
                                    Intelligent scheduling • Real-time updates • Smart conflict detection
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

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                Today
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">24</div>
                        <div className="text-sm text-gray-600 font-medium">Scheduled Appointments</div>
                    </div>

                    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                            <div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                                Live
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">3</div>
                        <div className="text-sm text-gray-600 font-medium">Currently In Progress</div>
                    </div>

                    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full">
                                +12%
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">156</div>
                        <div className="text-sm text-gray-600 font-medium">Patients This Week</div>
                    </div>

                    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <div className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full">
                                ⚡ Fast
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">92%</div>
                        <div className="text-sm text-gray-600 font-medium">Attendance Rate</div>
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
                        <select className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option>All Doctors</option>
                            <option>Dr. Smith</option>
                            <option>Dr. Johnson</option>
                        </select>
                        <select className="px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
                            <option>All Status</option>
                            <option>Scheduled</option>
                            <option>Confirmed</option>
                            <option>Completed</option>
                        </select>
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
