const { Client } = require('pg');

const client = new Client({
    host: '13.228.46.236',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

async function find() {
    try {
        await client.connect();
        const res = await client.query("SELECT name FROM tenant WHERE name ILIKE '%seeakk%' OR name ILIKE '%cloud%'");
        console.log('TENANTS:', JSON.stringify(res.rows));

        const modules = await client.query("SELECT * FROM modules WHERE is_active = true");
        console.log('ACTIVE_MODULES:', modules.rows.map(m => m.module_key).join(', '));

    } catch (e) { console.error(e); } finally { await client.end(); }
}
find();
