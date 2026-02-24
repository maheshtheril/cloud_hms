import { signup } from '@/app/actions/auth';
import { prisma as db } from '@/lib/prisma';
import crypto from 'node:crypto';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Need email' }, { status: 400 });
    }

    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', '12345678');
        formData.append('name', 'Test User');
        formData.append('companyName', 'Test Company');
        formData.append('modules', 'hms,crm');

        // PERFORM SIMPLE CREATE (NON-TRANSACTIONAL) TO TEST connectivity
        const tId = 'diag-' + crypto.randomBytes(4).toString('hex');
        const uId = 'user-' + crypto.randomBytes(4).toString('hex');

        // Create tenant first
        await db.tenant.create({
            data: { id: tId, name: 'Diag Tenant', slug: tId }
        });

        // Create user
        await db.app_user.create({
            data: {
                id: uId,
                tenant_id: tId,
                email: email.toLowerCase(),
                password: 'hashed_password', // bypass bcrypt for test
                name: 'Diag User',
                is_active: true
            }
        });

        const dbHost = process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || "Unknown";

        // VERIFY IMMEDIATELY
        const verifiedUser = await db.app_user.findFirst({
            where: { email: email.toLowerCase() },
            select: { id: true, email: true, created_at: true }
        });

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            message: 'Simple Signup executed (Non-transactional)',
            dbHost: dbHost,
            createdIds: { tId, uId },
            verifiedUser: verifiedUser
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
    }
}
