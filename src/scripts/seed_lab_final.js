
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting Bulletproof Seeder...');

    // 1. Fetch Companies
    const companies = await prisma.company_profiles.findMany({
        where: { is_active: true }
    });

    if (companies.length === 0) {
        console.error('CRITICAL: No active companies found!');
        return;
    }

    console.log(`Found ${companies.length} active companies.`);

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

    for (const company of companies) {
        console.log(`\nSeeding for Company: ${company.company_name} (ID: ${company.company_id})`);

        for (const test of labTests) {
            // Check existence
            const existing = await prisma.hms_product.findFirst({
                where: {
                    company_id: company.company_id,
                    sku: test.sku
                }
            });

            if (existing) {
                console.log(`  - Skipping ${test.sku}: Already exists.`);
                continue;
            }

            try {
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
                        // IMP: Ensure metadata is valid JSON
                        metadata: {
                            type: 'lab_test',
                            tax_exempt: true
                        }
                    }
                });
                console.log(`  + Created: ${test.name}`);
            } catch (err) {
                console.error(`  ! Failed to create ${test.sku}:`, err.message);
            }
        }
    }

    console.log('\nSeeding Complete.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
