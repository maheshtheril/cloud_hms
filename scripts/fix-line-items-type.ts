
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking hms_invoice.line_items column type...')
    try {
        const result = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'hms_invoice' AND column_name = 'line_items';
    `)
        console.log('Current Column Info:', result)

        const colInfo = (result as any[])[0]
        if (colInfo && (colInfo.udt_name === '_jsonb' || colInfo.data_type === 'ARRAY')) {
            console.log('Column is ARRAY (jsonb[]). Fixing to jsonb...')

            await prisma.$executeRawUnsafe(`ALTER TABLE public.hms_invoice ALTER COLUMN line_items DROP DEFAULT;`)

            // Convert: Take the first element of the array. If null, use '[]'.
            await prisma.$executeRawUnsafe(`
            ALTER TABLE public.hms_invoice 
            ALTER COLUMN line_items 
            TYPE jsonb 
            USING COALESCE(line_items[1], '[]'::jsonb);
        `)

            await prisma.$executeRawUnsafe(`ALTER TABLE public.hms_invoice ALTER COLUMN line_items SET DEFAULT '[]'::jsonb;`)
            console.log('Fixed: Converted back to jsonb.')
        } else {
            console.log('Column appears correct or is not an array:', colInfo ? colInfo.udt_name : 'Not Found')
            // Even if correct, ensure default is not malformed if it's text
        }

    } catch (e) {
        console.error('Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
