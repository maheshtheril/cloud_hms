import { LeadForm } from '@/components/crm/lead-form'
import { LeadFormModal } from '@/components/crm/lead-form-modal'
import { getCustomFieldDefinitions } from '@/app/actions/crm/custom-fields'
import { getPipelines, getSources, getCompanies, getCRMUsers, getTargetTypes } from '@/app/actions/crm/masters'
import { getCompanyDefaultCurrency, getSupportedCurrencies } from '@/app/actions/currency'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

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

            <LeadFormModal>
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
            </LeadFormModal>
        </div>
    )
}
