
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getHMSSettings } from "@/app/actions/settings"
import { HMSSettingsForm } from "./hms-settings-form"
import { Activity } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function HMSSettingsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect('/login')

    const res = await getHMSSettings();

    if (!res.success) {
        return (
            <div className="p-8 text-center text-red-500">
                <h2 className="text-xl font-bold">Access Denied</h2>
                <p>{res.error}</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <header className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
                        <Activity className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">HMS Configuration</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage clinical workflows and financial defaults.</p>
                    </div>
                </div>
            </header>

            <HMSSettingsForm settings={res.settings} />
        </div>
    )
}
