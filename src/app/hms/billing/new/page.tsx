import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { InvoiceEditor } from "@/components/billing/invoice-editor"
import { getBillableItems, getTaxConfiguration } from "@/app/actions/billing"
import { auth } from "@/auth"

export default async function NewInvoicePage() {
    const session = await auth();
    if (!session?.user?.companyId) return <div>Unauthorized</div>;

    // Parallel data fetching
    const [patients, itemsRes, taxRes] = await Promise.all([
        prisma.hms_patient.findMany({
            where: {
                tenant_id: session.user.tenantId,
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

    const patientsReal = patients;
    const billableItems = itemsRes.success ? itemsRes.data : [];
    const taxConfig = taxRes.success ? taxRes.data : { defaultTax: null, taxRates: [] };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/hms/billing" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">New Invoice</h1>
                    <p className="text-gray-500">Create a new invoice for a patient.</p>
                </div>
            </div>

            <InvoiceEditor
                patients={patientsReal}
                billableItems={billableItems}
                taxConfig={taxConfig}
            />
        </div>
    )
}
