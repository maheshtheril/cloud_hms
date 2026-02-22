import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const patients = await prisma.hms_patient.findMany({
        take: 5,
        select: {
            id: true,
            patient_number: true,
            first_name: true,
            metadata: true
        }
    })
    console.log(JSON.stringify(patients, null, 2))
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
