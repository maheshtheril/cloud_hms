'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { UpsertFieldDialog } from "./upsert-field-dialog"
import { deleteCustomFieldDefinition } from "@/app/actions/crm/custom-fields"
import { useState } from "react"

export function FieldList({ fields, entity }: { fields: any[], entity: string }) {
    const [deleting, setDeleting] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this field? This will hide it from future forms.")) return

        setDeleting(id)
        await deleteCustomFieldDefinition(id)
        setDeleting(null)
    }

    return (
        <div className="border rounded-md border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-zinc-900/50 border-white/10">
                        <TableHead className="font-bold text-slate-900 dark:text-slate-200">Label</TableHead>
                        <TableHead className="font-bold text-slate-900 dark:text-slate-200">Key</TableHead>
                        <TableHead className="font-bold text-slate-900 dark:text-slate-200">Type</TableHead>
                        <TableHead className="font-bold text-slate-900 dark:text-slate-200">Settings</TableHead>
                        <TableHead className="text-right font-bold text-slate-900 dark:text-slate-200">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-slate-400 dark:text-slate-600 italic">
                                No custom fields found. Add one to get started.
                            </TableCell>
                        </TableRow>
                    ) : (
                        fields.map(field => (
                            <TableRow key={field.id}>
                                <TableCell className="font-bold text-slate-900 dark:text-white">{field.label}</TableCell>
                                <TableCell className="text-slate-500 dark:text-slate-400 font-mono text-[10px] tracking-tight">{field.key}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{field.field_type}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        {field.required && <Badge variant="secondary">Required</Badge>}
                                        {!field.visible && <Badge variant="destructive">Hidden</Badge>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <UpsertFieldDialog
                                            entity={entity}
                                            existingField={field}
                                            trigger={
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            }
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(field.id)}
                                            disabled={deleting === field.id}
                                        >
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
    )
}
