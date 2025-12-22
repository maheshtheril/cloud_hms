import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import { DealForm } from '@/components/crm/deal-form'
import { getPipelines } from '@/app/actions/crm/masters'
import { getCompanyDefaultCurrency, getSupportedCurrencies } from '@/app/actions/currency'

interface PageProps {
    params: {
        id: string
    }
}

export default async function EditDealPage(props: PageProps) {
    const params = await props.params;
    const session = await auth()
    const tenantId = session?.user?.tenantId

    if (!tenantId) {
        return <div>Unauthorized</div>
    }

    const deal = await prisma.crm_deals.findUnique({
        where: {
            id: params.id,
            tenant_id: tenantId
        },
        include: {
            pipeline: true,
            stage: true
        }
    })

    if (!deal) {
        notFound()
    }

    const pipelines = await getPipelines()
    const defaultCurrency = await getCompanyDefaultCurrency()
    const supportedCurrencies = await getSupportedCurrencies()

    return (
        <div className="container mx-auto py-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8">Edit Deal</h1>
            <DealForm
                pipelines={pipelines}
                initialData={deal}
                mode="edit"
                defaultCurrency={defaultCurrency}
                supportedCurrencies={supportedCurrencies}
            />
        </div>
    )
}
