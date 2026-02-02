import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const countryCount = await prisma.countries.count()
        const subdivisionCount = await prisma.country_subdivision.count()

        console.log(`\n\n✅ FINAL STATUS CHECK of ${process.env.DATABASE_URL?.split('@')[1].split('/')[0]} ---`)
        console.log(`Countries: ${countryCount} (Should be ~250)`)
        console.log(`Subdivisions: ${subdivisionCount} (Should be ~5000+)`)
        console.log("------------------------------------------")

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
