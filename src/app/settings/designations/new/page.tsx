
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, X, Briefcase, FileText, ShieldCheck } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { createDesignation } from '@/app/actions/settings'

export default function NewDesignationPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const result = await createDesignation(formData)

        if (result.success) {
            toast({
                title: "Designation created",
                description: `${formData.name} role has been added.`,
            })
            router.push('/settings/designations')
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error || "Failed to create designation"
            })
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
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">New Designation</h1>
                        <p className="text-slate-500">Define a new job role or title for your CRM agents.</p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <div className="h-2 bg-indigo-600 w-full" />
                    <CardHeader className="pt-6">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-indigo-600" />
                            Role Identity
                        </CardTitle>
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

                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading || !formData.name} className="bg-indigo-600 hover:bg-indigo-700 font-bold min-w-[140px]">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Role
                    </Button>
                </div>
            </form>
        </div>
    )
}
