'use client'

import { useFormState } from 'react-dom'
import { logAttendance, AttendanceFormState } from '@/app/actions/crm/attendance'
import { SubmitButton } from '@/components/ui/submit-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Clock, LogIn, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

export function AttendanceWidget({ latestRecord }: { latestRecord?: any }) {
    const initialState: AttendanceFormState = { message: '', errors: {} }
    const [state, dispatch] = useFormState(logAttendance, initialState)
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null)
    const [currentTime, setCurrentTime] = useState('')

    // Auto-update clock
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Auto-get location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            })
        }
    }, [])

    const isCheckedIn = !!(latestRecord && latestRecord.check_in && !latestRecord.check_out)

    return (
        <Card className="w-full max-w-md mx-auto overflow-hidden border-2 border-indigo-100">
            <div className={`p-6 text-center ${isCheckedIn ? 'bg-green-50' : 'bg-gray-50'}`}>
                <div className="mb-2 flex justify-center text-gray-400">
                    <Clock className="w-6 h-6 mr-2" />
                    <span className="text-lg font-mono">{currentTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                    {isCheckedIn ? 'You are Online' : 'You are Offline'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    {isCheckedIn ? 'Checked in at ' + new Date(latestRecord.check_in).toLocaleTimeString() : 'Please check in to start your day'}
                </p>
            </div>

            <CardContent className="p-6">
                <form action={dispatch} className="space-y-4">
                    <input type="hidden" name="action" value={isCheckedIn ? 'check_out' : 'check_in'} />
                    <input type="hidden" name="lat" value={location?.lat || ''} />
                    <input type="hidden" name="lng" value={location?.lng || ''} />

                    <div className="bg-white p-3 rounded-lg border flex items-center gap-3 text-sm text-gray-600">
                        <MapPin className="w-5 h-5 text-indigo-500" />
                        {location ? (
                            <span>Current: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                        ) : (
                            <span className="italic">Locating...</span>
                        )}
                    </div>

                    {!isCheckedIn && (
                        <Textarea name="notes" placeholder="Optional notes for check-in (e.g. Starting from client site)" />
                    )}

                    {isCheckedIn && (
                        <Textarea name="notes" placeholder="Closing notes for the day..." />
                    )}

                    <SubmitButton className={`w-full py-6 text-lg font-bold shadow-xl transition-all hover:scale-[1.02]
                        ${isCheckedIn
                            ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                        } text-white`}>

                        {isCheckedIn ? (
                            <span className="flex items-center justify-center">
                                <LogOut className="w-6 h-6 mr-3" /> Check Out
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <LogIn className="w-6 h-6 mr-3" /> Check In
                            </span>
                        )}
                    </SubmitButton>

                    {state.message && (
                        <p className="text-center text-red-500 text-sm mt-2">{state.message}</p>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}
