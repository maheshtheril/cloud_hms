import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';


export async function GET(request: Request) {
    try {
        const users = await prisma.app_user.findMany({
            take: 10,
            orderBy: { created_at: 'desc' },
            select: { email: true, created_at: true, is_active: true }
        });
        const count = await prisma.app_user.count()

        return NextResponse.json({
            totalUsers: count,
            recentUsers: users,
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
