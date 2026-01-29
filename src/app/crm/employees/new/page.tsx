
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Save, X, UserPlus, Mail, Phone, Building2, Briefcase, Globe } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import { createEmployee, getEmployeeMasters } from '@/app/actions/crm/employees'

export default function NewEmployeePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [masters, setMasters] = useState<{ designations: any[], branches: any[] }>({ designations: [], branches: [] })
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        designation_id: '',
        branch_id: '',
        status: 'active'
    })

    useEffect(() => {
        async function load() {
            const res = await getEmployeeMasters()
            if (res.success) {
                setMasters({ designations: res.designations || [], branches: res.branches || [] })
            }
        }
        load()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const result = await createEmployee(formData)

        if (result.success) {
            toast({
                title: "Employee added",
                description: `${formData.first_name} has been added to the directory.`,
            })
            router.push('/crm/employees')
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error || "Failed to add employee"
            })
        }
        setLoading(false)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header className="flex items-center justify-between border-b pb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <X className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add New Employee</h1>
                        <p className="text-slate-500">Create a professional profile for your new team member.</p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-slate-200">
                        <CardHeader className="bg-slate-50/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <UserPlus className="h-4 w-4 text-indigo-600" />
                                Personal Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input
                                        id="first_name"
                                        placeholder="John"
                                        value={formData.first_name}
                                        onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        placeholder="Doe"
                                        value={formData.last_name}
                                        onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john.doe@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+1 234 567 890"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                        <CardHeader className="bg-slate-50/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-indigo-600" />
                                Employment Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Designation</Label>
                                    <Select
                                        value={formData.designation_id}
                                        onValueChange={v => setFormData({ ...formData, designation_id: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select designation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masters.designations.map(d => (
                                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Branch / Location</Label>
                                    <Select
                                        value={formData.branch_id}
                                        onValueChange={v => setFormData({ ...formData, branch_id: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select branch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masters.branches.map(b => (
                                                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <UserPlus className="h-24 w-24" />
                        </div>
                        <h4 className="text-lg font-bold mb-4">Quick Summary</h4>
                        <div className="space-y-4 text-sm relative z-10">
                            <div className="flex justify-between items-center border-b border-white/20 pb-2">
                                <span>Name:</span>
                                <span className="font-bold">{formData.first_name || '...'} {formData.last_name}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/20 pb-2">
                                <span>Status:</span>
                                <Badge className="bg-white/20 border-0 text-white font-bold">{formData.status.toUpperCase()}</Badge>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            form="employee-form"
                            className="w-full mt-8 bg-white text-indigo-600 hover:bg-slate-50 font-bold"
                            disabled={loading || !formData.first_name}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Complete Onboarding"}
                        </Button>
                    </div>

                    <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-500 leading-relaxed">
                        <Globe className="h-4 w-4 mb-2 text-slate-400" />
                        <strong>Onboarding Note:</strong> Adding an employee does not automatically create a system user account. To grant system access, please go to <strong>Settings &gt; Users</strong> after onboarding.
                    </div>
                </div>
            </form>
            <form id="employee-form" onSubmit={handleSubmit} className="hidden" />
        </div>
    )
}
