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
        <div className="min-h-screen bg-background p-8 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight">Daily Logs</h1>
                    <p className="text-muted-foreground mt-2 text-sm">Real-time supervision of all staff movements for {format(new Date(), 'MMMM do, yyyy')}.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter personnel..."
                            className="pl-10 h-10 w-64 bg-muted/50 border-border text-foreground rounded-xl focus:ring-indigo-500/50"
                        />
                    </div>
                    <Button variant="outline" className="h-10 bg-muted/50 text-muted-foreground border-border hover:bg-muted">
                        <Filter className="h-4 w-4 mr-2" />
                        Status
                    </Button>
                </div>
            </div>

            {/* Logs Table */}
            <Card className="glass-card bg-card border-border rounded-[2rem] overflow-hidden backdrop-blur-xl">
                <CardHeader className="bg-card border-b border-border py-6">
                    <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
                        Attendance Register
                        <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 ml-2">{logs.length} RECORDS</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent border-border">
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Personnel</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Signal In</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Signal Out</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Location</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                            No attendance activity recorded for today.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log: any) => (
                                        <TableRow key={log.id} className="hover:bg-muted/50 border-border transition-colors group">
                                            <TableCell className="font-medium text-foreground py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 rounded-lg border border-border">
                                                        <AvatarImage src={log.user.image} />
                                                        <AvatarFallback className="rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-black">
                                                            {log.user.name?.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-bold leading-none">{log.user.name}</p>
                                                        <p className="text-[10px] text-muted-foreground font-mono mt-1">{log.user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground font-mono text-xs">
                                                {format(new Date(log.check_in), 'HH:mm:ss')}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground font-mono text-xs">
                                                {log.check_out ? format(new Date(log.check_out), 'HH:mm:ss') : (
                                                    <span className="text-emerald-500 animate-pulse font-bold">ACTIVE NOW</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs">
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
