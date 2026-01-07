
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    console.log('Seeding Lab Test Products via API...')

    try {
        const companies = await prisma.company.findMany({
            where: { enabled: true }
        });

        const labTests = [
            { sku: 'LAB001', name: 'Complete Blood Count (CBC)', price: 450, description: 'Hemogram, TLC, DLC, Platelets' },
            { sku: 'LAB002', name: 'Lipid Profile', price: 900, description: 'Cholesterol, Triglycerides, HDL, LDL' },
            { sku: 'LAB003', name: 'Liver Function Test (LFT)', price: 850, description: 'Bilirubin, SGOT, SGPT, ALP' },
            { sku: 'LAB004', name: 'Kidney Function Test (KFT)', price: 950, description: 'Urea, Creatinine, Uric Acid' },
            { sku: 'LAB005', name: 'Thyroid Profile (T3, T4, TSH)', price: 1200, description: 'Thyroid Function Test' },
            { sku: 'LAB006', name: 'HbA1c (Glycosylated Hemoglobin)', price: 600, description: '3 Month Average Blood Sugar' },
            { sku: 'LAB007', name: 'Blood Sugar (Fasting)', price: 150, description: 'Glucose - Fasting' },
            { sku: 'LAB008', name: 'Blood Sugar (PP)', price: 150, description: 'Glucose - Post Prandial' },
            { sku: 'LAB009', name: 'Urine Routine & Microscopy', price: 200, description: 'Urine R/M' },
            { sku: 'LAB010', name: 'Vitamin D Total', price: 1800, description: '25-Hydroxy Vitamin D' },
        ];

        let createdCount = 0;

        for (const company of companies) {
            for (const test of labTests) {
                const exists = await prisma.hms_product.findFirst({
                    where: { company_id: company.company_id, sku: test.sku }
                });

                if (!exists) {
                    await prisma.hms_product.create({
                        data: {
                            tenant_id: company.tenant_id,
                            company_id: company.company_id,
                            sku: test.sku,
                            name: test.name,
                            description: test.description,
                            is_service: true,
                            is_stockable: false,
                            uom: 'TEST',
                            price: test.price,
                            currency: 'INR',
                            is_active: true,
                            metadata: { type: 'lab_test', tax_exempt: true }
                        }
                    });
                    createdCount++;
                }
            }
        }

        return NextResponse.json({ success: true, seeded: createdCount });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
