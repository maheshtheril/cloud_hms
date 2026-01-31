'use client'

import { useActionState, useState, useMemo, useEffect, useRef } from 'react'
import { createLead, updateLead, LeadFormState } from '@/app/actions/crm/leads'
import { PhoneInputComponent } from '@/components/ui/phone-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles, BarChart2, Calendar as CalendarIcon, Plus, Save } from 'lucide-react'
import { CustomFieldDefinition, CustomFieldRenderer } from './custom-field-renderer'
import { SubmitButton } from '@/components/ui/submit-button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { upsertTargetType } from '@/app/actions/crm/masters'
import { useRouter } from 'next/navigation'

import { CurrencyInfo } from '@/app/actions/currency'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function LeadForm({
    customFields = [],
    pipelines = [],
    sources = [],
    companies = [],
    initialData = null,
    mode = 'create',
    defaultCurrency,
    supportedCurrencies = [],
    users = [],
    targetTypes = [],
    isManager = false
}: {
    customFields?: CustomFieldDefinition[],
    pipelines?: any[],
    sources?: any[],
    companies?: any[],
    initialData?: any,
    mode?: 'create' | 'edit',
    defaultCurrency?: CurrencyInfo,
    supportedCurrencies?: CurrencyInfo[],
    users?: any[],
    targetTypes?: any[],
    isManager?: boolean
}) {
    const isAdmin = isManager || false
    const router = useRouter()
    const [localTargetTypes, setLocalTargetTypes] = useState(targetTypes || [])
    const [isAddingTargetType, setIsAddingTargetType] = useState(false)
    const [newTargetTypeName, setNewTargetTypeName] = useState('')
    const [isSavingTargetType, setIsSavingTargetType] = useState(false)

    const handleAddTargetType = async () => {
        if (!newTargetTypeName.trim()) return
        setIsSavingTargetType(true)
        const result = await upsertTargetType({ name: newTargetTypeName })
        if (result.success && result.data) {
            setLocalTargetTypes(prev => [...prev, result.data])
            setNewTargetTypeName('')
            setIsAddingTargetType(false)
            router.refresh()
        }
        setIsSavingTargetType(false)
    }

    const [currency, setCurrency] = useState(initialData?.currency || defaultCurrency?.code || 'USD')
    const currentCurrencySymbol = supportedCurrencies.find(c => c.code === currency)?.symbol || defaultCurrency?.symbol || '$'

    const defaultPipeline = pipelines.find(p => p.is_default) || pipelines[0]
    const defaultCompany = companies[0]

    const [selectedPipelineId, setSelectedPipelineId] = useState<string>(initialData?.pipeline_id || defaultPipeline?.id || '')
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>(initialData?.company_id || defaultCompany?.id || '')

    const stages = useMemo(() => {
        const p = pipelines.find(x => x.id === selectedPipelineId)
        return p?.stages || []
    }, [selectedPipelineId, pipelines])

    const countryCode = useMemo(() => {
        const c = companies.find(x => x.id === selectedCompanyId)
        return (c?.countries?.iso2?.toUpperCase() as any) || 'US'
    }, [selectedCompanyId, companies])

    const [phone, setPhone] = useState<any>(initialData?.phone || initialData?.primary_phone)
    const [isHot, setIsHot] = useState<boolean>(initialData?.is_hot || false)

    const initialState: LeadFormState = { message: '', errors: {} }
    const [state, dispatch] = useActionState(mode === 'edit' ? updateLead : createLead, initialState)

    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state.success && mode === 'create') {
            setPhone('')
            formRef.current?.reset()
        }
    }, [state.success, mode])

    return (
        <form ref={formRef} action={dispatch} className="flex flex-col h-full max-h-[85vh] overflow-hidden">
            <input type="hidden" name="is_hot" value={isHot ? 'true' : 'false'} />
            {mode === 'edit' && <input type="hidden" name="id" value={initialData.id} />}

            <Tabs defaultValue="information" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-8 pt-2 pb-0 border-b border-indigo-500/5 bg-slate-50/30 dark:bg-slate-800/20 shrink-0">
                    <TabsList className="flex items-center gap-2 bg-transparent p-0 h-10 w-fit">
                        <TabsTrigger
                            value="information"
                            className="h-full px-5 border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=inactive]:text-slate-400 font-bold uppercase tracking-widest text-[10px] transition-all rounded-none"
                        >
                            General Info
                        </TabsTrigger>
                        <TabsTrigger
                            value="business"
                            className="h-full px-5 border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=inactive]:text-slate-400 font-bold uppercase tracking-widest text-[10px] transition-all rounded-none"
                        >
                            Business Link
                        </TabsTrigger>
                        <TabsTrigger
                            value="additional"
                            className="h-full px-5 border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=inactive]:text-slate-400 font-bold uppercase tracking-widest text-[10px] transition-all rounded-none"
                        >
                            Additional Params
                        </TabsTrigger>
                        <TabsTrigger
                            value="notes"
                            className="h-full px-5 border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=inactive]:text-slate-400 font-bold uppercase tracking-widest text-[10px] transition-all rounded-none"
                        >
                            Context Notes
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-white/50 dark:bg-slate-900/50">
                    <TabsContent value="information" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Lead Name *</Label>
                                <Input id="name" name="name" placeholder="Name" required defaultValue={initialData?.name} className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 focus:border-indigo-500 transition-all text-lg font-medium rounded-xl text-slate-900 dark:text-white" />
                                {state.errors?.name && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{state.errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Mobile *</Label>
                                <div className="rounded-xl overflow-hidden border border-slate-200/50 h-12 bg-white/50 dark:bg-slate-900/50">
                                    <PhoneInputComponent
                                        key={countryCode}
                                        id="phone"
                                        name="phone"
                                        placeholder="Enter mobile number"
                                        value={phone}
                                        onChange={setPhone}
                                        defaultCountry={countryCode}
                                        numberInputProps={{
                                            className: "h-12 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent transition-all text-lg font-medium text-slate-900 dark:text-white"
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="email@address.com" defaultValue={initialData?.email} className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-slate-900 dark:text-white" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="estimated_value" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Expected Revenue *</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currentCurrencySymbol}</span>
                                    <Input id="estimated_value" name="estimated_value" type="number" placeholder="0.00" step="0.01" required defaultValue={initialData?.estimated_value} className="h-12 pl-10 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-lg font-bold tabular-nums text-slate-900 dark:text-white" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="owner_id" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Assigned to *</Label>
                                <select
                                    id="owner_id"
                                    name="owner_id"
                                    required
                                    defaultValue={initialData?.owner_id}
                                    className="flex h-12 w-full rounded-xl border border-slate-200/50 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm focus:border-indigo-500 transition-all outline-none font-medium text-slate-900 dark:text-white"
                                >
                                    <option value="">Select User</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="source_id" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Source *</Label>
                                <select
                                    id="source_id"
                                    name="source_id"
                                    required
                                    defaultValue={initialData?.source_id}
                                    className="flex h-12 w-full rounded-xl border border-slate-200/50 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm focus:border-indigo-500 transition-all outline-none text-slate-900 dark:text-white"
                                >
                                    <option value="">Select Source</option>
                                    {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group cursor-pointer transition-all hover:bg-indigo-500/20" onClick={() => setIsHot(!isHot)}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isHot ? 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                                <Sparkles className={`w-6 h-6 ${isHot ? 'animate-pulse' : ''}`} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Priority Signal</p>
                                <p className="text-xs text-slate-500 font-bold uppercase">Mark as High Priority for Instant Follow-up</p>
                            </div>
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isHot ? 'border-amber-500 bg-amber-500 shadow-inner' : 'border-slate-300 dark:border-slate-700'}`}>
                                {isHot && <div className="w-3 h-3 bg-white rounded-full" />}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="business" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {companies.length > 1 && (
                                <div className="space-y-2">
                                    <Label htmlFor="company_id" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Assigned Branch / Office</Label>
                                    <select
                                        id="company_id"
                                        name="company_id"
                                        value={selectedCompanyId}
                                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                                        className="flex h-12 w-full rounded-xl border border-slate-200/50 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm focus:border-indigo-500 transition-all outline-none text-slate-900 dark:text-white font-medium"
                                    >
                                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}
                            {companies.length === 1 && <input type="hidden" name="company_id" value={companies[0].id} />}

                            <div className="space-y-2">
                                <Label htmlFor="company_name" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Client Company / Organization</Label>
                                <Input id="company_name" name="company_name" placeholder="e.g. Apex Global Corp" defaultValue={initialData?.company_name} className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-slate-900 dark:text-white font-medium" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact_name" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Primary Contact Person</Label>
                                <Input id="contact_name" name="contact_name" placeholder="Contact Name" defaultValue={initialData?.contact_name} className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-slate-900 dark:text-white font-medium" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="probability" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Confidence Factor (%)</Label>
                                <Input id="probability" name="probability" type="number" placeholder="50" max="100" defaultValue={initialData?.probability} className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-center font-black text-indigo-600 dark:text-indigo-400 text-lg" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between px-1">
                                    <Label htmlFor="target_type_id" className="text-xs font-bold uppercase tracking-widest text-slate-500">Account Type</Label>
                                    {isAdmin && (
                                        <Dialog open={isAddingTargetType} onOpenChange={setIsAddingTargetType}>
                                            <DialogTrigger asChild>
                                                <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                                    <Plus className="w-3 h-3" />
                                                    <span>Add New</span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/20 rounded-3xl">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-black text-gradient-primary">Define Account Type</DialogTitle>
                                                    <DialogDescription className="text-slate-500 font-medium">
                                                        Establish a new categorization parameter for account segments.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="py-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="target_type_name" className="text-xs font-bold uppercase tracking-widest text-slate-500">Type Name</Label>
                                                        <Input
                                                            id="target_type_name"
                                                            value={newTargetTypeName}
                                                            onChange={(e) => setNewTargetTypeName(e.target.value)}
                                                            placeholder="e.g. Enterprise, Government, SME..."
                                                            className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-slate-900 dark:text-white"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        type="button"
                                                        onClick={handleAddTargetType}
                                                        disabled={isSavingTargetType || !newTargetTypeName.trim()}
                                                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg border-none"
                                                    >
                                                        {isSavingTargetType ? 'Initializing...' : 'Add Parameters'}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                                <select
                                    id="target_type_id"
                                    name="target_type_id"
                                    defaultValue={initialData?.target_type_id}
                                    className="flex h-12 w-full rounded-xl border border-slate-200/50 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm focus:border-indigo-500 transition-all outline-none font-medium text-slate-900 dark:text-white"
                                >
                                    <option value="">Select Account Type</option>
                                    {localTargetTypes.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currency" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Currency Unit</Label>
                                <select
                                    id="currency"
                                    name="currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="flex h-12 w-full rounded-xl border border-slate-200/50 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm outline-none text-slate-900 dark:text-white font-medium"
                                >
                                    {supportedCurrencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                                    {supportedCurrencies.length === 0 && <option value={defaultCurrency?.code || 'USD'}>{defaultCurrency?.code || 'USD'}</option>}
                                </select>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="additional" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="pipeline_id" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Assigned Pipeline</Label>
                                <select
                                    id="pipeline_id"
                                    name="pipeline_id"
                                    value={selectedPipelineId}
                                    onChange={(e) => setSelectedPipelineId(e.target.value)}
                                    className="flex h-12 w-full rounded-xl border border-slate-200/50 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm outline-none font-bold text-slate-900 dark:text-white"
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
                                    className="flex h-12 w-full rounded-xl border border-slate-200/50 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm outline-none font-medium text-slate-900 dark:text-white"
                                >
                                    {stages.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.probability}%)</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="next_followup_date" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Next Follow-up Date</Label>
                                <div className="relative">
                                    <Input
                                        id="next_followup_date"
                                        name="next_followup_date"
                                        type="datetime-local"
                                        className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl pr-10 text-slate-900 dark:text-white font-medium"
                                        defaultValue={initialData?.next_followup_date ? new Date(initialData.next_followup_date).toISOString().slice(0, 16) : ''}
                                    />
                                    <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {customFields.length > 0 && (
                            <div className="pt-6 border-t border-white/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Custom Attributes</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {customFields.map(field => (
                                        <CustomFieldRenderer key={field.id} field={field} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="notes" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="space-y-3">
                            <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Internal Notes & Context</Label>
                            <Textarea
                                id="notes"
                                name="ai_summary"
                                placeholder="Enter any specific notes or context for this lead..."
                                defaultValue={initialData?.ai_summary}
                                className="min-h-[300px] bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white text-lg p-6 leading-relaxed shadow-inner"
                            />
                        </div>
                    </TabsContent>
                </div>
            </Tabs>

            <div className="flex justify-between items-center gap-6 px-10 py-5 border-t border-indigo-500/10 bg-indigo-50/20 dark:bg-indigo-900/10 shrink-0">
                <div className="flex-1">
                    {state.message && (
                        <div role="alert" className={`p-3 rounded-xl border-2 font-black text-xs h-10 flex items-center px-6 animate-in slide-in-from-left-4 duration-300 ${state.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-rose-500/10 border-rose-500/20 text-rose-600'}`}>
                            {state.message}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" type="button" onClick={() => window.history.back()} className="h-12 px-8 text-slate-500 hover:text-indigo-600 font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all">
                        Discard
                    </Button>
                    <SubmitButton className="h-12 px-10 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 border-none rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all active:scale-95">
                        <Save className="w-4 h-4" />
                        {mode === 'edit' ? 'Update Opportunity' : 'Create Opportunity'}
                    </SubmitButton>
                </div>
            </div>
        </form>
    )
}

