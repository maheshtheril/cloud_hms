const { Client } = require('pg');

const client = new Client({
    host: '13.228.46.236',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

async function updateDeals() {
    try {
        await client.connect();
        await client.query("UPDATE menu_items SET label = 'Deals Pipeline', url = '/crm/deals?v=firefly_final' WHERE key = 'crm-deals'");
        console.log('✅ Updated crm-deals on firefly.');
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
updateDeals();
