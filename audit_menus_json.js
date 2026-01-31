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
        console.log('PIPELINE_DEALS_START');
        console.log(JSON.stringify(menus.rows));
        console.log('PIPELINE_DEALS_END');

        const crm = await client.query("SELECT key, label, url FROM menu_items WHERE module_key = 'crm'");
        console.log('CRM_MENUS_START');
        console.log(JSON.stringify(crm.rows));
        console.log('CRM_MENUS_END');

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
find();
