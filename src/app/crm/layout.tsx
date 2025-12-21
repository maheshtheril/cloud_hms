
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
    // const menuItems = await getMenuItems();
    const currentCompany = await getCurrentCompany();
    const loginStatus = await checkCrmLoginStatus();

    // EMERGENCY HARDCODED MENU TO RESTORE VIEW
    const menuItems = [
        {
            module: { name: 'CRM Core', module_key: 'crm' },
            items: [
                { key: 'dashboard', label: 'Command Center', icon: 'LayoutDashboard', url: '/crm/dashboard' },
                { key: 'leads', label: 'Leads', icon: 'Users', url: '/crm/leads' },
                { key: 'deals', label: 'Deals', icon: 'Briefcase', url: '/crm/deals' },
                { key: 'contacts', label: 'Contacts', icon: 'Users', url: '/crm/contacts' },
            ]
        },
        {
            module: { name: 'Settings', module_key: 'settings' },
            items: [
                { key: 'roles', label: 'Roles & Permissions', icon: 'Shield', url: '/settings/roles' },
            ]
        }
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 hidden md:flex flex-col">
                <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                    <CompanySwitcher initialActiveCompany={currentCompany} />
                </div>

                <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                    {menuItems.map((group: any) => (
                        <div key={group.module.module_key}>
                            {/* Module Header */}
                            {group.module.module_key !== 'general' && (
                                <h3 className="px-3 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                    {group.module.name}
                                </h3>
                            )}

                            <div className="space-y-1">
                                {group.items.map((item: any) => (
                                    <MenuItem key={item.key} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
                    {/* <ThemeToggle /> - Temporarily disabled */}
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
            <main className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-950">
                <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 shadow-sm md:hidden flex justify-between items-center">
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
    const paddingLeftClass = level === 0 ? "px-3" : level === 1 ? "pl-9 pr-3" : "pl-14 pr-3";

    if (hasChildren) {
        return (
            <details className="group/item" open>
                {/* defaulted to open for better visibility of CRM sub-items */}
                <summary
                    className={`flex items-center gap-3 ${paddingLeftClass} py-2 text-gray-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors cursor-pointer list-none justify-between`}
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
            className={`flex items-center gap-3 ${paddingLeftClass} py-2 text-gray-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors`}
        >
            {Icon && <Icon className="h-5 w-5" />}
            <span className={level > 0 ? "text-sm" : ""}>{item.label}</span>
        </Link>
    )
}
