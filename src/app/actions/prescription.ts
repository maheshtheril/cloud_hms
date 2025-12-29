'use server'

import { auth } from "@/auth";
import { NotificationService } from "@/lib/services/notification";

export async function sharePrescriptionWhatsapp(prescriptionId: string) {
    const session = await auth();
    if (!session?.user?.tenantId) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const result = await NotificationService.sendPrescriptionWhatsapp(
            prescriptionId,
            session.user.tenantId as string
        );
        return result;
    } catch (error) {
        console.error("Prescription WhatsApp Action Failed:", error);
        return { success: false, error: 'Internal server error' };
    }
}
