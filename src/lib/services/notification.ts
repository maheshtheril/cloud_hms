import { prisma } from "@/lib/prisma";
import { generateInvoicePDFBase64 } from "@/lib/utils/pdf-generator";
import { generatePrescriptionPDFBase64 } from "@/lib/utils/prescription-pdf-generator";

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

            const company = invoice?.company_id
                ? await prisma.company.findUnique({ where: { id: invoice.company_id } })
                : null;

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
                    finalPdfBase64 = await generateInvoicePDFBase64(invoice, company);
                } catch (pdfErr) {
                    console.error("[NotificationService] PDF Generation failed, falling back to text only", pdfErr);
                }
            }

            // 4. Construct Message
            const patientName = `${invoice.hms_patient.first_name} ${invoice.hms_patient.last_name}`;
            const companyName = company?.name || "HealthCare Center";

            // Get base URL for the billing link
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cloud-hms.onrender.com';
            const billLink = `${baseUrl}/hms/billing/${invoice.id}`;

            const message = `Hello *${patientName}*,\n\n` +
                `Here is your invoice for *${invoice.currency} ${Number(invoice.total).toLocaleString('en-IN')}*.\n` +
                `Please find the attached PDF.\n\n` +
                `Thank you,\n*${companyName}*\n\n` +
                `🔗 Bill Link: ${billLink}`;

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
                    message: "WhatsApp notification simulated (Mock Mode)."
                };
            }

            // 6. Send Real HTTP Request (Switch between Chat and Document)
            const endpoint = finalPdfBase64 ? 'document' : 'chat';
            const payload: any = {
                token: token,
                to: phone,
                priority: 10
            };

            if (finalPdfBase64) {
                payload.document = finalPdfBase64;
                payload.filename = `Invoice_${invoice.invoice_number}.pdf`;
                payload.caption = message;
            } else {
                payload.body = message;
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
                const errorMsg = typeof result.error === 'object' ? JSON.stringify(result.error) : (result.error || 'Failed to deliver message');
                return { success: false, error: errorMsg };
            }

        } catch (error) {
            console.error("[NotificationService] WhatsApp failed:", error);
            return { success: false, error: 'Internal server error' };
        }
    }

    /**
     * Sends a prescription to the patient via WhatsApp.
     */
    static async sendPrescriptionWhatsapp(prescriptionId: string, tenantId: string) {
        try {
            // 1. Fetch Prescription & Patient Details
            const prescription = await prisma.prescription.findUnique({
                where: { id: prescriptionId },
                include: {
                    hms_patient: true,
                    prescription_items: {
                        include: {
                            hms_product: true
                        }
                    }
                }
            });

            if (!prescription || !prescription.hms_patient) {
                return { success: false, error: 'Prescription or Patient not found' };
            }

            const companyId = prescription?.company_id;
            const company = (companyId && typeof companyId === 'string' && companyId !== "undefined")
                ? await prisma.company.findUnique({ where: { id: companyId } })
                : null;

            // 2. Extract Phone
            const contact = prescription.hms_patient.contact as any;
            let phone = contact?.phone || contact?.mobile || contact?.primary_phone || '';
            phone = phone.replace(/\D/g, '');
            if (phone.length === 10) phone = '91' + phone;

            if (!phone) {
                return { success: false, error: 'Patient phone number missing' };
            }

            // 3. Generate PDF
            const pdfBase64 = await generatePrescriptionPDFBase64(prescription, company);

            // 4. Construct Message
            const patientName = `${prescription.hms_patient.first_name} ${prescription.hms_patient.last_name}`;
            const companyName = company?.name || "HealthCare Center";
            const message = `Hello *${patientName}*,\n\n` +
                `Here is your digital prescription from *${companyName}*.\n` +
                `Please find the attached PDF.\n\n` +
                `Thank you.`;

            // 5. configuration
            const instanceId = process.env.WHATSAPP_INSTANCE_ID;
            const token = process.env.WHATSAPP_TOKEN;
            const isMock = !token || token.includes('mock');

            if (isMock) {
                return {
                    success: true,
                    message: "WhatsApp prescription simulated (Mock Mode)."
                };
            }

            // 6. Send Real Request
            const payload = {
                token: token,
                to: phone,
                document: pdfBase64,
                filename: `Prescription_${new Date(prescription.created_at).getTime()}.pdf`,
                caption: message,
                priority: 10
            };

            const response = await fetch(`https://api.ultramsg.com/${instanceId}/messages/document`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.sent === "true" || result.success) {
                return { success: true, message: 'Prescription sent via WhatsApp' };
            } else {
                const errorMsg = typeof result.error === 'object' ? JSON.stringify(result.error) : (result.error || 'Failed to send WhatsApp');
                return { success: false, error: errorMsg };
            }

        } catch (error) {
            console.error("[NotificationService] Prescription WhatsApp failed:", error);
            return { success: false, error: 'Internal server error' };
        }
    }
}
