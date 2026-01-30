
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, X, Briefcase, FileText, ShieldCheck, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateDesignation, deleteDesignation } from '@/app/actions/settings'
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

export function EditDesignationForm({ designation }: { designation: any }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [formData, setFormData] = useState({
        name: designation?.name || '',
        description: designation?.description || '',
        is_active: designation?.is_active ?? true
    })

    const handleDelete = async () => {
        setDeleting(true)
        const result = await deleteDesignation(designation.id)
        if (result.success) {
            toast.success("Designation deleted successfully")
            router.push('/settings/designations')
            router.refresh()
        } else {
            toast.error(result.error || "Failed to delete")
        }
        setDeleting(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const result = await updateDesignation(designation.id, formData)

        if (result.success) {
            toast.success(`${formData.name} role updated successfully.`)
            router.push('/settings/designations')
            router.refresh()
        } else {
            toast.error(result.error || "Failed to update designation")
        }
        setLoading(false)
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <header className="flex items-center justify-between border-b pb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <X className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Edit Designation</h1>
                        <p className="text-slate-500">Update job role details and status.</p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <div className="h-2 bg-indigo-600 w-full" />
                    <CardHeader className="pt-6">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-indigo-600" />
                                Role Identity
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="is_active" className="text-sm font-medium">Status</Label>
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    {formData.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                        <CardDescription>
                            Edit name and responsibility overview for this role.
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

                <div className="flex items-center justify-between pt-2">
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

                    <div className="flex items-center gap-3">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || deleting || !formData.name} className="bg-indigo-600 hover:bg-indigo-700 font-bold min-w-[140px]">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
