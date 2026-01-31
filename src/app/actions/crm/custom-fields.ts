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
    field_type: z.enum(['text', 'number', 'boolean', 'select', 'date', 'file', 'multi-file', 'textarea']),
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

    const key = label.toLowerCase().replace(/[^a-z0-9]/g, '_')

    try {
        if (id) {
            await prisma.crm_custom_fields.update({
                where: { id },
                data: {
                    label,
                    field_type,
                    options,
                    required,
                    sort_order
                }
            })
        } else {
            const existing = await prisma.crm_custom_fields.findFirst({
                where: {
                    tenant_id: session.user.tenantId,
                    entity_type: entity,
                    key
                }
            })

            let finalKey = key
            if (existing) {
                finalKey = `${key}_${Date.now()}`
            }

            const maxSort = await prisma.crm_custom_fields.aggregate({
                where: { tenant_id: session.user.tenantId, entity_type: entity },
                _max: { sort_order: true }
            })
            const nextSort = (maxSort._max.sort_order || 0) + 1

            await prisma.crm_custom_fields.create({
                data: {
                    tenant_id: session.user.tenantId,
                    entity_type: entity,
                    key: finalKey,
                    label,
                    field_type,
                    options,
                    required,
                    sort_order: sort_order ?? nextSort
                }
            })
        }

        revalidatePath('/settings/custom-fields')
        revalidatePath(`/crm/${entity}s/new`)
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
        await prisma.crm_custom_fields.delete({
            where: { id }
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

    const definitions = await prisma.crm_custom_fields.findMany({
        where: {
            tenant_id: session.user.tenantId,
            entity_type: entity,
            deleted_at: null
        },
        orderBy: {
            sort_order: 'asc'
        }
    })

    return definitions
}

export async function processCustomFields(formData: FormData, tenantId: string, entityId: string, entityType: string) {
    const definitions = await prisma.crm_custom_fields.findMany({
        where: {
            tenant_id: tenantId,
            entity_type: entityType
        }
    })

    const ops = []

    for (const def of definitions) {
        const rawValue = formData.get(`custom_${def.key}`)

        let valueText = null
        let valueNumber = null
        let valueBoolean = null
        let valueJson = null

        if ((def.field_type === 'file' || def.field_type === 'multi-file') && rawValue) {
            const files = def.field_type === 'multi-file' ? formData.getAll(`custom_${def.key}`) : [rawValue]
            const uploadedFiles = []

            for (const file of files) {
                if (file instanceof File && file.size > 0) {
                    const uploadFormData = new FormData()
                    uploadFormData.append('file', file)
                    const uploadResult = await uploadFile(uploadFormData, 'crm-attachments')
                    if (uploadResult.success) {
                        uploadedFiles.push({
                            url: uploadResult.url,
                            filename: uploadResult.filename,
                            size: uploadResult.size,
                            type: uploadResult.type
                        })
                    }
                }
            }

            if (uploadedFiles.length > 0) {
                if (def.field_type === 'file') {
                    valueText = uploadedFiles[0].url
                    valueJson = { filename: uploadedFiles[0].filename, size: uploadedFiles[0].size, type: uploadedFiles[0].type }
                } else {
                    valueJson = { files: uploadedFiles }
                    valueText = `${uploadedFiles.length} file(s) uploaded`
                }
            }
        } else if (def.field_type === 'number') {
            if (rawValue !== null && rawValue !== '') valueNumber = Number(rawValue)
        } else if (def.field_type === 'boolean') {
            valueBoolean = rawValue === 'on' || rawValue === 'true'
        } else {
            if (rawValue && typeof rawValue === 'string') {
                valueText = rawValue
            }
        }

        if (valueText !== null || valueNumber !== null || valueBoolean !== null || valueJson !== null) {
            ops.push(prisma.crm_custom_values.upsert({
                where: {
                    field_id_record_id: {
                        field_id: def.id,
                        record_id: entityId
                    }
                },
                update: {
                    value_text: valueText,
                    value_number: valueNumber,
                    value_boolean: valueBoolean,
                    value_json: valueJson ?? undefined
                },
                create: {
                    field_id: def.id,
                    record_id: entityId,
                    value_text: valueText,
                    value_number: valueNumber,
                    value_boolean: valueBoolean,
                    value_json: valueJson ?? undefined
                }
            }))
        }
    }

    if (ops.length > 0) {
        await prisma.$transaction(ops)
        console.log(`✅ Processed ${ops.length} custom fields for ${entityType} ${entityId}`)
    }
}

export async function getCustomFieldValues(recordId: string) {
    return prisma.crm_custom_values.findMany({
        where: { record_id: recordId },
        include: {
            field: true
        }
    })
}
