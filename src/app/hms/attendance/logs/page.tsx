import { auth } from "@/auth"
import { getAllStaffAttendance } from "@/app/actions/attendance"
import { ensureHmsMenus } from "@/lib/menu-seeder"
import { format } from "date-fns"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function AttendanceLogsPage() {
    await ensureHmsMenus()
    const session = await auth()
    const logs = await getAllStaffAttendance()

    return (
        <div className="min-h-screen bg-[#020617] p-8 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Daily Logs</h1>
                    <p className="text-slate-400 mt-2 text-sm">Real-time supervision of all staff movements for {format(new Date(), 'MMMM do, yyyy')}.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Filter personnel..."
                            className="pl-10 h-10 w-64 bg-white/5 border-white/10 text-white rounded-xl focus:ring-indigo-500/50"
                        />
                    </div>
                    <Button variant="outline" className="h-10 bg-white/5 text-slate-300 border-white/10 hover:bg-white/10">
                        <Filter className="h-4 w-4 mr-2" />
                        Status
                    </Button>
                </div>
            </div>

            {/* Logs Table */}
            <Card className="glass-card bg-white/5 border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl">
                <CardHeader className="bg-white/5 border-b border-white/5 py-6">
                    <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                        Attendance Register
                        <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 ml-2">{logs.length} RECORDS</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="hover:bg-transparent border-white/5">
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-12">Personnel</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-12">Signal In</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-12">Signal Out</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-12">Location</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-12 text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-slate-500 italic">
                                            No attendance activity recorded for today.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log: any) => (
                                        <TableRow key={log.id} className="hover:bg-white/5 border-white/5 transition-colors group">
                                            <TableCell className="font-medium text-white py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 rounded-lg border border-white/10">
                                                        <AvatarImage src={log.user.image} />
                                                        <AvatarFallback className="rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-black">
                                                            {log.user.name?.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-bold leading-none">{log.user.name}</p>
                                                        <p className="text-[10px] text-slate-500 font-mono mt-1">{log.user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-300 font-mono text-xs">
                                                {format(new Date(log.check_in), 'HH:mm:ss')}
                                            </TableCell>
                                            <TableCell className="text-slate-300 font-mono text-xs">
                                                {log.check_out ? format(new Date(log.check_out), 'HH:mm:ss') : (
                                                    <span className="text-emerald-400 animate-pulse font-bold">ACTIVE NOW</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-xs">
                                                {(log.location_in as any)?.city || 'HUB-HQ'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    variant="outline"
                                                    className={`
                                                        border-0 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider
                                                        ${log.status === 'late'
                                                            ? 'bg-rose-500/10 text-rose-400'
                                                            : 'bg-emerald-500/10 text-emerald-400'}
                                                    `}
                                                >
                                                    {log.status === 'late' ? 'LATE ARRIVAL' : 'NOMINAL'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
