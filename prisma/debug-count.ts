
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
    const companyId = '69fc389d-d713-4c2a-a86a-ca5b193abf17'; // From previous logs
    console.log(`🔍 Checking suppliers for Company: ${companyId}`);

    const count = await prisma.hms_supplier.count({
        where: { company_id: companyId }
    });
    console.log(`✅ Total Suppliers for this company: ${count}`);

    if (count > 0) {
        const suppliers = await prisma.hms_supplier.findMany({
            where: { company_id: companyId },
            select: { id: true, name: true }
        });
        console.log(suppliers);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
