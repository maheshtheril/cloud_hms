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
    } catch (error) {
        console.error("Search Accounts Failed:", error);
        return [];
    }
}
