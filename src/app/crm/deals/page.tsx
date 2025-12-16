import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Plus, DollarSign } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function DealsPage() {
    const deals = await prisma.crm_deals.findMany({
        where: { deleted_at: null },
        orderBy: { created_at: 'desc' },
        include: { stage: true, pipeline: true }
    })

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Deals Pipeline</h1>
                    <p className="text-gray-500 mt-2">Track your active opportunities and revenue.</p>
                </div>
                <Link href="/crm/deals/new">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Deal
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {deals.map((deal) => (
                    <div key={deal.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">

                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-900 truncate">{deal.title}</h3>
                                <p className="text-sm text-gray-500">{deal.pipeline?.name || 'Default Pipeline'}</p>
                            </div>
                            <div className={`ml-2 px-2 py-1 rounded text-xs font-medium uppercase
                    ${deal.status === 'won' ? 'bg-green-100 text-green-800' :
                                    deal.status === 'lost' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}
                `}>
                                {deal.status}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-emerald-50 p-2 rounded-full text-emerald-600">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-gray-900">{deal.value?.toString()}</span>
                                <span className="text-xs text-gray-400 ml-1">{deal.currency}</span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-gray-50">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Stage:</span>
                                <span className="font-medium">{deal.stage?.name || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Probability:</span>
                                <span className="font-medium">{deal.probability?.toString()}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Created:</span>
                                <span className="text-gray-700">{formatDistanceToNow(new Date(deal.created_at), { addSuffix: true })}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {deals.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 mb-4">No deals in the pipeline.</p>
                        <Link href="/crm/deals/new">
                            <Button variant="outline">Create First Deal</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
