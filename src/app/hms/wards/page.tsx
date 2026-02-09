import { getBranches } from "@/app/actions/company"
import { WardManager } from "@/components/wards/ward-manager"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Wards & Admissions | Operations",
    description: "Hospital ward management and bed occupancy tracking",
}

export default async function WardsPage() {
    const session = await auth()
    const branchesRes = await getBranches()
    const branches = branchesRes.success ? branchesRes.data : []

    return <WardManager branches={branches || []} isAdmin={!!session?.user?.isAdmin || !!session?.user?.isTenantAdmin} />
}
