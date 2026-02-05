import { RegistrationVoucher } from "@/components/hms/billing/registration-voucher"
import { getHMSSettings } from "@/app/actions/settings"
import { getBillableItems, getTaxConfiguration, getUoms } from "@/app/actions/billing"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function RegistrationVoucherPage() {
    const session = await auth();
    if (!session?.user?.tenantId) return <div>Unauthorized</div>;

    // 1. Fetch Clinical & Financial Settings
    const hmsSettings = await getHMSSettings();

    if (hmsSettings.error) {
        console.error("Voucher Settings Load Failed:", hmsSettings.error);
    }

    const {
        registrationFee,
        registrationProductId,
        registrationProductName,
        registrationProductDescription
    } = hmsSettings.success ? (hmsSettings.settings as any) : {
        registrationFee: 100,
        registrationProductId: null,
        registrationProductName: 'Patient Registration Fee',
        registrationProductDescription: 'Standard Service'
    };

    // 2. Fetch Master Data for Editor
    const [patients, itemsRes, taxRes, uomsRes, companySettings] = await Promise.all([
        prisma.hms_patient.findMany({
            where: { tenant_id: session.user.tenantId },
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
            take: 20
        }),
        getBillableItems(),
        getTaxConfiguration(),
        getUoms(),
        prisma.company_settings.findFirst({
            where: { tenant_id: session.user.tenantId },
            include: { currencies: true }
        })
    ]);

    const billableItems = itemsRes.success ? itemsRes.data : [];
    const taxConfig = taxRes.success ? taxRes.data : { defaultTax: null, taxRates: [] };
    const uoms = (uomsRes as any).success ? (uomsRes as any).data : [];
    const currency = companySettings?.currencies?.symbol || '₹';

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
            <RegistrationVoucher
                initialSettings={{
                    registrationFee,
                    registrationProductId,
                    registrationProductName,
                    registrationProductDescription
                }}
                masterData={{
                    patients,
                    billableItems,
                    taxConfig,
                    uoms,
                    currency
                }}
            />
        </div>
    )
}
