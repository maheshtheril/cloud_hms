import Link from "next/link"
import { Users, Settings, LayoutDashboard, Shield } from "lucide-react"

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Settings className="h-6 w-6 text-gray-600" />
                        Settings
                    </h2>
                </div>

                <nav className="p-4 space-y-1">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors mb-4">
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Back to Dashboard</span>
                    </Link>

                    <div className="px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Administration
                    </div>

                    <Link href="/settings/users" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors">
                        <Users className="h-5 w-5" />
                        <span>Users</span>
                    </Link>

                    <Link href="/settings/roles" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors">
                        <Shield className="h-5 w-5" />
                        <span>Roles</span>
                    </Link>

                    <Link href="/settings/custom-fields" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors">
                        <Settings className="h-5 w-5" />
                        <span>Custom Fields</span>
                    </Link>

                    <Link href="/settings/crm" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors">
                        <Settings className="h-5 w-5" />
                        <span>CRM Masters</span>
                    </Link>

                    <Link href="/settings/global" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors">
                        <Settings className="h-5 w-5" />
                        <span>Global Settings</span>
                    </Link>
                </nav>
            </aside>

            {/* Mobile Nav Placeholder - for now just rely on back buttons or built-in browser nav */}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
