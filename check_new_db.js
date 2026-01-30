const { Client } = require('pg');

// User provided URL: postgresql://neondb_owner:npg_t3GQCEaDsY5M@ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

const client = new Client({
    host: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech.ip-address.not.known', // I cannot run this locally without IP
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectUnauthorized: false }
});

// Since I cannot run this locally due to DNS and I don't have the IP, 
// I will skip running this script and trust the user.
console.log('Use Vercel to check connectivity.');
