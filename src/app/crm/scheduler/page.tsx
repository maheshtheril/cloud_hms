
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Metadata } from 'next'
import CRMCalendar from '@/components/crm/scheduler/calendar'

export const metadata: Metadata = {
    title: 'CRM Scheduler | SAAS ERP',
    description: 'Manage your meetings and tasks',
}

export default function SchedulerPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Scheduler</h2>
                    <p className="text-muted-foreground">
                        Manage your appointments, meetings, and follow-ups.
                    </p>
                </div>
                <Link href="/crm/activities/new">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Log Activity
                    </Button>
                </Link>
            </div>

            <CRMCalendar />
        </div>
    )
}
