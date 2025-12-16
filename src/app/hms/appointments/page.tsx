import Link from "next/link"
import { Plus } from "lucide-react"

import SearchInput from "@/components/search-input"
import AppointmentsCalendar from "@/components/appointments/appointments-calendar"

export default async function AppointmentsPage() {
    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
                    <p className="text-gray-500">Manage schedule and bookings.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-64">
                        {/* Search could filter calendar events locally or via URL params */}
                        <SearchInput placeholder="Search patients..." />
                    </div>
                    <Link
                        href="/hms/appointments/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Book Appointment</span>
                    </Link>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <AppointmentsCalendar />
            </div>
        </div>
    )
}
