'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { addHours } from "date-fns"

export async function sendBroadcast(data: { message: string, priority: string, type: string, durationHours?: number }) {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.tenantId) return { error: "Unauthorized" }

    try {
        const broadcast = await prisma.hms_emergency_broadcast.create({
            data: {
                tenant_id: session.user.tenantId,
                sender_id: session.user.id,
                message: data.message,
                priority: data.priority,
                type: data.type,
                expires_at: addHours(new Date(), data.durationHours || 4)
            }
        })
        revalidatePath('/hms/attendance/roster')
        revalidatePath('/hms/attendance')
        return { success: true, data: broadcast }
    } catch (error) {
        console.error("Broadcast failed:", error)
        return { error: "Failed to initialize emergency signal" }
    }
}

export async function getActiveBroadcasts() {
    const session = await auth()
    if (!session?.user?.tenantId) return []

    try {
        return await prisma.hms_emergency_broadcast.findMany({
            where: {
                tenant_id: session.user.tenantId,
                expires_at: { gte: new Date() }
            },
            orderBy: { created_at: 'desc' },
            take: 5
        })
    } catch (error) {
        return []
    }
}

export async function acknowledgeBroadcast(broadcastId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        // Check if already acknowledged
        const existing = await prisma.hms_broadcast_ack.findFirst({
            where: { broadcast_id: broadcastId, user_id: session.user.id }
        })

        if (!existing) {
            await prisma.hms_broadcast_ack.create({
                data: {
                    broadcast_id: broadcastId,
                    user_id: session.user.id
                }
            })
        }
        return { success: true }
    } catch (error) {
        return { error: "Acknowledgment synchronization failed" }
    }
}

export async function getBroadcastAcks(broadcastId: string) {
    try {
        const acks = await prisma.hms_broadcast_ack.findMany({
            where: { broadcast_id: broadcastId }
        })
        return acks.length
    } catch (error) {
        return 0
    }
}
