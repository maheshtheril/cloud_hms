'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getHMSRoles } from '@/app/actions/user'
import Link from 'next/link'
import { UserPlus, Mail, Shield, User, Loader2, Check } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { SearchableSelect } from '@/components/ui/searchable-select'

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
    const [currentRoles, setCurrentRoles] = useState<any[]>([])

    useEffect(() => {
        if (open) {
            const fetchRoles = async () => {
                try {
                    const roles = await getHMSRoles()
                    console.log("Fetched Roles:", roles)
                    setCurrentRoles(roles as any[])

                    if (roles.length === 0) {
                        // toast({ title: "Debug", description: "0 Roles returned." })
                    }
                } catch (e) {
                    console.error(e)
                    toast({ variant: "destructive", title: "Debug Error", description: "Failed to fetch roles" })
                }
            }
            fetchRoles()
        }
    }, [open])

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
            roleId: formData.roleId === 'no-role' ? undefined : formData.roleId,
        })

        setLoading(false)

        if (result.error) {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive'
            })
        } else {
            setOpen(false)
            setFormData({ email: '', fullName: '', systemRole: 'user', roleId: 'no-role' })
            router.refresh()

            if (result.inviteLink) {
                toast({
                    title: 'User Invited',
                    description: (
                        <div className="flex flex-col gap-2 mt-1">
                            <p>User created successfully.</p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(result.inviteLink!)
                                    // Alert or secondary toast
                                    alert("Link copied to clipboard!")
                                }}
                                className="text-blue-600 hover:underline text-left font-medium text-xs flex items-center gap-1"
                            >
                                <Check className="h-3 w-3" />
                                Click here to copy Invite Link
                            </button>
                        </div>
                    ),
                    duration: 10000,
                })
            } else {
                toast({
                    title: 'Success',
                    description: result.message || 'User invited successfully'
                })
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            Invite New User
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400">
                            Send an invitation email to add a new user to your organization. They will receive a magic link to join.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-6">
                        {/* Email & Name Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Mail className="h-3.5 w-3.5" />
                                    Email Address *
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="user@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <User className="h-3.5 w-3.5" />
                                    Full Name
                                </Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="h-10"
                                />
                            </div>
                        </div>

                        {/* System Role Selection */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Shield className="h-3.5 w-3.5" />
                                System Access Level *
                            </Label>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Standard User Option */}
                                <div
                                    className={cn(
                                        "relative flex flex-col gap-2 p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:border-blue-400/50",
                                        formData.systemRole === 'user'
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 ring-1 ring-blue-500"
                                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900"
                                    )}
                                    onClick={() => setFormData({ ...formData, systemRole: 'user' })}
                                >
                                    <div className="flex items-center gap-2">
                                        <User className={cn("h-4 w-4", formData.systemRole === 'user' ? "text-blue-600" : "text-slate-500")} />
                                        <span className={cn("font-semibold text-sm", formData.systemRole === 'user' ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300")}>Standard User</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Limited access. Can only access features granted by specific roles below.
                                    </p>
                                    {formData.systemRole === 'user' && (
                                        <div className="absolute top-3 right-3 text-blue-600"><Check size={16} /></div>
                                    )}
                                </div>

                                {/* Admin Option */}
                                <div
                                    className={cn(
                                        "relative flex flex-col gap-2 p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:border-purple-400/50",
                                        formData.systemRole === 'admin'
                                            ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20 ring-1 ring-purple-500"
                                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900"
                                    )}
                                    onClick={() => setFormData({ ...formData, systemRole: 'admin' })}
                                >
                                    <div className="flex items-center gap-2">
                                        <Shield className={cn("h-4 w-4", formData.systemRole === 'admin' ? "text-purple-600" : "text-slate-500")} />
                                        <span className={cn("font-semibold text-sm", formData.systemRole === 'admin' ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-300")}>Administrator</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Full access to all modules, settings, data, and user management.
                                    </p>
                                    {formData.systemRole === 'admin' && (
                                        <div className="absolute top-3 right-3 text-purple-600"><Check size={16} /></div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* HMS Role (Optional) - Only show if not Admin (Admin implies all access usually, but maybe they want roles too?)
                             Actually, RBAC usually requires roles even for Admins if granularity exists, OR Admin overrides everything.
                             User prompt: "Tenant User has selected only CRM".
                             If System Role = User, they NEED a role to see anything.
                        */}
                        {currentRoles.length > 0 && formData.systemRole === 'user' && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Assign Primary Role (Optional)
                                    </Label>
                                    <Link href="/settings/roles" target="_blank" className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium">
                                        + Create New Role
                                    </Link>
                                </div>
                                <SearchableSelect
                                    value={formData.roleId || null}
                                    placeholder="Search for a role..."
                                    defaultOptions={[
                                        { id: 'no-role', label: 'No specific role (User will have no permissions)' },
                                        ...currentRoles.map(r => ({ id: r.id, label: r.name, subLabel: r.description || undefined }))
                                    ]}
                                    onSearch={async (query) => {
                                        const lowerQ = query.toLowerCase()
                                        const matches = currentRoles
                                            .filter(r => r.name.toLowerCase().includes(lowerQ))
                                            .map(r => ({ id: r.id, label: r.name, subLabel: r.description || undefined }))

                                        const noRole = { id: 'no-role', label: 'No specific role (User will have no permissions)' }
                                        if ('no specific role'.includes(lowerQ) || query === '') {
                                            return [noRole, ...matches]
                                        }
                                        return matches
                                    }}
                                    onChange={(val) => setFormData({ ...formData, roleId: val || '' })}
                                />
                                <p className="text-[11px] text-slate-500">
                                    You can assign multiple roles later in the user profile.
                                </p>
                            </div>
                        )}

                        {formData.systemRole === 'admin' && (
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-lg flex items-start gap-3">
                                <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-purple-900 dark:text-purple-300">Admin Privileges granted</p>
                                    <p className="text-purple-700 dark:text-purple-400 text-xs mt-1">This user will have full control over the system configuration and data.</p>
                                </div>
                            </div>
                        )}

                    </div>

                    <DialogFooter className="bg-slate-50 dark:bg-slate-800/50 -mx-6 -mb-6 p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 rounded-b-lg">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                            className="bg-white dark:bg-slate-900"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Invite
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
