
'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createAccount(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) {
        return { error: "Unauthorized" }
    }

    const { tenantId, id: userId } = session.user

    // Extract fields
    const name = formData.get('name') as string
    const industry = formData.get('industry') as string
    const website = formData.get('website') as string
    const phone = formData.get('phone') as string

    if (!name) {
        return { error: "Account Name is required" }
    }

    try {
        const account = await prisma.crm_accounts.create({
            data: {
                tenant_id: tenantId,
                owner_id: userId,
                name: name,
                industry: industry || null,
                website: website || null,
                phone: phone || null
            }
        })

        revalidatePath('/crm/accounts')
        return { success: true, accountId: account.id }
    } catch (error: any) {
        console.error("Create Account Error:", error)
        return { error: error.message || "Failed to create account" }
    }
}
