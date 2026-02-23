import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const users = await prisma.app_user.findMany({
            orderBy: { created_at: 'desc' },
            take: 10,
            select: {
                id: true,
                email: true,
                created_at: true,
                tenant_id: true,
                company_id: true,
                name: true
            }
        });

        return NextResponse.json({
            success: true,
            message: "Showing the latest 10 users registered in the database from all domains",
            databaseHost: process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1] : 'UNDEFINED',
            directDatabaseHost: process.env.DIRECT_DATABASE_URL ? process.env.DIRECT_DATABASE_URL.split('@')[1] : 'UNDEFINED',
            users
        });
    } catch (e) {
        return NextResponse.json({ success: false, error: (e as Error).message });
    }
}
