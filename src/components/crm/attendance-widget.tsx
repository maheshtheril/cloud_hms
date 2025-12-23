'use client'

import { useFormState } from 'react-dom'
import { logAttendance, AttendanceFormState } from '@/app/actions/crm/attendance'
import { SubmitButton } from '@/components/ui/submit-button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Clock, LogIn, LogOut, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export function AttendanceWidget({ latestRecord }: { latestRecord?: any }) {
    const initialState: AttendanceFormState = { message: '', errors: {} }
    const [state, dispatch] = useFormState(logAttendance, initialState)
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null)
    const [currentTime, setCurrentTime] = useState('')
    const [currentDate, setCurrentDate] = useState('')

    // Auto-update clock
    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
            setCurrentDate(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }))
        }
        updateTime()
        const timer = setInterval(updateTime, 1000)
        return () => clearInterval(timer)
    }, [])

    // Auto-get location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                },
                (error) => console.log('Location error:', error),
                { enableHighAccuracy: true }
            )
        }
    }, [])

    const isCheckedIn = !!(latestRecord && latestRecord.check_in && !latestRecord.check_out)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto"
        >
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                {/* Dynamic Header */}
                <div className={cn(
                    "relative overflow-hidden p-8 text-center transition-colors duration-500",
                    isCheckedIn
                        ? "bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800"
                        : "bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800"
                )}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                    <div className="relative z-10 text-white">
                        <motion.div
                            key={currentTime}
                            initial={{ opacity: 0.8 }}
                            animate={{ opacity: 1 }}
                            className="font-mono text-5xl font-bold tracking-tighter drop-shadow-sm mb-2"
                        >
                            {currentTime}
                        </motion.div>
                        <div className="text-white/80 font-medium text-sm uppercase tracking-widest mb-6">
                            {currentDate}
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-sm font-medium shadow-sm">
                            <div className={cn(
                                "w-2 h-2 rounded-full animate-pulse",
                                isCheckedIn ? "bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)]" : "bg-indigo-300 shadow-[0_0_8px_rgba(165,180,252,0.8)]"
                            )} />
                            {isCheckedIn ? 'Currently Online' : 'Currently Offline'}
                        </div>
                    </div>
                </div>

                <CardContent className="p-6 space-y-6">
                    <form action={dispatch} className="space-y-6">
                        <input type="hidden" name="action" value={isCheckedIn ? 'check_out' : 'check_in'} />
                        <input type="hidden" name="lat" value={location?.lat || ''} />
                        <input type="hidden" name="lng" value={location?.lng || ''} />

                        {/* Location Status */}
                        <div className="group relative overflow-hidden rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-4 border border-slate-100 dark:border-zinc-700 transition-all hover:bg-slate-100 dark:hover:bg-zinc-800">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-2.5 rounded-lg shrink-0 transition-colors",
                                    location ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400" : "bg-gray-100 text-gray-400 dark:bg-zinc-700 dark:text-zinc-500"
                                )}>
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">
                                        Current Location
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {location ? (
                                            <span className="font-mono">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
                                        ) : (
                                            <span className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                                </span>
                                                Acquiring GPS...
                                            </span>
                                        )}
                                    </p>
                                </div>
                                {location && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                            </div>
                        </div>

                        {/* Notes Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                                {isCheckedIn ? 'End of Day Report' : 'Kick-off Notes'}
                            </label>
                            <Textarea
                                name="notes"
                                placeholder={isCheckedIn ? "Summarize your achievements today..." : "What's the plan for today?"}
                                className="min-h-[100px] resize-none bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl transition-all font-light"
                            />
                        </div>

                        {/* Action Button */}
                        <div className="pt-2">
                            <SubmitButton className={cn(
                                "w-full h-14 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md",
                                isCheckedIn
                                    ? "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-rose-500/25 text-white"
                                    : "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-indigo-500/25 text-white"
                            )}>
                                {isCheckedIn ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <LogOut className="w-5 h-5" strokeWidth={3} />
                                        Clock Out
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-3">
                                        <LogIn className="w-5 h-5" strokeWidth={3} />
                                        Clock In
                                    </span>
                                )}
                            </SubmitButton>
                        </div>

                        {/* Message / Error */}
                        <AnimatePresence>
                            {(state.message || state.errors?.action) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 text-sm"
                                >
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p>{state.message || state.errors?.action}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    )
}
