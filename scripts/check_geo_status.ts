import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const countryCount = await prisma.countries.count()
        const subdivisionCount = await prisma.country_subdivision.count()

        console.log(`\n--- DATABASE CHECK (${process.env.DATABASE_URL?.split('@')[1].split('/')[0]}) ---`)
        console.log(`Countries: ${countryCount}`)
        console.log(`Subdivisions: ${subdivisionCount}`)

        if (subdivisionCount > 0) {
            const types = await prisma.country_subdivision.groupBy({
                by: ['type'],
                _count: {
                    type: true,
                },
            })
            console.log('Subdivision Types:', types)
        }
    } catch (error) {
        console.error("Error connecting to DB:", error);
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
