'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

/**
 * Fetch detailed lines of all UNPAID/DRAFT invoices for a patient.
 * This is used to show the user exactly what they are paying for.
 */
export async function getPatientUnbilledItems(patientId: string) {
    const session = await auth();
    const companyId = session?.user?.companyId || session?.user?.tenantId;
    if (!companyId) return { error: "Unauthorized" };

    try {
        const invoices = await prisma.hms_invoice.findMany({
            where: {
                company_id: companyId,
                patient_id: patientId,
                status: { in: ['draft', 'posted'] },
                outstanding_amount: { gt: 0 }
            },
            include: {
                hms_invoice_lines: true
            },
            orderBy: { created_at: 'desc' }
        });

        // Flatten all lines
        let allLines: any[] = [];
        let total = 0;

        invoices.forEach(inv => {
            if (inv.hms_invoice_lines) {
                inv.hms_invoice_lines.forEach(line => {
                    allLines.push({
                        date: inv.invoice_date || inv.created_at,
                        description: line.description || 'Item',
                        quantity: Number(line.quantity),
                        amount: Number(line.net_amount) || 0,
                        invoiceNumber: inv.invoice_number
                    });
                    // Note: We use the line net_amount (qty * price - discount)
                    // If tax is exclusive, we might miss it here, but usually net_amount + tax is total.
                    // For simplicity, let's just show line totals.
                });
            }
            total += Number(inv.outstanding_amount);
        });

        return {
            success: true,
            lines: allLines,
            total: total
        };

    } catch (error) {
        console.error("Failed to fetch unbilled items:", error);
        return { error: "Failed to fetch details" };
    }
}
