import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        console.log("Debugging Patient Creation...");

        // 1. Check Tenant
        const tenant = await prisma.tenant.findFirst();
        if (!tenant) throw new Error("No Tenant Found");

        // 2. Create Dummy Patient
        const patient = await prisma.hms_patient.create({
            data: {
                id: crypto.randomUUID(),
                tenant_id: tenant.id,
                company_id: tenant.id, // Assuming company = tenant for test
                first_name: "DEBUG",
                last_name: "TEST_PATIENT_" + Date.now(),
                gender: "other",
                contact: { phone: "0000000000" },
                patient_number: "DBG-" + Date.now(),
                metadata: { debug: true }
            }
        });

        return NextResponse.json({ success: true, message: "Patient Created Successfully", patientId: patient.id });
    } catch (error: any) {
        console.error("Debug Creation Failed", error);
        return NextResponse.json({ success: false, error: error.message, stack: error.stack });
    }
}
