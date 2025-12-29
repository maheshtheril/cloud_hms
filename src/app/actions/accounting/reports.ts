'use server'

import { auth } from "@/auth"
import { AccountingService } from "@/lib/services/accounting"

export async function getDailyAccountingSummary(date?: Date) {
    const session = await auth()
    if (!session?.user?.companyId) return { error: "Unauthorized" }

    return await AccountingService.getDailyReport(session.user.companyId, date || new Date())
}

export async function getProfitAndLossStatement(startDate: Date, endDate: Date) {
    const session = await auth()
    if (!session?.user?.companyId) return { error: "Unauthorized" }

    return await AccountingService.getProfitAndLoss(session.user.companyId, startDate, endDate)
}

export async function getBalanceSheetStatement(date?: Date) {
    const session = await auth()
    if (!session?.user?.companyId) return { error: "Unauthorized" }

    return await AccountingService.getBalanceSheet(session.user.companyId, date || new Date())
}
