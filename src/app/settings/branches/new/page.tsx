
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Save, X, Building2, MapPin, Phone, Hash, Tag } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'
// Using a generic action for now since we need to create the action file
import { createBranch } from '@/app/actions/settings'

export default function NewBranchPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: 'clinic',
        phone: '',
        email: '',
        address: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const result = await createBranch(formData)

        if (result.success) {
            toast({
                title: "Branch created",
                description: `${formData.name} has been successfully added to your organization.`,
            })
            router.push('/settings/branches')
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error || "Failed to create branch"
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
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">New Branch</h1>
                        <p className="text-slate-500">Add a new physical location to your company profile.</p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-slate-200">
                        <CardHeader className="bg-slate-50/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-indigo-600" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Branch Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Downtown Office"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Short Code</Label>
                                    <Input
                                        id="code"
                                        placeholder="e.g. DWTN"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Location Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={v => setFormData({ ...formData, type: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="clinic">Clinic / Retail</SelectItem>
                                            <SelectItem value="office">Office / Corporate</SelectItem>
                                            <SelectItem value="warehouse">Warehouse / Lab</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card border-slate-200>
                        <CardHeader className="bg-slate-50/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-indigo-600" />
                                Location & Contact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Physical Address</Label>
                                <Input
                                    id="address"
                                    placeholder="Full street address, City, Country"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Contact Phone</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+1 234 567 890"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Public Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="branch@company.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-indigo-600 text-white border-0 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Building2 className="h-32 w-32" />
                        </div>
                        <CardHeader>
                            <CardTitle>Branch Preview</CardTitle>
                            <CardDescription className="text-indigo-100">See how this branch will appear to users.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                                <h4 className="font-bold text-lg">{formData.name || 'Branch Name'}</h4>
                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 mt-1">{formData.code || 'CODE'}</Badge>
                                <p className="text-xs text-indigo-100 mt-4 line-clamp-2">{formData.address || 'Address will appear here'}</p>
                            </div>
                            <Button
                                type="submit"
                                form="branch-form"
                                className="w-full bg-white text-indigo-600 hover:bg-slate-50 font-bold"
                                disabled={loading || !formData.name || !formData.code}
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm & Save"}
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="text-xs text-slate-500 bg-slate-100 p-4 rounded-lg flex gap-3">
                        <Tag className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                            <strong>Branch Management:</strong> You can assign specific groups of users to manage certain branches exclusively from the Roles section.
                        </div>
                    </div>
                </div>
            </form>
            <form id="branch-form" onSubmit={handleSubmit} className="hidden" />
        </div>
    )
}
