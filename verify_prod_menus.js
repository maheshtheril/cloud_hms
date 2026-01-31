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
        const menus = await client.query("SELECT key, label, url FROM menu_items WHERE label ILIKE '%pipeline%' OR label ILIKE '%deals%'");
        console.log('--- PRODUCTION MENUS ---');
        menus.rows.forEach(m => console.log(`${m.key}: ${m.label} -> ${m.url}`));
    } catch (e) { console.error(e); } finally { await client.end(); }
}
find();
