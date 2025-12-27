import { prisma } from "@/lib/prisma"
import { CompactInvoiceEditor } from "@/components/billing/invoice-editor-compact"
import { getBillableItems, getTaxConfiguration } from "@/app/actions/billing"
import { auth } from "@/auth"
import { notFound } from "next/navigation"

export default async function InterceptedEditInvoicePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.companyId || !session?.user?.tenantId) return <div>Unauthorized</div>;

    const tenantId = session.user.tenantId;

    // Parallel data fetching
    const [invoice, patients, itemsRes, taxRes] = await Promise.all([
        prisma.hms_invoice.findUnique({
            where: { id },
            include: {
                hms_invoice_lines: true,
                hms_invoice_payments: true
            }
        }),
        prisma.hms_patient.findMany({
            where: {
                tenant_id: tenantId
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                contact: true,
                patient_number: true,
                dob: true,
                gender: true
            },
            orderBy: { updated_at: 'desc' },
            take: 50
        }),
        getBillableItems(),
        getTaxConfiguration()
    ]);

    if (!invoice) return notFound();

    const billableItems = itemsRes.success ? itemsRes.data : [];
    const taxConfig = taxRes.success ? taxRes.data : { defaultTax: null, taxRates: [] };

    return (
        <CompactInvoiceEditor
            patients={JSON.parse(JSON.stringify(patients))}
            billableItems={JSON.parse(JSON.stringify(billableItems))}
            taxConfig={JSON.parse(JSON.stringify(taxConfig))}
            initialInvoice={JSON.parse(JSON.stringify(invoice))}
        />
    )
}
