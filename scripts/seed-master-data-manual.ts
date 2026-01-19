
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Master Data (Manual Run)...')

    // 1. Currencies
    const currencies = [
        { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
        { code: 'USD', name: 'US Dollar', symbol: '$' },
        { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'GBP', name: 'British Pound', symbol: '£' },
    ]

    console.log('Seeding Currencies...')
    for (const c of currencies) {
        try {
            await prisma.currencies.upsert({
                where: { code: c.code },
                update: {},
                create: {
                    code: c.code,
                    name: c.name,
                    symbol: c.symbol,
                    is_active: true
                }
            })
            process.stdout.write('.')
        } catch (e) {
            console.error(`\nError seeding currency ${c.code}:`, e)
        }
    }
    console.log('\nCurrencies done.')

    // 2. Countries
    const countries = [
        { iso2: 'IN', iso3: 'IND', name: 'India', flag: '🇮🇳', region: 'Asia' },
        { iso2: 'US', iso3: 'USA', name: 'United States', flag: '🇺🇸', region: 'Americas' },
        { iso2: 'AE', iso3: 'ARE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Asia' },
        { iso2: 'GB', iso3: 'GBR', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
    ]

    console.log('Seeding Countries...')
    for (const c of countries) {
        try {
            await prisma.countries.upsert({
                where: { iso2: c.iso2 },
                update: {},
                create: {
                    iso2: c.iso2,
                    iso3: c.iso3,
                    name: c.name,
                    flag: c.flag,
                    region: c.region,
                    is_active: true
                }
            })
            process.stdout.write('.')
        } catch (e) {
            console.error(`\nError seeding country ${c.iso2}:`, e)
        }
    }
    console.log('\nCountries done.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
