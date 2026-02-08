
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        },
    },
})

console.log('Using DB URL:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@'))

async function main() {
    const email = 'gmh@gmail.com'
    const password = 'password123'

    const hashedPassword = await bcrypt.hash(password, 10)

    console.log(`Resetting password for ${email}...`)

    try {
        const user = await prisma.app_user.updateMany({
            where: { email: email },
            data: { password: hashedPassword }
        })

        console.log(`Updated ${user.count} user(s).`)
        console.log(`New Hash: ${hashedPassword}`)

        // Verify immediately
        const verify = await bcrypt.compare(password, hashedPassword)
        console.log(`Verification Check: ${verify}`)

    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
