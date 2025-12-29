import PDFDocument from 'pdfkit';

export async function generatePrescriptionPDFBase64(prescription: any, company?: any): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const chunks: any[] = [];

            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => {
                const result = Buffer.concat(chunks);
                resolve(result.toString('base64'));
            });

            // --- Header & Branding ---
            const companyName = company?.name || 'Hospital Management System';
            const meta = company?.metadata as any;
            const address = meta?.address || 'Healthcare Excellence';
            const contactStr = (meta?.email || meta?.phone)
                ? `${meta?.email || ''} ${meta?.email && meta?.phone ? '|' : ''} ${meta?.phone || ''}`
                : 'Premium Healthcare Services';

            doc.fillColor('#444444')
                .fontSize(20)
                .text('PRESCRIPTION', 50, 50, { align: 'left' })
                .fontSize(10)
                .text(`Date: ${new Date(prescription.created_at).toLocaleDateString()}`, 50, 75);

            doc.fontSize(14)
                .fillColor('#4f46e5')
                .text(companyName, 200, 50, { align: 'right' })
                .fontSize(10)
                .fillColor('#666666')
                .text(address, 200, 70, { align: 'right' })
                .text(contactStr, 200, 85, { align: 'right' });

            doc.moveTo(50, 115).lineTo(550, 115).stroke('#eeeeee');

            // --- Patient Info ---
            doc.fillColor('#999999')
                .fontSize(10)
                .text('PATIENT', 50, 135)
                .fillColor('#000000')
                .fontSize(12)
                .font('Helvetica-Bold')
                .text(`${prescription.hms_patient?.first_name} ${prescription.hms_patient?.last_name}`, 50, 150)
                .font('Helvetica')
                .fontSize(10)
                .fillColor('#666666')
                .text(`Age/Gender: ${prescription.hms_patient?.age || 'N/A'} / ${prescription.hms_patient?.gender || 'N/A'}`, 50, 165);

            // --- Clinical Findings ---
            let currentY = 200;
            const sections = [
                { label: 'Vitals', value: prescription.vitals },
                { label: 'Presenting Complaint', value: prescription.complaint },
                { label: 'Examination', value: prescription.examination },
                { label: 'Diagnosis', value: prescription.diagnosis }
            ];

            sections.forEach(section => {
                if (section.value && section.value.trim()) {
                    doc.font('Helvetica-Bold').fontSize(10).fillColor('#444444').text(section.label.toUpperCase(), 50, currentY);
                    doc.font('Helvetica').fontSize(10).fillColor('#333333').text(section.value, 50, currentY + 15, { width: 500 });
                    const lines = doc.heightOfString(section.value, { width: 500 });
                    currentY += lines + 35;
                }
            });

            // --- Rx Symbol ---
            doc.fontSize(24).font('Helvetica-Bold').fillColor('#4f46e5').text('Rx', 50, currentY);
            currentY += 30;

            // --- Medicines Table ---
            doc.font('Helvetica-Bold').fontSize(10).fillColor('#444444');
            doc.text('Medicine', 50, currentY)
                .text('Dosage', 250, currentY)
                .text('Duration', 400, currentY)
                .text('Timing', 480, currentY);

            doc.moveTo(50, currentY + 15).lineTo(550, currentY + 15).stroke('#eeeeee');
            currentY += 25;

            doc.font('Helvetica').fontSize(10).fillColor('#333333');
            prescription.prescription_items.forEach((item: any) => {
                const medName = item.hms_product?.name || 'Medicine';
                const dosage = `${item.morning}-${item.afternoon}-${item.evening}-${item.night}`;
                const duration = `${item.days} Days`;
                const timing = item.timing || 'After Food';

                doc.text(medName, 50, currentY, { width: 190 })
                    .text(dosage, 250, currentY)
                    .text(duration, 400, currentY)
                    .text(timing, 480, currentY);

                const nameHeight = doc.heightOfString(medName, { width: 190 });
                currentY += Math.max(nameHeight, 20) + 10;
            });

            // --- Plan/Notes ---
            if (prescription.plan && prescription.plan.trim()) {
                currentY += 20;
                doc.font('Helvetica-Bold').fontSize(10).fillColor('#444444').text('ADVICE / PLAN', 50, currentY);
                doc.font('Helvetica').fontSize(10).fillColor('#333333').text(prescription.plan, 50, currentY + 15, { width: 500 });
            }

            // --- Footer ---
            doc.font('Helvetica')
                .fontSize(8)
                .fillColor('#999999')
                .text('This is a computer generated prescription.', 0, 750, { align: 'center', width: 595 })
                .text(`Powered by cloud-hms.onrender.com | Generated on ${new Date().toLocaleString()}`, 0, 765, { align: 'center', width: 595 });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}
