import { LeadForm } from '@/components/crm/lead-form'
import { Sparkles } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { notFound } from 'next/navigation'

import { getCustomFieldDefinitions } from '@/app/actions/crm/custom-fields'
import { getPipelines, getSources, getCompanies } from '@/app/actions/crm/masters'

export const dynamic = 'force-dynamic'

interface Props {
    params: {
        id: string
    }
}

export default async function EditLeadPage(props: Props) {
    const params = await props.params;

    const session = await auth()
    if (!session?.user?.id) return notFound()

    const id = params.id
    const lead = await prisma.crm_leads.findUnique({
        where: {
            id,
            tenant_id: session.user.tenantId || undefined
        }
    })

    if (!lead) {
        return notFound()
    }

    const rawDefinitions = await getCustomFieldDefinitions('lead')
    const customFields = rawDefinitions.map(d => ({
        ...d,
        required: d.required === null ? false : d.required,
        visible: true,
    }))

    const pipelines = await getPipelines(true) // include stages
    const sources = await getSources()
    const companies = await getCompanies()

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        Edit Lead
                        <Sparkles className="h-6 w-6 text-purple-600" />
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Update lead details and status.
                    </p>
                </div>
            </div>

            <LeadForm
                mode="edit"
                initialData={lead}
                customFields={customFields}
                pipelines={pipelines}
                sources={sources}
                companies={companies}
            />
        </div>
    )
}
