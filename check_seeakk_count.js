const { Client } = require('pg');
const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectionUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' }
});
async function check() {
    try {
        await client.connect();
        const res = await client.query('SELECT count(*) FROM menu_items');
        console.log('Menu Items Count on Seeakk:', res.rows[0].count);
    } catch (e) { console.error(e); } finally { await client.end(); }
}
check();
