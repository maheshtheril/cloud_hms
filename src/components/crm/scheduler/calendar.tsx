'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar'
import { format } from 'date-fns/format'
import { parse } from 'date-fns/parse'
import { startOfWeek } from 'date-fns/startOfWeek'
import { getDay } from 'date-fns/getDay'
import { enUS } from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getSchedulerEvents } from '@/app/actions/crm/scheduler'
import { updateSchedulerEvent } from '@/app/actions/crm/scheduler-actions'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
    Calendar as CalendarIcon,
    Clock,
    User,
    Activity,
    Edit,
    ArrowRight
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'

const locales = {
    'en-US': enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

export default function CRMCalendar() {
    const [events, setEvents] = useState<any[]>([])
    const [view, setView] = useState<View>(Views.MONTH)
    const [date, setDate] = useState(new Date())
    const [selectedEvent, setSelectedEvent] = useState<any>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({ date: '', description: '' })
    const router = useRouter()

    const fetchEvents = useCallback(async (currentDate: Date, currentView: any) => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const start = new Date(year, month - 1, 1)
        const end = new Date(year, month + 2, 0)

        const data = await getSchedulerEvents(start, end)
        setEvents(data)
    }, [])

    useEffect(() => {
        fetchEvents(date, view)
    }, [date, view, fetchEvents])

    const handleSelectEvent = (event: any) => {
        setSelectedEvent(event)
        setEditForm({
            date: format(event.start, "yyyy-MM-dd'T'HH:mm"),
            description: event.resource.description || ''
        })
        setIsEditing(false)
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        if (!selectedEvent) return

        const formData = new FormData()
        formData.append('id', selectedEvent.id)
        formData.append('type', selectedEvent.resource.type)
        formData.append('date', editForm.date)
        formData.append('description', editForm.description)

        const result = await updateSchedulerEvent(formData)
        if (result?.success) {
            fetchEvents(date, view)
            setIsDialogOpen(false)
        }
    }

    const eventStyleGetter = (event: any) => {
        const type = event.resource?.type
        let style: any = {
            borderRadius: '8px',
            opacity: 0.9,
            color: 'white',
            border: 'none',
            display: 'block',
            padding: '2px 6px',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'capitalize',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }

        if (type === 'meeting') style.background = 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
        else if (type === 'call') style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        else if (type === 'email') style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        else if (type === 'task') style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        else if (type === 'lead_followup') style.background = 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
        else if (type === 'lead_created') style.background = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' // Dark Slate
        else style.background = 'linear-gradient(135deg, #64748b 0%, #475569 100%)'

        return { style }
    }

    return (
        <div className="h-[750px] p-6 glass bg-white/20 dark:bg-slate-900/40 rounded-3xl border border-white/10 overflow-hidden relative">
            <style jsx global>{`
                .rbc-calendar { font-family: inherit; }
                .rbc-header { padding: 12px; font-weight: 800; text-transform: uppercase; font-size: 10px; color: #64748b; letter-spacing: 0.1em; border-bottom: 2px solid rgba(226, 232, 240, 0.5) !important; }
                .rbc-month-view { border-radius: 20px; border: none !important; }
                .rbc-day-bg { transition: background 0.3s ease; }
                .rbc-day-bg:hover { background: rgba(99, 102, 241, 0.05); }
                .rbc-off-range-bg { background: rgba(241, 245, 249, 0.3); }
                .dark .rbc-off-range-bg { background: rgba(15, 23, 42, 0.2); }
                .rbc-today { background: rgba(99, 102, 241, 0.08) !important; }
                .rbc-event { margin-bottom: 2px !important; }
                .rbc-toolbar { margin-bottom: 20px !important; padding: 0 10px; }
                .rbc-toolbar button { border-radius: 10px !important; font-weight: 700 !important; text-transform: uppercase !important; font-size: 10px !important; letter-spacing: 0.1em !important; border: 1px solid rgba(226, 232, 240, 0.8) !important; color: #64748b !important; }
                .rbc-toolbar button:hover { background: #f8fafc !important; color: #1e293b !important; }
                .rbc-toolbar button.rbc-active { background: #6366f1 !important; color: white !important; border-color: #6366f1 !important; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
                .rbc-month-row { border-color: rgba(226, 232, 240, 0.3) !important; }
                .rbc-month-view { border: 1px solid rgba(226, 232, 240, 0.3) !important; }
            `}</style>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%', padding: '20px' }}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                view={view}
                date={date}
                onNavigate={setDate}
                onView={setView}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: ({ event }: any) => (
                        <div className="flex items-center gap-1.5 py-0.5">
                            <span className="truncate">{event.title}</span>
                        </div>
                    )
                }}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="glass-strong border-white/20 sm:max-w-md">
                    <DialogHeader>
                        <div className="mb-4">
                            <Badge className={`border-none uppercase font-black text-[9px] px-3 py-1 rounded-full
                                ${selectedEvent?.resource.type === 'meeting' ? 'bg-violet-500 text-white' :
                                    selectedEvent?.resource.type === 'call' ? 'bg-emerald-500 text-white' :
                                        selectedEvent?.resource.type === 'lead_followup' ? 'bg-pink-500 text-white' :
                                            'bg-blue-500 text-white'}`}>
                                {selectedEvent?.resource.type?.replace('_', ' ')}
                            </Badge>
                        </div>
                        <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            {isEditing ? 'Modify Protocol' : selectedEvent?.title}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-500 pt-2">
                            {isEditing ? 'Update temporal alignment and neural notes.' : 'Full intelligence briefing for this synchronization event.'}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedEvent && (
                        <div className="grid gap-6 py-4">
                            {isEditing ? (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-date" className="text-xs font-bold uppercase tracking-wide text-slate-500">Temporal Window</Label>
                                        <Input
                                            id="edit-date"
                                            type="datetime-local"
                                            value={editForm.date}
                                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                            className="bg-slate-50 dark:bg-slate-800 border-none h-12 rounded-xl"
                                        />
                                    </div>
                                    {selectedEvent.resource.type !== 'lead_followup' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-desc" className="text-xs font-bold uppercase tracking-wide text-slate-500">Event Notes</Label>
                                            <Textarea
                                                id="edit-desc"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                className="bg-slate-50 dark:bg-slate-800 border-none min-h-[100px] rounded-xl resize-none"
                                            />
                                        </div>
                                    )}
                                    {selectedEvent.resource.type === 'lead_followup' && (
                                        <p className="text-[10px] text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 italic">
                                            Note: Description editing is disabled for lead auto-followups.
                                        </p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                                        <Clock className="w-5 h-5 text-indigo-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Temporal Alignment</p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                                {format(selectedEvent.start, 'EEEE, MMM d, yyyy')}
                                            </p>
                                            <p className="text-xs font-medium text-slate-500">
                                                {format(selectedEvent.start, 'h:mm a')} - {format(selectedEvent.end, 'h:mm a')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                                        <User className="w-5 h-5 text-pink-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Entity</p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                                {selectedEvent.resource.related}
                                            </p>
                                            {selectedEvent.resource.subtext && (
                                                <p className="text-xs text-slate-500 italic mt-1">{selectedEvent.resource.subtext}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Activity className="w-3 h-3" /> Event Notes
                                        </p>
                                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {selectedEvent.resource.description}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        {isEditing ? (
                            <>
                                <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl font-bold uppercase tracking-wider text-[10px]">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] shadow-lg shadow-emerald-500/20"
                                >
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold uppercase tracking-wider text-[10px]">
                                    Dismiss
                                </Button>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        variant="outline"
                                        className="flex-1 sm:flex-none border-slate-200 rounded-xl font-bold uppercase tracking-wider text-[10px]"
                                    >
                                        <Edit className="w-3 h-3 mr-2" />
                                        Edit
                                    </Button>
                                    {selectedEvent?.resource.type === 'lead_followup' && (
                                        <Button
                                            onClick={() => router.push(`/crm/leads/${selectedEvent.id}`)}
                                            className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] shadow-lg shadow-indigo-500/20"
                                        >
                                            <User className="w-3 h-3 mr-2" />
                                            Profile
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

