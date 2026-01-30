const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

async function run() {
    try {
        await client.connect();
        await client.query(`UPDATE menu_items SET label = 'Deals Pipeline', url = '/crm/deals' WHERE key = 'crm-deals'`);
        await client.query(`DELETE FROM menu_items WHERE key = 'crm-pipeline'`);
        console.log('✅ Seeakk DB Menu Consolidated.');
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
run();
