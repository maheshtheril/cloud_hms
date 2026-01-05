import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getShifts, getRoster } from "@/app/actions/attendance"
import { startOfWeek, endOfWeek, addDays, format } from "date-fns"
import {
    Calendar as CalendarIcon,
    Users,
    Clock,
    ShieldCheck,
    Layers,
    Search,
    ChevronLeft,
    ChevronRight,
    Settings2,
    UserCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ensureHmsMenus } from "@/lib/menu-seeder"
import RosterGrid from "@/components/attendance/roster-grid"
import { ShiftDialog } from "@/components/attendance/shift-dialog"
import { BroadcastCenter } from "@/components/attendance/broadcast-center"
import { BroadcastAlert } from "@/components/attendance/broadcast-alert"

export default async function RosterPage() {
    await ensureHmsMenus()
    const session = await auth()
    const tenantId = session?.user?.tenantId

    // Static week for demo/initial load
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 })
    const endOfCurrentWeek = endOfWeek(new Date(), { weekStartsOn: 1 })
    const days = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i))

    // Fetch Data
    const [shifts, roster, staff] = await Promise.all([
        getShifts(),
        getRoster(startOfCurrentWeek, endOfCurrentWeek),
        prisma.app_user.findMany({
            where: { tenant_id: tenantId as string, is_active: true },
            select: { id: true, name: true, email: true, metadata: true }
        })
    ])

    return (
        <div className="min-h-screen bg-background p-8 pb-20">
            {/* Elegant Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                            <Layers className="h-5 w-5 text-purple-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Resource Allocation</span>
                    </div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight">Shift Roster</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Orchestrate your medical team with precision.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button className="bg-muted/50 hover:bg-muted text-foreground border-border rounded-2xl h-12 px-6 font-bold text-xs tracking-wider">
                        <Search className="h-4 w-4 mr-2" />
                        SEARCH ROSTER
                    </Button>
                    <BroadcastCenter />
                    <ShiftDialog />
                </div>
            </div>

            {/* Quick Stats Overlay */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total Assigned', value: roster.length, icon: Users, color: 'text-indigo-400' },
                    { label: 'Active Shifts', value: shifts.length, icon: Clock, color: 'text-emerald-400' },
                    { label: 'Coverage Delta', value: 'Optimized', icon: ShieldCheck, color: 'text-amber-400' },
                    { label: 'Total Personnel', value: staff.length, icon: UserCircle, color: 'text-blue-400' },
                ].map((stat, i) => (
                    <Card key={i} className="glass-card bg-card border-border p-6 rounded-3xl overflow-hidden relative group">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 rounded-2xl bg-muted/50">
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-foreground mt-1">{stat.value}</p>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            <stat.icon className="h-20 w-20 text-foreground" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Roster Grid */}
            <Card className="glass-card bg-card/50 border-border rounded-[3rem] overflow-hidden border backdrop-blur-3xl">
                <div className="p-8 border-b border-border bg-muted/20 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button size="icon" variant="ghost" className="text-foreground hover:bg-muted rounded-xl"><ChevronLeft className="h-4 w-4" /></Button>
                        <h2 className="text-foreground font-black tracking-tight flex items-center gap-3">
                            <CalendarIcon className="h-5 w-5 text-indigo-500" />
                            {format(startOfCurrentWeek, 'MMMM yyyy')}
                        </h2>
                        <Button size="icon" variant="ghost" className="text-foreground hover:bg-muted rounded-xl"><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/30 text-indigo-500 font-bold px-3 py-1">WEEK VIEW</Badge>
                        <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground"><Settings2 className="h-4 w-4" /></Button>
                    </div>
                </div>

                <RosterGrid
                    staff={JSON.parse(JSON.stringify(staff))}
                    shifts={JSON.parse(JSON.stringify(shifts))}
                    roster={JSON.parse(JSON.stringify(roster))}
                    days={days}
                />
            </Card>

            {/* Shift Definitions Section */}
            <div className="mt-12">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-8 w-1 bg-indigo-500 rounded-full" />
                    <h3 className="text-xl font-black text-foreground tracking-tight">Operation Protocols</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {shifts.length === 0 ? (
                        <div className="col-span-4 p-12 rounded-[2rem] border border-dashed border-border text-center">
                            <p className="text-muted-foreground italic">No operational protocols (shifts) defined. Initialize system parameters.</p>
                        </div>
                    ) : (
                        shifts.map(shift => (
                            <Card key={shift.id} className="glass-card bg-card border-border p-6 rounded-3xl group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <Clock className="h-12 w-12 text-foreground" />
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-10 w-10 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: shift.color || '#6366f1' }}>
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <Badge variant="outline" className="border-border text-[9px] font-black text-muted-foreground">{shift.work_days.length} DAYS / WEEK</Badge>
                                </div>
                                <h4 className="text-foreground font-black text-lg mb-1">{shift.name}</h4>
                                <p className="text-indigo-500 text-xs font-bold mb-4">{shift.start_time} — {shift.end_time}</p>
                                <div className="flex gap-1 flex-wrap mb-6">
                                    {shift.work_days.map(d => (
                                        <span key={d} className="text-[8px] font-black px-2 py-0.5 rounded bg-muted text-muted-foreground">{d.slice(0, 3)}</span>
                                    ))}
                                </div>
                                <Button className="w-full bg-muted hover:bg-muted/80 text-foreground rounded-xl h-10 text-[10px] font-black uppercase tracking-widest border border-border">
                                    OPTIMIZE
                                </Button>
                            </Card>
                        ))
                    )}
                </div>
            </div>
            <BroadcastAlert />
        </div>
    )
}
