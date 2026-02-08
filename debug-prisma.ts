
import { prisma } from './src/lib/prisma'

async function main() {
    console.log('Keys of prisma:', Object.keys(prisma))
    console.log('prisma.tenant:', !!(prisma as any).tenant)
    if ((prisma as any).tenant) {
        console.log('prisma.tenant keys:', Object.keys((prisma as any).tenant))
    }
}

main().catch(console.error)
