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
import { FileUpload } from '@/components/ui/file-upload'

interface Props {
    company: any
    currencies: any[]
}

export function GlobalSettingsForm({ company, currencies }: Props) {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(company.name)
    const [industry, setIndustry] = useState(company.industry || '')
    const [logoUrl, setLogoUrl] = useState(company.logo_url || '')
    const [currencyId, setCurrencyId] = useState(company.company_settings?.currency_id || '')
    const [invoicePrefix, setInvoicePrefix] = useState(company.company_settings?.numbering_prefix || 'INV')

    // Contact Info (stored in metadata)
    const meta = (company.metadata as any) || {}
    const [address, setAddress] = useState(meta.address || '')
    const [phone, setPhone] = useState(meta.phone || '')
    const [email, setEmail] = useState(meta.email || '')
    const [gstin, setGstin] = useState(meta.gstin || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const result = await updateGlobalSettings({
            companyId: company.id,
            name,
            industry,
            logoUrl,
            currencyId,
            address,
            phone,
            email,
            gstin,
            invoicePrefix
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
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Label>Company Logo</Label>
                        <div className="flex flex-col gap-4">
                            {/* Integration with FileUpload component */}
                            <FileUpload
                                label="Upload Company Logo"
                                folder="logos"
                                accept="image/*"
                                currentFileUrl={logoUrl}
                                onUploadComplete={(url) => setLogoUrl(url)}
                            />
                            {/* Fallback URL input if they really want to paste one */}
                            {!logoUrl && (
                                <div className="flex items-center gap-2">
                                    <div className="h-px flex-1 bg-border" />
                                    <span className="text-xs text-muted-foreground">OR enter URL manually</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>
                            )}
                            {!logoUrl && (
                                <Input
                                    placeholder="https://..."
                                    value={logoUrl}
                                    onChange={e => setLogoUrl(e.target.value)}
                                    className="text-sm"
                                />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <Select value={industry} onValueChange={setIndustry}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                    <SelectItem value="Technology">Technology</SelectItem>
                                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                    <SelectItem value="Retail">Retail</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                    <SelectItem value="Education">Education</SelectItem>
                                    <SelectItem value="Construction">Construction</SelectItem>
                                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                                    <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Official Address</Label>
                        <Input
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="Full address for invoicing"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Official Phone</Label>
                            <Input
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="+91 ..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Official Email</Label>
                            <Input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="billing@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Detailed Tax ID / GSTIN</Label>
                        <Input
                            value={gstin}
                            onChange={e => setGstin(e.target.value)}
                            placeholder="e.g. 29AAAAA0000A1Z5"
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

                    <div className="space-y-2">
                        <Label>Invoice Prefix</Label>
                        <Input
                            value={invoicePrefix}
                            onChange={e => setInvoicePrefix(e.target.value.toUpperCase())}
                            placeholder="INV"
                            maxLength={5}
                        />
                        <p className="text-xs text-muted-foreground">
                            Format will be: <span className="font-mono font-bold text-slate-700">{invoicePrefix || 'INV'}-{new Date().getFullYear().toString().slice(-2)}-{(new Date().getFullYear() + 1).toString().slice(-2)}-00001</span>
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
        </form >
    )
}
