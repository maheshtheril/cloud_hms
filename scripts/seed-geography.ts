import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding geography data...')

    const india = await prisma.countries.upsert({
        where: { iso2: 'IN' },
        update: {},
        create: {
            iso2: 'IN',
            iso3: 'IND',
            name: 'India',
            flag: '🇮🇳',
        }
    })

    let karnataka = await prisma.country_subdivision.findFirst({
        where: { name: 'Karnataka', country_id: india.id }
    })

    if (!karnataka) {
        karnataka = await prisma.country_subdivision.create({
            data: {
                country_id: india.id,
                name: 'Karnataka',
                type: 'state',
            }
        })
    }

    const kalaburgi = await prisma.country_subdivision.findFirst({
        where: { name: 'Kalaburgi', parent_id: karnataka.id }
    })

    if (!kalaburgi) {
        await prisma.country_subdivision.create({
            data: {
                country_id: india.id,
                parent_id: karnataka.id,
                name: 'Kalaburgi',
                type: 'district',
            }
        })
    }

    console.log('Geography data seeded successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
