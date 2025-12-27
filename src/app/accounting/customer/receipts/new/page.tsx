
import { PaymentForm } from "@/components/accounting/payment-form"
import { prisma } from "@/lib/prisma"

export default async function NewReceiptPage() {
    // Fetch Customers (Patients)
    // Filter by active?
    const patients = await prisma.hms_patient.findMany({
        select: { id: true, first_name: true, last_name: true },
        take: 1000 // Limit for now, assume search needed later
    });

    const partners = patients.map(p => ({
        id: p.id,
        name: `${p.first_name} ${p.last_name}`
    }));

    return <PaymentForm type="inbound" partners={partners} />
}
