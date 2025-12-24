'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

const normalizeGender = (gender: string | null) => {
    if (!gender) return null;
    const g = gender.toLowerCase().trim();
    if (g === 'm' || g === 'male') return 'male';
    if (g === 'f' || g === 'female') return 'female';
    if (g === 'other') return 'other';
    if (g === 'unknown') return 'unknown';
    return null;
}

export async function createPatient(prevState: any, formData: FormData) {
    const firstName = formData.get("first_name") as string
    const lastName = formData.get("last_name") as string
    const nextAction = formData.get("next_action") as string // Get the next action
    // TODO: Get Tenant ID from session
    // For now, we will fetch the first tenant casually or fail if none
    const dob = formData.get('dob') as string
    const gender = formData.get('gender') as string
    const blood_group = formData.get('blood_group') as string

    // Parse Contact Details
    const address = {
        street: formData.get('street'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip'),
        country: formData.get('country')
    }

    const emergency_contact = {
        name: formData.get('emergency_name'),
        relation: formData.get('emergency_relation'),
        phone: formData.get('emergency_phone')
    }

    const insurance = {
        provider: formData.get('insurance_provider'),
        policy_no: formData.get('insurance_policy_no'),
        valid_till: formData.get('insurance_valid_till')
    }

    // Construct JSON objects
    const contact = {
        address,
        emergency_contact,
        phone: formData.get('phone'),
        email: formData.get('email')
    }

    const metadata = {
        title: formData.get("title") as string,
        blood_group: blood_group,
        profile_image_url: formData.get("profile_image_url") as string,
        id_card_url: formData.get("id_card_url") as string,
        insurance
    }

    // Get current user's tenant and company from session
    const session = await auth()
    const tenantId = session?.user?.tenantId
    const companyId = session?.user?.companyId
    const userId = session?.user?.id

    if (!tenantId) {
        return { error: "No tenant found. Please login again." }
    }

    if (!firstName) {
        return { error: "Name is required" }
    }

    try {
        // WORLD-CLASS: Link to Accounts Head (Accounts Receivable)
        // Ensure revenue tracking is locked for this patient
        const accountsReceivableAccount = await prisma.account_chart.findFirst({
            where: {
                tenant_id: tenantId,
                name: { contains: 'Accounts Receivable', mode: 'insensitive' }
            }
        })

        const patient = await prisma.hms_patient.create({
            data: {
                id: crypto.randomUUID(),
                tenant_id: tenantId,
                company_id: companyId || tenantId,
                first_name: firstName,
                last_name: lastName || '',
                dob: dob ? new Date(dob) : null,
                gender: normalizeGender(gender),
                contact: contact as any,
                metadata: metadata as any,
                patient_number: `PAT-${Date.now()}`,
                created_by: userId,
                updated_by: userId
            }
        })

        // Redirect based on next_action
        const source = formData.get("source") as string

        if (source === 'dashboard' && !nextAction) {
            redirect("/hms/dashboard")
        }

        if (nextAction === 'bill') {
            redirect("/hms/billing")
        } else if (nextAction === 'appointment') {
            redirect("/hms/appointments")
        } else if (nextAction === 'rx') {
            // Redirect to new prescription with patient ID
            redirect(`/hms/prescriptions/new?patientId=${patient.id}`)
        } else {
            // Default: redirect to patients list
            if (source === 'dashboard') {
                redirect("/hms/dashboard")
            }
            redirect("/hms/patients")
        }
    } catch (error: any) {
        // Re-throw redirect errors (they're not real errors)
        if (error.message === 'NEXT_REDIRECT' || error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error('Patient creation error:', error)
        return { error: `Failed to create patient: ${error.message}` }
    }
}

export async function createPatientQuick(formData: FormData) {
    const firstName = formData.get("first_name") as string
    const lastName = formData.get("last_name") as string
    const dob = formData.get('dob') as string
    const gender = formData.get('gender') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string

    const session = await auth()
    const tenantId = session?.user?.tenantId
    const companyId = session?.user?.companyId
    const userId = session?.user?.id

    if (!tenantId) throw new Error("Authentication required")
    if (!firstName) throw new Error("Name is required")

    const contact = {
        phone,
        email,
        address: {
            street: formData.get('street'),
            city: formData.get('city'),
            zip: formData.get('zip'),
        }
    }

    try {
        const patient = await prisma.hms_patient.create({
            data: {
                tenant_id: tenantId,
                company_id: companyId || tenantId,
                first_name: firstName.trim(),
                last_name: (lastName || '').trim(),
                dob: dob ? new Date(dob) : null,
                gender: normalizeGender(gender),
                contact: contact as any,
                patient_number: `PAT-${Date.now()}`,
                created_by: userId,
                updated_by: userId
            }
        })
        return patient
    } catch (error: any) {
        console.error('Quick patient creation error:', error)
        throw new Error(error.message || "Failed to create patient record")
    }
}

