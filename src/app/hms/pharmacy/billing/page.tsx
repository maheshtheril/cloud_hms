import { prisma } from "@/lib/prisma"
import { CompactInvoiceEditor } from "@/components/billing/invoice-editor-compact"
import { getBillableItems, getTaxConfiguration, getUoms } from "@/app/actions/billing"
import { auth } from "@/auth"

export default async function PharmacyBillingPage({
    searchParams
}: {
    searchParams: Promise<{
        patientId?: string
    }>
}) {
    const session = await auth();
    if (!session?.user?.tenantId) return <div>Unauthorized</div>;

    const { patientId } = await searchParams;
    const tenantId = session.user.tenantId;

    // Parallel data fetching
    const [patients, itemsRes, taxRes, uomsRes, companySettings] = await Promise.all([
        prisma.hms_patient.findMany({
            where: { tenant_id: tenantId },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                contact: true,
                patient_number: true,
                dob: true,
                gender: true,
                metadata: true
            },
            orderBy: { updated_at: 'desc' },
            take: 50
        }),
        getBillableItems(),
        getTaxConfiguration(),
        getUoms(),
        prisma.company_settings.findUnique({
            where: { company_id: session.user.companyId || session.user.tenantId },
            include: { currencies: true }
        })
    ]);

    const billableItems = itemsRes.success ? itemsRes.data : [];
    const taxConfig = taxRes.success ? taxRes.data : { defaultTax: null, taxRates: [] };
    const uoms = (uomsRes as any).success ? (uomsRes as any).data : [];
    const currency = companySettings?.currencies?.symbol || '₹';

    return (
        <div className="p-4 sm:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Pharmacy Billing</h1>
                <p className="text-slate-500 text-sm">Create bills for prescribed medicines and OTC sales.</p>
            </div>

            <CompactInvoiceEditor
                patients={JSON.parse(JSON.stringify(patients))}
                billableItems={JSON.parse(JSON.stringify(billableItems))}
                uoms={JSON.parse(JSON.stringify(uoms))}
                taxConfig={JSON.parse(JSON.stringify(taxConfig))}
                initialPatientId={patientId}
                currency={currency}
            />
        </div>
    )
}
