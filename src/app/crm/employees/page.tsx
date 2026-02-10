
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Users, Plus, Mail, Phone, MapPin, Building2, UserPlus, Filter, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export const dynamic = 'force-dynamic'

export default async function EmployeesPage() {
    const session = await auth()
    if (!session?.user?.id) redirect('/login')

    const tenantId = session.user.tenantId
    if (!tenantId) return <div>No tenant associated.</div>

    let employees = []
    try {
        const rawEmployees = await prisma.crm_employee.findMany({
            where: { tenant_id: tenantId },
            include: {
                designation: { select: { name: true } },
                branch: { select: { name: true } }
            },
            orderBy: { first_name: 'asc' }
        }) || []

        // SANITIZE: Remove any non-serializable fields before rendering
        employees = rawEmployees.map(emp => ({
            id: emp.id,
            first_name: emp.first_name || '',
            last_name: emp.last_name || '',
            email: emp.email || '',
            phone: emp.phone || '',
            status: emp.status || 'Active',
            designation_name: emp.designation?.name || 'No Designation',
            branch_name: emp.branch?.name || 'Global / All'
        }))

    } catch (error) {
        console.error("Error fetching employees:", error)
        return (
            <div className="p-8 text-center bg-red-50 border border-red-200 rounded-xl">
                <h2 className="text-red-800 font-bold text-lg">Unable to load employees</h2>
                <p className="text-red-600 mt-2">There was an error connecting to the database. Please try again later.</p>
                <Button variant="outline" className="mt-4 border-red-200 text-red-700 hover:bg-red-100" asChild>
                    <Link href="/crm/employees">Retry</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Employee Directory</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage your organization's workforce and CRM agents.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                        <Link href="/crm/employees/new">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Employee
                        </Link>
                    </Button>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search employees by name, email..." className="pl-10" />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                </div>
            </div>

            {employees.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
                    <Users className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">Your directory is empty</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">Start building your team by adding your first employee.</p>
                    <Button asChild variant="outline" className="mt-6 border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                        <Link href="/crm/employees/new">Add First Employee</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {employees.map((emp) => (
                        <Card key={emp.id} className="overflow-hidden group hover:border-indigo-200 transition-all hover:shadow-md">
                            <CardContent className="p-0">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 text-xl font-bold">
                                                {emp.first_name?.[0] || '?'}{emp.last_name?.[0] || ''}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors capitalize">
                                                    {emp.first_name} {emp.last_name}
                                                </h3>
                                                <Badge variant="secondary" className="mt-1 font-medium bg-slate-100 text-slate-600 border-0">
                                                    {emp.designation_name}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Badge variant={emp.status.toLowerCase() === 'active' ? 'success' : 'secondary'}>
                                            {emp.status}
                                        </Badge>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                            <span className="truncate">{emp.email || "No email"}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                            <span>{emp.phone || "No phone"}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Building2 className="h-4 w-4 text-slate-400" />
                                            <span className="truncate">{emp.branch_name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50/50 p-3 border-t flex gap-2">
                                    <Button variant="ghost" className="flex-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 hover:bg-indigo-50" asChild>
                                        <Link href={`/crm/employees/${emp.id}`}>View Profile</Link>
                                    </Button>
                                    <Button variant="ghost" className="flex-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 hover:bg-indigo-50" asChild>
                                        <Link href={`/crm/employees/${emp.id}/edit`}>Edit</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
