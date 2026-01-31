'use server'

import { prisma } from '@/lib/prisma'

export interface GeographyNode {
    id: string
    name: string
    type: string
    parentId: string | null
}

export async function getCountries() {
    try {
        return await prisma.countries.findMany({
            where: { is_active: true },
            orderBy: { name: 'asc' },
            select: { id: true, name: true, flag: true, iso2: true }
        })
    } catch (error) {
        console.error('Error fetching countries:', error)
        return []
    }
}

export async function getSubdivisions(countryId: string, parentId: string | null = null) {
    try {
        return await prisma.country_subdivision.findMany({
            where: {
                country_id: countryId,
                parent_id: parentId,
                is_active: true
            },
            orderBy: { name: 'asc' },
            select: { id: true, name: true, type: true }
        })
    } catch (error) {
        console.error('Error fetching subdivisions:', error)
        return []
    }
}

/**
 * Seed basic geography data if it doesn't exist
 */
export async function seedBasicGeography() {
    try {
        const india = await prisma.countries.upsert({
            where: { iso2: 'IN' },
            update: {},
            create: {
                iso2: 'IN',
                iso3: 'IND',
                name: 'India',
                flag: '🇮🇳',
            }
        })

        const karnataka = await prisma.country_subdivision.upsert({
            where: { id: 'karnataka-id-placeholder' }, // This won't work with random UUIDs, but we can search by name
            update: {},
            create: {
                country_id: india.id,
                name: 'Karnataka',
                type: 'state',
            }
        })

        // Better way: find by name
        let kState = await prisma.country_subdivision.findFirst({
            where: { name: 'Karnataka', country_id: india.id }
        })

        if (!kState) {
            kState = await prisma.country_subdivision.create({
                data: {
                    country_id: india.id,
                    name: 'Karnataka',
                    type: 'state',
                }
            })
        }

        const kalaburgi = await prisma.country_subdivision.findFirst({
            where: { name: 'Kalaburgi', parent_id: kState.id }
        })

        if (!kalaburgi) {
            await prisma.country_subdivision.create({
                data: {
                    country_id: india.id,
                    parent_id: kState.id,
                    name: 'Kalaburgi',
                    type: 'district',
                }
            })
        }

        return { success: true }
    } catch (error) {
        console.error('Error seeding geography:', error)
        return { success: false, error }
    }
}
