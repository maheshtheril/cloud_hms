'use server'

import { auth } from "@/auth"
import { AccountingService } from "@/lib/services/accounting"

export async function getDailyAccountingSummary(date?: Date) {
    const session = await auth()
    if (!session?.user?.companyId) return { success: false, error: "Unauthorized" }

    return await AccountingService.getDailyReport(session.user.companyId, date || new Date())
}

export async function getProfitAndLossStatement(startDate: Date, endDate: Date) {
    const session = await auth()
    if (!session?.user?.companyId) return { success: false, error: "Unauthorized" }

    return await AccountingService.getProfitAndLoss(session.user.companyId, startDate, endDate)
}

export async function getBalanceSheetStatement(date?: Date) {
    const session = await auth()
    if (!session?.user?.companyId) return { success: false, error: "Unauthorized" }

    return await AccountingService.getBalanceSheet(session.user.companyId, date || new Date())
}

export async function getFinancialTrends() {
    const session = await auth()
    if (!session?.user?.companyId) return { success: false, error: "Unauthorized" }

    return await AccountingService.getFinancialTrends(session.user.companyId)
}

export async function getExecutiveInsights() {
    const session = await auth()
    if (!session?.user?.companyId) return { success: false, error: "Unauthorized" }

    return await AccountingService.getExecutiveInsights(session.user.companyId)
}

export async function getDaybook(date: Date) {
    const session = await auth()
    if (!session?.user?.companyId) return { success: false, error: "Unauthorized" }

    return await AccountingService.getDaybook(session.user.companyId, date)
}

export async function getCashBankBook(type: 'cash' | 'bank', date: Date) {
    const session = await auth()
    if (!session?.user?.companyId) return { success: false, error: "Unauthorized" }

    return await AccountingService.getCashBankBook(session.user.companyId, type, date)
}
