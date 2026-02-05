
import { prisma } from "../src/lib/prisma";
import { createInvoice } from "../src/app/actions/billing";

async function run() {
    console.log("--- Starting Billing Debug ---");

    // Attempt to find a valid tenant/company
    const company = await prisma.company.findFirst({ where: { enabled: true } });
    if (!company) {
        console.error("No active company found in DB.");
        return;
    }

    const patient = await prisma.hms_patient.findFirst({ where: { tenant_id: company.tenant_id } });

    const mockData = {
        patient_id: patient?.id || "00000000-0000-0000-0000-000000000000",
        date: new Date().toISOString(),
        line_items: [
            {
                description: "Debug Service",
                quantity: 1,
                unit_price: 100,
                discount_amount: 0,
                tax_amount: 0,
                product_id: null,
                tax_rate_id: null,
                uom: "Unit"
            }
        ],
        payments: [],
        status: 'draft',
        total_discount: 0,
        billing_metadata: { debug: true }
    };

    console.log("Mock Payload:", JSON.stringify(mockData, null, 2));

    try {
        // We need a session, but since we are running via script, createInvoice might fail at auth()
        // Let's mock the session if possible or just test the internal logic.
        // Actually, I can't easily mock 'next-auth' in a script.

        console.log("Note: This script might fail due to 'auth()' check, but we are checking for syntax/schema errors.");

        const res = await createInvoice(mockData as any);
        console.log("Result:", JSON.stringify(res, null, 2));
    } catch (err: any) {
        console.error("CRASH:", err);
    }
}

run().then(() => process.exit());
