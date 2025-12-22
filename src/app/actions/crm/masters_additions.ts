
// --- LOST REASONS ---

export async function getLostReasons() {
    const session = await auth()
    if (!session?.user?.tenantId) return []

    return prisma.crm_lost_reasons.findMany({
        where: { tenant_id: session.user.tenantId, deleted_at: null },
        orderBy: { name: 'asc' }
    })
}

export async function upsertLostReason(data: { id?: string, name: string, description?: string }) {
    const session = await auth()
    if (!session?.user?.tenantId) return { error: "Unauthorized" }

    try {
        if (data.id) {
            await prisma.crm_lost_reasons.update({
                where: { id: data.id, tenant_id: session.user.tenantId },
                data: { name: data.name, description: data.description }
            })
        } else {
            await prisma.crm_lost_reasons.create({
                data: {
                    tenant_id: session.user.tenantId,
                    name: data.name,
                    description: data.description,
                    is_active: true
                }
            })
        }
        revalidatePath('/settings/crm')
        return { success: true }
    } catch (e) {
        return { error: "Failed to save lost reason" }
    }
}

export async function deleteLostReason(id: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return { error: "Unauthorized" }

    try {
        await prisma.crm_lost_reasons.update({
            where: { id, tenant_id: session.user.tenantId },
            data: { deleted_at: new Date() }
        })
        revalidatePath('/settings/crm')
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete lost reason" }
    }
}

// --- CONTACT ROLES ---

export async function getContactRoles() {
    const session = await auth()
    if (!session?.user?.tenantId) return []

    return prisma.crm_contact_roles.findMany({
        where: { tenant_id: session.user.tenantId, deleted_at: null },
        orderBy: { name: 'asc' }
    })
}

export async function upsertContactRole(data: { id?: string, name: string, description?: string }) {
    const session = await auth()
    if (!session?.user?.tenantId) return { error: "Unauthorized" }

    try {
        if (data.id) {
            await prisma.crm_contact_roles.update({
                where: { id: data.id, tenant_id: session.user.tenantId },
                data: { name: data.name, description: data.description }
            })
        } else {
            await prisma.crm_contact_roles.create({
                data: {
                    tenant_id: session.user.tenantId,
                    name: data.name,
                    description: data.description,
                    is_active: true
                }
            })
        }
        revalidatePath('/settings/crm')
        return { success: true }
    } catch (e) {
        return { error: "Failed to save contact role" }
    }
}

export async function deleteContactRole(id: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return { error: "Unauthorized" }

    try {
        await prisma.crm_contact_roles.update({
            where: { id, tenant_id: session.user.tenantId },
            data: { deleted_at: new Date() }
        })
        revalidatePath('/settings/crm')
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete contact role" }
    }
}
