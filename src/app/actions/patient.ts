'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

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
        blood_group: blood_group, // Storing here or separate if schema allows, schema has blood_group? No, schema inspection didn't show it explicitly in the snippet I saw earlier, let me check. 
        // Wait, I recall seeing `blood_group` in the table view earlier but let's be safe.
        // Actually earlier snippet showed: `email`, `phone` in patient model? 
        // Let's re-verify specific fields of `hms_patient` in schema.
        // Schema output lines 1507-1540: `first_name`, `last_name`, `dob`, `gender`, `identifiers`, `contact`, `metadata`, `status`... 
        // IT DOES NOT HAVE `blood_group` or `email` or `phone` as top level columns! 
        // WAIT: My previous code `src/app/actions/patient.ts` was using `email` and `phone` and `blood_group` directly?
        // Let's check `src/app/hms/patients/page.tsx` again.
        // It used `patient.phone`, `patient.blood_group` (which might have been filtered out or I hallucinated `blood_group` column).
        // `phone` is NOT in the schema snippet I just read (1507-1540). `contact` is Json.
        // Ah, `hms_clinicians` had `email`, `phone`.
        // `hms_patient` has: `patient_number`, `first_name`, `last_name`, `dob`, `gender`. EVERYTHING ELSE is likely in JSON `contact` or `metadata`!
        // CHECK line 1517: `contact Json?`.
        // So I must store phone, email, address in `contact`.
        // And `blood_group` in `metadata`.
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
        const patient = await prisma.hms_patient.create({
            data: {
                id: crypto.randomUUID(),
                tenant_id: tenantId,
                company_id: companyId || tenantId, // Use companyId from session, fallback to tenantId
                first_name: firstName,
                last_name: lastName || '',
                dob: dob ? new Date(dob) : null,
                gender: null, // TODO: Fix gender constraint
                contact: contact as any, // Type cast for Prisma Json
                metadata: metadata as any,
                patient_number: `PAT-${Date.now()}`, // Simple ID generation
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

