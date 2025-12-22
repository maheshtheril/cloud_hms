import { getPipelines, getSources, getIndustries } from '@/app/actions/crm/masters'
import { PipelineManager } from './pipeline-manager'
import { SourceManager } from './source-manager'
import { IndustryManager } from './industry-manager'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { GitBranch, UserPlus, Factory, Settings2, LayoutTemplate } from 'lucide-react'

// Define the masters configuration for easy expansion
const MENU_ITEMS = [
    { id: 'pipelines', label: 'Pipelines & Stages', icon: GitBranch, description: 'Manage sales pipelines and deal stages' },
    { id: 'sources', label: 'Lead Sources', icon: UserPlus, description: 'Define where your leads come from' },
    { id: 'industries', label: 'Industries', icon: Factory, description: 'Categorize leads by industry sectors' },
    // Future: { id: 'tags', label: 'Tags', icon: Tags, description: 'Manage shared tags' }
]

export default async function CRMGlobalSettingsPage({ searchParams }: { searchParams: { view?: string } }) {
    const view = searchParams.view || 'pipelines'

    // Fetch data based on view to optimize? 
    // For now, fetching all is fine as they are small master data sets.
    // Or we can conditional fetch.
    const pipelines = await getPipelines(true)
    const sources = await getSources()
    const industries = await getIndustries()

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings2 className="h-8 w-8 text-slate-500" />
                    CRM Master Settings
                </h1>
                <p className="text-slate-500 mt-2">Configure the core definitions for your CRM ecosystem.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* SIDEBAR NAVIGATION */}
                <aside className="w-full lg:w-64 shrink-0 space-y-1">
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.icon
                        const isActive = view === item.id
                        return (
                            <Link
                                key={item.id}
                                href={`?view=${item.id}`}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        )
                    })}
                </aside>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 w-full min-w-0">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                            <CardTitle>
                                {MENU_ITEMS.find(m => m.id === view)?.label}
                            </CardTitle>
                            <CardDescription>
                                {MENU_ITEMS.find(m => m.id === view)?.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {view === 'pipelines' && <PipelineManager pipelines={pipelines} />}
                            {view === 'sources' && <SourceManager sources={sources} />}
                            {view === 'industries' && <IndustryManager industries={industries} />}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
