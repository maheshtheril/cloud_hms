
import fs from 'fs';
import path from 'path';

// Paths
const countriesSqlPath = path.join(process.cwd(), 'global_geography.sql');
const statesSqlPath = path.join(process.cwd(), 'global_states.sql');
const outputSqlPath = path.join(process.cwd(), 'prisma', 'seed_global.sql');

// Regex to parse INSERT statements
// Countries: (id, name, iso3, numeric_code, iso2, ...)
// VALUES (1,'Afghanistan','AFG','004','AF',...)
const countryRegex = /\([0-9]+,'([^']+)','([^']+)','([^']+)','([^']+)'/g;

// States: (id, name, country_id, country_code, ...)
// VALUES (1,'Southern Nations, Nationalities, and Peoples',70,'ET',...)
// Note: handling potential escaped quotes in names is tricky with regex, but standard dumps usually escape with backslash or double quote.
// We'll try a robust regex for "VALUES (..., 'Name', ..., 'ISO2', ...)"
const stateRegex = /\([0-9]+,'([^']+)',[0-9]+,'([A-Z]{2})'/g;

function generateSeed() {
    let sqlContent = `-- Global Geography Seed
-- Includes All Countries and All States (~5000+ regions)
-- Districts included for: India (Comprehensive)

-- 1. Insert Countries
`;

    // Process Countries
    const countriesData = fs.readFileSync(countriesSqlPath, 'utf-8');
    let countryMatch;
    const countriesSet = new Set();

    while ((countryMatch = countryRegex.exec(countriesData)) !== null) {
        const [_, name, iso3, numCode, iso2] = countryMatch;
        // Escape single quotes in name for SQL
        const safeName = name.replace(/'/g, "''");

        // We only add if unique (just in case)
        if (!countriesSet.has(iso2)) {
            countriesSet.add(iso2);
            sqlContent += `
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('${iso2}', '${iso3}', '${safeName}', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;`;
        }
    }

    sqlContent += `\n\n-- 2. Insert States (Subdivisions)`;

    // Process States
    const statesData = fs.readFileSync(statesSqlPath, 'utf-8');
    let stateMatch;
    // We can't rely on strict regex for all lines if format varies, but the dump looks consistent.
    // The format is: (id, 'Name', country_id, 'ISO2', ...)

    // Using a split approach might be safer for large files to avoid regex stack overflow or missing matches
    const stateLines = statesData.split('\n');
    let count = 0;

    // We will parse the file more dumbly to be safe: search for pattern "VALUES (...);" or "(___, ...),"
    // Actually, looking at the file view:
    // INSERT INTO `states` VALUES (1,'Andaman and Nicobar Islands',101,'IN',...),(2,'Andhra Pradesh',101,'IN',...)

    // Let's just use a regex that captures "('Name', ..., 'ISO2')"
    // We need to be careful about the Country ID in the middle.
    // Pattern: `(id, 'Name', country_id, 'ISO2'`
    const stateValueRegex = /\(\d+,'((?:[^']|'')*)',\d+,'([A-Z]{2})'/g;

    while ((stateMatch = stateValueRegex.exec(statesData)) !== null) {
        const [_, name, iso2] = stateMatch;
        const safeName = name.replace(/'/g, "''");

        // Use CTE or subquery to insert safely
        sqlContent += `
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, '${safeName}', 'state', true FROM "countries" WHERE "iso2" = '${iso2}'
ON CONFLICT DO NOTHING;`;
        count++;
    }

    console.log(`Parsed ${countriesSet.size} countries and ${count} states.`);

    // 3. Add India Districts (Manual Append)
    const indiaDistricts = `
-- 3. India Districts (Comprehensive)
DO $$
DECLARE 
    country_uuid UUID;
    state_uuid UUID;
BEGIN
    SELECT id INTO country_uuid FROM countries WHERE iso2 = 'IN';
    
    -- ANDHRA PRADESH
    SELECT id INTO state_uuid FROM country_subdivision WHERE name = 'Andhra Pradesh' AND country_id = country_uuid;
    IF state_uuid IS NOT NULL THEN
        INSERT INTO country_subdivision (country_id, parent_id, name, type, is_active)
        SELECT country_uuid, state_uuid, d, 'district', true
        FROM unnest(ARRAY[
            'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Prakasam', 'Srikakulam', 'Sri Potti Sriramulu Nellore', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'
        ]) as d
        WHERE NOT EXISTS (SELECT 1 FROM country_subdivision WHERE name = d AND parent_id = state_uuid);
    END IF;

    -- KARNATAKA
    SELECT id INTO state_uuid FROM country_subdivision WHERE name = 'Karnataka' AND country_id = country_uuid;
    IF state_uuid IS NOT NULL THEN
        INSERT INTO country_subdivision (country_id, parent_id, name, type, is_active)
        SELECT country_uuid, state_uuid, d, 'district', true
        FROM unnest(ARRAY[
            'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davangere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburgi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'
        ]) as d
        WHERE NOT EXISTS (SELECT 1 FROM country_subdivision WHERE name = d AND parent_id = state_uuid);
    END IF;

    -- KERALA
    SELECT id INTO state_uuid FROM country_subdivision WHERE name = 'Kerala' AND country_id = country_uuid;
    IF state_uuid IS NOT NULL THEN
        INSERT INTO country_subdivision (country_id, parent_id, name, type, is_active)
        SELECT country_uuid, state_uuid, d, 'district', true
        FROM unnest(ARRAY[
            'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
        ]) as d
        WHERE NOT EXISTS (SELECT 1 FROM country_subdivision WHERE name = d AND parent_id = state_uuid);
    END IF;

    -- MAHARASHTRA
    SELECT id INTO state_uuid FROM country_subdivision WHERE name = 'Maharashtra' AND country_id = country_uuid;
    IF state_uuid IS NOT NULL THEN
        INSERT INTO country_subdivision (country_id, parent_id, name, type, is_active)
        SELECT country_uuid, state_uuid, d, 'district', true
        FROM unnest(ARRAY[
            'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
        ]) as d
        WHERE NOT EXISTS (SELECT 1 FROM country_subdivision WHERE name = d AND parent_id = state_uuid);
    END IF;

    -- TAMIL NADU
    SELECT id INTO state_uuid FROM country_subdivision WHERE name = 'Tamil Nadu' AND country_id = country_uuid;
    IF state_uuid IS NOT NULL THEN
        INSERT INTO country_subdivision (country_id, parent_id, name, type, is_active)
        SELECT country_uuid, state_uuid, d, 'district', true
        FROM unnest(ARRAY[
            'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
        ]) as d
        WHERE NOT EXISTS (SELECT 1 FROM country_subdivision WHERE name = d AND parent_id = state_uuid);
    END IF;

    -- TELANGANA
    SELECT id INTO state_uuid FROM country_subdivision WHERE name = 'Telangana' AND country_id = country_uuid;
    IF state_uuid IS NOT NULL THEN
        INSERT INTO country_subdivision (country_id, parent_id, name, type, is_active)
        SELECT country_uuid, state_uuid, d, 'district', true
        FROM unnest(ARRAY[
            'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Komaram Bheem', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Warangal Urban', 'Yadadri Bhuvanagiri'
        ]) as d
        WHERE NOT EXISTS (SELECT 1 FROM country_subdivision WHERE name = d AND parent_id = state_uuid);
    END IF;

    -- DELHI
    SELECT id INTO state_uuid FROM country_subdivision WHERE name = 'Delhi' AND country_id = country_uuid;
    IF state_uuid IS NOT NULL THEN
        INSERT INTO country_subdivision (country_id, parent_id, name, type, is_active)
        SELECT country_uuid, state_uuid, d, 'district', true
        FROM unnest(ARRAY[
            'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'
        ]) as d
        WHERE NOT EXISTS (SELECT 1 FROM country_subdivision WHERE name = d AND parent_id = state_uuid);
    END IF;

END $$;
`;

    sqlContent += indiaDistricts;

    fs.writeFileSync(outputSqlPath, sqlContent);
    console.log(`Generated SQL at ${outputSqlPath}`);
}

generateSeed();
