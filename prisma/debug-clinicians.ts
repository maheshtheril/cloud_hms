
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const prisma = new PrismaClient()

async function main() {
    console.log('Fetching table structure for hms_clinicians...')

    const columns = await prisma.$queryRaw`
    SELECT column_name, is_nullable, data_type, udt_name, column_default
    FROM information_schema.columns 
    WHERE table_name = 'hms_clinicians'
    ORDER BY column_name;
  `

    console.log(JSON.stringify(columns, null, 2))
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
