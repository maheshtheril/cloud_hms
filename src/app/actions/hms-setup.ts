'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function seedStandardDepartments() {
    const session = await auth();
    const tenantId = session?.user?.tenantId;
    const companyId = session?.user?.companyId;

    if (!tenantId || !companyId) {
        return { error: "Unauthorized: No tenant or company context found." };
    }

    try {
        const standardDepartments = [
            { name: "Emergency Department", code: "ER" },
            { name: "Intensive Care Unit", code: "ICU" },
            { name: "Cardiology", code: "CARD" },
            { name: "Radiology", code: "RAD" },
            { name: "Laboratory", code: "LAB" },
            { name: "Pharmacy", code: "PHARM" },
            { name: "General Medicine", code: "GENMED" },
            { name: "Outpatient Department", code: "OPD" },
            { name: "Inpatient Department", code: "IPD" },
            { name: "Surgical Suite", code: "SURG" },
            { name: "Pediatrics", code: "PED" },
            { name: "Obstetrics & Gynecology", code: "OBGYN" }
        ];

        // Check for existing departments to avoid duplicates if user clicks twice
        const existingCount = await prisma.hms_departments.count({
            where: { tenant_id: tenantId }
        });

        if (existingCount > 0) {
            return { success: true, message: "Standard departments already exist." };
        }

        await prisma.hms_departments.createMany({
            data: standardDepartments.map(dept => ({
                id: crypto.randomUUID(),
                tenant_id: tenantId,
                company_id: companyId,
                name: dept.name,
                code: dept.code,
                is_active: true
            }))
        });

        revalidatePath('/hms/doctors');
        return { success: true, message: "Standard departments seeded successfully!" };
    } catch (error: any) {
        console.error("Failed to seed departments:", error);
        return { error: error.message || "Failed to seed departments" };
    }
}

export async function quickAddDepartment(name: string) {
    const session = await auth();
    const tenantId = session?.user?.tenantId;
    const companyId = session?.user?.companyId;

    if (!tenantId || !companyId) {
        return { error: "Unauthorized" };
    }

    try {
        const newDept = await prisma.hms_departments.create({
            data: {
                id: crypto.randomUUID(),
                tenant_id: tenantId,
                company_id: companyId,
                name,
                is_active: true
            }
        });

        revalidatePath('/hms/doctors');
        return { success: true, department: newDept };
    } catch (error: any) {
        return { error: error.message || "Failed to add department" };
    }
}
