import { CreatePatientForm } from "@/components/hms/create-patient-form"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function NewPatientPage() {
    const session = await auth();

    // Get tenant's country from company settings
    let tenantCountry = 'IN'; // Default to India

    if (session?.user?.companyId) {
        const company = await prisma.company.findUnique({
            where: { id: session.user.companyId },
            select: { country: true }
        });

        if (company?.country) {
            tenantCountry = company.country;
        }
    }

    return <CreatePatientForm tenantCountry={tenantCountry} />
}
