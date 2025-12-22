'use client'

import { useActionState, useState, useMemo } from 'react'
import { createLead, updateLead, LeadFormState } from '@/app/actions/crm/leads'
import { PhoneInputComponent } from '@/components/ui/phone-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles, BarChart2, Calendar as CalendarIcon } from 'lucide-react'
import { CustomFieldDefinition, CustomFieldRenderer } from './custom-field-renderer'
import { SubmitButton } from '@/components/ui/submit-button'

import { CurrencyInfo } from '@/app/actions/currency'

export function LeadForm({
    customFields = [],
    pipelines = [],
    sources = [],
    companies = [],
    initialData = null,
    mode = 'create',
    defaultCurrency,
    supportedCurrencies = []
}: {
    customFields?: CustomFieldDefinition[],
    pipelines?: any[],
    sources?: any[],
    companies?: any[],
    initialData?: any,
    mode?: 'create' | 'edit',
    defaultCurrency?: CurrencyInfo,
    supportedCurrencies?: CurrencyInfo[]
}) {
    const [currency, setCurrency] = useState(initialData?.currency || defaultCurrency?.code || 'USD')
    const currentCurrencySymbol = supportedCurrencies.find(c => c.code === currency)?.symbol || defaultCurrency?.symbol || '$'


    // Select default pipeline (first one, or one marked is_default)
    const defaultPipeline = pipelines.find(p => p.is_default) || pipelines[0]

    // Select default company (first one usually main)
    const defaultCompany = companies[0]

    // State for Pipeline Selection to update Stages
    const [selectedPipelineId, setSelectedPipelineId] = useState<string>(initialData?.pipeline_id || defaultPipeline?.id || '')
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>(initialData?.company_id || defaultCompany?.id || '')


    // Derive stages based on selected pipeline
    const stages = useMemo(() => {
        const p = pipelines.find(x => x.id === selectedPipelineId)
        return p?.stages || []
    }, [selectedPipelineId, pipelines])

    // Derive default country for phone input
    const countryCode = useMemo(() => {
        const c = companies.find(x => x.id === selectedCompanyId)
        // Ensure uppercase for ISO2 code (e.g. "US", "IN")
        return (c?.countries?.iso2?.toUpperCase() as any) || 'US'
    }, [selectedCompanyId, companies])

    const [phone, setPhone] = useState<any>(initialData?.phone || initialData?.primary_phone)

    const initialState: LeadFormState = { message: '', errors: {} }
    const [state, dispatch] = useActionState(mode === 'edit' ? updateLead : createLead, initialState)




    return (
        <form action={dispatch} className="space-y-6">
            {mode === 'edit' && <input type="hidden" name="id" value={initialData.id} />}

            {/* AI Header Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 mb-6">
                <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span>AI Prediction Enabled</span>
                </div>
                <p className="text-sm text-indigo-600">
                    Fill in the details below. Our AI will automatically score this lead and generate a summary once created.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Lead Details</CardTitle>
                        <CardDescription>Basic contact information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Lead Name / Title</Label>
                            <Input id="name" name="name" placeholder="e.g. Hospital Modernization Project" required defaultValue={initialData?.name} />
                            {state.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
                        </div>

                        {/* Company Selection - Conditional display */}
                        {companies.length > 1 ? (
                            <div className="space-y-2">
                                <Label htmlFor="company_id">
                                    Branch/Location
                                    <span className="ml-2 text-xs text-gray-500 font-normal">
                                        ({companies.length} available)
                                    </span>
                                </Label>
                                <select
                                    id="company_id"
                                    name="company_id"
                                    value={selectedCompanyId}
                                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <p className="text-xs text-gray-500">
                                    Select which branch/location this lead belongs to
                                </p>
                            </div>
                        ) : (
                            // Hidden field for single company - no need to show selector
                            companies.length === 1 && (
                                <input type="hidden" name="company_id" value={companies[0].id} />
                            )
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="company_name">Client Company Name</Label>
                            <Input id="company_name" name="company_name" placeholder="e.g. City General Hospital" defaultValue={initialData?.company_name} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact_name">Contact Person</Label>
                                <Input id="contact_name" name="contact_name" placeholder="Dr. Smith" defaultValue={initialData?.contact_name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <PhoneInputComponent
                                    key={countryCode} // Force re-render when default country changes
                                    id="phone"
                                    name="phone"
                                    placeholder="+1..."
                                    value={phone}
                                    onChange={setPhone}
                                    defaultCountry={countryCode}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="dr.smith@hospital.com" defaultValue={initialData?.email} />
                            {state.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Deal Intelligence</CardTitle>
                        <CardDescription>Value and tracking</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="estimated_value">Est. Value ({currentCurrencySymbol})</Label>
                                <Input id="estimated_value" name="estimated_value" type="number" placeholder="0.00" step="0.01" defaultValue={initialData?.estimated_value} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <select
                                    id="currency"
                                    name="currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {supportedCurrencies.map(c => (
                                        <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                                    ))}
                                    {supportedCurrencies.length === 0 && (
                                        <>
                                            <option value="INR">INR (₹)</option>
                                            <option value="USD">USD ($)</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="probability">Probability (%)</Label>
                                <Input id="probability" name="probability" type="number" placeholder="50" max="100" defaultValue={initialData?.probability} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="source_id">Source</Label>
                                <select
                                    id="source_id"
                                    name="source_id"
                                    defaultValue={initialData?.source_id}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select Source</option>
                                    {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Pipeline & Stage Section */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pipeline_id">Pipeline</Label>
                                <select
                                    id="pipeline_id"
                                    name="pipeline_id"
                                    value={selectedPipelineId}
                                    onChange={(e) => setSelectedPipelineId(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select Pipeline</option>
                                    {pipelines.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stage_id">Stage</Label>
                                <select
                                    id="stage_id"
                                    name="stage_id"
                                    defaultValue={initialData?.stage_id}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select Stage</option>
                                    {stages.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.probability}%)</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="next_followup_date">Next Follow-up</Label>
                            <div className="relative">
                                <Input
                                    id="next_followup_date"
                                    name="next_followup_date"
                                    type="datetime-local"
                                    defaultValue={initialData?.next_followup_date ? new Date(initialData.next_followup_date).toISOString().slice(0, 16) : ''}
                                />
                                <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <BarChart2 className="w-4 h-4" />
                                <span>Projected Score: <span className="font-bold text-gray-700">Calculated after save</span></span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Custom Fields - Dynamic rendering */}
            {customFields.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Additional Information</CardTitle>
                        <CardDescription>Custom fields configured for your organization</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {customFields.map(field => (
                                <CustomFieldRenderer key={field.id} field={field} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Notes & Context</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="notes">AI Context / Notes</Label>
                        <Textarea id="notes" name="ai_summary" placeholder="Add any initial context for the AI..." defaultValue={initialData?.ai_summary} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => window.history.back()}>Cancel</Button>
                <SubmitButton className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {mode === 'edit' ? 'Update Lead' : 'Create Smart Lead'}
                </SubmitButton>
            </div>

            {state.message && (
                <div role="alert" className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                    {state.message}
                </div>
            )}
        </form>
    )
}
