'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateGlobalSettings(data: {
    companyId: string,
    name: string,
    industry?: string,
    currencyId?: string
}) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        // Verify company ownership
        const company = await prisma.company.findFirst({
            where: {
                id: data.companyId,
                tenant_id: session.user.tenantId
            }
        })

        if (!company) return { error: "Company not found" }

        await prisma.$transaction(async (tx) => {
            // Update Company Details
            await tx.company.update({
                where: { id: data.companyId },
                data: {
                    name: data.name,
                    industry: data.industry
                }
            })

            // Update Currency Settings
            if (data.currencyId) {
                // Check if settings exist
                const settings = await tx.company_settings.findFirst({
                    where: { company_id: data.companyId }
                })

                if (settings) {
                    await tx.company_settings.update({
                        where: { id: settings.id },
                        data: { currency_id: data.currencyId }
                    })
                } else {
                    await tx.company_settings.create({
                        data: {
                            tenant_id: session.user.tenantId!,
                            company_id: data.companyId,
                            currency_id: data.currencyId
                        }
                    })
                }
            }
        })

        revalidatePath('/settings/global')
        return { success: true }
    } catch (error) {
        console.error("Failed to update global settings:", error)
        return { error: "Failed to update settings" }
    }
}
