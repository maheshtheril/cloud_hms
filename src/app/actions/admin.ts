'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

/**
 * Admin action to remove seed patient data
 * This should only be called by admin users
 */
export async function removeSeedPatients() {
    const session = await auth()

    // Check if user is admin
    if (!session?.user?.isAdmin) {
        return {
            error: "Unauthorized. Only admins can perform this action.",
            success: false
        }
    }

    try {
        // IDs of the seed patients to remove
        const seedPatientIds = [
            '9c23da47-b7c4-48cf-99e1-f00aeb81fd4d',
            '959f2ae6-c68f-4501-84e3-5f4d944fcf9f'
        ]

        // First, check if they exist
        const existingPatients = await prisma.hms_patient.findMany({
            where: {
                id: {
                    in: seedPatientIds
                }
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                patient_number: true,
                tenant_id: true
            }
        })

        if (existingPatients.length === 0) {
            return {
                success: true,
                message: "No seed patients found. Database is already clean!",
                deleted: 0
            }
        }

        console.log(`Found ${existingPatients.length} seed patient(s) to remove:`, existingPatients)

        // Delete the seed patients
        const result = await prisma.hms_patient.deleteMany({
            where: {
                id: {
                    in: seedPatientIds
                }
            }
        })

        console.log(`Successfully deleted ${result.count} seed patient(s)`)

        return {
            success: true,
            message: `Successfully removed ${result.count} seed patient record(s)`,
            deleted: result.count,
            patients: existingPatients
        }

    } catch (error) {
        console.error("Error removing seed patients:", error)
        return {
            success: false,
            error: "Failed to remove seed patients: " + (error as Error).message,
            deleted: 0
        }
    }
}

/**
 * Check if seed patients exist (read-only, no deletion)
 */
export async function checkSeedPatients() {
    const session = await auth()

    if (!session?.user?.isAdmin) {
        return {
            error: "Unauthorized",
            success: false
        }
    }

    try {
        const seedPatientIds = [
            '9c23da47-b7c4-48cf-99e1-f00aeb81fd4d',
            '959f2ae6-c68f-4501-84e3-5f4d944fcf9f'
        ]

        const existingPatients = await prisma.hms_patient.findMany({
            where: {
                id: {
                    in: seedPatientIds
                }
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                patient_number: true,
                tenant_id: true,
                created_at: true
            }
        })

        return {
            success: true,
            found: existingPatients.length,
            patients: existingPatients,
            message: existingPatients.length > 0
                ? `Found ${existingPatients.length} seed patient(s)`
                : "No seed patients found"
        }

    } catch (error) {
        console.error("Error checking seed patients:", error)
        return {
            success: false,
            error: "Failed to check seed patients: " + (error as Error).message
        }
    }
}
