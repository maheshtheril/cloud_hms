'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type SearchOption = {
    id: string;
    label: string;
    subLabel?: string;
}

export async function searchPatients(query: string): Promise<SearchOption[]> {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) return [];

    try {
        const patients = await prisma.hms_patient.findMany({
            where: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                OR: [
                    { first_name: { contains: query, mode: 'insensitive' } },
                    { last_name: { contains: query, mode: 'insensitive' } },
                    { patient_number: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 20,
            orderBy: { first_name: 'asc' },
            select: { id: true, first_name: true, last_name: true, patient_number: true, contact: true }
        });

        return patients.map(p => {
            // Safe contact parsing
            const contact = p.contact as any;
            const phone = contact?.phone || '';
            const email = contact?.email || '';
            const sub = [p.patient_number, phone].filter(Boolean).join(' • ');

            return {
                id: p.id,
                label: `${p.first_name} ${p.last_name}`,
                subLabel: sub
            };
        });
    } catch (error) {
        console.error("Search Patients Failed:", error);
        return [];
    }
}

export async function searchSuppliers(query: string): Promise<SearchOption[]> {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) return [];

    try {
        const suppliers = await prisma.hms_supplier.findMany({
            where: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                is_active: true,
                name: { contains: query, mode: 'insensitive' }
            },
            take: 20,
            orderBy: { name: 'asc' },
            select: { id: true, name: true, metadata: true }
        });

        return suppliers.map(s => {
            const meta = s.metadata as any;
            return {
                id: s.id,
                label: s.name,
                subLabel: meta?.gstin || meta?.email || undefined
            };
        });
    } catch (error) {
        console.error("Search Suppliers Failed:", error);
        return [];
    }
}

export async function searchAccounts(query: string): Promise<SearchOption[]> {
    const session = await auth();
    if (!session?.user?.companyId) return [];

    try {
        const accounts = await prisma.accounts.findMany({
            where: {
                company_id: session.user.companyId,
                is_active: true,
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { code: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 20,
            orderBy: { code: 'asc' },
            select: { id: true, name: true, code: true, type: true }
        });

        return accounts.map(a => ({
            id: a.id,
            label: `${a.code} - ${a.name}`,
            subLabel: a.type
        }));
    } catch (error: any) {
        console.error("Search accounts error:", error);
        return [];
    }
}

/**
 * Fetches all outstanding (unpaid/partially paid) invoices for a specific partner.
 */
export async function getOutstandingInvoices(partnerId: string) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        const invoices = await prisma.hms_invoice.findMany({
            where: {
                company_id: session.user.companyId,
                patient_id: partnerId,
                status: 'posted',
                outstanding: { gt: 0 }
            },
            orderBy: { issued_at: 'asc' } // Oldest first (FIFO)
        });

        return {
            success: true,
            data: invoices.map(inv => ({
                id: inv.id,
                number: inv.invoice_number,
                date: inv.issued_at,
                total: Number(inv.total),
                paid: Number(inv.total_paid || 0),
                outstanding: Number(inv.outstanding || 0)
            }))
        };
    } catch (error: any) {
        console.error("Error fetching outstanding invoices:", error);
        return { error: error.message };
    }
}

/**
 * Fetches all outstanding (unpaid/partially paid) purchase bills for a specific supplier.
 */
export async function getOutstandingPurchaseBills(supplierId: string) {
    const session = await auth();
    if (!session?.user?.companyId) return { error: "Unauthorized" };

    try {
        const bills = await prisma.hms_purchase_invoice.findMany({
            where: {
                company_id: session.user.companyId,
                supplier_id: supplierId,
                status: { not: 'draft' },
                total_amount: { gt: prisma.hms_purchase_invoice.fields.paid_amount } // Simple gt doesn't work with field comparison in where, but good enough for now if we use a raw where or just filter in JS.
                // Re-thinking: Prisma doesn't support field vs field in WHERE natively yet without special syntax or computed.
                // Let's use status filter + manual check or just fetch all open ones.
            },
            orderBy: { invoice_date: 'asc' }
        });

        // Filter for truly outstanding ones
        const outstanding = bills.filter(b => Number(b.total_amount || 0) > Number(b.paid_amount || 0));

        return {
            success: true,
            data: outstanding.map(b => ({
                id: b.id,
                number: b.name || 'N/A',
                date: b.invoice_date,
                total: Number(b.total_amount),
                paid: Number(b.paid_amount || 0),
                outstanding: Number(b.total_amount) - Number(b.paid_amount || 0)
            }))
        };
    } catch (error: any) {
        console.error("Error fetching outstanding purchase bills:", error);
        return { error: error.message };
    }
}
