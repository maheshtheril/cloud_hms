
'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from 'uuid'

export type PaymentType = 'inbound' | 'outbound';

// Fetch Payments (Receipts or Vendor Payments)
export async function getPayments(type: PaymentType, search?: string) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        const payments = await prisma.payments.findMany({
            where: {
                company_id: session.user.companyId,
                // Using metadata filter for type since schema migration failed
                metadata: {
                    path: ['type'],
                    equals: type
                }
            },
            orderBy: { created_at: 'desc' },
            take: 100
        });

        // Enrich with Partner Name manually (Poly relation workaround)
        // In real HMS, we'd query hms_patient or hms_supplier based on type.
        // For efficiency, we might just return IDs and let Client fetch, or do Promise.all here.
        // Let's do a quick lookup if list is small. 

        const enriched = await Promise.all(payments.map(async (p) => {
            let partnerName = 'Unknown';
            if (p.partner_id) {
                if (type === 'inbound') {
                    // Patient
                    const patient = await prisma.hms_patient.findUnique({ where: { id: p.partner_id }, select: { first_name: true, last_name: true } });
                    if (patient) partnerName = `${patient.first_name} ${patient.last_name}`;
                } else {
                    // Supplier
                    const supplier = await prisma.hms_supplier.findUnique({ where: { id: p.partner_id }, select: { name: true } });
                    if (supplier) partnerName = supplier.name;
                }
            }
            return { ...p, partner_name: partnerName };
        }));

        return { success: true, data: enriched };
    } catch (error: any) {
        console.error("Error fetching payments:", error);
        return { error: error.message };
    }
}

export async function upsertPayment(data: {
    id?: string;
    type: PaymentType;
    partner_id: string;
    amount: number;
    method: string;
    reference?: string;
    date: Date; // Capture date in metadata
    memo?: string;
}) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        const payload = {
            tenant_id: session.user.tenantId,
            company_id: session.user.companyId,
            partner_id: data.partner_id,
            amount: data.amount,
            method: data.method,
            reference: data.reference,
            // Store type and date in metadata
            metadata: {
                type: data.type,
                date: data.date.toISOString(),
                memo: data.memo
            },
            created_at: data.date // also match created_at for sorting
        };

        if (data.id) {
            const payment = await prisma.payments.update({
                where: { id: data.id },
                data: payload
            });
            revalidatePath(data.type === 'inbound' ? '/hms/accounting/receipts' : '/hms/accounting/payments');
            return { success: true, data: payment };
        } else {
            // Generate number
            const prefix = data.type === 'inbound' ? 'RCP' : 'PAY';
            const num = `${prefix}-${Date.now().toString().slice(-6)}`;

            const payment = await prisma.payments.create({
                data: {
                    ...payload,
                    payment_number: num,
                    payment_number_normalized: num,
                    posted: false
                }
            });
            revalidatePath(data.type === 'inbound' ? '/hms/accounting/receipts' : '/hms/accounting/payments');
            return { success: true, data: payment };
        }

    } catch (error: any) {
        console.error("Error saving payment:", error);
        return { error: error.message };
    }
}

export async function postPayment(id: string) {
    // Logic to Create Journal Entry
    // Debit Bank/Cash, Credit AR/AP
    // This is complex. We need settings to know WHICH Bank account.
    // For now, we just mark as Posted.
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        await prisma.payments.update({
            where: { id },
            data: { posted: true, posted_at: new Date() }
        });
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}
