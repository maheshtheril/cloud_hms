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
        <form action={dispatch} className="space-y-8 p-8 bg-white/20 dark:bg-slate-900/20 rounded-3xl backdrop-blur-md">
            {mode === 'edit' && <input type="hidden" name="id" value={initialData.id} />}

            {/* AI Core Interaction Section */}
            <div className="relative group overflow-hidden bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-8 rounded-2xl border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles className="w-24 h-24 text-indigo-400" />
                </div>
                <div className="relative flex items-center gap-4 text-indigo-600 dark:text-indigo-400 font-black mb-3 text-lg uppercase tracking-tighter">
                    <div className="p-2 rounded-lg bg-indigo-500/20 animate-pulse">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <span>AI-Driven Opportunity Analysis</span>
                </div>
                <p className="relative text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    Integrating this signal into the hive mind. Our proprietary algorithms will quantify growth potential and automate engagement summaries upon synchronization.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Identity & Origin Card */}
                <div className="space-y-6 bg-white/40 dark:bg-slate-800/20 p-8 rounded-3xl border border-white/20 shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Identity & Origin</h3>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Opportunity Nomenclature</Label>
                            <Input id="name" name="name" placeholder="e.g. Enterprise Modernization" required defaultValue={initialData?.name} className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 focus:border-indigo-500 transition-all text-lg font-medium rounded-xl" />
                            {state.errors?.name && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{state.errors.name}</p>}
                        </div>

                        {companies.length > 1 && (
                            <div className="space-y-2">
                                <Label htmlFor="company_id" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Internal Node / Branch</Label>
                                <select
                                    id="company_id"
                                    name="company_id"
                                    value={selectedCompanyId}
                                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                                    className="flex h-12 w-full rounded-xl border border-slate-200/50 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm focus:border-indigo-500 transition-all outline-none"
                                >
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        )}
                        {companies.length === 1 && <input type="hidden" name="company_id" value={companies[0].id} />}

                        <div className="space-y-2">
                            <Label htmlFor="company_name" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Target Entity / Client Org</Label>
                            <Input id="company_name" name="company_name" placeholder="e.g. Apex Global Corp" defaultValue={initialData?.company_name} className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact_name" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Key Liaison</Label>
                                <Input id="contact_name" name="contact_name" placeholder="Name" defaultValue={initialData?.contact_name} className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Signal Endpoint (Email)</Label>
                                <Input id="email" name="email" type="email" placeholder="email@address.com" defaultValue={initialData?.email} className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl font-mono text-sm" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Direct Voice Line</Label>
                            <div className="rounded-xl overflow-hidden border border-slate-200/50">
                                <PhoneInputComponent
                                    key={countryCode}
                                    id="phone"
                                    name="phone"
                                    placeholder="Number"
                                    value={phone}
                                    onChange={setPhone}
                                    defaultCountry={countryCode}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Intelligence & Metrics Card */}
                <div className="space-y-6 bg-white/40 dark:bg-slate-800/20 p-8 rounded-3xl border border-white/20 shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Growth Metrics</h3>
                    </div>

                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="estimated_value" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Potential Yield ({currency})</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currentCurrencySymbol}</span>
                                    <Input id="estimated_value" name="estimated_value" type="number" placeholder="0.00" step="0.01" defaultValue={initialData?.estimated_value} className="h-12 pl-10 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-lg font-bold tabular-nums" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Unit</Label>
                                <select
                                    id="currency"
                                    name="currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="flex h-12 w-full rounded-xl border border-slate-200/50 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm outline-none"
                                >
                                    {supportedCurrencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                                    {supportedCurrencies.length === 0 && <option value="INR">INR</option>}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="probability" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Confidence Factor (%)</Label>
                                <Input id="probability" name="probability" type="number" placeholder="50" max="100" defaultValue={initialData?.probability} className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-center font-black text-indigo-600" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="source_id" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Ingestion Source</Label>
                                <select
                                    id="source_id"
                                    name="source_id"
                                    defaultValue={initialData?.source_id}
                                    className="flex h-12 w-full rounded-xl border border-slate-200/50 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm outline-none"
                                >
                                    <option value="">Legacy / Untracked</option>
                                    {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200/50 dark:border-white/5 pt-5">
                            <div className="space-y-2">
                                <Label htmlFor="pipeline_id" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Assigned Pipeline</Label>
                                <select
                                    id="pipeline_id"
                                    name="pipeline_id"
                                    value={selectedPipelineId}
                                    onChange={(e) => setSelectedPipelineId(e.target.value)}
                                    className="flex h-12 w-full rounded-xl border border-slate-200/50 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm outline-none font-bold"
                                >
                                    {pipelines.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stage_id" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Active Stage</Label>
                                <select
                                    id="stage_id"
                                    name="stage_id"
                                    defaultValue={initialData?.stage_id}
                                    className="flex h-12 w-full rounded-xl border border-slate-200/50 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm outline-none font-medium"
                                >
                                    {stages.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.probability}%)</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="next_followup_date" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Next Engagement Synchronization</Label>
                            <div className="relative">
                                <Input
                                    id="next_followup_date"
                                    name="next_followup_date"
                                    type="datetime-local"
                                    className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl pr-10"
                                    defaultValue={initialData?.next_followup_date ? new Date(initialData.next_followup_date).toISOString().slice(0, 16) : ''}
                                />
                                <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {customFields.length > 0 && (
                <div className="bg-white/40 dark:bg-slate-800/20 p-8 rounded-3xl border border-white/20 shadow-xl space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Extended Data Vectors</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {customFields.map(field => (
                            <CustomFieldRenderer key={field.id} field={field} />
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white/40 dark:bg-slate-800/20 p-8 rounded-3xl border border-white/20 shadow-xl space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-slate-500 rounded-full" />
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Strategic Intelligence</h3>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Contextual Summary / Notes</Label>
                    <Textarea id="notes" name="ai_summary" placeholder="Input strategic context for AI processing..." defaultValue={initialData?.ai_summary} className="min-h-[120px] bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
            </div>

            <div className="flex justify-end items-center gap-6 pt-6">
                <Button variant="ghost" type="button" onClick={() => window.history.back()} className="text-slate-500 hover:text-slate-900 font-bold uppercase tracking-widest text-xs">
                    Abort Sync
                </Button>
                <SubmitButton className="h-14 px-10 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)] border-none rounded-2xl font-black uppercase tracking-tighter text-lg flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
                    <Sparkles className="w-6 h-6" />
                    {mode === 'edit' ? 'Update Signal' : 'Synchronize Lead'}
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
