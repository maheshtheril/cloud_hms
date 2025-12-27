import { prisma } from "@/lib/prisma";
import { generateInvoicePDFBase64 } from "@/lib/utils/pdf-generator";

export class NotificationService {
    /**
     * Sends an invoice notification to the patient via WhatsApp Business API / Gateway.
     * Supports UltraMsg style WhatsApp Gateway by default.
     */
    static async sendInvoiceWhatsapp(invoiceId: string, tenantId: string, pdfBase64?: string) {
        try {
            // 1. Fetch Invoice & Patient Details
            const invoice = await prisma.hms_invoice.findUnique({
                where: { id: invoiceId },
                include: {
                    hms_patient: true,
                    hms_invoice_lines: true,
                    hms_invoice_payments: true
                }
            });

            if (!invoice || !invoice.hms_patient) {
                return { success: false, error: 'Patient or Invoice not found' };
            }

            // 2. Extract Phone Number
            const contact = invoice.hms_patient.contact as any;
            let phone = contact?.phone || contact?.mobile || contact?.primary_phone || '';

            // Clean phone number (remove spaces, plus, etc)
            phone = phone.replace(/\D/g, '');

            // Ensure country code (Assumes India +91 if not present and starts with 10 digits)
            if (phone.length === 10) {
                phone = '91' + phone;
            }

            if (!phone) {
                return { success: false, error: 'Patient phone number missing' };
            }

            // 3. Generate PDF if not provided (Auto-generate)
            let finalPdfBase64 = pdfBase64;
            if (!finalPdfBase64) {
                try {
                    console.log(`[NotificationService] Auto-generating PDF for ${invoice.invoice_number}`);
                    finalPdfBase64 = await generateInvoicePDFBase64(invoice);
                } catch (pdfErr) {
                    console.error("[NotificationService] PDF Generation failed, falling back to text only", pdfErr);
                }
            }

            // 4. Construct Message
            const patientName = `${invoice.hms_patient.first_name} ${invoice.hms_patient.last_name}`;
            const billLink = `https://cloud-hms.onrender.com/hms/billing/${invoice.id}`;
            const message = `*Invoice Received: ${invoice.invoice_number}*\n\n` +
                `Hello *${patientName}*,\n\n` +
                `Your billing for today has been generated.\n\n` +
                `*Total Amount:* ${invoice.currency} ${Number(invoice.total).toLocaleString('en-IN')}\n` +
                `*Status:* ${invoice.status?.toUpperCase()}\n\n` +
                `You can view/print your digital receipt here:\n${billLink}\n\n` +
                `Thank you for visiting us!`;

            // 5. API Configuration
            const instanceId = process.env.WHATSAPP_INSTANCE_ID || 'instance_mock_123';
            const token = process.env.WHATSAPP_TOKEN || 'token_mock_123';

            // Note: If you use UltraMsg, the endpoint is usually:
            // https://api.ultramsg.com/${instanceId}/messages/chat

            const isMock = !process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_TOKEN.includes('mock');

            if (isMock) {
                console.log(`[WhatsApp-Mock] To: ${phone}\n[WhatsApp-Mock] Message: ${message}${finalPdfBase64 ? '\n[WhatsApp-Mock] Attachment: [PDF DETECTED]' : ''}`);
                return {
                    success: true,
                    message: `Workflow confirmed. WhatsApp simulated for ${phone}. Add WHATSAPP_TOKEN to .env to go live.`
                };
            }

            // 6. Send Real HTTP Request (Switch between Chat and Document)
            const endpoint = finalPdfBase64 ? 'document' : 'chat';
            const payload: any = {
                token: token,
                to: phone,
                body: finalPdfBase64 ? finalPdfBase64 : message,
                priority: 10
            };

            if (finalPdfBase64) {
                payload.filename = `Invoice_${invoice.invoice_number}.pdf`;
                payload.caption = message; // Keep message as caption for the document
            }

            const response = await fetch(`https://api.ultramsg.com/${instanceId}/messages/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.sent === "true" || result.success) {
                return { success: true, message: 'WhatsApp sent successfully' };
            } else {
                console.error('[WhatsApp-Error]', result);
                return { success: false, error: result.error || 'Failed to deliver message' };
            }

        } catch (error) {
            console.error('[NotificationService] WhatsApp Exception:', error);
            return { success: false, error: (error as Error).message };
        }
    }
}
