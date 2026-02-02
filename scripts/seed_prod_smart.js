const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const countriesSqlPath = path.join(process.cwd(), 'global_geography.sql');
const statesSqlPath = path.join(process.cwd(), 'global_states.sql');

// Regex
const countryRegex = /\([0-9]+,'([^']+)','([^']+)','([^']+)','([^']+)'/g;
const stateValueRegex = /\(\d+,'((?:[^'\\]|\\.|'')*)',\d+,'([A-Z]{2})'/g;

const dbConfig = {
    host: '13.228.184.177',
    user: 'neondb_owner',
    password: 'npg_t3GQCEaDsY5M',
    database: 'neondb',
    ssl: { rejectUnauthorized: false, servername: 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech' },
};

async function main() {
    const client = new Client(dbConfig);
    try {
        console.log("Connecting to Prod...");
        await client.connect();

        // 1. Load & Upsert Countries
        console.log("Processing Countries...");
        const countriesData = fs.readFileSync(countriesSqlPath, 'utf-8');
        let countryMatch;
        const isoToId = new Map();

        // Fetch existing first to minimize updates
        const existingRes = await client.query("SELECT iso2, id FROM countries");
        existingRes.rows.forEach(r => isoToId.set(r.iso2, r.id));
        console.log(`Found ${isoToId.size} existing countries.`);

        let cCount = 0;
        while ((countryMatch = countryRegex.exec(countriesData)) !== null) {
            const [_, name, iso3, numCode, iso2] = countryMatch;
            const safeName = name.replace(/'/g, "''"); // For SQL if needed, but we use params

            // Upsert Logic
            // We use params $1, $2 etc. to avoid quoting issues
            // ON CONFLICT (iso2) DO UPDATE
            const res = await client.query(`
                INSERT INTO countries (iso2, iso3, name, region, is_active, flag)
                VALUES ($1, $2, $3, 'World', true, '🏳️')
                ON CONFLICT (iso2) DO UPDATE SET
                    flag = EXCLUDED.flag,
                    is_active = EXCLUDED.is_active,
                    region = EXCLUDED.region
                RETURNING id;
            `, [iso2, iso3, name]);

            isoToId.set(iso2, res.rows[0].id);
            cCount++;
        }
        console.log(`Upserted ${cCount} countries.`);

        // 2. Load & Insert States
        console.log("Processing States...");
        const statesData = fs.readFileSync(statesSqlPath, 'utf-8');
        let stateMatch;
        let sCount = 0;
        let sSkipped = 0;

        // Prepare existing states check? 
        // 5000 states, checking one by one is slow but safe. 
        // Or fetch all states? 5000 is small.
        const stateSet = new Set();
        const sRes = await client.query("SELECT country_id, name FROM country_subdivision WHERE type='state'");
        sRes.rows.forEach(r => stateSet.add(`${r.country_id}:${r.name}`));

        while ((stateMatch = stateValueRegex.exec(statesData)) !== null) {
            const [_, nameRaw, iso2] = stateMatch;

            // Clean name
            let name = nameRaw.replace(/\\'/g, "'"); // Unescape MySQL
            const countryId = isoToId.get(iso2);

            if (!countryId) {
                console.warn(`Skipping state ${name} for missing country ${iso2}`);
                continue;
            }

            const key = `${countryId}:${name}`;
            if (stateSet.has(key)) {
                sSkipped++;
                continue; // Already exists
            }

            // Insert
            await client.query(`
                INSERT INTO country_subdivision (country_id, name, type, is_active)
                VALUES ($1, $2, 'state', true)
            `, [countryId, name]);

            stateSet.add(key); // Add to local set
            sCount++;

            if (sCount % 500 === 0) console.log(`Inserted ${sCount} states...`);
        }

        console.log(`Finished! Inserted ${sCount} NEW states. Skipped ${sSkipped}.`);

    } catch (e) {
        console.error("SMART SEED FAILED:", e);
    }
    finally { client.end(); }
}
main();
