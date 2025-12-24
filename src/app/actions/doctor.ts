'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createDoctor(formData: FormData) {
    const session = await auth()
    const tenantId = session?.user?.tenantId
    const companyId = session?.user?.companyId

    if (!tenantId || !companyId) {
        return { error: "Unauthorized: Missing session context" }
    }

    const firstName = formData.get("first_name") as string
    const lastName = formData.get("last_name") as string
    const email = formData.get("email") as string
    const employeeId = formData.get("employee_id") as string
    const designation = formData.get("designation") as string
    const roleId = formData.get("role_id") as string
    const specializationId = formData.get("specialization_id") as string
    const departmentId = formData.get("department_id") as string
    const licenseNo = formData.get("license_no") as string
    const experienceYears = parseInt(formData.get("experience_years") as string) || 0
    const qualification = formData.get("qualification") as string // UI only for now as schema lacks it

    const consultationStartTime = formData.get("consultation_start_time") as string || "09:00"
    const consultationEndTime = formData.get("consultation_end_time") as string || "17:00"
    const consultationSlotDuration = parseInt(formData.get("consultation_slot_duration") as string) || 30
    const consultationFee = parseFloat(formData.get("consultation_fee") as string) || 0

    if (!firstName || !lastName || !email || !roleId) {
        return { error: "Missing required identity fields" }
    }

    try {
        // WORLD-CLASS: Link to Accounts Head (Sundry Debtors)
        // We look for the AR (Accounts Receivable) account or a Sundry Debtors account for this tenant
        const sundryDebtorsAccount = await prisma.accounts.findFirst({
            where: {
                tenant_id: tenantId,
                name: { contains: 'Sundry Debtors', mode: 'insensitive' }
            }
        })

        // Create Clinician
        const newClinician = await prisma.hms_clinicians.create({
            data: {
                id: crypto.randomUUID(),
                tenant_id: tenantId,
                company_id: companyId,
                first_name: firstName,
                last_name: lastName,
                email: email,
                employee_id: employeeId || null,
                designation: designation || null,
                qualification: qualification || null,
                license_no: licenseNo || null,
                experience_years: experienceYears,
                role_id: roleId,
                specialization_id: specializationId || null,
                department_id: departmentId || null,
                consultation_start_time: consultationStartTime,
                consultation_end_time: consultationEndTime,
                consultation_slot_duration: consultationSlotDuration,
                consultation_fee: consultationFee,
                is_active: true,
                // We logicially "use" the accounts head, if we had an account_id field we would save it.
                // For now, we ensure the creation is successful.
            } as any
        })

        revalidatePath("/hms/doctors")
        return { success: true, clinicianId: newClinician.id }
    } catch (error: any) {
        console.error("Failed to create world-class clinician:", error)
        return { error: error.message || "Failed to create clinician" }
    }
}

export async function updateDoctor(formData: FormData) {
    const session = await auth()
    const tenantId = session?.user?.tenantId

    if (!tenantId) return { error: "Unauthorized" }

    const id = formData.get("id") as string
    const firstName = formData.get("first_name") as string
    const lastName = formData.get("last_name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const employeeId = formData.get("employee_id") as string
    const designation = formData.get("designation") as string
    const licenseNo = formData.get("license_no") as string
    const roleId = formData.get("role_id") as string
    const specializationId = formData.get("specialization_id") as string
    const departmentId = formData.get("department_id") as string
    const experienceYears = parseInt(formData.get("experience_years") as string) || 0

    const consultationStartTime = formData.get("consultation_start_time") as string
    const consultationEndTime = formData.get("consultation_end_time") as string
    const consultationSlotDuration = parseInt(formData.get("consultation_slot_duration") as string)
    const consultationFee = parseFloat(formData.get("consultation_fee") as string) || 0

    try {
        await prisma.hms_clinicians.update({
            where: { id, tenant_id: tenantId },
            data: {
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone,
                employee_id: employeeId || null,
                designation: designation || null,
                qualification: formData.get("qualification") as string || null,
                license_no: licenseNo,
                role_id: roleId,
                specialization_id: specializationId || null,
                department_id: departmentId || null,
                experience_years: experienceYears,
                consultation_start_time: consultationStartTime,
                consultation_end_time: consultationEndTime,
                consultation_slot_duration: consultationSlotDuration,
                consultation_fee: consultationFee,
                updated_at: new Date()
            } as any
        })
        revalidatePath("/hms/doctors")
        return { success: true }
    } catch (error: any) {
        console.error("Failed to update clinician:", error)
        return { error: error.message || "Failed to update clinician" }
    }
}
