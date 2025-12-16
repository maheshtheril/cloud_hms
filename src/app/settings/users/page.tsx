import { getUsers } from "@/app/actions/user"
import Link from "next/link"
import { Users, UserPlus, Shield, UserCog } from "lucide-react"

export default async function UsersPage() {
    const users = await getUsers()

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Users className="h-6 w-6 text-blue-600" />
                        User Management
                    </h1>
                    <p className="text-gray-500">Manage system access and assign details.</p>
                </div>
                {/* Placeholder for Invite User - implemented later if needed */}
                <button className="bg-gray-100 text-gray-400 cursor-not-allowed px-4 py-2 rounded-lg flex items-center gap-2 font-medium" disabled>
                    <UserPlus className="h-4 w-4" />
                    Invite User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">User</th>
                            <th className="p-4 font-semibold text-gray-600">System Role</th>
                            <th className="p-4 font-semibold text-gray-600">HMS Roles</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{user.full_name || user.name || 'Unknown'}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                        <Shield className="h-3 w-3" />
                                        {user.role || 'User'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1">
                                        {user.hms_user_roles && user.hms_user_roles.length > 0 ? (
                                            user.hms_user_roles.map((ur) => (
                                                <span key={ur.id} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">
                                                    {ur.hms_role.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">None</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                        ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <Link
                                        href={`/settings/users/${user.id}`}
                                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        <UserCog className="h-4 w-4" />
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
