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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Container - Max size constrained to viewport to avoid scroll */}
            <div className="w-full max-w-5xl h-[85vh] max-h-[800px] flex flex-col relative z-50">
                {/* Close Overlay (Click outside) */}
                <Link href="/hms/billing" className="absolute -top-10 right-0 text-white/80 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
                    Close <ArrowLeft className="h-4 w-4" />
                </Link>

                <CompactInvoiceEditor
                    patients={JSON.parse(JSON.stringify(patients))}
                    billableItems={JSON.parse(JSON.stringify(billableItems))}
                    taxConfig={JSON.parse(JSON.stringify(taxConfig))}
                    initialPatientId={patientId}
                    initialMedicines={initialItems}
                    appointmentId={appointmentId}
                />
            </div>
        </div>
    )
}
