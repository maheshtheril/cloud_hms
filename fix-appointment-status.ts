
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log("Dropping existing constraint...")
        // Note: We need to find the exact constraint name. Usually it is generated.
        // However, if the error says "hms_appointments_status_check", that's the name.

        // We try to drop it.
        await prisma.$executeRawUnsafe(`ALTER TABLE hms_appointments DROP CONSTRAINT IF EXISTS hms_appointments_status_check;`)

        console.log("Adding updated constraint with 'arrived' status...")
        await prisma.$executeRawUnsafe(`
      ALTER TABLE hms_appointments 
      ADD CONSTRAINT hms_appointments_status_check 
      CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show', 'rescheduled', 'arrived', 'checked_in', 'in_progress'));
    `)

        console.log("Successfully updated hms_appointments_status_check constraint.")
    } catch (e) {
        console.error("Error updating constraint:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
