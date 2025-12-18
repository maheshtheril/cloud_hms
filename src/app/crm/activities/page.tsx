import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Phone, Mail, CheckCircle2, Clock, BrainCircuit, MapPin } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function ActivitiesPage() {
    const session = await auth()
    const tenantId = session?.user?.tenantId

    const activities = await prisma.crm_activities.findMany({
        where: {
            deleted_at: null,
            ...(tenantId ? { tenant_id: tenantId } : {}),
        },
        orderBy: { created_at: 'desc' },
    })

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Activity & Follow-up History</h1>
                    <p className="text-gray-500 mt-2">All interactions with AI sentiment analysis.</p>
                </div>
                <Link href="/crm/activities/new">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Log Activity
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                {activities.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                        <div className="flex gap-4">
                            <div className={`p-3 rounded-full h-12 w-12 flex items-center justify-center 
                    ${item.type === 'call' ? 'bg-blue-100 text-blue-600' :
                                    item.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                                        'bg-gray-100 text-gray-600'}`}>
                                <span className="font-bold text-xs uppercase">{item.type.substr(0, 1)}</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{item.subject}</h3>
                                <p className="text-sm text-gray-500 line-clamp-1">{item.description || 'No notes'}</p>

                                <div className="flex items-center gap-4 mt-2 text-xs">
                                    <span className="text-gray-400">{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>

                                    {(item.sentiment_score ?? 0) !== 0 && (
                                        <span className="flex items-center gap-1 text-purple-600 font-medium">
                                            <BrainCircuit className="w-3 h-3" />
                                            Sentiment: {item.sentiment_score}
                                        </span>
                                    )}

                                    {item.location_lat && (
                                        <span className="flex items-center gap-1 text-green-600 font-medium">
                                            <MapPin className="w-3 h-3" />
                                            Checked-in
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                    ${item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                 `}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}

                {activities.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 mb-4">No history yet.</p>
                        <Link href="/crm/activities/new">
                            <Button variant="outline">Log First Activity</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
