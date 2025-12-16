
'use client'

import { useState } from 'react'
import { markAttendance } from '@/app/actions/crm/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, MapPin } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface AttendanceModalProps {
    onSuccess: () => void
}

export function AttendanceModal({ onSuccess }: AttendanceModalProps) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleMarkAttendance = async () => {
        setLoading(true)
        try {
            // Optional: Get location
            let lat, lng;
            if (navigator.geolocation) {
                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
                    })
                    lat = position.coords.latitude
                    lng = position.coords.longitude
                } catch (e) {
                    console.log("Location access denied or timed out")
                }
            }

            const res = await markAttendance(lat, lng)
            if (res.error) {
                toast({
                    title: "Error",
                    description: res.error,
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Checked In",
                    description: "Attendance marked successfully for today."
                })
                onSuccess()
            }
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Card className="w-full max-w-md shadow-lg border-2 border-primary/20">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Good Morning!</CardTitle>
                    <CardDescription>
                        Please mark your attendance to start your day.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 py-6">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <MapPin className="w-8 h-8 text-primary" />
                    </div>

                    <Button
                        size="lg"
                        className="w-full max-w-xs"
                        onClick={handleMarkAttendance}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Marking...
                            </>
                        ) : (
                            "Mark Attendance"
                        )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center px-4">
                        By clicking, you confirm you are present for work today.
                        Your location may be recorded.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
