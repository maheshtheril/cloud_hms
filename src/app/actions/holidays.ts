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
    // Cast to any because Prisma Client is not regenerated yet
    return await (prisma as any).hms_holiday.findMany({
        where: { tenant_id: tenantId },
        include: {
            country: true,
            subdivision: true
        },
        orderBy: { date: 'asc' }
    })
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
