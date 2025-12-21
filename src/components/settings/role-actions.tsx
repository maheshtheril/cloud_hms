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
import { Loader2, Pencil, Trash2 } from "lucide-react"
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
    const [permissions, setPermissions] = useState<any[]>([])
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(role.permissions)
    const [name, setName] = useState(role.name)
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
                <DialogContent className="max-w-3xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Edit Role: {role.key}</DialogTitle>
                        <DialogDescription>
                            Update the role name and permissions
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEdit}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Role Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Permissions *</Label>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Selected {selectedPermissions.length} permission{selectedPermissions.length !== 1 ? 's' : ''}
                                </p>

                                {loadingPermissions ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                ) : (
                                    <ScrollArea className="h-[400px] border rounded-lg p-4">
                                        <div className="space-y-6">
                                            {Object.entries(permissionsByModule).map(([module, perms]) => {
                                                const modulePerms = perms.map(p => p.code)
                                                const allSelected = modulePerms.every(p => selectedPermissions.includes(p))

                                                return (
                                                    <div key={module} className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                                                {module}
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {perms.length}
                                                                </Badge>
                                                            </h4>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => selectAllInModule(module)}
                                                            >
                                                                {allSelected ? 'Deselect All' : 'Select All'}
                                                            </Button>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 pl-4">
                                                            {perms.map((perm) => (
                                                                <div key={perm.code} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`edit-${perm.code}`}
                                                                        checked={selectedPermissions.includes(perm.code)}
                                                                        onCheckedChange={() => togglePermission(perm.code)}
                                                                    />
                                                                    <label
                                                                        htmlFor={`edit-${perm.code}`}
                                                                        className="text-sm leading-none cursor-pointer"
                                                                    >
                                                                        {perm.name}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            })}
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
