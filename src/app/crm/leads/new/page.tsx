import { LeadForm } from '@/components/crm/lead-form'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/back-button'

import { getCustomFieldDefinitions } from '@/app/actions/crm/custom-fields'
import { getPipelines, getSources, getCompanies, getCRMUsers, getTargetTypes } from '@/app/actions/crm/masters'
import { getCompanyDefaultCurrency, getSupportedCurrencies } from '@/app/actions/currency'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export default async function NewLeadPage() {
    const rawDefinitions = await getCustomFieldDefinitions('lead')
    // Fix type mismatch (null vs undefined)
    const customFields = rawDefinitions.map(d => ({
        ...d,
        required: d.required === null ? false : d.required,
        visible: true,
    }))

    const pipelines = await getPipelines(true) // include stages
    const sources = await getSources()
    const companies = await getCompanies()
    const defaultCurrency = await getCompanyDefaultCurrency()
    const supportedCurrencies = await getSupportedCurrencies()
    const users = await getCRMUsers()
    const targetTypes = await getTargetTypes()

    const session = await auth()
    const user = session?.user?.id ? await prisma.app_user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    }) : null
    const role = user?.role || ''
    const isManager = session?.user?.isAdmin || role.toLowerCase().includes('admin') || role.toLowerCase().includes('manager')


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
                            Create New Lead
                            <Sparkles className="h-8 w-8 text-indigo-600 animate-pulse" />
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                            Register a new business opportunity and track its progress through the pipeline.
                        </p>
                    </div>
                </div>

                <div className="glass-card bg-white/40 dark:bg-slate-900/40 p-1 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl">
                    <LeadForm
                        customFields={customFields}
                        pipelines={pipelines}
                        sources={sources}
                        companies={companies}
                        defaultCurrency={defaultCurrency}
                        supportedCurrencies={supportedCurrencies}
                        users={users}
                        targetTypes={targetTypes}
                        isManager={isManager}
                    />

                </div>
            </div>
        </div>
    )
}
