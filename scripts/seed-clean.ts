
import { PrismaClient } from '@prisma/client'
import { countriesList } from '../prisma/data/countries'
import { currenciesList } from '../prisma/data/currencies'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
    console.log(`Starting clean seed with ${countriesList.length} countries and ${currenciesList.length} currencies...`)

    console.log('Seeding currencies...')
    for (const cur of currenciesList) {
        try {
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
        } catch (e) {
            console.error(`Failed to seed currency ${cur.code}:`, e.message)
        }
    }

    console.log('Seeding countries...')
    for (const country of countriesList) {
        try {
            await prisma.countries.upsert({
                where: { iso2: country.iso2 },
                update: {},
                create: {
                    iso2: country.iso2,
                    iso3: country.iso3,
                    name: country.name,
                    flag: country.flag,
                    region: country.region,
                    is_active: true
                }
            })
        } catch (e) {
            console.error(`Failed to seed country ${country.iso2}:`, e.message)
        }
    }

    console.log('Seeding complete.')
}

main()
    .catch((e) => {
        console.error('Fatal error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
