'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getWards(branchId?: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return { success: false, error: "Unauthorized", data: [] }

    const wards = await prisma.hms_ward.findMany({
        where: {
            tenant_id: session.user.tenantId,
            branch_id: branchId || session.user.current_branch_id || undefined
        },
        include: {
            hms_bed: true
        },
        orderBy: { name: 'asc' }
    })

    // Fetch active admissions to show occupancy
    const activeAdmissions = await prisma.hms_admission.findMany({
        where: {
            tenant_id: session.user.tenantId,
            status: 'admitted'
        },
        include: {
            hms_patient: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true
                }
            }
        }
    })

    // Enrich beds with patient info
    const enrichedWards = wards.map(ward => ({
        ...ward,
        hms_bed: ward.hms_bed.map(bed => {
            const admission = activeAdmissions.find(a => (a.metadata as any)?.bed_id === bed.id)
            return {
                ...bed,
                patient: admission?.hms_patient ? `${admission.hms_patient.first_name} ${admission.hms_patient.last_name}` : null
            }
        })
    }))

    return { success: true, data: enrichedWards }
}


export async function createWard(name: string, branchId: string) {
    const session = await auth()
    if (!session?.user?.tenantId || !session?.user?.companyId) return { success: false, error: "Unauthorized" }

    try {
        const ward = await prisma.hms_ward.create({
            data: {
                id: crypto.randomUUID(),
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                branch_id: branchId,
                name: name,
                is_active: true
            }
        })
        revalidatePath('/hms/wards')
        return { success: true, data: ward }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function createBed(wardId: string, bedNo: string) {
    const session = await auth()
    if (!session?.user?.tenantId || !session?.user?.companyId) return { success: false, error: "Unauthorized" }

    try {
        const bed = await prisma.hms_bed.create({
            data: {
                id: crypto.randomUUID(),
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                ward_id: wardId,
                bed_no: bedNo,
                status: 'available'
            }
        })
        revalidatePath('/hms/wards')
        return { success: true, data: bed }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function getActiveAdmissions() {
    const session = await auth()
    if (!session?.user?.tenantId) return { success: false, error: "Unauthorized", data: [] }

    const admissions = await prisma.hms_admission.findMany({
        where: {
            tenant_id: session.user.tenantId,
            status: 'admitted'
        },
        include: {
            hms_patient: true
        }
    })

    return { success: true, data: admissions }
}

export async function assignBedToPatient(admissionId: string, bedId: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return { success: false, error: "Unauthorized" }

    try {
        const bed = await prisma.hms_bed.findUnique({
            where: { id: bedId },
            include: { hms_ward: true }
        })
        if (!bed) throw new Error("Bed not found")

        await prisma.$transaction([
            prisma.hms_admission.update({
                where: { id: admissionId },
                data: {
                    ward: bed.hms_ward.name,
                    bed: bed.bed_no,
                    metadata: {
                        bed_id: bedId,
                        ward_id: bed.ward_id
                    }
                }
            }),
            prisma.hms_bed.update({
                where: { id: bedId },
                data: { status: 'occupied' }
            })
        ])

        revalidatePath('/hms/wards')
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function releaseBed(bedId: string) {
    const session = await auth()
    if (!session?.user?.tenantId) return { success: false, error: "Unauthorized" }

    try {
        // 1. Find the active admission for this bed
        // We look for missions where current bed_id is in metadata
        const activeAdmission = await prisma.hms_admission.findFirst({
            where: {
                tenant_id: session.user.tenantId,
                status: 'admitted',
                metadata: {
                    path: ['bed_id'],
                    equals: bedId
                }
            }
        })

        const updates: any[] = [
            prisma.hms_bed.update({
                where: { id: bedId },
                data: { status: 'available' }
            })
        ]

        if (activeAdmission) {
            updates.push(prisma.hms_admission.update({
                where: { id: activeAdmission.id },
                data: {
                    status: 'discharged',
                    discharged_at: new Date()
                }
            }))
        }

        await prisma.$transaction(updates)

        revalidatePath('/hms/wards')
        return { success: true }
    } catch (e: any) {
        console.error("RELEASE_BED_ERROR:", e)
        return { success: false, error: e.message }
    }
}


export async function createAdmission(patientId: string, doctorId?: string) {
    const session = await auth()
    if (!session?.user?.tenantId || !session?.user?.companyId) return { success: false, error: "Unauthorized" }

    try {
        // Guard: Prevent duplicate active admissions
        const existing = await prisma.hms_admission.findFirst({
            where: {
                tenant_id: session.user.tenantId,
                patient_id: patientId,
                status: 'admitted'
            }
        })

        if (existing) {
            return { success: false, error: "Patient is already currently admitted." }
        }

        const admission = await prisma.hms_admission.create({
            data: {
                tenant_id: session.user.tenantId,
                company_id: session.user.companyId,
                patient_id: patientId,
                admitting_doctor: doctorId,
                status: 'admitted',
                branch_id: session.user.current_branch_id
            }
        })
        revalidatePath('/hms/wards')
        revalidatePath('/hms/patients')
        return { success: true, data: admission }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

