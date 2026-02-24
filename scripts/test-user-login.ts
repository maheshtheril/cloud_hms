import { prisma } from './src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
    const email = 'india@live.com'
    const user = await prisma.app_user.findFirst({
        where: { email: email.toLowerCase() }
    })

    if (!user) {
        console.log(`User ${email} NOT found in DB.`)
        // check total users
        const count = await prisma.app_user.count()
        console.log(`Total users in DB: ${count}`)
        return
    }

    console.log(`User found:`, user.id, user.email, user.is_active)

    const pwMatch = await bcrypt.compare('12345678', user.password || '')
    console.log(`Password match test (assuming 12345678):`, pwMatch)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
