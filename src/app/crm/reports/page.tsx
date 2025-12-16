
import { getCrmReports } from '@/app/actions/crm/reports'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Metadata } from 'next'
import { BarChart3, PieChart, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Reports | SAAS ERP',
    description: 'CRM Performance Reports',
}

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
    const data = await getCrmReports()

    if (!data) return <div>Loading...</div>

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">CRM Reports</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Lead Pipeline */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-normal">Lead Pipeline</CardTitle>
                        <PieChart className="w-4 h-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 mt-4">
                            {data.leadsByStatus.map((item) => (
                                <div key={item.status} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        <span className="text-sm font-medium capitalize">{item.status}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{item.count} Leads</span>
                                </div>
                            ))}
                            {data.leadsByStatus.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">No leads found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Sales Performance */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-normal">Sales Forecast (Open Deals)</CardTitle>
                        <BarChart3 className="w-4 h-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 mt-4">
                            {data.dealsByStage.map((item) => (
                                <div key={item.stageName} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{item.stageName}</span>
                                        <span className="text-gray-900 font-semibold">
                                            ${item.value.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{ width: '100%' }} // Simple full bar for now, or relative if we had total
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 text-right">{item.count} deals</p>
                                </div>
                            ))}
                            {data.dealsByStage.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">No open deals found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                    <h3 className="text-sm font-semibold text-blue-900">Insight</h3>
                    <p className="text-sm text-blue-700 mt-1">
                        Use this dashboard to track conversion rates and pipeline health.
                        Data is aggregated in real-time.
                    </p>
                </div>
            </div>
        </div>
    )
}
