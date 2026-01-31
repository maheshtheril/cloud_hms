const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});

async function find() {
    try {
        await client.connect();
        const menus = await client.query("SELECT key, label, url FROM menu_items WHERE label ILIKE '%pipeline%' OR label ILIKE '%deals%'");
        console.log('--- ALL PIPELINE/DEALS MENUS ---');
        menus.rows.forEach(m => console.log(`${m.key}: ${m.label} -> ${m.url}`));

        console.log('\n--- ALL CRM MENUS ---');
        const crm = await client.query("SELECT key, label, url FROM menu_items WHERE module_key = 'crm'");
        crm.rows.forEach(m => console.log(`${m.key}: ${m.label} -> ${m.url}`));

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
find();
