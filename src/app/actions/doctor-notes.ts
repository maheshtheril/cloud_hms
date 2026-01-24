'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function saveDoctorNote(data: {
    doctorId: string
    patientId: string
    appointmentId?: string
    content: string
    pdfBase64: string
}) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { error: "Unauthorized" }
        }

        const note = await prisma.doctor_note.create({
            data: {
                doctor_id: data.doctorId,
                patient_id: data.patientId,
                appointment_id: data.appointmentId,
                content: data.content,
                pdf_data: data.pdfBase64
            }
        })

        revalidatePath('/hms/doctor/dashboard')
        return { success: true, note }

    } catch (error: any) {
        console.error("Error saving doctor note:", error)
        return { error: error.message || "Failed to save note" }
    }
}

export async function getDoctorNotes(patientId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Unauthorized" }

        const notes = await prisma.doctor_note.findMany({
            where: {
                patient_id: patientId
            },
            orderBy: {
                created_at: 'desc'
            },
            include: {
                doctor: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return { success: true, notes }
    } catch (error) {
        return { error: "Failed to fetch notes" }
    }
}
