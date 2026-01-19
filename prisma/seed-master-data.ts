
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { countriesList } from './data/countries'
import { currenciesList } from './data/currencies'

async function main() {
    console.log('--- STRICT Seeding Master Data ---')

    // 1. Currencies (The Full List)
    console.log(`Seeding ${currenciesList.length} Currencies...`)

    for (const cur of currenciesList) {
        await prisma.currencies.upsert({
            where: { code: cur.code },
            update: {},
            create: {
                code: cur.code,
                name: cur.name,
                symbol: cur.symbol,
                is_active: true
            }
        })
    }
    console.log('Currencies Seeded.')

    // 2. Countries (The Full List)
    console.log(`Seeding ${countriesList.length} Countries...`)

    // Batch Insert for Speed if possible, or simple loop with upsert for safety
    // Using simple loop for upsert robustness against partial failures
    let count = 0;
    for (const c of countriesList) {
        await prisma.countries.upsert({
            where: { iso2: c.iso2 },
            update: {}, // Do nothing if exists
            create: {
                iso2: c.iso2,
                iso3: c.iso3,
                name: c.name,
                flag: c.flag,
                region: c.region,
                is_active: true
            }
        });
        count++;
        if (count % 50 === 0) process.stdout.write('.')
    }
    console.log('\nAll Countries Seeded.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
