'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { uploadFile } from '../upload-file'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const fieldSchema = z.object({
    id: z.string().optional(),
    entity: z.string().min(1),
    label: z.string().min(1),
    field_type: z.enum(['text', 'number', 'boolean', 'select', 'date', 'file', 'textarea']),
    options: z.any().optional(), // Text for CSV or JSON
    required: z.boolean().optional(),
    visible: z.boolean().optional(),
    sort_order: z.number().optional()
})

export async function upsertCustomFieldDefinition(data: z.infer<typeof fieldSchema>) {
    const session = await auth()
    if (!session?.user?.tenantId) return { error: "Unauthorized" }

    const parsed = fieldSchema.safeParse(data)
    if (!parsed.success) return { error: "Invalid data" }

    const { id, entity, label, field_type, options, required, visible, sort_order } = parsed.data

    // Generate key from label if new (simple slugify)
    const key = label.toLowerCase().replace(/[^a-z0-9]/g, '_')

    try {
        if (id) {
            // Update
            await prisma.custom_field_definition.update({
                where: { id },
                data: {
                    label,
                    field_type,
                    options,
                    required,
                    visible,
                    sort_order
                }
            })
        } else {
            // Create
            // Check if key exists for this entity/tenant
            const existing = await prisma.custom_field_definition.findUnique({
                where: {
                    tenant_id_entity_key: {
                        tenant_id: session.user.tenantId,
                        entity,
                        key
                    }
                }
            })

            let finalKey = key
            if (existing) {
                finalKey = `${key}_${Date.now()}` // Simple conflict resolution
            }

            // Get max sort order
            const maxSort = await prisma.custom_field_definition.aggregate({
                where: { tenant_id: session.user.tenantId, entity },
                _max: { sort_order: true }
            })
            const nextSort = (maxSort._max.sort_order || 0) + 1

            await prisma.custom_field_definition.create({
                data: {
                    tenant_id: session.user.tenantId,
                    entity,
                    key: finalKey,
                    label,
                    field_type,
                    options,
                    required,
                    visible: visible ?? true,
                    sort_order: sort_order ?? nextSort
                }
            })
        }

        revalidatePath('/settings/custom-fields')
        revalidatePath(`/crm/${entity}s/new`) // Rough heuristic
        return { success: true }
    } catch (e) {
        console.error("Upsert Field Error", e)
        return { error: "Failed to save field" }
    }
}

export async function deleteCustomFieldDefinition(id: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return { error: "Unauthorized" }

    try {
        await prisma.custom_field_definition.delete({
            where: { id, tenant_id: session.user.tenantId }
        })
        revalidatePath('/settings/custom-fields')
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete field" }
    }
}

export async function getCustomFieldDefinitions(entity: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return []

    // Fetch definitions for this tenant and entity
    const definitions = await prisma.custom_field_definition.findMany({
        where: {
            tenant_id: session.user.tenantId,
            entity: entity,
            visible: true
        },
        orderBy: {
            sort_order: 'asc'
        }
    })

    return definitions
}

// Utility to process custom field values from FormData
export async function processCustomFields(formData: FormData, tenantId: string, entityId: string, entityType: string) {
    // 1. Fetch definitions to know what to look for
    const definitions = await prisma.custom_field_definition.findMany({
        where: {
            tenant_id: tenantId,
            entity: entityType
        }
    })

    const results = []

    for (const def of definitions) {
        const rawValue = formData.get(`custom_${def.key}`)

        // Skip if not present (unless it's a boolean unchecked, but formdata usually omits)
        // For file uploads, rawValue is a File object

        let valueText = null
        let valueNumber = null
        let valueBoolean = null
        let valueJson = null

        if (def.field_type === 'file' && rawValue instanceof File && rawValue.size > 0) {
            // Handle File Upload
            // We need to re-create a FormData for the upload function specifically or call logic directly
            // Since uploadFile takes FormData, let's wrap it
            const uploadFormData = new FormData()
            uploadFormData.append('file', rawValue)

            const uploadResult = await uploadFile(uploadFormData, 'crm-attachments')
            if (uploadResult.success) {
                valueText = uploadResult.url // Store URL in text field
                valueJson = {
                    filename: uploadResult.filename,
                    size: uploadResult.size,
                    type: uploadResult.type
                }
            }
        } else if (def.field_type === 'number') {
            if (rawValue) valueNumber = Number(rawValue)
        } else if (def.field_type === 'boolean') {
            valueBoolean = rawValue === 'on' || rawValue === 'true'
        } else {
            // Text, Select, Date, etc.
            if (rawValue && typeof rawValue === 'string') {
                valueText = rawValue
            }
        }

        // Only save if we have a value (or if it was explicitly cleared? For creation we only care about values)
        if (valueText !== null || valueNumber !== null || valueBoolean !== null || valueJson !== null) {
            results.push(prisma.custom_field_value.create({
                data: {
                    tenant_id: tenantId,
                    definition_id: def.id,
                    lead_id: entityId, // Currently assuming lead_id, but schema has specific ID fields. Schema check needed.
                    // Ideally the table should have polymorphic 'entity_id' or specific columns.
                    // Schema shows: lead_id String @db.Uuid. 
                    // So currently strictly bound to Lead. WE NEED TO HANDLE THIS IF WE WANT OTHER MASTERS.
                    // For now, adhering to User Request "CRM related masters... includes leads". 
                    // If schema only has lead_id, we can only support leads easily right now.

                    value_text: valueText,
                    value_number: valueNumber,
                    value_boolean: valueBoolean,
                    value_json: valueJson
                }
            }))
        }
    }

    await Promise.all(results)
}
