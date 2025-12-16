import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config()

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log("Checking Menu Items...")
    try {
        const items = await prisma.menu_items.findMany({
            where: { label: 'Billing' }
        })

        if (items.length > 0) {
            console.log("Billing Menu Found:", items)
        } else {
            console.log("Billing Menu NOT Found in DB.")
        }

        const all = await prisma.menu_items.findMany({ select: { label: true, url: true } })
        console.log("All Items:", all)

    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
