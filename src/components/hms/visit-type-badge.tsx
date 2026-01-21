import { Badge } from "@/components/ui/badge"
import { Activity, Stethoscope, Zap, Syringe, CalendarPlus } from "lucide-react"

export function VisitTypeBadge({ type }: { type: string }) {
    if (!type) return null;
    const styles: Record<string, string> = {
        emergency: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
        procedure: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        consultation: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
        follow_up: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
        checkup: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
    };
    const icons: Record<string, any> = {
        emergency: Zap,
        procedure: Syringe,
        consultation: Stethoscope,
        follow_up: CalendarPlus,
        checkup: Activity,
    };
    const Icon = icons[type.toLowerCase()] || Stethoscope;

    return (
        <Badge variant="outline" className={`text-[10px] px-1.5 py-0.5 flex items-center gap-1 uppercase tracking-wide border ${styles[type.toLowerCase()] || styles.consultation}`}>
            <Icon className="h-3 w-3" /> {type.replace('_', ' ')}
        </Badge>
    );
}
