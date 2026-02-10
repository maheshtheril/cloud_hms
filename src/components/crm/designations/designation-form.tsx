'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, X, Briefcase, Network, Trash2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { createDesignation, updateDesignation, deleteDesignation } from '@/app/actions/settings'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DesignationFormProps {
    initialData?: {
        id?: string;
        name: string;
        description: string;
        department_id: string | null;
        parent_id: string | null;
        is_active: boolean;
    };
    departments: { id: string, name: string }[];
    designations: { id: string, name: string }[];
}

export function DesignationForm({ initialData, departments, designations }: DesignationFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        department_id: initialData?.department_id || 'none',
        parent_id: initialData?.parent_id || 'none',
        is_active: initialData?.is_active ?? true,
    })

    const handleDelete = async () => {
        if (!initialData?.id) return
        setDeleting(true)
        const result = await deleteDesignation(initialData.id)
        if (result.success) {
            toast({ title: "Success", description: "Designation deleted successfully" })
            router.push('/settings/designations')
            router.refresh()
        } else {
            toast({ variant: "destructive", title: "Error", description: result.error || "Failed to delete" })
        }
        setDeleting(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const payload = {
            ...formData,
            department_id: formData.department_id === 'none' ? null : formData.department_id,
            parent_id: formData.parent_id === 'none' ? null : formData.parent_id,
        }

        const result = initialData?.id
            ? await updateDesignation(initialData.id, payload as any)
            : await createDesignation(payload as any)

        if (result.success) {
            toast({
                title: initialData?.id ? "Designation updated" : "Designation created",
                description: `${formData.name} role has been saved.`,
            })
            router.push('/settings/designations')
            router.refresh()
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error || "Failed to save designation"
            })
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <div className="h-2 bg-indigo-600 w-full" />
                <CardHeader className="pt-6">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-indigo-600" />
                            Role Identity
                        </CardTitle>
                        {initialData?.id && (
                            <div className="flex items-center gap-2">
                                <Label htmlFor="is_active" className="text-sm font-medium">Status</Label>
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {formData.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        )}
                    </div>
                    <CardDescription>
                        Provide a clear name and responsibility overview for this role.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Designation Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Senior Sales Representative"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Job Description / Responsibilities</Label>
                        <Textarea
                            id="description"
                            placeholder="Briefly describe what this person does..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Network className="h-4 w-4 text-indigo-600" />
                        Organizational Hierarchy
                    </CardTitle>
                    <CardDescription>
                        Place this role within your department structure and reporting lines.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Department Assignment</Label>
                        <Select
                            value={formData.department_id}
                            onValueChange={val => setFormData({ ...formData, department_id: val })}
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Global / Not Department Specific</SelectItem>
                                {departments.map(dept => (
                                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Linking this allows better filtering in HR directory.</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Reporting Level (Parent Role)</Label>
                        <Select
                            value={formData.parent_id}
                            onValueChange={val => setFormData({ ...formData, parent_id: val })}
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select Parent Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Root Level (Top Level Role)</SelectItem>
                                {designations.filter(d => d.id !== initialData?.id).map(desig => (
                                    <SelectItem key={desig.id} value={desig.id}>{desig.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Used to generate the organizational hierarchy chart.</p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between pt-2">
                <div>
                    {initialData?.id && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 group">
                                    <Trash2 className="h-4 w-4 mr-2 text-red-300 group-hover:text-red-500" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete the <strong>{formData.name}</strong> designation.
                                        This action cannot be undone and may fail if employees are still assigned to this role.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                        {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Permanently"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading || deleting || !formData.name} className="bg-indigo-600 hover:bg-indigo-700 font-bold min-w-[140px]">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        {initialData?.id ? 'Update Role' : 'Save Role'}
                    </Button>
                </div>
            </div>
        </form>
    )
}
