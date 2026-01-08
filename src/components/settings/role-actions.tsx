'use client'

import { useState, useEffect } from "react"
import { updateRole, deleteRole, getAllPermissions } from "@/app/actions/rbac"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Pencil, Trash2, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

interface RoleActionsProps {
    role: {
        id: string
        key: string
        name: string
        permissions: string[]
    }
}

export function RoleActions({ role }: RoleActionsProps) {
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingPermissions, setLoadingPermissions] = useState(false)
    const [permissions, setPermissions] = useState<Array<{ code: string; name: string; module: string }>>([])
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(role.permissions || [])
    const [name, setName] = useState(role.name || '')
    const [searchQuery, setSearchQuery] = useState("")
    const { toast } = useToast()
    const router = useRouter()

    const loadPermissions = async () => {
        setLoadingPermissions(true)
        const result = await getAllPermissions()
        if ('data' in result) {
            setPermissions(result.data || [])
        }
        setLoadingPermissions(false)
    }

    useEffect(() => {
        if (editOpen && permissions.length === 0) {
            loadPermissions()
        }
    }, [editOpen])

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name) {
            toast({
                title: "Validation Error",
                description: "Please enter a role name",
                variant: "destructive"
            })
            return
        }

        if (selectedPermissions.length === 0) {
            toast({
                title: "Validation Error",
                description: "Please select at least one permission",
                variant: "destructive"
            })
            return
        }

        setLoading(true)
        try {
            const result = await updateRole(role.id, {
                name,
                permissions: selectedPermissions
            })

            if ('error' in result) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Success",
                    description: "Role updated successfully"
                })
                setEditOpen(false)
                router.refresh()
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update role",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            const result = await deleteRole(role.id)

            if ('error' in result) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Success",
                    description: "Role deleted successfully"
                })
                setDeleteOpen(false)
                router.refresh()
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete role",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const togglePermission = (permCode: string) => {
        setSelectedPermissions(prev =>
            prev.includes(permCode)
                ? prev.filter(p => p !== permCode)
                : [...prev, permCode]
        )
    }

    const selectAllInModule = (module: string) => {
        const modulePerm = permissions.filter(p => p.module === module).map(p => p.code)
        const allSelected = modulePerm.every(p => selectedPermissions.includes(p))

        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(p => !modulePerm.includes(p)))
        } else {
            setSelectedPermissions(prev => [...new Set([...prev, ...modulePerm])])
        }
    }

    // Group permissions by module
    const permissionsByModule = permissions.reduce((acc, perm) => {
        if (!acc[perm.module]) {
            acc[perm.module] = []
        }
        acc[perm.module].push(perm)
        return acc
    }, {} as Record<string, typeof permissions>)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-red-600"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Role
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900">
                    <DialogHeader>
                        <DialogTitle>Edit Role: {role.key}</DialogTitle>
                        <DialogDescription>
                            Update the role name and permissions
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEdit} className="flex flex-col flex-1 min-h-0">
                        <div className="space-y-6 flex-1 overflow-y-auto px-1">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Role Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                <Label>Permissions Configuration</Label>

                                {/* Search & Stats Bar */}
                                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input
                                            placeholder="Search permissions..."
                                            className="pl-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <Badge variant="outline" className="h-9 px-3 flex items-center justify-center border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                                        {selectedPermissions.length} selected
                                    </Badge>
                                </div>

                                {loadingPermissions ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <ScrollArea className="h-[500px] border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 p-4">
                                        <div className="space-y-6">
                                            {Object.entries(permissionsByModule).map(([module, perms]) => {
                                                // Filter logic
                                                const visiblePerms = perms.filter(p =>
                                                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    p.code.toLowerCase().includes(searchQuery.toLowerCase())
                                                );

                                                if (visiblePerms.length === 0) return null;

                                                const modulePerms = visiblePerms.map(p => p.code);
                                                const allSelected = modulePerms.every(p => selectedPermissions.includes(p));
                                                const someSelected = modulePerms.some(p => selectedPermissions.includes(p));

                                                return (
                                                    <div key={module} className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                                        <div className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                                            <div className="flex items-center gap-3">
                                                                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                                                                    {module}
                                                                </h4>
                                                                <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px]">
                                                                    {visiblePerms.length}
                                                                </Badge>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 text-xs hover:bg-slate-200 dark:hover:bg-slate-800"
                                                                onClick={() => selectAllInModule(module)}
                                                            >
                                                                {allSelected ? 'Deselect All' : 'Select All'}
                                                            </Button>
                                                        </div>
                                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                                                            {visiblePerms.map((perm) => (
                                                                <div
                                                                    key={perm.code}
                                                                    className="flex items-start space-x-3 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer group"
                                                                    onClick={() => togglePermission(perm.code)}
                                                                >
                                                                    <Checkbox
                                                                        id={`edit-${perm.code}`}
                                                                        checked={selectedPermissions.includes(perm.code)}
                                                                        onCheckedChange={() => togglePermission(perm.code)}
                                                                        className="mt-0.5"
                                                                    />
                                                                    <div className="space-y-1 leading-none">
                                                                        <label
                                                                            htmlFor={`edit-${perm.code}`}
                                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
                                                                        >
                                                                            {perm.name}
                                                                        </label>
                                                                        {/* Optional description if available */}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            {permissions.length > 0 && Object.keys(permissionsByModule).length === 0 && (
                                                <div className="text-center py-10 text-slate-500">
                                                    No permissions found matching "{searchQuery}"
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditOpen(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Role?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the role <strong>{role.name}</strong>?
                            This action cannot be undone. Users assigned to this role will lose their permissions.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Role'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
