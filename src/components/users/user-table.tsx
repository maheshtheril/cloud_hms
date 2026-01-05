'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, UserPlus, Filter, Edit, Power, Trash2, Mail, Shield, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateUserStatus, deleteUser } from '@/app/actions/users'
import { useToast } from '@/components/ui/use-toast'

interface User {
    id: string
    email: string
    full_name: string | null
    name: string | null
    role: string | null
    is_active: boolean | null
    created_at: Date | null
    hms_user_roles?: Array<{
        id: string
        hms_role: {
            id: string
            name: string
        }
    }>
}

interface UserTableProps {
    users: User[]
    total: number
    pages: number
    currentPage: number
}

export function UserTable({ users, total, pages, currentPage }: UserTableProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (searchQuery) params.set('search', searchQuery)
        if (roleFilter !== 'all') params.set('role', roleFilter)
        if (statusFilter !== 'all') params.set('status', statusFilter)
        router.push(`/settings/users?${params.toString()}`)
    }

    const handleResendInvite = async (userId: string) => {
        const result = await resendInvitation(userId)

        if (result.error) {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive'
            })
        } else {
            const isEmailFailed = result.emailStatus === 'failed'

            toast({
                title: isEmailFailed ? 'Email Delivery Failed' : 'Invitation Sent',
                className: isEmailFailed ? 'bg-amber-50 border-amber-200 text-amber-900 shadow-xl' : '',
                description: (
                    <div className="flex flex-col gap-2 mt-1">
                        <p>{result.message}</p>
                        {result.inviteLink && (
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(result.inviteLink!)
                                    alert("Magic Link copied!")
                                }}
                                className="bg-white/50 border border-slate-200 p-2 rounded-lg text-blue-600 hover:bg-white text-left font-medium text-xs flex items-center gap-1 transition-all"
                            >
                                <Check className="h-3 w-3" />
                                Copy Manual Invite Link
                            </button>
                        )}
                    </div>
                ),
                duration: 15000,
            })
            router.refresh()
        }
    }

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        const result = await updateUserStatus(userId, !currentStatus)
        if (result.error) {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive'
            })
        } else {
            toast({
                title: 'Success',
                description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`
            })
            router.refresh()
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to deactivate this user?')) return

        const result = await deleteUser(userId)
        if (result.error) {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive'
            })
        } else {
            toast({
                title: 'Success',
                description: result.message || 'User deleted successfully'
            })
            router.refresh()
        }
    }

    const getAvatarColor = (email: string) => {
        const colors = [
            'bg-blue-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-red-500',
            'bg-indigo-500',
        ]
        const index = email.charCodeAt(0) % colors.length
        return colors[index]
    }

    const getInitials = (name: string | null, email: string) => {
        if (name) {
            const parts = name.split(' ')
            if (parts.length >= 2) {
                return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            }
            return name.slice(0, 2).toUpperCase()
        }
        return email.slice(0, 2).toUpperCase()
    }

    return (
        <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-10"
                    />
                </div>

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                <Button onClick={handleSearch} variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Filters
                </Button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    System Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    HMS Roles
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full ${getAvatarColor(user.email)} flex items-center justify-center text-white font-semibold text-sm`}>
                                                {getInitials(user.full_name, user.email)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {user.full_name || user.name || 'Unknown'}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize
                      ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}
                                        >
                                            <Shield className="h-3 w-3" />
                                            {user.role || 'User'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {user.hms_user_roles && user.hms_user_roles.length > 0 ? (
                                                user.hms_user_roles.map((ur) => (
                                                    <span
                                                        key={ur.id}
                                                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-100 font-medium"
                                                    >
                                                        {ur.hms_role.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">No HMS roles assigned</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                      ${user.is_active
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'bg-red-100 text-red-700 border border-red-200'
                                            }`}
                                        >
                                            {user.is_active ? (
                                                <><CheckCircle className="h-3 w-3" /> Active</>
                                            ) : (
                                                <><XCircle className="h-3 w-3" /> Inactive</>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {!user.is_active && (
                                                <button
                                                    onClick={() => handleResendInvite(user.id)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Resend Invitation"
                                                >
                                                    <Mail className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => router.push(`/settings/users/${user.id}`)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit user"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(user.id, user.is_active ?? false)}
                                                className={`p-2 rounded-lg transition-colors ${user.is_active
                                                    ? 'text-orange-600 hover:bg-orange-50'
                                                    : 'text-green-600 hover:bg-green-50'
                                                    }`}
                                                title={user.is_active ? 'Deactivate' : 'Activate'}
                                            >
                                                <Power className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete user"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {users.length} of {total} users
                        </div>
                        <div className="flex gap-2">
                            {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => {
                                        const params = new URLSearchParams(window.location.search)
                                        params.set('page', page.toString())
                                        router.push(`/settings/users?${params.toString()}`)
                                    }}
                                    className={`px-3 py-1 rounded ${page === currentPage
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
