'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, Plus, Edit, XCircle, Search, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

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
    const [searchTerm, setSearchTerm] = useState('')

    const filteredData = data.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))

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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Lost Reasons</h3>
                    <p className="text-sm text-slate-500">Analyze why opportunities are being lost.</p>
                </div>
                <Button onClick={handleAdd} className="bg-red-600 hover:bg-red-700 shadow-sm text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Reason
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Filter reasons..."
                            className="pl-9 bg-white border-slate-200 focus-visible:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[250px]">Reason Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center text-slate-500 italic">
                                        No reasons found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map(item => (
                                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-red-50 text-red-600 rounded-md">
                                                    <AlertCircle className="w-4 h-4" />
                                                </div>
                                                {item.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-500 max-w-md truncate">
                                            {item.description || <span className="text-slate-300 italic">No description</span>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={() => handleEdit(item)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Reason' : 'New Lost Reason'}</DialogTitle>
                        <DialogDescription>
                            Define a standardized reason for a lost deal to help with future analysis.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium uppercase text-slate-500">Reason Name</Label>
                                <Input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    className="focus-visible:ring-indigo-500"
                                    placeholder="e.g. Price too high, Feature gap"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium uppercase text-slate-500">Description</Label>
                                <Textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Explain when to select this reason..."
                                    className="resize-none h-24 focus-visible:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
                                {loading ? 'Saving...' : 'Save Reason'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
