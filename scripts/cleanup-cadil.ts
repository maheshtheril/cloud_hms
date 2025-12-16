
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
    console.log('Starting duplicate product cleanup (Dry Run)...')

    // 1. Find potential duplicates (CADIL/CADII pattern from user request)
    const products = await prisma.hms_product.findMany({
        where: {
            name: {
                contains: 'SYMBIOTIK', // Broad match for the specific case
                mode: 'insensitive'
            }
        },
        include: {
            hms_product_stock_ledger: true
        }
    })

    console.log(`Found ${products.length} potential matches for 'SYMBIOTIK'.`)

    const activeIds: string[] = []
    const garbageIds: string[] = []

    for (const p of products) {
        // Calculate current stock or check if used
        const hasStock = p.hms_product_stock_ledger.some(l => l.qty > 0);
        // We could also check `hms_stock_levels` if existed, but ledger is source of truth for "used".

        console.log(`[${p.sku}] ${p.name} | Price: ${p.price} | Used/Stocked: ${hasStock}`)

        if (hasStock) {
            activeIds.push(p.id)
            console.log('  -> KEEP (Has History)')
        } else {
            // Check matches patterns of "bad" names? 
            // User said "CADIL SYMBIOITIK" (typo) vs "CADIL SYMBIOTIK".
            // Actually, if it has NO history and is a duplicate candidate, we can delete.
            garbageIds.push(p.id)
            console.log('  -> DELETE CANDIDATE (No History)')
        }
    }

    if (garbageIds.length > 0) {
        console.log(`\nDeleting ${garbageIds.length} garbage entries...`)
        // Uncomment to execute
        await prisma.hms_product.deleteMany({
            where: { id: { in: garbageIds } }
        })
        console.log('✅ Deleted.')
    } else {
        console.log('No garbage found to delete.')
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
