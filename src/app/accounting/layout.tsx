import { auth } from '@/auth'
import { getMenuItems } from '../actions/navigation'
import { getCurrentCompany } from '../actions/company'
import { AppSidebar } from '@/components/layout/app-sidebar'

export default async function AccountingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const menuItems = await getMenuItems();
    const currentCompany = await getCurrentCompany();
    const session = await auth();

    return (
        <AppSidebar menuItems={menuItems} currentCompany={currentCompany} user={session?.user}>
            {children}
        </AppSidebar>
    )
}
