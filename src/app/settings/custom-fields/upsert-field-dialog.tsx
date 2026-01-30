'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { upsertCustomFieldDefinition } from '@/app/actions/crm/custom-fields'
import { Plus } from 'lucide-react'

import { toast } from 'sonner'

export function UpsertFieldDialog({
    entity = 'lead',
    trigger,
    existingField = null,
    onOpenChange
}: {
    entity?: string,
    trigger?: React.ReactNode,
    existingField?: any,
    onOpenChange?: (open: boolean) => void
}) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form State
    const [label, setLabel] = useState(existingField?.label || '')
    const [fieldType, setFieldType] = useState(existingField?.field_type || 'text')
    const [optionsStr, setOptionsStr] = useState(existingField?.options?.values ? existingField.options.values.join(', ') : '')
    const [required, setRequired] = useState(existingField?.required || false)
    const [visible, setVisible] = useState(existingField?.visible ?? true)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        let options = null
        if (fieldType === 'select') {
            options = { values: optionsStr.split(',').map((s: string) => s.trim()).filter(Boolean) }
        }

        const res = await upsertCustomFieldDefinition({
            id: existingField?.id,
            entity,
            label,
            field_type: fieldType,
            options,
            required,
            visible
        })

        setLoading(false)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success(existingField ? "Field updated" : "Field added")
            setOpen(false)
            if (onOpenChange) onOpenChange(false)
            router.refresh()
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (onOpenChange) onOpenChange(newOpen)

        // Reset form on close if it was an "Add" dialog (no existing field)
        if (!newOpen && !existingField) {
            setLabel('')
            setFieldType('text')
            setOptionsStr('')
            setRequired(false)
            setVisible(true)
        }
    }

    const router = useRouter()

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-indigo-600 hover:bg-indigo-700 font-bold">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Field
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-zinc-950 dark:border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold dark:text-white">
                        {existingField ? 'Edit Parameter' : 'Define New Field'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                    <div className="space-y-2">
                        <Label className="text-slate-900 dark:text-slate-200 font-bold">Field Label</Label>
                        <Input
                            value={label}
                            onChange={e => setLabel(e.target.value)}
                            placeholder="e.g. Budget Approved"
                            required
                            className="dark:bg-zinc-900"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-900 dark:text-slate-200 font-bold">Field Intelligence Type</Label>
                        <Select value={fieldType} onValueChange={setFieldType}>
                            <SelectTrigger className="dark:bg-zinc-900">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-zinc-950">
                                <SelectItem value="text">Textual Data</SelectItem>
                                <SelectItem value="number">Numeric Value</SelectItem>
                                <SelectItem value="boolean">Boolean (Yes/No)</SelectItem>
                                <SelectItem value="date">Temporal Point (Date)</SelectItem>
                                <SelectItem value="select">Dynamic Selection</SelectItem>
                                <SelectItem value="textarea">Structured Text (Multi-line)</SelectItem>
                                <SelectItem value="file">Binary Object (FileUpload)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {fieldType === 'select' && (
                        <div className="space-y-2">
                            <Label className="text-slate-900 dark:text-slate-200 font-bold">Selection Matrix (comma separated)</Label>
                            <Textarea
                                value={optionsStr}
                                onChange={e => setOptionsStr(e.target.value)}
                                placeholder="Option 1, Option 2, Option 3"
                                className="dark:bg-zinc-900"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
                            <Checkbox
                                id="req"
                                checked={required}
                                onCheckedChange={(c) => setRequired(!!c)}
                            />
                            <Label htmlFor="req" className="text-xs font-bold dark:text-slate-300 cursor-pointer">Strict Required</Label>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
                            <Checkbox
                                id="vis"
                                checked={visible}
                                onCheckedChange={(c) => setVisible(!!c)}
                            />
                            <Label htmlFor="vis" className="text-xs font-bold dark:text-slate-300 cursor-pointer">Live Visible</Label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t dark:border-zinc-800">
                        <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="dark:text-slate-400">Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 px-8 font-black">
                            {loading ? 'Processing...' : 'Deploy Field'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

    )
}
