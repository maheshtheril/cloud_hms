import { prisma } from '../src/lib/prisma'

async function main() {
    console.log('📦 Checking Modules Table...');
    const modules = await prisma.modules.findMany();
    console.log(`Found ${modules.length} modules:`);
    modules.forEach(m => console.log(` - [${m.module_key}] ${m.name} (ID: ${m.id})`));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
