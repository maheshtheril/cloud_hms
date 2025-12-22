import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { GlobalSettingsForm } from "./global-settings-form"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function GlobalSettingsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect('/login')

    // Fetch User's Company
    const user = await prisma.app_user.findUnique({
        where: { id: session.user.id },
        select: { tenant_id: true, company_id: true }
    })

    if (!user || !user.company_id) {
        // Fallback if no company (shouldn't happen in app context usually)
        return <div className="p-8">No company associated with this user account.</div>
    }

    const company = await prisma.company.findUnique({
        where: { id: user.company_id },
        include: {
            company_settings: true
        }
    })

    const currencies = await prisma.currencies.findMany({
        select: { id: true, code: true, name: true, symbol: true },
        orderBy: { code: 'asc' }
    })

    if (!company) return <div>Company not found</div>

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-slate-900">Global Settings</h1>
                <p className="text-slate-500 mt-1">Configure your organization's core profile and preferences.</p>
            </header>

            <GlobalSettingsForm company={company} currencies={currencies} />
        </div>
    )
}
