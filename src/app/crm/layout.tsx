
import Link from 'next/link'
import { Activity, Users, Calendar, LayoutDashboard, Settings, LogOut, Stethoscope, Receipt, Shield, Menu, Kanban, Briefcase } from 'lucide-react'
import { signOut } from '@/auth'
import { getMenuItems } from '../actions/navigation'
import { CompanySwitcher } from '@/components/company-switcher'
import { getCurrentCompany } from '../actions/company'
import { checkCrmLoginStatus } from '@/app/actions/crm/auth'
import { LoginWorkflowWrapper } from '@/components/crm/login-workflow/wrapper'
import { ThemeToggle } from '@/components/theme-toggle'

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
        <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Sidebar - Fixed Width, Always Visible */}
            <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col z-40">
                <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-800">
                    <CompanySwitcher initialActiveCompany={currentCompany} />
                </div>

                <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                    {menuItems.map((group: any) => (
                        <div key={group.module.module_key}>
                            {group.module.module_key !== 'general' && (
                                <h3 className="px-3 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">
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

                <div className="p-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
                    {/* ThemeToggle hidden for now to prevent hydration error */}
                    {/* <ThemeToggle /> */}

                    <form action={async () => {
                        'use server';
                        await signOut({ redirectTo: '/login' });
                    }}>
                        <button className="flex items-center justify-center gap-3 w-full px-4 py-3 text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20 dark:border-red-900/30 border border-red-200 rounded-xl transition-all shadow-sm hover:shadow-md font-medium group">
                            <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            <span>Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-950 relative">
                <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 shadow-sm md:hidden flex justify-between items-center sticky top-0 z-30">
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
    // Simplify padding logic
    const paddingLeft = level === 0 ? "12px" : level === 1 ? "36px" : "56px";

    if (hasChildren) {
        return (
            <details className="group/item" open>
                <summary
                    className="flex items-center gap-3 py-2 text-gray-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors cursor-pointer list-none justify-between"
                    style={{ paddingLeft, paddingRight: '12px' }}
                >
                    <span className="flex items-center gap-3">
                        {Icon && <Icon className="h-5 w-5" />}
                        <span className={level > 0 ? "text-sm" : ""}>{item.label}</span>
                    </span>
                    <span className="transform group-open/item:rotate-90 transition-transform text-gray-400">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.33331 8.33333L6.66665 4.99999L3.33331 1.66666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </summary>
                <div className="space-y-1 mt-1">
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
            className="block flex items-center gap-3 py-2 text-gray-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors no-underline"
            style={{ paddingLeft, paddingRight: '12px' }}
        >
            {Icon && <Icon className="h-5 w-5" />}
            <span className={level > 0 ? "text-sm" : ""}>{item.label}</span>
        </Link>
    )
}
