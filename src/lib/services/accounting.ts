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
            // 2. Fetch Accounting Settings (Chart of Accounts Mapping)
            // We need to know where to book Sales, AR, and Tax.
            let settings = await prisma.company_accounting_settings.findUnique({
                where: { company_id: invoice.company_id }
            });

            // SELF-HEALING: Auto-configure defaults if missing
            if (!settings) {
                console.warn("Accounting Settings missing. Attempting auto-configuration...");
                try {
                    // A. Ensure Accounts Exist
                    const { ensureDefaultAccounts } = await import('@/lib/account-seeder');
                    await ensureDefaultAccounts(invoice.company_id, invoice.tenant_id);

                    // B. Find Standard Accounts
                    const accounts = await prisma.accounts.findMany({
                        where: { company_id: invoice.company_id }
                    });

                    const findId = (code: string) => accounts.find(a => a.code === code)?.id || '';

                    // C. Create Default Settings
                    settings = await prisma.company_accounting_settings.create({
                        data: {
                            company_id: invoice.company_id,
                            tenant_id: invoice.tenant_id,
                            ar_account_id: findId('1200'), // Accounts Receivable
                            ap_account_id: findId('2000'), // Accounts Payable
                            sales_account_id: findId('4000'), // Sales
                            purchase_account_id: findId('5000'), // COGS
                            output_tax_account_id: findId('2200'), // Output Tax
                            input_tax_account_id: findId('2210'), // Input Tax
                            fiscal_year_start: new Date(new Date().getFullYear(), 3, 1), // April 1st
                            fiscal_year_end: new Date(new Date().getFullYear() + 1, 2, 31), // March 31st
                        }
                    });
                } catch (configError) {
                    console.error("Failed to auto-configure accounting:", configError);
                }
            }

            if (!settings) throw new Error("Accounting settings not configured and auto-configuration failed.");

            // 3. Determine Accounts
            // DEBIT SIDE:
            // If Paid (Cash Sale) -> Cash/Bank Account or AR (Pending implementation of Cash Journals, defaulting to AR for consistency)
            let debitAccountId = settings.ar_account_id;

            if (invoice.status === 'paid') {
                debitAccountId = settings.ar_account_id;
            }

            // SAFETY: If AR Account is missing/deleted, try to heal it again or fail gracefully
            if (!debitAccountId) {
                const ar = await prisma.accounts.findFirst({ where: { company_id: invoice.company_id, code: '1200' } });
                if (ar) debitAccountId = ar.id;
                else throw new Error("Critical: Accounts Receivable (1200) not found.");
            }

            // CREDIT SIDE: Sales Income Account
            // Default Account
            let defaultSalesAccountId = settings.sales_account_id;
            if (!defaultSalesAccountId) {
                const sales = await prisma.accounts.findFirst({ where: { company_id: invoice.company_id, code: '4000' } });
                if (sales) defaultSalesAccountId = sales.id;
                else throw new Error("Critical: Sales Account (4000) not found.");
            }

            // Tax Account (Output VAT)
            let taxAccountId = settings.output_tax_account_id;
            // Note: Tax account might be optional if no tax, but good to have if tax > 0

            // 3.5 Fetch Product Logic for Granular Accounting (World Class)
            // Since invoice lines might not have direct relation loaded, we fetch products to check categories.
            const productIds = invoice.hms_invoice_lines
                .map(l => l.product_id)
                .filter(id => id !== null) as string[];

            const productAccountMap = new Map<string, string>(); // productId -> incomeAccountId

            if (productIds.length > 0) {
                const products = await prisma.hms_product.findMany({
                    where: { id: { in: productIds } },
                    include: {
                        hms_product_category_rel: {
                            include: {
                                hms_product_category: true
                            }
                        }
                    }
                });

                products.forEach(p => {
                    // Check for Category Override
                    const catRel = p.hms_product_category_rel?.[0];
                    const category = catRel?.hms_product_category;

                    if (category?.income_account_id) {
                        productAccountMap.set(p.id, category.income_account_id);
                    }
                });
            }

            // 4. Prepare Journal Entry Data
            const journalDate = invoice.invoice_date || invoice.created_at;

            // Line Items for the Journal
            const journalLines: any[] = [];

            // A. CREDIT: Sales Income (Grouped by Account)
            // Logic: Group line items by their target account (Default vs Category Specific)
            const salesByAccount = new Map<string, number>(); // accountId -> amount

            for (const line of invoice.hms_invoice_lines) {
                const netAmount = Number(line.net_amount || 0);
                if (netAmount === 0) continue;

                // Determine Account
                let targetAccount = defaultSalesAccountId;
                if (line.product_id && productAccountMap.has(line.product_id)) {
                    targetAccount = productAccountMap.get(line.product_id)!;
                }

                const currentTotal = salesByAccount.get(targetAccount) || 0;
                salesByAccount.set(targetAccount, currentTotal + netAmount);
            }

            salesByAccount.forEach((amount, accountId) => {
                if (amount > 0) {
                    journalLines.push({
                        account_id: accountId,
                        debit: 0,
                        credit: amount,
                        description: `Sales Revenue - Ref ${invoice.invoice_number}`,
                        metadata: { source: 'auto_generated_invoice' }
                    });
                }
            });

            // B. CREDIT: Output Tax
            const totalTax = Number(invoice.total_tax || 0);
            if (totalTax > 0) {
                if (!taxAccountId) throw new Error("Output Tax Account is not configured, but invoice has tax.");

                journalLines.push({
                    account_id: taxAccountId,
                    debit: 0,
                    credit: totalTax,
                    description: `Tax Payable - ${invoice.invoice_number}`,
                    metadata: { source: 'auto_generated_tax' }
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
                    metadata: { source: 'auto_generated_ar' }
                });
            }

            // 5. Validation (Dr == Cr)
            const totalDebit = journalLines.reduce((sum, l) => sum + l.debit, 0);
            const totalCredit = journalLines.reduce((sum, l) => sum + l.credit, 0);

            // Allow small float diff handling (0.01)
            if (Math.abs(totalDebit - totalCredit) > 0.01) {
                throw new Error(`Journal Entry Imbalanced: Debit ${totalDebit.toFixed(2)} != Credit ${totalCredit.toFixed(2)}`);
            }

            // 6. Create Transaction
            await prisma.$transaction(async (tx) => {
                // Create Journal Header (Sales Accrual)
                await tx.journal_entries.create({
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

                // PAYMENT HANDLING (AUTO-PAY)
                // If invoice is 'paid', we must close the AR immediately by booking Cash.
                if (invoice.status === 'paid' && totalReceivable > 0) {
                    // Try to find a Cash/Bank account from the Chart of Accounts
                    // We look for Assets with 'Cash' or 'Bank' in name, or code 1000 (Standard Cash)
                    const cashAccount = await tx.accounts.findFirst({
                        where: {
                            company_id: invoice.company_id,
                            type: 'Asset',
                            OR: [
                                { name: { contains: 'Cash', mode: 'insensitive' } },
                                { name: { contains: 'Bank', mode: 'insensitive' } },
                                { code: '1000' }
                            ]
                        },
                        orderBy: { code: 'asc' } // Prefer 'Cash on Hand' (usually 1000) over Bank (1010)
                    });

                    if (cashAccount) {
                        await tx.journal_entries.create({
                            data: {
                                tenant_id: invoice.tenant_id,
                                company_id: invoice.company_id,
                                invoice_id: invoice.id,
                                date: new Date(journalDate),
                                posted: true,
                                posted_at: new Date(),
                                created_by: userId,
                                currency_id: settings.currency_id,
                                amount_in_company_currency: totalReceivable,
                                ref: `${invoice.invoice_number}-PMT`,
                                journal_entry_lines: {
                                    create: [
                                        {
                                            tenant_id: invoice.tenant_id,
                                            company_id: invoice.company_id,
                                            account_id: cashAccount.id,
                                            debit: totalReceivable,
                                            credit: 0,
                                            description: `Cash Received`,
                                        },
                                        {
                                            tenant_id: invoice.tenant_id,
                                            company_id: invoice.company_id,
                                            account_id: debitAccountId, // AR Account
                                            debit: 0,
                                            credit: totalReceivable,
                                            description: `AR Cleared`,
                                            partner_id: invoice.patient_id
                                        }
                                    ]
                                }
                            }
                        });
                    } else {
                        console.warn("Invoice is Paid but no Cash Account found. AR left open.");
                    }
                }
            });

            return { success: true, journalId: 'created' };

        } catch (error: any) {
            console.error("Accounting Post Error:", error);
            return { success: false, error: error.message };
        }
    }
}
