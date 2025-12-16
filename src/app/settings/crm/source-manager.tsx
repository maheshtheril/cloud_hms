'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { upsertSource, deleteSource } from '@/app/actions/crm/masters'
import { Trash2, Plus, Edit } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

export function SourceManager({ sources }: { sources: any[] }) {
    const [editing, setEditing] = useState<any>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')

    const handleEdit = (source: any) => {
        setEditing(source)
        setName(source.name)
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
        await upsertSource({ id: editing?.id, name })
        setLoading(false)
        setIsDialogOpen(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this source?')) return
        await deleteSource(id)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Lead Sources</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAdd}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Source
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editing ? 'Edit Source' : 'New Source'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Source Name</Label>
                                <Input value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'Saving...' : 'Save'}
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
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sources.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center text-gray-500">No sources defined.</TableCell>
                            </TableRow>
                        ) : (
                            sources.map(source => (
                                <TableRow key={source.id}>
                                    <TableCell>{source.name}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(source)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(source.id)}>
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
