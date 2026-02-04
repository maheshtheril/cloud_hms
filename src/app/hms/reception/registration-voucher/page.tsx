
import { RegistrationVoucher } from "@/components/hms/billing/registration-voucher"
import { getHMSSettings } from "@/app/actions/settings"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function RegistrationVoucherPage() {
    // 1. Fetch Clinical & Financial Settings
    const hmsSettings = await getHMSSettings();

    if (hmsSettings.error) {
        // Log error but show default props to prevent white-screen crash
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

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
            <RegistrationVoucher
                initialSettings={{
                    registrationFee,
                    registrationProductId,
                    registrationProductName,
                    registrationProductDescription
                }}
            />
        </div>
    )
}
