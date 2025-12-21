import Link from 'next/link'
import { Activity, LogOut } from 'lucide-react'
import { signOut } from '@/auth'
import { getMenuItems } from '../actions/navigation'
import { CompanySwitcher } from '@/components/company-switcher'
import { getCurrentCompany } from '../actions/company'
import { checkCrmLoginStatus } from '@/app/actions/crm/auth'
import { LoginWorkflowWrapper } from '@/components/crm/login-workflow/wrapper'
import { SidebarMenu } from '@/components/crm/sidebar-menu'

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
