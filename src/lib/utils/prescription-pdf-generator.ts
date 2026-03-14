import { jsPDF } from 'jspdf';
import { getPDFConfig } from '@/app/actions/settings';

export async function generatePrescriptionPDFBase64(prescription: any, company?: any): Promise<string> {
    try {
        const doc = new jsPDF('p', 'pt', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();

        // --- Branding & Configuration ---
        const config = await getPDFConfig(prescription.company_id!, prescription.tenant_id!);
        const alignment = config?.headerAlignment || 'right';
        const showLogo = config?.showLogo ?? true;
        const logoUrl = company?.logo_url;

        let headerY = 60;
        const margin = 50;
        const contentWidth = pageWidth - (margin * 2);

        // Hospital Details
        const companyName = company?.name || 'Hospital Management System';
        const meta = company?.metadata as any;
        const address = meta?.address || 'Healthcare Excellence';
        const contactStr = (meta?.email || meta?.phone)
            ? `${meta?.email || ''}${meta?.email && meta?.phone ? ' | ' : ''}${meta?.phone || ''}`
            : 'Premium Healthcare Services';

        // 1. Draw Title (PRESCRIPTION) - always top left
        doc.setTextColor(68, 68, 68);
        doc.setFontSize(14); // Reduced from 24
        doc.setFont('helvetica', 'bold');
        doc.text('PRESCRIPTION', margin, headerY);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date(prescription.created_at).toLocaleDateString()}`, margin, headerY + 15);

        // 2. Draw Logo if enabled
        let logoHeight = 0;
        if (showLogo && logoUrl) {
            try {
                let logoX = margin;
                if (alignment === 'right') logoX = pageWidth - margin - 60;
                else if (alignment === 'center') logoX = (pageWidth / 2) - 30;

                const logoBase64 = await fetchImageAsBase64(logoUrl);
                if (logoBase64) {
                    doc.addImage(logoBase64, 'PNG', logoX, headerY - 30, 60, 60, undefined, 'FAST');
                    logoHeight = 40;
                }
            } catch (e) {
                console.error("[Prescription-Logo] Failed to embed logo:", e);
            }
        }

        // 3. Draw Branding Info
        const brandX = alignment === 'right' ? pageWidth - margin : (alignment === 'center' ? pageWidth / 2 : margin);
        const textAlign = alignment;

        doc.setTextColor(79, 70, 229); // Indigo-600
        doc.setFontSize(config?.hospitalNameSize || 12); // Reduced from 14
        doc.setFont('helvetica', 'bold');

        let brandY = headerY + logoHeight;
        if (alignment === 'center') brandY = headerY + 60;
        if (alignment === 'left') brandY = headerY + 70;

        doc.text(companyName, brandX, brandY, { align: textAlign });

        doc.setTextColor(102, 102, 102);
        doc.setFontSize(config?.addressSize || 8); // Reduced from 10
        doc.setFont('helvetica', 'normal');
        doc.text(address, brandX, brandY + 12, { align: textAlign });

        if (config?.showContactInfo !== false) {
            doc.text(contactStr, brandX, brandY + 22, { align: textAlign });
        }

        // Divider
        doc.setDrawColor(238, 238, 238);
        const dividerY = Math.max(brandY + 35, 115);
        doc.line(margin, dividerY, pageWidth - margin, dividerY);

        // --- Patient Info ---
        doc.setTextColor(153, 153, 153);
        doc.setFontSize(8);
        doc.text('PATIENT', margin, dividerY + 20);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10); // Reduced from 12
        doc.setFont('helvetica', 'bold');
        doc.text(`${prescription.hms_patient?.first_name} ${prescription.hms_patient?.last_name}`, margin, dividerY + 35);

        doc.setTextColor(102, 102, 102);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Age/Gender: ${prescription.hms_patient?.age || 'N/A'} / ${prescription.hms_patient?.gender || 'N/A'}`, margin, dividerY + 47);

        const patientMeta = prescription.hms_patient?.metadata as any;
        if (patientMeta?.registration_expiry) {
            const expiryStr = new Date(patientMeta.registration_expiry).toLocaleDateString();
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(220, 38, 38); // Red-600
            doc.text(`Registration Valid Till: ${expiryStr}`, margin, dividerY + 59);
            doc.setTextColor(102, 102, 102);
            doc.setFont('helvetica', 'normal');
        }

        // --- Clinical Findings ---
        let currentY = 210;
        const sections = [
            { label: 'Vitals', value: prescription.vitals },
            { label: 'Presenting Complaint', value: prescription.complaint },
            { label: 'Examination', value: prescription.examination },
            { label: 'Diagnosis', value: prescription.diagnosis }
        ];

        sections.forEach(section => {
            if (section.value && section.value.trim()) {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(68, 68, 68);
                doc.text(section.label.toUpperCase(), 50, currentY);

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(51, 51, 51);

                const splitText = doc.splitTextToSize(section.value, pageWidth - 100);
                doc.text(splitText, 50, currentY + 15);

                currentY += (splitText.length * 12) + 35;
            }
        });

        // --- Rx Symbol ---
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 70, 229);
        doc.text('Rx', 50, currentY);
        currentY += 30;

        // --- Medicines Table ---
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(68, 68, 68);
        doc.text('Medicine', 50, currentY);
        doc.text('Dosage', 250, currentY);
        doc.text('Duration', 400, currentY);
        doc.text('Timing', 480, currentY);

        doc.setDrawColor(238, 238, 238);
        doc.line(50, currentY + 7, pageWidth - 50, currentY + 7);
        currentY += 25;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 51, 51);

        prescription.prescription_items.forEach((item: any) => {
            const medName = item.hms_product?.name || 'Medicine';
            const dosage = `${item.morning}-${item.afternoon}-${item.evening}-${item.night}`;
            const duration = `${item.days} Days`;
            const timing = item.timing || 'After Food';

            const splitMedName = doc.splitTextToSize(medName, 180);
            doc.text(splitMedName, 50, currentY);
            doc.text(dosage, 250, currentY);
            doc.text(duration, 400, currentY);
            doc.text(timing, 480, currentY);

            currentY += Math.max(splitMedName.length * 12, 20) + 10;
        });

        // --- Plan/Notes ---
        if (prescription.plan && prescription.plan.trim()) {
            currentY += 20;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(68, 68, 68);
            doc.text('ADVICE / PLAN', 50, currentY);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(51, 51, 51);
            const splitPlan = doc.splitTextToSize(prescription.plan, pageWidth - 100);
            doc.text(splitPlan, 50, currentY + 15);
        }

        // --- Footer ---
        doc.setFontSize(8);
        doc.setTextColor(153, 153, 153);
        const footerText1 = 'This is a computer generated prescription.';
        const footerText2 = `Generated on ${new Date().toLocaleString()}`;

        doc.text(footerText1, pageWidth / 2, 780, { align: 'center' });
        doc.text(footerText2, pageWidth / 2, 795, { align: 'center' });

        const pdfBase64 = doc.output('datauristring').split(',')[1];
        return pdfBase64;
    } catch (err) {
        throw err;
    }
}

/**
 * Helper to fetch external image and convert to Base64 for PDF embedding
 */
async function fetchImageAsBase64(url: string): Promise<string | null> {
    try {
        if (!url) return null;
        if (url.startsWith('data:')) return url;

        const response = await fetch(url);
        if (!response.ok) return null;

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = response.headers.get('content-type') || 'image/png';

        return `data:${mimeType};base64,${buffer.toString('base64')}`;
    } catch (error) {
        console.error("fetchImageAsBase64 failed:", error);
        return null;
    }
}
