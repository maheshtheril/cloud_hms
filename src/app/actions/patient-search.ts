'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function searchPatients(query: string) {
    const session = await auth();
    const tenantId = session?.user?.tenantId;
    const companyId = session?.user?.companyId;

    if (!tenantId) return [];

    try {
        const patients = await prisma.hms_patient.findMany({
            where: {
                tenant_id: tenantId,
                // company_id: companyId, // Often patients are shared across branches in a tenant
                OR: [
                    { first_name: { contains: query, mode: 'insensitive' } },
                    { last_name: { contains: query, mode: 'insensitive' } },
                    { full_name: { contains: query, mode: 'insensitive' } },
                    { contact: { path: ['phone'], string_contains: query } },
                    { contact: { path: ['mobile'], string_contains: query } },
                    { patient_number: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 15,
            select: {
                id: true,
                first_name: true,
                last_name: true,
                patient_number: true,
                contact: true
            }
        });

        return patients.map(p => ({
            id: p.id,
            name: `${p.first_name} ${p.last_name || ''}`.trim(),
            patient_number: p.patient_number,
            phone: (p.contact as any)?.phone || ''
        }));
    } catch (error) {
        console.error("Search patients error:", error);
        return [];
    }
}
