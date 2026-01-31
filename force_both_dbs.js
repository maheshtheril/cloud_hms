const { Client } = require('pg');

const db1 = {
    host: '13.228.46.236',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
};

const db2 = {
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
};

async function force() {
    for (const config of [db1, db2]) {
        const client = new Client(config);
        try {
            await client.connect();
            console.log(`Connected to ${config.ssl.servername}`);
            // Force unique URL to break cache
            await client.query("UPDATE menu_items SET url = '/crm/deals?v=final2215' WHERE key = 'crm-deals'");
            await client.query("DELETE FROM menu_items WHERE key = 'crm-pipeline'");
            console.log('✅ Forced update complete.');
        } catch (e) {
            console.error(`Error on ${config.ssl.servername}:`, e.message);
        } finally {
            await client.end();
        }
    }
}
force();
