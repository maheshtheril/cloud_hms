import { prisma } from "@/lib/prisma";

export class NotificationService {
    /**
     * Sends an invoice PDF to the patient via WhatsApp.
     * Currently mocks the actual WhatsApp API call.
     */
    static async sendInvoiceWhatsapp(invoiceId: string, tenantId: string) {
        try {
            // 1. Fetch Invoice & Patient Details
            const invoice = await prisma.hms_invoice.findUnique({
                where: { id: invoiceId },
                include: { hms_patient: true }
            });

            if (!invoice || !invoice.hms_patient) {
                console.log(`[NotificationService] Invoice ${invoiceId} or Patient not found. Skipping WhatsApp.`);
                return { success: false, error: 'Patient not found' };
            }

            // Extract phone from contact JSON
            const contact = invoice.hms_patient.contact as any;
            const phone = contact?.phone || contact?.mobile || contact?.primary_phone || invoice.hms_patient.patient_number;

            if (!phone) {
                console.log(`[NotificationService] Patient phone missing in contact record. Skipping WhatsApp.`);
                return { success: false, error: 'Patient phone missing' };
            }

            console.log(`[NotificationService] 🚀 MOCK: Generating PDF for Invoice #${invoice.invoice_number}...`);
            console.log(`[NotificationService] 🚀 MOCK: Sending WhatsApp to ${phone}...`);
            console.log(`[NotificationService] 📩 Message: "Dear ${invoice.hms_patient.first_name}, here is your invoice ${invoice.invoice_number} for ${invoice.currency} ${invoice.total}."`);

            // In a real implementation:
            // 1. Generate PDF buffer
            // 2. Upload to S3/Blob storage
            // 3. Call WhatsApp API (Twilio/Meta) with media url

            return { success: true, message: 'WhatsApp queued (Mock)' };

        } catch (error) {
            console.error('[NotificationService] Failed to send WhatsApp:', error);
            return { success: false, error: (error as Error).message };
        }
    }
}
