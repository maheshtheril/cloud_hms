import { BackButton } from '@/components/ui/back-button'
import { LeadForm } from '@/components/crm/lead-form'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { notFound } from 'next/navigation'

import { getCustomFieldDefinitions } from '@/app/actions/crm/custom-fields'
import { getPipelines, getSources, getCompanies, getCRMUsers, getTargetTypes } from '@/app/actions/crm/masters'

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
    const users = await getCRMUsers()
    const targetTypes = await getTargetTypes()


    return (
        <div className="min-h-screen bg-futuristic">
            {/* Animated Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <div className="relative container mx-auto py-12 max-w-5xl">
                <div className="flex items-center gap-6 mb-10">
                    <BackButton href="/crm/leads" />
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-gradient-primary flex items-center gap-3">
                            Refine Signal
                            <Sparkles className="h-8 w-8 text-indigo-600 animate-pulse" />
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                            Updating parameters for Lead: <span className="font-bold text-slate-900 dark:text-white">{lead.name}</span>
                        </p>
                    </div>
                </div>

                <div className="glass-card bg-white/40 dark:bg-slate-900/40 p-1 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl">
                    <LeadForm
                        mode="edit"
                        initialData={lead}
                        customFields={customFields}
                        pipelines={pipelines}
                        sources={sources}
                        companies={companies}
                        users={users}
                        targetTypes={targetTypes}
                    />

                </div>
            </div>
        </div>
    )
}
