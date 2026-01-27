'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateGlobalSettings, updateTenantSettings } from '@/app/actions/settings'
import { Loader2, Save, Building2, Coins, ShieldCheck, Database, Layout } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { FileUpload } from '@/components/ui/file-upload'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface Props {
    company: any
    tenant: any
    currencies: any[]
    isTenantAdmin: boolean
}

export function GlobalSettingsForm({ company, tenant, currencies, isTenantAdmin }: Props) {
    const { update } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(company.name)
    const [industry, setIndustry] = useState(company.industry || '')
    const [logoUrl, setLogoUrl] = useState(company.logo_url || '')
    const [currencyId, setCurrencyId] = useState(company.company_settings?.currency_id || '')
    const [invoicePrefix, setInvoicePrefix] = useState(company.company_settings?.numbering_prefix || 'INV')

    // Tenant Branding
    const [appName, setAppName] = useState(tenant?.app_name || tenant?.name || '')
    const [tenantLogoUrl, setTenantLogoUrl] = useState(tenant?.logo_url || '')
    const [dbUrl, setDbUrl] = useState(tenant?.db_url || '')

    // Contact Info (stored in metadata)
    const meta = (company.metadata as any) || {}
    const [address, setAddress] = useState(meta.address || '')
    const [phone, setPhone] = useState(meta.phone || '')
    const [email, setEmail] = useState(meta.email || '')
    const [gstin, setGstin] = useState(meta.gstin || '')

    // Sync state with props when they change from server
    useEffect(() => {
        setName(company.name)
        setIndustry(company.industry || '')
        setLogoUrl(company.logo_url || '')
        setCurrencyId(company.company_settings?.currency_id || '')
        setInvoicePrefix(company.company_settings?.numbering_prefix || 'INV')
        setAppName(tenant?.app_name || tenant?.name || '')
        setTenantLogoUrl(tenant?.logo_url || '')
        setDbUrl(tenant?.db_url || '')

        const m = (company.metadata as any) || {}
        setAddress(m.address || '')
        setPhone(m.phone || '')
        setEmail(m.email || '')
        setGstin(m.gstin || '')
    }, [company, tenant])

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

        let tenantResult = { success: true, error: null as string | null };
        if (isTenantAdmin) {
            const res = await updateTenantSettings({
                tenantId: tenant.id,
                appName,
                logoUrl: tenantLogoUrl,
                dbUrl: dbUrl || undefined
            });
            if (!res.success) {
                tenantResult = { success: false, error: res.error || 'Failed to update tenant branding' };
            }
        }

        if (result.success && tenantResult.success) {
            // Update session if branding/DB changed
            if (isTenantAdmin) {
                await update({
                    dbUrl: dbUrl || null
                });
            }

            toast({
                title: "Settings saved",
                description: "Your organization and branding settings have been updated.",
            })
            router.refresh()
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: tenantResult.error || result.error || "Failed to update settings"
            })
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl pb-20">
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
                            <FileUpload
                                label="Upload Company Logo"
                                folder="logos"
                                accept="image/*"
                                currentFileUrl={logoUrl}
                                onUploadComplete={(url) => setLogoUrl(url)}
                            />
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
                        Set your default reporting currency and invoice formatting.
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
                    </div>

                    <div className="space-y-2">
                        <Label>Invoice Prefix</Label>
                        <Input
                            value={invoicePrefix}
                            onChange={e => setInvoicePrefix(e.target.value.toUpperCase())}
                            placeholder="INV"
                            maxLength={5}
                        />
                    </div>
                </CardContent>
            </Card>

            {isTenantAdmin && (
                <>
                    <Card className="border-indigo-100 shadow-sm">
                        <CardHeader className="bg-indigo-50/30">
                            <CardTitle className="flex items-center gap-2 text-indigo-900">
                                <Layout className="h-5 w-5 text-indigo-600" />
                                Software White-Labeling
                            </CardTitle>
                            <CardDescription>
                                Customize the application name and logo displayed on login and sidebar.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label>Application Display Name</Label>
                                <Input
                                    value={appName}
                                    onChange={e => setAppName(e.target.value)}
                                    placeholder="e.g. Grand City Healthcare"
                                />
                            </div>

                            <div className="space-y-4">
                                <Label>Software Logo (White-Label)</Label>
                                <FileUpload
                                    label="Upload Organization Logo"
                                    folder="tenant-logos"
                                    accept="image/*"
                                    currentFileUrl={tenantLogoUrl}
                                    onUploadComplete={(url) => setTenantLogoUrl(url)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-amber-50/30">
                            <CardTitle className="flex items-center gap-2 text-amber-900">
                                <Database className="h-5 w-5 text-amber-600" />
                                Bring Your Own Database (BYOB)
                            </CardTitle>
                            <CardDescription>
                                Connect your own PostgreSQL instance (e.g., from Render or Neon).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <Alert variant="warning" className="bg-amber-50 border-amber-200">
                                <ShieldCheck className="h-4 w-4 text-amber-600" />
                                <AlertTitle className="text-amber-800 font-bold">Important</AlertTitle>
                                <AlertDescription className="text-amber-700">
                                    Entering a connection string will move your organization's data to the private database.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                                <Label>Private PostgreSQL URL</Label>
                                <Input
                                    type="password"
                                    value={dbUrl}
                                    onChange={e => setDbUrl(e.target.value)}
                                    placeholder="postgresql://user:pass@host:5432/dbname"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            <div className="flex justify-end sticky bottom-6 z-10">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto min-w-[150px] shadow-lg">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save All Settings
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
