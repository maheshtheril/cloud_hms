import { ActivityForm } from '@/components/crm/activity-form'
import { Activity } from 'lucide-react'

export default function NewActivityPage() {
    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        Log New Activity
                        <Activity className="h-6 w-6 text-orange-600" />
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Record calls, meetings, and tasks with AI validation.
                    </p>
                </div>
            </div>

            <ActivityForm />
        </div>
    )
}
