
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
    console.log('🔍 Inspecting Suppliers...');

    // Get latest user to compare company ID
    const user = await prisma.app_user.findFirst({
        orderBy: { created_at: 'desc' }
    });

    if (!user) {
        console.log('❌ No users found.');
        return;
    }

    console.log(`👤 Current User: ${user.email} (Company: ${user.company_id})`);

    // Fetch all suppliers
    const suppliers = await prisma.hms_supplier.findMany();

    console.log(`📋 Total Suppliers Found: ${suppliers.length}`);

    suppliers.forEach(s => {
        const match = s.company_id === user.company_id ? '✅ MATCH' : '❌ MISMATCH';
        console.log(`   - [${s.id}] ${s.name} (Company: ${s.company_id}) ${match}`);
        console.log(`     Active: ${s.is_active}`);
    });

    if (suppliers.length === 0) {
        console.log('⚠️  No suppliers found in database. User needs to create one.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
