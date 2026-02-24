import { NextResponse } from 'next/server';
import { signup } from '@/app/actions/auth';
import { prisma } from '@/lib/prisma';
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

        const result = await signup(null, formData);
        const dbHost = process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || "Unknown";

        // VERIFY IMMEDIATELY
        const verifiedUser = await prisma.app_user.findFirst({
            where: { email: email.toLowerCase() },
            select: { id: true, email: true, created_at: true }
        });

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            message: 'Signup executed',
            dbHost: dbHost,
            result: result,
            verifiedUser: verifiedUser
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
    }
}
