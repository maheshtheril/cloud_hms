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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

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
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        // Auto-generate key: lowercase, underscores, alphanumeric only
                                        const key = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                                        setFormData({ name, key });
                                    }}
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
                                <ScrollArea className="h-[400px] border rounded-lg p-4 border-slate-700 bg-slate-900/50">
                                    <Accordion type="multiple" className="w-full">
                                        {Object.entries(permissionsByModule).map(([module, perms]) => {
                                            const modulePerms = perms.map(p => p.code)
                                            const allSelected = modulePerms.every(p => selectedPermissions.includes(p))
                                            const someSelected = modulePerms.some(p => selectedPermissions.includes(p))

                                            return (
                                                <AccordionItem key={module} value={module} className="border-b border-slate-700 last:border-0">
                                                    <AccordionTrigger className="hover:no-underline py-3 px-2 hover:bg-slate-800/50 rounded-lg transition-colors">
                                                        <div className="flex items-center gap-3 w-full">
                                                            <span className="font-medium text-sm capitalize">{module}</span>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-600">
                                                                    {perms.length}
                                                                </Badge>
                                                                {allSelected && (
                                                                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">All Selected</Badge>
                                                                )}
                                                                {someSelected && !allSelected && (
                                                                    <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">Some Selected</Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pt-2 px-2 pb-4">
                                                        <div className="flex justify-end mb-3 border-b border-slate-800 pb-2">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    selectAllInModule(module);
                                                                }}
                                                                className="text-xs h-7 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                                                            >
                                                                {allSelected ? 'Deselect All' : 'Select All in ' + module}
                                                            </Button>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {perms.map((perm) => (
                                                                <div
                                                                    key={perm.code}
                                                                    className="flex items-start space-x-3 p-2 rounded-md hover:bg-slate-800/50 cursor-pointer transition-colors"
                                                                    onClick={() => togglePermission(perm.code)}
                                                                >
                                                                    <Checkbox
                                                                        id={perm.code}
                                                                        checked={selectedPermissions.includes(perm.code)}
                                                                        onCheckedChange={() => togglePermission(perm.code)}
                                                                        className="mt-0.5 border-slate-500 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                                                                    />
                                                                    <div className="grid gap-0.5">
                                                                        <label
                                                                            htmlFor={perm.code}
                                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-slate-200"
                                                                        >
                                                                            {perm.name}
                                                                        </label>
                                                                        <p className="text-[10px] text-slate-500 font-mono">{perm.code}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )
                                        })}
                                    </Accordion>
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
