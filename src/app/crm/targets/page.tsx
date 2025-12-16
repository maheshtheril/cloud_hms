
import Link from 'next/link'
import { getMyTargets } from '@/app/actions/crm/targets'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Plus, Target, TrendingUp } from 'lucide-react'
import { Metadata } from 'next'
import { format } from 'date-fns'

export const metadata: Metadata = {
    title: 'Targets | SAAS ERP',
    description: 'Track your performance goals',
}

export const dynamic = 'force-dynamic'

export default async function TargetsPage() {
    const targets = await getMyTargets()

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Targets</h1>
                    <p className="text-gray-500 mt-2">Track your revenue and activity goals.</p>
                </div>
                <Link href="/crm/targets/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Set Target
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {targets.map((target) => {
                    // Calculate percentage
                    const achieved = Number(target.achieved_value || 0)
                    const goal = Number(target.target_value)
                    const percent = Math.min((achieved / goal) * 100, 100)

                    return (
                        <Card key={target.id} className="border-gray-200 shadow-sm overflow-hidden">
                            <CardHeader className="bg-gray-50/50 pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <Target className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500 bg-white px-2 py-1 rounded border border-gray-100">
                                        {target.period_type}
                                    </span>
                                </div>
                                <CardTitle className="mt-4 text-lg">
                                    {target.target_type === 'revenue' ? 'Revenue Goal' : 'Activity Goal'}
                                </CardTitle>
                                <p className="text-sm text-gray-500">
                                    {format(new Date(target.period_start), 'MMM d')} - {format(new Date(target.period_end), 'MMM d, yyyy')}
                                </p>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-gray-700">Progress</span>
                                        <span className={percent >= 100 ? "text-green-600" : "text-indigo-600"}>
                                            {percent.toFixed(0)}%
                                        </span>
                                    </div>
                                    <Progress value={percent} className="h-2" />
                                    <div className="flex justify-between text-xs text-gray-500 pt-1">
                                        <span>{achieved} achieved</span>
                                        <span>Target: {goal}</span>
                                    </div>

                                    {Number(target.incentive_amount) > 0 && (
                                        <div className="mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit">
                                            Reward: ${Number(target.incentive_amount).toLocaleString()}
                                        </div>
                                    )}
                                </div>

                                {percent >= 100 && (
                                    <div className="mt-6 flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-md text-sm font-medium justify-center">
                                        <TrendingUp className="w-4 h-4" />
                                        Target Achieved!
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}

                {targets.length === 0 && (
                    <div className="col-span-full text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="bg-white p-4 rounded-full w-fit mx-auto shadow-sm mb-4">
                            <Target className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No active targets</h3>
                        <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                            You don't have any targets assigned for this period. Ask your manager to assign goals.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
