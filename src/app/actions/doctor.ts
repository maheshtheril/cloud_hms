'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function createDoctor(formData: FormData) {
    const firstName = formData.get("first_name") as string
    const lastName = formData.get("last_name") as string
    const email = formData.get("email") as string
    const roleName = formData.get("role") as string // e.g., "Doctor"
    const specializationName = formData.get("specialization") as string // e.g., "Cardiology"
    const licenseNo = formData.get("license_no") as string

    // TODO: Get Tenant ID/Company ID from session
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) throw new Error("No tenant found");

    if (!firstName || !lastName || !email || !roleName || !specializationName) {
        return { error: "Missing required fields" }
    }

    try {
        // 1. Find or Create Role
        let role = await prisma.hms_roles.findFirst({
            where: { tenant_id: tenant.id, name: { equals: roleName, mode: 'insensitive' } }
        })

        if (!role) {
            role = await prisma.hms_roles.create({
                data: {
                    id: crypto.randomUUID(),
                    tenant_id: tenant.id,
                    company_id: tenant.id, // Simplification
                    name: roleName,
                    is_clinical: true
                }
            })
        }

        // 2. Find or Create Specialization
        let specialization = await prisma.hms_specializations.findFirst({
            where: { tenant_id: tenant.id, name: { equals: specializationName, mode: 'insensitive' } }
        })

        if (!specialization) {
            specialization = await prisma.hms_specializations.create({
                data: {
                    id: crypto.randomUUID(),
                    tenant_id: tenant.id,
                    company_id: tenant.id,
                    name: specializationName
                }
            })
        }

        // 3. Create Clinician
        await prisma.hms_clinicians.create({
            data: {
                id: crypto.randomUUID(),
                tenant_id: tenant.id,
                company_id: tenant.id,
                first_name: firstName,
                last_name: lastName,
                email: email,
                license_no: licenseNo,
                role_id: role.id,
                specialization_id: specialization.id,
                consultation_start_time: formData.get("consultation_start_time") as string || "09:00",
                consultation_end_time: formData.get("consultation_end_time") as string || "17:00",
                consultation_slot_duration: parseInt(formData.get("consultation_slot_duration") as string) || 30,
                is_active: true
            }
        })

    } catch (error) {
        console.error("Failed to create doctor:", error)
        return { error: "Failed to create doctor" }
    }

    redirect("/hms/doctors")
}
