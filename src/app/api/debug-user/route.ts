
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const email = 'admin@saaserp.com';
        const user = await prisma.app_user.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } },
            select: { id: true, email: true, is_active: true, role: true }
        });

        const tenantCount = await prisma.tenant.count();
        const userCount = await prisma.app_user.count();
        const countryCount = await prisma.countries.count();
        const sampleCountries = await prisma.countries.findMany({
            take: 3,
            select: { id: true, name: true, iso2: true }
        });

        return NextResponse.json({
            status: 'success',
            dbCheck: {
                tenantCount,
                userCount,
                countryCount,
                sampleCountries,
                adminUser: user || 'NOT FOUND',
            },
            env: {
                hasDbUrl: !!process.env.DATABASE_URL
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { password } = await req.json();
        const email = 'admin@saaserp.com';

        const users = await prisma.$queryRaw`
            SELECT id, email, password
            FROM app_user
            WHERE LOWER(email) = ${email.toLowerCase()}
              AND is_active = true
              AND password = crypt(${password}, password)
        ` as any[];

        return NextResponse.json({
            success: users.length > 0,
            userFound: users.length > 0,
            email
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
