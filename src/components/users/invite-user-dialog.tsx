'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, Mail, Shield, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { inviteUser } from '@/app/actions/users'
import { useToast } from '@/components/ui/use-toast'

interface InviteUserDialogProps {
    roles?: Array<{
        id: string
        name: string
        description?: string | null
    }>
}

export function InviteUserDialog({ roles = [] }: InviteUserDialogProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        systemRole: 'user' as 'admin' | 'user',
        roleId: '',
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const result = await inviteUser({
            email: formData.email,
            fullName: formData.fullName,
            systemRole: formData.systemRole,
            roleId: formData.roleId || undefined,
        })

        setLoading(false)

        if (result.error) {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive'
            })
        } else {
            toast({
                title: 'Success',
                description: result.message || 'User invited successfully'
            })
            setOpen(false)
            setFormData({ email: '', fullName: '', systemRole: 'user', roleId: '' })
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <UserPlus className="h-5 w-5 text-blue-600" />
                            </div>
                            Invite New User
                        </DialogTitle>
                        <DialogDescription>
                            Send an invitation email to add a new user to your organization
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                Email Address *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full"
                            />
                            <p className="text-xs text-gray-500">
                                The user will receive an invitation email to set up their account
                            </p>
                        </div>

                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                Full Name
                            </Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full"
                            />
                        </div>

                        {/* System Role */}
                        <div className="space-y-2">
                            <Label htmlFor="systemRole" className="text-sm font-medium flex items-center gap-2">
                                <Shield className="h-4 w-4 text-gray-500" />
                                System Role *
                            </Label>
                            <select
                                id="systemRole"
                                value={formData.systemRole}
                                onChange={(e) => setFormData({ ...formData, systemRole: e.target.value as 'admin' | 'user' })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="text-xs text-gray-500 space-y-1">
                                <div><strong>Admin:</strong> Full access to all system features</div>
                                <div><strong>User:</strong> Limited access based on assigned HMS roles</div>
                            </div>
                        </div>

                        {/* HMS Role (Optional) */}
                        {roles.length > 0 && (
                            <div className="space-y-2">
                                <Label htmlFor="roleId" className="text-sm font-medium">
                                    HMS Role (Optional)
                                </Label>
                                <select
                                    id="roleId"
                                    value={formData.roleId}
                                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">No HMS role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500">
                                    You can assign additional HMS roles later from the user's profile
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Sending Invitation...
                                </>
                            ) : (
                                <>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Invitation
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
