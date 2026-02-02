'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export type AdministrativeUnit = {
    id: string
    name: string
    type: string
    code: string | null
    is_active: boolean
    children?: AdministrativeUnit[]
}

/**
 * Fetches the full administrative hierarchy for a given country.
 * Returns a nested tree structure: Country -> States -> Districts -> etc.
 */
export async function getAdministrativeHierarchy(countryId: string) {
    const session = await auth()
    if (!session?.user) return { success: false, error: "Unauthorized" }

    try {
        // 1. Fetch Country Info
        const country = await prisma.countries.findUnique({
            where: { id: countryId },
            select: { id: true, name: true, iso2: true, flag: true }
        })

        if (!country) return { success: false, error: "Country not found" }

        // 2. Fetch All Subdivisions for this Country
        // Order by type to help with processing, but mainly we rely on parent_id
        const subdivisions = await prisma.country_subdivision.findMany({
            where: { country_id: countryId },
            orderBy: { name: 'asc' }
        })

        // 3. Build Tree
        const rootUnits: AdministrativeUnit[] = []
        const map = new Map<string, AdministrativeUnit>()

        // Initialize all nodes
        subdivisions.forEach(sub => {
            map.set(sub.id, {
                id: sub.id,
                name: sub.name,
                type: sub.type,
                code: sub.code,
                is_active: sub.is_active,
                children: []
            })
        })

        // Link parent-child
        subdivisions.forEach(sub => {
            const node = map.get(sub.id)!
            if (sub.parent_id && map.has(sub.parent_id)) {
                map.get(sub.parent_id)!.children!.push(node)
            } else {
                // Top level subdivision (usually State/Province)
                rootUnits.push(node)
            }
        })

        return { success: true, data: { country, hierarchy: rootUnits } }

    } catch (error) {
        console.error("Error fetching hierarchy:", error)
        return { success: false, error: "Failed to load geography data" }
    }
}

/**
 * Toggles the active status of a subdivision (and optionally its children)
 */
export async function toggleSubdivisionStatus(id: string, isActive: boolean, includeChildren: boolean = false) {
    const session = await auth()
    if (!session?.user?.isTenantAdmin) return { success: false, error: "Unauthorized" }

    try {
        // Update the node itself
        await prisma.country_subdivision.update({
            where: { id },
            data: { is_active: isActive }
        })

        if (includeChildren) {
            await updateChildrenRecursively(id, isActive)
        }

        revalidatePath('/settings/geography')
        return { success: true }
    } catch (error) {
        console.error("Error toggling status:", error)
        return { success: false, error: "Failed to update status" }
    }
}

async function updateChildrenRecursively(parentId: string, isActive: boolean) {
    const children = await prisma.country_subdivision.findMany({
        where: { parent_id: parentId },
        select: { id: true }
    })

    if (children.length === 0) return

    await prisma.country_subdivision.updateMany({
        where: { parent_id: parentId },
        data: { is_active: isActive }
    })

    for (const child of children) {
        await updateChildrenRecursively(child.id, isActive)
    }
}

export async function getCompanyCountry() {
    const session = await auth()
    if (!session?.user?.companyId) return null

    const company = await prisma.company.findUnique({
        where: { id: session.user.companyId },
        select: { country_id: true }
    })
    return company?.country_id
}
