
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

        return NextResponse.json({
            status: 'success',
            dbCheck: {
                tenantCount,
                userCount,
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
