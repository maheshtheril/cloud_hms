import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const url = process.env.DATABASE_URL || 'MISSING';
        const host = url.includes('@') ? url.split('@')[1].split('/')[0] : 'N/A';

        const userCount = await prisma.app_user.count();
        const patientCount = await prisma.hms_patient.count();
        const latestUsers = await prisma.app_user.findMany({
            orderBy: { created_at: 'desc' },
            take: 5,
            select: { email: true, name: true, created_at: true, is_active: true }
        });

        const dbInfo: any = await prisma.$queryRaw`SELECT current_database(), current_schema()`;
        const roleCount = await prisma.role.count();

        return NextResponse.json({
            success: true,
            host,
            database: dbInfo[0].current_database,
            schema: dbInfo[0].current_schema,
            userCount,
            patientCount,
            roleCount,
            latestUsers,
            node_env: process.env.NODE_ENV
        });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
