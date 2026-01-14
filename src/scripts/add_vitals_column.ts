import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Adding created_by column to hms_vitals...')
        await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='hms_vitals' AND column_name='created_by') THEN 
          ALTER TABLE hms_vitals ADD COLUMN created_by UUID; 
        END IF; 
      END $$;
    `)
        console.log('Column added successfully.')
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
