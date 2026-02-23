import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const rawInfo = await prisma.$queryRaw`SELECT current_database(), current_schema(), current_user, version()`;

        const users = await prisma.app_user.findMany({
            orderBy: { created_at: 'desc' },
            take: 10,
            select: { id: true, email: true, created_at: true }
        });

        return NextResponse.json({
            success: true,
            databaseHost: process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1] : 'UNDEFINED',
            pgContext: rawInfo,
            users
        });
    } catch (e) {
        return NextResponse.json({ success: false, error: (e as Error).message });
    }
}
