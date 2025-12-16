import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString, ssl: true })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    try {
        console.log('--- Debugging Tax Data ---');

        // 1. Check company tax maps
        const maps = await prisma.company_tax_maps.findMany({
            take: 5,
            include: {
                tax_rates: true,
                tax_types: true
            }
        });

        // 2. Check company settings
        const settings = await prisma.company_settings.findMany({
            take: 5,
            include: {
                tax_rates: true
            }
        });

        // 3. Check tax rates
        const rates = await prisma.tax_rates.findMany({ take: 5 });

        const result = {
            maps,
            settings: settings.map(s => ({
                company_id: s.company_id,
                default_rate_name: s.tax_rates?.name,
                default_rate_id: s.default_tax_rate_id
            })),
            rates
        };

        fs.writeFileSync('debug_output.json', JSON.stringify(result, null, 2));
        console.log('Written to debug_output.json');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
