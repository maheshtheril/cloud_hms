import Link from "next/link"
import { LogOut } from "lucide-react"
import { getMenuItems } from "@/app/actions/navigation"
import { getCurrentCompany } from "@/app/actions/company"
import { CompanySwitcher } from "@/components/company-switcher"
import { SidebarMenu } from "@/components/crm/sidebar-menu"
import { signOut } from "@/auth"

export default async function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const menuItems = await getMenuItems();
    const currentCompany = await getCurrentCompany();

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar - Matching CRM Layout */}
            <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col z-40 fixed inset-y-0 left-0">
                <div className="h-16 flex items-center px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                    <CompanySwitcher initialActiveCompany={currentCompany} />
                </div>

                <SidebarMenu groups={menuItems} />

                <div className="p-4 border-t border-slate-800 bg-slate-900">
                    <form action={async () => {
                        'use server';
                        await signOut({ redirectTo: '/login' });
                    }}>
                        <button className="flex items-center justify-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 bg-red-900/10 hover:bg-red-900/20 border border-red-900/20 rounded-lg transition-all font-medium group">
                            <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            <span>Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-w-0 overflow-y-auto h-screen bg-slate-50 dark:bg-slate-950">
                {/* Header usually goes here but Settings might handle its own headers per page */}
                {children}
            </main>
        </div>
    )
}
