
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTarget } from '@/app/actions/crm/targets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SelectNative } from '@/components/ui/select-native'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function TargetForm() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const res = await createTarget(formData)

        setLoading(false)

        if (res.error) {
            toast({
                title: "Error",
                description: res.error,
                variant: "destructive"
            })
        } else {
            toast({
                title: "Success",
                description: "Target set successfully."
            })
            router.push('/crm/targets')
            router.refresh()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/crm/targets" className="text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Set New Target</h1>
            </div>

            <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Target Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="target_type">Target Type <span className="text-red-500">*</span></Label>
                            <SelectNative id="target_type" name="target_type" required>
                                <option value="revenue">Revenue (Amount)</option>
                                <option value="activity">Activity (Count)</option>
                            </SelectNative>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="target_value">Goal Value <span className="text-red-500">*</span></Label>
                            <Input id="target_value" name="target_value" type="number" step="0.01" required placeholder="e.g. 50000" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="incentive_amount">Incentive Amount</Label>
                        <Input id="incentive_amount" name="incentive_amount" type="number" step="0.01" placeholder="Optional bonus amount" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="period_type">Period <span className="text-red-500">*</span></Label>
                        <SelectNative id="period_type" name="period_type" required defaultValue="month">
                            <option value="month">Monthly</option>
                            <option value="quarter">Quarterly</option>
                            <option value="year">Yearly</option>
                        </SelectNative>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="period_start">Start Date <span className="text-red-500">*</span></Label>
                            <Input id="period_start" name="period_start" type="date" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="period_end">End Date <span className="text-red-500">*</span></Label>
                            <Input id="period_end" name="period_end" type="date" required />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-100">
                    <Link href="/crm/targets">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={loading} className="min-w-[120px]">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Set Target"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
