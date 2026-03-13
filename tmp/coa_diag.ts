
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function diagnostic() {
    console.log("--- COA HIERARCHY DIAGNOSTIC ---")
    const accounts = await prisma.accounts.findMany({
        orderBy: { code: 'asc' },
        include: { parent: true }
    })

    accounts.forEach(a => {
        const parentName = a.parent ? a.parent.name : 'ROOT'
        console.log(`[${a.code}] ${a.name.padEnd(30)} | Parent: ${parentName.padEnd(20)} | Type: ${a.type}`)
    })
}

diagnostic().catch(console.error).finally(() => prisma.$disconnect())
