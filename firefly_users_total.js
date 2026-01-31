const { Client } = require('pg');

const client = new Client({
    host: '13.228.46.236',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: { rejectUnauthorized: false, servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech' }
});

async function check() {
    try {
        await client.connect();
        const res = await client.query("SELECT email FROM app_user ORDER BY email ASC");
        console.log('Total Users on Firefly:', res.rows.length);
        res.rows.forEach(u => console.log(`- ${u.email}`));
    } catch (e) { console.error(e); } finally { await client.end(); }
}
check();
