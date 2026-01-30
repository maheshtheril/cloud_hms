const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

async function check() {
    try {
        await client.connect();

        const keys = ['finance', 'accounting', 'inventory', 'hms', 'crm'];
        for (const k of keys) {
            const res = await client.query(`SELECT count(*) FROM menu_items WHERE module_key = $1`, [k]);
            console.log(`Menus for ${k}: ${res.rows[0].count}`);
        }

    } catch (e) { console.error(e); }
    finally { await client.end(); }
}
check();
