
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
    host: '13.228.184.177',
    port: 5432,
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: {
        rejectUnauthorized: false,
        servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech'
    }
});

async function main() {
    await client.connect();
    const sql = fs.readFileSync(path.join(__dirname, 'signup_infra.sql'), 'utf8');
    await client.query(sql);
    console.log('Signup infrastructure applied.');
    await client.end();
}

main().catch(console.error);
