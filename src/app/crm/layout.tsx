import Link from 'next/link'
import { Activity, LogOut } from 'lucide-react'
import { signOut, auth } from '@/auth'
import { getMenuItems } from '../actions/navigation'
import { CompanySwitcher } from '@/components/company-switcher'
import { getCurrentCompany } from '../actions/company'
import { getTenant } from '../actions/tenant'
import { checkCrmLoginStatus } from '@/app/actions/crm/auth'
import { LoginWorkflowWrapper } from '@/components/crm/login-workflow/wrapper'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { getUserComplianceStatus } from '@/app/actions/crm/target-compliance'
import { GatedComplianceLock } from '@/components/crm/targets/compliance-lock'
import { headers } from 'next/headers'

export default async function CRMLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const menuItems = await getMenuItems();
    const currentCompany = await getCurrentCompany();
    const tenant = await getTenant();
    const loginStatus = await checkCrmLoginStatus();
    const session = await auth();
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';

    // CRM Intelligence: Force Gated Compliance Check
    let compliance = { isBlocked: false, reason: '', targetId: '', deadline: '' };
    try {
        if (session?.user?.id) {
            compliance = await getUserComplianceStatus(session.user.id) as any;
        }
    } catch (error) {
        console.error("Compliance check failed:", error);
    }

    // Don't block the Targets page itself so they can see his failure details
    const isTargetPage = pathname.includes('/crm/targets');
    const shouldShowLock = compliance?.isBlocked && !isTargetPage;

    return (
        <AppSidebar menuItems={menuItems} currentCompany={currentCompany} tenant={tenant} user={session?.user}>
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 min-h-screen relative">
                {shouldShowLock && (
                    <GatedComplianceLock
                        reason={compliance.reason}
                        targetId={compliance.targetId}
                        deadline={compliance.deadline}
                    />
                )}

                <div className="p-4 md:p-8">
                    <LoginWorkflowWrapper status={loginStatus}>
                        {children}
                    </LoginWorkflowWrapper>
                </div>
            </div>
        </AppSidebar>
    )
}
