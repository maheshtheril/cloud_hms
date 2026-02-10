
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DesignationForm } from "@/components/crm/designations/designation-form"

export default async function NewDesignationPage(props: {
    searchParams: Promise<{ department_id?: string }>
}) {
    const session = await auth()
    if (!session?.user?.id) redirect('/login')

    const tenantId = session.user.tenantId
    if (!tenantId) return <div>No tenant associated.</div>

    const searchParams = await props.searchParams
    const departmentId = searchParams.department_id

    // Fetch Masters for the form
    const [departments, designations] = await Promise.all([
        prisma.hms_departments.findMany({
            where: { tenant_id: tenantId, deleted_at: null },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        }),
        prisma.crm_designation.findMany({
            where: { tenant_id: tenantId },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        })
    ])

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <header className="flex flex-col border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">New Designation</h1>
                    <p className="text-slate-500 mt-1">Define a new job role or title for your CRM agents.</p>
                </div>
            </header>

            <DesignationForm
                departments={departments}
                designations={designations}
                initialData={departmentId ? { department_id: departmentId } as any : undefined}
            />
        </div>
    )
}
