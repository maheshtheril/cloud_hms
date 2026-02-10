
import { getEmployee } from "@/app/actions/crm/employees"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, Phone, MapPin, Building2, Calendar, ShieldCheck, Edit2, ArrowLeft, Activity, Target, Briefcase } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export const dynamic = 'force-dynamic'

export default async function EmployeeViewPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const employee = await getEmployee(params.id)

    if (!employee) {
        notFound()
    }

    const fullName = `${employee.first_name} ${employee.last_name || ''}`.trim()

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            <header className="flex items-center justify-between border-b pb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href="/crm/employees">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{fullName}</h1>
                        <p className="text-slate-500 font-medium">{employee.designation?.name || 'No Designation'}</p>
                    </div>
                </div>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                    <Link href={`/crm/employees/${employee.id}/edit`}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Link>
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Avatar and Status */}
                <Card className="lg:col-span-1 border-slate-200 shadow-sm">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto h-24 w-24 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border-2 border-indigo-100 text-3xl font-bold mb-4 shadow-inner">
                            {employee.first_name[0]}{employee.last_name ? employee.last_name[0] : ''}
                        </div>
                        <CardTitle className="text-xl font-bold">{fullName}</CardTitle>
                        <Badge variant={employee.status === 'active' ? 'default' : 'secondary'} className="mt-2">
                            {employee.status?.toUpperCase() || 'ACTIVE'}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6 border-t mt-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600 font-medium truncate">{employee.email || "No email"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600 font-medium">{employee.phone || "No phone"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Building2 className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600 font-medium">{employee.branch?.name || "Global / All"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600 font-medium">Joined {format(new Date(employee.created_at), 'MMMM yyyy')}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Details and Insights */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <div className="h-1.5 bg-indigo-600 w-full" />
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                                Professional Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Designation</span>
                                    <p className="text-slate-900 dark:text-white font-bold text-lg mt-1">{employee.designation?.name || 'N/A'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Department</span>
                                    <p className="text-slate-900 dark:text-white font-bold text-lg mt-1">{employee.department?.name || 'Unassigned'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Reporting To</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        {employee.supervisor ? (
                                            <>
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                                                    {employee.supervisor.first_name[0]}
                                                </div>
                                                <p className="text-slate-900 dark:text-white font-bold text-lg hover:text-indigo-600 transition-colors">
                                                    <Link href={`/crm/employees/${employee.supervisor_id}`}>{employee.supervisor.first_name} {employee.supervisor.last_name}</Link>
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-slate-400 font-bold text-lg">No Supervisor</p>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assigned Branch</span>
                                    <p className="text-slate-900 dark:text-white font-bold text-lg mt-1">{employee.branch?.name || 'Global / All'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Office Location</span>
                                    <p className="text-slate-900 dark:text-white font-bold text-lg mt-1 gap-2 flex items-center">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        {employee.office || 'Not Specified'}
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Category / Class</span>
                                    <p className="text-slate-900 dark:text-white font-bold text-lg mt-1">{employee.category || 'General Staff'}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-indigo-500" />
                                    Performance Summary
                                </h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 rounded-lg bg-teal-50 border border-teal-100">
                                        <p className="text-teal-600 font-black text-xl">0</p>
                                        <p className="text-[10px] text-teal-700 font-bold uppercase">Deals Won</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                                        <p className="text-indigo-600 font-black text-xl">0</p>
                                        <p className="text-[10px] text-indigo-700 font-bold uppercase">Leads Active</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                                        <p className="text-slate-600 font-black text-xl">0</p>
                                        <p className="text-[10px] text-slate-700 font-bold uppercase">Tasks</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Target className="h-5 w-5 text-indigo-600" />
                                System Access
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-slate-100">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Portal Access</p>
                                    <p className="text-xs text-slate-500">This employee currently has portal access enabled.</p>
                                </div>
                                <Button variant="outline" size="sm" className="ml-auto text-xs">Manage Access</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

