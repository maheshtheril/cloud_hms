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
        const users = await client.query("SELECT email, tenant_id FROM app_user LIMIT 20");
        console.log('--- USERS IN PRODUCTION DB ---');
        users.rows.forEach(u => console.log(`${u.email} | ${u.tenant_id}`));
    } catch (e) { console.error(e); } finally { await client.end(); }
}
find();
