'use server'

import { auth } from "@/auth"
import { ensureDefaultAccounts } from "@/lib/account-seeder"
import { revalidatePath } from "next/cache"

export async function seedDefaultAccountsAction() {
    const session = await auth()
    if (!session?.user?.companyId || !session?.user?.tenantId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        await ensureDefaultAccounts(session.user.companyId, session.user.tenantId)
        revalidatePath('/settings/accounting')
        return { success: true }
    } catch (error: any) {
        console.error("Failed to seed accounts:", error)
        return { success: false, error: error.message }
    }
}
