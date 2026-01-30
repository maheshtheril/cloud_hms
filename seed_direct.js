const { Client } = require('pg');

const client = new Client({
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_LKIg3tRXfbp9',
    database: 'neondb',
    ssl: {
        rejectUnauthorized: false,
        servername: 'ep-flat-firefly-a19fhxoa-pooler.ap-southeast-1.aws.neon.tech'
    }
});

const countries = [
    { name: 'India', code: 'IN', currency: 'INR', symbol: '₹' },
    { name: 'United States', code: 'US', currency: 'USD', symbol: '$' },
    { name: 'United Kingdom', code: 'GB', currency: 'GBP', symbol: '£' },
    { name: 'Canada', code: 'CA', currency: 'CAD', symbol: '$' },
    { name: 'Australia', code: 'AU', currency: 'AUD', symbol: '$' },
    { name: 'United Arab Emirates', code: 'AE', currency: 'AED', symbol: 'dhs' },
    { name: 'Saudi Arabia', code: 'SA', currency: 'SAR', symbol: 'SR' },
];

const currencies = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'dhs' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR' },
];

async function seed() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Seed Currencies
        console.log('Seeding Currencies...');
        for (const curr of currencies) {
            await client.query(`
                INSERT INTO currencies (code, name, symbol)
                VALUES ($1, $2, $3)
                ON CONFLICT (code) DO NOTHING;
            `, [curr.code, curr.name, curr.symbol]);
        }
        console.log('✅ Currencies seeded.');

        // Seed Countries
        console.log('Seeding Countries...');
        for (const country of countries) {
            await client.query(`
                INSERT INTO countries (name, iso2, iso3, flag)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (iso2) DO NOTHING;
            `, [country.name, country.code, country.code + 'X', '🏳️']);
        }
        console.log('✅ Countries seeded.');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.end();
    }
}

seed();
