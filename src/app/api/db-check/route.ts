import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const url = process.env.DATABASE_URL || 'MISSING';
        const host = url.includes('@') ? url.split('@')[1].split('/')[0] : 'N/A';

        const userCount = await prisma.app_user.count();
        const latestUsers = await prisma.app_user.findMany({
            orderBy: { created_at: 'desc' },
            take: 5,
            select: { email: true, created_at: true }
        });

        const tenantCount = await prisma.tenant.count();
        const companyCount = await prisma.company.count();

        return NextResponse.json({
            success: true,
            host,
            userCount,
            latestUsers,
            tenantCount,
            companyCount,
            node_env: process.env.NODE_ENV
        });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
