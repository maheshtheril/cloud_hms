import 'dotenv/config';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString, ssl: true });

async function main() {
    try {
        const client = await pool.connect();
        console.log('Connected to database successfully');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
        client.release();
    } catch (err) {
        console.error('Connection error', err);
    } finally {
        await pool.end();
    }
}

main();
