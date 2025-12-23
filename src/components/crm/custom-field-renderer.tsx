'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

export type CustomFieldDefinition = {
    id: string
    key: string
    label: string
    field_type: string // text, number, date, boolean, select, textarea, file
    options?: any // JSON for select options
    required?: boolean
    metadata?: any
}

export function CustomFieldRenderer({ field }: { field: CustomFieldDefinition }) {
    const name = `custom_${field.key}`
    const isRequired = field.required || false

    if (field.field_type === 'textarea') {
        return (
            <div className="space-y-2">
                <Label htmlFor={name}>{field.label} {isRequired && <span className="text-red-500">*</span>}</Label>
                <Textarea id={name} name={name} required={isRequired} placeholder={`Enter ${field.label}`} className="bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-slate-900 dark:text-white" />
            </div>
        )
    }

    if (field.field_type === 'select') {
        const options = field.options?.values || [] // Assuming { values: [{label, value}] } or simple array
        return (
            <div className="space-y-2">
                <Label htmlFor={name}>{field.label} {isRequired && <span className="text-red-500">*</span>}</Label>
                <select
                    name={name}
                    id={name}
                    required={isRequired}
                    className="flex h-10 w-full rounded-xl border border-slate-200/50 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 dark:text-white"
                >
                    <option value="">Select {field.label}</option>
                    {Array.isArray(options) && options.map((opt: any) => (
                        <option key={opt.value || opt} value={opt.value || opt}>
                            {opt.label || opt}
                        </option>
                    ))}
                </select>
            </div>
        )
    }

    if (field.field_type === 'boolean') {
        return (
            <div className="flex items-center space-x-2 pt-8">
                <Checkbox id={name} name={name} />
                <Label htmlFor={name}>{field.label}</Label>
            </div>
        )
    }

    if (field.field_type === 'date') {
        // Using native date picker for simplicity in forms, 
        // passing date string to server
        return (
            <div className="space-y-2">
                <Label htmlFor={name}>{field.label} {isRequired && <span className="text-red-500">*</span>}</Label>
                <Input type="date" id={name} name={name} required={isRequired} className="bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-slate-900 dark:text-white" />
            </div>
        )
    }

    if (field.field_type === 'file') {
        return (
            <div className="space-y-2">
                <Label htmlFor={name}>{field.label} {isRequired && <span className="text-red-500">*</span>}</Label>
                <Input type="file" id={name} name={name} required={isRequired} className="cursor-pointer bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-slate-900 dark:text-white" />
                <p className="text-xs text-gray-500">Upload {field.label} document</p>
            </div>
        )
    }

    // Default to text / number
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{field.label} {isRequired && <span className="text-red-500">*</span>}</Label>
            <Input
                type={field.field_type === 'number' ? 'number' : 'text'}
                id={name}
                name={name}
                required={isRequired}
                placeholder={`Enter ${field.label}`}
                className="bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-slate-900 dark:text-white"
            />
        </div>
    )
}
