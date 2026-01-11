
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Searching for recently updated invoices...");
    const recentInvoices = await prisma.hms_invoice.findMany({
        take: 5,
        orderBy: { updated_at: 'desc' },
        include: { hms_invoice_payments: true, hms_patient: true }
    });

    for (const inv of recentInvoices) {
        console.log(`\n--- Invoice: ${inv.invoice_number} (ID: ${inv.id}) ---`);
        console.log(`Total: ${inv.total}, Paid: ${inv.total_paid}, Status: ${inv.status}`);
        console.log(`Patient: ${inv.hms_patient?.first_name} ${inv.hms_patient?.last_name} (${inv.patient_id})`);

        // Check Payments
        console.log(`Payments (${inv.hms_invoice_payments.length}):`);
        for (const p of inv.hms_invoice_payments) {
            console.log(` - ID: ${p.id}, Amount: ${p.amount}, Method: ${p.method}, Valid Ref: PMT-${p.id}`);

            // Check Journal for this payment
            const je = await prisma.journal_entries.findFirst({
                where: { ref: `PMT-${p.id}` }
            });
            console.log(`   -> Journal Entry: ${je ? `FOUND (ID: ${je.id}, Posted: ${je.posted})` : 'MISSING'}`);
        }

        // Check Accrual Journal
        const accrualJe = await prisma.journal_entries.findFirst({
            where: { invoice_id: inv.id, ref: inv.invoice_number }
        });
        console.log(`Accrual Journal: ${accrualJe ? `FOUND (ID: ${accrualJe.id})` : 'MISSING'}`);

        // Calculate Patient Balance exactly like the App
        const balance = await getPatientBalance(inv.patient_id, inv.company_id);
        console.log(`CALCULATED PATIENT BALANCE: ${balance}`);
    }
}

async function getPatientBalance(patientId: any, companyId: any) {
    if (!patientId || !companyId) return "N/A";
    const result = await prisma.journal_entry_lines.aggregate({
        where: {
            partner_id: patientId,
            company_id: companyId,
            journal_entries: {
                posted: true
            }
        },
        _sum: {
            debit: true,
            credit: true
        }
    });

    const totalDebit = Number(result._sum.debit || 0);
    const totalCredit = Number(result._sum.credit || 0);
    return totalDebit - totalCredit;
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
