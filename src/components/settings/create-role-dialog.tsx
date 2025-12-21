'use client'

import { useState } from "react"
import { createRole, getAllPermissions } from "@/app/actions/rbac"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function CreateRoleDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingPermissions, setLoadingPermissions] = useState(false)
    const [permissions, setPermissions] = useState<Array<{ code: string; name: string; module: string }>>([])
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
    const [formData, setFormData] = useState({
        key: '',
        name: ''
    })
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

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (newOpen && permissions.length === 0) {
            loadPermissions()
        }
        if (!newOpen) {
            // Reset form
            setFormData({ key: '', name: '' })
            setSelectedPermissions([])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.key || !formData.name) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
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
            const result = await createRole({
                key: formData.key,
                name: formData.name,
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
                    description: "Role created successfully"
                })
                setOpen(false)
                router.refresh()
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create role",
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
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="relative group bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 border-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur" />
                    <Plus className="h-4 w-4 mr-2" />
                    Create Role
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Create New Role
                    </DialogTitle>
                    <DialogDescription>
                        Define a new role with specific permissions for your organization
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <div className="space-y-6 flex-1 overflow-y-auto px-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="key">Role Key *</Label>
                                <Input
                                    id="key"
                                    placeholder="e.g., custom_manager"
                                    value={formData.key}
                                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Unique identifier (lowercase, underscores only)
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Role Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Custom Manager"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Display name for this role
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Permissions *</Label>
                            <p className="text-sm text-muted-foreground mb-2">
                                Select {selectedPermissions.length} permission{selectedPermissions.length !== 1 ? 's' : ''}
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
                                            const someSelected = modulePerms.some(p => selectedPermissions.includes(p))

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
                                                                    id={perm.code}
                                                                    checked={selectedPermissions.includes(perm.code)}
                                                                    onCheckedChange={() => togglePermission(perm.code)}
                                                                />
                                                                <label
                                                                    htmlFor={perm.code}
                                                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Role
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
