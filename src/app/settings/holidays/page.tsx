import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getHolidays } from "@/app/actions/holidays"
import { HolidayManager } from "./holiday-manager"

export default async function HolidaySettingsPage() {
    const session = await auth()
    if (!session?.user?.tenantId) redirect('/login')

    const holidays = await getHolidays(session.user.tenantId)

    // Convert dates to string to avoid serialization warnings
    const safeHolidays = holidays.map((h: any) => ({
        ...h,
        date: h.date.toISOString(),
        country: h.country ? { name: h.country.name, flag: h.country.flag } : null,
        subdivision: h.subdivision ? { name: h.subdivision.name } : null
    }))

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-slate-900">Holiday Masters</h1>
                <p className="text-slate-500 mt-1">
                    Manage the comprehensive list of National and Regional holidays.
                    These will be available for selection during staff onboarding.
                </p>
            </header>

            <HolidayManager
                initialHolidays={safeHolidays}
                tenantId={session.user.tenantId}
            />
        </div>
    )
}
