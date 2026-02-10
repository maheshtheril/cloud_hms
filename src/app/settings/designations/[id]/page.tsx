import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { DesignationForm } from "@/components/crm/designations/designation-form"

export const dynamic = 'force-dynamic'

export default async function EditDesignationPage(props: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) redirect('/login')

    const tenantId = session.user.tenantId
    const { id } = await props.params

    const [designation, departments, designations] = await Promise.all([
        prisma.crm_designation.findUnique({
            where: { id, tenant_id: tenantId }
        }),
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

    if (!designation) {
        notFound()
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <header className="flex flex-col border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Designation</h1>
                    <p className="text-slate-500 mt-1">Update job role details, department, and reporting lines.</p>
                </div>
            </header>

            <DesignationForm
                initialData={designation as any}
                departments={departments}
                designations={designations}
            />
        </div>
    )
}
