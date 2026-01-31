import { LeadForm } from '@/components/crm/lead-form'
import { Sparkles, X } from 'lucide-react'
import { BackButton } from '@/components/ui/back-button'

import { getCustomFieldDefinitions } from '@/app/actions/crm/custom-fields'
import { getPipelines, getSources, getCompanies, getCRMUsers, getTargetTypes } from '@/app/actions/crm/masters'
import { getCompanyDefaultCurrency, getSupportedCurrencies } from '@/app/actions/currency'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default async function NewLeadPage() {
    const rawDefinitions = await getCustomFieldDefinitions('lead')
    const customFields = rawDefinitions.map(d => ({
        ...d,
        required: d.required === null ? false : d.required,
        visible: true,
    }))

    const pipelines = await getPipelines(true)
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
        <div className="min-h-screen bg-futuristic flex items-center justify-center p-4">
            {/* Animated Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <Dialog open={true}>
                <DialogContent className="max-w-[95vw] w-[1300px] h-[90vh] p-0 overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border-white/20 rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex flex-col resize overflow-auto min-w-[600px] min-h-[500px]">
                    <div className="flex flex-col h-full">
                        <DialogHeader className="px-8 py-5 border-b border-indigo-500/10 bg-indigo-50/20 dark:bg-indigo-900/10 flex flex-row items-center justify-between space-y-0 shrink-0">
                            <div className="flex items-center gap-5">
                                <BackButton href="/crm/leads" />
                                <div>
                                    <DialogTitle className="text-2xl font-black tracking-tighter text-indigo-950 dark:text-white flex items-center gap-2">
                                        Create New Lead
                                        <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
                                    </DialogTitle>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">
                                        Lead Management Portal
                                    </p>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="flex-1 overflow-hidden">
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
                </DialogContent>
            </Dialog>
        </div>
    )
}
