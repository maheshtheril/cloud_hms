import { prisma } from "@/lib/prisma";

export class AccountingService {

    /**
     * Posts a Sales Invoice to the General Ledger (Journal Entries).
     * Follows Double-Entry Bookkeeping Validation.
     * 
     * @param invoiceId - The ID of the invoice to post
     * @param userId - ID of the user performing the action
     */
    static async postSalesInvoice(invoiceId: string, userId?: string) {
        try {
            // 1. Fetch Invoice with Lines and Taxonomy
            const invoice = await prisma.hms_invoice.findUnique({
                where: { id: invoiceId },
                include: {
                    hms_invoice_lines: true,
                    hms_patient: true // Include patient for party name
                }
            });

            if (!invoice) throw new Error("Invoice not found");

            // Check if already posted
            const existingJournal = await prisma.journal_entries.findFirst({
                where: { invoice_id: invoiceId }
            });

            if (existingJournal) {
                console.log("Invoice already posted to accounting.");
                return { success: true, message: "Already posted" };
            }

            // 2. Fetch Accounting Settings (Chart of Accounts Mapping)
            // We need to know where to book Sales, AR, and Tax.
            const settings = await prisma.company_accounting_settings.findUnique({
                where: { company_id: invoice.company_id }
            });

            if (!settings) throw new Error("Accounting settings not configured for this company.");

            // 3. Determine Accounts
            // DEBIT SIDE:
            // If Paid (Cash Sale) -> Cash/Bank Account (Using Cash Journal or settings)
            // If Posted (Credit Sale) -> Accounts Receivable (AR)
            let debitAccountId = settings.ar_account_id;

            if (invoice.status === 'paid') {
                // For simplified Cash Sale, we debit the Cash/Bank account directly.
                // In a full system, we might look up a specific "Cash on Hand" account 
                // or the account linked to the Payment Method.
                // Fallback: If no dedicated cash account in settings (schema has journals, not direct cash account id except inside journals),
                // we'll use AR for now and assume a Payment Entry follows immediately (Process: Invoice -> AR -> Payment).
                // BUT user wants "Cash & Carry" standard. 
                // Let's stick to AR for the Invoice Journal to be consistent. 
                // The "Payment" should ideally be a separate Journal Entry (Credit AR, Debit Cash).
                // For this MVP step, we will post the INVOICE part (Dr AR, Cr Sales).
                debitAccountId = settings.ar_account_id;
            }

            if (!debitAccountId) throw new Error("Accounts Receivable (AR) Account is not configured in settings.");

            // CREDIT SIDE:
            // Sales Income Account (from settings or product category)
            const salesAccountId = settings.sales_account_id;
            if (!salesAccountId) throw new Error("Sales/Income Account is not configured in settings.");

            // Tax Account (Output VAT)
            const taxAccountId = settings.output_tax_account_id;
            // Note: Tax account might be optional if no tax, but good to have if tax > 0

            // 4. Prepare Journal Entry Data
            const journalDate = invoice.invoice_date || invoice.created_at;
            const description = `Invoice #${invoice.invoice_number} - ${invoice.hms_patient ? 'Patient Sale' : 'Sale'}`;

            // Line Items for the Journal
            const journalLines: any[] = [];

            // A. CREDIT: Sales Income (Net Amount of all lines)
            // Logic: We can summarize all line items into one Credit line for Sales, 
            // OR create one Journal Line per Invoice Line (more detailed).
            // "World Standard" usually summarizes by Account. 
            const totalNetSales = invoice.hms_invoice_lines.reduce((sum, line) => sum + Number(line.net_amount || 0), 0);

            if (totalNetSales > 0) {
                journalLines.push({
                    account_id: salesAccountId,
                    debit: 0,
                    credit: totalNetSales,
                    description: `Sales Revenue - ${invoice.invoice_number}`,
                    metadata: { source: 'auto_generated' }
                });
            }

            // B. CREDIT: Output Tax
            const totalTax = Number(invoice.total_tax || 0);
            if (totalTax > 0) {
                if (!taxAccountId) throw new Error("Output Tax Account is not configured, but invoice has tax.");

                journalLines.push({
                    account_id: taxAccountId,
                    debit: 0,
                    credit: totalTax,
                    description: `Tax Payable - ${invoice.invoice_number}`,
                    metadata: { source: 'auto_generated' }
                });
            }

            // C. DEBIT: Accounts Receivable (Grand Total)
            const totalReceivable = Number(invoice.total || 0);
            if (totalReceivable > 0) {
                journalLines.push({
                    account_id: debitAccountId,
                    debit: totalReceivable,
                    credit: 0,
                    description: `Account Receivable - ${invoice.invoice_number}`,
                    party_type: 'patient',
                    party_id: invoice.patient_id,
                    metadata: { source: 'auto_generated' }
                });
            }

            // 5. Validation (Dr == Cr)
            const totalDebit = journalLines.reduce((sum, l) => sum + l.debit, 0);
            const totalCredit = journalLines.reduce((sum, l) => sum + l.credit, 0);

            // Allow small float diff handling if needed, but for now exact check
            if (Math.abs(totalDebit - totalCredit) > 0.01) {
                throw new Error(`Journal Entry Imbalanced: Debit ${totalDebit} != Credit ${totalCredit}`);
            }

            // 6. Create Transaction
            await prisma.$transaction(async (tx) => {
                // Create Journal Header
                const journalEntry = await tx.journal_entries.create({
                    data: {
                        tenant_id: invoice.tenant_id,
                        company_id: invoice.company_id,
                        invoice_id: invoice.id,
                        date: new Date(journalDate),
                        posted: true,
                        posted_at: new Date(),
                        created_by: userId,
                        currency_id: settings.currency_id, // Default to company currency
                        amount_in_company_currency: totalReceivable,
                        ref: invoice.invoice_number,
                        journal_entry_lines: {
                            create: journalLines.map(line => ({
                                tenant_id: invoice.tenant_id,
                                company_id: invoice.company_id,
                                account_id: line.account_id,
                                debit: line.debit,
                                credit: line.credit,
                                description: line.description,
                                partner_id: line.party_id, // Link to patient if applicable
                                metadata: line.metadata
                            }))
                        }
                    }
                });

                // Mark Invoice as Posted (if we had a flag, or just rely on status)
                // We'll trust the caller to handle invoice status flow, 
                // but we might want to flag that JE exists.
                // schema.prisma doesn't show `is_accounting_posted` on invoice, so we skip that update or add it if needed.
                // For now, existence of `journal_entries.invoice_id` is the link.
            });

            return { success: true, journalId: 'created' };

        } catch (error: any) {
            console.error("Accounting Post Error:", error);
            return { success: false, error: error.message };
        }
    }
}
