
import { PaymentForm } from "@/components/accounting/payment-form"
import { prisma } from "@/lib/prisma"

export default async function NewPaymentPage() {
    // Fetch Vendors
    const suppliers = await prisma.hms_supplier.findMany({
        where: { is_active: true },
        select: { id: true, name: true },
        take: 1000
    });

    const partners = suppliers.map(s => ({
        id: s.id,
        name: s.name
    }));

    return <PaymentForm type="outbound" partners={partners} />
}
