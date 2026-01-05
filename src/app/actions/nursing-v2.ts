'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function saveVitals(data: {
    tenantId: string
    patientId: string
    encounterId: string
    height?: string
    weight?: string
    temperature?: string
    pulse?: string
    systolic?: string
    diastolic?: string
    spo2?: string
    respiration?: string
    notes?: string
}) {
    try {
        const session = await auth()
        if (!session?.user) {
            return { success: false, error: 'Unauthorized' }
        }

        const {
            tenantId,
            patientId,
            encounterId,
            height,
            weight,
            temperature,
            pulse,
            systolic,
            diastolic,
            spo2,
            respiration,
            notes
        } = data

        // Upsert vitals
        await prisma.hms_vitals.upsert({
            where: {
                encounter_id: encounterId
            },
            update: {
                height: height ? parseFloat(height) : null,
                weight: weight ? parseFloat(weight) : null,
                temperature: temperature ? parseFloat(temperature) : null,
                pulse: pulse ? parseInt(pulse) : null,
                systolic: systolic ? parseInt(systolic) : null,
                diastolic: diastolic ? parseInt(diastolic) : null,
                spo2: spo2 ? parseInt(spo2) : null,
                respiration: respiration ? parseInt(respiration) : null,
                notes: notes || null
            },
            create: {
                tenant_id: tenantId,
                patient_id: patientId,
                encounter_id: encounterId,
                height: height ? parseFloat(height) : null,
                weight: weight ? parseFloat(weight) : null,
                temperature: temperature ? parseFloat(temperature) : null,
                pulse: pulse ? parseInt(pulse) : null,
                systolic: systolic ? parseInt(systolic) : null,
                diastolic: diastolic ? parseInt(diastolic) : null,
                spo2: spo2 ? parseInt(spo2) : null,
                respiration: respiration ? parseInt(respiration) : null,
                notes: notes || null
            }
        })

        revalidatePath('/hms/nursing')
        revalidatePath(`/hms/nursing/` + encounterId)

        return { success: true }
    } catch (error) {
        console.error('Save Vitals Error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to save vitals'
        }
    }
}
