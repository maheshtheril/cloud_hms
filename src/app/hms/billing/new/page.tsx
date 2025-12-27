import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CompactInvoiceEditor } from "@/components/billing/invoice-editor-compact"
import { getBillableItems, getTaxConfiguration } from "@/app/actions/billing"
import { auth } from "@/auth"

export default async function NewInvoicePage({
    searchParams
}: {
    searchParams: Promise<{
        patientId?: string
        medicines?: string
        items?: string
        appointmentId?: string
    }>
}) {
    const session = await auth();
    if (!session?.user?.companyId || !session?.user?.tenantId) return <div>Unauthorized</div>;

    const { patientId, medicines, items, appointmentId } = await searchParams;
    const tenantId = session.user.tenantId;

    // Parallel data fetching
    const [patients, itemsRes, taxRes] = await Promise.all([
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

    const billableItems = itemsRes.success ? itemsRes.data : [];
    const taxConfig = taxRes.success ? taxRes.data : { defaultTax: null, taxRates: [] };

    // Standardize initial items (medicines or generic items)
    const initialItems = items ? JSON.parse(decodeURIComponent(items)) : (medicines ? JSON.parse(decodeURIComponent(medicines)) : undefined);

    return (
        <CompactInvoiceEditor
            patients={JSON.parse(JSON.stringify(patients))}
            billableItems={JSON.parse(JSON.stringify(billableItems))}
            taxConfig={JSON.parse(JSON.stringify(taxConfig))}
            initialPatientId={patientId}
            initialMedicines={initialItems}
            appointmentId={appointmentId}
        />
    )
}
