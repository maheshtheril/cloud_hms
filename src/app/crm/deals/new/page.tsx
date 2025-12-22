import { DealForm } from '@/components/crm/deal-form'
import { Briefcase } from 'lucide-react'
import { getCompanies, getPipelines } from '@/app/actions/crm/masters'
import { getCompanyDefaultCurrency, getSupportedCurrencies } from '@/app/actions/currency'

export default async function NewDealPage() {
    const companies = await getCompanies()
    const defaultCompany = companies[0]
    const pipelines = await getPipelines(true)
    const defaultCurrency = await getCompanyDefaultCurrency()
    const supportedCurrencies = await getSupportedCurrencies()

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        Create New Deal
                        <Briefcase className="h-6 w-6 text-emerald-600" />
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Track a new revenue opportunity.
                    </p>
                </div>
            </div>

            <DealForm company={defaultCompany} pipelines={pipelines} />
        </div>
    )
}
