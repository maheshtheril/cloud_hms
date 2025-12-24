
import { CreatePatientForm } from "@/components/hms/create-patient-form"
import { getHMSSettings } from "@/app/actions/settings"

export const dynamic = 'force-dynamic'

export default async function NewPatientPage() {
    // Default to India - can be made dynamic later with company settings
    const tenantCountry = 'IN';

    // Fetch dynamic registration fee
    const hmsSettings = await getHMSSettings();
    const { registrationFee, registrationProductId, registrationProductName, registrationProductDescription } = hmsSettings.success ? hmsSettings.settings : { registrationFee: 500, registrationProductId: null, registrationProductName: 'Patient Registration Fee', registrationProductDescription: 'Standard Service' };

    return <CreatePatientForm
        tenantCountry={tenantCountry}
        registrationFee={registrationFee}
        registrationProductId={registrationProductId}
        registrationProductName={registrationProductName}
        registrationProductDescription={registrationProductDescription}
    />
}
