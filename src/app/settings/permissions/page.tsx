
'use client'

import { useState, useEffect } from "react"
import { getAllPermissions } from "@/app/actions/rbac"
import { createPermission, deletePermission } from "@/app/actions/permissions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2, Shield, Key } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const STANDARD_MODULES = [
    { value: 'crm', label: 'CRM (Sales & Customers)' },
    { value: 'hms', label: 'HMS (Hospital Operations)' },
    { value: 'finance', label: 'Finance & Billing' },
    { value: 'inventory', label: 'Inventory Management' },
    { value: 'hr', label: 'HR & Payroll' },
    { value: 'reporting', label: 'Reporting & Analytics' },
    { value: 'system', label: 'System Configuration' },
    { value: 'custom', label: 'Custom / Other' }
];

export default function PermissionsPage() {
    const [permissions, setPermissions] = useState<Array<{ code: string; name: string; module: string }>>([])
    const [loading, setLoading] = useState(true)
    const [createOpen, setCreateOpen] = useState(false)
    const [newPermission, setNewPermission] = useState({ code: '', name: '', module: 'Custom' })
    const [submitting, setSubmitting] = useState(false)
    const { toast } = useToast()

    const loadPermissions = async () => {
        setLoading(true)
        const result = await getAllPermissions()
        if (result.success && result.data) {
            setPermissions(result.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadPermissions()
    }, [])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Auto-format code if empty or doesn't match convention? No, let user type.
            const result = await createPermission({
                code: newPermission.code,
                name: newPermission.name,
                category: newPermission.module
            });

            if (result.error) {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Permission created successfully" });
                setCreateOpen(false);
                setNewPermission({ code: '', name: '', module: 'Custom' });
                loadPermissions();
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to create permission", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    }

    const handleDelete = async (code: string) => {
        if (!confirm(`Are you sure you want to delete permission '${code}'?`)) return;

        const result = await deletePermission(code);
        if (result.error) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Permission deleted" });
            loadPermissions();
        }
    }

    const groupedPermissions = permissions.reduce((acc, p) => {
        if (!acc[p.module]) acc[p.module] = [];
        acc[p.module].push(p);
        return acc;
    }, {} as Record<string, typeof permissions>);

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Key className="h-8 w-8" />
                        Permissions Registry
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Define system capabilities dynamically (Major ERP Style)
                    </p>
                </div>

                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Permission
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-slate-900">
                        <DialogHeader>
                            <DialogTitle>Create New Permission</DialogTitle>
                            <DialogDescription>
                                Add a new capability to the system. Developers must implement checks for this code.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Permission Code *</Label>
                                <Input
                                    placeholder="e.g. reports:leads:view"
                                    value={newPermission.code}
                                    onChange={e => setNewPermission({ ...newPermission, code: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-slate-500">Unique identifier used in code (module:feature:action)</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Display Name *</Label>
                                <Input
                                    placeholder="e.g. View Leads Report"
                                    value={newPermission.name}
                                    onChange={e => setNewPermission({ ...newPermission, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Module Category</Label>
                                <Select
                                    value={newPermission.module}
                                    onValueChange={(val) => setNewPermission({ ...newPermission, module: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Module" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STANDARD_MODULES.map(mod => (
                                            <SelectItem key={mod.value} value={mod.value}>
                                                {mod.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? "Creating..." : "Create Permission"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8" /></div>
            ) : (
                <div className="grid gap-6">
                    {Object.entries(groupedPermissions).map(([module, perms]) => (
                        <Card key={module} className="overflow-hidden">
                            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-900 dark:text-white">{module}</h3>
                                <Badge variant="secondary">{perms.length}</Badge>
                            </div>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {perms.map(p => (
                                        <div key={p.code} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                                                    <Shield className="h-4 w-4 text-slate-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
                                                    <code className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                                        {p.code}
                                                    </code>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(p.code)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
