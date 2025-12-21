
import Link from 'next/link'
import { Activity, Users, Calendar, LayoutDashboard, Settings, LogOut, Stethoscope, Receipt, Shield, Menu, Kanban, Briefcase, ChevronRight } from 'lucide-react'
import { signOut } from '@/auth'
import { getMenuItems } from '../actions/navigation'
import { CompanySwitcher } from '@/components/company-switcher'
import { getCurrentCompany } from '../actions/company'
import { checkCrmLoginStatus } from '@/app/actions/crm/auth'
import { LoginWorkflowWrapper } from '@/components/crm/login-workflow/wrapper'

// Map icon strings to components
const IconMap: any = {
    LayoutDashboard, Users, Calendar, Stethoscope, Receipt, Settings, Shield, Kanban, Briefcase
};

export default async function CRMLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const menuItems = await getMenuItems();
    const currentCompany = await getCurrentCompany();
    const loginStatus = await checkCrmLoginStatus();

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col z-40 fixed inset-y-0 left-0">
                <div className="h-16 flex items-center px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                    <CompanySwitcher initialActiveCompany={currentCompany} />
                </div>

                <nav className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                    {menuItems.map((group: any) => (
                        <div key={group.module.module_key}>
                            {group.module.module_key !== 'general' && (
                                <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    {group.module.name}
                                </h3>
                            )}

                            <ul className="space-y-1">
                                {group.items.map((item: any) => (
                                    <li key={item.key}>
                                        <MenuItem item={item} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

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

            {/* Main Content (Pushed by sidebar) */}
            <main className="flex-1 ml-64 bg-slate-50 dark:bg-slate-950 min-h-screen relative">
                {/* Mobile Header (Hidden on Desktop) */}
                <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-sm md:hidden flex justify-between items-center sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <Activity className="text-blue-600 dark:text-blue-400 h-6 w-6" />
                        <span className="font-bold text-gray-800 dark:text-gray-100">CRM Module</span>
                    </div>
                </header>

                <div className="p-8">
                    <LoginWorkflowWrapper status={loginStatus}>
                        {children}
                    </LoginWorkflowWrapper>
                </div>
            </main>
        </div>
    )
}

function MenuItem({ item, level = 0 }: { item: any, level?: number }) {
    const Icon = IconMap[item.icon] || (level === 0 ? Activity : null);
    const hasChildren = item.other_menu_items && item.other_menu_items.length > 0;

    // Dynamic indentation class
    const paddingLeftClass = level === 0 ? "pl-3" : level === 1 ? "pl-9" : "pl-12";

    if (hasChildren) {
        return (
            <details className="group/item text-sm" open>
                <summary
                    className={`flex items-center justify-between gap-3 ${paddingLeftClass} pr-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer list-none select-none`}
                >
                    <div className="flex items-center gap-3">
                        {Icon && <Icon className="h-4 w-4" />}
                        <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="h-3 w-3 transition-transform group-open/item:rotate-90 text-slate-600 group-hover:text-slate-400" />
                </summary>
                <div className="mt-1 space-y-0.5 border-l border-slate-800 ml-5">
                    {item.other_menu_items.map((sub: any) => (
                        <MenuItem key={sub.key} item={sub} level={level + 1} />
                    ))}
                </div>
            </details>
        );
    }

    return (
        <Link
            href={item.url || '#'}
            className={`flex items-center gap-3 ${paddingLeftClass} pr-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors block decoration-0`}
        >
            {Icon && <Icon className="h-4 w-4" />}
            <span className="font-medium">{item.label}</span>
        </Link>
    )
}
