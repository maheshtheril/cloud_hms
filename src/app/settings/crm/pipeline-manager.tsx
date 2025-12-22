'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { upsertPipeline, deletePipeline, upsertStage, deleteStage } from '@/app/actions/crm/masters'
import { Trash2, Plus, Edit, GripVertical, Check, X, GitCommit } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription as CardDesc } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

function StageManager({ pipeline }: { pipeline: any }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editing, setEditing] = useState<any>(null)
    const [name, setName] = useState('')
    const [type, setType] = useState('open')
    const [prob, setProb] = useState(10)
    const [loading, setLoading] = useState(false)

    const handleAdd = () => {
        setEditing(null)
        setName('')
        setType('open')
        setProb(10)
        setIsDialogOpen(true)
    }

    const handleEdit = (stage: any) => {
        setEditing(stage)
        setName(stage.name)
        setType(stage.type)
        setProb(stage.probability || 0)
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await upsertStage({
            id: editing?.id,
            pipeline_id: pipeline.id,
            name,
            type,
            probability: Number(prob),
            sort_order: editing ? editing.sort_order : ((pipeline.stages?.length || 0) + 1)
        })
        setLoading(false)
        setIsDialogOpen(false)
    }

    const getStageColor = (type: string) => {
        switch (type) {
            case 'won': return 'bg-green-100 text-green-700 border-green-200'
            case 'lost': return 'bg-red-100 text-red-700 border-red-200'
            default: return 'bg-blue-50 text-blue-700 border-blue-200'
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2">
                    <GitCommit className="h-4 w-4 text-slate-500" />
                    <h4 className="text-sm font-medium text-slate-700">Pipeline Stages</h4>
                </div>
                <Button size="sm" variant="secondary" onClick={handleAdd} className="h-8 text-xs">
                    <Plus className="w-3 h-3 mr-1" /> Add Stage
                </Button>
            </div>

            <div className="space-y-2">
                {pipeline.stages?.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-sm italic">
                        No stages defined. Add the first stage to get started.
                    </div>
                )}
                {pipeline.stages?.map((stage: any) => (
                    <div key={stage.id} className="group flex items-center justify-between p-3 bg-white hover:bg-slate-50 rounded-md border border-slate-200 shadow-sm transition-all duration-200">
                        <div className="flex items-center gap-3">
                            <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-500 cursor-move" />
                            <div>
                                <div className="font-medium text-sm text-slate-900">{stage.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 border-0 ${getStageColor(stage.type)}`}>
                                        {stage.type.toUpperCase()}
                                    </Badge>
                                    <span className="text-xs text-slate-500">{stage.probability}% Probability</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(stage)}>
                                <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteStage(stage.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Stage' : 'Add New Stage'}</DialogTitle>
                        <DialogDescription>
                            Define the stage properties. Probabilities help in forecasting revenue.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium uppercase text-slate-500">Stage Name</Label>
                                <Input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    className="focus-visible:ring-indigo-500"
                                    placeholder="e.g. Qualified, Negotiation"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium uppercase text-slate-500">Stage Type</Label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="open">Open</SelectItem>
                                            <SelectItem value="won">Won (Closed)</SelectItem>
                                            <SelectItem value="lost">Lost (Closed)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium uppercase text-slate-500">Probability (%)</Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={prob}
                                            onChange={e => setProb(Number(e.target.value))}
                                            className="pr-8"
                                        />
                                        <span className="absolute right-3 top-2.5 text-slate-400 text-sm">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                {loading ? 'Saving...' : 'Save Stage'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function PipelineManager({ pipelines }: { pipelines: any[] }) {
    const [editing, setEditing] = useState<any>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [name, setName] = useState('')
    const [expanded, setExpanded] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleEdit = (p: any) => {
        setEditing(p)
        setName(p.name)
        setIsDialogOpen(true)
    }

    const handleAdd = () => {
        setEditing(null)
        setName('')
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await upsertPipeline({ id: editing?.id, name })
        setLoading(false)
        setIsDialogOpen(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Sales Pipelines</h3>
                    <p className="text-sm text-slate-500">Configure different sales processes for your products or services.</p>
                </div>
                <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Pipeline
                </Button>
            </div>

            <div className="grid gap-6">
                {pipelines.map(pipeline => (
                    <Card key={pipeline.id} className="overflow-hidden border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                        <CardHeader className="bg-white border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between space-y-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <GitCommit className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                                        {pipeline.name}
                                        {pipeline.is_default && <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100">Default</Badge>}
                                    </CardTitle>
                                    <CardDesc className="text-xs mt-0.5">
                                        {pipeline.stages?.length || 0} Stages defined
                                    </CardDesc>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setExpanded(expanded === pipeline.id ? null : pipeline.id)} className={expanded === pipeline.id ? "bg-slate-100 border-slate-300" : ""}>
                                    {expanded === pipeline.id ? 'Close Designer' : 'Visualize & Edit'}
                                </Button>
                                <Separator orientation="vertical" className="h-6 mx-1" />
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={() => handleEdit(pipeline)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600" onClick={() => deletePipeline(pipeline.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        {expanded === pipeline.id && (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <div className="bg-slate-50/50 p-6 border-b border-slate-100">
                                    <StageManager pipeline={pipeline} />
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Pipeline' : 'Create New Pipeline'}</DialogTitle>
                        <DialogDescription>
                            Pipelines represent your sales process. You can define specific stages after creating the pipeline.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium uppercase text-slate-500">Pipeline Name</Label>
                            <Input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                className="focus-visible:ring-indigo-500"
                                placeholder="e.g. Enterprise Sales, Partnership"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                {loading ? 'Saving...' : editing ? 'Update Pipeline' : 'Create Pipeline'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
