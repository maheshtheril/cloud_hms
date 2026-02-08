'use server'

import { auth } from "@/auth"

export type AdministrativeUnit = {
    id: string
    name: string
    type: string
    code: string | null
    is_active: boolean
    children?: AdministrativeUnit[]
}

/**
 * TODO: Geography features require country_subdivision table in schema.prisma
 * These are stub implementations until the schema is updated
 */

export async function getAdministrativeHierarchy(countryId: string) {
    const session = await auth()
    if (!session?.user) return { success: false, error: "Unauthorized" }

    return {
        success: true,
        country: { id: countryId, name: "Country", iso2: "XX", flag: "🏳️" },
        hierarchy: []
    }
}

export async function toggleSubdivisionStatus(subdivisionId: string) {
    const session = await auth()
    if (!session?.user) return { success: false, error: "Unauthorized" }

    return { success: true }
}

export async function createSubdivision(data: {
    country_id: string
    parent_id?: string | null
    name: string
    type: string
    code?: string | null
}) {
    const session = await auth()
    if (!session?.user) return { success: false, error: "Unauthorized" }

    return { success: true, subdivision: { id: "stub", ...data } }
}

export async function deleteSubdivision(subdivisionId: string) {
    const session = await auth()
    if (!session?.user) return { success: false, error: "Unauthorized" }

    return { success: true }
}

export async function getCountries() {
    const session = await auth()
    if (!session?.user) return []

    // TODO: Return actual countries when country table is added
    return []
}

export async function getCompanyCountry() {
    const session = await auth()
    if (!session?.user) return null

    // TODO: Return actual company country when geography tables are added
    return null
}

export async function getSubdivisions(countryId?: string, parentId?: string | null) {
    const session = await auth()
    if (!session?.user) return { success: false, error: "Unauthorized" }

    return { success: true, subdivisions: [] }
}
