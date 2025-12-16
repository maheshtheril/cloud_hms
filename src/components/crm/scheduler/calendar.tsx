
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Card } from '@/components/ui/card'
import { getSchedulerEvents } from '@/app/actions/crm/scheduler'

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
    const [view, setView] = useState(Views.MONTH)
    const [date, setDate] = useState(new Date())

    const fetchEvents = useCallback(async (currentDate: Date, currentView: any) => {
        let start, end;

        // Simple range calculation
        // For month: start of month - 7 days, end of month + 7 days
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        start = new Date(year, month - 1, 1) // Previous month
        end = new Date(year, month + 2, 0)   // Next month end

        const data = await getSchedulerEvents(start, end)
        // Convert string dates back to Date objects if needed (server actions serialize dates as strings usually? No, Next.js handles Date objects in newer versions, but let's be safe)
        // Actually Next.js SWC serialization handles Dates fine. 
        setEvents(data)
    }, [])

    useEffect(() => {
        fetchEvents(date, view)
    }, [date, view, fetchEvents])

    const handleNavigate = (newDate: Date) => {
        setDate(newDate)
    }

    const handleViewChange = (newView: any) => {
        setView(newView)
    }

    return (
        <Card className="h-[calc(100vh-12rem)] p-4 shadow-sm">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                view={view}
                date={date}
                onNavigate={handleNavigate}
                onView={handleViewChange}
                eventPropGetter={(event) => {
                    const type = event.resource?.type
                    let backgroundColor = '#3b82f6' // blue default
                    if (type === 'meeting') backgroundColor = '#8b5cf6' // violet
                    if (type === 'call') backgroundColor = '#10b981' // emerald
                    if (type === 'task') backgroundColor = '#f59e0b' // amber
                    return { style: { backgroundColor } }
                }}
            />
        </Card>
    )
}
