import { PrismaClient } from '@prisma/client';

async function checkPrisma() {
    const prisma = new PrismaClient();
    try {
        console.log("Checking hms_patient fields...");
        // @ts-ignore
        const fields = (prisma as any)._runtimeDataModel.models.hms_patient.fields;
        console.log("Found fields:", fields.map((f: any) => f.name).join(", "));

        const hasAccountingGroup = fields.some((f: any) => f.name === 'accounting_group');
        console.log("Has 'accounting_group'?:", hasAccountingGroup);
    } catch (e: any) {
        console.error("Error checking prisma:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkPrisma();
