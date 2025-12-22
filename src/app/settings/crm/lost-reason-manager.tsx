'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, Plus, Edit, XCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface Props {
    data: any[]
    onSave: (data: any) => Promise<any>
    onDelete: (id: string) => Promise<any>
}

export function LostReasonManager({ data, onSave, onDelete }: Props) {
    const [editing, setEditing] = useState<any>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const handleEdit = (item: any) => {
        setEditing(item)
        setName(item.name)
        setDescription(item.description || '')
        setIsDialogOpen(true)
    }

    const handleAdd = () => {
        setEditing(null)
        setName('')
        setDescription('')
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await onSave({ id: editing?.id, name, description })
        setLoading(false)
        setIsDialogOpen(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this reason?')) return
        await onDelete(id)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-medium">Lost Deal Reasons</h3>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAdd} variant="outline" className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Reason
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editing ? 'Edit Reason' : 'New Lost Reason'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Reason Name</Label>
                                <Input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Too Expensive, Competitor" />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Context..." />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                                {loading ? 'Saving...' : 'Save Reason'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-gray-500">No lost reasons defined.</TableCell>
                            </TableRow>
                        ) : (
                            data.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-slate-500 text-sm">{item.description}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
