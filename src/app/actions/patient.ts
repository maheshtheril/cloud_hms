'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function createPatient(prevState: any, formData: FormData) {
    const firstName = formData.get("first_name") as string
    const lastName = formData.get("last_name") as string
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

    const tenant = await prisma.tenant.findFirst();

    if (!tenant) {
        throw new Error("No tenant found. Please signup first.");
    }

    if (!firstName || !lastName) {
        return { error: "Name is required" }
    }

    await prisma.hms_patient.create({
        data: {
            id: crypto.randomUUID(),
            tenant_id: tenant.id,
            company_id: tenant.id, // Assuming 1-1 for now, practically needs logic
            first_name: firstName,
            last_name: lastName,
            dob: dob ? new Date(dob) : null,
            gender,
            contact: contact as any, // Type cast for Prisma Json
            metadata: metadata as any,
            patient_number: `PAT-${Date.now()}` // Simple ID generation
        }
    })

    redirect("/hms/patients")
}
