'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar, dateFnsLocalizer, Views, ToolbarProps, EventProps } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MoreHorizontal, Clock, User } from 'lucide-react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getAppointmentsProp, updateAppointmentDate } from '@/app/actions/appointment'
import { useRouter } from 'next/navigation'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const DragAndDropCalendar = withDragAndDrop(Calendar)

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

interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource?: any;
    status?: string;
}

const CustomEvent = ({ event }: EventProps<Event>) => {
    const statusColor = event.resource?.status === 'confirmed' ? 'bg-green-500' :
        event.resource?.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500';

    return (
        <div className="h-full w-full p-1 flex flex-col gap-0.5 overflow-hidden">
            <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${statusColor} shrink-0`} />
                <span className="text-xs font-semibold truncate leading-none">{event.title}</span>
            </div>
            {event.resource?.type && (
                <span className="text-[10px] opacity-75 truncate capitalize pl-3">
                    {event.resource.type.replace('_', ' ')}
                </span>
            )}
        </div>
    )
}

const CustomToolbar = (toolbar: ToolbarProps) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    const label = () => {
        const date = toolbar.date;
        return (
            <span className="text-lg font-bold text-gray-800 capitalize">
                {format(date, 'MMMM yyyy')}
            </span>
        );
    };

    return (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button onClick={goToBack} className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={goToCurrent} className="px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition-all">
                        Today
                    </button>
                    <button onClick={goToNext} className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
                {label()}
            </div>

            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                {['month', 'week', 'day', 'agenda'].map(view => (
                    <button
                        key={view}
                        onClick={() => toolbar.onView(view as any)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${toolbar.view === view
                            ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {view}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function AppointmentsCalendar() {
    return (
        <DndProvider backend={HTML5Backend}>
            <DraggableCalendar />
        </DndProvider>
    )
}

function DraggableCalendar() {
    const [events, setEvents] = useState<Event[]>([])
    const [view, setView] = useState(Views.MONTH)
    const [date, setDate] = useState(new Date())
    const router = useRouter()

    const fetchEvents = useCallback(async () => {
        // Calculate range based on view
        // For simplicity, fetching +/- 1 month from current date
        const start = new Date(date.getFullYear(), date.getMonth() - 1, 1)
        const end = new Date(date.getFullYear(), date.getMonth() + 2, 0)

        const res = await getAppointmentsProp(start, end);
        if (res.success && res.data) {
            // Parse dates ensuring they are Date objects
            const parsed = res.data.map((evt: any) => ({
                ...evt,
                start: new Date(evt.start),
                end: new Date(evt.end)
            }))
            setEvents(parsed)
        }
    }, [date])

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    const handleSelectSlot = ({ start, end }: { start: Date, end: Date }) => {
        const dateStr = format(start, 'yyyy-MM-dd')
        const timeStr = format(start, 'HH:mm')
        router.push(`/hms/appointments/new?date=${dateStr}&time=${timeStr}`)
    }

    const handleSelectEvent = (event: Event) => {
        router.push(`/hms/appointments/${event.id}`)
    }

    const onEventResize = async (data: any) => {
        const { start, end, event } = data

        // Optimistic update
        setEvents(prev => prev.map(e => {
            if (e.id === event.id) {
                return { ...e, start, end }
            }
            return e
        }))

        const res = await updateAppointmentDate(event.id, start, end)
        if (!res.success) {
            // Revert on failure (could be improved by refetching)
            fetchEvents()
            alert('Failed to update appointment')
        }
    }

    const onEventDrop = async (data: any) => {
        const { start, end, event } = data

        // Optimistic update
        setEvents(prev => prev.map(e => {
            if (e.id === event.id) {
                return { ...e, start, end }
            }
            return e
        }))

        const res = await updateAppointmentDate(event.id, start, end)
        if (!res.success) {
            fetchEvents()
            alert('Failed to update appointment')
        }
    }

    return (
        <div className="h-[calc(100vh-200px)] bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <DragAndDropCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                views={['month', 'week', 'day', 'agenda']}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                components={{
                    toolbar: CustomToolbar,
                    event: CustomEvent
                }}
                eventPropGetter={(event) => {
                    let bgClass = 'bg-blue-50 border-blue-100 text-blue-700'
                    if (event.resource?.status === 'confirmed') bgClass = 'bg-green-50 border-green-100 text-green-700'
                    if (event.resource?.status === 'cancelled') bgClass = 'bg-red-50 border-red-100 text-red-700'

                    return {
                        className: `!bg-transparent !p-0 !border-0`, // Reset default styles to use our custom component container
                        style: {
                            backgroundColor: 'transparent'
                        }
                    }
                }}
                dayPropGetter={(date) => {
                    const isToday = new Date().toDateString() === date.toDateString()
                    return {
                        className: isToday ? 'bg-blue-50/30' : ''
                    }
                }}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                resizable
            />
        </div>
    )
}
