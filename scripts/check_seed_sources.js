
const { Client } = require('pg');
require('dotenv').config();

async function main() {
    console.log("Checking CRM Sources...");

    const urls = [
        process.env.DATABASE_URL,
        process.env.DIRECT_DATABASE_URL,
        process.env.DATABASE_URL?.replace('-pooler', ''),
    ].filter(u => u);

    let client;
    for (const url of urls) {
        try {
            const tempClient = new Client({ connectionString: url });
            await tempClient.connect();
            client = tempClient;
            break;
        } catch (e) {
            // ignore
        }
    }

    if (!client) {
        console.error("Could not connect to database.");
        return;
    }

    try {
        const res = await client.query(`SELECT * FROM crm_sources`);
        console.log("Sources found:", res.rowCount);
        console.log(JSON.stringify(res.rows, null, 2));

        const existingNames = res.rows.map(r => r.name);
        console.log("Existing sources:", existingNames);

        const defaultSources = ['Website', 'Referral', 'Social Media', 'Cold Call', 'Trade Show', 'Other'];
        const missingSources = defaultSources.filter(s => !existingNames.includes(s));

        if (missingSources.length > 0) {
            console.log("Seeding missing sources:", missingSources);

            const userRes = await client.query('SELECT tenant_id FROM app_user LIMIT 1');
            if (userRes.rows.length > 0) {
                const tenantId = userRes.rows[0].tenant_id;
                for (const source of missingSources) {
                    await client.query(`
                        INSERT INTO crm_sources (id, tenant_id, name) 
                        VALUES (gen_random_uuid(), $1, $2)
                    `, [tenantId, source]);
                }
                console.log("Seeded missing sources.");
            } else {
                console.log("No tenant found to seed sources for.");
            }
        } else {
            console.log("All default sources already exist.");
        }

    } catch (e) {
        console.error("Query failed:", e);
    } finally {
        await client.end();
    }
}

main();
