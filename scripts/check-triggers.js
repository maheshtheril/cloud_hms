
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    console.log("--- Checking Database Triggers and Functions (JS) ---");

    try {
        const triggers = await prisma.$queryRawUnsafe(`
            SELECT 
                event_object_table as table_name,
                trigger_name,
                event_manipulation as event
            FROM information_schema.triggers
            WHERE trigger_schema = 'public'
            ORDER BY table_name, trigger_name;
        `);
        console.log("Triggers found:", JSON.stringify(triggers, null, 2));

        const functions = await prisma.$queryRawUnsafe(`
            SELECT 
                routine_name
            FROM information_schema.routines
            WHERE routine_schema = 'public'
            ORDER BY routine_name;
        `);
        console.log("Functions found:", JSON.stringify(functions.map(f => f.routine_name), null, 2));

    } catch (err) {
        console.error("Query failed:", err);
    } finally {
        await prisma.$disconnect();
    }
}

run();
