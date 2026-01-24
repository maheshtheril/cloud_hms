import { prisma } from "../lib/prisma";

async function migrate() {
    console.log("🚀 Starting Multi-Branch Migration...");

    const companies = await prisma.company.findMany();
    console.log(`Found ${companies.length} companies to migrate.`);

    for (const company of companies) {
        console.log(`Processing Company: ${company.name}`);

        // 1. Create a Default Branch for this company
        const branch = await prisma.hms_branch.upsert({
            where: { id: crypto.randomUUID() }, // Simple hack for script, use distinct logic if needed
            create: {
                tenant_id: company.tenant_id,
                company_id: company.id,
                name: "Main Branch",
                code: "MAIN",
                is_active: true,
                type: "hospital"
            },
            update: {}
        });

        console.log(`  - Created branch: ${branch.name} (${branch.id})`);

        // 2. Link all users to this branch
        const users = await prisma.app_user.findMany({
            where: { company_id: company.id }
        });

        for (const user of users) {
            await prisma.user_branch.upsert({
                where: {
                    user_id_branch_id: {
                        user_id: user.id,
                        branch_id: branch.id
                    }
                },
                create: {
                    user_id: user.id,
                    branch_id: branch.id,
                    is_default: true
                },
                update: {}
            });

            // Set as current branch for the user
            await prisma.app_user.update({
                where: { id: user.id },
                data: { current_branch_id: branch.id }
            });
        }
        console.log(`  - Migrated ${users.length} users.`);

        // 3. Link existing data to this branch
        const modelsToUpdate = [
            'hms_appointments', 'hms_patient', 'global_stock_location',
            'hms_invoice', 'crm_leads', 'hms_encounter', 'hms_admission',
            'hms_ward', 'journals', 'doctor_note', 'business_partners',
            'crm_contacts', 'crm_accounts', 'crm_deals', 'prescription', 'hms_bed'
        ];

        for (const model of modelsToUpdate) {
            // @ts-ignore - Prisma dynamic access
            const count = await prisma[model].updateMany({
                where: {
                    company_id: company.id,
                    branch_id: null
                },
                data: { branch_id: branch.id }
            });
            console.log(`  - Linked ${count.count} records in ${model}`);
        }
    }

    console.log("✅ Migration Complete!");
}

migrate()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
