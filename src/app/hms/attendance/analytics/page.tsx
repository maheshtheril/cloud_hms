import { auth } from "@/auth"
import { getAttendanceAnalytics } from "@/app/actions/attendance"
import { AttendanceAnalyticsClient } from "@/components/attendance/analytics-client"
import { ExportAttendancePDF } from "@/components/attendance/export-pdf"
import { ensureHmsMenus } from "@/lib/menu-seeder"
import {
    LayoutDashboard,
    ShieldAlert,
    BarChart3,
    Search
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AttendanceAnalyticsPage() {
    await ensureHmsMenus()
    const session = await auth()
    const analytics = await getAttendanceAnalytics()

    return (
        <div className="min-h-screen bg-[#020617] p-8 pb-32">
            {/* Tactical Navigation Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                            <BarChart3 className="h-5 w-5 text-orange-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Intelligence Wing</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Staff Analytics</h1>
                    <p className="text-slate-400 mt-2 text-sm max-w-lg">Advanced telemetry and workforce reliability metrics. All data derived from central roster synchronization.</p>
                </div>

                <div className="flex items-center gap-3">
                    <ExportAttendancePDF />
                    <Button className="h-14 bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-500/20 rounded-2xl px-6 font-black text-xs tracking-widest">
                        SYNC REFRESH
                    </Button>
                </div>
            </div>

            {/* Core Analytics Modules */}
            <AttendanceAnalyticsClient data={JSON.parse(JSON.stringify(analytics))} />

            {/* Future Modules Placeholder */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <ShieldAlert className="h-24 w-24 text-rose-500" />
                    </div>
                    <h4 className="text-white font-black text-xl mb-2">Compliance Engine</h4>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Automated Incident Discovery</p>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-xs mb-8">
                        System is monitoring for repetitive lateness patterns and unauthorized punch attempts. Alerts will be broadcasted to the Command Center.
                    </p>
                    <Button className="bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 border-none px-6">Configure Alerts</Button>
                </div>

                <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <LayoutDashboard className="h-24 w-24 text-blue-500" />
                    </div>
                    <h4 className="text-white font-black text-xl mb-2">Resource Heatmap</h4>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Staffing Density Analysis</p>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-xs mb-8">
                        Visualize hospital ward congestion and clinician availability in real-time. Link this data with the Clinical Roster.
                    </p>
                    <Button className="bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 border-none px-6">View Heatmap</Button>
                </div>
            </div>
        </div>
    )
}
