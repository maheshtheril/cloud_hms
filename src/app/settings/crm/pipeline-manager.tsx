'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { upsertPipeline, deletePipeline, upsertStage, deleteStage } from '@/app/actions/crm/masters'
import { Trash2, Plus, Edit, List, GripVertical } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

function StageManager({ pipeline }: { pipeline: any }) {
    const [stages, setStages] = useState<any[]>(pipeline.stages || [])
    // We rely on Props mostly but for instant UI update we might want local state or just nextjs revalidate.
    // Simplifying to trigger revalidate via actions.

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
            sort_order: editing ? editing.sort_order : (stages.length + 1)
        })
        setLoading(false)
        setIsDialogOpen(false)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Stages</h4>
                <Button size="sm" variant="outline" onClick={handleAdd}>
                    <Plus className="w-3 h-3 mr-1" /> Add Stage
                </Button>
            </div>

            <div className="space-y-2">
                {pipeline.stages?.map((stage: any) => (
                    <div key={stage.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100">
                        <div className="flex items-center gap-3">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <div>
                                <div className="font-medium text-sm">{stage.name}</div>
                                <div className="text-xs text-gray-500">
                                    {stage.type} • {stage.probability}%
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(stage)}>
                                <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteStage(stage.id)}>
                                <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Stage' : 'Add Stage'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Stage Name</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="won">Won</SelectItem>
                                    <SelectItem value="lost">Lost</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Probability (%)</Label>
                            <Input type="number" min="0" max="100" value={prob} onChange={e => setProb(Number(e.target.value))} />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full">Save</Button>
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

    // For expanding pipeline details/stages
    const [expanded, setExpanded] = useState<string | null>(null)

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
        await upsertPipeline({ id: editing?.id, name })
        setIsDialogOpen(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Sales Pipelines</h3>
                <Button onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Pipeline
                </Button>
            </div>

            <div className="space-y-4">
                {pipelines.map(pipeline => (
                    <Card key={pipeline.id} className="overflow-hidden">
                        <div className="p-4 flex items-center justify-between bg-white border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-800">{pipeline.name}</span>
                                {pipeline.is_default && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Default</span>}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setExpanded(expanded === pipeline.id ? null : pipeline.id)}>
                                    {expanded === pipeline.id ? 'Hide Stages' : 'Manage Stages'}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(pipeline)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => deletePipeline(pipeline.id)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                        {expanded === pipeline.id && (
                            <CardContent className="bg-gray-50/50 p-6 pt-6">
                                <StageManager pipeline={pipeline} />
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>

            {/* Pipeline Upsert Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Pipeline' : 'New Pipeline'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Pipeline Name</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full">Save Pipeline</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
