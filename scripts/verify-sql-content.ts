
import fs from 'fs';
import path from 'path';

const sqlPath = path.join(process.cwd(), 'prisma', 'seed_global.sql');

try {
    const content = fs.readFileSync(sqlPath, 'utf-8');
    const lines = content.split('\n');
    const insertCount = lines.filter(l => l.includes('INSERT INTO "country_subdivision"')).length;

    // Check for specific "problematic" states to ensure they are present
    const hasStPaulsBay = content.includes("St. Paul\\'s Bay") || content.includes("St. Paul''s Bay");
    const hasNewYork = content.includes("'New York'");
    const hasKerala = content.includes("'Kerala'");

    console.log('--- Verification Report ---');
    console.log(`Total Lines: ${lines.length}`);
    console.log(`Total State/District Inserts: ${insertCount}`);
    console.log(`Has 'St. Paul's Bay': ${hasStPaulsBay}`);
    console.log(`Has 'New York': ${hasNewYork}`);
    console.log(`Has 'Kerala': ${hasKerala}`);
    console.log('---------------------------');

} catch (error) {
    console.error('File read error:', error);
}
