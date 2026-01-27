import { jsPDF } from 'jspdf';

export async function generateInvoicePDFBase64(invoice: any, company?: any): Promise<string> {
    try {
        const doc = new jsPDF('p', 'pt', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();

        // --- Header ---
        doc.setTextColor(68, 68, 68);
        doc.setFontSize(26);
        doc.setFont('helvetica', 'bold');
        doc.text('TAX INVOICE', 50, 60);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Invoice #: ${invoice.invoice_number}`, 50, 80);
        doc.text(`Date: ${new Date(invoice.invoice_date || invoice.created_at).toLocaleDateString()}`, 50, 95);

        // Company Branding (Right Aligned)
        const companyName = company?.name || 'Hospital Management System';
        const meta = company?.metadata as any;
        const address = meta?.address || 'Healthcare Excellence';
        const contactStr = (meta?.email || meta?.phone)
            ? `${meta?.email || ''} ${meta?.email && meta?.phone ? ' | ' : ''} ${meta?.phone || ''}`
            : 'Premium Healthcare Services';

        doc.setTextColor(79, 70, 229); // Indigo-600
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(companyName, pageWidth - 50, 60, { align: 'right' });

        doc.setTextColor(102, 102, 102);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(address, pageWidth - 50, 78, { align: 'right' });
        doc.text(contactStr, pageWidth - 50, 93, { align: 'right' });

        if (meta?.gstin) {
            doc.text(`GSTIN: ${meta.gstin}`, pageWidth - 50, 108, { align: 'right' });
        }

        // Divider
        doc.setDrawColor(238, 238, 238);
        doc.line(50, 115, pageWidth - 50, 115);

        // --- Patient Info ---
        doc.setTextColor(153, 153, 153);
        doc.setFontSize(10);
        doc.text('BILL TO', 50, 140);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${invoice.hms_patient?.first_name} ${invoice.hms_patient?.last_name}`, 50, 155);

        doc.setTextColor(102, 102, 102);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Patient ID: ${invoice.hms_patient?.patient_number || 'N/A'}`, 50, 170);
        doc.text(`Mobile: ${((invoice.hms_patient?.contact as any)?.phone) || 'N/A'}`, 50, 185);

        const patientMeta = invoice.hms_patient?.metadata as any;
        if (patientMeta?.registration_expiry) {
            const expiryStr = new Date(patientMeta.registration_expiry).toLocaleDateString();
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(220, 38, 38); // Red-600
            doc.text(`Registration Valid Till: ${expiryStr}`, 50, 200);
            doc.setTextColor(102, 102, 102);
            doc.setFont('helvetica', 'normal');
        }

        // --- Table Headers ---
        const tableTop = 230;
        const currency = invoice.currency || 'INR';
        const symbol = currency === 'INR' ? 'Rs. ' : currency + ' ';

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(68, 68, 68);
        doc.text('Item Description', 50, tableTop);
        doc.text('Qty', 300, tableTop, { align: 'right' });
        doc.text(`Price (${currency})`, 400, tableTop, { align: 'right' });
        doc.text(`Total (${currency})`, pageWidth - 50, tableTop, { align: 'right' });

        doc.setDrawColor(238, 238, 238);
        doc.line(50, tableTop + 7, pageWidth - 50, tableTop + 7);

        // --- Table Rows ---
        let currentY = tableTop + 25;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 51, 51);

        invoice.hms_invoice_lines.forEach((item: any) => {
            const description = item.description || 'Item';
            const qty = Number(item.quantity) || 0;
            const price = Number(item.unit_price) || 0;
            const total = Number(item.net_amount) || 0;

            const splitDesc = doc.splitTextToSize(description, 230);
            doc.text(splitDesc, 50, currentY);
            doc.text(qty.toString(), 300, currentY, { align: 'right' });
            doc.text(price.toLocaleString('en-IN'), 400, currentY, { align: 'right' });
            doc.text(total.toLocaleString('en-IN'), pageWidth - 50, currentY, { align: 'right' });

            currentY += Math.max(splitDesc.length * 12, 20) + 10;
        });

        // --- Totals Section ---
        let totalsY = currentY + 20;
        doc.line(350, totalsY, pageWidth - 50, totalsY);

        const rightLabelX = 360;
        const rightValueX = pageWidth - 50;

        doc.setFontSize(10);
        doc.text('Subtotal:', rightLabelX, totalsY + 20);
        doc.text(`${symbol}${Number(invoice.subtotal).toLocaleString('en-IN')}`, rightValueX, totalsY + 20, { align: 'right' });

        doc.text('Tax:', rightLabelX, totalsY + 35);
        doc.text(`${symbol}${Number(invoice.total_tax).toLocaleString('en-IN')}`, rightValueX, totalsY + 35, { align: 'right' });

        if (Number(invoice.total_discount) > 0) {
            doc.setTextColor(239, 68, 68); // Red-500
            doc.text('Discount:', rightLabelX, totalsY + 50);
            doc.text(`-${symbol}${Number(invoice.total_discount).toLocaleString('en-IN')}`, rightValueX, totalsY + 50, { align: 'right' });
            totalsY += 15;
        }

        const grandTotalY = totalsY + 65;
        doc.setFillColor(248, 250, 252); // slate-50
        doc.rect(350, grandTotalY - 15, pageWidth - 350 - 50, 40, 'F');

        doc.setTextColor(15, 23, 42); // slate-900
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('GRAND TOTAL', 365, grandTotalY + 10);
        doc.setFontSize(16);
        doc.text(`${symbol}${Number(invoice.total).toLocaleString('en-IN')}`, rightValueX - 10, grandTotalY + 10, { align: 'right' });

        // --- Footer ---
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(153, 153, 153);
        const footerText1 = 'This is a computer generated invoice and does not require a signature.';
        const footerText2 = `Generated on ${new Date().toLocaleString()}`;

        doc.text(footerText1, pageWidth / 2, 780, { align: 'center' });
        doc.text(footerText2, pageWidth / 2, 795, { align: 'center' });

        return doc.output('datauristring').split(',')[1];
    } catch (err) {
        throw err;
    }
}
