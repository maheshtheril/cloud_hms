
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    console.log("Checking Lead Statuses...");

    const urls = [
        process.env.DATABASE_URL,
        process.env.DIRECT_DATABASE_URL,
        process.env.DATABASE_URL?.replace('-pooler', ''),
    ].filter(u => u);

    let client;
    for (const url of urls) {
        try {
            console.log(`Trying connection...`);
            const tempClient = new Client({ connectionString: url });
            await tempClient.connect();
            console.log("Connected to DB via PG!");
            client = tempClient;
            break;
        } catch (e) {
            console.error(`Failed to connect: ${e.message}`);
        }
    }

    if (!client) {
        console.error("Could not connect to database.");
        return;
    }

    try {
        const res = await client.query(`
            SELECT status, COUNT(*) as count 
            FROM crm_leads 
            GROUP BY status
        `);
        console.log("Lead Statuses:");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error("Query failed:", e);
    } finally {
        await client.end();
    }
}

main();
