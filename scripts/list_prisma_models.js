
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Prisma Models:");
    const models = Object.keys(prisma).filter(k => k[0] !== '_' && typeof prisma[k] === 'object');
    console.log(JSON.stringify(models, null, 2));

    if (prisma.crm_employee) {
        console.log("crm_employee is present in prisma client.");
    } else {
        console.log("crm_employee is MISSING in prisma client.");
    }
}

main();
