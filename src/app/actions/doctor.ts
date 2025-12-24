'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
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
                employee_id: formData.get("employee_id") as string || null,
                designation: formData.get("designation") as string || null,
                license_no: licenseNo,
                role_id: role.id,
                specialization_id: specialization.id,
                department_id: formData.get("department_id") as string || null,
                consultation_start_time: formData.get("consultation_start_time") as string || "09:00",
                consultation_end_time: formData.get("consultation_end_time") as string || "17:00",
                consultation_slot_duration: parseInt(formData.get("consultation_slot_duration") as string) || 30,
                consultation_fee: parseFloat(formData.get("consultation_fee") as string) || 0,
                is_active: true
            } as any
        })

    } catch (error) {
        console.error("Failed to create doctor:", error)
        return { error: "Failed to create doctor" }
    }

    redirect("/hms/doctors")
}

export async function updateDoctor(formData: FormData) {
    const id = formData.get("id") as string
    const firstName = formData.get("first_name") as string
    const lastName = formData.get("last_name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const licenseNo = formData.get("license_no") as string
    const roleId = formData.get("role_id") as string
    const specializationId = formData.get("specialization_id") as string
    const departmentId = formData.get("department_id") as string

    // Consultation Settings
    const consultationStartTime = formData.get("consultation_start_time") as string
    const consultationEndTime = formData.get("consultation_end_time") as string
    const consultationSlotDuration = parseInt(formData.get("consultation_slot_duration") as string)
    const consultationFee = parseFloat(formData.get("consultation_fee") as string) || 0

    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        await prisma.hms_clinicians.update({
            where: { id },
            data: {
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone,
                employee_id: formData.get("employee_id") as string || null,
                designation: formData.get("designation") as string || null,
                license_no: licenseNo,
                role_id: roleId,
                specialization_id: specializationId,
                department_id: departmentId || null,
                consultation_start_time: consultationStartTime,
                consultation_end_time: consultationEndTime,
                consultation_slot_duration: consultationSlotDuration,
                consultation_fee: consultationFee,
                updated_at: new Date()
            } as any
        })
    } catch (error) {
        console.error("Failed to update doctor:", error)
        return { error: "Failed to update doctor" }
    }

    redirect(`/hms/doctors/${id}`)
}
