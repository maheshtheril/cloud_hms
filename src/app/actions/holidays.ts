'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const holidaySchema = z.object({
    name: z.string().min(1, "Name is required"),
    date: z.string().or(z.date()), // Accepts ISO string
    type: z.enum(["NATIONAL", "REGIONAL"]),
    countryId: z.string().optional(),
    subdivisionId: z.string().optional(),
    description: z.string().optional(),
})

export async function getHolidays(tenantId: string) {
    try {
        // Fetch base holidays
        const holidays = await (prisma as any).hms_holiday.findMany({
            where: { tenant_id: tenantId },
            orderBy: { date: 'asc' }
        });

        // Manual Enrichment for Country and Subdivision
        // This is a safety net in case the Prisma 'include' fails or the model is not fully mapped.
        const enriched = await Promise.all(holidays.map(async (h: any) => {
            let country = null;
            if (h.country_id) {
                try {
                    // Try plural 'countries' table first (standard in this DB)
                    country = await (prisma as any).countries.findUnique({
                        where: { id: h.country_id }
                    });
                } catch (e) {
                    // Fallback to singular 'country' if plural fails
                    try { country = await (prisma as any).country.findUnique({ where: { id: h.country_id } }); } catch (e2) { }
                }
            }

            let subdivision = null;
            if (h.subdivision_id) {
                try {
                    subdivision = await (prisma as any).country_subdivision.findUnique({
                        where: { id: h.subdivision_id }
                    });
                } catch (e) { }
            }

            return {
                ...h,
                country,
                subdivision
            };
        }));

        return enriched;
    } catch (error) {
        console.error("Critical error in getHolidays:", error);
        // Return empty array instead of crashing the whole page
        return [];
    }
}

export async function createHoliday(tenantId: string, data: z.infer<typeof holidaySchema>) {
    const validated = holidaySchema.parse(data)

    await (prisma as any).hms_holiday.create({
        data: {
            tenant_id: tenantId,
            name: validated.name,
            date: new Date(validated.date),
            type: validated.type,
            country_id: validated.countryId || null,
            subdivision_id: validated.subdivisionId || null,
            description: validated.description,
        }
    })

    revalidatePath('/settings/holidays')
    return { success: true }
}

export async function deleteHoliday(id: string) {
    await (prisma as any).hms_holiday.delete({
        where: { id }
    })
    revalidatePath('/settings/holidays')
    return { success: true }
}

export async function getApplicableHolidays(countryId: string, subdivisionId?: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return []
    const tenantId = session.user.tenantId

    const where: any = {
        tenant_id: tenantId,
        country_id: countryId,
    }

    // Logic: Fetch National + (Regional matching subdivision OR null if strict? No, Regional needs subdivision)
    // Actually, we want: Where (Type=NATIONAL AND Country=C) OR (Type=REGIONAL AND Subdivision=S)

    // Since Prisma AND/OR filters can be complex, let's just fetch all for country and filter in memory or use OR

    return await (prisma as any).hms_holiday.findMany({
        where: {
            tenant_id: tenantId,
            OR: [
                { type: 'NATIONAL', country_id: countryId },
                { type: 'REGIONAL', subdivision_id: subdivisionId }
            ]
        },
        orderBy: { date: 'asc' }
    })
}
