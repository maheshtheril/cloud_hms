
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTarget, updateTarget } from '@/app/actions/crm/targets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SelectNative } from '@/components/ui/select-native'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Target, Sparkles, TrendingUp, Zap, Calendar, Check } from 'lucide-react'
import Link from 'next/link'

interface TargetFormProps {
    assignees?: {
        id: string
        email: string
        full_name: string | null
        role: string | null
    }[]
    initialData?: any
}

export function TargetForm(props: TargetFormProps) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    // State for multi-selection
    const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
        props.initialData?.assignee_id ? [props.initialData.assignee_id] : []
    )

    const toggleAssignee = (id: string) => {
        if (props.initialData) return // Lock selection in edit mode or handle differently

        setSelectedAssignees(prev => {
            if (prev.includes(id)) {
                return prev.filter(x => x !== id)
            } else {
                return [...prev, id]
            }
        })
    }

    // Helper to format date for input
    const formatDate = (dateString: string | Date | undefined) => {
        if (!dateString) return ''
        const d = new Date(dateString)
        return d.toISOString().split('T')[0]
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)

        let res;
        if (props.initialData) {
            res = await updateTarget(props.initialData.id, formData)
        } else {
            res = await createTarget(formData)
        }

        setLoading(false)

        if (res.error) {
            toast({
                title: "Error",
                description: res.error,
                variant: "destructive"
            })
        } else {
            toast({
                title: props.initialData ? "Objective Recalibrated" : "Objective Locked",
                description: "Target parameters have been successfully synchronized."
            })
            router.push('/crm/targets')
            router.refresh()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            {/* Hidden inputs for FormData */}
            {selectedAssignees.map(id => (
                <input key={id} type="hidden" name="assignee_id" value={id} />
            ))}

            {/* ... container ... */}
            <div className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border border-white/20 backdrop-blur-xl">
                {/* ... header ... */}
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-8 border-b border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Target className="w-24 h-24 text-indigo-500" />
                    </div>
                    <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-2">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Module: Performance Intelligence</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                        {props.initialData ? 'Recalibrate Objective' : 'Objective Parameters'}
                    </h2>
                </div>

                <div className="p-8 space-y-8">
                    {/* Assignee Section - Multi-Select Grid for World Class UX */}
                    {(props.assignees && props.assignees.length > 0) && (
                        <div className="space-y-4">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
                                {props.initialData ? 'Target Owner (Locked)' : 'Designated Agents (Select Multiple)'}
                            </Label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
                                {props.assignees.map(user => {
                                    const isSelected = selectedAssignees.includes(user.id)
                                    return (
                                        <div
                                            key={user.id}
                                            onClick={() => toggleAssignee(user.id)}
                                            className={`
                                                relative flex items-center p-4 rounded-2xl border cursor-pointer transition-all duration-300 group
                                                ${isSelected
                                                    ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/30 transform scale-[1.02]'
                                                    : 'bg-white/50 dark:bg-slate-900/50 border-slate-200/50 hover:bg-white hover:border-indigo-300'
                                                }
                                                ${props.initialData ? 'cursor-not-allowed opacity-80' : ''}
                                            `}
                                        >
                                            <div className={`
                                                w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mr-4 transition-colors
                                                ${isSelected ? 'bg-white text-indigo-600' : 'bg-indigo-100 text-indigo-600 dark:bg-slate-800 dark:text-slate-200'}
                                            `}>
                                                {user.full_name ? user.full_name.charAt(0) : user.email.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                                                    {user.full_name || 'Unknown User'}
                                                </p>
                                                <p className={`text-xs truncate ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                                                    {user.email}
                                                </p>
                                                <p className={`text-[10px] font-black uppercase tracking-wider mt-1 ${isSelected ? 'text-indigo-200' : 'text-indigo-500'}`}>
                                                    {user.role || 'Agent'}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <div className="absolute top-4 right-4">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium px-2">
                                * {selectedAssignees.length} agent{selectedAssignees.length !== 1 ? 's' : ''} receive this objective.
                            </p>
                        </div>
                    )}

                    {/* Core Type & Value Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label htmlFor="target_type" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Vector Type</Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <SelectNative
                                    id="target_type"
                                    name="target_type"
                                    required
                                    defaultValue={props.initialData?.target_type || "revenue"}
                                    className="h-14 pl-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900 dark:text-slate-100"
                                >
                                    <option value="revenue" className="text-slate-900 bg-white">Capital: Revenue Yield</option>
                                    <option value="activity" className="text-slate-900 bg-white">Operational: Activity Quota</option>
                                </SelectNative>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Label htmlFor="target_value" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Achievement Threshold</Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <Input
                                    id="target_value"
                                    name="target_value"
                                    type="number"
                                    step="0.01"
                                    required
                                    defaultValue={props.initialData?.target_value}
                                    placeholder="e.g. 50000"
                                    className="h-14 pl-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-2xl font-black text-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Incentive Section */}
                    <div className="space-y-4">
                        <Label htmlFor="incentive_amount" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Incentive Payload (Reward)</Label>
                        <Input
                            id="incentive_amount"
                            name="incentive_amount"
                            type="number"
                            step="0.01"
                            defaultValue={props.initialData?.incentive_amount}
                            placeholder="Optional bonus amount in INR"
                            className="h-14 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-2xl px-6 text-emerald-600 font-bold placeholder:text-slate-400"
                        />
                    </div>

                    {/* Period Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-white/5">
                        <div className="space-y-4">
                            <Label htmlFor="period_type" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Temporal Cycle</Label>
                            <SelectNative
                                id="period_type"
                                name="period_type"
                                required
                                defaultValue={props.initialData?.period_type || "month"}
                                className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl font-bold text-slate-900 dark:text-slate-100"
                            >
                                <option value="month" className="text-slate-900 bg-white">Monthly Cycle</option>
                                <option value="quarter" className="text-slate-900 bg-white">Quarterly Phase</option>
                                <option value="year" className="text-slate-900 bg-white">Fiscal Year</option>
                            </SelectNative>
                        </div>
                        <div className="space-y-4">
                            <Label htmlFor="period_start" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Activation
                            </Label>
                            <Input
                                id="period_start"
                                name="period_start"
                                type="date"
                                required
                                defaultValue={formatDate(props.initialData?.period_start)}
                                className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl font-medium text-slate-900 dark:text-slate-100"
                            />
                        </div>
                        <div className="space-y-4">
                            <Label htmlFor="period_end" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Termination
                            </Label>
                            <Input
                                id="period_end"
                                name="period_end"
                                type="date"
                                required
                                defaultValue={formatDate(props.initialData?.period_end)}
                                className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl font-medium text-slate-900 dark:text-slate-100"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-indigo-500/5 border-t border-white/10 flex flex-col sm:flex-row justify-end gap-4">
                    <Link href="/crm/targets" className="flex-1 sm:flex-none">
                        <Button type="button" variant="ghost" className="w-full sm:w-auto h-14 px-8 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-slate-500">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={loading} className="flex-1 sm:flex-none h-14 px-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 border-none group">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Syncing...
                            </>
                        ) : (
                            <>
                                {props.initialData ? 'Update Parameters' : 'Locked & Synchronize Target'}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Intelligent Help Footer */}
            <div className="mt-8 px-8 flex items-start gap-4 text-slate-500 bg-white/20 dark:bg-slate-900/20 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-indigo-500/10">
                    <Zap className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-1">Target Intelligence Tip</h4>
                    <p className="text-[10px] font-medium leading-relaxed">
                        Setting a specific, time-bound revenue objective increases achievement probability by 42%. Ensure your termination date aligns with fiscal reporting periods for optimal analytical accuracy.
                    </p>
                </div>
            </div>
        </form>
    )
}

