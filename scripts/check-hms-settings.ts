import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
    console.log("--- HMS SETTINGS CHECK ---");
    const settings = await prisma.hms_settings.findMany({
        where: { key: 'registration_config' }
    });
    console.log(`Found ${settings.length} config records.`);
    settings.forEach(s => {
        console.log(`- ID: ${s.id} | Tenant: ${s.tenant_id} | Company: ${s.company_id} | Value: ${JSON.stringify(s.value)}`);
    });

    const fees = await prisma.hms_patient_registration_fees.findMany({
        where: { is_active: true }
    });
    console.log(`\nFound ${fees.length} active fee records.`);
    fees.forEach(f => {
        console.log(`- Tenant: ${f.tenant_id} | Company: ${f.company_id} | Amount: ${f.fee_amount} | Validity: ${f.validity_days}`);
    });

    await prisma.$disconnect();
}

check().catch(e => {
    console.error(e);
    process.exit(1);
});
