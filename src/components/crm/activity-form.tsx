'use client'

import { useFormState } from 'react-dom'
import { createActivity, ActivityFormState } from '@/app/actions/crm/activities'
import { SubmitButton } from '@/components/ui/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Activity, MapPin, BrainCircuit } from 'lucide-react'
import { useState } from 'react'

const activityTypes = [
    { id: 'call', name: 'Call' },
    { id: 'meeting', name: 'Meeting' },
    { id: 'email', name: 'Email' },
    { id: 'task', name: 'Task' },
    { id: 'note', name: 'Note' },
]

export function ActivityForm() {
    const initialState: ActivityFormState = { message: '', errors: {} }
    const [state, dispatch] = useFormState(createActivity, initialState)
    const [sentiment, setSentiment] = useState(50)
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null)

    const simulateSentiment = () => {
        // Mock AI analysis
        const random = Math.floor(Math.random() * 100)
        setSentiment(random)
    }

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            }, () => {
                // Fallback Mock
                setLocation({ lat: 40.7128, lng: -74.0060 })
            })
        } else {
            setLocation({ lat: 40.7128, lng: -74.0060 })
        }
    }

    return (
        <form action={dispatch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Activity Details</CardTitle>
                        <CardDescription>Log your interaction</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" name="subject" placeholder="e.g. Intro Call with CEO" required />
                            {state.errors?.subject && <p className="text-red-500 text-sm">{state.errors.subject}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <select
                                    id="type"
                                    name="type"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {activityTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="due_date">Due Date / Time</Label>
                                <Input id="due_date" name="due_date" type="datetime-local" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Notes / Description</Label>
                            <Textarea id="description" name="description" placeholder="Outcome of the meeting..." />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>AI & Verification</CardTitle>
                        <CardDescription>Futuristic validation fields</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Sentiment Analysis */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Sentiment Score (AI)</Label>
                                <span className={`text-xs font-bold ${sentiment > 60 ? 'text-green-600' : sentiment < 40 ? 'text-red-600' : 'text-yellow-600'}`}>
                                    {sentiment > 60 ? 'POSITIVE' : sentiment < 40 ? 'NEGATIVE' : 'NEUTRAL'} ({sentiment})
                                </span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="range"
                                    name="sentiment_score"
                                    min="0" max="100"
                                    value={sentiment}
                                    onChange={(e) => setSentiment(parseInt(e.target.value))}
                                    className="flex-1"
                                />
                                <Button size="sm" variant="outline" type="button" onClick={simulateSentiment}>
                                    <BrainCircuit className="w-4 h-4 text-purple-600" />
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500">Auto-analyzed from description text.</p>
                        </div>

                        {/* Geo Location */}
                        <div className="space-y-2">
                            <Label>Check-in Verification</Label>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Client Location</p>
                                    <p className="text-xs text-gray-500">
                                        {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Not verified'}
                                    </p>
                                    <input type="hidden" name="location_lat" value={location?.lat || ''} />
                                    <input type="hidden" name="location_lng" value={location?.lng || ''} />
                                </div>
                                <Button size="sm" type="button" onClick={getLocation} className={location ? 'bg-green-600 hover:bg-green-700' : ''}>
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {location ? 'Verified' : 'Check In'}
                                </Button>
                            </div>
                        </div>

                        {/* Hidden placeholders for related IDs for now */}
                        <input type="hidden" name="related_to_type" value="lead" />
                        <input type="hidden" name="related_to_id" value="00000000-0000-0000-0000-000000000000" />
                        {/* In real app, these would come from URL params or search */}
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => window.history.back()}>Cancel</Button>
                <SubmitButton className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg">
                    <Activity className="w-4 h-4 mr-2" />
                    Log Activity
                </SubmitButton>
            </div>

            {state.message && (
                <div role="alert" className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                    {state.message}
                </div>
            )}
        </form>
    )
}
