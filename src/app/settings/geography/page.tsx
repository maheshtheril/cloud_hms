import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getAdministrativeHierarchy, getCompanyCountry, getCountries } from "@/app/actions/geography"
import { HierarchyManager } from "./hierarchy-manager"
import { Globe, AlertTriangle } from "lucide-react"

export const metadata = {
    title: 'Geography Settings | Administrative Structure',
    description: 'Manage your organization\'s operating regions and administrative hierarchy.'
}

export default async function GeographySettingsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await auth()
    if (!session?.user?.id) redirect('/login')

    const params = await searchParams
    let targetCountryId = typeof params.countryId === 'string' ? params.countryId : undefined

    // Default to company country if not specified
    if (!targetCountryId) {
        targetCountryId = await getCompanyCountry()
    }

    // Pass all countries for the switcher if admin
    const availableCountries = await getCountries()

    if (!targetCountryId) {
        return (
            <div className="container mx-auto p-8 max-w-5xl flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                    <Globe className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Country Configured</h2>
                <p className="text-slate-500 max-w-md mb-8">
                    Your company profile doesn't have a headquarters country assigned.
                    Please update your Global Settings or select a country from the list if you are an admin.
                </p>
                {/* Fallback Switcher could go here */}
                <a
                    href="/settings/global"
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                    Go to Global Settings
                </a>
            </div>
        )
    }

    const { success, data, error } = await getAdministrativeHierarchy(targetCountryId)

    if (!success || !data) {
        return (
            <div className="container mx-auto p-8 max-w-5xl">
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-bold text-rose-900">Data Unavailable</h3>
                        <p className="text-rose-700 mt-1">
                            We couldn't load the administrative structure for the selected country.
                        </p>
                        <p className="text-xs font-mono mt-4 text-rose-500">Error: {error}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <header className="mb-8 pb-4">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Administrative Structure</h1>
                <p className="text-slate-500 mt-2 text-lg">
                    Define the granular regional hierarchy for <strong>{data.country.name}</strong> to align with your sales territories, tax jurisdictions, and logistics.
                </p>
            </header>

            <HierarchyManager
                country={data.country}
                hierarchy={data.hierarchy}
                availableCountries={availableCountries}
                currentCountryId={targetCountryId}
            />
        </div>
    )
}
