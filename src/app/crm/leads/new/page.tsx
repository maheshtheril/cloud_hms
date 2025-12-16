import { LeadForm } from '@/components/crm/lead-form'
import { Sparkles } from 'lucide-react'

import { getCustomFieldDefinitions } from '@/app/actions/crm/custom-fields'
import { getPipelines, getSources, getCompanies } from '@/app/actions/crm/masters'

export default async function NewLeadPage() {
    const rawDefinitions = await getCustomFieldDefinitions('lead')
    // Fix type mismatch (null vs undefined)
    const customFields = rawDefinitions.map(d => ({
        ...d,
        required: d.required === null ? false : d.required,
        visible: d.visible === null ? true : d.visible,
    }))

    const pipelines = await getPipelines(true) // include stages
    const sources = await getSources()
    const companies = await getCompanies()

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        Create Smart Lead
                        <Sparkles className="h-6 w-6 text-purple-600" />
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Add a new potential client. Our AI will assist with scoring and classification.
                    </p>
                </div>
            </div>

            <LeadForm
                customFields={customFields}
                pipelines={pipelines}
                sources={sources}
                companies={companies}
            />
        </div>
    )
}
