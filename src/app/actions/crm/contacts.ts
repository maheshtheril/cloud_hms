
'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createContact(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) {
        return { error: "Unauthorized" }
    }

    const { tenantId, id: userId } = session.user

    // Extract fields
    const firstName = formData.get('first_name') as string
    const lastName = formData.get('last_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const jobTitle = formData.get('job_title') as string

    if (!firstName) {
        return { error: "First name is required" }
    }

    try {
        const contact = await prisma.crm_contacts.create({
            data: {
                tenant_id: tenantId,
                owner_id: userId,
                first_name: firstName,
                last_name: lastName || null,
                email: email || null,
                phone: phone || null,
                job_title: jobTitle || null
            }
        })

        revalidatePath('/crm/contacts')
        return { success: true, contactId: contact.id }
    } catch (error: any) {
        console.error("Create Contact Error:", error)
        return { error: error.message || "Failed to create contact" }
    }
}
