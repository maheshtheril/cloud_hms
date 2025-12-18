import { CreatePatientForm } from "@/components/hms/create-patient-form"

export default async function NewPatientPage() {
    // Default to India - can be made dynamic later with company settings
    const tenantCountry = 'IN';

    return <CreatePatientForm tenantCountry={tenantCountry} />
}
