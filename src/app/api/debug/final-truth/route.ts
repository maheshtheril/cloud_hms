import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'node:crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
    const tId = crypto.randomUUID();
    const uId = crypto.randomUUID();
    const email = `diag-${tId.slice(0, 8)}@test.com`;

    try {
        // Create
        await prisma.tenant.create({
            data: { id: tId, name: 'Diag Tenant', slug: tId }
        });

        await prisma.app_user.create({
            data: {
                id: uId,
                tenant_id: tId,
                email: email,
                password: 'hashed_password',
                name: 'Diag User',
                is_active: true
            }
        });

        // Read back
        const verifiedUser = await prisma.app_user.findUnique({
            where: { id: uId }
        });

        const dbHost = process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || "Unknown";

        return NextResponse.json({
            status: "SUCCESS",
            dbHost: dbHost,
            created: { tId, uId, email },
            verified: verifiedUser
        });
    } catch (e: any) {
        return NextResponse.json({ status: "ERROR", error: e.message, stack: e.stack });
    }
}
