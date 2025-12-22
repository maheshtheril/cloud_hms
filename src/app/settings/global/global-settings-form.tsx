'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateGlobalSettings } from '@/app/actions/settings'
import { Loader2, Save, Building2, Coins } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface Props {
    company: any
    currencies: any[]
}

export function GlobalSettingsForm({ company, currencies }: Props) {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(company.name)
    const [industry, setIndustry] = useState(company.industry || '')
    const [currencyId, setCurrencyId] = useState(company.company_settings?.currency_id || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const result = await updateGlobalSettings({
            companyId: company.id,
            name,
            industry,
            currencyId
        })

        if (result.success) {
            toast({
                title: "Settings saved",
                description: "Your organization profile has been updated.",
            })
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error || "Failed to update settings"
            })
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                        Company Details
                    </CardTitle>
                    <CardDescription>
                        Manage your company profile and primary operational settings.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            placeholder="e.g. Acme Corp"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Industry</Label>
                        <Input
                            value={industry}
                            onChange={e => setIndustry(e.target.value)}
                            placeholder="e.g. Healthcare, Technology"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Coins className="h-5 w-5 text-indigo-600" />
                        Financial Settings
                    </CardTitle>
                    <CardDescription>
                        Set your default reporting currency. This will be used for dashboards and reports.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Default Currency</Label>
                        <Select value={currencyId} onValueChange={setCurrencyId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((c: any) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.code} - {c.name} ({c.symbol})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                            Note: Changing currency may affect how historical data is displayed in reports.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto min-w-[150px]">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
