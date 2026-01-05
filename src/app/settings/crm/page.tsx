import { getPipelines, getSources, getIndustries, getLostReasons, getContactRoles, upsertLostReason, deleteLostReason, upsertContactRole, deleteContactRole, getTargetTypes } from '@/app/actions/crm/masters'
import { PipelineManager } from './pipeline-manager'
import { SourceManager } from './source-manager'
import { IndustryManager } from './industry-manager'
import { LostReasonManager } from './lost-reason-manager'
import { ContactRoleManager } from './contact-role-manager'
import { TargetTypeManager } from './target-type-manager'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { GitBranch, UserPlus, Factory, Settings2, XCircle, Users, Target } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export const dynamic = 'force-dynamic'

const MENU_ITEMS = [
    { id: 'pipelines', label: 'Pipelines & Stages', icon: GitBranch, description: 'Manage sales pipelines and deal stages' },
    { id: 'sources', label: 'Lead Sources', icon: UserPlus, description: 'Define where your leads come from' },
    { id: 'industries', label: 'Industries', icon: Factory, description: 'Categorize leads by industry sectors' },
    { id: 'target_types', label: 'Account Types', icon: Target, description: 'Strategic entity classifications (Enterprise, Govt, etc)' },
    { id: 'roles', label: 'Contact Roles', icon: Users, description: 'Define roles for contacts in deals (e.g. Decision Maker)' },
    { id: 'lost_reasons', label: 'Lost Reasons', icon: XCircle, description: 'Standardize reasons for lost opportunities' },
]

export default async function CRMGlobalSettingsPage(props: { searchParams: Promise<{ view?: string }> }) {
    const searchParams = await props.searchParams
    const view = searchParams.view || 'pipelines'

    const pipelines = await getPipelines(true)
    const sources = await getSources()
    const industries = await getIndustries()
    const lostReasons = await getLostReasons()
    const contactRoles = await getContactRoles()
    const targetTypes = await getTargetTypes()

    return (
        <div className="container mx-auto p-6 max-w-7xl space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    CRM Master Settings
                </h1>
                <p className="text-slate-500 mt-2 text-lg">Configure the core definitions for your CRM ecosystem.</p>
            </div>

            {/* Horizontal Navigation Pills */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = view === item.id
                    return (
                        <Link
                            key={item.id}
                            href={`?view=${item.id}`}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                                isActive
                                    ? "bg-slate-900 text-white border-slate-900 shadow-sm hover:bg-slate-800"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {/* No Card Wrapper needed for inner content if components have their own cards, 
                     but consistency is good. The managers use Cards internally? 
                     Let's check. Yes they do. So we should NOT wrap them in another Card.
                     Wait, key check: SourceManager uses Card? Yes. PipelineManager? Yes.
                     So I should REMOVE the outer Card wrapper to avoid double-carding.
                     The previous implementation had a wrapper Card. I will remove it for cleaner UI.
                  */}

                {/* Just Title for context if needed, but managers act as full sections. */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {MENU_ITEMS.find(m => m.id === view)?.label}
                    </h2>
                    <p className="text-slate-500 text-sm">
                        {MENU_ITEMS.find(m => m.id === view)?.description}
                    </p>
                </div>

                {view === 'pipelines' && <PipelineManager pipelines={pipelines} />}
                {view === 'sources' && <SourceManager sources={sources} />}
                {view === 'industries' && <IndustryManager industries={industries} />}
                {view === 'target_types' && <TargetTypeManager data={targetTypes} />}
                {view === 'roles' && <ContactRoleManager data={contactRoles} onSave={upsertContactRole} onDelete={deleteContactRole} />}
                {view === 'lost_reasons' && <LostReasonManager data={lostReasons} onSave={upsertLostReason} onDelete={deleteLostReason} />}
            </div>
        </div>
    )
}
