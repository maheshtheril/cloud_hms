
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Briefcase, Plus, ShieldCheck, Trash2, Edit2, MoreVertical, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = 'force-dynamic'

export default async function DesignationsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect('/login')

    const tenantId = session.user.tenantId
    if (!tenantId) return <div>No tenant associated.</div>

    const designations = await prisma.crm_designation.findMany({
        where: { tenant_id: tenantId },
        include: {
            _count: {
                select: { employees: true }
            }
        },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Designations</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage job roles and employee titles within your CRM.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                        <Link href="/settings/designations/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Designation
                        </Link>
                    </Button>
                </div>
            </header>

            {designations.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
                    <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">No designations found</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">Start by adding job titles like 'Sales Manager' or 'Support Specialist'.</p>
                    <Button asChild variant="outline" className="mt-6 border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                        <Link href="/settings/designations/new">Create First Designation</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {designations.map((desig) => (
                        <Card key={desig.id} className="overflow-hidden group hover:border-indigo-200 transition-all hover:shadow-md">
                            <CardHeader className="bg-slate-50/50 border-b pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm">
                                        <ShieldCheck className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <Badge variant={desig.is_active ? "default" : "secondary"}>
                                        {desig.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <div className="mt-4">
                                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                        {desig.name}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 mt-2">
                                        {desig.description || "No description provided."}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                        <Users className="h-4 w-4 text-slate-400" />
                                        <span>{desig._count.employees} Employees</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" asChild>
                                            <Link href={`/settings/designations/${desig.id}`}>
                                                <Edit2 className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
