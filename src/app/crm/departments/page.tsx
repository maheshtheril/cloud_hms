import { getDepartments } from '@/app/actions/crm/departments'
import { DepartmentManager } from '@/components/crm/departments/department-manager'
import { Network, Search, Plus, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function DepartmentsPage() {
    const departments = await getDepartments()

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* High-End Header Area */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-[0_15px_35px_rgba(79,70,229,0.3)] transform -rotate-3 hover:rotate-0 transition-all duration-500">
                            <Network className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                                Departments
                            </h1>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="h-1 w-12 bg-indigo-600 rounded-full"></span>
                                <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                                    Organizational Architecture & Functional Units
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 gap-2">
                        <Download className="w-4 h-4" /> Export Structure
                    </Button>
                </div>
            </div>

            {/* Department Management Visual Cluster */}
            <div className="relative">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/20 blur-[100px] -z-10 rounded-full"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-200/20 blur-[100px] -z-10 rounded-full"></div>

                <DepartmentManager initialDepartments={JSON.parse(JSON.stringify(departments))} />
            </div>
        </div>
    )
}
