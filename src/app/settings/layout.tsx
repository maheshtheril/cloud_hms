import { AppSidebar } from "@/components/layout/app-sidebar"
import { getMenuItems } from "@/app/actions/navigation"
import { getCurrentCompany } from "@/app/actions/company"
import { auth } from "@/auth"

export default async function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const menuItems = await getMenuItems();
    const currentCompany = await getCurrentCompany();
    const session = await auth();

    return (
        <AppSidebar menuItems={menuItems} currentCompany={currentCompany} user={session?.user}>
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 min-h-screen relative overflow-y-auto">
                <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </AppSidebar>
    )
}
