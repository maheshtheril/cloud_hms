
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, X, Users, Mail, Phone, Briefcase, Building2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateEmployee, deleteEmployee } from '@/app/actions/crm/employees'
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

interface EditEmployeeFormProps {
    employee: any;
    designations: any[];
    branches: any[];
    departments: any[];
    supervisors: any[];
}

export function EditEmployeeForm({ employee, designations, branches, departments, supervisors }: EditEmployeeFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [formData, setFormData] = useState({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        designation_id: employee.designation_id || 'none',
        department_id: employee.department_id || 'none',
        supervisor_id: employee.supervisor_id || 'none',
        branch_id: employee.branch_id || 'none',
        office: employee.office || '',
        category: employee.category || '',
        status: employee.status || 'active'
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const payload = {
            const payload = {
                ...formData,
                designation_id: formData.designation_id === 'none' ? null : formData.designation_id,
                department_id: formData.department_id === 'none' ? null : formData.department_id,
                supervisor_id: formData.supervisor_id === 'none' ? null : formData.supervisor_id,
                branch_id: formData.branch_id === 'none' ? null : formData.branch_id,
            }
        }

        const result = await updateEmployee(employee.id, payload)

        if (result.success) {
            toast.success("Employee updated successfully")
            router.push(`/crm/employees/${employee.id}`)
            router.refresh()
        } else {
            toast.error(result.error || "Failed to update employee")
        }
        setLoading(false)
    }

    const handleDelete = async () => {
        setDeleting(true)
        const result = await deleteEmployee(employee.id)
        if (result.success) {
            toast.success("Employee deleted successfully")
            router.push('/crm/employees')
            router.refresh()
        } else {
            toast.error(result.error || "Failed to delete employee")
        }
        setDeleting(false)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <header className="flex items-center justify-between border-b pb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <X className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Edit Employee Profile</h1>
                        <p className="text-slate-500">Update personal and professional details for {employee.first_name}.</p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden md:col-span-2">
                        <div className="h-1.5 bg-indigo-600 w-full" />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                                <Users className="h-4 w-4 text-indigo-600" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5" /> Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5" /> Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Employment Details */}
                    <Card className="border-slate-200 shadow-sm md:col-span-2">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                                <Briefcase className="h-4 w-4 text-indigo-600" />
                                Employment & Hierarchy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Designation</Label>
                                    <Select
                                        value={formData.designation_id}
                                        onValueChange={val => setFormData({ ...formData, designation_id: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None / Unassigned</SelectItem>
                                            {designations.map(d => (
                                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Department</Label>
                                    <Select
                                        value={formData.department_id}
                                        onValueChange={val => setFormData({ ...formData, department_id: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None / Unassigned</SelectItem>
                                            {departments.map(d => (
                                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Direct Supervisor</Label>
                                    <Select
                                        value={formData.supervisor_id}
                                        onValueChange={val => setFormData({ ...formData, supervisor_id: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select supervisor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Supervisor</SelectItem>
                                            {supervisors.filter(s => s.id !== employee.id).map(s => (
                                                <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Assigned Branch</Label>
                                    <Select
                                        value={formData.branch_id}
                                        onValueChange={val => setFormData({ ...formData, branch_id: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Global / All Branches</SelectItem>
                                            {branches.map(b => (
                                                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        placeholder="e.g. Developer, Marketing"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="office">Office / Cabin</Label>
                                    <Input
                                        id="office"
                                        placeholder="Room 101"
                                        value={formData.office}
                                        onChange={e => setFormData({ ...formData, office: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={val => setFormData({ ...formData, status: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 group">
                                <Trash2 className="h-4 w-4 mr-2 text-red-300 group-hover:text-red-500" />
                                Delete Employee
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-slate-900 dark:text-white">Delete employee record?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently remove <strong>{formData.first_name} {formData.last_name}</strong> from the directory.
                                    This action cannot be undone. Background portal access will also be revoked.
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
                        <Button type="submit" disabled={loading || deleting || !formData.first_name} className="bg-indigo-600 hover:bg-indigo-700 font-bold min-w-[160px]">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Update Employee
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
