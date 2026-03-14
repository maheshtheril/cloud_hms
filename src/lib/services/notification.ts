import { prisma } from "@/lib/prisma";
import { getWhatsAppConfig } from "@/app/actions/settings";
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

            // Bill link removed per user request

            const message = `Hello *${patientName}*,\n\n` +
                `Here is your invoice for *${invoice.currency} ${Number(invoice.total).toLocaleString('en-IN')}*.\n` +
                `Please find the attached PDF.\n\n` +
                `Thank you,\n*${companyName}*`;

            // 5. Dynamic API Configuration
            const dynamicConfig = await this.getDynamicConfig(invoice.company_id!, tenantId);

            if (!dynamicConfig.enabled) {
                console.log(`[NotificationService] WhatsApp disabled for company ${invoice.company_id}`);
                return { success: false, error: 'WhatsApp delivery is disabled in settings.' };
            }

            const { instanceId, token } = dynamicConfig;
            const isMock = !token || token.includes('mock');

            if (isMock) {
                console.log(`[WhatsApp-Mock] To: ${phone}\n[WhatsApp-Mock] Message: ${message}${finalPdfBase64 ? '\n[WhatsApp-Mock] Attachment: [PDF DETECTED]' : ''}`);
                return {
                    success: true,
                    message: "WhatsApp notification simulated (Mock Mode)."
                };
            }

            // 6. Send Real HTTP Request (Switch between Chat and Document)
            let endpoint = 'chat'; // Initialize endpoint
            
            const payload: any = {
                token: token,
                to: phone,
                priority: 10
            };

            if (finalPdfBase64) {
                endpoint = 'document';
                payload.document = finalPdfBase64;
                payload.filename = `Invoice_${invoice.invoice_number}.pdf`;
                payload.caption = message;
            } else {
                payload.body = message;
            }

            // Ensure instanceId format is correct (e.g. instance12345)
            let cleanId = instanceId.toString().trim();
            if (cleanId.toLowerCase().startsWith('instance')) {
                cleanId = cleanId.substring(8); // Remove 'instance' 
            }
            const resolvedInstanceId = `instance${cleanId.toLowerCase()}`;

            const url = `https://api.ultramsg.com/${resolvedInstanceId}/messages/${endpoint}`;
            const maskedToken = token.length > 5 ? `${token.slice(0, 4)}...${token.slice(-2)}` : 'INVALID';
            
            console.log(`[WhatsApp-Fetch] ${endpoint} | URL: ${url} | Token: ${maskedToken} | To: ${phone}`);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log(`[WhatsApp-Result] Raw:`, JSON.stringify(result));

            if (result.sent === "true" || result.success === true || result.id) {
                console.log(`[WhatsApp-Success] Delivered to ${phone}`);
                return { success: true, message: 'WhatsApp sent successfully' };
            } else {
                console.error('[WhatsApp-Error]', result);
                const errorMsg = typeof result.error === 'object' 
                    ? JSON.stringify(result.error) 
                    : (result.error || result.message || 'Failed to deliver message');
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
            const patientName = `${prescription.hms_patient.first_name} ${prescription.hms_patient.last_name}`;
            const contact = prescription.hms_patient.contact as any;
            const patientMobile = contact?.phone || contact?.mobile || contact?.primary_phone || '';
            // Sanitize phone number to digits only
            const phone = (patientMobile || '').replace(/\D/g, '');
            if (!phone) {
                console.warn(`[WhatsApp-Prescription] No valid phone number for Patient: ${patientName}`);
                return { success: false, error: 'No phone number' };
            }

            // 3. Generate PDF
            const pdfBase64 = await generatePrescriptionPDFBase64(prescription, company);

            // 4. Construct Message
            const companyName = company?.name || "HealthCare Center";
            const message = `Hello *${patientName}*,\n\n` +
                `Here is your digital prescription from *${companyName}*.\n` +
                `Please find the attached PDF.\n\n` +
                `Thank you.`;

            // 5. Dynamic Configuration
            const dynamicConfig = await this.getDynamicConfig(prescription.company_id!, tenantId);

            if (!dynamicConfig.enabled) {
                return { success: false, error: 'WhatsApp delivery is disabled.' };
            }

            const { instanceId, token } = dynamicConfig;
            const isMock = !token || token.includes('mock');

            if (isMock) {
                console.log(`[WhatsApp-Prescription-Mock] To: ${phone}\n[WhatsApp-Prescription-Mock] Message: ${message}\n[WhatsApp-Prescription-Mock] Attachment: [PDF DETECTED]`);
                return {
                    success: true,
                    message: "WhatsApp prescription simulated (Mock Mode)."
                };
            }

            // 6. Send Real Request
            const payload: any = {
                token: token,
                to: phone,
                priority: 10,
                document: pdfBase64,
                filename: `Prescription_${patientName.replace(/\s+/g, '_')}.pdf`,
                caption: `Medical Prescription for ${patientName}`
            };

            // Ensure instanceId format is correct (e.g. instance12345)
            let cleanId = instanceId.toString().trim();
            if (cleanId.toLowerCase().startsWith('instance')) {
                cleanId = cleanId.substring(8); // Remove 'instance' 
            }
            const resolvedInstanceId = `instance${cleanId.toLowerCase()}`;

            const url = `https://api.ultramsg.com/${resolvedInstanceId}/messages/document`;
            const maskedToken = token.length > 5 ? `${token.slice(0, 4)}...${token.slice(-2)}` : 'INVALID';
            console.log(`[WhatsApp-Fetch-Prescription] POST ${url} | Token: ${maskedToken} | To: ${phone}`);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log(`[WhatsApp-Prescription-Result] Raw:`, JSON.stringify(result));

            if (result.sent === "true" || result.success === true || result.id) {
                console.log(`[WhatsApp-Prescription-Success] Delivered to ${phone}`);
                return { success: true, message: 'Prescription sent via WhatsApp' };
            } else {
                console.error('[WhatsApp-Prescription-Error]', result);
                return { 
                    success: false, 
                    error: typeof result.error === 'object' ? JSON.stringify(result.error) : (result.error || result.message || 'Failed to deliver prescription') 
                };
            }

        } catch (error) {
            console.error("[NotificationService] Prescription WhatsApp failed:", error);
            return { success: false, error: 'Internal server error' };
        }
    }

    /**
     * Sends a direct Razorpay payment link to the patient via WhatsApp.
     */
    static async sendPaymentLinkWhatsapp(patientId: string, amount: number, paymentLink: string, currency: string = '₹') {
        try {
            // 1. Fetch Patient Details
            const patient = await prisma.hms_patient.findUnique({
                where: { id: patientId }
            });

            if (!patient) {
                return { success: false, error: 'Patient not found' };
            }

            // 2. Extract Phone Number
            const patientName = `${patient.first_name} ${patient.last_name}`;
            const contact = patient.contact as any;
            const patientPhone = contact?.phone || contact?.mobile || contact?.primary_phone || '';
            // Sanitize phone number to digits only
            const phone = (patientPhone || '').replace(/\D/g, '');
            if (!phone) {
                console.warn(`[WhatsApp-Payment-Link] No valid phone number for Patient: ${patientName}`);
                return { success: false, error: 'No phone number' };
            }

            // 3. Construct Message
            const message = `Hello *${patientName}*,\n\n` +
                `Greetings from our medical center.\n\n` +
                `A professional payment request of *${currency}${amount.toLocaleString('en-IN')}* has been generated for your recent visit.\n\n` +
                `Kindly pay securely using the link below:\n` +
                `🔗 *Payment Link:* ${paymentLink}\n\n` +
                `Thank you for choosing us!`;

            // 4. API Configuration
            // Since we only have patientId, we may need to find the tenantId/companyId if not provided.
            // For now, let's assume this is called with context or just use process.env as last resort
            // or better yet, fetch patient's company.
            const dynamicConfig = await this.getDynamicConfig(patient.company_id!, patient.tenant_id!);

            if (!dynamicConfig.enabled) {
                return { success: false, error: 'WhatsApp delivery is disabled.' };
            }

            const { instanceId, token } = dynamicConfig;
            const isMock = !token || token.includes('mock');

            if (isMock) {
                console.log(`[WhatsApp-Link-Mock] To: ${phone}\n[WhatsApp-Link-Mock] Content: ${message}`);
                return { success: true, message: "WhatsApp payment link simulated (Mock Mode)." };
            }

            // 5. Send Real Request
            const payload: any = {
                token: token,
                to: phone,
                body: message,
                priority: 10
            };

            // Ensure instanceId format is correct (e.g. instance12345)
            let cleanId = instanceId.toString().trim();
            if (cleanId.toLowerCase().startsWith('instance')) {
                cleanId = cleanId.substring(8); // Remove 'instance' 
            }
            const resolvedInstanceId = `instance${cleanId.toLowerCase()}`;

            const url = `https://api.ultramsg.com/${resolvedInstanceId}/messages/chat`;
            const maskedToken = token.length > 5 ? `${token.slice(0, 4)}...${token.slice(-2)}` : 'INVALID';
            console.log(`[WhatsApp-Fetch-Link] POST ${url} | Token: ${maskedToken} | To: ${phone}`);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log(`[WhatsApp-Payment-Link-Result] Raw:`, JSON.stringify(result));

            if (result.sent === "true" || result.success === true || result.id) {
                console.log(`[WhatsApp-Payment-Link-Success] Delivered to ${phone}`);
                return { success: true, message: 'Payment link sent via WhatsApp' };
            } else {
                console.error('[WhatsApp-Payment-Link-Error]', result);
                return { 
                    success: false, 
                    error: typeof result.error === 'object' ? JSON.stringify(result.error) : (result.error || result.message || 'Failed to send WhatsApp link') 
                };
            }

        } catch (error) {
            console.error("[NotificationService] Payment Link WhatsApp failed:", error);
            return { success: false, error: 'Internal server error' };
        }
    }

    /**
     * INTERNAL: Resolves the best WhatsApp configuration available.
     * Priority: Dynamic Settings (DB) > Environment Variables (Only if not a specific tenant)
     */
    private static async getDynamicConfig(companyId: string, tenantId: string) {
        // Handle potentially missing IDs by broadening the log context
        const safeCoId = companyId || 'Global';
        const safeTeId = tenantId || 'Unknown';
        const logPrefix = `[WhatsApp-Config][Co:${safeCoId.toString().slice(0, 8)}][Te:${safeTeId.toString().slice(0, 8)}]`;
        
        try {
            console.log(`${logPrefix} Resolving configuration...`);
            const dbConfig = await getWhatsAppConfig(companyId, tenantId);

            if (dbConfig) {
                const hasToken = !!dbConfig.token;
                console.log(`${logPrefix} Found DB config. Enabled: ${dbConfig.enabled}, Instance: ${dbConfig.instanceId}, TokenPresent: ${hasToken}`);
                
                return {
                    enabled: dbConfig.enabled ?? false,
                    instanceId: dbConfig.instanceId || '',
                    token: dbConfig.token || '',
                    autoSendBill: dbConfig.autoSendBill ?? false,
                    source: 'database'
                };
            }
            console.log(`${logPrefix} No DB config found in settings table.`);
        } catch (err) {
            console.error(`${logPrefix} Dynamic config fetch failed:`, err);
        }

        // Fallback to Environment Variables ONLY if we don't have a clear tenant context or as a last resort
        // In SaaS, we should be careful about using system tokens for tenant messages.
        const envToken = process.env.WHATSAPP_TOKEN;
        if (envToken && envToken.length > 5) {
            console.log(`${logPrefix} Falling back to System Environment Variables.`);
            return {
                enabled: true,
                instanceId: process.env.WHATSAPP_INSTANCE_ID || '',
                token: envToken,
                autoSendBill: false,
                source: 'env'
            };
        }

        console.warn(`${logPrefix} No configuration source available.`);
        return {
            enabled: false,
            instanceId: '',
            token: '',
            autoSendBill: false,
            source: 'none'
        };
    }
}
