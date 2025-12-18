import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Plus, Sparkles } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
    const session = await auth()
    const tenantId = session?.user?.tenantId

    const leads = await prisma.crm_leads.findMany({
        where: {
            ...(tenantId ? { tenant_id: tenantId } : {}),
            deleted_at: null
        },
        orderBy: { created_at: 'desc' },
        include: { stage: true }
    })

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Smart Leads</h1>
                    <p className="text-gray-500 mt-2">Manage your pipeline with AI-driven insights.</p>
                </div>
                <Link href="/crm/leads/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        New Deal
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {leads.map((lead) => (
                    <div key={lead.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        {lead.is_hot && (
                            <div className="absolute top-0 right-0 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-bl-lg font-bold flex items-center">
                                <Sparkles className="w-3 h-3 mr-1" /> HOT
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">{lead.name}</h3>
                                <p className="text-sm text-gray-500">{lead.company_name || 'No Company'}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-bold text-gray-900">${lead.estimated_value?.toString() || '0'}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${lead.stage?.type === 'won' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {lead.stage?.name || lead.status}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Score</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${(lead.lead_score || 0) > 70 ? 'bg-green-500' :
                                                (lead.lead_score || 0) > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${lead.lead_score || 0}%` }}
                                        />
                                    </div>
                                    <span className="font-medium">{lead.lead_score}</span>
                                </div>
                            </div>

                            {lead.ai_summary && (
                                <div className="bg-indigo-50 p-3 rounded-lg text-xs text-indigo-800 border border-indigo-100">
                                    <span className="font-bold mr-1">AI:</span> {lead.ai_summary}
                                </div>
                            )}

                            <div className="text-xs text-gray-400 pt-2 border-t flex justify-between">
                                <span>{lead.contact_name}</span>
                                <span>{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {leads.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 mb-4">No leads found. Start by creating one!</p>
                        <Link href="/crm/leads/new">
                            <Button variant="outline">Create First Lead</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
