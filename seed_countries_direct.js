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

async function seedCountries() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Check if table exists
        const tableCheck = await client.query(`
            SELECT to_regclass('public.countries');
        `);

        if (!tableCheck.rows[0].to_regclass) {
            console.log('Creating countries table...');
            await client.query(`
                CREATE TABLE IF NOT EXISTS countries (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    iso2 CHAR(2) UNIQUE NOT NULL,
                    iso3 CHAR(3) UNIQUE NOT NULL,
                    name VARCHAR(150) NOT NULL,
                    flag CHAR(4),
                    is_active BOOLEAN DEFAULT true,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            `);
        }

        console.log('Seeding countries...');
        // Only seed if empty to avoid duplicates/errors
        const count = await client.query('SELECT COUNT(*) FROM countries');
        if (parseInt(count.rows[0].count) === 0) {
            for (const country of countries) {
                await client.query(`
                    INSERT INTO countries (name, iso2, iso3, flag)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (iso2) DO NOTHING;
                `, [country.name, country.code, country.code + 'X', '🏳️']); // Simple fallback for now
            }
            console.log('✅ Countries seeded successfully!');
        } else {
            console.log('Countries already exist, skipping seed.');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.end();
    }
}

seedCountries();
