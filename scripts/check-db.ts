
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const countries = await prisma.countries.count()
        const states = await prisma.country_subdivision.count()
        console.log(`Connection Successful.`)
        console.log(`Current DB Counts -> Countries: ${countries}, Subdivisions: ${states}`)
    } catch (e) {
        console.error('Connection Failed:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
