import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getGlobalAnalytics } from "@/app/actions/analytics"
import { AnalyticsClient } from "@/components/hms/analytics-client"

export default async function AnalyticsPage() {
    const session = await auth()
    if (!session?.user) redirect('/login')

    const res = await getGlobalAnalytics()
    if (!res.success) {
        return (
            <div className="p-8 text-center text-red-500 font-bold">
                Error loading analytics: {res.error}
            </div>
        )
    }

    return <AnalyticsClient data={res.data} />
}
