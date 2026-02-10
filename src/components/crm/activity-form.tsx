'use client'

import { useFormState } from 'react-dom'
import { createActivity, ActivityFormState } from '@/app/actions/crm/activities'
import { SubmitButton } from '@/components/ui/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Activity,
    MapPin,
    BrainCircuit,
    Sparkles,
    TrendingUp,
    Calendar,
    MessageCircle,
    CheckSquare,
    Clock,
    Zap,
    Target,
    Phone,
    Mail,
    FileText
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

const activityTypes = [
    { id: 'call', name: 'Neural Call' },
    { id: 'meeting', name: 'Strategic Meeting' },
    { id: 'email', name: 'Encrypted Email' },
    { id: 'task', name: 'Operational Task' },
    { id: 'note', name: 'Intel Note' },
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
                setLocation({ lat: 12.9716, lng: 77.5946 }) // Bangalore context since user time is IST
            })
        } else {
            setLocation({ lat: 12.9716, lng: 77.5946 })
        }
    }

    return (
        <form action={dispatch} className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Main Details Column */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border border-white/20 backdrop-blur-xl">
                        <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 p-8 border-b border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <MessageCircle className="w-20 h-20 text-orange-500" />
                            </div>
                            <div className="flex items-center gap-3 text-orange-600 dark:text-orange-400 mb-2">
                                <Sparkles className="w-5 h-5 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Module: Alpha Intelligence</span>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Interaction Details</h2>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <Label htmlFor="subject" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Transmission Subject</Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <Input id="subject" name="subject" placeholder="e.g. Critical Follow-up: Q4 Alignment" required className="h-14 pl-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-bold text-slate-900 dark:text-white" />
                                </div>
                                {state.errors?.subject && <p className="text-red-500 text-[10px] font-black uppercase px-2">{state.errors.subject}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Label htmlFor="type" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Vector Type</Label>
                                    <Select name="type" defaultValue="call">
                                        <SelectTrigger className="h-14 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-2xl font-bold text-slate-900 dark:text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="call">
                                                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-indigo-500" /> Neural Call</div>
                                            </SelectItem>
                                            <SelectItem value="meeting">
                                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-500" /> Strategic Meeting</div>
                                            </SelectItem>
                                            <SelectItem value="email">
                                                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-500" /> Encrypted Email</div>
                                            </SelectItem>
                                            <SelectItem value="task">
                                                <div className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-emerald-500" /> Operational Task</div>
                                            </SelectItem>
                                            <SelectItem value="note">
                                                <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-amber-500" /> Intel Note</div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-4">
                                    <Label htmlFor="due_date" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Temporal Anchor</Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <Input id="due_date" name="due_date" type="datetime-local" className="h-14 pl-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-2xl font-medium text-slate-900 dark:text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Log Content / Neural Notes</Label>
                                <Textarea id="description" name="description" placeholder="Outcome and next-step vectors..." className="min-h-[160px] bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-3xl p-6 font-medium leading-relaxed resize-none focus:ring-2 focus:ring-orange-500 transition-all text-slate-900 dark:text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI & SID Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border border-white/20 backdrop-blur-xl">
                        <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-8 border-b border-white/10">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                                <BrainCircuit className="w-6 h-6 text-purple-500" />
                                Verification
                            </h2>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Sentiment Hub */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Neural Sentiment</Label>
                                    <Badge className={`border-none font-black text-[9px] px-3 py-1 rounded-full shadow-lg transition-colors
                                        ${sentiment > 60 ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                            : sentiment < 40 ? 'bg-rose-500 text-white shadow-rose-500/20'
                                                : 'bg-amber-500 text-white shadow-amber-500/20'}`}>
                                        {sentiment > 60 ? 'POSITIVE' : sentiment < 40 ? 'NEGATIVE' : 'NEUTRAL'} ({sentiment}%)
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        name="sentiment_score"
                                        min="0" max="100"
                                        value={sentiment}
                                        onChange={(e) => setSentiment(parseInt(e.target.value))}
                                        className="flex-1 accent-purple-500 h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer"
                                    />
                                    <Button size="sm" variant="ghost" type="button" onClick={simulateSentiment} className="rounded-xl hover:bg-purple-500/10 group h-12 w-12 border border-purple-500/20">
                                        <BrainCircuit className="w-5 h-5 text-purple-600 group-hover:animate-spin" />
                                    </Button>
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                                    AI-Powered sentiment derivation based on interaction vocabulary.
                                </p>
                            </div>

                            {/* Geo Location Matrix */}
                            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> Spatial Protocol
                                </Label>
                                <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-4 text-center">
                                    <div className={`p-4 rounded-2xl transition-all ${location ? 'bg-emerald-500/20 text-emerald-600 scale-110' : 'bg-slate-200 text-slate-400'}`}>
                                        <Target className={`w-8 h-8 ${location ? 'animate-pulse' : ''}`} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase mb-1">
                                            {location ? 'Terminal Verified' : 'Location Required'}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-bold tracking-tight">
                                            {location ? `COORDS: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'Initiate spatial verification protocol'}
                                        </p>
                                        <input type="hidden" name="location_lat" value={location?.lat || ''} />
                                        <input type="hidden" name="location_lng" value={location?.lng || ''} />
                                    </div>
                                    <Button size="sm" type="button" onClick={getLocation} className={`w-full h-11 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                                        ${location ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20 border-none' : 'bg-white dark:bg-slate-700 border border-slate-200'}`}>
                                        {location ? 'Verification Success' : 'Initiate Check-In'}
                                    </Button>
                                </div>
                            </div>

                            {/* Hidden Requirements */}
                            <input type="hidden" name="related_to_type" value="lead" />
                            <input type="hidden" name="related_to_id" value="00000000-0000-0000-0000-000000000000" />
                        </div>
                    </div>

                    <div className="bg-orange-500/5 rounded-[2rem] p-6 border border-orange-500/10 flex items-start gap-4 backdrop-blur-md">
                        <Zap className="w-5 h-5 text-orange-500 flex-none animate-pulse" />
                        <div>
                            <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Operational Tip</h4>
                            <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                                Logging activities with location verification increases data trust scores by 60%. Neural sentiment helps track lead warmth over time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                <Button variant="ghost" type="button" onClick={() => window.history.back()} className="h-14 px-12 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-slate-500">
                    Abort Log
                </Button>
                <SubmitButton className="h-14 px-16 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-orange-500/30 border-none group transition-all hover:scale-[1.02]">
                    <Activity className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                    Synchronize Neural Log
                </SubmitButton>
            </div>

            {state.message && (
                <div role="alert" className="p-6 bg-rose-500/10 text-rose-600 rounded-3xl border border-rose-500/20 font-bold text-xs text-center animate-shake">
                    SYSTEM ALERT: {state.message}
                </div>
            )}
        </form>
    )
}

