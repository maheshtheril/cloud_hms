
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Trash2, Edit2, Check, X, Target } from 'lucide-react'
import { upsertTargetType } from '@/app/actions/crm/masters'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function TargetTypeManager({ data }: { data: any[] }) {
    const router = useRouter()
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const handleSave = async (id?: string) => {
        if (!name.trim()) return
        const result = await upsertTargetType({ id, name, description })
        if (result.success) {
            toast.success('Target Type saved successfully')
            setIsAdding(false)
            setEditingId(null)
            setName('')
            setDescription('')
            router.refresh()
        } else {
            toast.error(result.error || 'Failed to save')
        }
    }

    return (
        <Card className="border border-slate-200/50 dark:border-white/10 shadow-2xl rounded-[2rem] overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b border-slate-200/50 dark:border-white/5">
                <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2 text-indigo-600">
                        <Target className="w-6 h-6" />
                        Target Classifications
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                        Define strategic entity types for lead categorization
                    </CardDescription>
                </div>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] px-6">
                        <Plus className="w-4 h-4 mr-2" /> Initialize Type
                    </Button>
                )}
            </CardHeader>
            <CardContent className="pt-6">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-200/50 dark:border-white/5 hover:bg-transparent">
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classification Name</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Strategic Context</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isAdding && (
                            <TableRow className="bg-indigo-500/5 border-indigo-500/20">
                                <TableCell>
                                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Enterprise" className="h-10 rounded-lg bg-white dark:bg-slate-900 border-indigo-500/30" />
                                </TableCell>
                                <TableCell>
                                    <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="h-10 rounded-lg bg-white dark:bg-slate-900 border-indigo-500/30" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="ghost" className="h-10 w-10 text-emerald-500" onClick={() => handleSave()}>
                                            <Check className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-10 w-10 text-rose-500" onClick={() => setIsAdding(false)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {data.map((item) => (
                            <TableRow key={item.id} className="border-slate-200/50 dark:border-white/5 hover:bg-slate-500/5 transition-colors">
                                <TableCell>
                                    {editingId === item.id ? (
                                        <Input value={name} onChange={e => setName(e.target.value)} className="h-10 rounded-lg" />
                                    ) : (
                                        <span className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingId === item.id ? (
                                        <Input value={description} onChange={e => setDescription(e.target.value)} className="h-10 rounded-lg" />
                                    ) : (
                                        <span className="text-slate-500 text-sm font-medium">{item.description || 'No context provided.'}</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {editingId === item.id ? (
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" className="h-10 w-10 text-emerald-500" onClick={() => handleSave(item.id)}>
                                                <Check className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400" onClick={() => setEditingId(null)}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-indigo-600" onClick={() => {
                                                setEditingId(item.id)
                                                setName(item.name)
                                                setDescription(item.description || '')
                                            }}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
