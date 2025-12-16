'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { upsertCustomFieldDefinition } from '@/app/actions/crm/custom-fields'
import { Plus } from 'lucide-react'

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
            alert(res.error)
        } else {
            setOpen(false)
            if (onOpenChange) onOpenChange(false)
            // Toast success
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

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Field
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{existingField ? 'Edit Field' : 'Add New Field'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Field Label</Label>
                        <Input
                            value={label}
                            onChange={e => setLabel(e.target.value)}
                            placeholder="e.g. Budget Approved"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={fieldType} onValueChange={setFieldType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="boolean">Checkbox (Yes/No)</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="select">Select Dropdown</SelectItem>
                                <SelectItem value="textarea">Multi-line Text</SelectItem>
                                <SelectItem value="file">File Upload</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {fieldType === 'select' && (
                        <div className="space-y-2">
                            <Label>Options (comma separated)</Label>
                            <Textarea
                                value={optionsStr}
                                onChange={e => setOptionsStr(e.target.value)}
                                placeholder="Option 1, Option 2, Option 3"
                            />
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="req"
                            checked={required}
                            onCheckedChange={(c) => setRequired(!!c)}
                        />
                        <Label htmlFor="req">Required Field</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="vis"
                            checked={visible}
                            onCheckedChange={(c) => setVisible(!!c)}
                        />
                        <Label htmlFor="vis">Visible in Forms</Label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Field'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
