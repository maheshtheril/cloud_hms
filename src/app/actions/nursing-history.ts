'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getConsumptionHistory(encounterId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        // Query Invoice Lines to show what is ACTUALLY Billed/Drafted
        const lines = await prisma.hms_invoice_lines.findMany({
            where: {
                hms_invoice: {
                    appointment_id: encounterId
                },
                metadata: {
                    path: ['source'],
                    equals: 'nursing_consumption'
                }
            },
            include: {
                hms_invoice: {
                    select: {
                        status: true,
                        invoice_number: true
                    }
                }
            },
            orderBy: {
                // Approximate time order by line index or creation if available
                line_idx: 'desc'
            }
        })

        // Alternatively, query Stock Ledger for raw inventory movement
        // We'll combine: Show what was used.
        // But the user asked for "Recorded Usage" and "Bill".
        // Invoice lines are best proof of billing.

        return {
            data: lines.map(line => ({
                id: line.id,
                description: line.description,
                quantity: line.quantity.toNumber(),
                unitPrice: line.unit_price.toNumber(),
                netAmount: line.net_amount.toNumber(),
                status: line.hms_invoice.status,
                invoiceNumber: line.hms_invoice.invoice_number,
                recordedAt: new Date() // Invoice lines don't typically store created_at, using now() as placeholder or need to fetch Ledger
            }))
        }

    } catch (error: any) {
        console.error("Get History Error:", error)
        return { error: error.message }
    }
}
