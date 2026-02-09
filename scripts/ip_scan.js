
const { Client } = require('pg');
require('dotenv').config();

// Extract credentials from DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
const match = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@/);
const user = match[1];
const pass = match[2];
const ip = "52.220.170.93";
const dbname = "neondb";

async function main() {
    const connectionString = `postgresql://${user}:${pass}@${ip}:5432/${dbname}?sslmode=require`;
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('--- CONNECTED VIA IP ---');

        const res = await client.query(`
            SELECT table_name, column_name, udt_name, column_default 
            FROM information_schema.columns 
            WHERE table_schema = 'public'
            AND (udt_name LIKE '\\_%' OR column_default LIKE '%[]%')
            ORDER BY table_name, column_name
        `);

        console.log(JSON.stringify(res.rows, null, 2));

    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

main();
