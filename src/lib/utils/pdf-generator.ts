import PDFDocument from 'pdfkit';

export async function generateInvoicePDFBase64(invoice: any, company?: any): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const chunks: any[] = [];

            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => {
                const result = Buffer.concat(chunks);
                resolve(result.toString('base64'));
            });

            // --- Header ---
            doc.fillColor('#444444')
                .fontSize(20)
                .text('TAX INVOICE', 50, 50, { align: 'left' })
                .fontSize(10)
                .text(`Invoice #: ${invoice.invoice_number}`, 50, 75)
                .text(`Date: ${new Date(invoice.invoice_date || invoice.created_at).toLocaleDateString()}`, 50, 90);

            // Company Branding
            const companyName = company?.name || 'Hospital Management System';
            const meta = company?.metadata as any;
            const address = meta?.address || 'Healthcare Excellence';
            const contactStr = (meta?.email || meta?.phone)
                ? `${meta?.email || ''} ${meta?.email && meta?.phone ? '|' : ''} ${meta?.phone || ''}`
                : 'Premium Healthcare Services';

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
                .text('BILL TO', 50, 135)
                .fillColor('#000000')
                .fontSize(12)
                .font('Helvetica-Bold')
                .text(`${invoice.hms_patient?.first_name} ${invoice.hms_patient?.last_name}`, 50, 150)
                .font('Helvetica')
                .fontSize(10)
                .fillColor('#666666')
                .text(`Patient ID: ${invoice.hms_patient?.patient_number || 'N/A'}`, 50, 165)
                .text(`Mobile: ${((invoice.hms_patient?.contact as any)?.phone) || 'N/A'}`, 50, 180);

            // --- Table Header ---
            const tableTop = 230;
            const currency = invoice.currency || 'INR';
            const symbol = currency === 'INR' ? '₹' : currency + ' ';

            doc.font('Helvetica-Bold')
                .fontSize(10)
                .fillColor('#444444');

            doc.text('Item Description', 50, tableTop)
                .text('Qty', 280, tableTop, { width: 50, align: 'right' })
                .text(`Price (${currency})`, 330, tableTop, { width: 90, align: 'right' })
                .text(`Total (${currency})`, 450, tableTop, { width: 100, align: 'right' });

            doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke('#eeeeee');

            // --- Table Rows ---
            let currentY = tableTop + 30;
            doc.font('Helvetica').fontSize(10).fillColor('#333333');

            invoice.hms_invoice_lines.forEach((item: any) => {
                const description = item.description || 'Item';
                const qty = Number(item.quantity) || 0;
                const price = Number(item.unit_price) || 0;
                const total = Number(item.net_amount) || 0;

                doc.text(description, 50, currentY, { width: 220 })
                    .text(qty.toString(), 280, currentY, { width: 50, align: 'right' })
                    .text(`${price.toLocaleString('en-IN')}`, 350, currentY, { width: 70, align: 'right' })
                    .text(`${total.toLocaleString('en-IN')}`, 450, currentY, { width: 100, align: 'right' });

                currentY += 25;
            });

            // --- Totals ---
            const totalsY = currentY + 20;
            doc.moveTo(350, totalsY).lineTo(550, totalsY).stroke('#eeeeee');

            const rightLabelX = 350;
            const rightValueX = 450;

            doc.fontSize(10)
                .text('Subtotal:', rightLabelX, totalsY + 15, { width: 100, align: 'left' })
                .text(`${symbol}${Number(invoice.subtotal).toLocaleString('en-IN')}`, rightValueX, totalsY + 15, { width: 100, align: 'right' });

            doc.text('Tax:', rightLabelX, totalsY + 30)
                .text(`${symbol}${Number(invoice.total_tax).toLocaleString('en-IN')}`, rightValueX, totalsY + 30, { width: 100, align: 'right' });

            if (Number(invoice.total_discount) > 0) {
                doc.fillColor('#ef4444')
                    .text('Discount:', rightLabelX, totalsY + 45)
                    .text(`-${symbol}${Number(invoice.total_discount).toLocaleString('en-IN')}`, rightValueX, totalsY + 45, { width: 100, align: 'right' });
            }

            const grandTotalY = totalsY + 70;
            doc.rect(350, grandTotalY - 10, 200, 40).fill('#f8fafc');
            doc.fillColor('#0f172a')
                .font('Helvetica-Bold')
                .fontSize(12)
                .text('GRAND TOTAL', 360, grandTotalY)
                .fontSize(14)
                .text(`${symbol}${Number(invoice.total).toLocaleString('en-IN')}`, 450, grandTotalY, { width: 90, align: 'right' });

            // --- Footer ---
            doc.font('Helvetica')
                .fontSize(8)
                .fillColor('#999999')
                .text('This is a computer generated invoice and does not require a signature.', 0, 750, { align: 'center', width: 595 })
                .text(`Powered by cloud-hms.onrender.com | Generated on ${new Date().toLocaleString()}`, 0, 765, { align: 'center', width: 595 });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}
