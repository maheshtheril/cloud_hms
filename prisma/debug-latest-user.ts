import { prisma } from '../src/lib/prisma'

async function main() {
    console.log('🔍 Inspecting Latest User...');

    // Get latest user by creation time (using ID as proxy if needed, but assuming created_at works)
    const user = await prisma.app_user.findFirst({
        orderBy: { created_at: 'desc' },
        include: {
            hms_user_roles: true
        }
    });

    if (!user) {
        console.log('❌ No users found.');
        return;
    }

    console.log(`👤 User: ${user.email} (ID: ${user.id})`);
    console.log(`   Tenant: ${user.tenant_id}`);
    console.log(`   Created At: ${user.created_at}`);

    // Check Company
    const company = await prisma.company.findFirst({
        where: { id: user.company_id || undefined }
    });
    console.log(`🏢 Company: ${company?.name}`);
    console.log(`   Industry: '${company?.industry}' (Raw: ${JSON.stringify(company?.industry)})`);

    // Check Modules
    const modules = await prisma.tenant_module.findMany({
        where: { tenant_id: user.tenant_id }
    });
    console.log(`📦 Modules Found: ${modules.length}`);
    modules.forEach(m => {
        console.log(`   - Key: '${m.module_key}', Enabled: ${m.enabled}`);
    });

    // Logic Simulation
    const isHealthcare = !company?.industry || company.industry === 'Healthcare' || company.industry === 'Hospital';
    const hasCRM = modules.some(m => m.module_key === 'crm' && m.enabled);
    const hasHMS = modules.some(m => m.module_key === 'hms' && m.enabled);

    console.log('\n🧮 Logic Verify:');
    console.log(`   isHealthcare (!industry || match): ${isHealthcare}`);
    console.log(`   hasCRM: ${hasCRM}`);
    console.log(`   hasHMS: ${hasHMS}`);

    if (hasCRM && !hasHMS) {
        console.log('   => SHOULD Redirect to /crm/dashboard');
    } else if (isHealthcare) {
        console.log('   => SHOULD Redirect to /hms/dashboard (Fallback)');
    } else {
        console.log('   => Unclear destination');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
