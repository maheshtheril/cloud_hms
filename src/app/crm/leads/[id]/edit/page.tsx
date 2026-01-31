import { BackButton } from '@/components/ui/back-button'
import { LeadForm } from '@/components/crm/lead-form'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { notFound } from 'next/navigation'

import { getCustomFieldDefinitions, getCustomFieldValues } from '@/app/actions/crm/custom-fields'
import { getPipelines, getSources, getCompanies, getCRMUsers, getTargetTypes } from '@/app/actions/crm/masters'
import { LeadFormModal } from '@/components/crm/lead-form-modal'

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
    const currentValues = await getCustomFieldValues(id)

    const customFields = rawDefinitions.map(d => {
        const val = currentValues.find(v => v.field_id === d.id)
        return {
            ...d,
            required: d.required === null ? false : d.required,
            visible: true,
            currentValue: val
        }
    })

    const pipelines = await getPipelines(true) // include stages
    const sources = await getSources()
    const companies = await getCompanies()
    const users = await getCRMUsers()
    const targetTypes = await getTargetTypes()

    const user = session?.user?.id ? await prisma.app_user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    }) : null
    const role = user?.role || ''
    const isManager = session?.user?.isAdmin || role.toLowerCase().includes('admin') || role.toLowerCase().includes('manager')


    return (
        <div className="min-h-screen bg-futuristic flex items-center justify-center p-4">
            {/* Animated Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <LeadFormModal title={`Edit Opportunity: ${lead.name}`}>
                <LeadForm
                    mode="edit"
                    initialData={lead}
                    customFields={customFields}
                    pipelines={pipelines}
                    sources={sources}
                    companies={companies}
                    users={users}
                    targetTypes={targetTypes}
                    isManager={isManager}
                />
            </LeadFormModal>
        </div>
    )
}
