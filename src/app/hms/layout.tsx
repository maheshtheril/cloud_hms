import Link from 'next/link'
import { Activity, Users, Calendar, LayoutDashboard, Settings, LogOut, Stethoscope, Receipt, Shield, Menu } from 'lucide-react'
import { signOut } from '@/auth'
import { getMenuItems } from '../actions/navigation'
import { CompanySwitcher } from '@/components/company-switcher'
import { getCurrentCompany } from '../actions/company'
import { AppSidebar } from '@/components/layout/app-sidebar'

// Map icon strings to components
const IconMap: any = {
    LayoutDashboard, Users, Calendar, Stethoscope, Receipt, Settings, Shield
};

export default async function HMSLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const menuItems = await getMenuItems();
    const currentCompany = await getCurrentCompany();

    return (
        <AppSidebar menuItems={menuItems} currentCompany={currentCompany}>
            {children}
        </AppSidebar>
    )
}


