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
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    User,
    TrendingUp,
    Sparkles,
    Activity,
    Edit,
    ArrowRight
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
    }

    const eventStyleGetter = (event: any) => {
        const type = event.resource?.type
        let style: any = {
            borderRadius: '12px',
            opacity: 0.9,
            color: 'white',
            border: 'none',
            display: 'block',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        }

        if (type === 'meeting') style.background = 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
        else if (type === 'call') style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        else if (type === 'email') style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        else if (type === 'task') style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        else style.background = 'linear-gradient(135deg, #64748b 0%, #475569 100%)'

        return { style }
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[750px] p-6">
            {/* Calendar Main View */}
            <div className="flex-1 glass bg-white/20 dark:bg-slate-900/40 rounded-3xl border border-white/10 overflow-hidden relative">
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
            </div>

            {/* Side Information Panel */}
            <div className="w-full lg:w-96 flex flex-col gap-6">
                {/* Event Details Card */}
                <div className="glass bg-white/30 dark:bg-slate-900/60 rounded-3xl p-8 border border-white/20 shadow-xl flex-1 flex flex-col">
                    {!selectedEvent ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                            <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-white/10">
                                <CalendarIcon className="w-12 h-12 text-slate-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-tighter">No Event Selected</h4>
                                <p className="text-[10px] font-medium max-w-[200px] mt-1">Select any event protocol on the matrix for detailed intelligence.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-3">
                                <Badge className={`border-none uppercase font-black text-[9px] px-3 py-1 rounded-full
                                    ${selectedEvent.resource.type === 'meeting' ? 'bg-violet-500 text-white' :
                                        selectedEvent.resource.type === 'call' ? 'bg-emerald-500 text-white' :
                                            'bg-blue-500 text-white'}`}>
                                    {selectedEvent.resource.type} PROTOCOL
                                </Badge>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                                    {selectedEvent.title}
                                </h3>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/10 transition-all hover:bg-white/60">
                                    <Clock className="w-5 h-5 text-indigo-500 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Temporal Window</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                            {format(selectedEvent.start, 'MMM d, yyyy')}
                                        </p>
                                        <p className="text-xs font-medium text-slate-500">
                                            {format(selectedEvent.start, 'HH:mm')} - {format(selectedEvent.end, 'HH:mm')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/10 transition-all hover:bg-white/60">
                                    <User className="w-5 h-5 text-pink-500 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Entity</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[180px]">
                                            {selectedEvent.resource.related}
                                        </p>
                                        <Badge variant="secondary" className="mt-2 bg-indigo-500/10 text-indigo-600 text-[8px] font-black border-none uppercase">
                                            Active Signal
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Activity className="w-3 h-3" /> Intelligence Logs
                                    </p>
                                    <div className="p-5 rounded-2xl bg-white/20 dark:bg-slate-800/20 border border-white/5 text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                        "{selectedEvent.resource.description || 'No neural notes established for this engagement yet.'}"
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                                <Button className="w-full h-12 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-900 dark:text-white rounded-xl border border-slate-200/50 dark:border-white/10 font-bold text-xs uppercase tracking-widest group">
                                    <Edit className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                                    Refine Event
                                </Button>
                                <Button variant="ghost" className="w-full h-12 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group">
                                    Close Intelligence
                                    <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Efficiency Widget */}
                <div className="glass bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Sparkles className="w-32 h-32 text-white" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-indigo-200" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Performance Index</span>
                        </div>
                        <div>
                            <p className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap">OPTIMAL SYNC</p>
                            <p className="text-[10px] font-medium text-indigo-100/70 mt-1">Calendar saturation is currently at 78% capacity for this period.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

