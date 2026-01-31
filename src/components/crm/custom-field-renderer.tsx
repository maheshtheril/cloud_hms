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
    currentValue?: any
}

export function CustomFieldRenderer({ field }: { field: CustomFieldDefinition }) {
    const name = `custom_${field.key}`
    const isRequired = field.required || false
    const valObj = field.currentValue

    // Helper to get the actual value based on field type
    const getVal = () => {
        if (!valObj) return undefined
        if (field.field_type === 'number') return valObj.value_number
        if (field.field_type === 'boolean') return valObj.value_boolean
        if (field.field_type === 'date') {
            if (!valObj.value_date) return undefined
            return new Date(valObj.value_date).toISOString().split('T')[0]
        }
        return valObj.value_text
    }

    const value = getVal()

    if (field.field_type === 'textarea') {
        return (
            <div className="space-y-2">
                <Label htmlFor={name}>{field.label} {isRequired && <span className="text-red-500">*</span>}</Label>
                <Textarea id={name} name={name} required={isRequired} defaultValue={value} placeholder={`Enter ${field.label}`} className="bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-slate-900 dark:text-white" />
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
                    defaultValue={value}
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
                <Checkbox id={name} name={name} defaultChecked={!!value} />
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
                <Input type="date" id={name} name={name} required={isRequired} defaultValue={value} className="bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-slate-900 dark:text-white" />
            </div>
        )
    }

    if (field.field_type === 'file' || field.field_type === 'multi-file') {
        const isMulti = field.field_type === 'multi-file'
        return (
            <div className="space-y-2">
                <Label htmlFor={name}>{field.label} {isRequired && <span className="text-red-500">*</span>}</Label>

                {valObj?.value_json && (
                    <div className="mb-2 p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                        <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-2">Current Files</p>
                        <ul className="space-y-1">
                            {field.field_type === 'multi-file' && (valObj.value_json as any).files ? (
                                (valObj.value_json as any).files.map((f: any, i: number) => (
                                    <li key={i}>
                                        <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-2">
                                            📎 {f.filename || 'File'} ({Math.round(f.size / 1024)} KB)
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <a href={valObj.value_text} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-2">
                                        📎 {(valObj.value_json as any).filename || 'View File'}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                <div className="group relative">
                    <Input
                        type="file"
                        id={name}
                        name={name}
                        required={isRequired && !valObj}
                        multiple={isMulti}
                        className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-slate-900 dark:text-white transition-all overflow-hidden"
                    />
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold px-1">
                    {valObj ? 'Upload to replace existing' : (isMulti ? `Upload one or more ${field.label} documents` : `Upload ${field.label} document`)}
                </p>
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
                defaultValue={value}
                placeholder={`Enter ${field.label}`}
                className="bg-white/50 dark:bg-slate-900/50 border-slate-200/50 rounded-xl text-slate-900 dark:text-white"
            />
        </div>
    )
}
