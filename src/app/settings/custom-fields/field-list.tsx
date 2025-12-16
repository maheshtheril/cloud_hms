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
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Label</TableHead>
                        <TableHead>Key</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Settings</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                No custom fields found. Add one to get started.
                            </TableCell>
                        </TableRow>
                    ) : (
                        fields.map(field => (
                            <TableRow key={field.id}>
                                <TableCell className="font-medium">{field.label}</TableCell>
                                <TableCell className="text-gray-500 font-mono text-xs">{field.key}</TableCell>
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
