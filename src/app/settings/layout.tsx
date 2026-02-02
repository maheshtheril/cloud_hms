import { AppSidebar } from "@/components/layout/app-sidebar"
import { getMenuItems } from "@/app/actions/navigation"
import { getCurrentCompany } from "@/app/actions/company"
import { getTenant } from "@/app/actions/tenant"
import { auth } from "@/auth"

import { ensureAccountingMenu, ensureAdminMenus } from "@/lib/menu-seeder";

export default async function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Auto-fix menu visibility on ANY settings page load
    await ensureAccountingMenu();
    await ensureAdminMenus();

    const menuItems = await getMenuItems();
    const currentCompany = await getCurrentCompany();
    const tenant = await getTenant();
    const session = await auth();

    return (
        <AppSidebar menuItems={menuItems} currentCompany={currentCompany} tenant={tenant} user={session?.user}>
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 min-h-screen relative overflow-y-auto">
                <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </AppSidebar>
    )
}
