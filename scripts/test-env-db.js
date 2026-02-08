
const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
console.log('Testing connection string:', connectionString.replace(/:[^:@]+@/, ':****@'));

const client = new Client({ connectionString });

async function test() {
    try {
        await client.connect();
        console.log('Successfully connected to PostgreSQL!');
        const res = await client.query('SELECT current_user, current_database();');
        console.log('Result:', res.rows[0]);
    } catch (err) {
        console.error('Connection failed:', err.message);
    } finally {
        await client.end();
    }
}

test();
