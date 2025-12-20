import { getUsers, getAvailableRoles } from "@/app/actions/users"
import { Users, TrendingUp, UserCheck, UserX } from "lucide-react"
import { UserTable } from "@/components/users/user-table"
import { InviteUserDialog } from "@/components/users/invite-user-dialog"
import { Toaster } from "@/components/ui/toaster"

interface PageProps {
    searchParams: {
        search?: string
        role?: string
        status?: 'active' | 'inactive' | 'all'
        page?: string
    }
}

export default async function UsersPage({ searchParams }: PageProps) {
    const page = parseInt(searchParams.page || '1')
    const result = await getUsers({
        search: searchParams.search,
        role: searchParams.role,
        status: searchParams.status,
        page,
        limit: 20
    })

    const roles = await getAvailableRoles()

    const activeUsers = result.users?.filter(u => u.is_active).length || 0
    const inactiveUsers = result.users?.filter(u => !u.is_active).length || 0

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Toaster />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        User Management
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage users, assign roles, and control access to your system
                    </p>
                </div>
                <InviteUserDialog roles={roles} />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{result.total || 0}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Users</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">{activeUsers}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <UserCheck className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">{inactiveUsers}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <UserX className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                            <p className="text-2xl font-bold text-blue-600 mt-1">+12%</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* User Table */}
            <UserTable
                users={result.users || []}
                total={result.total || 0}
                pages={result.pages || 0}
                currentPage={result.currentPage || 1}
            />
        </div>
    )
}
