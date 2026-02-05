
import { prisma } from "../src/lib/prisma";

async function run() {
    console.log("--- Checking Database Triggers and Functions ---");

    try {
        const triggers = await prisma.$queryRaw`
            SELECT 
                event_object_table as table_name,
                trigger_name,
                event_manipulation as event,
                action_statement as definition
            FROM information_schema.triggers
            WHERE trigger_schema = 'public'
            ORDER BY table_name, trigger_name;
        `;
        console.log("Triggers found:", JSON.stringify(triggers, null, 2));

        const functions = await prisma.$queryRaw`
            SELECT 
                routine_name,
                routine_definition
            FROM information_schema.routines
            WHERE routine_schema = 'public'
            ORDER BY routine_name;
        `;
        console.log("Functions found:", JSON.stringify(functions.map(f => (f as any).routine_name), null, 2));

    } catch (err: any) {
        console.error("Query failed:", err);
    }
}

run().then(() => process.exit());
