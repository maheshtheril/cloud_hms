import Link from 'next/link'
import { Activity, LogOut } from 'lucide-react'
import { signOut, auth } from '@/auth'
import { getMenuItems } from '../actions/navigation'
import { CompanySwitcher } from '@/components/company-switcher'
import { getCurrentCompany } from '../actions/company'
import { checkCrmLoginStatus } from '@/app/actions/crm/auth'
import { LoginWorkflowWrapper } from '@/components/crm/login-workflow/wrapper'
import { AppSidebar } from '@/components/layout/app-sidebar'

export default async function CRMLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const menuItems = await getMenuItems();
    const currentCompany = await getCurrentCompany();
    const loginStatus = await checkCrmLoginStatus();
    const session = await auth();

    return (
        <AppSidebar menuItems={menuItems} currentCompany={currentCompany} user={session?.user}>
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 min-h-screen relative">
                {/* Mobile Header (Now managed by AppSidebar, but keeping CRM branding implies specific header needs? 
                    AppSidebar has a 'HMS Core' header. If CRM needs 'CRM Module' header on mobile, 
                    we might want to update AppSidebar to accept a module name or custom header. 
                    For now, the unified AppSidebar header is better for consistency.
                    Keeping the Workflow wrapper.
                 */}
                <div className="p-4 md:p-8">
                    <LoginWorkflowWrapper status={loginStatus}>
                        {children}
                    </LoginWorkflowWrapper>
                </div>
            </div>
        </AppSidebar>
    )
}
