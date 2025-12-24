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

export const WORLD_CLASS_DESIGNATIONS = [
    "Head of Department (HOD)",
    "Senior Consultant",
    "Chief Medical Officer (CMO)",
    "Medical Superintendent",
    "Clinical Director",
    "Associate Consultant",
    "Resident Medical Officer (RMO)",
    "Lead Physician",
    "Senior Registrar",
    "Chief Nursing Officer (CNO)",
    "Charge Nurse",
    "Lead Physiotherapist",
    "Principal Pathologist",
    "Senior Radiologist"
];

export const WORLD_CLASS_QUALIFICATIONS = [
    "MBBS, MD (Specialization)",
    "MBBS, MS (Surgery)",
    "MBBS, DNB",
    "MD, FRCP (Fellow of Royal College of Physicians)",
    "MS, FRCS (Fellow of Royal College of Surgeons)",
    "MBBS, MRCP",
    "BSc Nursing, MSc Nursing",
    "PhD in Clinical Research",
    "MDS (Dental Surgery)",
    "MPT (Masters in Physiotherapy)",
    "MPharm, PharmD"
];

export async function seedStandardRoles() {
    const session = await auth();
    const tenantId = session?.user?.tenantId;
    const companyId = session?.user?.companyId;

    if (!tenantId || !companyId) return { error: "Unauthorized" };

    try {
        const standardRoles = [
            "Physician", "Surgeon", "Nurse", "Radiologist",
            "Pathologist", "Anesthesiologist", "Physiotherapist",
            "Pharmacist", "Lab Technician", "Administrative Specialist"
        ];

        const existing = await prisma.hms_roles.count({ where: { tenant_id: tenantId } });
        if (existing > 0) return { success: true, message: "Roles already exist." };

        await prisma.hms_roles.createMany({
            data: standardRoles.map(name => ({
                id: crypto.randomUUID(),
                tenant_id: tenantId,
                company_id: companyId,
                name,
                is_clinical: true,
                is_active: true
            }))
        });

        revalidatePath('/hms/doctors');
        return { success: true, message: "Standard roles seeded!" };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function seedStandardSpecializations() {
    const session = await auth();
    const tenantId = session?.user?.tenantId;
    const companyId = session?.user?.companyId;

    if (!tenantId || !companyId) return { error: "Unauthorized" };

    try {
        const standardSpecs = [
            "Cardiology", "Neurology", "Pediatrics", "Orthopedics",
            "Gastroenterology", "Dermatology", "Psychiatry",
            "Ophthalmology", "ENT", "Oncology", "Urology", "Nephrology"
        ];

        const existing = await prisma.hms_specializations.count({ where: { tenant_id: tenantId } });
        if (existing > 0) return { success: true, message: "Specializations already exist." };

        await prisma.hms_specializations.createMany({
            data: standardSpecs.map(name => ({
                id: crypto.randomUUID(),
                tenant_id: tenantId,
                company_id: companyId,
                name,
                is_active: true
            }))
        });

        revalidatePath('/hms/doctors');
        return { success: true, message: "Standard specializations seeded!" };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function quickAddDepartment(name: string) {
    const session = await auth();
    const tenantId = session?.user?.tenantId;
    const companyId = session?.user?.companyId;

    if (!tenantId || !companyId) return { error: "Unauthorized" };

    try {
        const department = await prisma.hms_departments.create({
            data: {
                id: crypto.randomUUID(),
                tenant_id: tenantId,
                company_id: companyId,
                name: name,
                code: name.substring(0, 3).toUpperCase(),
                is_active: true
            }
        });
        return { success: true, department };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function seedAllMasterData() {
    await seedStandardDepartments();
    await seedStandardRoles();
    await seedStandardSpecializations();
    return { success: true, message: "All World-Class master data seeded successfully!" };
}
