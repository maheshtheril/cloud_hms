'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function seedSuppliers(targetEmail?: string) {
    let companyId: string | undefined;
    let tenantId: string | undefined;

    const session = await auth();

    if (session?.user?.companyId) {
        companyId = session.user.companyId;
        tenantId = session.user.tenantId || session.user.id;
    } else if (targetEmail) {
        // Validation/Lookup bypass for debug
        const user = await prisma.app_user.findFirst({
            where: { email: targetEmail }
        });
        if (user) {
            companyId = user.company_id || undefined;
            tenantId = user.tenant_id || undefined;
        } else {
            return { error: `User with email ${targetEmail} not found.` };
        }
    } else {
        return { error: "Unauthorized. Please login or provide a target email." };
    }

    if (!companyId) return { error: "No company ID found for the target user." };

    try {
        // 1. Check if we already have suppliers
        const count = await prisma.hms_supplier.count({
            where: { company_id: companyId }
        })

        if (count > 0) {
            return { success: true, message: `Company already has ${count} suppliers. No action taken.` }
        }

        // 2. Seeding Data
        const suppliersToSeed = [
            { name: "Global Pharma Distributors", email: "orders@globalpharma.test", contact_person: "Managing Director", phone: "555-0101", address: "123 Supply Drive, Logistics City" },
            { name: "MediTech Solutions", email: "sales@meditech.test", contact_person: "Jane Smith", phone: "555-0102", address: "45 Innovation Blvd, Tech Park" },
            { name: "Apex Surgical Supplies", email: "contact@apexsurgical.test", contact_person: "Mike Ross", phone: "555-0103", address: "888 Health Way, Wellness Town" },
            { name: "Reliable Lab Equipment", email: "info@reliablelab.test", contact_person: "Sarah Connor", phone: "555-0104", address: "99 Science Ct, Research Valley" },
            { name: "Generic Drugs Co.", email: "bulk@genericdrugs.test", contact_person: "Tom Hanks", phone: "555-0105", address: "101 Generic Lane, Pharma Hub" }
        ]

        // 3. Insert
        await prisma.hms_supplier.createMany({
            data: suppliersToSeed.map(s => ({
                tenant_id: tenantId || companyId, // Safe fallback
                company_id: companyId!,
                name: s.name,
                is_active: true,
                metadata: {
                    email: s.email,
                    contact: s.contact_person,
                    phone: s.phone,
                    address: s.address
                }
            }))
        })

        revalidatePath('/debug/suppliers')
        return { success: true, message: `Successfully seeded ${suppliersToSeed.length} suppliers for company ${companyId}.` }

    } catch (error: any) {
        console.error("Seeding Failed:", error)
        return { error: error.message || "Failed to seed suppliers" }
    }
}
