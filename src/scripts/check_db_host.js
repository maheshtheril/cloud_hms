
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Load .env manually
let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    try {
        const envPath = path.resolve(__dirname, '../../.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2 && !line.trim().startsWith('#')) {
                    const key = parts[0].trim();
                    let val = parts.slice(1).join('=').trim();
                    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                        val = val.slice(1, -1);
                    }
                    if (key === 'DATABASE_URL') {
                        connectionString = val;
                    }
                }
            });
        }
    } catch (e) {
        console.error("Failed to load .env", e.message);
    }
}

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    try {
        await client.connect();
        const res = await client.query('SELECT inet_server_addr(), inet_server_port(), current_database();');
        console.log("Connected to:", res.rows[0]);
    } catch (err) {
        console.error("Connection failed:", err.message);
    } finally {
        await client.end();
    }
}

main();
