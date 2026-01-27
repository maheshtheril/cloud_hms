import { jsPDF } from 'jspdf';

export async function generatePrescriptionPDFBase64(prescription: any, company?: any): Promise<string> {
    try {
        const doc = new jsPDF('p', 'pt', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();

        // --- Header & Branding ---
        const companyName = company?.name || 'Hospital Management System';
        const meta = company?.metadata as any;
        const address = meta?.address || 'Healthcare Excellence';
        const contactStr = (meta?.email || meta?.phone)
            ? `${meta?.email || ''} ${meta?.email && meta?.phone ? ' | ' : ''} ${meta?.phone || ''}`
            : 'Premium Healthcare Services';

        // Set colors and fonts
        doc.setTextColor(68, 68, 68);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('PRESCRIPTION', 50, 60);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date(prescription.created_at).toLocaleDateString()}`, 50, 80);

        // Company info (Right aligned)
        doc.setTextColor(79, 70, 229); // Indigo-600
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(companyName, pageWidth - 50, 60, { align: 'right' });

        doc.setTextColor(102, 102, 102);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(address, pageWidth - 50, 75, { align: 'right' });
        doc.text(contactStr, pageWidth - 50, 90, { align: 'right' });

        // Divider
        doc.setDrawColor(238, 238, 238);
        doc.line(50, 115, pageWidth - 50, 115);

        // --- Patient Info ---
        doc.setTextColor(153, 153, 153);
        doc.setFontSize(10);
        doc.text('PATIENT', 50, 140);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${prescription.hms_patient?.first_name} ${prescription.hms_patient?.last_name}`, 50, 155);

        doc.setTextColor(102, 102, 102);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Age/Gender: ${prescription.hms_patient?.age || 'N/A'} / ${prescription.hms_patient?.gender || 'N/A'}`, 50, 170);

        const patientMeta = prescription.hms_patient?.metadata as any;
        if (patientMeta?.registration_expiry) {
            const expiryStr = new Date(patientMeta.registration_expiry).toLocaleDateString();
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(220, 38, 38); // Red-600
            doc.text(`Registration Valid Till: ${expiryStr}`, 50, 185);
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
