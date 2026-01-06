'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updateStatusSchema = z.object({
    orderId: z.string().uuid(),
    status: z.enum(['requested', 'collected', 'in_progress', 'completed', 'cancelled']),
})

export async function updateLabOrderStatus(input: z.infer<typeof updateStatusSchema>) {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, message: "Unauthorized" }
    }

    const { orderId, status } = input

    try {
        // Update the main order status
        // AND update all line items if we are moving to a terminal state or uniform state?
        // For simplicity, let's sync line items to the order status if moving forward,
        // unless line items are handled individually (which is more complex, but requested = "world standard").
        // "World standard" usually implies granular control BUT automated convenience.

        // Let's update the order status
        const order = await prisma.hms_lab_order.update({
            where: { id: orderId },
            data: { status }
        })

        // Also update line items to match, if applicable. 
        // If order is 'completed', all lines should be 'completed'.
        // If order is 'collected', lines are 'collected'.
        // This is a simplification but good for now.
        await prisma.hms_lab_order_line.updateMany({
            where: { order_id: orderId },
            data: { status: status === 'in_progress' ? 'processing' : status } // Mapping nuances if any
        })

        revalidatePath('/hms/lab/dashboard')
        return { success: true, message: "Order status updated successfully", data: order }
    } catch (error) {
        console.error("Failed to update lab order status:", error)
        return { success: false, message: "Failed to update status" }
    }
}

const updateReportSchema = z.object({
    orderId: z.string().uuid(),
    reportUrl: z.string().url()
})

export async function updateLabOrderReport(input: z.infer<typeof updateReportSchema>) {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, message: "Unauthorized" }
    }

    const { orderId, reportUrl } = input

    try {
        const order = await prisma.hms_lab_order.update({
            where: { id: orderId },
            data: {
                report_url: reportUrl,
                status: 'completed' // Auto-complete when report is uploaded? usually yes.
            }
        })

        // Also update all lines to completed
        await prisma.hms_lab_order_line.updateMany({
            where: { order_id: orderId },
            data: { status: 'completed' }
        })

        revalidatePath('/hms/lab/dashboard')
        revalidatePath('/hms/doctor/dashboard') // Ensure doctor sees it
        return { success: true, message: "Report uploaded successfully", data: order }
    } catch (error) {
        console.error("Failed to upload lab report:", error)
        return { success: false, message: "Failed to upload report" }
    }
}

export async function getLabReportForAppointment(appointmentId: string) {
    const session = await auth()
    if (!session?.user?.id) return { success: false }

    try {
        const order = await prisma.hms_lab_order.findFirst({
            where: {
                encounter_id: appointmentId,
                report_url: { not: null }
            },
            select: { report_url: true }
        })

        if (order?.report_url) {
            return { success: true, reportUrl: order.report_url }
        }
        return { success: false }
    } catch (error) {
        return { success: false }
    }
}
