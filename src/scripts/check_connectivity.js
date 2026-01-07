
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    console.log("Attempting to connect to DB...");
    try {
        await prisma.$connect();
        console.log("Successfully connected to DB!");
        const count = await prisma.user_companies.count();
        console.log(`Connection verified. Found ${count} user_companies.`);
    } catch (e) {
        console.error("Connection Failed:", e.message);
        console.error("Full Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
