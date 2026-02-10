'use client'

import { useMemo, useState } from 'react'
import {
    Users, Network, User, ShieldCheck,
    ChevronDown, ChevronRight, Search,
    ZoomIn, ZoomOut, Maximize2, Briefcase
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Employee {
    id: string
    first_name: string
    last_name: string | null
    email: string | null
    supervisor_id: string | null
    department_id: string | null
    designation: { name: string } | null
}

interface Department {
    id: string
    name: string
    parent_id: string | null
}

interface Props {
    employees: Employee[]
    departments: Department[]
}

export function OrgChartView({ employees, departments }: Props) {
    const [search, setSearch] = useState('')
    const [zoom, setZoom] = useState(1)
    const [viewMode, setViewMode] = useState<'department' | 'employee'>('department')

    // Build Department Tree
    const deptTree = useMemo(() => {
        const map: Record<string, any> = {}
        const roots: any[] = []

        departments.forEach(d => {
            map[d.id] = { ...d, children: [], staff: [] }
        })

        // Add employees to departments
        employees.forEach(e => {
            if (e.department_id && map[e.department_id]) {
                map[e.department_id].staff.push(e)
            }
        })

        departments.forEach(d => {
            if (d.parent_id && map[d.parent_id]) {
                map[d.parent_id].children.push(map[d.id])
            } else {
                roots.push(map[d.id])
            }
        })

        return roots
    }, [departments, employees])

    // Build Employee Tree (Supervisor-Subordinate)
    const employeeTree = useMemo(() => {
        const map: Record<string, any> = {}
        const roots: any[] = []

        employees.forEach(e => {
            map[e.id] = { ...e, children: [] }
        })

        employees.forEach(e => {
            if (e.supervisor_id && map[e.supervisor_id]) {
                map[e.supervisor_id].children.push(map[e.id])
            } else {
                roots.push(map[e.id])
            }
        })

        return roots
    }, [employees])

    const renderEmployeeNode = (emp: any) => (
        <div key={emp.id} className="flex flex-col items-center">
            <div className={cn(
                "group relative w-64 p-4 rounded-3xl border border-white bg-white/40 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-indigo-500/20",
                emp.first_name.toLowerCase().includes(search.toLowerCase()) ? "ring-2 ring-indigo-500 ring-offset-4 ring-offset-transparent" : ""
            )}>
                {/* Visual Flair */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl">
                    <User className="w-6 h-6" />
                </div>

                <div className="mt-4 text-center space-y-1">
                    <h4 className="font-black text-slate-900 tracking-tight">{emp.first_name} {emp.last_name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{emp.designation?.name || 'Associate'}</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate">{emp.email}</p>
                </div>

                {/* Subordinate Count Badge */}
                {emp.children.length > 0 && (
                    <div className="mt-3 flex justify-center">
                        <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded-full tracking-tighter">
                            MANAGING {emp.children.length} STAFF
                        </span>
                    </div>
                )}
            </div>

            {emp.children.length > 0 && (
                <div className="flex flex-col items-center">
                    <div className="w-px h-12 bg-gradient-to-b from-indigo-200 to-transparent"></div>
                    <div className="flex gap-8 items-start">
                        {emp.children.map((child: any) => renderEmployeeNode(child))}
                    </div>
                </div>
            )}
        </div>
    )

    const renderDeptNode = (dept: any) => (
        <div key={dept.id} className="flex flex-col items-center">
            <div className="w-80 p-6 rounded-[2.5rem] border border-white bg-white/60 backdrop-blur-2xl shadow-3xl space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Network className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 leading-tight">{dept.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dept.staff.length} Personnel</p>
                    </div>
                </div>

                <div className="space-y-2">
                    {dept.staff.slice(0, 3).map((s: any) => (
                        <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl border border-slate-50 bg-white/40">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-200"></div>
                            <span className="text-xs font-bold text-slate-700">{s.first_name}</span>
                            <span className="text-[8px] font-black text-slate-400 uppercase ml-auto">{s.designation?.name?.substring(0, 10)}</span>
                        </div>
                    ))}
                    {dept.staff.length > 3 && (
                        <p className="text-center text-[9px] font-black text-slate-400 pt-1">+ {dept.staff.length - 3} MORE ACTIVE STAFF</p>
                    )}
                </div>
            </div>

            {dept.children.length > 0 && (
                <div className="flex flex-col items-center">
                    <div className="w-px h-16 bg-slate-200"></div>
                    <div className="flex gap-16 items-start">
                        {dept.children.map((child: any) => renderDeptNode(child))}
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div className="space-y-12">
            {/* Control Hub */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-xl">
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    <Button
                        variant={viewMode === 'department' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('department')}
                        className={cn("rounded-xl font-bold gap-2", viewMode === 'department' ? "bg-white text-indigo-600 shadow-md hover:bg-white" : "text-slate-500")}
                    >
                        <Network className="w-4 h-4" /> Dept View
                    </Button>
                    <Button
                        variant={viewMode === 'employee' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('employee')}
                        className={cn("rounded-xl font-bold gap-2", viewMode === 'employee' ? "bg-white text-indigo-600 shadow-md hover:bg-white" : "text-slate-500")}
                    >
                        <Users className="w-4 h-4" /> Employee View
                    </Button>
                </div>

                <div className="flex items-center gap-4 w-full md:w-96 bg-white rounded-2xl px-4 py-2 border border-slate-100 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                    <Search className="w-5 h-5 text-slate-400" />
                    <Input
                        placeholder={`Search ${viewMode}...`}
                        className="border-none bg-transparent focus-visible:ring-0 px-0 h-8 font-medium italic"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="rounded-xl aspect-square"><ZoomOut className="w-4 h-4" /></Button>
                    <span className="text-[10px] font-black text-slate-400 min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
                    <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="rounded-xl aspect-square"><ZoomIn className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon" onClick={() => setZoom(1)} className="rounded-xl aspect-square ml-2"><Maximize2 className="w-4 h-4" /></Button>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative w-full overflow-hidden rounded-[4rem] bg-slate-900 shadow-inner min-h-[600px] border-[8px] border-slate-900">
                {/* Animated Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

                <div
                    className="p-20 transition-transform duration-500 origin-top flex justify-center"
                    style={{ transform: `scale(${zoom})` }}
                >
                    <div className="flex gap-20 items-start">
                        {viewMode === 'department'
                            ? deptTree.map(root => renderDeptNode(root))
                            : employeeTree.map(root => renderEmployeeNode(root))
                        }

                        {((viewMode === 'department' && deptTree.length === 0) || (viewMode === 'employee' && employeeTree.length === 0)) && (
                            <div className="text-center py-40">
                                <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-500 mx-auto mb-6">
                                    <Briefcase className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-white">No Organizational Data Found</h3>
                                <p className="text-slate-500 font-bold mt-2">Initialize departments or employees to see the structure.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
