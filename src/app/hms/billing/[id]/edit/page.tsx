import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { InvoiceEditor } from "@/components/billing/invoice-editor"
import { getBillableItems, getTaxConfiguration } from "@/app/actions/billing"
import { auth } from "@/auth"
import { notFound } from "next/navigation"

export default async function EditInvoicePage({
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
                hms_invoice_lines: true
            }
        }),
        prisma.hms_patient.findMany({
            where: {
                tenant_id: tenantId // Filter by current user's tenant
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
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/hms/billing/${invoice.id}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Edit Invoice</h1>
                    <p className="text-gray-500">
                        {invoice.invoice_number}
                    </p>
                </div>
            </div>

            <InvoiceEditor
                patients={JSON.parse(JSON.stringify(patients))}
                billableItems={JSON.parse(JSON.stringify(billableItems))}
                taxConfig={JSON.parse(JSON.stringify(taxConfig))}
                initialInvoice={JSON.parse(JSON.stringify(invoice))}
            />
        </div>
    )
}
