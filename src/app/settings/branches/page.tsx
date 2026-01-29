
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Building2, Plus, MapPin, Phone, Globe, Trash2, CheckCircle2, MoreVertical } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = 'force-dynamic'

export default async function BranchesPage() {
    const session = await auth()
    if (!session?.user?.id) redirect('/login')

    const companyId = session.user.companyId
    if (!companyId) return <div>No company associated.</div>

    const branches = await prisma.hms_branch.findMany({
        where: { company_id: companyId },
        orderBy: { created_at: 'asc' }
    })

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Branches</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage physical locations and service centers for your company.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                        <Link href="/settings/branches/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Branch
                        </Link>
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
                        <Building2 className="mx-auto h-12 w-12 text-slate-300" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-900">No branches found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2">Create your first branch to start managing your locations.</p>
                        <Button asChild variant="outline" className="mt-6 border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                            <Link href="/settings/branches/new">Create New Branch</Link>
                        </Button>
                    </div>
                ) : (
                    branches.map((branch) => (
                        <Card key={branch.id} className="overflow-hidden group hover:border-indigo-200 transition-all hover:shadow-md">
                            <CardHeader className="bg-slate-50/50 border-b pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm">
                                        <Building2 className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <Badge variant={branch.is_active ? "success" : "secondary"}>
                                        {branch.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <div className="mt-4">
                                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-wide">
                                        {branch.name}
                                    </CardTitle>
                                    <CardDescription className="text-xs font-mono text-slate-400 mt-1">
                                        Code: {branch.code}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 text-sm text-slate-600">
                                        <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{branch.address || "No address provided"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                                        <span>{branch.phone || "No phone"}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`h-2 w-2 rounded-full ${branch.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                            {branch.type && branch.type !== 'clinic' ? branch.type : 'Location'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" asChild>
                                            <Link href={`/settings/branches/${branch.id}`}>
                                                <MoreVertical className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
